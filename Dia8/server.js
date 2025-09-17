const express = require('express');
const { connectDB } = require('./db');
const app = express();
const PORT = 3000;
const passport = require('passport'); // Importa passport
require('./passport'); // Carga la configuración de passport

// Importa las rutas para los diferentes perfiles
const campersRoutes = require('./routes/campers');
const trainersRoutes = require('./routes/trainers');
const coordinadorRoutes = require('./routes/coordinador');

// Conecta a MongoDB al iniciar el servidor
connectDB();

app.use(express.json());
app.use(passport.initialize()); // Inicializa passport

// Asigna las rutas a sus respectivos prefijos
app.use('/api/campers', campersRoutes);
app.use('/api/trainers', trainersRoutes);
app.use('/api/coordinador', coordinadorRoutes);

// Endpoint de ejemplo (sin proteger)
app.get('/api/estudiantes', async (req, res) => {
    // ... (este endpoint puede quedarse o ser movido a un controlador si es necesario)
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});