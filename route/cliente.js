/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/Leo-k1/Progetto_Software_Architecture_Design
    Version: 1.0
    Description: Route per le richieste HTTP legate al cliente
*/

//Struttura ROUTE
/*
    /cliente
        |
        L /getMenu        *GET,NO_INPUT*
        L /insertOrdine   *POST, JSON_ORDINE*   
*/

//import esterni
const express = require('express')

//import controller
const PietanzeController = require('../control/PietanzeController');

// Crezione Router esportabile alla fine del codice, in modo da essere usato come
// Router nell'entry point
const router = express.Router();

/*------------------------------------ROUTES----------------------------------*/

//route per il retrieve del menu
/*
    METHOD: GET
    INPUT: None
    RESPONSE: Menu JSON
*/
router.get('/getMenu', async (req, res)=>{
    try{
        //Richiamo controller per effettuare il retrieve di tutte le pietanze
        const menu_json = await PietanzeController.getMenu();
        res.send(menu_json);
    }
    catch(err){
        console.log(err);
        //In caso di errore inviamo msg HTTP con status 500
        res.status(500).send('Errore richiesta Menu!');
    }
});

//route per l'inserimento di un ordine

/*
    METHOD: POST
    INPUT: JSON order
    RESPONSE: 
    @todo Implementazione insert ordine
    @body richiamare controller, parsing e validazione json, invio ok response
*/
router.post('/insertOrdine', (req,res)=>{
    //Da implementare
    res.send('TODO');
});

//export router
module.exports = router