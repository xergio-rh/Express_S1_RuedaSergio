const { client } = require('../db');

const getCoordinadoresCollection = () => client.db('campuslands').collection('coordinadores');
const getCampersCollection = () => client.db('campuslands').collection('estudiantes');
const getTrainersCollection = () => client.db('campuslands').collection('trainers');
const getGruposCollection = () => client.db('campuslands').collection('grupo');
const getSalonesCollection = () => client.db('campuslands').collection('salones');

const findCoordinadorByCredentials = async (nombre, id) => {
    return await getCoordinadoresCollection().findOne({ Nombre: nombre, ID: id });
};

const getCampersByEstado = async (estado) => {
    return await getCampersCollection().find({ estado: estado }).toArray();
};

const getCampersByRiesgo = async (riesgo) => {
    return await getCampersCollection().find({ riesgo: riesgo }).toArray();
};

const getGroupsData = async () => {
    const [grupos, salones, trainers, estudiantes] = await Promise.all([
        getGruposCollection().find({}).toArray(),
        getSalonesCollection().find({}).toArray(),
        getTrainersCollection().find({}).toArray(),
        getCampersCollection().find({}).toArray()
    ]);
    return { grupos, salones, trainers, estudiantes };
};

const createTrainer = async (nuevoTrainer) => {
    return await getTrainersCollection().insertOne(nuevoTrainer);
};

const createSalon = async (nuevoSalon) => {
    return await getSalonesCollection().insertOne(nuevoSalon);
};

const createGrupo = async (nuevoGrupo) => {
    return await getGruposCollection().insertOne(nuevoGrupo);
};

module.exports = {
    findCoordinadorByCredentials,
    getCampersByEstado,
    getCampersByRiesgo,
    getGroupsData,
    createTrainer,
    createSalon,
    createGrupo,
};