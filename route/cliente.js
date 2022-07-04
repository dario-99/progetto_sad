/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Route per le richieste HTTP legate al cliente
*/

// Struttura ROUTE
/*
    /cliente
        |
        L /getMenu        *GET,NO_INPUT*
        L /insertOrdine   *POST, JSON_ORDINE*  
        L /menu           *GET, NO_INPUT*
*/

// import esterni
const express = require('express')

// import controller
const PietanzeController = require('../control/PietanzeController');
const OrdineController = require('../control/OrdineController');

//  Crezione Router esportabile alla fine del codice, in modo da essere usato come
//  Router nell'entry point
const router = express.Router();

/*------------------------------------ROUTES----------------------------------*/

// route per il retrieve del menu
/*
    METHOD: GET
    INPUT: None
    RESPONSE: Menu JSON
*/
router.get('/getMenu', async (req, res)=>{
    try{
        // Richiamo controller per effettuare il retrieve di tutte le pietanze
        const menu_json = await PietanzeController.getMenu();
        res.send(menu_json);
    }
    catch(err){
        // In caso di errore inviamo msg HTTP con status 500
        res.status(500).send({status: 'error', error:'Errore richiesta Menu!'});
    }
});


/*
    METHOD: POST
    INPUT: Json dell'ordine
    RESPONSE: status della richiesta, ok se corretta error altrimenti
    DESCRIPTION: Tramite richiesta http, inseriamo l'ordine specificato dall'utente all'interno del DB.
*/
router.post('/insertOrdine', async (req, res)=>{
    var error;
    try{
        await OrdineController.insertOrdine(req.body);
    } catch(err){
        error = err;
    }
    //  console.log(error);
    if(error){
        res.status(500).send({status:'error', error: error.message});
    }
    else{
        res.send({status:'ok', error:''});
    }
});

// -----------------------------------------PAGINE STATICHE---------------------------------------
/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente il menu
*/
router.get('/menu', async (req, res)=>{
    var error;
    var menu_json;
    try{
        // Richiamo controller per effettuare il retrieve di tutte le pietanze
        menu_json = await PietanzeController.getMenu();
    }
    catch(err){
        // In caso di errore inviamo msg HTTP con status 500
        error = err;
    }
    if(error){
        res.status(500).send({status: 'error', error:'Errore richiesta pagina!'});
    }
    else{
        //  console.log(menu_json);
        res.render('menu', {menu: menu_json});
    }
});

// export router
module.exports = router