const { client } = require('../db');

const getTrainersCollection = () => client.db('campuslands').collection('trainers');
const getCampersCollection = () => client.db('campuslands').collection('estudiantes');

const findTrainerByCredentials = async (nombre, id) => {
    return await getTrainersCollection().findOne({ Nombre: nombre, ID: id });
};

const getCamperById = async (id) => {
    return await getCampersCollection().findOne({ ID: id });
};

const updateCamperGradeAndRisk = async (idEstudiante, modulo, notaFinal, riesgo) => {
    return await getCampersCollection().updateOne(
        { ID: idEstudiante },
        { 
            $set: { 
                [`notas.${modulo}`]: notaFinal,
                riesgo: riesgo
            } 
        }
    );
};

module.exports = {
    findTrainerByCredentials,
    getCamperById,
    updateCamperGradeAndRisk
};