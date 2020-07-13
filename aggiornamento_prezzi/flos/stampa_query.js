var _ = require("../../lib/_node.js");

var nuovo_listino = require("./listino2020.json").listino;
var tab1 = require("./ps_product_attribute.json")[2].data
var tab2 = require("./ps_product_attribute_shop.json")[2].data

var count = 0;
_.each(nuovo_listino,function(nuovo){
    var cod_nuovo = nuovo.cod;
    var prezzo_nuovo = nuovo.prezzo.replace(",","");
    _.each(tab1, function(tab1_elem){
        if(tab1_elem.reference == cod_nuovo){
            var tab1_id_product_attribute = tab1_elem.id_product_attribute;
            _.each(tab2, function(tab2_elem){
                if(tab2_elem.id_product_attribute == tab1_id_product_attribute){
                    
                    // F003C41A006 - 17775
                    //_.log("--------------------------------------------");
                    //_.log("SELECT * FROM ps_product_attribute WHERE reference='"+tab1_elem.reference+"'")
                    //_.log("SELECT * FROM ps_product_attribute_shop WHERE id_product_attribute='"+tab1_id_product_attribute+"'")
                    //_.log("--------------------------------------------");
                    _.log("UPDATE `ps_product_attribute_shop` SET `price` = '"+prezzo_nuovo+"' WHERE `ps_product_attribute_shop`.`id_product_attribute`="+tab1_id_product_attribute+";" );
                    _.log("UPDATE `ps_product_attribute` SET `price` = '"+prezzo_nuovo+"' WHERE reference='"+tab1_elem.reference+"';")



                    
                    
                }
            })
        }
    })
})
