const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const passport = require('passport');


router.post('/login', trainerController.loginTrainer);

router.post('/calificar', passport.authenticate('jwt', { session: false }), trainerController.calificarCamper);


module.exports = router;