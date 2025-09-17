const trainerModel = require('../models/trainerModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const loginTrainer = (req, res, next) => {
    passport.authenticate('trainer-login', { session: false }, (err, trainer, info) => {
        if (err || !trainer) {
            return res.status(401).json({ mensaje: info.message });
        }
        req.login(trainer, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign({ id: trainer.ID, nombre: trainer.Nombre, rol: 'trainer' }, process.env.JWT_SECRET);
            return res.json({ mensaje: 'Inicio de sesión exitoso.', token, trainer });
        });
    })(req, res, next);
};

const calificarCamper = async (req, res) => {
    const { idEstudiante, modulo, notas } = req.body;
    try {
        const notaFinal = (notas.proyecto * 0.6) + (notas.filtro * 0.3) + (notas.trabajos * 0.1);

        const estudiante = await trainerModel.getCamperById(idEstudiante);
        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado.' });
        }

        let riesgoActualizado = estudiante.riesgo;
        if (notaFinal < 60) {
            riesgoActualizado = "alto";
        } else if (notaFinal >= 60 && notaFinal <= 75) {
            riesgoActualizado = "medio";
        } else {
            riesgoActualizado = "bajo";
        }
        
        await trainerModel.updateCamperGradeAndRisk(idEstudiante, modulo, notaFinal, riesgoActualizado);

        res.json({ mensaje: 'Calificación y riesgo actualizados con éxito.', notaFinal });
    } catch (error) {
        console.error('Error al calificar al estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    loginTrainer,
    calificarCamper
};