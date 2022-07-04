/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Test case per Pietanza Controller
*/
var assert = require('chai').assert;
const PietanzeController = require('../../control/PietanzeController');
const db = require('../db');
const pietanzaJson = require('../pietanze.json');



// Test case per pietanze controller
describe('Pietanze Controller', ()=>{
    // Initialization
    // Prima di eseguire i test eseguo la connessione al DB
    before(async () => {
        await db.connect();
    });
    // dopo ogni test libero il DB
    afterEach(async () =>{
        await db.clearDb();
    });
    // dopo tutti i test chiudo la connessione col mock DB
    after(async () => {
        await db.closeDb();
    });
    // Test cases per la funzionalita' getMenu
    describe('get Menu', function(){
        it('Dovrebbe retrievare la stessa pietanza inserita', async ()=>{
            // inserisco pietanza fittizia
            await PietanzeController.insertPietanza(pietanzaJson.panino_ok);
            const menu = await PietanzeController.getMenu();
            var pietanza = menu[0];
            assert.equal(pietanza.nome, pietanzaJson.panino_ok.nome, "nome errato");
            assert.equal(pietanza.prezzo, pietanzaJson.panino_ok.prezzo, "prezzo errato");
            assert.equal(pietanza.descrizione, pietanzaJson.panino_ok.descrizione, "descrizione errata");
            assert.typeOf(pietanza.ingredienti, 'array', "tipo ingredienti errato");
        });
    });
    //  Test cases per la funzionalita' insertPietanza
    describe('insert Pietanza', ()=>{
        it('insert con valori accettabili', async ()=>{
            // inserisco pietanza fittizia
            await PietanzeController.insertPietanza(pietanzaJson.panino_ok);
            const menu = await PietanzeController.getMenu()
            var pietanza = menu[0];
            assert.equal(pietanza.nome, pietanzaJson.panino_ok.nome, "nome errato");
            assert.equal(pietanza.prezzo, pietanzaJson.panino_ok.prezzo, "prezzo errato");
            assert.equal(pietanza.descrizione, pietanzaJson.panino_ok.descrizione, "descrizione errata");
            assert.typeOf(pietanza.ingredienti, 'array', "tipo ingredienti errato");
        });
        it('insert stringa troppo piccola', async ()=>{
            // inserisco pietanza fittizia
            var error;
            try{
                await PietanzeController.insertPietanza(pietanzaJson.panino_nome_corto);
            }catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, "Stringa troppo piccola", "non trova errore stringa corta");
            }
            else{
                assert.ok(false, "ha inserito la pietanza anche se era scorretta");
            }
        });
        it('insert prezzo negativo', async ()=>{
            // inserisco pietanza fittizia
            var error;
            try{
                await PietanzeController.insertPietanza(pietanzaJson.panino_prezzo_negativo);
            }catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, "Prezzo minore di 0", "non trova errore prezzo minore di 0");
            }
            else{
                assert.ok(false, "ha inserito la pietanza anche se era scorretta");
            }
        });
        it('insert pietanza senza nome', async ()=>{
            // inserisco pietanza fittizia
            var error;
            try{
                await PietanzeController.insertPietanza(pietanzaJson.panino_senza_nome);
            }catch(err){
                error = err;
            }
            if(error){
                assert.equal(error.message, "Path `nome` is required.", "non trova errore nome required");
            }
            else{
                assert.ok(false, "ha inserito la pietanza anche se era scorretta");
            }
        });
    });
    //  Test cases per la funzionalita' removePietanzaByID
    describe('removePietanzaByID', ()=>{
        it('remove pietanza presente', async ()=>{
            var menu;
            try{
                await PietanzeController.insertPietanza(pietanzaJson.panino_ok);
                menu = await PietanzeController.getMenu();
            } catch(err){
                assert.ok(false,'errore generico insert o get menu in remove by id');
            }
            var id_pietanza = menu[0]._id;
            try{
                await PietanzeController.removePietanzaByID(id_pietanza);
            } catch(err){
                assert.ok(false, err.message);
            }
            menu = await PietanzeController.getMenu();
            assert.lengthOf(menu, 0);
        });
        it('remove pietanza non presente', async ()=>{
            var menu;
            var error;
            try{
                await PietanzeController.removePietanzaByID("123asdad");
            } catch(err){
                error = err;
            }
            assert.equal(error.message, "CastError: Cast to ObjectId failed for value \"123asdad\" (type string) at path \"_id\" for model \"pietanza\"");
        });
    });
});