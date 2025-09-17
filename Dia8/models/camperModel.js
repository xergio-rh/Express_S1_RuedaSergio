const { client } = require('../db');

const getCampersCollection = () => client.db('campuslands').collection('estudiantes');

const findCamperByCredentials = async (nombre, id) => {
    return await getCampersCollection().findOne({ Nombre: nombre, ID: id });
};

const createCamper = async (nuevoCamper) => {
    return await getCampersCollection().insertOne(nuevoCamper);
};

const getCamperProfile = async (id) => {
    return await getCampersCollection().findOne({ ID: id });
};

const getAllCampers = async () => {
    return await getCampersCollection().find({}).toArray();
};

module.exports = {
    findCamperByCredentials,
    createCamper,
    getCamperProfile,
    getAllCampers,
};