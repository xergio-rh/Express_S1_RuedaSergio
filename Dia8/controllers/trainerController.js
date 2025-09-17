const trainerModel = require('../models/trainerModel');

const loginTrainer = async (req, res) => {
    const { nombre, id } = req.body;
    try {
        const trainer = await trainerModel.findTrainerByCredentials(nombre, id);
        if (trainer) {
            res.json({ mensaje: `Bienvenido/a, Trainer ${trainer.Nombre}`, trainer });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión del trainer:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
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