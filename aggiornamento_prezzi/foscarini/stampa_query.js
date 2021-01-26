var _ = require("../../lib/_node.js");

var nuovo_listino = require("./listino_2021.json");
var tab1 = require("./ps_product_attribute.json")[2].data
var tab2 = require("./ps_product_attribute_shop.json")[2].data

// _.log(nuovo_listino.length);
// _.log(tab1.length);
// _.log(tab2.length);

var count = 0;
_.each(nuovo_listino,function(nuovo){

    var cod_nuovo = nuovo.cod.toString();
    var prezzo_nuovo = nuovo.prezzo;

    _.each(tab1, function(tab1_elem){
        
        if(tab1_elem.reference == cod_nuovo && tab1_elem.reference != ""){
            
            var tab1_id_product_attribute = tab1_elem.id_product_attribute;
            var prezzo_attuale_su_sito = parseFloat(tab1_elem.price);

            _.each(tab2, function(tab2_elem){
                if(tab2_elem.id_product_attribute == tab1_id_product_attribute){
                    if(prezzo_attuale_su_sito != prezzo_nuovo){

                        _.log("l'articolo: "+tab1_elem.reference+" costa: "+prezzo_attuale_su_sito+" ------ deve costare: "+prezzo_nuovo)
                        
                        //_.log("SELECT * FROM ps_product_attribute WHERE reference='"+tab1_elem.reference+"'")
                        //_.log("SELECT * FROM ps_product_attribute_shop WHERE id_product_attribute='"+tab1_id_product_attribute+"'")
                        //_.log("--------------------------------------------");
                        //_.log("SELECT * FROM ps_product_attribute WHERE reference='"+tab1_elem.reference+"'")
                        //_.log("SELECT * FROM ps_product_attribute_shop WHERE id_product_attribute='"+tab1_id_product_attribute+"'")
                        //_.log("--------------------------------------------");
                        //_.log("UPDATE `ps_product_attribute_shop` SET `price` = '"+prezzo_nuovo+"' WHERE `ps_product_attribute_shop`.`id_product_attribute`="+tab1_id_product_attribute+";" );
                        //_.log("UPDATE `ps_product_attribute` SET `price` = '"+prezzo_nuovo+"' WHERE reference='"+tab1_elem.reference+"';")

                    }                    
                    
                }
            })
        }
    })
})
