const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Importa las nuevas rutas para los campers
const campersRoutes = require('./routes/campers');

const app = express();
const PORT = 3000;

// Middleware para procesar cuerpos de solicitud JSON
app.use(express.json());

// Función para leer los archivos JSON (la misma que antes)
async function leerJSON(ruta) {
    try {
        const filePath = path.join(__dirname, 'data', `${ruta}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${ruta}.json:`, error);
        return null;
    }
}

// Ahora, las rutas de campers se manejarán bajo '/api/campers'
app.use('/api/campers', campersRoutes);

// Endpoint de ejemplo para obtener todos los estudiantes
app.get('/api/estudiantes', async (req, res) => {
    const estudiantes = await leerJSON('estudiantes');
    if (estudiantes) {
        res.json(estudiantes);
    } else {
        res.status(500).send('Error al cargar los datos de estudiantes.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});