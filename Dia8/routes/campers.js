const express = require('express');
const router = express.Router();
const camperController = require('../controllers/camperController');

router.post('/login', camperController.loginCamper);
router.post('/register', camperController.registerCamper);
router.get('/:id', camperController.getCamperProfile);
router.get('/', camperController.getAllCampers);

module.exports = router;