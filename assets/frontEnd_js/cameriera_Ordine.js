async function loadOrdine(id){
    var res;
    var menu;
    var error;
    try{
        res = await fetch(`/cameriera/getOrdine/${id}`,{
            method: 'GET'
        });
        menu = await fetch('/cliente/getMenu', {
            method: 'GET'
        });
    } catch(err){
        console.log(err);
        error = err;
    }
    if(!error){
        res = await res.json();
        menu = await menu.json();
        if(res.status != 'error'){
            var pietanze_container = document.getElementById('pietanze_container')
            for(piet of res.ordine.ordine){
                var pietanza = menu.find(o => o._id == piet.pietanza);
                pietanze_container.innerHTML += `
                    <div class="col-11 my-2" id="${piet._id}">
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
                                        <div class="col fs-5 text-center mx-0 px-0" id="qta_<%= elem._id %>">
                                            ${piet.qta} X
                                        </div>
                                    </div>
                                    <div class="row mt-10">
                                        <div class="col text-center fs-5" id="prezzo_<%= elem._id %>">
                                            ${pietanza.prezzo * piet.qta} €
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }
}

async function changeStato(id, stato){
    var res;
    var error;
    var data = JSON.stringify({id: id, stato: stato});
    try{
        var res = await fetch('/cameriera/cambioStato',{
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: data
        });
    } catch(err){
        console.log(err);
        error = err;
        alert("errore cambio stato");
    }
    if(!error){
        res = res.json();
        if(res.status == 'error'){
            alert("errore cambio stato");
        } else{
            window.location.href = '/cameriera/ordini';
        }
    }
}