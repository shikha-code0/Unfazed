const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  getClientIntake,
  updateClientIntake,
  getClientConsent,
  createClientConsent,
} = require('../controllers/clientController');

router.use(protect); // All client routes are protected

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

router.route('/:id/intake')
  .get(getClientIntake)
  .put(updateClientIntake);

router.route('/:id/consent')
  .get(getClientConsent)
  .post(createClientConsent);

module.exports = router;
