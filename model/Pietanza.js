/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Model di pietanza
*/

// Import esterni
const mongoose = require('mongoose'); // Server Mongoose

/*-------------------SCHEMA---------------------------------
 * Creazione schema mongoose della collection PIETANZA
 * Uno schema non è altro che la struttura della collection.
*/
// Classe schema del modulo mongoose
const Schema = mongoose.Schema;


// Schema delle pietanze
const pietanzaSchema = new Schema({
    nome:{
        type: String,
        required: true,
        minLength: [3, "Stringa troppo piccola"],
        maxLenght:30
    },
    prezzo:{
        type: Number,
        required : true,
        min: [0.0, "Prezzo minore di 0"]
    },
    descrizione:{
        type: String,
        required : false
    },
    // Lista di ingredienti
    ingredienti:[{
        type: String
    }]
},
{ collection: 'pietanze'} // nome della collection
);

const pietanza = mongoose.model('pietanza', pietanzaSchema);

// exports
module.exports = {
    pietanza,
    pietanzaSchema
};