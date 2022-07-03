var assert = require('assert');
const PietanzeController = require('../control/PietanzeController');

//Initialization


//Test case per pietanze controller
describe('Pietanze Controller', function(){
    //Test cases per la funzionalita' getMenu
    describe('get Menu', function(){
        it('Speed test, Max 1s', function(){
            this.timeout(1000);
            var menu = PietanzeController.getMenu();
            // @TODO aggiungere confronto con test DB
            assert.ok(true);
        });
    });
    //Test cases per la funzionalita' insertPietanza
    describe('insert Pietanza', function(){

    });
    //Test cases per la funzionalita' removePietanzaByID
    describe('removePietanzaByID', function(){

    });

});