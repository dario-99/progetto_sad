/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/Leo-k1/Progetto_Software_Architecture_Design
    Version: 1.0
    Description: Controller delle pietanze, si occupa del retrieve di tutti le
                 pietanze all'interno del DB e degli insert e remove delle singole pietanze
*/

//import
const pietanza = require('../model/Pietanza');  //Model di pietanza


/*
    *Input: none
    *Output: json della collection pietanze
    *Description: Effettua la query sulla collection, prendendo tutte le pietanze in caso di eccezione la facciamo gestire dal chiamante
*/
const getMenu = async function(){
    var result = "asd"
    result = await pietanza.find();
    return result;
}

/*
    *Input: pietanza json
    *Output: ok response se è andata a buon fine altrimenti throw error
    *Description: inserisce nel DB una pietanza
    @todo Da implementare
*/
const insertPietanza = function(pietanza){
}

/*
    *Input: pietanza json
    *Output: ok response se è andata a buon fine altrimenti throw error
    *Description: inserisce nel DB una pietanza
    @todo Da implementare
*/
const removePietanza = function(id){

}

module.exports = {
    getMenu,
    insertPietanza,
    removePietanza
}