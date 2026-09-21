const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Therapist = require('./src/models/Therapist');
const Client = require('./src/models/Client');
const Session = require('./src/models/Session');
const Invoice = require('./src/models/Invoice');
const Note = require('./src/models/Note');
const Message = require('./src/models/Message');

dotenv.config();

const seedData = async () => {
  try {
    console.log(`Connecting to ${process.env.MONGODB_URI}...`);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Therapist.deleteMany();
    await Client.deleteMany();
    await Session.deleteMany();
    await Invoice.deleteMany();
    await Note.deleteMany();
    await Message.deleteMany();

    // 1. Create Therapist
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const therapist = await Therapist.create({
      name: 'Dr. Ananya Sharma',
      email: 'ananya@unfazed.in',
      password: hashedPassword,
      slug: 'dr-ananya-sharma',
      bio: 'Experienced clinical psychologist specializing in anxiety, depression, and relationship counseling.',
      specialties: ['Anxiety', 'Depression', 'CBT', 'Couples Therapy'],
      subscriptionTier: 'Pro',
      settings: {
        currency: 'INR',
        sessionDuration: 50,
        bufferTime: 10,
      }
    });
    console.log('Created Therapist: Dr. Ananya Sharma');

    // 2. Create Clients (15 clients)
    const clientNames = [
      'Rohan Gupta', 'Priya Patel', 'Aarav Kumar', 'Diya Singh', 'Kabir Das',
      'Ananya Reddy', 'Ishaan Iyer', 'Neha Verma', 'Vihaan Nair', 'Myra Joshi',
      'Arjun Malhotra', 'Sanya Kapoor', 'Karan Ahuja', 'Riya Desai', 'Aryan Sen'
    ];
    const statuses = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'lead', 'lead', 'waitlisted', 'waitlisted', 'inactive'];

    const clients = [];
    for (let i = 0; i < 15; i++) {
      const client = await Client.create({
        therapistId: therapist._id,
        name: clientNames[i],
        email: `${clientNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        phone: `98765432${i.toString().padStart(2, '0')}`,
        status: statuses[i],
        tags: i % 3 === 0 ? ['Anxiety'] : i % 2 === 0 ? ['Couples'] : ['Depression'],
      });
      clients.push(client);
    }
    console.log(`Created ${clients.length} Clients`);

    // 3. Create Sessions, Invoices, Notes, and Messages
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      // Pick a random active client
      const activeClients = clients.filter(c => c.status === 'active');
      const client = activeClients[i % activeClients.length];

      // Distribute sessions over the last 6 months and next 2 weeks
      // i < 15 will be past sessions, i >= 15 will be future sessions
      const daysOffset = i < 15 ? -(Math.floor(Math.random() * 180) + 1) : Math.floor(Math.random() * 14) + 1;
      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() + daysOffset);
      sessionDate.setHours(10 + (i % 8), 0, 0, 0); // sessions between 10 AM and 5 PM

      const endTime = new Date(sessionDate.getTime() + 50 * 60000);
      const isPast = daysOffset < 0;

      // Create Session
      const session = await Session.create({
        therapistId: therapist._id,
        clientId: client._id,
        startTime: sessionDate,
        endTime: endTime,
        clientName: client.name,
        clientEmail: client.email,
        status: isPast ? 'completed' : 'scheduled',
        type: i % 4 === 0 ? 'in-person' : 'video',
        price: 1500, // 1500 INR
        paymentStatus: isPast ? 'paid' : 'pending',
      });

      // Create Invoice for past sessions
      if (isPast) {
        await Invoice.create({
          therapistId: therapist._id,
          clientId: client._id,
          amount: 1500,
          status: 'paid',
          dueDate: sessionDate,
          paidAt: sessionDate,
          invoiceNumber: `INV-${Date.now()}-${i}`,
          createdAt: sessionDate
        });

        // Create Note for past sessions
        await Note.create({
          therapistId: therapist._id,
          clientId: client._id,
          title: `Session Note - ${sessionDate.toLocaleDateString()}`,
          content: `<p>Discussed ongoing coping mechanisms. Client reported feeling ${i % 2 === 0 ? 'better' : 'anxious'}.</p>`,
          type: 'progress',
          status: 'signed',
          signedAt: sessionDate,
          createdAt: sessionDate
        });
      }

      // Add a couple of chat messages per active client
      if (i < activeClients.length * 2) {
        await Message.create({
          therapistId: therapist._id,
          clientId: client._id,
          senderModel: 'Client',
          senderId: client._id,
          text: i % 2 === 0 ? 'Hi Dr. Sharma, can we reschedule my next session?' : 'Thank you for the resources you shared.',
          createdAt: sessionDate
        });
        
        await Message.create({
          therapistId: therapist._id,
          clientId: client._id,
          senderModel: 'Therapist',
          senderId: therapist._id,
          text: 'Of course, let me know what time works best for you.',
          createdAt: new Date(sessionDate.getTime() + 3600000) // 1 hr later
        });
      }
    }

    console.log('Created Sessions, Invoices, Notes, and Messages');
    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
