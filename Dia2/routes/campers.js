const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { client } = require('../db'); // <--- AÑADE ESTA LÍNEA


// Función para leer los archivos JSON (la misma que en server.js)
async function leerJSON(ruta) {
    try {
        const filePath = path.join(__dirname, '..', 'data', `${ruta}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${ruta}.json:`, error);
        return null;
    }
}

// Endpoint para el inicio de sesión del camper
router.post('/login', async (req, res) => {
    const { nombre, id } = req.body; // Obtiene el nombre y el id del cuerpo de la solicitud
    const estudiantesData = await leerJSON('estudiantes');

    const camper = estudiantesData.estudiantes.find(
        (e) => e.Nombre === nombre && e.ID === id
    );

    if (camper) {
        res.json({ mensaje: `Bienvenido/a, ${camper.Nombre}`, camper });
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }
});

// Endpoint para ver la información del camper
router.get('/:id/info', async (req, res) => {
    const camperId = req.params.id; // Obtiene el ID de la URL
    const estudiantesData = await leerJSON('estudiantes');

    const camper = estudiantesData.estudiantes.find(
        (e) => e.ID === camperId
    );

    if (camper) {
        res.json({
            nombre: camper.Nombre,
            apellido: camper.Apellido,
            estado: camper.estado,
            riesgo: camper.riesgo,
        });
    } else {
        res.status(404).json({ mensaje: 'Camper no encontrado.' });
    }
});

// Endpoint para ver las notas del camper
router.get('/:id/notas', async (req, res) => {
    const camperId = req.params.id;
    const notasData = await leerJSON('notas');

    const notasCamper = notasData.notas.find(
        (n) => n.ID === camperId
    );

    if (notasCamper) {
        res.json(notasCamper.notas);
    } else {
        res.status(404).json({ mensaje: 'Notas del camper no encontradas.' });
    }
});


// Endpoint para el registro de un nuevo camper
router.post('/register', async (req, res) => {
    const { nombre, apellido, direccion, acudiente, celular, fijo, ruta } = req.body;
    const database = client.db('campuslands');
    const estudiantesCollection = database.collection('estudiantes');

    try {
        // Generar un nuevo ID único
        const ultimoEstudiante = await estudiantesCollection.find().sort({ ID: -1 }).limit(1).toArray();
        const nuevoID = (ultimoEstudiante.length > 0) ? (parseInt(ultimoEstudiante[0].ID) + 1).toString() : "1";

        const estado = "Inscrito";
        const riesgo = "Nulo";
        
        let rutaAsignada;
        if (ruta === "1") {
            rutaAsignada = "Java";
        } else if (ruta === "2") {
            rutaAsignada = "NodeJS";
        } else if (ruta === "3") {
            rutaAsignada = ".Net";
        } else {
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

        await estudiantesCollection.insertOne(nuevoEstudiante);
        res.status(201).json({ mensaje: "Estudiante registrado con éxito.", estudiante: nuevoEstudiante });

    } catch (error) {
        console.error('Error al registrar estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Endpoint para listar todos los campers
router.get('/', async (req, res) => {
    try {
        const database = client.db('campuslands');
        const estudiantesCollection = database.collection('estudiantes');
        
        // Encuentra todos los estudiantes en la colección y los convierte a un array
        const estudiantes = await estudiantesCollection.find({}).toArray();
        
        // Envía la lista de estudiantes como una respuesta JSON
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener la lista de campers:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});


module.exports = router;