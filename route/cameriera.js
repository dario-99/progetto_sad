/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Route per le richieste HTTP legate al cliente
*/

// Struttura ROUTE
/*
    /cameriera
        |
        L /insertPietanza *POST, JSON_PIETANZA*
        L /removePietanza *DELETE, ID pietanza*
        L /getOrdini      *GET, NO_INPUT*
        L /removeOrdine   *DELETE, ID ordine*
        L /getOrdine/:id  *GET, ID ordine*
        L /cambioStato    *POST, ID ordine e stato*
*/

// import esterni
const express = require('express')

// import controller
const PietanzeController = require('../control/PietanzeController');
const OrdineController = require('../control/OrdineController');
const Authenticator = require('../middleware/auth');

//  Crezione Router esportabile alla fine del codice, in modo da essere usato come
//  Router nell'entry point
const router = express.Router();

/*------------------------------------ROUTES----------------------------------*/

/*
    METHOD: GET
    INPUT: None
    RESPONSE: Invia json degli ordini immagazzinati
    DESCRIPTION: Richiama il controller e richiama il metodo per ottenere la lista di tutti gli ordini presenti
*/
router.get('/getOrdini', Authenticator.authenticateTokenCameriera, async (req,res)=>{
    var error;
    var _ordini;
    try{
        _ordini = await OrdineController.getOrdini();
    } catch(err){
        error = err;
    }
    // in caso di errore invia le stringhe relative agli errori
    if(error){
        res.status(500).send({status: 'error', error: error.message});
    }
    else{
        res.status(200).send({status: 'ok', error: '', ordini: _ordini});
    }
});

/*
    METHOD: GET
    INPUT: ID ordine
    RESPONSE: Invia json dell ordine con id specificato
    DESCRIPTION: Richiama il controller e richiama il metodo per ottenere l'ordine con l'id specificato
*/
router.get('/getOrdine/:id', Authenticator.authenticateTokenCameriera, async (req,res)=>{
    var error;
    var ordine_json;
    try{
        // Richiamo controller per effettuare il retrieve di tutte le pietanze
        ordine_json = await OrdineController.getOrdineByID(req.params.id);
    }
    catch(err){
        // In caso di errore inviamo msg HTTP con status 500
        error = err;
    }
    if(error){
        res.status(500).send({status: 'error', error:'Errore richiesta pagina ordine!'});
    }
    else{
        //  console.log(menu_json);
        res.send({status: 'ok', error:'', ordine: ordine_json});
    }
});

/*
    METHOD: delete
    INPUT: Id ordine
    RESPONSE: ok in caso di corretta eliminazione, errore altrimenti
    DESCRIPTION: Richiama il controller chiamando il metodo removeOrdine
*/
router.delete('/removeOrdine', Authenticator.authenticateTokenCameriera, async (req,res)=>{
    var error;
    var id = req.body.id;
    try{
        await OrdineController.removeOrdine(id);
    } catch(err){
        error = err;
    }
    // in caso di errore invia le stringhe relative agli errori
    if(error){
        res.status(500).send({status: 'error', error: error.message});
    }
    else{
        res.status(200).send({status: 'ok', error: ''});
    }
});

/*
    METHOD: POST
    INPUT: JSON pietanza
    RESPONSE: invia json di risposta, status ok in caso di corretto inserimento, error in caso di errori con una lista degli errori 
    DESCRIPTION: richiamare controller, parsing e validazione json, invio ok response o error
*/
router.post('/insertPietanza', Authenticator.authenticateTokenCameriera, async (req,res)=>{
    var error = null;
    try{
        await PietanzeController.insertPietanza(req.body);
    } catch(err){
        error = err;
        //  console.log(error.message);
    }
    // in caso di errore invia le stringhe relative agli errori
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
router.delete('/removePietanza', Authenticator.authenticateTokenCameriera, async (req, res)=>{
    var error;
    var id = req.body._id;
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

/*
    METHOD: DELETE
    INPUT: json con campo _id con l'id del panino da eliminare
    RESPONSE: status ok in caso di corretta eliminazione, error altrimenti
*/
router.post('/cambioStato', Authenticator.authenticateTokenCameriera, async (req, res)=>{
    var error;
    var id = req.body.id;
    var stato = req.body.stato;
    if (id && stato){
        try{
            await OrdineController.cambiaStato(id, stato);
        }
        catch(err){
            error = err;
        }
    }else{
        error = ["Nessun id o stato presente"];
    }
    if(error){
        res.status(500).send({status: 'error', error : error.message});
    }
    else{
        res.send({status: 'ok', error: ''});
    }
});

/*
    METHOD: POST
    INPUT: id e psw
    RESPONSE: Verifica la presenza della cameriera sul DB e in caso affermativo genera un awt token di autenticazione
*/
router.use('/login', Authenticator.authCamerieraLogin);
router.post('/login', async (req, res)=>{
    res.redirect('/cameriera/ordini');
});

/*-------------------------------PAGINE STATICHE------------------------------*/
/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente la lista degli ordini
*/
router.get('/ordini', Authenticator.authenticateTokenCameriera, async (req, res)=>{
    var error;
    var ordini_json;
    try{
        // Richiamo controller per effettuare il retrieve di tutte le pietanze
        ordini_json = await OrdineController.getOrdini();
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
        res.render('listaOrdini', {ordini: ordini_json});
    }
});

/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente la lista degli ordini
*/
router.get('/ordine/:id', Authenticator.authenticateTokenCameriera, async (req, res)=>{
    var error;
    var ordine_json;
    try{
        // Richiamo controller per effettuare il retrieve di tutte le pietanze
        ordine_json = await OrdineController.getOrdineByID(req.params.id);
    }
    catch(err){
        // In caso di errore inviamo msg HTTP con status 500
        error = err;
    }
    if(error){
        res.status(500).send({status: 'error', error:'Errore richiesta pagina ordine!'});
    }
    else{
        //  console.log(menu_json);
        res.render('ordineCameriera', {ordine: ordine_json});
    }
});

/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html renderizzata da ejs, contenente la lista degli ordini
*/
router.get('/loginPage', async (req, res)=>{
    res.render('login');
});

/*
    METHOD: GET
    INPUT: None
    RESPONSE: Pagina html con qr code per un nuovo cliente
*/
router.get('/qrcode', Authenticator.authenticateTokenCameriera, async (req, res)=>{
    var token = Authenticator.generateAccessTokenTavolo(Math.floor(Math.random()*100));
    var ip = 'http://192.168.1.82:3000'
    res.render('qrcode', {token:token, ip:ip});
});
// export router
module.exports = router