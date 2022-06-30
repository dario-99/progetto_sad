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
        //In caso di errore inviamo msg HTTP con status 500
        res.status(500).send({status: 'error', error:'Errore richiesta Menu!'});
    }
});

//route per l'inserimento di una pietanza

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
    if(error){
        res.status(200).send({status: 'ok', error: ''});
    }
    else{
        res.status(500).send({status: 'error', error: error.message});
    }
});

//route per l'elminazione di una pietanza partendo da un id
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

//route per l'elminazione di una pietanza partendo da un id
/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente il menu
*/
router.get('/menu', async (req, res)=>{
    var error;
    var menu_json;
    try{
        //Richiamo controller per effettuare il retrieve di tutte le pietanze
        menu_json = await PietanzeController.getMenu();
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
        res.render('menu', {menu: menu_json});
    }
});

//export router
module.exports = router