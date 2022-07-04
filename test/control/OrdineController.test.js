/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https:// github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Test case per ordini controller
*/

// import esterni
var assert = require('chai').assert;

// import
const OrdineController = require('../../control/OrdineController');
const PietanzeController = require('../../control/PietanzeController');
const db = require('../db');
const pietanzaJson = require('../pietanze.json');
const ordiniJson = require('../ordini.json');

// variabile contenente il menu
var menu;

describe('Ordine Controller', ()=>{
    // Initialization
    // Prima di eseguire i test eseguo la connessione al DB
    before(async () => {
        await db.connect();
    });
    // prima di eseguire ogni test popolo il DB
    beforeEach(async ()=>{
        // inserisco 10 pietanze di testing
        for(var i=0; i<10; i++){
            await PietanzeController.insertPietanza(pietanzaJson.panino_ok);
        }

        // Menu con tutte le pietanze
        menu = await PietanzeController.getMenu();

        // Popolo di ordini
        var ordine = ordiniJson.ordine_ok;
        for(var i = 0; i<10; i++){
            ordine.ordine = [{qta:i+1, pietanza:menu[i]._id}];
            await OrdineController.insertOrdine(ordine);
        }
    });
    // dopo ogni test libero il DB
    afterEach(async () =>{
        await db.clearDb();
    });
    // dopo tutti i test chiudo la connessione col mock DB
    after(async () => {
        await db.closeDb();
    });
    describe('test get ordini', ()=>{
        it('get', async()=>{
            var ordini = await OrdineController.getOrdini();
            for(var i = 0; i<10; i++){
                assert.equal(ordini[i].ordine[0].qta, i+1, "qta errata");
                assert.equal(ordini[i].ordine[0].pietanza, menu[i]._id, "id pietanza errato");
                assert.equal(ordini[i].status, 'new', "status errato not new");
                assert.typeOf(ordini[i].date, 'date', "campo date non del tipo date");
            }
        });
    });
    describe('test insert ordine', ()=>{
        it('insert corretto', async ()=>{
            var error;
            try{
                var ordine = ordiniJson.ordine_ok;
                ordine.ordine = [{qta:10, pietanza:menu[0]._id}];
                await OrdineController.insertOrdine(ordine)
            } catch(err){
                error = err;
            }
            if(error){
                assert.ok(false, "errore inserimento ordine 'corretto'");
            }
        });
        it('status non in enum', async ()=>{
            var error;
            try{
                var ordine = ordiniJson.ordine_stutus_not_enum;
                ordine.ordine = [{qta:10, pietanza:menu[0]._id}];
                await OrdineController.insertOrdine(ordine)
            } catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, `status ${ordine.status} non presente in lista`);
            }
            else{
                assert.ok(false, `errore non trovato`);
            }
        });
        it('qta == 0', async ()=>{
            var error;
            try{
                var ordine = ordiniJson.ordine_ok;
                ordine.ordine = [{qta:0, pietanza:menu[0]._id}];
                await OrdineController.insertOrdine(ordine)
            } catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, `Qta sbagliata per ordine ${ordine.ordine[0].pietanza}`);
            }
            else{
                assert.ok(false, `errore non trovato`);
            }
        });
        it('qta < 0', async ()=>{
            var error;
            try{
                var ordine = ordiniJson.ordine_ok;
                ordine.ordine = [{qta:-1, pietanza:menu[0]._id}];
                await OrdineController.insertOrdine(ordine)
            } catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, `Qta sbagliata per ordine ${ordine.ordine[0].pietanza}`);
            }
            else{
                assert.ok(false, `errore non trovato`);
            }
        });
        it('ordine vuoto', async ()=>{
            var error;
            try{
                var ordine = {};
                await OrdineController.insertOrdine(ordine)
            } catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, `Ordine vuoto`);
            }
            else{
                assert.ok(false, `errore non trovato`);
            }
        });
        it('pietanza non presente', async ()=>{
            var error;
            try{
                var ordine = ordiniJson.ordine_ok;
                ordine.ordine = [{qta:10, pietanza:"mock_id"}];
                await OrdineController.insertOrdine(ordine)
            } catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, `Impossibile trovare pietanza n. ${ordine.ordine[0].pietanza}`);
            }
            else{
                assert.ok(false, `errore non trovato`);
            }
        });
    });
    describe('test get ordine by id', ()=>{
        it('get ordine presente', async ()=>{
            try{
                var lista_ordini = await OrdineController.getOrdini();
                var ordine = await OrdineController.getOrdineByID(lista_ordini[0]._id);
            } catch(err){
                assert.ok(false, "trovato errore quando dovrebbe semplicemente prendere l'ordine");
            }
        });
        it('get ordine non presente', async ()=>{
            var error;
            try{
                var ordine = await OrdineController.getOrdineByID("mock_id");
            } catch(err){
                error = err
            }
            if(error){
                assert.equal(error.message, `Ordine n. mock_id non trovato`, 'errore diverso da id non trovato');
            }
            else{
                assert.ok(false, "non ha trovato errori")
            }
        });
    });
});