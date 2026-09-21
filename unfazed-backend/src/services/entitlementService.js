const Therapist = require('../models/Therapist');
const Client = require('../models/Client');

// Define feature flags/limits per tier
const TIERS = {
  Free: {
    maxClients: 5,
    hasNotes: false,
    hasInvoicing: false,
    hasChat: false,
  },
  Pro: {
    maxClients: Infinity,
    hasNotes: true,
    hasInvoicing: true,
    hasChat: true,
  },
  Clinic: {
    maxClients: Infinity,
    hasNotes: true,
    hasInvoicing: true,
    hasChat: true,
  }
};

class EntitlementService {
  
  static async checkFeatureAccess(therapistId, featureName) {
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) return false;

    const tier = therapist.subscriptionTier || 'Free';
    const entitlements = TIERS[tier];

    if (!entitlements) return false;

    return !!entitlements[featureName];
  }

  static async canAddClient(therapistId) {
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) return false;

    const tier = therapist.subscriptionTier || 'Free';
    const limit = TIERS[tier].maxClients;

    if (limit === Infinity) return true;

    const currentClients = await Client.countDocuments({ therapistId, status: 'active' });
    return currentClients < limit;
  }
}

module.exports = EntitlementService;
