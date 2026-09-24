const Client = require('../models/Client');
const Consent = require('../models/Consent');
const Session = require('../models/Session');
const EntitlementService = require('../services/entitlementService');

const CLIENT_STATUSES = ['active', 'inactive', 'discharged', 'waitlisted'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENT_CONSENT_VERSION = '1.0';

const INTAKE_FIELDS = [
  'fullName',
  'dateOfBirth',
  'pronouns',
  'phone',
  'email',
  'emergencyContact',
  'presentingConcern',
  'medicalHistory',
  'medications',
  'previousTherapy',
  'goals',
  'communicationMethod',
];

const pick = (obj, keys) => {
  const out = {};
  keys.forEach((key) => {
    if (obj[key] !== undefined) out[key] = obj[key];
  });
  return out;
};

const isFilled = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim() !== '';
};

const intakeCompletion = (intakeData = {}) => {
  const filled = INTAKE_FIELDS.filter((field) => isFilled(intakeData[field])).length;
  return Math.round((filled / INTAKE_FIELDS.length) * 100);
};

const hasAcceptedConsent = (client, consent) => {
  if (consent && consent.accepted) return true;
  return Boolean(client?.consent?.given);
};

const attachSessionSummary = async (therapistId, clients) => {
  const ids = clients.map((c) => c._id);
  if (!ids.length) return clients;

  const now = new Date();
  const sessions = await Session.find({
    therapistId,
    clientId: { $in: ids },
  })
    .sort({ startTime: 1 })
    .select('clientId startTime endTime status serviceType sessionMode paymentStatus')
    .lean();

  const byClient = {};
  sessions.forEach((session) => {
    const key = String(session.clientId);
    if (!byClient[key]) byClient[key] = [];
    byClient[key].push(session);
  });

  return clients.map((client) => {
    const list = byClient[String(client._id)] || [];
    const upcoming = list.filter(
      (s) => s.startTime >= now && !['cancelled', 'no_show'].includes(s.status)
    );
    const past = list.filter((s) => s.startTime < now && s.status !== 'cancelled');
    const lastSession = past.length ? past[past.length - 1] : null;
    const nextSession = upcoming[0] || null;
    const paidCount = list.filter((s) => s.paymentStatus === 'paid').length;

    return {
      ...client,
      lastSession,
      nextSession,
      sessionSummary: {
        total: list.length,
        upcoming: upcoming.length,
        completed: list.filter((s) => s.status === 'completed').length,
        paid: paidCount,
      },
    };
  });
};

