var fs = require('fs');
var _ = require("../lib/_node.js");
node_xj = require("xls-to-json");
var json2xls = require('json2xls');
var S = require('string');
 
        var i=0;
        var y=0;

 
var path = "../xls/";
 
fs.readdir(path, function(err, cartella_fornitore) {
    let json_fornitore = [];
    for (var i=0; i<cartella_fornitore.length; i++) {
        let cartella = cartella_fornitore[i];

        if(cartella != ".DS_Store"){
            let path_cartella = path+cartella;

            

            fs.readdir(path_cartella, (err, files) => {
                let files_length = 0;

                // conto i file .xls
                files.forEach(file => {
                    if(file.indexOf(".xls") != -1){
                        files_length++;
                    }
                });

                files.forEach(file => {

                    if(file.indexOf(".xls") != -1){
                        let path_file = path_cartella +"/"+ file;

                        node_xj({
                            input: path_file,  // input xls
                            output: null, //"./sample/output.json", // output json
                            //sheet: "sheetname"  // specific sheetname
                            }, function(err, result) {
                                if(err) {
                                    console.error(err);
                                } else {
                                    
                                    if(result.length > 5000)
                                        _.log("ATTENZIONE! un excel ha più di 5000 righe")
                                    
                                    json_fornitore = json_fornitore.concat(result);
                                    files_length--;
                                    
                                    if(files_length == 0){
                                        let path_fornitore = path_cartella +"/"+cartella;
                                        let json_aumentato = aumentaJson(json_fornitore, cartella);
                                        
                                        fs.writeFile(path_cartella +"/result/"+cartella+'.json', JSON.stringify(json_fornitore), 'utf8', function(){
                                            //_.log("FINITO");
                                        });

                                        fs.writeFile(path_cartella +"/result/"+cartella+'_aumentato.json', JSON.stringify(json_aumentato), 'utf8', function(){
                                            //_.log("FINITO");
                                        });

                                        let xls = json2xls(json_aumentato);

                                        fs.writeFileSync(path_cartella +"/result/"+cartella+'_aumentato.xlsx', xls, 'binary');
                    
                                    }
                                        
                                        
                                
                                }
                        });

                    }
                    
                });

                
            })

            

            
        }
            
    }



    
});


function aumentaJson(json, fornitore){
    
    let ret = [];
    _.each(json,function(row){
        if(!rigaVuota(row))
            ret.push(adjustRow(row,fornitore));
    });

   return ret;
}


