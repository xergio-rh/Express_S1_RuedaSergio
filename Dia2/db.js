require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const { MongoClient } = require('mongodb');

// Accede a la URL de la base de datos a través de process.env
const uri = process.env.URI;

// Asegúrate de que la URI esté cargada
if (!uri) {
    console.error('La variable de entorno MONGODB_URI no está definida. Por favor, revisa tu archivo .env.');
    process.exit(1);
}

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Conexión a MongoDB Atlas establecida con éxito.');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

module.exports = {
  connectDB,
  client,
};