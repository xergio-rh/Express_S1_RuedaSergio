import express from "express";
import dotenv from "dotenv";
import routes from "./views/userRoutes.js";

dotenv.config();

const app= express();
app.use(express.json());//Middleware para que solo acepte JSON'S

//Rutas Principales
app.use('/api',routes);
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("FUNCIONAAAAAA EN:"+PORT);
})