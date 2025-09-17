const camperModel = require('../models/camperModel');

const loginCamper = async (req, res) => {
    const { nombre, id } = req.body;
    try {
        const camper = await camperModel.findCamperByCredentials(nombre, id);
        if (camper) {
            res.json({ mensaje: `Bienvenido/a, ${camper.Nombre}`, camper });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión del camper:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const registerCamper = async (req, res) => {
    const { nombre, apellido, direccion, acudiente, celular, fijo, ruta } = req.body;
    const estado = "Inscrito";
    const riesgo = "Nulo";
    try {
        const campersCollection = camperModel.getCampersCollection();
        const ultimoEstudiante = await campersCollection.find().sort({ ID: -1 }).limit(1).toArray();
        const nuevoID = (ultimoEstudiante.length > 0) ? (parseInt(ultimoEstudiante[0].ID) + 1).toString() : "1";
        
        const rutaAsignada = ["Java", "NodeJS", ".Net"][parseInt(ruta) - 1];
        if (!rutaAsignada) {
            return res.status(400).json({ mensaje: "Ruta no válida." });
        }

        const nuevoEstudiante = {
            ID: nuevoID,
            Nombre: nombre,
            Apellido: apellido,
            direccion: direccion,
            acudiente: acudiente,
            celular: celular,
            fijo: fijo,
            estado: estado,
            riesgo: riesgo,
            ruta: rutaAsignada
        };

        await camperModel.createCamper(nuevoEstudiante);
        res.status(201).json({ mensaje: "Estudiante registrado con éxito.", estudiante: nuevoEstudiante });
    } catch (error) {
        console.error('Error al registrar estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const getCamperProfile = async (req, res) => {
    const camperId = req.params.id;
    try {
        const camper = await camperModel.getCamperProfile(camperId);
        if (!camper) {
            return res.status(404).json({ mensaje: 'Camper no encontrado.' });
        }
        res.json(camper);
    } catch (error) {
        console.error('Error al obtener el perfil del camper:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const getAllCampers = async (req, res) => {
    try {
        const campers = await camperModel.getAllCampers();
        res.json(campers);
    } catch (error) {
        console.error('Error al obtener la lista de campers:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    loginCamper,
    registerCamper,
    getCamperProfile,
    getAllCampers,
};