const express = require('express');
const router = express.Router();
const camperController = require('../controllers/camperController');
const passport = require('passport'); // Importa passport


router.post('/login', camperController.loginCamper);
router.post('/register', camperController.registerCamper);


router.get('/:id', passport.authenticate('jwt', { session: false }), camperController.getCamperProfile);
router.get('/', passport.authenticate('jwt', { session: false }), camperController.getAllCampers);


module.exports = router;