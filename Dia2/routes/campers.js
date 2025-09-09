const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

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

module.exports = router;