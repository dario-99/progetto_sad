/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Model di Cameriera per il login
*/

// Import esterni
const mongoose = require('mongoose'); // Server Mongoose
const bcrypt = require('bcrypt'); // Libreria per hash function

/*-------------------SCHEMA---------------------------------
 * Creazione schema mongoose della collection Cameriera
 * Uno schema non è altro che la struttura della collection.
*/
// Classe schema del modulo mongoose
const Schema = mongoose.Schema;

const camerieraSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    psw: {
        type: String,
        required: true
    }
},{ collection: 'Camerieri'})

// hash the password
camerieraSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
camerieraSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.psw);
};

module.exports = mongoose.model("Cameriera", camerieraSchema);