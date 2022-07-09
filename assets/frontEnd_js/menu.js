async function loadMenu(){
    var stato = getCookie('status_ordine');
    if(stato == 'inviato'){
        var error;
        var menu;
        var res;
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
            for(elem of menu){
                var cart = document.getElementById(`cart_${elem._id}`);
                cart.remove();
            }
        }
    }
}