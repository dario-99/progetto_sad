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
        window.location.href = '/cliente/ordine';
    }
};

// Funzione per incrementare del valore in input la qta della pietanza nell'ordine
// Accetta anche incrementi negativi, se è minore di 0 elimina totalemente la pietanza
async function incrementQta(id, inc){
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
                    var pietanzaCont = document.getElementById(`${id}`);
                    pietanzaCont.remove();
                }
                else{
                    var qtaCont = document.getElementById(`qta_${id}`);
                    qtaCont.innerHTML = `${obj.ordine[i].qta} X`;
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
    await calcolaPrezzo();
}

function clearOrdine(){
    var data = getCookie('ordine');
    if(data != ''){
        dataJSON = JSON.parse(data);
        for(elem of dataJSON.ordine){
            var container = document.getElementById(`${elem.pietanza}`);
            container.remove();
        }
    }
}

// Invia ordine al backend
function inviaOrdine(){
    var data = getCookie('ordine');
    if(data != ''){
        dataJSON = JSON.parse(data);
        if(dataJSON && dataJSON.ordine.length > 0){
            fetch("/cliente/insertOrdine", {
                method: "POST",
                headers: {'Content-Type': 'application/json'}, 
                body: data
            })
            .then(async (res) => {
                var ordine = await res.json();
                setCookie('status_ordine', 'inviato', 1);
                setCookie('id_ordine', ordine.id, 1);
                clearOrdine();
                loadOrdine();
            })
            .catch(err => {
                alert('Errore invio ordine!');
            });
        }
    }
    else{
        alert('Errore invio ordine!');
    }
}

const showPietanza = function(pietanza, qta){
    var pietanze_component = document.getElementById('pietanze');
    pietanze_component.innerHTML += `
        <div class="col-11 my-2" id="${pietanza._id}">
            <div class="card border border-3 bg-dark" style="border-color:#f2bf17 !important" >
                <div class="row card-body rounded-pill text-white">
                    <div class="col-2">
                        <img src="/assets/panino.png" class="img-fluid mt-1">
                    </div>
                    <div class="col text-center my-auto text-uppercase text-break fs-6" >
                        ${pietanza.nome}
                    </div>
                    <div class="col-4">
                        <div class="row text-center">
                            <button type="button" class="btn btn-primary col-2 bg-light btn-square text-black" onclick="incrementQta('${pietanza._id}', -1)" id="-_${pietanza._id}">
                                -
                            </button>
                            <div class="col fs-5 text-center mx-0 px-0" id="qta_${pietanza._id}">
                                ${qta} X
                            </div>
                            <button type="button" class="btn btn-primary col-2 bg-light btn-square text-black" onclick="incrementQta('${pietanza._id}', 1)" id="+_${pietanza._id}">
                                +
                            </button>
                        </div>
                        <div class="row mt-10">
                            <div class="col text-center fs-5" id="prezzo_${pietanza._id}">
                                ${qta*pietanza.prezzo}€
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function calcolaPrezzo(){
    var ordine = JSON.parse(getCookie('ordine'));
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
                    var prezzo_pietanza = document.getElementById(`prezzo_${elem.pietanza}`);
                    prezzo_pietanza.innerHTML = `${piet.prezzo * elem.qta}€`;
                }
            }
        }
        var prezzo_component = document.getElementById('prezzo');
        prezzo_component.innerHTML = `${prezzo}€`;
    }
}

function updateStatus(status){
    if(status == 'in_preparazione'){
        status = 'in preparazione';
    }
    var titolo = document.getElementById('titolo_ordine');
    titolo.innerHTML = `ordine: ${status}`;
}

// Carica la pagina con gli elementi
async function loadOrdine(){
    var stato = getCookie('status_ordine');
    var ordine = getCookie('ordine');
    if(ordine != ''){
        var ordineJSON = JSON.parse(ordine);
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
            for(elem of ordineJSON.ordine){
                for(piet of menu){
                    if(elem.pietanza == piet._id){
                        prezzo += piet.prezzo * elem.qta;
                        showPietanza(piet, elem.qta);
                    }
                }
            }
            var prezzo_component = document.getElementById('prezzo');
            prezzo_component.innerHTML = `${prezzo}€`;
        }
    }
    if(stato != ''){
        var prezzoComponent = document.getElementById('footer_container');
        prezzoComponent.className = "invisible";
        var ordineJSON = JSON.parse(ordine);
        for(elem of ordineJSON.ordine){
            var meno_container = document.getElementById(`-_${elem.pietanza}`);
            meno_container.remove();
            var piu_container = document.getElementById(`+_${elem.pietanza}`);
            piu_container.remove();
        }
        var ordine_id = getCookie('id_ordine');
        var res;
        try{
            res = await fetch(`/cliente/getStatoOrdine/${ordine_id}`, {
                method: "GET"
            });
        } catch(err){
            console.log(err);
            error = err;
        }
        res = await res.json();
        console.log(res);
        if(res.status == 'ok'){
            updateStatus(res.stato);
        }
        else{
            setCookie('ordine', '', 1);
            setCookie('id_ordine', '', 1);
            setCookie('status_ordine', '', 1);
        }
    }   
}