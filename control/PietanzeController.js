/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Controller delle pietanze, si occupa del retrieve di tutti le
                 pietanze all'interno del DB e degli insert e remove delle singole pietanze
*/

// import
const pietanza = require('../model/Pietanza').pietanza;  // Model di pietanza


/*
    *Input: none
    *Output: json della collection pietanze
    *Description: Effettua la query sulla collection, prendendo tutte le pietanze in caso di eccezione la facciamo gestire dal chiamante
*/
const getMenu = async function(){
    var result;
    result = await pietanza.find();
    return result;
}

/*
    *Input: Json della pietanza
    *Output: ok response se è andata a buon fine altrimenti throw error
    *Description: inserisce nel DB una pietanza avendo in input il json della pietanza, la validazione del json viene gestita automaticamente da mongoose
*/
const insertPietanza = async function(json_pietanza){
    const piet = new pietanza(json_pietanza);
    var error = [];
    // Throws exception nel caso ci sia un errore
    try{
        await piet.save();
    } catch(err){
        if(err.errors.nome){
            error.push(err.errors.nome.message);
        }
        if(err.errors.prezzo){
            error.push(err.errors.prezzo.message);
        }
        if(!error){
            error.push("Undefined error");
        }
    }
    if(error.length != 0){
        throw new Error(error);
    }
}

/*
    *Input: id della pietanza
    *Output: ok response se è andata a buon fine altrimenti throw error
    *Description: Elimina una pietanza dal db
*/
const removePietanzaByID = async function(id){
    var error;
    try{
        await pietanza.deleteOne({_id : id});
    } catch(err){
        error = err;
    }
    if(error){
        throw new Error(error);
    }
}

module.exports = {
    getMenu,
    insertPietanza,
    removePietanzaByID
}