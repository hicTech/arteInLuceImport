
const fs = require('fs');

let rawdata_nuovi = fs.readFileSync('./listino_2021.js');
let nuovi = JSON.parse(rawdata_nuovi);

let rawdata_vecchi = fs.readFileSync('./listino_2020.js');
let vecchi = JSON.parse(rawdata_vecchi);



var articoli_con_prezzo_cambiato = 0;
var articoli_nuovi = 0;
var arr_nuovi_articoli = [];

var _ = require("../../lib/_node.js");






_.each(nuovi,function(nuovo){
    if( _.isString(nuovo["CODICE"]) && nuovo["CODICE"] != "" ){

        var id_nuovo_prodotto = nuovo["CODICE"].trim().replace(" ","_");
        var trovato_corrispondente_articolo_vecchio = false;
       

        
        
        _.each(vecchi,function(vecchio){
            var id_vecchio_prodotto = vecchio["model_id"].replace("fosca_","");
            
            if(id_nuovo_prodotto == id_vecchio_prodotto){
                var prezzo_nuovo_prodotto = nuovo["PREZZO IVA ESCLUSA"] * 1.22;
                var prezzo_vecchio_prodotto = vecchio["price"];
                
                trovato_corrispondente_articolo_vecchio =  true;

                
                if(prezzo_nuovo_prodotto != prezzo_vecchio_prodotto ){
                        //_.log(prezzo_nuovo_prodotto+" - "+prezzo_vecchio_prodotto)
                        articoli_con_prezzo_cambiato++;
                }
                
            }
            
        });

        
        if( trovato_corrispondente_articolo_vecchio == false) {
            articoli_nuovi++;
            arr_nuovi_articoli.push(id_nuovo_prodotto);
        }
        
        
    }

});

 _.log("trovati "+articoli_con_prezzo_cambiato+" prodotti con prezzo cambiato");


 _.log("il vecchio excel contiene "+vecchi.length+" articoli")
 _.log("il nuovo excel contiene "+nuovi.length+" articoli")

 _.log("trovati "+articoli_nuovi+" nuovi articoli")

//_.log("ecco i nuovi articoli: "+ arr_nuovi_articoli);




var vecchi_articoli_non_piu_presenti = 0;


/*
_.each(vecchi,function(vecchio){
    var id_vecchio_prodotto = vecchio["Codice articolo"].trim();

    var vecchio_prodotto_trovato = false;

    _.each(nuovi,function(nuovo){
        var id_nuovo_prodotto = nuovo["Codice articolo"].trim();
        if(id_vecchio_prodotto == id_nuovo_prodotto){
            vecchio_prodotto_trovato = true;
        }
    })

    if(vecchio_prodotto_trovato == false){
        vecchi_articoli_non_piu_presenti++;
    }
   

});
*/


//_.log("dei "+ vecchi.length+" articoli nel vecchio catalogo ce ne sono "+ vecchi_articoli_non_piu_presenti+" non presenti nel nuovo")

