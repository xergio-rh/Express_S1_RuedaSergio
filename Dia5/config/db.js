import mongoose, { connect, mongo } from "mongoose";

export class Database{
    constructor(uri){
        this.uri=uri;
    }
    async connect(){
        try{
            mongoose.set("strictQuery",true);
            await mongoose.connect(this.uri);
            console.log("MongoDB conectado!");
        }
        catch(err){
            console.log("Error en MogoDB:"+err.message);
        }
    }
    async disconnect(){
        try{
            await mongoose.disconnect();
            console.log("Base de datos desconectada");
        }
        catch(err){
            console.log("Error en MogoDB:"+err.message);

        }
    }
}