const validateClientPayload = (body, { partial = false } = {}) => {
  const errors = [];
  if (!partial || body.name !== undefined) {
    if (!isFilled(body.name) || String(body.name).trim().length < 2) {
      errors.push({ field: 'name', message: 'Name is required (min 2 characters).' });
    }
  }
  if (!partial || body.email !== undefined) {
    const email = String(body.email || '').toLowerCase().trim();
    if (!email || !EMAIL_RE.test(email)) {
      errors.push({ field: 'email', message: 'A valid email is required.' });
    }
  }
  if (body.status !== undefined && !CLIENT_STATUSES.includes(body.status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${CLIENT_STATUSES.join(', ')}.` });
  }
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push({ field: 'tags', message: 'Tags must be an array of strings.' });
  }
  return errors;
};

const normalizeClientInput = (body) => {
  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : typeof body.tags === 'string'
      ? body.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : undefined;

  return {
    name: body.name?.trim(),
    email: body.email?.toLowerCase().trim(),
    phone: body.phone?.trim(),
    dateOfBirth: body.dateOfBirth || undefined,
    pronouns: body.pronouns?.trim(),
    address: body.address?.trim(),
    tags,
    status: body.status,
  };
};

// @desc    Get all clients for logged-in therapist
// @route   GET /api/clients
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ therapistId: req.therapist._id })
      .select('-intakeData')
      .sort({ createdAt: -1 })
      .lean();

    const data = await attachSessionSummary(req.therapist._id, clients);
    res.json({ success: true, data, clients: data });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client
// @route   POST /api/clients
const createClient = async (req, res, next) => {
  try {
    const errors = validateClientPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const canAdd = await EntitlementService.canAddClient(req.therapist._id);
    if (!canAdd) {
      return res.status(403).json({
        success: false,
        message: 'Client limit reached for your subscription tier',
      });
    }

    const payload = normalizeClientInput(req.body);
    const existing = await Client.findOne({
      therapistId: req.therapist._id,
      email: payload.email,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A client with this email already exists.',
      });
    }

    const client = await Client.create({
      therapistId: req.therapist._id,
      ...payload,
    });

    res.status(201).json({ success: true, data: client, client });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:clientId
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      therapistId: req.therapist._id,
    }).lean();

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const [enriched] = await attachSessionSummary(req.therapist._id, [client]);
    const consent = await Consent.findOne({
      clientId: client._id,
      therapistId: req.therapist._id,
      accepted: true,
    }).sort({ acceptedAt: -1 });

    const data = {
      ...enriched,
      intakeCompletion: intakeCompletion(client.intakeData),
      consentRecord: consent || null,
    };

    res.json({ success: true, data, client: data });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PATCH /api/clients/:clientId
const updateClient = async (req, res, next) => {
  try {
    const errors = validateClientPayload(req.body, { partial: true });
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const payload = normalizeClientInput(req.body);
    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

    if (payload.email) {
      const clash = await Client.findOne({
        therapistId: req.therapist._id,
        email: payload.email,
        _id: { $ne: req.params.clientId },
      });
      if (clash) {
        return res.status(409).json({
          success: false,
          message: 'A client with this email already exists.',
        });
      }
    }

    const client = await Client.findOneAndUpdate(
      { _id: req.params.clientId, therapistId: req.therapist._id },
      payload,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.json({ success: true, data: client, client });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:clientId
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.clientId,
      therapistId: req.therapist._id,
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    await Consent.deleteMany({ clientId: client._id, therapistId: req.therapist._id });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client intake data
// @route   GET /api/clients/:clientId/intake
const getClientIntake = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      therapistId: req.therapist._id,
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const intake = client.intakeData || {};
    res.json({
      success: true,
      data: {
        ...intake,
        fullName: intake.fullName || client.name,
        dateOfBirth: intake.dateOfBirth || client.dateOfBirth,
        pronouns: intake.pronouns || client.pronouns,
        phone: intake.phone || client.phone,
        email: intake.email || client.email,
        status: intake.status || 'draft',
        completion: intakeCompletion({
          ...intake,
          fullName: intake.fullName || client.name,
          dateOfBirth: intake.dateOfBirth || client.dateOfBirth,
          pronouns: intake.pronouns || client.pronouns,
          phone: intake.phone || client.phone,
          email: intake.email || client.email,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client intake data
// @route   PUT /api/clients/:clientId/intake
const updateClientIntake = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      therapistId: req.therapist._id,
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const incoming = pick(req.body, [...INTAKE_FIELDS, 'status']);
    const complete = incoming.status === 'complete' || req.body.complete === true;

    if (complete) {
      const consent = await Consent.findOne({
        clientId: client._id,
        therapistId: req.therapist._id,
        accepted: true,
      });
      if (!hasAcceptedConsent(client, consent)) {
        return res.status(400).json({
          success: false,
          message: 'Consent must be accepted before intake can be completed.',
        });
      }

      const missing = INTAKE_FIELDS.filter((field) => !isFilled(incoming[field] ?? client.intakeData?.[field]));
      if (missing.length) {
        return res.status(400).json({
          success: false,
          message: 'All intake fields are required to complete intake.',
          errors: missing.map((field) => ({ field, message: 'This field is required.' })),
        });
      }
    }

    const intakeData = {
      ...(client.intakeData || {}),
      ...incoming,
      status: complete ? 'complete' : incoming.status || 'draft',
      completedAt: complete ? new Date() : client.intakeData?.completedAt || null,
    };

    const profileUpdates = {};
    if (incoming.fullName) profileUpdates.name = incoming.fullName.trim();
    if (incoming.email) profileUpdates.email = incoming.email.toLowerCase().trim();
    if (incoming.phone) profileUpdates.phone = incoming.phone.trim();
    if (incoming.pronouns) profileUpdates.pronouns = incoming.pronouns.trim();
    if (incoming.dateOfBirth) profileUpdates.dateOfBirth = incoming.dateOfBirth;

    client.intakeData = intakeData;
    Object.assign(client, profileUpdates);
    await client.save();

    res.json({
      success: true,
      data: {
        ...client.intakeData,
        completion: intakeCompletion(client.intakeData),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client consent
// @route   GET /api/clients/:clientId/consent
const getClientConsent = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      therapistId: req.therapist._id,
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const consent = await Consent.findOne({
      clientId: req.params.clientId,
      therapistId: req.therapist._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: consent || {
        accepted: Boolean(client.consent?.given),
        consentVersion: client.consent?.version || CURRENT_CONSENT_VERSION,
        acceptedAt: client.consent?.timestamp || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create client consent
// @route   POST /api/clients/:clientId/consent
const createClientConsent = async (req, res, next) => {
  try {
    const { consentVersion = CURRENT_CONSENT_VERSION, accepted, signature } = req.body;

    const client = await Client.findOne({
      _id: req.params.clientId,
      therapistId: req.therapist._id,
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (!accepted) {
      return res.status(400).json({
        success: false,
        message: 'Consent must be accepted to create a record.',
      });
    }

    if (!isFilled(signature) || signature.trim().toLowerCase() !== client.name.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Full name confirmation must match the client name.',
      });
    }

    const existing = await Consent.findOne({
      clientId: client._id,
      therapistId: req.therapist._id,
      consentVersion,
      accepted: true,
    });
    if (existing) {
      return res.json({ success: true, data: existing });
    }

    const ipAddress =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      '';

    const consent = await Consent.create({
      clientId: client._id,
      therapistId: req.therapist._id,
      consentVersion,
      accepted: true,
      acceptedAt: new Date(),
      ipAddress,
    });

    client.consent = {
      given: true,
      timestamp: consent.acceptedAt,
      version: consentVersion,
      ipAddress,
    };
    await client.save();

    res.status(201).json({ success: true, data: consent });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  getClientIntake,
  updateClientIntake,
  getClientConsent,
  createClientConsent,
};
