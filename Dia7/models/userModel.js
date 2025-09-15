require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { use } = require('react');

class UserModel {
    constructor(db) {
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.dbName = process.env.MONGODB_DATABASE;
    };

    async connect() {
        if (db) return db;
        await this.client.connect();
        db = this.client.db(this.dbName);
        return db.collection(`users`);
    };

    async findAll() {
        const collection = await this.connect();
        return await collection.find().toArray();
    };

    async findUserById(_id) {
        const collection = await this.connect();
        return await collection.findOne({ _id });
    };

    async findUserByEmail(email) {
        const collection = await this.connect();
        return await collection.findOne({ email });
    };

    async createUser(userData) {
        const collection = this.connect();
        return await collection.insertOne(userData);
    };

    async updateUser(_id, userData) {
        const collection = this.connect();
        return await collection.replaceOne({ _id }, userData);
    };

    async deleteUser(_id) {
        const collection = this.connect();
        return await collection.deleteOne({ _id });
    };
};

module.exports = { UserModel };