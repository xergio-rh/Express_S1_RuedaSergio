const express = require('express');
const router = express.Router();
const { client } = require('../db'); // Importa el cliente de la base de datos

// Middleware para parsear cuerpos de solicitud JSON
router.use(express.json());

// Función para calcular la nota final y actualizar el estado de riesgo
const calcularYActualizarNotas = async (idEstudiante, notas) => {
    const database = client.db('tu_nombre_de_base_de_datos');
    const estudiantesCollection = database.collection('estudiantes');
    const notasCollection = database.collection('notas');

    // Encuentra el documento de notas del estudiante
    const notasDoc = await notasCollection.findOne({ ID: idEstudiante });
    
    // Calcula la nota final
    const notaFinal = (notas.proyecto * 0.6) + (notas.filtro * 0.3) + (notas.trabajos * 0.1);

    if (notasDoc) {
        // Encuentra la nota del módulo específico
        const moduloKey = Object.keys(notas.notas).find(key => notas.notas[key][0].Nombre === notas.modulo);

        if (moduloKey) {
            // Actualiza las notas y el resultado en el array de notas del estudiante
            notasDoc.notas[moduloKey][0].Proyecto = notas.proyecto;
            notasDoc.notas[moduloKey][0].Filtro = notas.filtro;
            notasDoc.notas[moduloKey][0].Trabajos = notas.trabajos;
            notasDoc.notas[moduloKey][0].Resultado = notaFinal;
            
            // Guarda los cambios en la base de datos
            await notasCollection.updateOne(
                { ID: idEstudiante },
                { $set: { notas: notasDoc.notas } }
            );

            // Actualiza el estado de riesgo si la nota final es menor a 60
            if (notaFinal < 60) {
                await estudiantesCollection.updateOne(
                    { ID: idEstudiante },
                    { $set: { estado: 'en riesgo' } }
                );
            }
        }
    }
    return notaFinal;
};

// Endpoint para que un trainer califique a un estudiante
router.post('/calificar', async (req, res) => {
    const { idEstudiante, notas } = req.body;
    try {
        const notaFinal = await calcularYActualizarNotas(idEstudiante, notas);
        res.json({ mensaje: 'Notas actualizadas y estado de riesgo revisado.', notaFinal });
    } catch (error) {
        console.error('Error al calificar al estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Endpoint para ver la lista de estudiantes
router.get('/estudiantes', async (req, res) => {
    try {
        const database = client.db('tu_nombre_de_base_de_datos');
        const estudiantesCollection = database.collection('estudiantes');
        const estudiantes = await estudiantesCollection.find({}).toArray();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Endpoint para que un trainer califique a un estudiante
router.post('/calificar', async (req, res) => {
    const { idEstudiante, notas } = req.body;
    const database = client.db('campuslands');
    const notasCollection = database.collection('notas');

    try {
        // Busca el documento de notas del estudiante y actualiza el resultado
        const resultado = await notasCollection.updateOne(
            { ID: idEstudiante },
            { $set: { notas: notas } }
        );

        if (resultado.modifiedCount === 0) {
             return res.status(404).json({ mensaje: 'Estudiante no encontrado o notas sin cambios.' });
        }

        res.json({ mensaje: 'Notas actualizadas con éxito.', resultado });
    } catch (error) {
        console.error('Error al calificar al estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});


module.exports = router;