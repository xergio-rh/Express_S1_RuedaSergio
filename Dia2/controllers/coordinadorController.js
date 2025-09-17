const coordinadorModel = require('../models/coordinadorModel');

const loginCoordinador = async (req, res) => {
    const { nombre, id } = req.body;
    try {
        const coordinador = await coordinadorModel.findCoordinadorByCredentials(nombre, id);
        if (coordinador) {
            res.json({ mensaje: `Bienvenido/a, Coordinador/a ${coordinador.Nombre}`, coordinador });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión del coordinador:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const getReportePorEstado = async (req, res) => {
    const estado = req.params.estado;
    try {
        const estudiantes = await coordinadorModel.getCampersByEstado(estado);
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes por estado:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const getReportePorRiesgo = async (req, res) => {
    const riesgo = req.params.riesgo;
    try {
        const estudiantes = await coordinadorModel.getCampersByRiesgo(riesgo);
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes por riesgo:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const getReporteGrupos = async (req, res) => {
    try {
        const { grupos, salones, trainers, estudiantes } = await coordinadorModel.getGroupsData();

        const reporteGrupos = grupos.map(grupo => {
            const salon = salones.find(s => s.Nombre === grupo.salon);
            const trainer = trainers.find(t => t.Nombre === grupo.trainer);
            
            const estudiantesEnGrupo = grupo.estudiantes.map(estudiante => {
                const camper = estudiantes.find(e => e.Nombre === estudiante.Nombre);
                return {
                    Nombre: camper ? camper.Nombre : 'No encontrado',
                    ID: camper ? camper.ID : 'N/A'
                };
            });

            return {
                salon: salon ? salon.Nombre : 'N/A',
                trainer: trainer ? trainer.Nombre : 'N/A',
                horario: grupo.horario,
                ruta: grupo.ruta,
                estudiantes: estudiantesEnGrupo
            };
        });
        res.json(reporteGrupos);
    } catch (error) {
        console.error('Error al generar el reporte de grupos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const registerTrainer = async (req, res) => {
    const { nombre, apellido, ruta } = req.body;
    try {
        const ultimoTrainer = await coordinadorModel.getTrainersCollection().find().sort({ ID: -1 }).limit(1).toArray();
        const nuevoID = (ultimoTrainer.length > 0) ? (parseInt(ultimoTrainer[0].ID) + 1).toString() : "1";

        const nuevoTrainer = { ID: nuevoID, Nombre: nombre, Apellido: apellido, Ruta: ruta };
        await coordinadorModel.createTrainer(nuevoTrainer);

        res.status(201).json({ mensaje: "Trainer registrado con éxito.", trainer: nuevoTrainer });
    } catch (error) {
        console.error('Error al registrar trainer:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const registerSalon = async (req, res) => {
    const { nombre } = req.body;
    try {
        const nuevoSalon = { Nombre: nombre };
        await coordinadorModel.createSalon(nuevoSalon);
        res.status(201).json({ mensaje: "Salón registrado con éxito.", salon: nuevoSalon });
    } catch (error) {
        console.error('Error al registrar salón:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const registerGrupo = async (req, res) => {
    const { salon, trainer, horario, ruta, estudiantes } = req.body;
    try {
        const nuevoGrupo = { salon, trainer, horario, ruta, estudiantes: estudiantes || [] };
        await coordinadorModel.createGrupo(nuevoGrupo);
        res.status(201).json({ mensaje: "Grupo registrado con éxito.", grupo: nuevoGrupo });
    } catch (error) {
        console.error('Error al registrar grupo:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    loginCoordinador,
    getReportePorEstado,
    getReportePorRiesgo,
    getReporteGrupos,
    registerTrainer,
    registerSalon,
    registerGrupo,
};