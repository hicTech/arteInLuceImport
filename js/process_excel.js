var fs = require('fs');
var _ = require("../lib/_node.js");
node_xj = require("xls-to-json");
var json2xls = require('json2xls');
var S = require('string');
 

var path = "../xls/";

var count = 0;
 
fs.readdir(path, function(err, cartella_fornitore) {
    
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

                var json_fornitore = [];
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


                                        var json_aumentato = [];

                                        // prima provo a leggere il json delle immagini di ogni fornitore
                                        // al success procedo con adjustRow
                                        fs.readFile('./'+cartella+'/files_json.json', 'utf8', function(err, contents) {
                                            let files_json = JSON.parse(contents);
                                            _.each(json_fornitore,function(row){
                                                if(!rigaVuota(row)){
                                                    json_aumentato.push(adjustRow(row,cartella,files_json));
                                                }   
                                            });

                                            fs.writeFile(path_cartella +"/result/"+cartella+'.json', JSON.stringify(json_fornitore), 'utf8', function(){
                                            //_.log("FINITO");
                                            });

                                            fs.writeFile(path_cartella +"/result/"+cartella+'_aumentato.json', JSON.stringify(json_aumentato), 'utf8', function(){
                                                //_.log("FINITO");
                                            });

                                            let xls = json2xls(json_aumentato);

                                            fs.writeFileSync(path_cartella +"/result/"+cartella+'_aumentato.xlsx', xls, 'binary');
                                            
                                        });
                                        
                                        
                    
                                    }
                                }
                        });

                    }
                    
                });

                
            })

            

            
        }
            
    }



    
});




