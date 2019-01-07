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

                                        // provo a leggere il json delle descrizioni di ogni fornitore
                                        fs.readFile('./'+cartella+'/docx_json.json', 'utf8', function(err, contents) {
                                            let desc_json = ( _.is(contents) )? JSON.parse(contents) : {};

                                            // provo a leggere il json delle immagini di ogni fornitore
                                            // al success procedo con adjustRow
                                            fs.readFile('./'+cartella+'/images_json.json', 'utf8', function(err, contents) {
                                               let images_json = ( _.is(contents) )? JSON.parse(contents) : {};
                                                _.each(json_fornitore,function(row){
                                                    if(!rigaVuota(row)){
                                                        json_aumentato.push(adjustRow(row,cartella,images_json, desc_json));
                                                    }   
                                                });

                                                fs.writeFile(path_cartella +"/result/"+cartella+'.json', JSON.stringify(json_fornitore, null, 4), 'utf8', function(){
                                                //_.log("FINITO");
                                                });

                                                fs.writeFile(path_cartella +"/result/"+cartella+'_aumentato.json', JSON.stringify(json_aumentato, null, 4), 'utf8', function(){
                                                    //_.log("FINITO");
                                                });

                                                let xls = json2xls(json_aumentato);

                                                fs.writeFileSync(path_cartella +"/result/"+cartella+'_aumentato.xlsx', xls, 'binary');
                                                
                                            });

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




function adjustRow(row,fornitore,images_json, desc_json){

        var supplier = undefined;
        var supplier_id = undefined;
        var model = undefined;
        var original_model_id = undefined;
        var model_id = undefined;
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
        var category = undefined;   // è un array di categorie, i possibili valori sono: terra | tavolo | parete | soffitto | sospensione | altro (nel caso di "altro" quando possibile viene anche specificato di cosa si tratta, tipo: kit, vetro....)
        var type = undefined;       // è un valore unico ovvero una stringa
        var size = undefined;
        var outdoor = undefined;
        var max_discount = undefined;
        var more = undefined;
        var path = undefined;

    

        /* ================================================================= FOSCARINI */
        if(fornitore == "foscarini"){

            var model_names = [
                "ALLEGRETTO",   // il nome del modello può contenere le stringhe vivace, assai, ritmico
                "ALLEGRO",      // il nome del modello può contenere le stringhe vivace, assai, ritmico
                "ANISHA",
                "APLOMB",
                "ARUMI",
                "BAHIA",
                "BAHIA MINI",
                "BEHIVE",
                "BIG BANG",
                "BINIC",
                "BIRDIE",
                "BIT",
                "BLOB S",
                "BUDS",
                "CABOCHE",
                "CAIIGO",
                "CHOUCHIN",
                "CIRCUS",
                "COLIBRI",
                "CRI-CRI",
                "DOLL",
                "DOLMEN",
                "DOUBLE",
                "ELLEPI",
                "ESA",
                "FIELDS",
                "FILO",
                "FOLIO",
                "GEM",
                "GIGA-LITE",
                "GREGG",
                "HAVANA",
                "INNERLIGHT",
                "JAMAICA",
                "KITE",
                "KURAGE",
                "LAKE",
                "LE SOLEIL",
                "LIGHTWING",
                "LUMIERE",
                "LUMIERE", // il nome del modello può contenere le stringhe 2th, xxl, xxs
                "MAGNETO",
                "MAKI",
                "MITE",
                "NUAGE",
                "ORBITAL",
                "O-SPACE",
                "PLANET",
                "PLASS",
                "POLY GREGG",
                "RITUALS",
                "RITUALS XL",
                "SATELLIGHT",
                "SPOKES",
                "SPOKES 2 LARGE",
                "SUPERNOVA",
                "TARTAN",
                "TITE",
                "TIVU",
                "TRESS",
                "TRESS STILO",
                "TROAG",
                "TROPICO",
                "TUAREG",
                "TUTU'",
                "TWICE AS TWIGGY",
                "TWIGGY",
                "TWIGGY LETTURA",
                "TWIGGY XL",
                "UTO",
                "YOKO"
            ]
            
            var articolo = row["Articolo"];
            
            if(articolo.indexOf(" GB")!=-1){
                return false; // escludiamo gli articoli per il mercato inglese
            }
            else{
                articolo = articolo;
                supplier = "foscarini";
                supplier_id = supplierId(supplier);
                model = getModel(articolo,model_names);
                original_model_id = row["Codice Componente"];
                model_id = S(original_model_id).replaceAll(" ","_").s; 
                item_id = model_id;
                hicId = getHicId(supplier_id, item_id);
                ean13 = undefined;
                price = row["Europa"];
                color = getColor(articolo);
                category = getCategory(articolo);
            }
                

            function getColor(articolo){
                colors = [];
                if( articolo.indexOf("BIA") != -1 || articolo.indexOf("WHITE ") != -1 ){
                    if( articolo.indexOf("BIANCO CALDO") != -1 ){
                        colors.push("bianco caldo");
                    }
                    if( articolo.indexOf("BIANCO CALDO") != -1 ){
                        colors.push("bianco caldo");
                    }
                    else{
                        colors.push("bianco");
                    }
                }
                if( articolo.indexOf("NERO") != -1 || articolo.indexOf("NERA") != -1 ){
                    colors.push("nero");
                }
                if( articolo.indexOf("CROMO") != -1 || articolo.indexOf("CR.") != -1 ){
                    colors.push("cromo");
                }
                if( articolo.indexOf("ARANCIO") != -1 || articolo.indexOf("ARAN.") != -1 ){
                    colors.push("arancio");
                }
                if( articolo.indexOf("GIALLO") != -1 || articolo.indexOf("GIAL.") != -1 || articolo.indexOf("GIAL ") != -1 || articolo.indexOf("GIALL.") != -1  || articolo.indexOf("G.ORO") != -1 ){
                    colors.push("giallo");
                }
                if( articolo.indexOf("ORO") != -1 ){
                    colors.push("oro");
                }
                if( articolo.indexOf("ALLU") != -1){
                    colors.push("alluminio");
                }
                if( articolo.indexOf("TURCHESE") != -1){
                    colors.push("turchese");
                }
                if( articolo.indexOf("AVORIO") != -1){
                    colors.push("avorio");
                }
                if( articolo.indexOf("VERDE") != -1){
                    if( articolo.indexOf("VERDE ACQUA") != -1){
                        colors.push("verde acqua");
                    }
                    else{
                        colors.push("verde");
                    }
                }
                if( articolo.indexOf("GRIG") != -1){
                    colors.push("grigio");
                }
                if( articolo.indexOf("AMBRA") != -1){
                    colors.push("ambra");
                }
                if( articolo.indexOf("ROSSO") != -1){
                    colors.push("rosso");
                }
                if( articolo.indexOf("ROSA") != -1){
                    colors.push("rosa");
                }
                if( articolo.indexOf("CILIEGIA") != -1){
                    colors.push("ciliegia");
                }
                if( articolo.indexOf("AZZURRO") != -1){
                    colors.push("azzurro");
                }
                if( articolo.indexOf("CHAMP") != -1){
                    colors.push("champagne");
                }
                if( articolo.indexOf("GR.CR.") != -1){
                    colors.push("grigio cromo");
                }
                if( articolo.indexOf("MULTICOLORE") != -1){
                    colors.push("multicolore");
                }
                if( articolo.indexOf("RAME") != -1){
                    colors.push("rame");
                }
                if( articolo.indexOf("GRAFITE") != -1){
                    colors.push("grafite");
                }
                if( articolo.indexOf("GREIGE") != -1){
                    colors.push("greige");
                }
                if( articolo.indexOf("CREMISI") != -1){
                    colors.push("cremisi");
                }
                if( articolo.indexOf("INDACO") != -1){
                    colors.push("indaco");
                }
                if( articolo.indexOf("CARMINIO") != -1){
                    colors.push("carminio");
                }
                if( articolo.indexOf("MARRONE") != -1){
                    colors.push("marrone");
                }
                if( articolo.indexOf("ANTR") != -1){
                    colors.push("antracite");
                }
                if( articolo.indexOf("AMARANTO") != -1){
                    colors.push("amaranto");
                }
                if( articolo.indexOf("IZMIR") != -1){
                    colors.push("izmin");
                }
                if( articolo.indexOf("EMERALD KING") != -1){
                    colors.push("emerald king");
                }
                if( articolo.indexOf("RUBY JAYPURE") != -1){
                    colors.push("ruby jaypure");
                }
                if( articolo.indexOf("TEODORA") != -1){
                    colors.push("teodora");
                }
                if( articolo.indexOf("SOUTHERN TALISMAN") != -1){
                    colors.push("southern talisman");
                }
                if( articolo.indexOf("EASTERN CORAL") != -1){
                    colors.push("eastern coral");
                }
                if( articolo.indexOf("AMETHYST QUEEN") != -1){
                    colors.push("amethyst queen");
                }
                if( articolo.indexOf("KOH-I-NOOR") != -1){
                    colors.push("koh-i-noor");
                }
                if( articolo.indexOf("CARMINIO") != -1){
                    colors.push("carminio");
                }
                if( articolo.indexOf("COLORATO") != -1){
                    colors.push("colorato");
                }
                if( articolo.indexOf("BRONZO") != -1){
                    colors.push("bronzo");
                }
                if( articolo.indexOf("BLU") != -1){
                    colors.push("blu");
                }
                if( articolo.indexOf("TRAS") != -1){
                    colors.push("trasparente");
                }
                if( articolo.indexOf("NATURALE") != -1){
                    colors.push("naturale");
                }
                

                return colors;

                    
            }
            


            function getModel(articolo,model_names){
                for(var i=0; i<model_names.length; i++){
                    if( articolo.indexOf(model_names[i]) != -1 ){
                        return model_names[i];
                    }
                }
            }

            function getCategory(articolo){
                var category = [];
                if( articolo.indexOf(" SOS") != -1 ){
                    category.push("sospensione");
                }
                else{
                    if( articolo.indexOf("TERRA") != -1 ){
                        category.push("terra");
                    }
                    else{
                        if( articolo.indexOf("TAV") != -1 ){
                            category.push("tavolo");
                        }
                        else{
                            if( articolo.indexOf("SOFFITTO") != -1 ){
                                category.push("soffitto");
                            }
                            else{
                                if( articolo.indexOf("PARETE") != -1 )
                                    category.push("parete");
                            }
                        }
                            
                    }
                }

                return category;
                    
            }

            

            
            
            
            

            

        }
        else{
            /* ================================================================= VISTOSI */
            if(fornitore == "vistosi"){
                
                supplier = "vistosi";
                supplier_id = supplierId(supplier);
                model = getModel(row["Descrizione"]);
                original_model_id = row["Codice articolo"];
                model_id = modelId(model);
                item_id = itemId(original_model_id);
                hicId = getHicId(supplier_id, item_id);
                ean13 = undefined;
                price = getPrice(row["Prezzo"]);
                color = getColor(row["Descrizione"]);
                desc_it = getDescription(model,desc_json,"it"); // da prendere dai word
                desc_en = getDescription(model,desc_json,"en"); // da prendere dai word
                cleaned_desc_it = desc_it;
                cleaned_desc_en = desc_en;
                dimmer = undefined;
                led = hasLed(row["Descrizione"]);
                halogen = hasHalogen(row["Descrizione"]);
                screw = getScrew(row["Descrizione"]);
                switcher = undefined;
                category = getCategory(row["Descrizione"]);
                type = getType(original_model_id);
                size = getSize(row["Descrizione"]);;
                outdoor = undefined;
                max_discount = undefined;
                more = getMore(row["Descrizione"],model);
                path = getPath(model, size, category, type, color, more);
                

                



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
                        if(desc_arr.filter(i => i === "BIANCO").length > 1) // è il caso in cui c'è due volte
                            colors.push("bianco");
                        colors.push("bianco");
                    }
                    if( indexOfInArray(desc_arr,"NER") != -1 ){
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
                    if( indexOfInArray(desc_arr,"BLU") != -1 ){
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
                    if( indexOfInArray(desc_arr,"NI") != -1 ){
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
                    if( indexOfInArray(desc_arr,"TRAS") != -1 ){
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

                function getPath(model, size, category, type, color, more){
                    model = model.toLowerCase();
                    var ret = [];
                        
                    _.each(images_json, function(file){
                        let file_model = file.model.toLowerCase();
                
                        // confronto il modello
                        if( file_model.substr(0,4) == model.substr(0,4) ){
                            ret.push(file);
                        }
                    });

                    
                    let ret_scremato = screma(ret,model,size,category,type,color, more);

                    
                    return ret_scremato;                    
                }

                function screma(ret,model,size,category,type,color,more){
                    if(ret.length == 1)
                        return ret;

                    // screma per categoria
                    var ret_scremato_per_category = _.filter(ret,function(elem){
                                                        if(_.is(elem.category) && _.is(category)){

                                                            return _.intersection(elem.category,category).length > 0;
                                                        }
                                                        else{
                                                            return true;
                                                        }
                                                    });
                        if(ret_scremato_per_category.length == 1){
                            return ret_scremato_per_category;
                        }
                        else{

                            // scremo per tipo
                            var ret_scremato_per_type =  _.filter(ret_scremato_per_category,function(elem){
                                                    if(_.is(elem.type) && _.is(type)){
                                                        return elem.type == type;
                                                    }
                                                    else{
                                                        return true;
                                                    }
                                                        
                                                });
                            if(ret_scremato_per_type.length == 1){
                                return ret_scremato_per_type;
                            }

                            else{

                                // scremo per size
                                var ret_scremato_per_size =  _.filter(ret_scremato_per_type,function(elem){
                                    if(_.is(elem.size) && _.is(size))
                                        return elem.size == size;
                                    else
                                        return true;
                                });
                                if(ret_scremato_per_size.length == 1)
                                    return ret_scremato_per_size;
                                else{

                                    //scremo per more
                                    if(_.is(more)){
                                        if(_.is(more.model_number)){

                                            var mod_num = more.model_number.replace("F","");                                            

                                            var ret_scremato_per_model_number = _.filter(ret_scremato_per_size,function(elem){
                                                return elem.name.indexOf(mod_num) != -1
                                            });

                                            if(ret_scremato_per_model_number.length > 0)
                                                ret_scremato_per_size = ret_scremato_per_model_number;
                                        }
                                    }
                                        
                                    return ret_scremato_per_size;
                                }
                                
                            }

                        }
                            
                
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
                                return "piccola";
                        }
                        else{
                            if(desc.indexOf(" MEDIA") != -1){
                                return "media";
                            }
                            else{
                                if(desc.indexOf(" GRAND") != -1){
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
                        finale == "N73" || finale == "I33" || finale == "N33" || finale == "OC3" || finale == "I53" || 
                        finale == "FE3" || finale == "GB3" || finale == "FH3" || finale == "I83" 

                    )
                        return finale ;
                    else
                        return undefined;
                        
                }

                function getMore(desc, model){
                    desc = desc.replace(/  +/g, ' '); // elimino spazi multipli
                    desc = desc.replace(model+" ",""); // elimino il nome del modello
                    var desc_arr = desc.split(" ");

                    var d = undefined;

                    for(var i=0; i<desc_arr.length;i++){
                        if( _.is(getD(desc_arr[i])) ){
                            d = getD(desc_arr[i]);
                        }
                    }


                    var model_number = undefined;
                    
                    
                    
                    for(var i=0; i<desc_arr.length;i++){
                        if( hasNumber(desc_arr[i])  && !_.is(getD(desc_arr[i])) ){
                            model_number = desc_arr[i];
                            break;
                        }
                    }

                    function hasNumber(str) {
                        return !![].filter.call(str, isFinite).length
                    }

                    function getD(str){
                        if(str.indexOf("D1") != -1 )
                            return "d1";
                        if(str.indexOf("D2") != -1)
                            return "d2";
                        if(str.indexOf("D3") != -1)
                            return "d3";
                        if(str.indexOf("D4") != -1)
                            return "d4";
                        if(str.indexOf("D5") != -1)
                            return "d5";
                        return undefined
                    }

                    

                    return {
                        model_number : model_number,
                        d : d,
                    };

                }

                function getDescription(model, desc_json, lingua){
                    var ret = "";
                    _.each(desc_json, function(elem){
                        if(elem.model.toLowerCase() == model.toLowerCase())
                           ret = elem[lingua];
                    })

                    return ret;
                }
                
                
            }
        }

        

        

        return{
            supplier:               supplier,                           // nome del fornitore
            supplier_id :           supplier_id,                        // identificativo del fonitore
            model:                  model,                              // modello/famiglia dell'articolo
            original_model_id:      original_model_id,                  // id originario (NON MANIPOLATO) dell'articolo
            model_id:               model_id,                           // identificativo della famiglia di articolo ottenuto con replace(" ","_");
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
            more:                   more,                               // contiene dei campi aggiuntivi (custom per ogni fornitore)
            outdoor:                outdoor,                            // se è da esterno o meno
            max_discount:           undefined,                          // massimo sconto applicabile


            path_length : (_.is(path))? path.length : "-",
            files : (_.is(path))? stampaNomiFile(path) : "-",


            path:                    path,                              // array dei path delle immagini
        }
}

function stampaNomiFile(arr){
    var ret = "";
    _.each(arr,function(elem){
        ret+= elem.id+", ";
    })
    return ret;
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


