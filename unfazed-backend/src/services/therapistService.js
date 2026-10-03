const Therapist = require('../models/Therapist');

class TherapistService {
  static async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    return await Therapist.findOne({ email: cleanEmail });
  }

  static async findById(id) {
    return await Therapist.findById(id).select('-passwordHash');
  }

  static async findBySlug(slug) {
    const cleanSlug = slug.toLowerCase().trim();
    return await Therapist.findOne({ slug: cleanSlug }).select('-passwordHash -email');
  }

  static async checkSlugExists(slug) {
    return Boolean(await Therapist.findOne({ slug }));
  }

  static async create(data) {
    return await Therapist.create(data);
  }

  static async update(id, updates) {
    const therapist = await Therapist.findById(id);
    if (!therapist) return null;
    Object.assign(therapist, updates);
    return await therapist.save();
  }
}

module.exports = TherapistService;
