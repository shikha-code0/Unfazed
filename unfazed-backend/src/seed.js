require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Therapist = require('./models/Therapist');
const Availability = require('./models/Availability');
const Session = require('./models/Session');
const Client = require('./models/Client');
const Consent = require('./models/Consent');
const moment = require('moment-timezone');

const SEED_EMAIL = 'ananya@unfazed.care';

const weeklySchedule = [
  { dayOfWeek: 0, enabled: false, periods: [] },
  { dayOfWeek: 1, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] },
  { dayOfWeek: 2, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] },
  { dayOfWeek: 3, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] },
  { dayOfWeek: 4, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] },
  { dayOfWeek: 5, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] },
  { dayOfWeek: 6, enabled: true, periods: [{ startTime: '10:00', endTime: '14:00' }] },
];

const clientSeed = [
  { name: 'Priya Kumar', email: 'priya@example.com', phone: '+91-9876543210', status: 'active', tags: ['Anxiety', 'Student'], pronouns: 'She/Her', dob: '1998-04-12', address: 'Indiranagar, Bengaluru', intake: 'complete', consent: true },
  { name: 'Rohan Desai', email: 'rohan@example.com', phone: '+91-9876543211', status: 'active', tags: ['Couples Therapy'], pronouns: 'He/Him', dob: '1989-09-03', address: 'Koramangala, Bengaluru', intake: 'complete', consent: true },
  { name: 'Arjun Malhotra', email: 'arjun@example.com', phone: '+91-9876543212', status: 'active', tags: ['Depression'], pronouns: 'He/Him', dob: '1992-01-21', address: 'Whitefield, Bengaluru', intake: 'complete', consent: true },
  { name: 'Neha Singh', email: 'neha@example.com', phone: '+91-9876543213', status: 'inactive', tags: ['Burnout'], pronouns: 'She/Her', dob: '1995-07-18', address: 'Pune', intake: 'draft', consent: false },
  { name: 'Vikram Patel', email: 'vikram@example.com', phone: '+91-9876543214', status: 'active', tags: ['Couples Therapy', 'Stress'], pronouns: 'He/Him', dob: '1986-11-09', address: 'Ahmedabad', intake: 'complete', consent: true },
  { name: 'Aisha Khan', email: 'aisha@example.com', phone: '+91-9876543215', status: 'waitlisted', tags: ['Anxiety'], pronouns: 'She/Her', dob: '1999-02-14', address: 'Hyderabad', intake: 'draft', consent: false },
  { name: 'Raj Sharma', email: 'raj@example.com', phone: '+91-9876543216', status: 'active', tags: ['Anxiety'], pronouns: 'He/Him', dob: '1991-05-30', address: 'Delhi', intake: 'complete', consent: true },
  { name: 'Simran Kaur', email: 'simran@example.com', phone: '+91-9876543217', status: 'active', tags: ['Trauma'], pronouns: 'She/Her', dob: '1994-12-02', address: 'Chandigarh', intake: 'complete', consent: true },
  { name: 'Divya Nair', email: 'divya@example.com', phone: '+91-9876543218', status: 'active', tags: ['Student'], pronouns: 'She/Her', dob: '2001-08-22', address: 'Kochi', intake: 'complete', consent: true },
  { name: 'Varun Rao', email: 'varun@example.com', phone: '+91-9876543219', status: 'discharged', tags: ['Couples Therapy'], pronouns: 'He/Him', dob: '1984-03-11', address: 'Mysuru', intake: 'complete', consent: true },
  { name: 'Anita Gupta', email: 'anita@example.com', phone: '+91-9876543220', status: 'inactive', tags: [], pronouns: 'She/Her', dob: '1978-06-25', address: 'Jaipur', intake: 'none', consent: false },
  { name: 'Karan Mehra', email: 'karan@example.com', phone: '+91-9876543221', status: 'active', tags: ['Stress'], pronouns: 'He/Him', dob: '1993-10-07', address: 'Mumbai', intake: 'complete', consent: true },
  { name: 'Suresh Iyer', email: 'suresh@example.com', phone: '+91-9876543222', status: 'inactive', tags: ['Trauma'], pronouns: 'He/Him', dob: '1972-09-19', address: 'Chennai', intake: 'draft', consent: true },
  { name: 'Maya Menon', email: 'maya@example.com', phone: '+91-9876543223', status: 'active', tags: ['Anxiety'], pronouns: 'She/Her', dob: '1997-01-05', address: 'Bengaluru', intake: 'complete', consent: true },
  { name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91-9876543224', status: 'waitlisted', tags: ['Student'], pronouns: 'He/Him', dob: '2000-04-28', address: 'Noida', intake: 'none', consent: false },
];

const buildIntake = (c) => {
  if (c.intake === 'none') return {};
  const base = {
    fullName: c.name,
    dateOfBirth: c.dob,
    pronouns: c.pronouns,
    phone: c.phone,
    email: c.email,
    emergencyContact: c.intake === 'complete' ? `Emergency for ${c.name.split(' ')[0]} · +91-9800000000` : '',
    presentingConcern: c.intake === 'complete' ? 'Ongoing stress, sleep disruption, and difficulty concentrating at work.' : 'Initial consult requested.',
    medicalHistory: c.intake === 'complete' ? 'No major medical conditions reported.' : '',
    medications: c.intake === 'complete' ? 'None currently.' : '',
    previousTherapy: c.intake === 'complete' ? 'Short-term counselling 3 years ago.' : '',
    goals: c.intake === 'complete' ? 'Build coping skills and reduce weekly anxiety.' : '',
    communicationMethod: 'Email',
    status: c.intake === 'complete' ? 'complete' : 'draft',
  };
  if (c.intake === 'complete') base.completedAt = new Date('2026-01-15T10:00:00.000Z');
  return base;
};

const seedData = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unfazed';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Seed] Connected to MongoDB...');

    const passwordHash = await bcrypt.hash('Password123!', 10);
    const therapistFields = {
      name: 'Dr. Ananya Sharma',
      email: SEED_EMAIL,
      slug: 'dr-ananya-sharma',
      title: 'Clinical Psychologist',
      bio: 'A safe space to understand yourself, heal at your own pace, and move forward. My approach is warm, collaborative, and grounded in evidence-based care. Together, we will make space for the concerns that matter most to you.',
      specializations: ['Anxiety & Depression', 'Trauma & PTSD', 'Relationship Issues'],
      languages: ['English', 'Hindi', 'Kannada'],
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      consultationFee: 2500,
      sessionDuration: 50,
      subscriptionTier: 'Pro',
    };

    let therapist = await Therapist.findOne({ email: SEED_EMAIL });
    if (therapist) {
      Object.assign(therapist, therapistFields);
      await therapist.save();
      console.log('[Seed] Reused existing therapist ID:', therapist._id.toString());
    } else {
      therapist = await Therapist.create({ ...therapistFields, passwordHash });
      console.log('[Seed] Created therapist profile...');
    }

    const availabilityFields = {
      timezone: 'Asia/Kolkata',
      weeklySchedule,
      slotDuration: 50,
      bufferMinutes: 10,
      blockedDates: [],
      isPublished: true,
    };
    const existingAvailability = await Availability.findOne({ therapistId: therapist._id });
    if (existingAvailability) {
      Object.assign(existingAvailability, availabilityFields);
      await existingAvailability.save();
    } else {
      await Availability.create({ therapistId: therapist._id, ...availabilityFields, dateOverrides: new Map() });
    }
    console.log('[Seed] Availability upserted...');

    const duplicateGroups = await Client.aggregate([
      { $match: { therapistId: therapist._id } },
      { $group: { _id: '$email', ids: { $push: '$_id' }, n: { $sum: 1 } } },
      { $match: { n: { $gt: 1 } } },
    ]);
    for (const group of duplicateGroups) {
      const [, ...extras] = group.ids;
      if (extras.length) {
        await Client.deleteMany({ _id: { $in: extras } });
        await Consent.deleteMany({ clientId: { $in: extras } });
      }
    }

    try {
      await Client.syncIndexes();
    } catch (indexErr) {
      console.log('[Seed] Index sync notice:', indexErr.message);
    }

    const insertedClients = [];
    for (const c of clientSeed) {
      const intakeData = buildIntake(c);
      const consentSummary = c.consent
        ? { given: true, timestamp: new Date('2026-01-10T09:00:00.000Z'), version: '1.0', ipAddress: '127.0.0.1' }
        : { given: false };

      const client = await Client.findOneAndUpdate(
        { therapistId: therapist._id, email: c.email },
        {
          $set: {
            name: c.name,
            phone: c.phone,
            status: c.status,
            tags: c.tags,
            dateOfBirth: new Date(c.dob),
            pronouns: c.pronouns,
            address: c.address,
            intakeData,
            consent: consentSummary,
          },
          $setOnInsert: {
            therapistId: therapist._id,
            email: c.email,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      if (c.consent) {
        await Consent.findOneAndUpdate(
          { clientId: client._id, therapistId: therapist._id, consentVersion: '1.0' },
          {
            $set: {
              accepted: true,
              acceptedAt: new Date('2026-01-10T09:00:00.000Z'),
              ipAddress: '127.0.0.1',
            },
            $setOnInsert: {
              clientId: client._id,
              therapistId: therapist._id,
              consentVersion: '1.0',
            },
          },
          { upsert: true, new: true }
        );
      }

      insertedClients.push(client);
    }
    console.log(`[Seed] Upserted ${insertedClients.length} clients (idempotent by email)...`);

    const makeDate = (days, hour, minute) =>
      moment().tz('Asia/Kolkata').add(days, 'days').startOf('day').hour(hour).minute(minute).utc().toDate();
    const makePastDate = (days, hour, minute) =>
      moment().tz('Asia/Kolkata').subtract(days, 'days').startOf('day').hour(hour).minute(minute).utc().toDate();

    const planned = [
      { i: 0, serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makeDate(1, 10, 0), endTime: makeDate(1, 10, 50), status: 'confirmed', paymentStatus: 'pending' },
      { i: 1, serviceType: 'Couples Therapy', sessionMode: 'In-person', startTime: makeDate(1, 11, 0), endTime: makeDate(1, 11, 50), status: 'confirmed', paymentStatus: 'paid' },
      { i: 2, serviceType: 'Initial Consultation', sessionMode: 'Online', startTime: makeDate(2, 15, 0), endTime: makeDate(2, 15, 50), status: 'pending', paymentStatus: 'pending' },
      { i: 3, serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makeDate(3, 16, 0), endTime: makeDate(3, 16, 50), status: 'confirmed', paymentStatus: 'pending' },
      { i: 4, serviceType: 'Couples Therapy', sessionMode: 'In-person', startTime: makeDate(4, 10, 30), endTime: makeDate(4, 11, 20), status: 'confirmed', paymentStatus: 'paid' },
      { i: 5, serviceType: 'Initial Consultation', sessionMode: 'Online', startTime: makeDate(6, 11, 0), endTime: makeDate(6, 11, 50), status: 'confirmed', paymentStatus: 'pending' },
      { i: 6, serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makeDate(8, 16, 0), endTime: makeDate(8, 16, 50), status: 'confirmed', paymentStatus: 'pending' },
      { i: 7, serviceType: 'Individual Therapy', sessionMode: 'In-person', startTime: makeDate(9, 10, 0), endTime: makeDate(9, 10, 50), status: 'confirmed', paymentStatus: 'paid' },
      { i: 8, serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makePastDate(2, 15, 30), endTime: makePastDate(2, 16, 20), status: 'completed', paymentStatus: 'paid' },
      { i: 9, serviceType: 'Couples Therapy', sessionMode: 'In-person', startTime: makePastDate(4, 11, 0), endTime: makePastDate(4, 11, 50), status: 'completed', paymentStatus: 'paid' },
      { i: 10, serviceType: 'Initial Consultation', sessionMode: 'Online', startTime: makePastDate(7, 10, 0), endTime: makePastDate(7, 10, 50), status: 'completed', paymentStatus: 'paid' },
      { i: 11, serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makePastDate(10, 16, 0), endTime: makePastDate(10, 16, 50), status: 'completed', paymentStatus: 'paid' },
      { i: 12, serviceType: 'Individual Therapy', sessionMode: 'In-person', startTime: makeDate(5, 16, 0), endTime: makeDate(5, 16, 50), status: 'cancelled', paymentStatus: 'pending', notes: 'Client requested reschedule' },
    ];

    let createdSessions = 0;
    let linkedSessions = 0;
    for (const plan of planned) {
      const client = insertedClients[plan.i];
      const existing = await Session.findOne({
        therapistId: therapist._id,
        $or: [{ clientId: client._id }, { clientEmail: client.email }],
        status: plan.status,
        serviceType: plan.serviceType,
      });

      if (existing) {
        if (!existing.clientId) {
          existing.clientId = client._id;
          await existing.save();
        }
        linkedSessions += 1;
        continue;
      }

      await Session.create({
        therapistId: therapist._id,
        clientId: client._id,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        timezone: 'Asia/Kolkata',
        consentGiven: Boolean(client.consent?.given),
        serviceType: plan.serviceType,
        sessionMode: plan.sessionMode,
        startTime: plan.startTime,
        endTime: plan.endTime,
        status: plan.status,
        paymentStatus: plan.paymentStatus,
        notes: plan.notes,
      });
      createdSessions += 1;
    }

    console.log(`[Seed] Sessions: ${createdSessions} created, ${linkedSessions} reused/linked.`);
    console.log(`[Seed] Sessions: ${createdSessions} created, ${linkedSessions} reused/linked.`);

    const Payment = require('./models/Payment');
    const Note = require('./models/Note');

    // Seed Notes and Payments
    let createdNotes = 0;
    let createdPayments = 0;

    for (const client of insertedClients) {
      if (client.status === 'active' || client.status === 'discharged') {
        const existingNotes = await Note.countDocuments({ clientId: client._id });
        if (existingNotes === 0) {
          await Note.create({
            therapistId: therapist._id,
            clientId: client._id,
            type: 'intake',
            content: `Initial intake note for ${client.name}. Client presents with symptoms related to ${client.tags.join(', ')}. Discussed therapy goals and established rapport.`,
            createdAt: makePastDate(15, 10, 0),
          });
          await Note.create({
            therapistId: therapist._id,
            clientId: client._id,
            type: 'progress',
            content: `Progress note for ${client.name}. Client reported feeling slightly better this week. We explored coping mechanisms and assigned a journaling exercise.`,
            createdAt: makePastDate(7, 10, 0),
          });
          createdNotes += 2;
        }

        const existingPayments = await Payment.countDocuments({ clientId: client._id });
        if (existingPayments === 0) {
           await Payment.create({
            therapistId: therapist._id,
            clientId: client._id,
            amount: therapist.consultationFee,
            currency: 'INR',
            status: 'paid',
            method: 'upi',
            receiptUrl: '',
            createdAt: makePastDate(15, 10, 30),
          });
          await Payment.create({
            therapistId: therapist._id,
            clientId: client._id,
            amount: therapist.consultationFee,
            currency: 'INR',
            status: 'paid',
            method: 'card',
            receiptUrl: '',
            createdAt: makePastDate(7, 10, 30),
          });
           await Payment.create({
            therapistId: therapist._id,
            clientId: client._id,
            amount: therapist.consultationFee,
            currency: 'INR',
            status: 'pending',
            method: 'transfer',
            receiptUrl: '',
            createdAt: makeDate(1, 10, 30), // Future / pending
          });
          createdPayments += 3;
        }
      }
    }

    console.log(`[Seed] Notes: ${createdNotes} created.`);
    console.log(`[Seed] Payments: ${createdPayments} created.`);

    console.log('\n[Seed Success] Database seeded successfully!');
    console.log(`- Therapist: Dr. Ananya Sharma (${SEED_EMAIL}) / Password123!`);
    console.log(`- ${insertedClients.length} CRM clients upserted`);
    console.log('- Mixed intake (complete/draft/none) and consent records');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(`[Seed Notice] MongoDB not reachable at ${mongoUri} (${error.message}).`);
    process.exit(0);
  }
};

seedData();
