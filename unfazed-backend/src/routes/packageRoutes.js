const express = require('express');
const router = express.Router();
const {
  getPackages,
  getClientPackages,
  createPackage,
  updatePackage,
} = require('../controllers/packageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getPackages)
  .post(createPackage);

router.route('/client/:clientId')
  .get(getClientPackages);

router.route('/:id')
  .patch(updatePackage);

module.exports = router;
