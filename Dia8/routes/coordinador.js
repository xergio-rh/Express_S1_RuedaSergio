const express = require('express');
const router = express.Router();
const coordinadorController = require('../controllers/coordinadorController');

router.post('/login', coordinadorController.loginCoordinador);
router.get('/reportes/estado/:estado', coordinadorController.getReportePorEstado);
router.get('/reportes/riesgo/:riesgo', coordinadorController.getReportePorRiesgo);
router.get('/reportes/grupos', coordinadorController.getReporteGrupos);
router.post('/register/trainer', coordinadorController.registerTrainer);
router.post('/register/salon', coordinadorController.registerSalon);
router.post('/register/grupo', coordinadorController.registerGrupo);

module.exports = router;