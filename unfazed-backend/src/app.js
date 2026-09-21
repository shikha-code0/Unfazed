const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');
const clientRoutes = require('./routes/clientRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const noteRoutes = require('./routes/noteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow requests from any origin in dev
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Unfazed API service is healthy and operational.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
