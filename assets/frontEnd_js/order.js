// import {getCookie, setCookie} from './cookieHandler.js';

// Retrieving del cookie desiderado con nome 'cname'
const getCookie = function(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
};

// Imposta il cookie con nome 'cname' al valore 'cvalue' con numero di giorni per scadere 'exdays'
const setCookie = function (cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

// Funzione per aggiungere nei cookie la pietanza all'ordine
function aggiungi_pietanza(id){
    var stato = getCookie('status_ordine');
    if(stato != 'inviato'){
        var ordine = getCookie('ordine');
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
        setCookie('ordine', JSON.stringify(obj), 1);
    }
};

// Funzione per incrementare del valore in input la qta della pietanza nell'ordine
// Accetta anche incrementi negativi, se è minore di 0 elimina totalemente la pietanza
function incrementQta(id, inc){
    var ordine = getCookie('ordine');
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
    setCookie('ordine', JSON.stringify(obj), 1);
}

// Invia ordine al backend
function inviaOrdine(){
    var data = getCookie('ordine');
    console.log(data);
    fetch("/cliente/insertOrdine", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: data
    })
    .then(res => {
        setCookie('status_ordine', 'inviato', 1);
        window.location.href = '/cliente/menu';
    })
    .catch(err => {
        alert('Errore invio ordine!');
    });
}

const showPietanza = function(pietanza, qta){
    var pietanze_component = document.getElementById('pietanze');
    var div = document.createElement('div');
    div.className = "col my-3";
    var card = document.createElement('div');
    card.className = "card border border-3 rounded-pill";
    card.style['border-color'] = '#f2bf17 !important';
    card.id = pietanza._id;
    var cardBody = document.createElement('div');
    cardBody.className = "card-body rounded-pill bg-dark text-white";
    cardBody.innerHTML = `${pietanza.nome}, qta: ${qta}, ingredienti: ${pietanza.ingredienti}`;

    card.appendChild(cardBody);
    div.appendChild(card);
    pietanze_component.appendChild(div);
}

async function calcolaPrezzo(){
    var ordine = getCookie('ordine');
    var menu;
    var error;
    var res
    try{
        res = await fetch('/cliente/getMenu', {
            method: "GET"
        });
    } catch(err){
        console.log(err);
        error = err;
    }
    if(!error){
        menu = await res.json();
        var prezzo = 0;
        for(elem of ordine.ordine){
            for(piet of menu){
                if(elem.pietanza == piet._id){
                    prezzo += piet.prezzo * elem.qta;
                }
            }
        }
        var prezzo_component = document.getElementById('prezzo');
        prezzo_component.innerHTML = `${prezzo}€`;
        var footer = document.getElementById('footer_container');
        footer.className = 'fixed-bottom visible'
    }
}

// Carica la pagina con gli elementi
async function loadOrdine(){
    var stato = getCookie('status_ordine');
    console.log(stato);
    if(stato != 'inviato'){
        var ordine = getCookie('ordine');
        if(ordine != ''){
            var ordine = JSON.parse(ordine);
            var menu;
            var error;
            var res
            try{
                res = await fetch('/cliente/getMenu', {
                    method: "GET"
                });
            } catch(err){
                console.log(err);
                error = err;
            }
            if(!error){
                menu = await res.json();
                var prezzo = 0;
                for(elem of ordine.ordine){
                    for(piet of menu){
                        if(elem.pietanza == piet._id){
                            prezzo += piet.prezzo * elem.qta;
                            showPietanza(piet, elem.qta);
                        }
                    }
                }
                var prezzo_component = document.getElementById('prezzo');
                prezzo_component.innerHTML = `${prezzo}€`;
                var footer = document.getElementById('footer_container');
                footer.className = 'fixed-bottom visible'
            }
        }
        else{
            window.location.href = '/cliente/menu';
        }
    }
    else{
        window.location.href = '/cliente/menu';
    }
        
}