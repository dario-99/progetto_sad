/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/Leo-k1/Progetto_Software_Architecture_Design
    Version: 1.0
    Description: mock db per il testing dei nostri componenti
*/

//import esterni
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

//Creo il mockDB
let mongoServer;
const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//Metodo connessione al db
const connect = async function(){
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, mongooseOpts);
};

//chiude la connessione al DB
const closeDb = async function(){
    await mongoose.disconnect();
    await mongoServer.stop();
};

//Effettua il clear del DB
const clearDb = async function(){
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
};

//esporto le funzioni
module.exports = {
    connect,
    closeDb,
    clearDb
}