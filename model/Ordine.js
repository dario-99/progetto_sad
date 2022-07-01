/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/Leo-k1/Progetto_Software_Architecture_Design
    Version: 1.0
    Description: Model di ordine
*/

//Import esterni
const mongoose = require('mongoose'); //Server Mongoose

/*-------------------SCHEMA---------------------------------
 * Creazione schema mongoose della collection Ordine
 * Uno schema non è altro che la struttura della collection.
*/
//Classe schema del modulo mongoose
const Schema = mongoose.Schema;


//Schema delle pietanze
const OrdineSchema = new Schema({
    ordine:[
        {
            qta:{
                type: Number,
                min: 1,
                required: true
            },
            pietanza:{
                type: String,
                required: true
            }
        }
    ]
},
{ collection: 'Ordine'} //nome della collection
);

const ordine = mongoose.model('Ordine', OrdineSchema);

//exports
module.exports = ordine;