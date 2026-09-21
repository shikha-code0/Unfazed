const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getClients,
  createClient,
  getClientById,
  updateClient,
} = require('../controllers/clientController');

router.use(protect); // All client routes are protected

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient);

module.exports = router;
