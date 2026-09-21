const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/seed.js'), 'utf8');

content = content.replace(
  /await Session.deleteMany\({ clientEmail: { \$in: \['client1@example.com', 'client2@example.com', 'client3@example.com'\] } }\);/,
  `await Session.deleteMany({ therapistId: (await Therapist.findOne({ email: 'ananya@unfazed.care' }))?._id });`
);

content = content.replace(
  /const weeklySchedule = new Map\(\[\s*\[([\s\S]*?)\]\);\s*const availability = await Availability.create\({/m,
  `const weeklySchedule = [
      { dayOfWeek: 0, enabled: false, periods: [] }, // Sunday
      { dayOfWeek: 1, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Monday
      { dayOfWeek: 2, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Tuesday
      { dayOfWeek: 3, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Wednesday
      { dayOfWeek: 4, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Thursday
      { dayOfWeek: 5, enabled: true, periods: [{ startTime: '10:00', endTime: '13:00' }, { startTime: '15:00', endTime: '19:00' }] }, // Friday
      { dayOfWeek: 6, enabled: true, periods: [{ startTime: '10:00', endTime: '14:00' }] }, // Saturday
    ];

    const availability = await Availability.create({`
);

// Replace the sample sessions code
content = content.replace(
  /\/\/ Create sample sessions([\s\S]*?)await Session.insertMany\(sessions\);/m,
  `// Create sample sessions
    const now = new Date();
    const sessions = [];
    const makeDate = (days, hour, minute) => moment().tz('Asia/Kolkata').add(days, 'days').startOf('day').hour(hour).minute(minute).utc().toDate();
    const makePastDate = (days, hour, minute) => moment().tz('Asia/Kolkata').subtract(days, 'days').startOf('day').hour(hour).minute(minute).utc().toDate();

    // 8 Upcoming Sessions
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Priya Kumar', clientEmail: 'client1@example.com', clientPhone: '+91-9876543210', serviceType: 'Individual Therapy', sessionMode: 'Online',
      startTime: makeDate(1, 10, 0), endTime: makeDate(1, 10, 50), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'pending', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Rohan Desai', clientEmail: 'client2@example.com', clientPhone: '+91-9876543211', serviceType: 'Couples Therapy', sessionMode: 'In-person',
      startTime: makeDate(1, 11, 0), endTime: makeDate(1, 11, 50), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'paid', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Arjun Malhotra', clientEmail: 'client3@example.com', clientPhone: '+91-9876543212', serviceType: 'Initial Consultation', sessionMode: 'Online',
      startTime: makeDate(2, 15, 0), endTime: makeDate(2, 15, 50), timezone: 'Asia/Kolkata', status: 'pending', paymentStatus: 'pending', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Neha Singh', clientEmail: 'client4@example.com', clientPhone: '+91-9876543213', serviceType: 'Individual Therapy', sessionMode: 'Online',
      startTime: makeDate(3, 16, 0), endTime: makeDate(3, 16, 50), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'pending', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Vikram Patel', clientEmail: 'client5@example.com', clientPhone: '+91-9876543214', serviceType: 'Couples Therapy', sessionMode: 'In-person',
      startTime: makeDate(4, 10, 30), endTime: makeDate(4, 11, 20), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'paid', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Aisha Khan', clientEmail: 'client6@example.com', clientPhone: '+91-9876543215', serviceType: 'Initial Consultation', sessionMode: 'Online',
      startTime: makeDate(6, 11, 0), endTime: makeDate(6, 11, 50), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'pending', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Raj Sharma', clientEmail: 'client7@example.com', clientPhone: '+91-9876543216', serviceType: 'Individual Therapy', sessionMode: 'Online',
      startTime: makeDate(8, 16, 0), endTime: makeDate(8, 16, 50), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'pending', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Simran Kaur', clientEmail: 'client8@example.com', clientPhone: '+91-9876543217', serviceType: 'Individual Therapy', sessionMode: 'In-person',
      startTime: makeDate(9, 10, 0), endTime: makeDate(9, 10, 50), timezone: 'Asia/Kolkata', status: 'confirmed', paymentStatus: 'paid', consentGiven: true,
    });

    // 4 Completed Sessions
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Divya Nair', clientEmail: 'client9@example.com', clientPhone: '+91-9876543218', serviceType: 'Individual Therapy', sessionMode: 'Online',
      startTime: makePastDate(2, 15, 30), endTime: makePastDate(2, 16, 20), timezone: 'Asia/Kolkata', status: 'completed', paymentStatus: 'paid', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Varun Rao', clientEmail: 'client10@example.com', clientPhone: '+91-9876543219', serviceType: 'Couples Therapy', sessionMode: 'In-person',
      startTime: makePastDate(4, 11, 0), endTime: makePastDate(4, 11, 50), timezone: 'Asia/Kolkata', status: 'completed', paymentStatus: 'paid', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Anita Gupta', clientEmail: 'client11@example.com', clientPhone: '+91-9876543220', serviceType: 'Initial Consultation', sessionMode: 'Online',
      startTime: makePastDate(7, 10, 0), endTime: makePastDate(7, 10, 50), timezone: 'Asia/Kolkata', status: 'completed', paymentStatus: 'paid', consentGiven: true,
    });
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Karan Mehra', clientEmail: 'client12@example.com', clientPhone: '+91-9876543221', serviceType: 'Individual Therapy', sessionMode: 'Online',
      startTime: makePastDate(10, 16, 0), endTime: makePastDate(10, 16, 50), timezone: 'Asia/Kolkata', status: 'completed', paymentStatus: 'paid', consentGiven: true,
    });

    // 1 Cancelled Session
    sessions.push({
      therapistId: drAnanya._id, clientName: 'Suresh Iyer', clientEmail: 'client13@example.com', clientPhone: '+91-9876543222', serviceType: 'Individual Therapy', sessionMode: 'In-person',
      startTime: makeDate(5, 16, 0), endTime: makeDate(5, 16, 50), timezone: 'Asia/Kolkata', status: 'cancelled', paymentStatus: 'pending', consentGiven: true, notes: 'Client requested reschedule',
    });

    await Session.insertMany(sessions);`
);

fs.writeFileSync(path.join(__dirname, 'src/seed.js'), content, 'utf8');
