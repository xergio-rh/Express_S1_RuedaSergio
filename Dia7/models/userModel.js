import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export default class UserModel {
    constructor() {
        this.client = new MongoClient(process.env.MONGO_URI);
        this.dbName = process.env.MONGO_DB;
    }




    async connect() {
        if(!this.client.topology?.isConnected()){
            await this.client.connect();
        }
        return this.client.db(this.dbName).collection("users");
    }
    async createUser(userData){
        const collection = await this.connect();
        return await collection.insertOne(userData);
    }
    async findUserByEmail(email){
        const collection = await this.connect();
        return await collection.findOne({email});
    }

    async updateUser(id,newData){
        const collection = await this.connect();
        return await collection.updateOne({
            _id: new ObjectId(id)
        },{$set:newData})
    };


}