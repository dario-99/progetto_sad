/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Route per le richieste HTTP legate al cliente
*/

//Struttura ROUTE
/*
    /cameriera
        |
        L /insertPietanza *POST, JSON_PIETANZA*
        L /removePietanza *DELETE, ID pietanza*
        L /getOrdini      *GET, NO_INPUT*
*/

//import esterni
const express = require('express')

//import controller
const PietanzeController = require('../control/PietanzeController');
const OrdineController = require('../control/OrdineController');

// Crezione Router esportabile alla fine del codice, in modo da essere usato come
// Router nell'entry point
const router = express.Router();

/*------------------------------------ROUTES----------------------------------*/

/*
    METHOD: GET
    INPUT: None
    RESPONSE: Invia json degli ordini immagazzinati
    DESCRIPTION: Richiama il controller e richiama il metodo per ottenere la lista di tutti gli ordini presenti
*/
router.get('/getOrdini', async (req,res)=>{
    var error;
    var _ordini;
    try{
        _ordini = await OrdineController.getOrdini();
    } catch(err){
        error = err;
    }
    //in caso di errore invia le stringhe relative agli errori
    if(error){
        res.status(500).send({status: 'error', error: error.message});
    }
    else{
        res.status(200).send({status: 'ok', error: '', ordini: _ordini});
    }
});

/*
    METHOD: POST
    INPUT: JSON pietanza
    RESPONSE: invia json di risposta, status ok in caso di corretto inserimento, error in caso di errori con una lista degli errori 
    DESCRIPTION: richiamare controller, parsing e validazione json, invio ok response o error
*/
router.post('/insertPietanza', async (req,res)=>{
    var error = null;
    try{
        await PietanzeController.insertPietanza(req.body);
    } catch(err){
        error = err;
        // console.log(error.message);
    }
    //in caso di errore invia le stringhe relative agli errori
    if(!error){
        res.status(200).send({status: 'ok', error: ''});
    }
    else{
        res.status(500).send({status: 'error', error: error.message});
    }
});

/*
    METHOD: DELETE
    INPUT: json con campo _id con l'id del panino da eliminare
    RESPONSE: status ok in caso di corretta eliminazione, error altrimenti
*/
router.delete('/removePietanza', async (req, res)=>{
    var error;
    id = req.body._id;
    if (id){
        try{
            await PietanzeController.removePietanzaByID(id);
        }
        catch(err){
            error = err;
        }
    }else{
        error = ["Nessun id presente"];
    }
    if(error){
        res.status(500).send({status: 'error', error : error.message});
    }
    else{
        res.send({status: 'ok', error: ''});
    }
});

/*-------------------------------PAGINE STATICHE------------------------------*/
/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente la lista degli ordini
*/
router.get('/ordini', async (req, res)=>{
    var error;
    var ordini_json;
    try{
        //Richiamo controller per effettuare il retrieve di tutte le pietanze
        ordini_json = await OrdineController.getOrdini();
    }
    catch(err){
        //In caso di errore inviamo msg HTTP con status 500
        error = err;
    }
    if(error){
        res.status(500).send({status: 'error', error:'Errore richiesta pagina!'});
    }
    else{
        // console.log(menu_json);
        res.render('listaOrdini', {ordini: ordini_json});
    }
});

/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente la lista degli ordini
*/
router.get('/ordine/:id', async (req, res)=>{
    var error;
    var ordine_json;
    try{
        //Richiamo controller per effettuare il retrieve di tutte le pietanze
        ordine_json = await OrdineController.getOrdineByID(req.params.id);
    }
    catch(err){
        //In caso di errore inviamo msg HTTP con status 500
        error = err;
    }
    if(error){
        res.status(500).send({status: 'error', error:'Errore richiesta pagina ordine!'});
    }
    else{
        // console.log(menu_json);
        res.render('ordine', {ordine: ordine_json});
    }
});

//export router
module.exports = router