const cookieHandler = require('./cookieHandler');

// Funzione per aggiungere nei cookie la pietanza all'ordine
const aggiungi_pietanza = function(id){
    var ordine = cookieHandler.getCookie('ordine');
    var obj;
    if(ordine != ''){
        obj = JSON.parse(ordine);
        var cond = false;
        for(var elem of obj.ordine){
            if(elem.pietanza == id){
                cond = true;
                elem.qta += 1;
            }
        }
        if(!cond){
            obj.ordine.push({qta:1, pietanza: id});
        }
    }
    else{
        obj = {ordine : [{qta:1, pietanza:id}]};
    }
    cookieHandler.setCookie('ordine', JSON.stringify(obj), 1);
};

// Funzione per incrementare del valore in input la qta della pietanza nell'ordine
// Accetta anche incrementi negativi, se è minore di 0 elimina totalemente la pietanza
const incrementQta = function(id, inc){
    var ordine = cookieHandler.getCookie('ordine');
    var obj;
    if(ordine != ''){
        obj = JSON.parse(ordine);
        var cond = false;
        for(var i = 0; i<obj.ordine.length; i++){
            if(obj.ordine[i].pietanza == id){
                cond = true;
                obj.ordine[i].qta += inc;
                if(obj.ordine[i].qta <= 0){
                    obj.ordine.splice(i, 1);
                }
            }
        }
        if(!cond){
            throw new Error('pietanza non presente');
        }
    }
    else{
        throw new Error('pietanza cookie non presente');
    }
    cookieHandler.setCookie('ordine', JSON.stringify(obj), 1);
}

// Invia ordine al backend
const inviaOrdine = function(){
    var data = cookieHandler.getCookie('ordine');
    fetch("/cliente/insertOrdine", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
    })
    .then(res => {
        cookieHandler.setCookie('status_ordine', 'inviato');
    })
    .catch(err => {
        alert('Errore invio ordine!');
    });
}

//