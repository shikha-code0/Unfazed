require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Therapist = require('./models/Therapist');

const seedTherapist = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unfazed';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log('[Seed] Connected to MongoDB...');

    // Remove existing seed therapist if exists
    await Therapist.deleteOne({ email: 'ananya@unfazed.care' });

    const passwordHash = await bcrypt.hash('Password123!', 10);

    const drAnanya = await Therapist.create({
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
    });

    console.log('[Seed Success] Created sample therapist profile in MongoDB:');
    console.log(`- Name: ${drAnanya.name}`);
    console.log(`- Email: ${drAnanya.email}`);
    console.log(`- Slug: ${drAnanya.slug}`);
    console.log(`- Login Password: Password123!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(`[Seed Notice] MongoDB not reachable at ${mongoUri} (${error.message}).`);
    console.log('[Seed Notice] Built-in in-memory datastore has Dr. Ananya Sharma automatically seeded:');
    console.log('- Name: Dr. Ananya Sharma');
    console.log('- Email: ananya@unfazed.care');
    console.log('- Slug: dr-ananya-sharma');
    console.log('- Login Password: Password123!');
    process.exit(0);
  }
};

seedTherapist();
