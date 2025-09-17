const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/login', trainerController.loginTrainer);
router.post('/calificar', trainerController.calificarCamper);

module.exports = router;