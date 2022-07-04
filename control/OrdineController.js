/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Controller degli ordini, si occupa dell'inserimento, eliminazione e gestione degli ordini
*/

// import
const Ordine = require('../model/Ordine');  // Model di ordine
const Pietanza = require('../model/Pietanza').pietanza;  // Model di ordine

/*
    *Input: Ordine
    *Output: None
    *Description: Effettua l'insert dell'ordine all'interno del DB, controlla che gli id delle pietanze siano corrette
*/
const insertOrdine = async function(ordine){
    var error = [];
    //  controllo che ci siano elementi nell'ordine
    if(Object.keys(ordine).length === 0){
        throw new Error(`Ordine vuoto`);
    }
    if(ordine.status){
        const status = ['new', 'in_preparazione', 'completato']
        if(!(ordine.status in status)){
            throw new Error(`status ${ordine.status} non presente in lista`);
        }
    }
    for(const elemOrdine of ordine.ordine){
        if(elemOrdine.qta <= 0){
            error.push(`Qta sbagliata per ordine ${elemOrdine.pietanza}`);
        }
        try{
            var temp = await Pietanza.findById(elemOrdine.pietanza).exec();
            if(!temp){
                error.push(`Impossibile trovare pietanza n. ${elemOrdine.pietanza}`);
            }
        } catch(err){
            error.push(`Impossibile trovare pietanza n. ${elemOrdine.pietanza}`);
        }
    }
    if(error.length != 0){
        throw new Error(error.toString());
    }
    else{
        const order = new Ordine(ordine);
        order.save();
    }
}

/*
    *Input: None
    *Output: Json ordini
    *Description: Effettua la richiesta al DB per la lista di tutti gli ordini presenti ed effettua il return
*/
const getOrdini = async function(){
    var result;
    result = await Ordine.find();
    return result;
}

/*
    *Input: id
    *Output: Json ordine
    *Description: Effettua la richiesta al DB per l'ordine con l'id fornito in input
*/
const getOrdineByID = async function(id){
    var result;
    var error;
    try{
        result = await Ordine.findById(id);
    } catch(err){
        error = err;
    }
    if(!result){
        throw new Error(`Ordine n. ${id} non trovato`);
    }
    if(error){
        throw new Error(error.message);
    }
    else{
        return result;
    }
}

module.exports = {
    insertOrdine,
    getOrdini,
    getOrdineByID
};