function adjustRow(row,fornitore,files_json){

        var supplier = undefined;
        var supplier_id = undefined;
        var model = undefined;
        var model_id = undefined;
        var original_item_id = undefined;
        var item_id = undefined;
        var hicId = undefined;
        var ean13 = undefined;
        var price = undefined;
        var color = undefined;
        var desc_it = undefined;
        var desc_en = undefined;
        var cleaned_desc_it = undefined;
        var cleaned_desc_en = undefined;
        var dimmer = undefined;
        var led = undefined;
        var halogen = undefined;
        var screw = undefined;
        var switcher = undefined;
        var category = undefined; // è un array di categorie, i possibili valori sono: terra | tavolo | parete | soffitto | sospensione | altro (nel caso di "altro" quando possibile viene anche specificato di cosa si tratta, tipo: kit, vetro....)
        var type = undefined;
        var size = undefined;
        var outdoor = undefined;
        var max_discount = undefined;
        var path = undefined;
    

        /* ================================================================= FOSCARINI */
        if(fornitore == "foscarini"){

            supplier = "foscarini";
            supplier_id = supplierId(supplier);
            model = row["Model"];
            model_id = modelId(model);
            original_item_id = row["Item Code"];
            item_id = itemId(original_item_id);
            hicId = getHicId(supplier_id, item_id);
            ean13 = (_.is(row["EAN13"]))? row["EAN13"] : undefined;
            price = (_.is(row["Prezzo IVA Escl."]))? row["Prezzo IVA Escl."] : undefined;
            color = getColor(item_id);
            desc_it = row["Item"].toLowerCase().replace(/  +/g, ' ');
            desc_en = row["Item Descr"].toLowerCase().replace(/  +/g, ' ');
            // tolgo dalla descrizione in italiano e in inglese il nome dell'articolo
            cleaned_desc_it = cleanedName(desc_it, model.toLowerCase());
            cleaned_desc_en = cleanedName(desc_en, model.toLowerCase());
            dimmer = hasDimmer(cleaned_desc_it, cleaned_desc_en);
            led = hasLed(item_id);
            halogen = hasHalogen(item_id,cleaned_desc_it, cleaned_desc_en);
            screw = getScrew(cleaned_desc_it, cleaned_desc_en);
            switcher = hasSwitcher(cleaned_desc_it);
            category = getCategory(cleaned_desc_it, cleaned_desc_en);
            type = undefined;
            size = getSize(cleaned_desc_it, cleaned_desc_en);;
            outdoor = isOutdoor(cleaned_desc_it, cleaned_desc_en);
            max_discount = undefined;
            path = undefined;
            
            function cleanedName(desc, model){
                let cleaned_name = desc.replace(model,"").trim();
                if(cleaned_name == "")
                    _.log("ATTENZIONE! qualche articolo ha cleanedName vuoto");
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

            function hasLed(id){
                var ret = 0;
                if(id.indexOf("L") != -1){
                    if(id.indexOf("LD") != -1){
                        ret = 1;
                    }else{
                        if(id.indexOf("L/") != -1){
                            ret = 1;
                        }
                        else{
                            if(id.indexOf("L-") != -1){
                                ret = 1;
                            }
                            else{
                                if(id.indexOf("LR1") != -1){
                                    ret = 1;
                                }
                                else{
                                    if(id.indexOf("LS") != -1){
                                        ret = 1;
                                    }
                                    else{
                                        if(id.indexOf("L") == id.length-1){
                                            ret = 1;
                                        }
                                    }
                                }
                                
                            }
                        }
                    }
                }

                return ret;
                    
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

            function hasSwitcher(desc_it){
                if(desc_it.indexOf("on/off") != -1)
                    return 1;
                return 0;
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

            function getCategory(cleaned_desc_it, cleaned_desc_en){
            
                // parete/soffitto
                var cleaned_it_en = cleaned_desc_it+" "+cleaned_desc_en;
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
                    ( cleaned_desc_it.indexOf("terr") != -1 && cleaned_desc_en.indexOf("floor") != -1 ) ||
                    ( cleaned_desc_it.indexOf("lett") != -1 && cleaned_desc_en.indexOf("floor") != -1 ) ||
                    ( cleaned_desc_it.indexOf("lettu") != -1 && cleaned_desc_en.indexOf("read") != -1 ) ||
                    ( cleaned_desc_it.indexOf("terra") != -1 ) 
                
                ){
                    return ["terra"];
                }else{
                    if(
                        ( cleaned_desc_it.indexOf("sosp") != -1 && cleaned_desc_en.indexOf("hang") != -1  ) ||
                        ( cleaned_desc_it.indexOf("sosp") != -1 && cleaned_desc_en.indexOf("susp") != -1 )
                    ){
                        return ["sospensione"];
                    }else{
                        if(cleaned_desc_it.indexOf("pare") != -1 && cleaned_desc_en.indexOf("wall") != -1 ){
                            return ["parete"];
                        }else{
                            if(cleaned_desc_it.indexOf("soff") != -1 && cleaned_desc_en.indexOf("ceil") != -1 ){
                                return ["soffitto"]
                            }else{
                                if(
                                    ( cleaned_desc_it.indexOf("tavo") != -1 && cleaned_desc_en.indexOf("tabl") != -1 ) ||
                                    ( cleaned_desc_it.indexOf("tav.") != -1 && cleaned_desc_en.indexOf("tab") != -1  )
                                ){
                                    return ["tavolo"]; 
                                }else{
                                    
                                        /* ========== ALTRE CATEGORIE DIVERSE DA QUELLE PRINCIPALI */
                                        if( 
                                            ( cleaned_desc_it.indexOf("kit ") != -1 && cleaned_desc_en.indexOf("kit ") != -1 ) ||
                                            ( cleaned_desc_it.indexOf("set ") != -1 && cleaned_desc_en.indexOf("set ") != -1 )
                                        ){
                                            return ["altro","kit"];
                                        }else{
                                            if( 
                                                ( cleaned_desc_it.indexOf("diffu") != -1 && cleaned_desc_en.indexOf("diffu") != -1 ) ||
                                                ( cleaned_desc_it.indexOf("vetr") != -1 && cleaned_desc_en.indexOf("glass") != -1 )
                                            ){
                                                return ["altro","vetro"]
                                            }else{
                                                if( 
                                                    ( cleaned_desc_it.indexOf("diffu") != -1 && cleaned_desc_en.indexOf("diffu") != -1 ) ||
                                                    ( cleaned_desc_it.indexOf("vetr") != -1 && cleaned_desc_en.indexOf("glass") != -1 )
                                                ){
                                                    return ["altro","vetro"]
                                                }else{
                                                    if(cleaned_desc_it.indexOf("lumie") != -1)
                                                        //_.log(cleaned_desc_it)
                                                    return ["altro"]
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

            function getColor(id){
                
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
                // _.log(id);
                }

                let index = id.lastIndexOf("-");

                
                let color_number = 0;

                if(index != -1){
                    color_number = id.substr(index+1,2);
                    
                }



                
                if(color_number == "80")
                    return "rame";

                if(color_number == "10")
                    return "bianco";

                if(color_number == "11")
                    return "bianco,alluminio";

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
                    return "bianco,verde";
            

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
                
            
            
                    
            }

            function getMaterial(id,desc_it, desc_en){
                if(
                    ( desc_it.indexOf(" all") != -1 && desc_en.indexOf(" alu") != -1) ||
                    ( desc_it.indexOf(" alu") != -1 && desc_en.indexOf(" alu") != -1) 
                ){
                    return "alluminio";
                }
                return 0;
                    
            }

            function hasHalogen(id,desc_it, desc_en){
                if( desc_it.indexOf(" alo") != -1 && desc_en.indexOf(" halo") != -1)
                    return 1;
                return 0;
            }

            function getSize(desc_it, desc_en){
                if(desc_en.indexOf("large") != -1)
                    return "grande";
                else{
                    if(desc_en.indexOf("small") != -1)
                        return "piccola";
                    else{
                        if(desc_en.indexOf("medi") != -1 || desc_en.indexOf("med.") != -1)
                            return "media";
                        else{
                            if(desc_en.indexOf("mini ") != -1)
                                return "mini";
                            else{
                                if(desc_en.indexOf("xxs") != -1)
                                    return "xxs";
                                else{
                                    if(desc_en.indexOf("xxl") != -1)
                                        return "xxl";
                                    else{
                                        if(desc_en.indexOf("xl") != -1)
                                            return "xl";
                                        else{
                                            if(desc_en.indexOf("xs") != -1)
                                                return "xs";
                                            else{
                                                return undefined;
                                            }  
                                        }  
                                    }   
                                }   
                            }   
                        }    
                    }    
                }
            }

            function getScrew(desc_it,desc_en){
                var desc_tot = desc_it+" "+desc_en;
                var desc_arr = desc_tot.split(" ");
                var ret = undefined;
                _.each(desc_arr,function(str){
                    if(str.length <= 3)
                        ret = str;
                });

                if(ret == "e27" || ret == "e14" || ret == "g9"){
                    return ret;
                }
                return undefined
                
            }

            

        }
        else{
            /* ================================================================= VISTOSI */
            if(fornitore == "vistosi"){
                
                supplier = "vistosi";
                supplier_id = supplierId(supplier);
                model = getModel(row["Descrizione"]);
                model_id = modelId(model);
                original_item_id = row["Codice articolo"];
                item_id = itemId(original_item_id);
                hicId = getHicId(supplier_id, item_id);
                ean13 = undefined;
                price = getPrice(row["Prezzo"]);
                color = getColor(row["Descrizione"]);
                desc_it = undefined; // da prendere dai word
                desc_en = undefined; // da prendere dai word
                cleaned_desc_it = undefined;
                cleaned_desc_en = undefined;
                dimmer = undefined;
                led = hasLed(row["Descrizione"]);
                halogen = hasHalogen(row["Descrizione"]);
                screw = getScrew(row["Descrizione"]);
                switcher = undefined;
                category = getCategory(row["Descrizione"]);
                type = getType(original_item_id);
                size = getSize(row["Descrizione"]);;
                outdoor = undefined;
                max_discount = undefined;

                path = getPath(model, type, color);
                



                function getModel(desc){
                    var desc_arr = descToArray(desc);
                    return desc_arr[0];
                }

                function descToArray(desc){
                    var desc_cleaned = desc.replace(/  +/g, ' '); // elimino spazi multipli
                    var desc_arr = desc_cleaned.split(" ");
                    return desc_arr;
                }

                function itemId(item_id){
                    item_id = S(item_id).replaceAll(" ","-").s;
                    return item_id;
                }

                function getPrice(str){
                    var str_cleaned = str.replace("¤","");
                        str_cleaned = str_cleaned.replace(/  +/g, ' '); // elimino spazi multipli
                        str_cleaned = str_cleaned.replace(",","").replace(".",",");
                        return parseFloat(str_cleaned);

                }
                
                function getCategory(desc){
                    var desc_arr = descToArray(desc);
                        
                    

                    if( indexOfInArray(desc_arr,"SOSP") != -1 ){
                        return ["sospensione"];
                    }
                    
                    else{
                        if( indexOfInArray(desc_arr,"TAVO") != -1 ){
                            return ["tavolo"];
                        }
                        
                        else{
                            if( indexOfInArray(desc_arr,"PLAFO") != -1 || indexOfInArray(desc_arr,"FARET") != -1 ){
                                return ["soffitto"];
                            }
                            
                            else{
                                if( indexOfInArray(desc_arr,"APPLI") != -1 ){
                                    return ["parete"];
                                }
                                
                                else{
                                    if( indexOfInArray(desc_arr,"TERRA") != -1 ){
                                        return ["terra"];
                                    }
                                    
                                    else{
                                        if( indexOfInArray(desc_arr,"PL/AP") != -1 ){
                                            return ["soffitto","parete"];
                                        }
                                        
                                        else{
                                            return ["altro"];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    

                        
                }

                function getColor(desc){
                    var desc_arr = descToArray(desc);
                    var colors = [];
                    

                    if( indexOfInArray(desc_arr,"BIANC") != -1 || indexOfInArray(desc_arr,"BCO") != -1 ){
                        if(desc_arr.filter(i => i === "BIANCO").length > 1) // è il caso in cui c'è "BIANCO BIANCO"
                            colors.push("bianco");
                        colors.push("bianco");
                    }
                    if( indexOfInArray(desc_arr," NER") != -1 ){
                        colors.push("nero");
                    }
                    if( indexOfInArray(desc_arr,"BCO/NER") != -1 ){
                        colors.push("bianco");
                        colors.push("nero");
                    }
                    if( indexOfInArray(desc_arr,"NER/NR") != -1 ){
                        colors.push("nero");
                    }
                    if( indexOfInArray(desc_arr,"CRO/GR") != -1 ){
                        colors.push("cromo");
                        colors.push("grigio");
                    }
                    if( indexOfInArray(desc_arr,"VERDE") != -1 ){
                        colors.push("verde");
                    }
                    if( indexOfInArray(desc_arr,"ROSA") != -1 ){
                        colors.push("rosa");
                    }
                    if( indexOfInArray(desc_arr,"GRIGIO") != -1 ){
                        colors.push("grigio");
                    }
                    if( indexOfInArray(desc_arr,"GIALLO") != -1 ){
                        colors.push("giallo");
                    }
                    if( indexOfInArray(desc_arr,"CROMO") != -1 ){
                        colors.push("cromo");
                    }
                    if( indexOfInArray(desc_arr,"AMETIST") != -1 ){
                        colors.push("ametista");
                    }
                    if( indexOfInArray(desc_arr,"AMBRA") != -1 ){
                        colors.push("ametista");
                    }
                    if( indexOfInArray(desc_arr,"SABBIA") != -1 ){
                        colors.push("sabbia");
                    }
                    if( indexOfInArray(desc_arr,"TABACCO") != -1 ){
                        colors.push("tabacco");
                    }
                    if( indexOfInArray(desc_arr,"MARRON") != -1 ){
                        colors.push("marrone");
                    }
                    if( indexOfInArray(desc_arr,"ARANCIO") != -1 ){
                        colors.push("arancio");
                    }
                    if( indexOfInArray(desc_arr,"TOPAZIO") != -1 ){
                        colors.push("topazio");
                    }
                    if( indexOfInArray(desc_arr,"AVIO") != -1 ){
                        colors.push("blu avio");
                    }
                    if( indexOfInArray(desc_arr," BLU") != -1 ){
                        colors.push("blu");
                    }
                    if( indexOfInArray(desc_arr,"MULTICOL") != -1 ){
                        colors.push("multicolore");
                    }
                    if( indexOfInArray(desc_arr,"MA/BLU") != -1 ){
                        colors.push("marrone");
                        colors.push("blu");
                    }
                    if( indexOfInArray(desc_arr,"AL-BRO") != -1 ){
                        colors.push("alessandrite");
                        colors.push("bronzo");
                    }
                    if( indexOfInArray(desc_arr,"NI NER") != -1 ){
                        colors.push("nichel");
                        colors.push("nero");
                    }



                    /// mancano "PIUMATO", "NUVOLA" e "AVENTUR" che non so cosa siano
                    if( indexOfInArray(desc_arr,"SFUMAT") != -1 ){
                        colors.push("sfumato");
                    }
                    if( indexOfInArray(desc_arr,"CROMO") != -1 ){
                        colors.push("cromo");
                    }
                    if( indexOfInArray(desc_arr,"BRONZO") != -1 ){
                        colors.push("bronzo");
                    }
                    if( indexOfInArray(desc_arr,"SETA") != -1 ){
                        colors.push("seta");
                    }
                    if( indexOfInArray(desc_arr,"ORO") != -1 ){
                        colors.push("oro");
                    }
                    if( indexOfInArray(desc_arr,"ARGEN") != -1 ){
                        colors.push("argento");
                    }
                    if( indexOfInArray(desc_arr,"RAME") != -1 ){
                        colors.push("rame");
                    }
                    if( indexOfInArray(desc_arr,"SATI") != -1 || indexOfInArray(desc_arr,"SAT.") != -1 ){
                        colors.push("satinato");
                    }
                    if( indexOfInArray(desc_arr,"RIGATO") != -1 ){
                        colors.push("rigato");
                    }
                    if( indexOfInArray(desc_arr,"FUME") != -1 ){
                        colors.push("fume");
                    }
                    if( indexOfInArray(desc_arr,"TRASPAR") != -1 ){
                        colors.push("trasparente");
                    }
                    if( indexOfInArray(desc_arr,"CRISTAL") != -1 ){
                        colors.push("cristallo");
                    }
                    if( indexOfInArray(desc_arr,"ACCIA") != -1 ){
                        colors.push("acciaio");
                    }
                    if( indexOfInArray(desc_arr,"OTTONE") != -1 ){
                        colors.push("ottone");
                    }
                    if( indexOfInArray(desc_arr,"NICHEL") != -1 || indexOfInArray(desc_arr,"NICKEL") != -1 || indexOfInArray(desc_arr," NI ") != -1 ){ 
                        colors.push("nichel");
                    }
                    if( indexOfInArray(desc_arr,"METALL") != -1 ){
                        colors.push("metalizzato");
                    }
                    if( indexOfInArray(desc_arr,"LUCIDO") != -1 ){
                        colors.push("lucido");
                    }
                    if( indexOfInArray(desc_arr,"SPECCH") != -1 ){
                        colors.push("specchiato");
                    }
                    if( indexOfInArray(desc_arr,"MURRINA") != -1 ){
                        colors.push("murrina");
                    }
                    if( indexOfInArray(desc_arr,"LEGNO") != -1 ){
                        colors.push("legno");
                    }
                    if( indexOfInArray(desc_arr,"BALOTON") != -1 ){
                        colors.push("baloton");
                    }
                    if( indexOfInArray(desc_arr,"ALESSAN") != -1 ){
                        colors.push("alessandrite");
                    }
                    if( indexOfInArray(desc_arr,"BOLEGO.") != -1 ){
                        colors.push("bolegoso");
                    }
                    if( indexOfInArray(desc_arr,"PLASTIC") != -1 ){
                        colors.push("plastica");
                    }
                    if( indexOfInArray(desc_arr,"OPACO") != -1 ){
                        colors.push("opaco");
                    }
                    
                    
                    return colors;

                        
                }

                function hasLed(desc){
                    if(desc.indexOf(" LED") != -1)
                        return 1;
                    return 0;
                }
                
                function hasHalogen(desc){
                    if( desc.indexOf(" ALO") != -1)
                        return 1;
                    return 0;
                }

                function getPath(model, type, color){
                    model = model.toLowerCase();

                    

                    _.each(files_json, function(file){
                        let file_model = file.model.toLowerCase();
                        
                        if(file_model == model){
                            if(model == "aliki")
                                _.log(count++);
                                /*
                                let type_intersection = _.intersection(file.type, type);
                                let color_intersection = _.intersection(file.color, color);
                                if(!_.isEmpty(type_intersection))
                                    if(!_.isEmpty(color_intersection))
                                        _.log(file.path)
                                */
                            
                            
                        }
                    });
                    
                }
            
                function getType(id){
                    let prefisso = id.substr(0,2);
                    let prefisso3 = id.substr(0,3);

                    if( 
                        prefisso=="VT" || prefisso=="VZ" || prefisso=="VP" || prefisso=="VS" || prefisso=="VA" || prefisso=="VB" || prefisso=="VC" ||
                        prefisso=="VR" || prefisso=="VM" || prefisso=="VL" || prefisso=="VE" || prefisso=="VF" || prefisso=="VD"
                    )
                        return ["vetro"];
                    else {
                        if (prefisso == "AP")
                            return ["applique"];
                        else {
                            if (prefisso == "SP")
                                return ["sospensione"];
                            else {
                                if (prefisso == "FA")
                                    return ["faretto"];
                                else {
                                    if (prefisso == "PT")
                                        return ["piantana"];
                                    else {
                                        if (prefisso == "PL")
                                            return ["plafone"];
                                        else {
                                            if (prefisso == "RO")
                                                return ["rosone"];
                                            else {
                                                if (prefisso == "PP")
                                                    return ["plafone/applique"];
                                                else {
                                                    if (prefisso == "LT")
                                                        return ["lettura"];
                                                    else {
                                                        if (prefisso == "CV" || prefisso == "CA")
                                                            return ["cavo"];
                                                        else {
                                                            if (prefisso == "FI") {
                                                                if (prefisso3 == "FIS")
                                                                    return ["fischer"];
                                                                else
                                                                    return ["vetro"];
                                                            }
                                                            else {
                                                                if (prefisso == "BI") {
                                                                    return ["raccoglitore"];
                                                                }
                                                                else {
                                                                    if (prefisso == "KI") {
                                                                        return ["kit"];
                                                                    }
                                                                    else {
                                                                        if (prefisso == "SC") {
                                                                            return ["scatola"];
                                                                        }
                                                                        else {
                                                                            return ["altro"];
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

                function getSize(desc){
                    if(desc.indexOf(" MINI") != -1){
                        return "mini";
                    }
                    else{
                        if(desc.indexOf(" PICCO") != -1){
                            if(desc.indexOf(" PICCOD5") != -1){
                                return "piccola d5";
                            }
                            if(desc.indexOf(" PICCOD4") != -1){
                                return "piccola d4";
                            }
                            if(desc.indexOf(" PICCOD3") != -1){
                                return "piccola d3";
                            }
                            if(desc.indexOf(" PICCOD2") != -1){
                                return "piccola d2";
                            }
                            if(desc.indexOf(" PICCOD1") != -1){
                                return "piccola d1";
                            }
                            else
                                return "piccola";
                        }
                        else{
                            if(desc.indexOf(" MEDIA") != -1){
                                if(desc.indexOf(" MEDIAD5") != -1){
                                    return "media d5";
                                }
                                if(desc.indexOf(" MEDIAD4") != -1){
                                    return "media d4";
                                }
                                if(desc.indexOf(" MEDIAD3") != -1){
                                    return "media d3";
                                }
                                if(desc.indexOf(" MEDIAD2") != -1){
                                    return "media d2";
                                }
                                if(desc.indexOf(" MEDIAD1") != -1){
                                    return "media d1";
                                }
                                else
                                    return "media";
                            }
                            else{
                                if(desc.indexOf(" GRAND") != -1){
                                    if(desc.indexOf(" GRANDD5") != -1){
                                        return "grande d5";
                                    }
                                    if(desc.indexOf(" GRANDD4") != -1){
                                        return "grande d4";
                                    }
                                    if(desc.indexOf(" GRANDD3") != -1){
                                        return "grande d3";
                                    }
                                    if(desc.indexOf(" GRANDD2") != -1){
                                        return "grande d2";
                                    }
                                    if(desc.indexOf(" GRANDD1") != -1){
                                        return "grande d1";
                                    }
                                    else
                                        return "grande";
                                }
                                else{
                                    if(desc.indexOf(" XL") != -1){
                                        return "xl";
                                    }
                                }
                            }
                        }
                    }
                }
                    
                function getScrew(desc){
                    let finale = desc.substr(desc.lastIndexOf(" ")+1);
                    if(
                        finale == "E27" || finale == "J63" || finale == "GF3" || finale == "GE3" || finale == "J53" || finale == "CA2" ||
                        finale == "14E" || finale == "G9" || finale == "FL" || finale == "AA2" || finale == "EB3" || finale == "FB3" ||
                        finale == "I13" || finale == "GA3" || finale == "J13" || finale == "EA3" || finale == "I03" || finale == "FJ3" || 
                        finale == "L13" || finale == "DB2" || finale == "DA2" || finale == "XA3" || finale == "W13" || finale == "U13" ||
                        finale == "VA3" || finale == "3E" || finale == "FA3" || finale == "N13" || finale == "AO3" || finale == "EL" ||
                        finale == "OA3" || finale == "Q13" || finale == "RA3" || finale == "TA3" || finale == "S13" || finale == "J03" ||
                        finale == "GJ3" || finale == "I23" || finale == "J23" || finale == "GC3" || finale == "J33" || finale == "BA2" ||
                        finale == "J73" || finale == "GG3" || finale == "I73" || finale == "FG3" || finale == "FC3" || finale == "OG3" || 
                        finale == "N73" || finale == "I33" || finale == "N33" || finale == "N73" || finale == "OC3" || finale == "I53" || 
                        finale == "FE3" || finale == "GB3" || finale == "FH3" || finale == "I83" || finale == "I33"

                    )
                        return finale ;
                    else
                        return undefined;
                        
                }

                
                
                
            }
        }

        

        

        return{
            supplier:               supplier,                           // nome del fornitore
            supplier_id :           supplier_id,                        // identificativo del fonitore
            model:                  model,                              // modello/famiglia dell'articolo
            model_id:               model_id,                           // identificativo della famiglia di articolo ottenuto con replace(" ","_");
            original_item_id:       original_item_id,                   // id originario (NON MANIPOLATO) dell'articolo
            item_id:                item_id,                            // l'id originario manipolato
            hicId:                  hicId,                              // identificativo interno ottenuto come supplier_id + item_id
            ean13:                  ean13,                              // codice a barre
            price:                  price,                              // imponibile
            color:                  color,                              // prova a recuperare il colore dall'id
            desc_it:                cleaned_desc_it,                    // la descrizione in italiano
            desc_en:                cleaned_desc_en,                    // la descrizione in inglese 
            dimmer:                 dimmer,                             // se ha il dimmer o meno
            led:                    led,                                // se ha il led o meno
            halogen:                halogen,                            // se ha lampada alogena
            screw:                  screw,                              // tipo di attacco
            switcher:               switcher,                           // se ha l'interruttore o meno
            category:               category,                           // terra, tavolo, sospensione, soffitto, parete, montatura, kit, diffusore, set,
            type:                   type,                               // tipo di lampada
            size:                   size,                               // piuccola, media, grande,....
            outdoor:                outdoor,                            // se è da esterno o meno
            max_discount:           undefined,                          // massimo sconto applicabile
            path:                    path,                               // array dei path delle immagini
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



function getHicId(supplier_id, item_id){
    return supplier_id+"_"+item_id;
}


function indexOfInArray(arr,str){

    for(var i=0; i<arr.length; i++){
        if(_.isObject(arr[i])) {  // array di oggetti
            if(arr[i].text.indexOf(str) >= 0){
                return i;
            }
        }
        if(_.isArray(arr[i])){ // array di array
            for(var j=0; j<arr[i].length; j++){
                if(arr[i][j].indexOf(str) != -1){
                    return i;
                }
            }
        }
        if(_.isString(arr[i])){ // array di stringhe
            if(arr[i].indexOf(str) != -1){
                return i;
            }
        }
    }
    return -1;

}


