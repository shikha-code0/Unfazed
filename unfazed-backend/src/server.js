require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`[Unfazed Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
