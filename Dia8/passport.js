const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const camperModel = require('./models/camperModel');
const trainerModel = require('./models/trainerModel');
const coordinadorModel = require('./models/coordinadorModel');

// Estrategia Local para el inicio de sesión
passport.use('camper-login', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'id'
}, async (nombre, id, done) => {
    try {
        const camper = await camperModel.findCamperByCredentials(nombre, id);
        if (!camper) {
            return done(null, false, { message: 'Credenciales incorrectas.' });
        }
        return done(null, camper);
    } catch (error) {
        return done(error);
    }
}));

passport.use('trainer-login', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'id'
}, async (nombre, id, done) => {
    try {
        const trainer = await trainerModel.findTrainerByCredentials(nombre, id);
        if (!trainer) {
            return done(null, false, { message: 'Credenciales incorrectas.' });
        }
        return done(null, trainer);
    } catch (error) {
        return done(error);
    }
}));

passport.use('coordinador-login', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'id'
}, async (nombre, id, done) => {
    try {
        const coordinador = await coordinadorModel.findCoordinadorByCredentials(nombre, id);
        if (!coordinador) {
            return done(null, false, { message: 'Credenciales incorrectas.' });
        }
        return done(null, coordinador);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia JWT para proteger las rutas
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        // En este ejemplo, el payload tiene el ID y el rol del usuario
        // Puedes buscar al usuario en la base de datos para asegurarte de que existe
        // y para obtener su información más reciente.
        // Aquí simplificaremos y solo pasaremos el payload.
        return done(null, payload);
    } catch (error) {
        return done(error);
    }
}));

module.exports = passport;