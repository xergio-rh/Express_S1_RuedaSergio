const express = require('express');
const router = express.Router();
const coordinadorController = require('../controllers/coordinadorController');
const passport = require('passport');


router.post('/login', coordinadorController.loginCoordinador);
router.get('/reportes/estado/:estado', passport.authenticate('jwt', { session: false }), coordinadorController.getReportePorEstado);
router.get('/reportes/riesgo/:riesgo', passport.authenticate('jwt', { session: false }), coordinadorController.getReportePorRiesgo);
router.get('/reportes/grupos', passport.authenticate('jwt', { session: false }), coordinadorController.getReporteGrupos);
router.post('/register/trainer', passport.authenticate('jwt', { session: false }), coordinadorController.registerTrainer);
router.post('/register/salon', passport.authenticate('jwt', { session: false }), coordinadorController.registerSalon);
router.post('/register/grupo', passport.authenticate('jwt', { session: false }), coordinadorController.registerGrupo);


module.exports = router;