const express = require('express');
const router = express.Router();
const { client } = require('../db');

router.use(express.json());

// Endpoint para ver estudiantes por estado
router.get('/reportes/estado/:estado', async (req, res) => {
    const estado = req.params.estado;
    try {
        const database = client.db('tu_nombre_de_base_de_datos');
        const estudiantesCollection = database.collection('estudiantes');
        const estudiantes = await estudiantesCollection.find({ estado: estado }).toArray();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes por estado:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Endpoint para ver la asignación de campers y trainers por salón
router.get('/reportes/grupos', async (req, res) => {
    try {
        const database = client.db('tu_nombre_de_base_de_datos');
        const gruposCollection = database.collection('grupo');
        const salonesCollection = database.collection('salones');
        const trainersCollection = database.collection('trainers');
        const estudiantesCollection = database.collection('estudiantes');

        const grupos = await gruposCollection.find({}).toArray();
        const salones = await salonesCollection.find({}).toArray();
        const trainers = await trainersCollection.find({}).toArray();
        const estudiantes = await estudiantesCollection.find({}).toArray();

        // Replicar la lógica de Python para generar el reporte
        const reporte = grupos.map(grupo => {
            const trainer = trainers.find(t => t.Nombre === grupo.trainer);
            const salon = salones.find(s => s.Nombre === grupo.salon);
            const estudiantesDelGrupo = estudiantes.filter(e => 
                grupo.estudiantes.some(est => est.Nombre === e.Nombre)
            );

            return {
                salon: grupo.salon,
                trainer: trainer ? trainer.Nombre : null,
                ruta: grupo.ruta,
                horario: grupo.horario,
                estudiantes: estudiantesDelGrupo.map(e => ({
                    nombre: e.Nombre,
                    ID: e.ID,
                    estado: e.estado,
                    riesgo: e.riesgo
                }))
            };
        });

        res.json(reporte);

    } catch (error) {
        console.error('Error al generar el reporte de grupos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});


// Endpoint para editar la información de un perfil
router.patch('/editar/:perfil/:id', async (req, res) => {
    const { perfil, id } = req.params;
    const datosNuevos = req.body;
    const database = client.db('campuslands');
    let collection;

    // Selecciona la colección correcta basándose en el parámetro de la URL
    if (perfil === 'campers') {
        collection = database.collection('estudiantes');
    } else if (perfil === 'trainers') {
        collection = database.collection('trainers');
    } else if (perfil === 'coordinadores') {
        collection = database.collection('coordinadores');
    } else {
        return res.status(400).json({ mensaje: 'Perfil no válido.' });
    }

    try {
        const resultado = await collection.updateOne(
            { ID: id },
            { $set: datosNuevos }
        );

        if (resultado.modifiedCount === 0) {
            return res.status(404).json({ mensaje: `${perfil} con ID ${id} no encontrado o no se realizaron cambios.` });
        }

        res.json({ mensaje: `Información del perfil ${perfil} con ID ${id} actualizada con éxito.` });

    } catch (error) {
        console.error(`Error al editar el perfil ${perfil}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Endpoint para ver estudiantes por estado (ej. "en riesgo" o "aprobado")
router.get('/reportes/estado/:estado', async (req, res) => {
    const estado = req.params.estado;
    try {
        const database = client.db('campuslands');
        const estudiantesCollection = database.collection('estudiantes');
        const estudiantes = await estudiantesCollection.find({ estado: estado }).toArray();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes por estado:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});


// Agrega este endpoint en tu archivo routes/coordinador.js
router.get('/reportes/riesgo/:riesgo', async (req, res) => {
    const riesgo = req.params.riesgo;
    try {
        const database = client.db('campuslands');
        const estudiantesCollection = database.collection('estudiantes');
        // Ahora, la búsqueda se hace por el campo 'riesgo'
        const estudiantes = await estudiantesCollection.find({ riesgo: riesgo }).toArray();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes por riesgo:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});




module.exports = router;