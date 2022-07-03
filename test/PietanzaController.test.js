/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/Leo-k1/Progetto_Software_Architecture_Design
    Version: 1.0
    Description: Test case per Pietanza Controller
*/
var assert = require('chai').assert;
const PietanzeController = require('../control/PietanzeController');
const db = require('./db');
const pietanzaJson = require('./pietanze.json');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongoServer;
const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//Initialization
//Prima di eseguire i test eseguo la connessione al DB
before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, mongooseOpts);
});
//dopo ogni test libero il DB
afterEach(async () =>{
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
});
//dopo tutti i test chiudo la connessione col mock DB
after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

//Test case per pietanze controller
describe('Pietanze Controller', ()=>{
    //Test cases per la funzionalita' getMenu
    describe('get Menu', function(){
        it('Dovrebbe retrievare la stessa pietanza inserita', async ()=>{
            //inserisco pietanza fittizia
            await PietanzeController.insertPietanza(pietanzaJson.panino_ok);
            const menu = await PietanzeController.getMenu();
            var pietanza = menu[0];
            assert.equal(pietanza.nome, pietanzaJson.panino_ok.nome, "nome errato");
            assert.equal(pietanza.prezzo, pietanzaJson.panino_ok.prezzo, "prezzo errato");
            assert.equal(pietanza.descrizione, pietanzaJson.panino_ok.descrizione, "descrizione errata");
            assert.typeOf(pietanza.ingredienti, 'array', "tipo ingredienti errato");
        });
    });
    // Test cases per la funzionalita' insertPietanza
    describe('insert Pietanza', ()=>{
        it('test insert con valori accettabili', async ()=>{
            //inserisco pietanza fittizia
            await PietanzeController.insertPietanza(pietanzaJson.panino_ok);
            const menu = await PietanzeController.getMenu()
            var pietanza = menu[0];
            assert.equal(pietanza.nome, pietanzaJson.panino_ok.nome, "nome errato");
            assert.equal(pietanza.prezzo, pietanzaJson.panino_ok.prezzo, "prezzo errato");
            assert.equal(pietanza.descrizione, pietanzaJson.panino_ok.descrizione, "descrizione errata");
            assert.typeOf(pietanza.ingredienti, 'array', "tipo ingredienti errato");
        });
        it('test insert stringa troppo piccola', async ()=>{
            //inserisco pietanza fittizia
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
        it('test insert prezzo negativo', async ()=>{
            //inserisco pietanza fittizia
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
        it('test insert pietanza senza nome', async ()=>{
            //inserisco pietanza fittizia
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
    // Test cases per la funzionalita' removePietanzaByID
    describe('removePietanzaByID', ()=>{
        it('test remove pietanza presente', async ()=>{
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
        it('test remove pietanza non presente', async ()=>{
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