function adjustRow(row,fornitore){

    /* ================================================================= FOSCARINI */
    if(fornitore == "foscarini"){
        let opts = {
            supplier : "foscarini"
        }

        /* 
            {
                "Prezzo IVA Incl.": "41.65",
                "Price List": "I EURO",
                "Line": "F",
                "Model": "APLOMB OUTDOOR",
                "Item Code": "291KIT-AVV",
                "Item": "KIT AVVOLGICAVO OUTDOOR",
                "Item Descr": "CABLE REEL KIT OUTDOOR",
                "EAN13": "8025594098303",
                "Start Date": "5/1/18",
                "End Date": "12/31/18",
                "Currency": "EUR",
                "Prezzo IVA Escl.": "34.14"
            },

        */

        let supplier = (_.is(opts.supplier))? opts.supplier : undefined;
        let supplier_id = supplierId(supplier);
        let model = row["Model"];
        let model_id = modelId(model);
        let item_id = itemId(row["Item Code"]);
        let ean13 = (_.is(row["EAN13"]))? row["EAN13"] : undefined;
        let price = (_.is(row["Prezzo IVA Escl."]))? row["Prezzo IVA Escl."] : undefined;

        let desc_it = row["Item"].toLowerCase().replace(/  +/g, ' ');
        let desc_en = row["Item Descr"].toLowerCase().replace(/  +/g, ' ');



        // tolgo dalla descrizione in italiano e in inglese il nome dell'articolo
        let cleaned_desc_it = cleanedName(desc_it, model.toLowerCase());
        let cleaned_desc_en = cleanedName(desc_en, model.toLowerCase());

        let dimmer = hasDimmer(cleaned_desc_it, cleaned_desc_en);
        let switcher = hasSwitcher(cleaned_desc_it);

        

        /*
        let category = getCategory(cleaned_name, cleaned_desc);
        let outdoor = isOutdoor(cleaned_name, cleaned_desc);
        
        
        */
   
        return{
            supplier:               supplier,                           // nome del fornitore
            supplier_id :           supplier_id,                        // identificativo del fonitore
            model:                  model,                              // modello/famiglia dell'articolo
            model_id:               model_id,                     // identificativo della famiglia di articolo ottenuto con replace(" ","_");
            item_id:                item_id,                            
            hicId:                  hicId(supplier_id, item_id),        // identificativo interno ottenuto come supplier_id + item_id
            ean13:                  ean13,                              // codice a barre
            price:                  getPrice(price),                    // imponibile
            color:                  getColorFromId(item_id),            // prova a recuperare il colore dall'id
            color_vecchio:          getColorSuperVECCHIO(cleaned_desc_it, cleaned_desc_en),
            desc_it:                cleaned_desc_it,                    // la descrizione in italiano epurata del nome dell'aritcolo
            desc_en:                cleaned_desc_en,                    // la descrizione in inglese epurata del nome dell'aritcolo
            dimmer:                 dimmer,                             // se ha il dimmer o meno
            switcher:               switcher,                           // se ha l'interruttore o meno
            
            
            
           
            
            
            /*
            item:                   row["Item"].toLowerCase(),          // nome dell'articolo
            item_desc:              row["Item Descr"].toLowerCase(),    // descrizione dell'articolo
            category:               category,                           // terra, tavolo, sospensione, soffitto, parete, montatura, kit, diffusore, set,
            outdoor:                outdoor,                            // se è da esterno o meno
            color:                  color,                              // colore
            dimmer:                 dimmer,                             // se ha il dimmero o memo
            materials:              undefined,                          // materiale primario, secondario ecc dell'articolo
            max_discount:           undefined,                          // massimo sconto applicabile
            start_date:             undefined,
            end_date:               undefined,
            */
            
        }

        function cleanedName(desc, model){
            let cleaned_name = desc.replace(model,"").trim();
            if(cleaned_name == "")
                _.log("ATTENZIONE! qualche articolo ha cleandeName vuoto");
            return cleaned_name.replace(/  +/g, ' ');
        }

        function hasDimmer(desc_it, desc_en){
            if( 
                ( desc_it.indexOf("dimmer") != -1  || desc_it.indexOf("dimm") != -1  || desc_it.indexOf("dimm.") != -1  || desc_it.indexOf("dim.") != -1 || desc_it.indexOf("dim") != -1 ) &&
                ( desc_en.indexOf("dimmer") != -1  || desc_en.indexOf("dimm") != -1  || desc_en.indexOf("dimm.") != -1  || desc_en.indexOf("dim.") != -1 || desc_en.indexOf("dim") != -1 )
             )
                return 1;
            return 0;
        }

        function hasSwitcher(desc_it){
            if(desc_it.indexOf("on/off") != -1)
                return 1;
            return 0;
        }

        
        function getColor(it, en){
            if( hasColor(it, en) ){
                
                let it_en = it+" "+en;
                let cleaned_it_en = S(it_en).replaceAll("on/off","").replaceAll(" /","/").replaceAll("/ ","/").s//rimuovo on/off da tutte le stringhe
                if(cleaned_it_en.indexOf("/") != -1){

                    // colore secondario /bianco
                    if(cleaned_it_en.indexOf("/bia") != -1 || cleaned_it_en.indexOf("/b.") != -1 ){
                        if(cleaned_it_en.indexOf("nero/") != -1 || cleaned_it_en.indexOf("cromo/") != -1 || cleaned_it_en.indexOf("cromo n/") != -1 || cleaned_it_en.indexOf("cr.nero/") != -1){
                            return ["nero","bianco"];
                        }
                        if(cleaned_it_en.indexOf("oro/") != -1){
                            return ["oro","bianco"];
                        }
                        if(cleaned_it_en.indexOf("oro+graf/") != -1){
                            return ["oro","grafite","bianco"];
                        }
                        
                        if(cleaned_it_en.indexOf("graf/") != -1 || cleaned_it_en.indexOf("grafite/") != -1){
                            return ["grafite","bianco"];
                        }

                        if(cleaned_it_en.indexOf("champ/") != -1 || cleaned_it_en.indexOf("champ./") != -1 || cleaned_it_en.indexOf("champagne/") != -1){
                            return ["champagne","bianco"];
                        }

                        if(cleaned_it_en.indexOf("bianco/") != -1){
                            return ["bianco"];
                        }

                        if(cleaned_it_en.indexOf("trasp/") != -1){
                            return ["trasparente","bianco"];
                        }

                        if(cleaned_it_en.indexOf("allum./") != -1 || cleaned_it_en.indexOf("alu/") != -1 || cleaned_it_en.indexOf("allu/") != -1 || cleaned_it_en.indexOf("allum/") != -1 || cleaned_it_en.indexOf("alluminio/") != -1){
                            return ["bianco"];
                        }
                        
                    }

                    //colore secondario /turcehse
                    if(cleaned_it_en.indexOf("/tu") != -1 ){
                        if(cleaned_it_en.indexOf("allum./") != -1 || cleaned_it_en.indexOf("alu/") != -1 || cleaned_it_en.indexOf("allu/") != -1 || cleaned_it_en.indexOf("allum/") != -1 || cleaned_it_en.indexOf("alluminio/") != -1){
                            return ["turchese"];
                        }

                        if(cleaned_it_en.indexOf("champ/") != -1 || cleaned_it_en.indexOf("champ./") != -1 || cleaned_it_en.indexOf("champagne/") != -1){
                            return ["champagne","turchese"];
                        }

                        if(cleaned_it_en.indexOf("nero/") != -1 || cleaned_it_en.indexOf("cromo/") != -1 || cleaned_it_en.indexOf("cromo n/") != -1 || cleaned_it_en.indexOf("cr.nero/") != -1){
                            return ["nero","turchese"];
                        }

                        _.log(cleaned_it_en)
                    }



                    //////// vedi di generalizzare colore primario e colore secondario così come materiale sencondario dal primario

                     
                }
                   
                
            }
        }

        function hasColor(it, en){
            let it_readable_color = ["bianco", "grigio","blu","marrone","oro", "nero", "rosso","azzurro", "indaco","verde", "rame",  "bronzo","arancione", "greige","cremisi","viola","carminio","giallo","ghiaccio", "naturale","avorio","grafite","trasparente", "cromo", "turchese","ciliegia","multicolore","colorato", "champ","amethyst queen","eastern coral","koh-i-noor","teodora","southern talisman","ruby jaypure","izmir","emerald king","amaranto","antraccite", "rosa","clour 01","clour 02","clour 03","clour 04","clour 05"];
            let it_colors = ["bia", "grig","blu","marr","oro", "nero", "ross","azzu", "indac","ver", "rame",  "bronz","ara", "greig","cremisi","viol","carminio","giall","ghia", "natural","avor","grafi","trasp", "crom", "turc","cilie","multic","colorat", "champ","amethyst queen","eastern coral","koh-i-noor","teodora","southern talisman","ruby jaypure","izmir","emerald king","amarant","antrac", "rosa","clour 01","clour 02","clour 03","clour 04","clour 05"];
            let en_colors = ["whit","grey","blu","brow","gold","black","red", "light","indac","gree","copper","bronz","oran","greig","cremisi","viol","carminio","yell", "ice",  "natural","ivor","graph","transp","chrom","turq","cherr","multic","coloured","champ","amethyst queen","eastern coral","koh-i-noor","teodora","southern talisman","ruby jaypure","izmir","emerald king","amarant","anthrac","pink","clour 01","clour 02","clour 03","clour 04","clour 05"];

            let ret = false;

            _.each(it_colors,function(it_color,index){
                if(it.indexOf(it_color) != -1 && en.indexOf(en_colors[index]) != -1)
                    ret = true;
            });

            return ret;
        
        }



        function getCategory(item_name, item_desc){

            // parete/soffitto
                    if( cleaned_it_en.indexOf("parete/sof") != -1 || cleaned_it_en.indexOf("par./sof") != -1 || cleaned_it_en.indexOf("par/sof") != -1){
                        return ["parete","soffitto"];
                    }

                    // sospensione/soffitto
                    if( cleaned_it_en.indexOf("sosp/soff") != -1){
                        return ["sospensione","soffitto"];
                    }

                    // sospensione/tavolo
                    if( cleaned_it_en.indexOf("sospensione/tavolo") != -1){
                        return ["sospensione","tavolo"];
                    }





            if( 
                ( item_name.indexOf(" terr") != -1 && item_desc.indexOf(" floor") != -1 ) ||
                ( item_name.indexOf(" lett") != -1 && item_desc.indexOf(" floor") != -1 ) 
            
             ){
                return "terra"
            }else{
                if(item_name.indexOf(" sosp") != -1 && item_desc.indexOf(" hang") != -1 ){
                    return "sospensione"
                }else{
                    if(item_name.indexOf(" pare") != -1 && item_desc.indexOf(" wall") != -1 ){
                        return "parete"
                    }else{
                        if(item_name.indexOf(" soff") != -1 && item_desc.indexOf(" ceil") != -1 ){
                            return "soffitto"
                        }else{
                            if(item_name.indexOf(" tav") != -1 && item_desc.indexOf(" tabl") != -1 ){
                                return "tavolo"
                            }else{
                                
                                    /* ========== ALTRE CATEGORIE DIVERSE DA QUELLE PRINCIPALI */
                                    if( 
                                        ( item_name.indexOf("kit ") != -1 && item_desc.indexOf("kit ") != -1 ) ||
                                        ( item_name.indexOf("set ") != -1 && item_desc.indexOf("set ") != -1 )
                                    ){
                                        return "kit"
                                    }else{
                                        if( 
                                            ( item_name.indexOf("diffu") != -1 && item_desc.indexOf("diffu") != -1 ) ||
                                            ( item_name.indexOf("vetr") != -1 && item_desc.indexOf("glass") != -1 )
                                        ){
                                            return "vetro"
                                        }else{
                                            if( 
                                                ( item_name.indexOf("diffu") != -1 && item_desc.indexOf("diffu") != -1 ) ||
                                                ( item_name.indexOf("vetr") != -1 && item_desc.indexOf("glass") != -1 )
                                            ){
                                                return "vetro"
                                            }else{
                                                if(item_name.indexOf("lumie") != -1)
                                                    //_.log(item_name)
                                                return "altro"
                                            }
                                        }
                                    }

                            }
                        }
                    }
                }
            }
        }

        function isOutdoor(item_name, item_desc){
            if( item_name.indexOf("out") != -1 && item_desc.indexOf("out") != -1 )
                return 1;
            return 0;
        }

        function getColorSuperVECCHIO(desc_it, desc_en){
           
            if(
                desc_it.indexOf("picchetto") == 0 || desc_it.indexOf("cavalletto") == 0 || desc_it.indexOf("zavorra") == 0 || desc_it.indexOf("set") == 0 || desc_it.indexOf("mont") == 0 || desc_it.indexOf("base") == 0  || desc_it.indexOf("kit") == 0 || desc_it.indexOf("diff") == 0 || desc_it.indexOf("modul") == 0 || desc_it.indexOf("vetr") == 0 || desc_it.indexOf("rosone") == 0 || desc_it.indexOf("aste") == 0 || desc_it.indexOf("braccio") == 0 ||
                desc_en.indexOf("stake") == 0 || desc_en.indexOf("ballast") == 0 || desc_en.indexOf("set") == 0 || desc_en.indexOf("frame") == 0 || desc_en.indexOf("base") == 0 || desc_en.indexOf("kit") == 0 || desc_en.indexOf("diff") == 0 || desc_en.indexOf("modul") == 0 || desc_en.indexOf("glas") == 0 || desc_en.indexOf("stems") == 0 || desc_en.indexOf("arm") == 0
            ){
                return 0;
            }else{
                if(desc_it.indexOf("bia") != -1 && desc_en.indexOf("whit") != -1 ){
                    return "bianco"
                }else{
                    if(desc_it.indexOf("grig") != -1 && desc_en.indexOf("grey") != -1 ){
                        return "grigio"
                    }else{
                        if(desc_it.indexOf("blu") != -1 && desc_en.indexOf("blu") != -1 ){
                            return "blu"
                        }else{
                            if(desc_it.indexOf("marron") != -1 && desc_en.indexOf("brow") != -1 ){
                                return "marrone"
                            }else{
                                if(desc_it.indexOf("oro") != -1 && desc_en.indexOf("gold") != -1 ){
                                    return "oro"
                                }else{
                                    if(desc_it.indexOf("nero") != -1 && desc_en.indexOf("black") != -1 ){
                                        return "nero"
                                    }else{
                                        if(desc_it.indexOf("ross") != -1 && desc_en.indexOf("red") != -1 ){
                                            return "rosso"
                                        }else{
                                            if(
                                                ( desc_it.indexOf("azzu") != -1 && desc_en.indexOf("light") != -1 ) ||
                                                ( desc_it.indexOf("indac") != -1 && desc_en.indexOf("light") != -1 ) ||
                                                ( desc_it.indexOf("azzurro") != -1 )
                                            ){
                                                return "azzurro"
                                            }else{
                                                if(desc_it.indexOf("ver") != -1 && desc_en.indexOf("gree") != -1 ){
                                                    return "verde"
                                                }else{
                                                    if(desc_it.indexOf("allu") != -1 && desc_en.indexOf("alu") != -1 ){
                                                        return "alluminio"
                                                    }else{
                                                        if(
                                                            ( desc_it.indexOf("rame") != -1 && desc_en.indexOf("copper") != -1 ) ||
                                                            ( desc_it.indexOf("rame") != -1 && desc_en.indexOf("rame") != -1 )
                                                        ){
                                                            return "rame"
                                                        }else{
                                                            if(desc_it.indexOf("bronz") != -1 && desc_en.indexOf("bronz") != -1 ){
                                                                return "bronzo"
                                                            }else{
                                                                if(
                                                                    ( desc_it.indexOf("aran") != -1 && desc_en.indexOf("orang") != -1  ) ||
                                                                    ( desc_it.indexOf("ara") != -1 && desc_en.indexOf("orang") != -1  )
                                                                ){
                                                                    return "arancio"
                                                                }else{
                                                                    if(desc_it.indexOf("greig") != -1 && desc_en.indexOf("greig") != -1 ){
                                                                        return "greige"
                                                                    }else{
                                                                        if(desc_it.indexOf("cremisi") != -1 && desc_en.indexOf("cremisi") != -1 ){
                                                                            return "cremisi"
                                                                        }else{
                                                                            if(desc_it.indexOf("indaco") != -1 && desc_en.indexOf("ind") != -1 ){
                                                                                return "indaco"
                                                                            }else{
                                                                                if(desc_it.indexOf("viol") != -1 && desc_en.indexOf("viol") != -1 ){
                                                                                    return "viola"
                                                                                }else{
                                                                                    if(desc_it.indexOf("carminio") != -1 && desc_en.indexOf("carminio") != -1 ){
                                                                                        return "carminio"
                                                                                    }else{
                                                                                        if(desc_it.indexOf("giall") != -1 && desc_en.indexOf("yello") != -1 ){
                                                                                            return "giallo"
                                                                                        }else{
                                                                                            if(desc_it.indexOf("ghia") != -1 && desc_en.indexOf("ice") != -1 ){
                                                                                                return "ghiaccio"
                                                                                            }else{
                                                                                                if(desc_it.indexOf("natural") != -1 && desc_en.indexOf("natural") != -1 ){
                                                                                                    return "naturale"
                                                                                                }else{
                                                                                                    if(desc_it.indexOf("avor") != -1 && desc_en.indexOf("ivor") != -1 ){
                                                                                                        return "avorio"
                                                                                                    }else{
                                                                                                        if(
                                                                                                            ( desc_it.indexOf("grafi") != -1 && desc_en.indexOf("graph") != -1  ) ||
                                                                                                            ( desc_it.indexOf("grafi") != -1 && desc_en.indexOf("grafi") != -1  )
                                                                                                        ){
                                                                                                            return "grafite"
                                                                                                        }else{
                                                                                                            if(desc_it.indexOf("trasp") != -1 && desc_en.indexOf("transp") != -1 ){
                                                                                                                return "trasprente"
                                                                                                            }else{
                                                                                                                if(desc_it.indexOf("acci") != -1 && desc_en.indexOf("steel") != -1 ){
                                                                                                                    return "acciaio"
                                                                                                                }else{
                                                                                                                    if(desc_it.indexOf("crom") != -1 && desc_en.indexOf("chro") != -1 ){
                                                                                                                        return "cromo"
                                                                                                                    }else{
                                                                                                                        if(desc_it.indexOf("tuch") != -1 && desc_en.indexOf("turq") != -1 ){
                                                                                                                            return "turchese"
                                                                                                                        }else{
                                                                                                                            if(desc_it.indexOf("cilie") != -1 && desc_en.indexOf("cherr") != -1 ){
                                                                                                                                return "ciliegia"
                                                                                                                            }else{
                                                                                                                                if(
                                                                                                                                    ( desc_it.indexOf("multic") != -1 && desc_en.indexOf("multic") != -1  ) ||
                                                                                                                                    ( desc_it.indexOf("colorato") != -1 && desc_en.indexOf("coloured") != -1  )
                                                                                                                                ){
                                                                                                                                    return "multicolore"
                                                                                                                                }else{
                                                                                                                                    if(desc_it.indexOf("champ") != -1 && desc_en.indexOf("champ") != -1 ){
                                                                                                                                        return "champagne"
                                                                                                                                    }else{
                                                                                                                                        if(desc_it.indexOf("amethyst queen") != -1 && desc_en.indexOf("amethyst queen") != -1 ){
                                                                                                                                            return "amethyst queen"
                                                                                                                                        }else{
                                                                                                                                            if(desc_it.indexOf("eastern coral") != -1 && desc_en.indexOf("eastern coral") != -1 ){
                                                                                                                                                return "eastern coral"
                                                                                                                                            }else{
                                                                                                                                                if(desc_it.indexOf("koh-i-noor") != -1 && desc_en.indexOf("koh-i-noor") != -1 ){
                                                                                                                                                    return "koh-i-noor"
                                                                                                                                                }else{
                                                                                                                                                    if(desc_it.indexOf("teodora") != -1 && desc_en.indexOf("teodora") != -1 ){
                                                                                                                                                        return "teodora"
                                                                                                                                                    }else{
                                                                                                                                                        if(desc_it.indexOf("southern talisman") != -1 && desc_en.indexOf("southern talisman") != -1 ){
                                                                                                                                                            return "southern talisman"
                                                                                                                                                        }else{
                                                                                                                                                            if(desc_it.indexOf("ruby jaypure") != -1 && desc_en.indexOf("ruby jaypure") != -1 ){
                                                                                                                                                                return "ruby jaypure"
                                                                                                                                                            }else{
                                                                                                                                                                if(desc_it.indexOf("izmir") != -1 && desc_en.indexOf("izmir") != -1 ){
                                                                                                                                                                    return "izmir"
                                                                                                                                                                }else{
                                                                                                                                                                    if(desc_it.indexOf("emerald king") != -1 && desc_en.indexOf("emerald king") != -1 ){
                                                                                                                                                                        return "emerald king"
                                                                                                                                                                    }else{
                                                                                                                                                                        if(desc_it.indexOf("amarant") != -1 && desc_en.indexOf("amarant") != -1 ){
                                                                                                                                                                            return "amaranto"
                                                                                                                                                                        }else{
                                                                                                                                                                            if(desc_it.indexOf("antrac") != -1 && desc_en.indexOf("anthrac") != -1 ){
                                                                                                                                                                                return "antracite"
                                                                                                                                                                            }else{
                                                                                                                                                                                if(desc_it.indexOf("rosa") != -1 && desc_en.indexOf("pink") != -1 ){
                                                                                                                                                                                    return "rosa"
                                                                                                                                                                                }else{
                                                                                                                                                                                    if(desc_it.indexOf("colour 01") != -1 && desc_en.indexOf("colour 01") != -1 ){
                                                                                                                                                                                        return "colour 01"
                                                                                                                                                                                    }else{
                                                                                                                                                                                        if(desc_it.indexOf("colour 02") != -1 && desc_en.indexOf("colour 02") != -1 ){
                                                                                                                                                                                            return "colour 02"
                                                                                                                                                                                        }else{
                                                                                                                                                                                            if(desc_it.indexOf("colour 03") != -1 && desc_en.indexOf("colour 03") != -1 ){
                                                                                                                                                                                                return "colour 03"
                                                                                                                                                                                            }else{
                                                                                                                                                                                                if(desc_it.indexOf("colour 04") != -1 && desc_en.indexOf("colour 04") != -1 ){
                                                                                                                                                                                                    return "colour 04"
                                                                                                                                                                                                }else{
                                                                                                                                                                                                    if(desc_it.indexOf("colour 05") != -1 && desc_en.indexOf("colour 05") != -1 ){
                                                                                                                                                                                                        return "colour 05"
                                                                                                                                                                                                    }else{
                                                                                                                                                                                                        return 0;
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        } 
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }  
                    }
                }
            }
        }

        function getColorFromId(id){
            let index = id.lastIndexOf("-");
            let color_number = 0;

            // rimuovo il led dal codice
            if(id.indexOf("LD") != -1){
                id = id.replace("LD","");
            }

            if(id.indexOf("-D") != -1){
                id = id.replace("-D","");
            }

            if(id.indexOf("DR") != -1){
                id = id.replace("DR","");
            }

            if(id.indexOf("DM") != -1){
                id = id.replace("DM","");
            }

            if(id.indexOf("D") != -1){
                _.log(id);
            }

            if(index != -1){
                color_number = id.substr(index+1,3);
            }
            if(color_number == "80")
                return "rame";

            if(color_number == "10" || color_number == "11")
                return "bianco";

            if(color_number == "22")
                return "grafite";
            
            if(color_number == "42")
                return "verde acqua";
            
            if(color_number == "16")
                return "bianco trasparente";
                    
            if(color_number == "52")
                return "giallo oro";
            
            if(color_number == "55" || color_number == "56")
                return "giallo";

            if(color_number == "66")
                return "multicolore";
            
            if(color_number == "20")
                return "nero";

            if(color_number == "25")
                return "greige";

            if(color_number == "67")
                return "cremisi";
        

            if(color_number == "87")
                return "indaco";
        

            if(color_number == "40")
                return "bianco e verde";
        

            if(color_number == "65")
                return "carminio";
        

            if(color_number == "01")
                return "color 01";
        

            if(color_number == "02")
                return "color 02";
        
            if(color_number == "03")
                return "color 03";
        

            if(color_number == "04")
                return "color 04";

            if(color_number == "05")
                return "color 05";
        

            if(color_number == "63" || color_number == "64" || color_number == "51")
                return "rosso";
        
            if(color_number == "27")
                return "antracite";
        

            if(color_number == "53" || color_number == "14")
                return "arancione";

            if(color_number == "65")
                return "amaranto";
        
            if(color_number == "12")
                return "bianco caldo";
        
            if(color_number == "24")
                return "grigio";
            
            if(color_number == "43")
                return "verde";
            
            if(color_number == "71")
                return "oro";

            if(color_number == "43")
                return "verde";
            
            if(color_number == "78")
                return "cromo nero";
            
            if(color_number == "73")
                return "bronzo";

            if(color_number == "26")
                return "grigio chiaro";
            
            if(color_number == "61")
                return "rosa";
            
            if(color_number == "33")
                return "blu";

            if(color_number == "54")
                return "marrone";
            
            if(color_number == "51")
                return "trasparente bianco";
            
            if(color_number == "06")
                return "ruby jaypure";

            if(color_number == "07")
                return "izmir";
            
            if(color_number == "08")
                return "emerald king";

            if(color_number == "15")
                return "bianco sfumato";
            
            if(color_number == "32")
                return "turchese";
            
            if(color_number == "62")
                return "ciliegia";

            if(color_number == "30")
                return "champagne";
            
                        
            if(color_number == "50")
                return "avorio";
            
            if(color_number == "xxxx")
                return "xxxxx";
            
            if(color_number == "xxxx")
                return "xxxxx";
            
            if(color_number == "xxxx")
                return "xxxxx";
                
        
                
        }
    }
}


/* ================================================================= GLOBALI */


function rigaVuota(row){
    let ret = true;
    _.each(row,function(val){
        if(_.is(val) && val != "")
            ret = false;
    });
    return ret;
}

function supplierId(supplier){
    let supplier_id = S(supplier).replaceAll(" ","-").s.substr(0,5);
    return supplier_id;
}


function modelId(model){
    let model_id = S(model).replaceAll(" ","_").s;
    return model_id;
}

function itemId(item_id){
    // come prima cosa sostituiamo gli spazi vuoti con "-"
    item_id = S(item_id).replaceAll(" ","-").s;
    // capita che le ultime due cifre del codice (che potrebbero indicare il colore) non siano separate dal "-"
    // quindi nel caso in cui gli ultimi caratteri dell'id sono numeri NON preceduti da "-" aggiungo un "-"
    let ultimi_due_caratteri = item_id.substr(item_id.length-2);
    if( !isNaN(ultimi_due_caratteri) ){
        let terzultimo_carattere = item_id.substr(item_id.length-3, 1);
        if(terzultimo_carattere != "-"){ 
            let prima_parte = item_id.substr(0, item_id.length-2);
            let restante_parte = item_id.substr(item_id.length-2);
            let nuovo_codice = prima_parte+"-"+restante_parte;
            item_id = nuovo_codice;
        }
        else{
            if( terzultimo_carattere == "/" ){
                let prima_parte = item_id.substr(0, item_id.length-3);
                let restante_parte = item_id.substr(item_id.length-2);
                let nuovo_codice = prima_parte+"-"+restante_parte;
                item_id = nuovo_codice;
            }
        }
    }
    return item_id;
}

function hicId(supplier_id, item_id){
    return supplier_id+"_"+item_id;
}

function getPrice(price){
    return price;
}


