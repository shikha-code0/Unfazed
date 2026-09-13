const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Therapist = require('../models/Therapist');

// In-memory fallback database when local MongoDB is not running
const inMemoryStore = new Map();

// Initialize with Dr. Ananya Sharma
const initInMemory = async () => {
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const sample = {
    _id: 'sample_therapist_001',
    name: 'Dr. Ananya Sharma',
    email: 'ananya@unfazed.care',
    passwordHash,
    slug: 'dr-ananya-sharma',
    bio: 'A safe space to understand yourself, heal at your own pace, and move forward. My approach is warm, collaborative, and grounded in evidence-based care. Together, we will make space for the concerns that matter most to you.',
    specializations: ['Anxiety', 'Relationships', 'Burnout', 'Trauma & PTSD', 'Self-Esteem'],
    languages: ['English', 'Hindi'],
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    consultationFee: 1500,
    sessionDuration: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  inMemoryStore.set(sample.email, sample);
  inMemoryStore.set(sample._id, sample);
  inMemoryStore.set(sample.slug, sample);
};

initInMemory();

const isDbConnected = () => mongoose.connection.readyState === 1;

class TherapistService {
  static async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isDbConnected()) {
      return await Therapist.findOne({ email: cleanEmail });
    }
    return inMemoryStore.get(cleanEmail) || null;
  }

  static async findById(id) {
    if (isDbConnected()) {
      return await Therapist.findById(id).select('-passwordHash');
    }
    const item = inMemoryStore.get(id);
    if (!item) return null;
    const copy = { ...item };
    delete copy.passwordHash;
    return copy;
  }

  static async findBySlug(slug) {
    const cleanSlug = slug.toLowerCase().trim();
    if (isDbConnected()) {
      return await Therapist.findOne({ slug: cleanSlug }).select('-passwordHash -email');
    }
    const item = inMemoryStore.get(cleanSlug);
    if (!item) return null;
    const copy = { ...item };
    delete copy.passwordHash;
    delete copy.email;
    return copy;
  }

  static async checkSlugExists(slug) {
    if (isDbConnected()) {
      return Boolean(await Therapist.findOne({ slug }));
    }
    return inMemoryStore.has(slug);
  }

  static async create(data) {
    if (isDbConnected()) {
      return await Therapist.create(data);
    }
    const id = 'th_' + Math.random().toString(36).substr(2, 9);
    const newDoc = {
      _id: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryStore.set(data.email, newDoc);
    inMemoryStore.set(id, newDoc);
    inMemoryStore.set(data.slug, newDoc);
    return newDoc;
  }

  static async update(id, updates) {
    if (isDbConnected()) {
      const therapist = await Therapist.findById(id);
      if (!therapist) return null;
      Object.assign(therapist, updates);
      return await therapist.save();
    }
    const existing = inMemoryStore.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    inMemoryStore.set(existing.email, updated);
    inMemoryStore.set(id, updated);
    inMemoryStore.set(existing.slug, updated);
    return updated;
  }
}

module.exports = TherapistService;
