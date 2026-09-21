require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Therapist = require('./models/Therapist');
const Availability = require('./models/Availability');
const Session = require('./models/Session');
const Client = require('./models/Client');
const Consent = require('./models/Consent');
const moment = require('moment-timezone');

const seedData = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unfazed';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Seed] Connected to MongoDB...');

    // Remove existing seed data for this therapist
    await Therapist.deleteOne({ email: 'ananya@unfazed.care' });
    await Availability.deleteOne({ email: 'ananya@unfazed.care' }); // Though email is not there, it'll just fail silently
    const therapistForDelete = await Therapist.findOne({ email: 'ananya@unfazed.care' });
    if (therapistForDelete) {
      await Availability.deleteMany({ therapistId: therapistForDelete._id });
      await Session.deleteMany({ therapistId: therapistForDelete._id });
      await Client.deleteMany({ therapistId: therapistForDelete._id });
      await Consent.deleteMany({ therapistId: therapistForDelete._id });
    } else {
      // Clear all just in case
      await Availability.deleteMany({});
      await Session.deleteMany({});
      await Client.deleteMany({});
      await Consent.deleteMany({});
    }

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // Create therapist
    const drAnanya = await Therapist.create({
      name: 'Dr. Ananya Sharma',
      email: 'ananya@unfazed.care',
      passwordHash,
      slug: 'dr-ananya-sharma',
      title: 'Clinical Psychologist',
      bio: 'A safe space to understand yourself, heal at your own pace, and move forward. My approach is warm, collaborative, and grounded in evidence-based care. Together, we will make space for the concerns that matter most to you.',
      specializations: ['Anxiety & Depression', 'Trauma & PTSD', 'Relationship Issues'],
      languages: ['English', 'Hindi', 'Kannada'],
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      consultationFee: 2500,
      sessionDuration: 50,
    });

    console.log('[Seed] Created therapist profile...');

    // Create availability
    const weeklySchedule = [
      { dayOfWeek: 0, enabled: false, periods: [] }, // Sunday
      { dayOfWeek: 1, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Monday
      { dayOfWeek: 2, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Tuesday
      { dayOfWeek: 3, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Wednesday
      { dayOfWeek: 4, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Thursday
      { dayOfWeek: 5, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Friday
      { dayOfWeek: 6, enabled: true, periods: [{ startTime: '10:00', endTime: '14:00' }] }, // Saturday
    ];

    const availability = await Availability.create({
      therapistId: drAnanya._id,
      timezone: 'Asia/Kolkata',
      weeklySchedule,
      slotDuration: 50,
      bufferMinutes: 10,
      blockedDates: [],
      dateOverrides: new Map(),
      isPublished: true,
    });

    console.log('[Seed] Created availability settings...');

    // Create 15 clients
    const clientData = [
      { name: 'Priya Kumar', email: 'priya@example.com', phone: '+91-9876543210', status: 'active', tags: ['Anxiety', 'Student'] },
      { name: 'Rohan Desai', email: 'rohan@example.com', phone: '+91-9876543211', status: 'active', tags: ['Couples Therapy'] },
      { name: 'Arjun Malhotra', email: 'arjun@example.com', phone: '+91-9876543212', status: 'active', tags: ['Depression'] },
      { name: 'Neha Singh', email: 'neha@example.com', phone: '+91-9876543213', status: 'inactive', tags: [] },
      { name: 'Vikram Patel', email: 'vikram@example.com', phone: '+91-9876543214', status: 'active', tags: ['Couples Therapy', 'Stress'] },
      { name: 'Aisha Khan', email: 'aisha@example.com', phone: '+91-9876543215', status: 'waitlisted', tags: [] },
      { name: 'Raj Sharma', email: 'raj@example.com', phone: '+91-9876543216', status: 'active', tags: ['Anxiety'] },
      { name: 'Simran Kaur', email: 'simran@example.com', phone: '+91-9876543217', status: 'active', tags: ['Trauma'] },
      { name: 'Divya Nair', email: 'divya@example.com', phone: '+91-9876543218', status: 'active', tags: ['Student'] },
      { name: 'Varun Rao', email: 'varun@example.com', phone: '+91-9876543219', status: 'discharged', tags: ['Couples Therapy'] },
      { name: 'Anita Gupta', email: 'anita@example.com', phone: '+91-9876543220', status: 'inactive', tags: [] },
      { name: 'Karan Mehra', email: 'karan@example.com', phone: '+91-9876543221', status: 'active', tags: ['Stress'] },
      { name: 'Suresh Iyer', email: 'suresh@example.com', phone: '+91-9876543222', status: 'inactive', tags: ['Trauma'] },
      { name: 'Maya Menon', email: 'maya@example.com', phone: '+91-9876543223', status: 'active', tags: ['Anxiety'] },
      { name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91-9876543224', status: 'waitlisted', tags: [] }
    ];

    const insertedClients = [];
    for (let c of clientData) {
      const isConsentGiven = c.status === 'active' || c.status === 'discharged';
      
      const client = await Client.create({
        therapistId: drAnanya._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: c.status,
        tags: c.tags,
        dateOfBirth: new Date('1990-01-01'),
        pronouns: 'They/Them',
        intakeData: {
          emergencyContact: 'Jane Doe',
          presentingConcern: 'General stress and anxiety.',
          medicalHistory: 'None',
          medications: 'None',
          previousTherapy: 'Yes, 5 years ago.',
          goals: 'Develop coping strategies.',
          communicationMethod: 'Email'
        },
        consent: isConsentGiven ? {
          given: true,
          timestamp: new Date(),
          version: '1.0',
          ipAddress: '127.0.0.1'
        } : {}
      });

      if (isConsentGiven) {
        await Consent.create({
          clientId: client._id,
          therapistId: drAnanya._id,
          consentVersion: '1.0',
          accepted: true,
          acceptedAt: new Date(),
          ipAddress: '127.0.0.1'
        });
      }
      
      insertedClients.push(client);
    }
    console.log(`[Seed] Created ${insertedClients.length} clients with intake and consent...`);

    // Create sample sessions linked to clients
    const now = new Date();
    const sessions = [];
    const makeDate = (days, hour, minute) => moment().tz('Asia/Kolkata').add(days, 'days').startOf('day').hour(hour).minute(minute).utc().toDate();
    const makePastDate = (days, hour, minute) => moment().tz('Asia/Kolkata').subtract(days, 'days').startOf('day').hour(hour).minute(minute).utc().toDate();

    const addSession = (clientIndex, options) => {
      const client = insertedClients[clientIndex];
      sessions.push({
        therapistId: drAnanya._id,
        clientId: client._id,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        timezone: 'Asia/Kolkata',
        consentGiven: true,
        ...options
      });
    };

    // 8 Upcoming Sessions
    addSession(0, { serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makeDate(1, 10, 0), endTime: makeDate(1, 10, 50), status: 'confirmed', paymentStatus: 'pending' });
    addSession(1, { serviceType: 'Couples Therapy', sessionMode: 'In-person', startTime: makeDate(1, 11, 0), endTime: makeDate(1, 11, 50), status: 'confirmed', paymentStatus: 'paid' });
    addSession(2, { serviceType: 'Initial Consultation', sessionMode: 'Online', startTime: makeDate(2, 15, 0), endTime: makeDate(2, 15, 50), status: 'pending', paymentStatus: 'pending' });
    addSession(3, { serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makeDate(3, 16, 0), endTime: makeDate(3, 16, 50), status: 'confirmed', paymentStatus: 'pending' });
    addSession(4, { serviceType: 'Couples Therapy', sessionMode: 'In-person', startTime: makeDate(4, 10, 30), endTime: makeDate(4, 11, 20), status: 'confirmed', paymentStatus: 'paid' });
    addSession(5, { serviceType: 'Initial Consultation', sessionMode: 'Online', startTime: makeDate(6, 11, 0), endTime: makeDate(6, 11, 50), status: 'confirmed', paymentStatus: 'pending' });
    addSession(6, { serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makeDate(8, 16, 0), endTime: makeDate(8, 16, 50), status: 'confirmed', paymentStatus: 'pending' });
    addSession(7, { serviceType: 'Individual Therapy', sessionMode: 'In-person', startTime: makeDate(9, 10, 0), endTime: makeDate(9, 10, 50), status: 'confirmed', paymentStatus: 'paid' });

    // 4 Completed Sessions
    addSession(8, { serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makePastDate(2, 15, 30), endTime: makePastDate(2, 16, 20), status: 'completed', paymentStatus: 'paid' });
    addSession(9, { serviceType: 'Couples Therapy', sessionMode: 'In-person', startTime: makePastDate(4, 11, 0), endTime: makePastDate(4, 11, 50), status: 'completed', paymentStatus: 'paid' });
    addSession(10, { serviceType: 'Initial Consultation', sessionMode: 'Online', startTime: makePastDate(7, 10, 0), endTime: makePastDate(7, 10, 50), status: 'completed', paymentStatus: 'paid' });
    addSession(11, { serviceType: 'Individual Therapy', sessionMode: 'Online', startTime: makePastDate(10, 16, 0), endTime: makePastDate(10, 16, 50), status: 'completed', paymentStatus: 'paid' });

    // 1 Cancelled Session
    addSession(12, { serviceType: 'Individual Therapy', sessionMode: 'In-person', startTime: makeDate(5, 16, 0), endTime: makeDate(5, 16, 50), status: 'cancelled', paymentStatus: 'pending', notes: 'Client requested reschedule' });

    await Session.insertMany(sessions);
    console.log(`[Seed] Created ${sessions.length} sample sessions...`);

    console.log('\n[Seed Success] Database seeded successfully!');
    console.log(`- Therapist: Dr. Ananya Sharma (ananya@unfazed.care)`);
    console.log(`- 15 CRM Clients created`);
    console.log(`- Sample sessions: 8 upcoming, 4 completed, 1 cancelled`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(`[Seed Notice] MongoDB not reachable at ${mongoUri} (${error.message}).`);
    process.exit(0);
  }
};

seedData();
