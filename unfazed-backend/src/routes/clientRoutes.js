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

router.use(protect);

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:clientId/intake')
  .get(getClientIntake)
  .put(updateClientIntake);

router.route('/:clientId/consent')
  .get(getClientConsent)
  .post(createClientConsent);

router.route('/:clientId')
  .get(getClientById)
  .patch(updateClient)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
