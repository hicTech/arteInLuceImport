
const fs = require('fs');

let rawdata_nuovi = fs.readFileSync('./listino_2021.js');
let nuovi = JSON.parse(rawdata_nuovi);

let rawdata_vecchi = fs.readFileSync('./listino_2020.js');
let vecchi = JSON.parse(rawdata_vecchi);
var sS = require('string-similarity');

var json2xls = require('json2xls');

var articoli_con_prezzo_cambiato = 0;
var articoli_nuovi = 0;
var arr_nuovi_articoli = [];
var arr_articoli_con_prezzo_cambiato = [];

var _ = require("../../lib/_node.js");






_.each(nuovi,function(nuovo){
    if( _.isString(nuovo["CODICE"]) && nuovo["CODICE"] != "" ){

        var id_nuovo_prodotto = nuovo["CODICE"].trim().replace("_","").replace("_","").replace(" ","").replace("","").replace("/","").replace(" ","").replace("-","").replace("/","");
        var trovato_corrispondente_articolo_vecchio = false;
       

        
        
        _.each(vecchi,function(vecchio){
            var id_vecchio_prodotto = vecchio["Riferimento"].replace("fosca_","").trim().replace("_","").replace("_","").replace(" ","").replace("","").replace("/","").replace(" ","").replace("-","").replace("/","");
            //_.log(id_vecchio_prodotto)
            if(id_nuovo_prodotto == id_vecchio_prodotto){
                
                var prezzo_nuovo_prodotto = nuovo["PREZZO IVA ESCLUSA"] * 1.22;
                var prezzo_vecchio_prodotto = vecchio["Prezzo (tasse incl.)"];
                
                trovato_corrispondente_articolo_vecchio =  true;

                
                if(prezzo_nuovo_prodotto != prezzo_vecchio_prodotto ){
                        _.log("prodotto: "+ vecchio["Riferimento"] +" -------- prezzo 2021: "+prezzo_nuovo_prodotto+" ------ prezzo 2020: "+prezzo_vecchio_prodotto)
                        arr_articoli_con_prezzo_cambiato.push(nuovo);
                        articoli_con_prezzo_cambiato++;
                }
                
            }
            
        });

        
        if( trovato_corrispondente_articolo_vecchio == false) {
            articoli_nuovi++;
            arr_nuovi_articoli.push(nuovo);
        }
        
        
    }

});

 _.log("trovati "+articoli_con_prezzo_cambiato+" prodotti con prezzo cambiato");


 _.log("il vecchio excel contiene "+vecchi.length+" articoli")
 _.log("il nuovo excel contiene "+nuovi.length+" articoli")

 _.log("trovati "+articoli_nuovi+" nuovi articoli")



let xls_nuovi_articoli = json2xls(arr_nuovi_articoli);
let xls_articoli_con_prezzo_cambiato = json2xls(arr_articoli_con_prezzo_cambiato);

// assicurati che ci sia la cartella result
fs.writeFileSync('nuovi_articoli_2021.xlsx', xls_nuovi_articoli, 'binary');
fs.writeFileSync('articoli_con_prezzo_cambiato_nel_2021.xlsx', xls_articoli_con_prezzo_cambiato, 'binary');






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

