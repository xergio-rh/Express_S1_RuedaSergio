const express = require('express');
const { connectDB, client } = require('./db');
const app = express();
const PORT = 3000;

// Importa las rutas para los diferentes perfiles
const campersRoutes = require('./routes/campers');
const trainersRoutes = require('./routes/trainers');
const coordinadorRoutes = require('./routes/coordinador');

// Conecta a MongoDB al iniciar el servidor
connectDB();

app.use(express.json());

// Asigna las rutas a sus respectivos prefijos
app.use('/api/campers', campersRoutes);
app.use('/api/trainers', trainersRoutes);
app.use('/api/coordinador', coordinadorRoutes);

// Endpoint de ejemplo para obtener todos los estudiantes
app.get('/api/estudiantes', async (req, res) => {
    try {
        const database = client.db('campuslands');
        const estudiantesCollection = database.collection('estudiantes');
        
        const estudiantes = await estudiantesCollection.find({}).toArray(); 
        
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});