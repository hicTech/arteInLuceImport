var fs = require('fs');
var _ = require("../lib/_node.js");
node_xj = require("xls-to-json");
var json2xls = require('json2xls');
var S = require('string');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var path = "../xls/";

var count = 0;

// node process_excel.js -flos          per fare un solo fornitore
// node process_excel.js                per farli tutti
 
fs.readdir(path, function(err, cartella_fornitore) {
    
    for (var i=0; i<cartella_fornitore.length; i++) {
        let cartella = cartella_fornitore[i];

       

        if(cartella != ".DS_Store"){
            let path_cartella = path+cartella;


            var procedi = true;
            if  ( _.is(process.argv[2]) && _.contains(cartella_fornitore,process.argv[2].replace("-","") ) ){
                if( cartella != process.argv[2].replace("-","") )
                    procedi = false;
            }

            
            if(procedi){
                fs.readdir(path_cartella, (err, files) => {
                    _.log("PROCESSO: "+path_cartella)
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


                                            var json = [];

                                            // provo a leggere il json delle descrizioni di ogni fornitore
                                            fs.readFile('./'+cartella+'/docx_json.json', 'utf8', function(err, contents) {
                                                let desc_json = ( _.is(contents) )? JSON.parse(contents) : {};

                                                // provo a leggere il json delle immagini di ogni fornitore
                                                // al success procedo con adjustRow
                                                fs.readFile('./'+cartella+'/assets_json.json', 'utf8', function(err, contents) {
                                                let assets_json = ( _.is(contents) )? JSON.parse(contents) : {};
                                                
                                                    _.each(json_fornitore,function(row){
                                                        if(!rigaVuota(row)){
                                                            var new_row = adjustRow(row,cartella,assets_json, desc_json);
                                                            if(_.is(new_row))
                                                                json.push(new_row);
                                                        }   
                                                    });

                                                    json_varianti = postProduci(json, cartella).json_varianti;
                                                    json_prodotti = postProduci(json, cartella).json_prodotti;

                                                    

                                                    fs.writeFile(path_cartella +"/result/"+cartella+'.json', JSON.stringify(json_fornitore, null, 4), 'utf8', function(){
                                                    //_.log("FINITO");
                                                    });

                                                    fs.writeFile(path_cartella +"/result/"+cartella+'_aumentato.json', JSON.stringify(json_fornitore, null, 4), 'utf8', function(){
                                                        //_.log("FINITO");
                                                        });

                                                    fs.writeFile(path_cartella +"/result/"+cartella+'_varianti.json', JSON.stringify(json_varianti, null, 4), 'utf8', function(){
                                                        //_.log("FINITO");
                                                    });
                                                    fs.writeFile(path_cartella +"/result/"+cartella+'_prodotti.json', JSON.stringify(json_prodotti, null, 4), 'utf8', function(){
                                                        //_.log("FINITO");
                                                    });

                                                    let xls_aumentato = json2xls(json);
                                                    fs.writeFileSync(path_cartella +"/result/"+cartella+'_aumentato.xlsx', xls_aumentato, 'binary');

                                                    let xls_varianti = json2xls(json_varianti, {fields: ["hicId", "model", "price", "quantity", "attributes", "values", "pic"] });
                                                    fs.writeFileSync(path_cartella +"/result/"+cartella+'_varianti.xlsx', xls_varianti, 'binary');

                                                    let xls_prodotti = json2xls(json_prodotti, {fields: ["hicId", "supplier", "category", "title", "subtitle", "desc_it", "price", "quantity", "delivery_time", "delivery_time_if_not_available","sale", "max_discount", "ean13", "features", "accessories", "pic","meta_title","meta_description"] });
                                                    fs.writeFileSync(path_cartella +"/result/"+cartella+'_prodotti.xlsx', xls_prodotti, 'binary');

                                                    
                                                    const opn = require('opn');
                                                    opn(path_cartella +"/result/"+cartella+'_aumentato.xlsx',{wait:false});

                                                });

                                            });
                        
                                        }
                                    }
                            });

                        }
                        
                    });
                    
                });
            }
            

        }
            
    }



    
});




function adjustRow(row,fornitore,assets_json, desc_json){

        var supplier = undefined;
        var supplier_id = undefined;
        var model = undefined;
        var original_model_id = undefined;
        var model_id = undefined;
        var item_id = undefined;
        var hicId = undefined;
        var ean13 = undefined;
        var price = undefined;
        var quantity = undefined;
        var delivery_time = undefined;
        var delivery_time_if_not_available = undefined;
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
        var component = undefined;
        var component_of = undefined;
        var size = undefined;
        var outdoor = undefined;
        var wire_length = undefined;
        var max_discount = undefined;
        var sale = undefined;
        var more = undefined;
        var title = undefined;
        var subtitle = undefined;
        var pic = undefined;
        var light_schema = undefined;
        var otherColors = undefined;
        var projects = undefined;
        var link = undefined;
        var meta_title = undefined;
        var meta_description = undefined;
        

    

        /* ================================================================= FOSCARINI */
        if( fornitore == "foscarini" ){

            
            var model_names = [
                "ALLEGRETTO VIVACE",
                "ALLEGRETTO ASSAI",
                "ALLEGRETTO RITMICO",   
                "ALLEGRO VIVACE",
                "ALLEGRO ASSAI",
                "ALLEGRO RITMICO",      
                "ANISHA",
                "APLOMB",
                "APLOMB MINI",
                "APLOMB LARGE",
                "ARUMI",
                "BAHIA",
                "BAHIA MINI",
                "BEHIVE",
                "BIG BANG",
                "BINIC",
                "BIRDIE",
                "BIRDIE LETTURA",
                "BIRDIE LED LETTURA",
                "BIRDIE 3",
                "BIRDIE 6",
                "BIRDIE 9",
                "BIT 1",
                "BIT 2",
                "BIT 3",
                "BIT 4",
                "BIT 5",
                "BLOB S",
                "BUDS 1",
                "BUDS 2",
                "BUDS 3",
                "CABOCHE",
                "CAIIGO",
                "CHOUCHIN 1",
                "CHOUCHIN 2",
                "CHOUCHIN 3",
                "CHOUCHIN 1 REVERSE",
                "CHOUCHIN 2 REVERSE",
                "CHOUCHIN 3 REVERSE",
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
                "LUMIERE 25TH",
                "LUMIERE XXS",
                "LUMIERE XXL",
                "MAGNETO",
                "MAKI",
                "MITE",
                "NUAGE",
                "ORBITAL",
                "O-SPACE",
                "PLANET",
                "PLASS",
                "PLASS MEDIA",
                "POLY GREGG",
                "RITUALS 1",
                "RITUALS 2",
                "RITUALS 3",
                "RITUALS XL",
                "SATELLIGHT",
                "SOFFIO",
                "SOLAR",
                "SPOKES 1",
                "SPOKES 2",
                "SPOKES 2 LARGE",
                "SUPERFICIE",
                "SUPERNOVA",
                "TARTAN",
                "TITE 1",
                "TITE 2",
                "TIVU",
                "TRESS",
                "TRESS GRANDE",
                "TRESS STILO",
                "TROAG",
                "TROPICO",
                "TUAREG",
                "TUTU'",
                "TWICE AS TWIGGY",
                "TWIGGY",
                "TWIGGY GRID",
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
                model = ( _.is(getModel(articolo,model_names)) )? getModel(articolo,model_names) : undefined;
                original_model_id = row["Codice Componente"];
                model_id = S(original_model_id).replaceAll(" ","_").s; 
                item_id = model_id;
                hicId = getHicId(supplier_id, item_id);
                ean13 = undefined;
                max_discount = 0;
                sale = 0;
                price = row["Europa"];
                quantity = 0;
                delivery_time = "2-3 gg Italy, 5-6 days UE";
                delivery_time_if_not_available = "Su ordinazione in 10 gg";
                color = getColor(articolo);
                category = getCategory(row["Sottofamiglia"]);
                dimmer = (articolo.indexOf("DIM") != -1)? 1 : 0;
                led = (articolo.indexOf("LED") != -1)? 1 : 0;
                halogen = (articolo.indexOf("ALO") != -1)? 1 : 0;
                screw = getScrew(articolo);
                switcher = (articolo.indexOf("ON/OFF") != -1)? 1 : 0;
                type = undefined;
                component = isComponent(model_id,row["Componente"]);
                component_of = getComponentOf(component, model, category);
                cleaned_desc_it = getDesc(model,category,component,assets_json);
                size = getSize(articolo);
                outdoor = (articolo.indexOf("OUTDOOR") != -1 || row["Sottofamiglia"].indexOf("OUTDOOR") != -1)? 1 : 0;

                wire_length = getWireLength(row["Componente"]);
                title = row["Articolo"];
                subtitle = undefined;
                pic = getPics(model, category, color, component, createAllImgsArr(assets_json), "primary" );
                light_schema = (component == 0)? getLightSchema(model, category, size, assets_json) : undefined;
                otherColors = getPics(model, category, color, component, createAllImgsArr(assets_json), "colors" );
                link = getSupplierSiteLink(model,category,component,assets_json);
                meta_title = undefined;
                meta_description = undefined;
                
                more = JSON.stringify({
                    video : getVideo(model, category, component, createAllVideosArr(assets_json)),
                    link : getLink(model, category, component, createAllLinksArr(assets_json)),
                });
                projects = getProjects(model,category,assets_json);

                if(component == 1){
                    model = row["Componente"];
                }
                
            }
                

            function getColor(articolo){
                colors = [];
                
                if( articolo.indexOf("/BIANCO CALDO") != -1 || articolo.indexOf("/BIANC CALDO") != -1 || articolo.indexOf("/BIAN CALDO") != -1 || articolo.indexOf("/B.CO CALDO") != -1){
                    colors.push("bianco caldo");
                }else{
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
                }
                colors = _.uniq(colors); // pezza volante per evitare che ci sia due volte "bianco caldo";

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
                var ret = "";
                for(var i=0; i<model_names.length; i++){
                    if( articolo.indexOf(model_names[i]) != -1 ){
                        if(model_names[i].length > ret.length)
                            ret = model_names[i];
                    }
                }
                return (ret != "")? ret : undefined;
            }

            function getCategory(sottofamiglia){
                // ritorna un array tipicamente di uno, dopo il primo valore c'è una sottocatagoria (esempio "parete","soffitto")
                // se è outdoor questo viene messo come ultimo valore
                var category = [];
                
                if( sottofamiglia.indexOf("SOSPENSIONE") != -1 ){
                    category.push("sospensione");
                }

                if( sottofamiglia.indexOf("PARETE/SOFFITTO") != -1 ){
                    category.push("soffitto");
                    category.push("parete");
                }
                if( sottofamiglia.indexOf("PARETE") != -1 ){
                    category.push("parete");
                }
                if( sottofamiglia.indexOf("SOFFITTO") != -1 ){
                    category.push("soffitto");
                }
               
                if( sottofamiglia.indexOf("TERRA") != -1 ){
                    category.push("terra");
                }

                if( sottofamiglia.indexOf("LETTURA") != -1 ){
                    category.push("lettura");
                }

                if( sottofamiglia.indexOf("TAVOLO") != -1 ){
                    category.push("tavolo");
                }


               

                return _.uniq(category);
                    
            }

            function getScrew(articolo){
                if(articolo.indexOf("G9") != -1)
                    return "g9";
                else{
                    if(articolo.indexOf("E14") != -1)
                        return "e14";
                    else{
                        if(articolo.indexOf("E27") != -1)
                            return "e27";
                        else{
                           return undefined;
                        }
                    }
                }
            }

            function getSize(articolo){
                if(articolo.indexOf("PICCO") != -1 || articolo.indexOf("PICCC") != -1)
                    return "piccola";
                if(articolo.indexOf("GRAND") != -1)
                    return "grande";
                if(articolo.indexOf("MED") != -1)
                    return "media";
                if(articolo.indexOf(" MINI ") != -1)
                    return "mini";
                if(articolo.indexOf(" LARGE ") != -1)
                    return "large";
                if(articolo.indexOf(" XXS ") != -1)
                    return "xxs";
                if(articolo.indexOf(" XXL ") != -1)
                    return "xxl";
                if(articolo.indexOf(" XS ") != -1)
                    return "xs";
                if(articolo.indexOf(" XL ") != -1)
                    return "xl";
            }
            
            


            function createAllImgsArr(assets_json){
                /*
                    per recuperare le immagini mi creo un array di ausilio da assets_json
                    questo array è composto da elementi del tipo:

                    { 
                        "url": "https://www.foscarini.com/wp-content/uploads/2017/10/OUT_EU_OUT-GREG-sosp-grande.png",
                        "file_name": "OUT_EU_OUT-GREG-sosp-grande.png",
                        "model": "GREGG SOSPENSIONE",
                        "category": "OUTDOOR",
                        "img_type": "light_schema",
                        "primary": false,
                        "colors": []
                    }
                */
                let all_imgs = [];

                
                _.each(assets_json,function(elem){

                    _.each(elem.carousel,function(carousel_elem){
                        all_imgs.push(carousel_elem);
                    });
                    _.each(elem.other_imgs,function(other_imgs_elem){
                        all_imgs.push(other_imgs_elem);
                    });

                    _.each(elem.projects,function(projects_elem){
                        all_imgs.push(projects_elem);
                    });

                    _.each(elem.related_imgs,function(related_imgs_elem){
                        all_imgs.push(related_imgs_elem);
                    });

                    _.each(elem.specs,function(specs_elem){
                        all_imgs.push(specs_elem.light_schema);
                    });

                });
                
                return all_imgs;
                    
            }

            function createAllVideosArr(assets_json){
              
                let all_videos = [];

                _.each(assets_json,function(elem){
                    if( _.is(elem.video) ){
                        all_videos.push({
                            url : elem.video,
                            model: elem.model,
                            category: elem.category
                        })
                    }
                    
                    
                });

                
                return all_videos;
                    
            }

            function createAllLinksArr(assets_json){
                
                let all_links = [];

                _.each(assets_json,function(elem){

                    

                    _.each(elem.specs,function(specs_elem){
                       _.each(specs_elem.downloads,function(link){
                           all_links.push({
                               type: (link.label == "data_sheet")? "download" : "page",
                               link_label : link.label,
                               url: (_.is(link.link))? link.link : link.url,
                               model: elem.model,
                               category: elem.category
                           })
                        }); 
                    });

                });
                
                return all_links;
                    
            }

            function getPics(model, category, colors, component, all_images, caso){
                if(component == 1 && caso == "primary"){
                    // è un ricambio quindi per ora ritorno una foto di default
                    return "http://www.arteinluce.shop/assets_ecommerce/foscarini/component_default_img.jpg"
                }
                // sono 1417 righe di articoli di cui
                // di cui 533 diesel


                var ret = [];
                var cat = category[0];

                _.each(all_images,function(elem){
                    if(elem.img_type != "light_schema"){ // escludo le immagini di tipo "light_schema"
                        /** qui accordiamo le diverse nomencalute di alcuni prodotti presenti sul sito */
                        var elem_model = elem.model;
                        var elem_category = elem.category.toLowerCase();

                        if( sameItem(model, cat, elem_model, elem_category, "pic") ){
                             ret.push(elem);
                        }
                               
                    }
                    
                });

                var arr_pic = [];


    
                _.each(ret,function(elem){
                    if( caso == "primary" ){
                        if(elem.primary)
                            arr_pic.push(elem);
                    }
                    if( caso == "colors" ){
                        if(elem.img_type == "carousel")
                            arr_pic.push(elem);
                    }
                    
                });

                arr_pic = uniqByFileName(arr_pic);

                if(arr_pic.length == 1 && caso == "primary"){
                    arr_pic = arr_pic[0].url;
                }
                else{
                    if(arr_pic.length == 1){
                        arr_pic = "no colors";
                    }
                    else{
                        if(arr_pic.length > 1){
                            
                            var new_arr_pic = _.filter(arr_pic,function(elem){
                                return _.isEqual(elem.colors, colors);
                            })


                            if(new_arr_pic.length == 1){
                                arr_pic = new_arr_pic;
                            }
                            else{
                                // ho notato che in questo punto se fra i colori c'è l'alluminio questo non è determinante ai fini della verifica che elem.colors e colors siano uguali
                                // quindi in questo caso elimino (se viene ritrovato) l'alluminio dai colori sia di arr_pic che colors
                                var new_arr_pic_no_alluminio = _.filter(arr_pic,function(elem){

                                    var new_elem_colors = _.difference(elem.colors,["alluminio"]);// elimino "alluminio" dall'array
                                    var new_colors = _.difference(colors,["alluminio"]);// elimino "alluminio" dall'array
                                    
                                    // uso questo diff perchè _.diff ha quel bug segnalato a Fabris nella mail del 15 gennaio
                                    return new_colors.diff(new_elem_colors).length == 0; //_.difference(new_colors,new_elem_colors).length == 0;

                                });

                                

                                if(new_arr_pic_no_alluminio.length == 1){ 
                                    arr_pic = new_arr_pic_no_alluminio;
                                }
                                    
                                else{
                                    // nulla
                                }
                            }
                        }
                    }
                    
                }


                if(!_.isArray(arr_pic))
                    return arr_pic;
                else{
                    var arr_to_string = "";
                    _.each(arr_pic,function(elem){
                        arr_to_string += elem.url+",";
                    })
                    return arr_to_string;
                }

                 
            }

            function getVideo(model, category, component, all_videos){
                var ret = [];
                if(component == 0){
                    _.each(all_videos, function(video){
                            if( _.is(model) ){ // gli articoli diesel ancora non hanno un model e quindi darebbe errore
                                if( sameItemForVideo(model, category[0].toLowerCase(), video.model, video.category.toLowerCase()) ){
                                    ret.push(escape(video.url));
                                }
                            }
                            
                    })
                }
            
                return _.uniq(ret);

            }

            function getLink(model, category, component, all_links){
                var ret = [];
                if(component == 0){
                    _.each(all_links, function(link){
                            if( _.is(model) ){ // gli articoli diesel ancora non hanno un model e quindi darebbe errore
                                if( sameItemForVideo(model, category[0].toLowerCase(), link.model, link.category.toLowerCase()) ){
                                    ret.push(link)
                                }
                            }
                            
                    })
                }
                
                return uniqByURL(ret);

            }


  
           

            function isComponent(model_id, component){
                    
                    if(
                        component.indexOf("MONT") == 0 || 
                        component.indexOf("KIT ") == 0 || 
                        component.indexOf("-KIT ") != -1 || 
                        component.indexOf("SET ") == 0 || 
                        component.indexOf("VETR") == 0 || 
                        component.indexOf("BASE") == 0 || 
                        component.indexOf("DIMMER") == 0 || 
                        component.indexOf("ASTE") == 0 || 
                        component.indexOf("ROSONE") == 0 || 
                        component.indexOf("MODULO") == 0 || 
                        component.indexOf("PYREX") == 0 || 
                        component.indexOf("ZAVORRA") == 0 || 
                        component.indexOf("CAVALLETTO") == 0 || 
                        component.indexOf("SCHERMO") == 0 || 
                        component.indexOf("GRUPPO") == 0 || 
                        component.indexOf("PICCHETTO") == 0 || 
                        component.indexOf("CILINDRO") == 0 || 
                        component.indexOf("DISCO") == 0 || 
                        component.indexOf("BRACCIO") == 0 || 
                        component.indexOf("LENTE") == 0 || 
                        component.indexOf("PESO ") == 0 || 
                        component.indexOf("1/2 CIL") == 0 || 
                        component.indexOf("3/4 CIL") == 0 || 
                        component.indexOf("DIFF") == 0 
                    ){
                        return 1;
                    }
                    return 0;
                
                    
            }

            

            function getDesc(model,category,component,assets_json){
                if(component == 1)
                    return undefined;
                var ret = undefined;
                        
                var cat = category[0];
                _.each(assets_json,function(elem){
                    
                    /** qui accordiamo le diverse nomencalute di alcuni prodotti presenti sul sito */
                    var elem_model = elem.model;
                    var elem_category = elem.category.toLowerCase();
                    
                    if( sameItem(model, cat, elem_model, elem_category,"desc") ){
                            ret = elem.desc;
                    }
                        
                });

                return ret;
            }

            function getProjects(model,category,assets_json){
                var ret = [];
                var cat = category[0];

                _.each(assets_json,function(elem){
                    /** qui accordiamo le diverse nomencalute di alcuni prodotti presenti sul sito */
                    var elem_model = elem.model;
                    var elem_category = elem.category.toLowerCase();
                    
                    if( sameItem(model, cat, elem_model, elem_category,"desc") ){
                        _.each(elem.projects,function(project){
                            ret.push(project.url);
                        })
                    }
                        
                });

                return ret;
            }

            function getLightSchema(model, category, size, asset_json){
                var name = model;
                name += (_.is(size))? " "+size.toUpperCase() : "";
                name = S(_.uniq(name.split(" ")).toString()).replaceAll(","," ").s;

                var ret = undefined;

                //_.log(category[0].toUpperCase())

                _.each(asset_json,function(asset){
                    _.each(asset.specs,function(spec){
                        // caso particolare
                        if( spec.model == name && spec.light_schema.category == category[0].toUpperCase() && !_.is(ret))
                            ret = spec.light_schema.url;
                    })
                });

                return ret;

            }

            function getWireLength(str){
                ret = undefined;
                if(str.indexOf("3,5") != -1)
                    ret = "3,5 m";
                if(str.indexOf("10 M") != -1 || str.indexOf("10M") != -1)
                    ret = "10 m";
                if(str.indexOf("H.5M") != -1 || str.indexOf("H.5 M ") != -1 || str.indexOf("H. 5 MT.") != -1)
                    ret = "5 m";
                
                return ret;
            }
            
            function getComponentOf(component, model, category){
                
                if(component == 1){
                    if(_.is(model))
                        return model.toLowerCase() +" "+ category;
                }
                
            }


            function getSupplierSiteLink(model,category,component,assets_json){
                if(component == 1)
                    return undefined;
                var ret = undefined;
                        
                var cat = category[0];
                _.each(assets_json,function(elem){
                    
                    /** qui accordiamo le diverse nomencalute di alcuni prodotti presenti sul sito */
                    var elem_model = elem.model;
                    var elem_category = elem.category.toLowerCase();
                    
                    if( sameItem(model, cat, elem_model, elem_category,"uri") ){
                            ret = elem.uri;
                    }
                        
                });

                return ret;
            }
            
            
            

            

        }
        else{
            /* ================================================================= VISTOSI */
            if( fornitore == "vistosi"){

                var all_models_name = [
                                    "ACCADEMIA","ALIKI","ALMA","ALUM 09","ASSIBA","BACO","BACONA","BIANCA","BOCCIA","CHIMERA","CHIMERA 09",
                                    "CILD","CLEO","CLOTH","COCUMIS","COMARI","CORNER","DAFNE","DAMASCO","DIADEMA","DIAMANTE","DODO","DOGI","DOS",
                                    "DRESS","ECOS","FEREA","FOLLIA","FUOCHI","FUTURA","GIGLIO","GIOGALI","MINIGIOGALI","GIUBILEO","GIUDECCA","GLORIA",
                                    "GOCCIA","GOTO","LAGUNA","LUNAE","LUXOR","MAGIE","MARBLE'","MAREA","MOBY","MORRISE","MUMBA","NINFEA","ENNE LUCI","NORMA",
                                    "OVALINA","PEGGY","PUPPET","REDENTORE","REDER","RIALTO","RIGA","ROMANZA","SAN GIORGIO","SAN MARCO","SEGRETO","SPROUT","STARDUST",
                                    "TAHOMA","THOR","TORCELLO","VEGA","YUBA","CANDELA","BOLLE","BOT","IMPLODE","LUCCIOLA","POC","RINA",
                                    "ALEGA","BISSA","BISSONA","ESSENCE","JO","NAXOS","MUNEGA","NESSA","NOVECENTO","SATA","SEMAI","SPIRIT","TABLO'","TUBES",
                                    "AURORA","BALANCE","BOREALE","INCASS","INFINITA","MORIS","NEBULA","NEOCHIC","NUVOLE","PAGODA","PENTA","POD","QUADRA","QUADRA09","SABA",
                                    "SOFFIO","SOFT","SOGNO","STYLE","TAHOMA ROUND","WITHWHITE","LEPANTO","SMOKING","TREPAI","24PEARLS","ARIA","AUREA",
                                    "BAUTA","CHEOPE 09","CRISTALLINA","GIOGALI 3D","JUBE","SCUSEV","KIRA","LACRIMA","MENDELEE","MIRAGE","NARANZA","NODO","NOON","PUSKIN","SISSI",
                                    "SPHERE","STARNET","STONE","SURFACE"];

                supplier = "vistosi";
                supplier_id = supplierId(supplier);
                model = getModel(row["Descrizione"]);
                original_model_id = row["Codice articolo"];
                model_id = modelId(model);
                item_id = itemId(original_model_id);
                hicId = getHicId(supplier_id, item_id);
                ean13 = undefined;
                max_discount = 0.15;
                sale = 1;
                price = getPrice(row["Prezzo"], max_discount);
                quantity = 0;
                delivery_time = "2-3 gg Italy, 5-6 days UE";
                delivery_time_if_not_available = "Su ordinazione in 2-3 settimane";
                color = getColor(row["Descrizione"]);
                
                dimmer = undefined;
                led = hasLed(row["Descrizione"]);
                halogen = hasHalogen(row["Descrizione"]);
                screw = getScrew(row["Descrizione"]);
                switcher = undefined;
                category = getCategory(row["Descrizione"]);
                var clone = category.slice();
                
                type = getType(original_model_id);
                component = isComponent(row["Descrizione"]);
                component_of = getComponentOf(component, row["Descrizione"]);
                size = getSize(row["Descrizione"]);;
                outdoor = undefined;
                wire_length = undefined;
                
                pic = getPics(row["Descrizione"], model, category, type, assets_json,component, "primary");
                light_schema = getLightSchemaOrName(row["Descrizione"], model, clone, type, assets_json,component, halogen, "light_schema");
                title = getLightSchemaOrName(row["Descrizione"], model, clone, type, assets_json,component, halogen, "title");
                subtitle = row["Descrizione"];
                
                desc_it = getDescription( row["Descrizione"], model,clone,component,assets_json);
                desc_en = desc_it;
                cleaned_desc_it = desc_it;
                cleaned_desc_en = desc_en;

                projects = getProjects( row["Descrizione"], model,clone,component,assets_json);
                link = getSupplierSiteLink( row["Descrizione"], model,clone,component,assets_json );

                //otherColors = getOtherPics(model, size, category, type, color, more);
                more = { instruction : getLightSchemaOrName(row["Descrizione"], model, clone, type, assets_json,component, halogen, "download") }
                

                // una volta calcolati tutti i dati siamo pronti per definire il model degli articoli e dei pazzi di ricambio

                model = getRealModelName(model, component, title, type, component_of);
                meta_title = undefined;
                meta_description = undefined;


                function getModel(desc){
                    var desc_arr = descToArray(desc);
                    var ret = desc_arr[0];


                    if(contains(desc_arr,"VETR"))
                        return "ricambio-vetro";
                    if(contains(desc_arr,"FISC"))
                        return "ricambio-fischer";
                    if(contains(desc_arr,"ROSONE"))
                        return "ricambio-rosone";
                    if(contains(desc_arr,"ROSO"))
                        return "ricambio-rosone";
                    if(contains(desc_arr,"SCATOLA"))
                        return "ricambio-scatola";
                    if(contains(desc_arr,"KIT"))
                        return "ricambio-kit";
                    if(contains(desc_arr,"CAVO"))
                        return "ricambio-cavo";
                    if(contains(desc_arr,"RACCOGLITORE"))
                        return "ricambio-raccoglitore";



                    // alcuni casi speciali
                    if(ret == "GIOGA")
                        ret = "GIOGALI 3D";
                    if(ret == "SANGIORG")
                        ret = "SAN GIORGIO";
                    if(ret == "SANMARCO")
                        ret = "SAN MARCO";
                    if(ret == "TAHOMARO")
                        ret = "TAHOMA ROUND"
                    if(ret == "ALUM" && desc_arr[1]=="09")
                        ret = "ALUM 09"
                    if(ret == "CHEOPE" && desc_arr[1]=="09")
                        ret = "CHEOPE 09"
                    if(ret == "CHIMERA" && desc_arr[1]=="09")
                        ret = "CHIMERA 09"
                    if(ret == "CRISTALL")
                        ret = "CRISTALLINA"
                    if(ret == "ENNELUCI")
                        ret = "ENNE LUCI"
                    if(ret == "MINIGIOG")
                        ret = "MINIGIOGALI"
                    if(ret == "REDENTOR")
                        ret = "REDENTORE"
                    if(ret == "WITHWHIT")
                        ret = "WITHWHITE"
                    if(ret == "NOVECENT")
                        ret = "NOVECENTO"         

                    return ret;
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

                function getPrice(str, max_discount){
                    var str_cleaned = str.replace("¤","").replace("Û ","").replace("ó ",""); 
                        str_cleaned = str_cleaned.replace(/  +/g, ' '); // elimino spazi multipli
                        str_cleaned = str_cleaned.replace(",","");

                        return parseFloat( str_cleaned * (1 - max_discount) ).toFixed(2);;

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

                function getOtherPics(model, size, category, type, color, more){
                    model = model.toLowerCase();
                    var ret = [];
                        
                    _.each(assets_json, function(file){
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
                        prefisso=="VR" || prefisso=="VM" || prefisso=="VL" || prefisso=="VE" || prefisso=="VF" || prefisso=="VD" ||
                        prefisso3=="CVP"
                    )
                        return ["vetro"];
                    else {
                        if (prefisso == "AP")
                            return ["applique"];
                        
                            
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
                                                    if ( (prefisso == "CV" || prefisso == "CA") && prefisso3 != "CAN" )
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
                                                                        return [""];
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

                function isComponent(desc){
                    var desc_arr = descToArray(desc);
                    if(contains(desc_arr,"VETR") || contains(desc_arr,"FISC") || contains(desc_arr,"ROSONE") || contains(desc_arr,"ROSO") || contains(desc_arr,"SCATOLA") || contains(desc_arr,"KIT") || contains(desc_arr,"CAVO") || contains(desc_arr,"RACCOGLITORE"))
                        return 1;
                    return 0;
                }

                function getComponentOf(component, desc){
                    var desc_arr = descToArray(desc);
                    var ret = "";
                    if(component == 1){
                        var trovato = false;
                        desc_arr.map(function(elem){
                                
                                var elem_rettificato = elem;
                                // alcuni casi speciali
                                if(elem_rettificato == "GIOGA")
                                    elem_rettificato = "GIOGALI 3D";
                                if(elem_rettificato == "SANGIORG")
                                    elem_rettificato = "SAN GIORGIO";
                                if(elem_rettificato == "SANMARCO")
                                    elem_rettificato = "SAN MARCO";
                                if(elem_rettificato == "TAHOMARO")
                                    elem_rettificato = "TAHOMA ROUND"
                                if(elem_rettificato == "ALUM" && desc_arr[1]=="09")
                                    elem_rettificato = "ALUM 09"
                                if(elem_rettificato == "CHEOPE" && desc_arr[1]=="09")
                                    elem_rettificato = "CHEOPE 09"
                                if(elem_rettificato == "CHIMERA" && desc_arr[1]=="09")
                                    elem_rettificato = "CHIMERA 09"
                                if(elem_rettificato == "CRISTALL")
                                    elem_rettificato = "CRISTALLINA"
                                if(elem_rettificato == "ENNELUCI")
                                    elem_rettificato = "ENNE LUCI"
                                if(elem_rettificato == "MINIGIOG")
                                    elem_rettificato = "MINIGIOGALI"
                                if(elem_rettificato == "REDENTOR")
                                    elem_rettificato = "REDENTORE"
                                if(elem_rettificato == "WITHWHIT")
                                    elem_rettificato = "WITHWHITE"
                                if(elem_rettificato == "NOVECENT")
                                    elem_rettificato = "NOVECENTO"         
                               

                            _.each(all_models_name,function(model){

                                
                                
                                if(model.indexOf(elem_rettificato) != -1 ){
                                   ret =  model;
                                }


                            })
                        })
                        if(ret != "")
                            return ret;
                        else
                            return "universale";
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

                function getDescription(original_model, model,arr_category,component,assets_json){
                    var ret = undefined;
                    
                    var original_model_arr = descToArray(original_model);
                    if(isOutOfStock(model, arr_category, original_model_arr))
                        return "out of stock"

                    var category = arr_category[0];

                    if(model.toLowerCase() == "lunae"){
                        category = "parete";
                    }
                    if(model.toLowerCase() =="magie" && category=="soffitto"){
                        category = "faretto";
                    }

                    if(model.toLowerCase() =="poc" && category=="soffitto"){
                        category = "faretto";
                    }

                    if(model.toLowerCase() =="tahoma" && category=="soffitto"){
                        category = "faretto";
                    }
                    

                    if(category=="terra"){
                        category = "piantana";
                    }

                    

                    ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                    model = uniformaConListino(model);
                    

                    if(component == 0 ){
                        _.each(assets_json,function(elem){
                            if(model.toLowerCase() == elem.model && category == elem.category)
                                ret = elem.desc;
                        });
                    }
                    if(!_.is(ret) && component == 0){
                        _.log(count++  +")Attenzione description non trovata per model: "+ model+" category: "+category);
                    }
                        
                    else
                        return ret;                      
                }

                function getProjects(original_model, model,arr_category,component,assets_json){
                    var ret = undefined;
                    
                    var original_model_arr = descToArray(original_model);
                    if(isOutOfStock(model, arr_category, original_model_arr))
                        return "out of stock"

                    var category = arr_category[0];

                    if(model.toLowerCase() == "lunae"){
                        category = "parete";
                    }
                    if(model.toLowerCase() =="magie" && category=="soffitto"){
                        category = "faretto";
                    }

                    if(model.toLowerCase() =="poc" && category=="soffitto"){
                        category = "faretto";
                    }

                    if(model.toLowerCase() =="tahoma" && category=="soffitto"){
                        category = "faretto";
                    }
                    

                    if(category=="terra"){
                        category = "piantana";
                    }

                    

                    ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                    model = uniformaConListino(model);
                    

                    if(component == 0 ){
                        _.each(assets_json,function(elem){
                            if(model.toLowerCase() == elem.model && category == elem.category)
                                ret = elem.projects;
                        });
                    }
                    if(!_.is(ret) && component == 0){
                        _.log(count++  +")Attenzione projects non trovati per model: "+ model+" category: "+category);
                    }
                        
                    else
                        return ret;
                        
                }

                function getPics(original_model, model, arr_category, type, assets_json, component, caso){
                    // ==== ==== ==== ==== ==== ==== ==== articoli non presenti, fuori produzione
                    if( 
                        (model == "COCUMIS" || model == "MENDELEE" || model == "SCUSEV" || model == "PUSKIN" || category == "altro") ||
                        (model == "DAMASCO" && arr_category[0] == "soffitto") ||
                        (model == "STARDUST" && arr_category[0] == "tavolo") ||
                        (model == "TUBES" && arr_category[0] == "tavolo") ||
                        (model == "VEGA" && arr_category[0] == "parete")
                    
                    )
                        return "out of stock";

                    // predispongo un array contenente le stringhe delle descrizione originale per confrontarle con le varianti
                    var original_model_arr = descToArray(original_model);
                        if( _.contains(original_model_arr,"GRAND"))
                            original_model_arr.push("g");
                        if( _.contains(original_model_arr,"MEDIA"))
                            original_model_arr.push("m");
                        if( _.contains(original_model_arr,"PICCO"))
                            original_model_arr.push("p");
                        if( _.contains(original_model_arr,"DEST"))
                            original_model_arr.push("dx");
                        if( _.contains(original_model_arr,"SIN"))
                            original_model_arr.push("sx");

                        if(model=="PEGGY"){
                            if( _.contains(original_model_arr,"SOSPE") && _.contains(original_model_arr,"9"))
                                original_model_arr.push("sp 9");
                            if( _.contains(original_model_arr,"SOSPE") && !_.contains(original_model_arr,"9"))
                                original_model_arr.push("sp");
                        }

                        if(model=="JUBE"){
                            if( _.contains(original_model_arr,"SOSPE") && !_.contains(original_model_arr,"1") )
                                original_model_arr.push("sp");
                            if( _.contains(original_model_arr,"SOSPE") && _.contains(original_model_arr,"1") )
                                original_model_arr.push("sp 1g");
                        }

                        if(model=="ACCADEMIA"){
                            if( _.contains(original_model_arr,"30") )
                                original_model_arr.push("30f");    
                        }

                        if(model=="AURORA"){
                            if( _.contains(original_model_arr,"30D1") || _.contains(original_model_arr,"30D2") )
                                original_model_arr.push("30"); 
                            if( _.contains(original_model_arr,"40D1") || _.contains(original_model_arr,"40D2") )
                                original_model_arr.push("40"); 
                            if( _.contains(original_model_arr,"50D1") || _.contains(original_model_arr,"50D2") )
                                original_model_arr.push("50");    
                        }

                        
                    if(component == 1){
                        // è un ricambio quindi per ora ritorno una foto di default
                        return "http://www.arteinluce.shop/assets_ecommerce/vistosi/component_default_img.jpg"
                    }

                    if(component == 0){

                        

                        ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                        model = uniformaConListino(model);
                        
                    
                        
                            
                        
                        var arr_varianti = [];
                        _.each(assets_json,function(elem){
                            _.each(elem.variants,function(variant){
                                var variant_model = variant.model;
                                var variant_category = variant.category;
                                    model = model.toLowerCase();
                                    category = arr_category[0];

                                    if(model=="lunae"){
                                        category = "parete";
                                    }
                                    if(model=="magie" && category=="soffitto"){
                                        category = "faretto";
                                    }

                                    if(model=="poc" && category=="soffitto"){
                                        category = "faretto";
                                    }

                                    if(model=="tahoma" && category=="soffitto"){
                                        category = "faretto";
                                    }

                                    if(category=="terra"){
                                        category = "piantana";
                                    }
                                
                                    if(model == variant_model && category == variant_category){
                                        arr_varianti.push(variant);
                                    }
                                
                            })    
                        });

                        if( arr_varianti.length == 1)
                            return arr_varianti[0].url;
                        else{
                            



                                var arr_varianti_fiter_1 = _.filter(arr_varianti,function(variant){
                                    var ret = false;
                                    _.each(original_model_arr,function(elem){
                                        if( elem.toLowerCase() == variant.variant.toLowerCase() )
                                            ret = true;
                                    })
                                    return ret;
                                })

                                if(arr_varianti_fiter_1.length == 1){
                                    return arr_varianti_fiter_1[0].url;
                                }else{
                                    //_.log(count++);
                                   
                                        //_.log("----------------------model: "+model+"--------category: "+category);
                                        //_.log("----------------------original model: "+original_model_arr);
                                        return arr_varianti.toString;
                                    
                                    
                                }



                                
                                
                            
                            
                        }
                    }
                    
                }

                function getLightSchemaOrName(original_model, model, arr_category, type, assets_json, component, halogen, caso){

                        // predispongo un array contenente le stringhe delle descrizione originale per confrontarle con le varianti
                        var original_model_arr = descToArray(original_model);

                        // ==== ==== ==== ==== ==== ==== ==== articoli non presenti, fuori produzione
                        // ciò è stato determinato in qui casi in cui l'articolo non è presente nel sito
                        
                        if( isOutOfStock(model, arr_category, original_model_arr) )
                            return "out of stock";
                    
                   

                    
                        if(halogen==1)
                            original_model_arr.push("ALOGENO");
                        
                        if( _.contains(original_model_arr,"GA3") || _.contains(original_model_arr,"XA3")  || _.contains(original_model_arr,"I83")  || _.contains(original_model_arr,"I13")  || _.contains(original_model_arr,"N13") ){
                            var led_string = "led 17,5w - 230 volt - 3000k - 1300 lumens - dimmerabile";
                            original_model_arr.push(led_string.toUpperCase());
                        }

                        if( _.contains(original_model_arr,"J13") || _.contains(original_model_arr,"W13") ){
                            var led_string = "led 19,5w - (driver incluso) - 3000k - 2850 lumens - dimmerabile";
                            original_model_arr.push(led_string.toUpperCase());
                        }

                        if( _.contains(original_model_arr,"FA3") || _.contains(original_model_arr,"FH3") ){
                            var led_string = "led 12,5w - (driver incluso) - 3000k - 1650 lumens - dimmerabile";
                            original_model_arr.push(led_string.toUpperCase());
                        }

                        if( _.contains(original_model_arr,"L13") ){
                            var led_string = "led 13w - 230 volt - 3000k - 940 lumens - dimmerabile";
                            original_model_arr.push(led_string.toUpperCase());
                        }

                        if( _.contains(original_model_arr,"14E") ){
                            var led_string = "led 13w - 230 volt - 4000k - 940 lumens - dimmerabile";
                            original_model_arr.push(led_string.toUpperCase());
                            var led_string_2 = "e14";
                            original_model_arr.push(led_string_2.toUpperCase());

                        }
                            
                        
                        if( contains(original_model_arr,"FL"))
                            original_model_arr.push("FLUORESCENTE");
                       
                        if( _.contains(original_model_arr,"GRAND"))
                            original_model_arr.push("G");
                        if( _.contains(original_model_arr,"MEDIA"))
                            original_model_arr.push("M");
                        if( _.contains(original_model_arr,"PICCO"))
                            original_model_arr.push("P");
                        if( _.contains(original_model_arr,"DEST"))
                            original_model_arr.push("DX");
                        if( _.contains(original_model_arr,"SIN"))
                            original_model_arr.push("SX");

                        if(model == "DAMASCO" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"3") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("3P");
                            if( contains(original_model_arr,"3") && contains(original_model_arr,"C") )
                                original_model_arr.push("3C");
                            if( contains(original_model_arr,"4") && contains(original_model_arr,"C") )
                                original_model_arr.push("4C");
                            if( contains(original_model_arr,"5") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("5P");
                            if( contains(original_model_arr,"5") && contains(original_model_arr,"C") )
                                original_model_arr.push("5C");
                            if( contains(original_model_arr,"6") && contains(original_model_arr,"P") )
                                original_model_arr.push("6P");
                            if( contains(original_model_arr,"MEDIAD1") )
                                original_model_arr.push("MD1");
                            if( contains(original_model_arr,"MEDIAD2") )
                                original_model_arr.push("MD2");
                            if( contains(original_model_arr,"GRANDD1") )
                                original_model_arr.push("GD1");
                            if( contains(original_model_arr,"GRANDD2") )
                                original_model_arr.push("GD2");
                        }


                        if(model == "GIOGALI" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"CUBE") )
                                original_model_arr.push("CUB");
                            if( contains(original_model_arr,"JELL") )
                                original_model_arr.push("JEL");
                        }

                        if(model == "NAXOS" && arr_category[0] == "tavolo"){
                            if( contains(original_model_arr,"MINI") )
                                original_model_arr.push("MN");
                        }

                        if(model == "FOLLIA" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"1") && contains(original_model_arr,"PICCO")  )
                                original_model_arr.push("1P");
                            if( contains(original_model_arr,"2") && contains(original_model_arr,"PICCO")  )
                                original_model_arr.push("2P");
                        }

                        if(model == "TABLO'" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"1") && contains(original_model_arr,"GRAND")  )
                                original_model_arr.push("1G");
                            if( contains(original_model_arr,"1") && contains(original_model_arr,"PICCO")  )
                                original_model_arr.push("1P");
                            if( contains(original_model_arr,"2A") && contains(original_model_arr,"GRAND")  )
                                original_model_arr.push("2AG");
                            if( contains(original_model_arr,"2A") && contains(original_model_arr,"PICCO")  )
                                original_model_arr.push("2AP");
                            if( contains(original_model_arr,"2S") && contains(original_model_arr,"GRAND")  )
                                original_model_arr.push("2SG");
                            if( contains(original_model_arr,"2S") && contains(original_model_arr,"PICCO")  )
                                original_model_arr.push("2SP");
                        }

                        if(model == "PAGODA" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"1")  )
                                original_model_arr.push("511");
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"2")  )
                                original_model_arr.push("512");
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"3")  )
                                original_model_arr.push("513");
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"4")  )
                                original_model_arr.push("514");
                        }

                        if(model == "PAGODA" && arr_category[0] == "soffitto"){
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"1")  )
                                original_model_arr.push("511");
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"2")  )
                                original_model_arr.push("512");
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"3")  )
                                original_model_arr.push("513");
                            if( contains(original_model_arr,"51") && contains(original_model_arr,"4")  )
                                original_model_arr.push("514");
                        }

                        if(model == "MINIGIOGALI" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"CLAS") )
                                original_model_arr.push("CLA");
                            if( contains(original_model_arr,"CHAN") )
                                original_model_arr.push("CHA");
                            if( contains(original_model_arr,"CLOU") )
                                original_model_arr.push("CLO");
                            if( contains(original_model_arr,"RAIN") )
                                original_model_arr.push("RAI");
                        }

                        if(model == "OTO" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"CUBE") )
                                original_model_arr.push("CUB");
                            if( contains(original_model_arr,"CHAN") )
                                original_model_arr.push("CHA");
                            if( contains(original_model_arr,"LINE") )
                                original_model_arr.push("LIN");
                            
                            if( contains(original_model_arr,"PEAR") && contains(original_model_arr,"A") )
                                original_model_arr.push("PEAA");
                            if( contains(original_model_arr,"PEAR") && contains(original_model_arr,"B") )
                                original_model_arr.push("PEAB");
                            if( contains(original_model_arr,"PEAR") && contains(original_model_arr,"C") )
                                original_model_arr.push("PEAC");
                            if( contains(original_model_arr,"PEAR") && contains(original_model_arr,"D") )
                                original_model_arr.push("PEAD");
                            if( contains(original_model_arr,"RC55"))
                                original_model_arr.push("R55");
                           
                        }


                        if(model == "WITHWHITE" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"26") && contains(original_model_arr,"XL") )
                                original_model_arr.push("26X");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"XL") )
                                original_model_arr.push("18X");
                        }

                        if(model == "WITHWHITE" && arr_category[0] == "soffitto"){
                            if( contains(original_model_arr,"XL") )
                                original_model_arr.push("X");
                        }

                        

                        if(model == "REDENTORE" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"15F") )
                                original_model_arr.push("15FP");
                            if( contains(original_model_arr,"5F") )
                                original_model_arr.push("5FG");
                            if( contains(original_model_arr,"7F") )
                                original_model_arr.push("7FP");
                        }

                        if(model == "LIO" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"L1") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("L1P");
                            if( contains(original_model_arr,"L2") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("L2P");
                        }


                        if(model == "REDENTORE" && arr_category[0] == "soffitto"){
                            if( contains(original_model_arr,"16F") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("16FP");
                            if( contains(original_model_arr,"16F") && contains(original_model_arr,"GRAND") )
                                original_model_arr.push("16FG");
                            if( contains(original_model_arr,"46F") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("46FP");
                            if( contains(original_model_arr,"46F") && contains(original_model_arr,"GRAND") )
                                original_model_arr.push("46FG");
                            
                        }


                        if(model == "SAN GIORGIO" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"15F") )
                                original_model_arr.push("15FP");
                            if( contains(original_model_arr,"7F") )
                                original_model_arr.push("7FP");
                        }

                        if(model == "SAN GIORGIO" && arr_category[0] == "soffitto"){
                            if( contains(original_model_arr,"16F") )
                                original_model_arr.push("16FP");
                            if( contains(original_model_arr,"46F") )
                                original_model_arr.push("46FP");
                        }

                        if(model == "SAN MARCO" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"5F") )
                                original_model_arr.push("5FG");
                        }

                        if(model == "SAN MARCO" && arr_category[0] == "soffitto"){
                            if( contains(original_model_arr,"16F") )
                                original_model_arr.push("16FG");
                            if( contains(original_model_arr,"46F") )
                                original_model_arr.push("46FG");
                        }

                        
                        
                        if(model == "GIGLIO" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"DEST") && contains(original_model_arr,"GRAND") )
                                original_model_arr.push("DESG");
                            if( contains(original_model_arr,"SIN") && contains(original_model_arr,"GRAND") )
                                original_model_arr.push("SING");
                            if( contains(original_model_arr,"DEST") && !contains(original_model_arr,"GRAND") )
                                original_model_arr.push("DES");
                            if( contains(original_model_arr,"SIN") && !contains(original_model_arr,"GRAND") )
                                original_model_arr.push("SIN");
                        }

                        if(model == "ASSIBA" && arr_category[0] == "parete"){
                            if( contains(original_model_arr,"DEST") && !contains(original_model_arr,"GRAND") )
                                original_model_arr.push("DES");
                            if( contains(original_model_arr,"SIN") && !contains(original_model_arr,"GRAND") )
                                original_model_arr.push("SIN");
                        }

                        

                        if(model == "RINA" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"35/3") )
                                original_model_arr.push("35C");
                            if( contains(original_model_arr,"35/3D1") )
                                original_model_arr.push("35CD1");
                            if( contains(original_model_arr,"35/3D2") )
                                original_model_arr.push("35CD2");
                            if( contains(original_model_arr,"45/3") )
                                original_model_arr.push("45C");
                            if( contains(original_model_arr,"45/3D1") )
                                original_model_arr.push("45CD1");
                            if( contains(original_model_arr,"45/3D2") )
                                original_model_arr.push("45CD2");
                        }
                        

                       
                       

                        if(model == "FOLLIA" && arr_category[0] == "sospensione"){
                            if( contains(original_model_arr,"1") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("1P");
                            if( contains(original_model_arr,"3") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("3P");
                            if( contains(original_model_arr,"5") && contains(original_model_arr,"PICCO") )
                                original_model_arr.push("5P");
                            if( contains(original_model_arr,"GRANDD1") )
                                original_model_arr.push("GD1");
                            if( contains(original_model_arr,"GRANDD2") )
                                original_model_arr.push("GD2");
                        }

                        if(model == "DIADEMA" && arr_category[0] == "sospensione"){
                            
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"A") )
                                original_model_arr.push("07A");
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"AD1") )
                                original_model_arr.push("07AD1");
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"AD2") )
                                original_model_arr.push("07AD2");

                            if( contains(original_model_arr,"07") && contains(original_model_arr,"B") )
                                original_model_arr.push("07B");
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"BD1") )
                                original_model_arr.push("07BD1");
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"BD2") )
                                original_model_arr.push("07BD2");

                            if( contains(original_model_arr,"07") && contains(original_model_arr,"C") )
                                original_model_arr.push("07C");
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"CD1") )
                                original_model_arr.push("07CD1");
                            if( contains(original_model_arr,"07") && contains(original_model_arr,"CD2") )
                                original_model_arr.push("07CD2");

                            if( contains(original_model_arr,"12") && contains(original_model_arr,"A") )
                                original_model_arr.push("12A");
                            if( contains(original_model_arr,"12") && contains(original_model_arr,"AD1") )
                                original_model_arr.push("12AD1");
                            if( contains(original_model_arr,"12") && contains(original_model_arr,"AD2") )
                                original_model_arr.push("12AD2");

                            if( contains(original_model_arr,"12") && contains(original_model_arr,"B") )
                                original_model_arr.push("12B");
                            if( contains(original_model_arr,"12") && contains(original_model_arr,"BD1") )
                                original_model_arr.push("12BD1");
                            if( contains(original_model_arr,"12") && contains(original_model_arr,"BD2") )
                                original_model_arr.push("12BD2");

                            if( contains(original_model_arr,"12") && contains(original_model_arr,"C") )
                                original_model_arr.push("12C");
                            if( contains(original_model_arr,"12") && contains(original_model_arr,"CD1") )
                                original_model_arr.push("12CD1");
                            if( contains(original_model_arr,"12") && contains(original_model_arr,"CD2") )
                                original_model_arr.push("12CD2");

                            if( contains(original_model_arr,"18") && contains(original_model_arr,"A") )
                                original_model_arr.push("18A");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"AD1") )
                                original_model_arr.push("18AD1");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"AD2") )
                                original_model_arr.push("18AD2");

                            if( contains(original_model_arr,"18") && contains(original_model_arr,"B") )
                                original_model_arr.push("18B");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"BD1") )
                                original_model_arr.push("18BD1");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"BD2") )
                                original_model_arr.push("18BD2");

                            if( contains(original_model_arr,"18") && contains(original_model_arr,"C") )
                                original_model_arr.push("18C");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"CD1") )
                                original_model_arr.push("18CD1");
                            if( contains(original_model_arr,"18") && contains(original_model_arr,"CD2") )
                                original_model_arr.push("18CD2");

                            if( contains(original_model_arr,"30") && contains(original_model_arr,"A") )
                                original_model_arr.push("30A");
                            if( contains(original_model_arr,"30") && contains(original_model_arr,"AD1") )
                                original_model_arr.push("30AD1");
                            if( contains(original_model_arr,"30") && contains(original_model_arr,"AD2") )
                                original_model_arr.push("30AD2");

                            if( contains(original_model_arr,"30") && contains(original_model_arr,"B") )
                                original_model_arr.push("30B");
                            if( contains(original_model_arr,"30") && contains(original_model_arr,"BD1") )
                                original_model_arr.push("30BD1");
                            if( contains(original_model_arr,"30") && contains(original_model_arr,"BD2") )
                                original_model_arr.push("30BD2");

                            if( contains(original_model_arr,"30") && contains(original_model_arr,"C") )
                                original_model_arr.push("30C");
                            if( contains(original_model_arr,"30") && contains(original_model_arr,"CD1") )
                                original_model_arr.push("30CD1");
                            if( contains(original_model_arr,"30") && contains(original_model_arr,"CD2") )
                                original_model_arr.push("30CD2");
                            

                            
                            
                            
                        }
                       
                       
                        



                    if(component == 0){

                        

                        ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                        model = uniformaConListino(model);
                        

                        var arr_varianti = [];
                        _.each(assets_json,function(elem){
                            _.each(elem.more.more,function(variant){
                                var variant_model = variant.root_model;
                                
                                var variant_category = variant.category;
                                    model = model.toLowerCase();
                                    category = arr_category[0];

                                    if(model=="lunae"){
                                        category = "parete";
                                    }
                                    if(model=="magie" && category=="soffitto"){
                                        category = "faretto";
                                    }

                                    if(model=="poc" && category=="soffitto"){
                                        category = "faretto";
                                    }

                                    if(model=="tahoma" && category=="soffitto"){
                                        category = "faretto";
                                    }
                                    

                                    if(category=="terra"){
                                        category = "piantana";
                                    }

                                    if(model=="bolle" && variant_model=="bolle" && category=="soffitto" && variant_category=="faretto"){
                                        category = "faretto";
                                    }

                                    if(model=="diamante" && variant_model=="diamante" && category=="soffitto" && variant_category=="faretto"){
                                        category = "faretto";
                                    }

                                    if(model=="rina" && variant_model=="rina" && category=="soffitto" && variant_category=="faretto"){
                                        category = "faretto";
                                    }

                                    if(model=="lio" && variant_model=="lio" && category=="soffitto" && variant_category=="faretto"){
                                        category = "faretto";
                                    }


                                
                                    if(model == variant_model && category == variant_category){
                                        arr_varianti.push(variant);
                                    }



                                
                            })    
                        });
                        
                        if( arr_varianti.length == 1){
                            if(caso == "light_schema"){
                                return arr_varianti[0].light_schema;     
                            }
                            if(caso == "title"){
                                return arr_varianti[0].name;     
                            }
                            if(caso == "download"){
                                return arr_varianti[0].filename;     
                            }
                                
                        }
                            
                        else{
                                
                                var arr_varianti_fiter_1 = _.filter(arr_varianti,function(variant){

                                    // casi particolari
                                    var variante_rettificata = variant.variant;
                                    

                                    if( variant.root_model == "damasco" ){
                                        // per damasco piantana
                                        variante_rettificata = variante_rettificata.replace("100p","100").replace("140p","140").replace("180p","180");

                                        // per damasco parete
                                        variante_rettificata = variante_rettificata.replace("1ap","1a").replace("1bp","1b").replace("2ap","2a").replace("2bp","2b")
                                    }

                                    if( variant.root_model == "mini-giogali" ){
                                        variante_rettificata = variante_rettificata.replace("minigiog","");
                                    }

                                    if( variant.root_model == "cheope-09" ){
                                        variante_rettificata = variante_rettificata.replace("cheope09","");
                                    }

                                    if( variant.root_model == "alum09" ){
                                        variante_rettificata = variante_rettificata.replace("alum ","");
                                    }

                                    if( variant.root_model == "tablo" ){
                                        variante_rettificata = variante_rettificata.replace("tablo'","");
                                    }

                                    if( variant.root_model == "withwhite" ){
                                        variante_rettificata = variante_rettificata.replace("withwhit","");
                                    }

                                    if( variant.root_model == "cheope-09" ){
                                        variante_rettificata = variante_rettificata.replace("cheope09","");
                                    }
                                    if( variant.root_model == "chimera-09" ){
                                        variante_rettificata = variante_rettificata.replace("chimer09","");
                                    }

                                    if( variant.root_model == "cristallina" ){
                                        variante_rettificata = variante_rettificata.replace("cristall","");
                                    }

                                    if( variant.root_model == "enne-luci" ){
                                        variante_rettificata = variante_rettificata.replace("enneluci","");
                                    }
                                    if( variant.root_model == "giogali-3d" ){
                                        variante_rettificata = variante_rettificata.replace("gioga 3d","");
                                    }
                                    if( variant.root_model == "marblè" ){
                                        variante_rettificata = variante_rettificata.replace("marble'","");
                                    }
                                    if( variant.root_model == "quadra-09" ){
                                        variante_rettificata = variante_rettificata.replace("quadra09'","");
                                    }
                                    if( variant.root_model == "redentore" ){
                                        variante_rettificata = variante_rettificata.replace("redentor","");
                                    }
                                    if( variant.root_model == "san-giorgio" ){
                                        variante_rettificata = variante_rettificata.replace("sangiorg","");
                                    }
                                    if( variant.root_model == "san-marco" ){
                                        variante_rettificata = variante_rettificata.replace("sanmarco","");
                                    }
                                    if( variant.root_model == "tahoma-round" ){
                                        variante_rettificata = variante_rettificata.replace("tahomaro","");
                                    }

                                    if(variante_rettificata == "")
                                        return true;
                                    else
                                        return contains(original_model_arr,variante_rettificata.toUpperCase()) 
                                    

                                })

                                
                                

                                // capita alcune volte che l'array risultate contiene più volte la stessa immagine e ai fini dell'immagine appunto me ne basta una
                                // quindi elimino i doppioni
                                var arr_varianti_fiter_2 = uniqByProp(arr_varianti_fiter_1,"light_schema")

                                if( arr_varianti_fiter_2.length == 1){
                                         

                                    if(caso == "light_schema"){
                                        return arr_varianti_fiter_2[0].light_schema;     
                                    }
                                    if(caso == "title"){
                                        return arr_varianti_fiter_2[0].name;     
                                    }
                                    if(caso == "download"){
                                        return arr_varianti[0].filename;     
                                    }
                                }
                                else{
                                        var arr_varianti_fiter_3 = _.filter(arr_varianti_fiter_2,function(variant){
                                            return contains(original_model_arr,variant.light_system.toUpperCase())
                                        })

                                            if( arr_varianti_fiter_3.length == 1){
                                                if(caso == "light_schema"){
                                                    return arr_varianti_fiter_3[0].light_schema;     
                                                }
                                                if(caso == "title"){
                                                    return arr_varianti_fiter_3[0].name;     
                                                }
                                                if(caso == "download"){
                                                    return arr_varianti[0].filename;     
                                                }
                                            }
                                            else{
                                                   
    
                                                    _.log("Attenzione per questo articolo c'è qualche problema nel recupero dell'immagine light_schema")
                                                    _.log("----------------------model: "+model+"--------category: "+category);
                                                    _.log("----------------------original model: "+original_model_arr);
                                                    _.log("----------------------arr_varianti:");
                                                    _.log(arr_varianti_fiter_1);
                                                    
                                                      
                                                
                                            }
                                            
                                        
                                            
                                            
                                        
                                    
                                }
                                             
                            
                            
                        }

                        _.log(count++);

                        
                            


                        

                    }
                    
                }

                function getRealModelName(model, component, title, type, component_of){
                    if(component == 1){
                        var new_model = model.replace("ricambio-","");
                        new_model = (new_model == type)? new_model : new_model +" "+ type;
                        return new_model +" per "+ _.capitalize(component_of);
                    }
                    else{
                        var real_model = title.replace(" SP","").replace(" PT","").replace(" PL","").replace(" LT","").replace(" AP","");
                        if(real_model.indexOf(" G") == real_model.length - 2)
                            real_model = real_model.replace(" G"," grande");
                        if(real_model.indexOf(" P") == real_model.length - 2)
                            real_model = real_model.replace(" P"," piccola");
                        if(real_model.indexOf(" M") == real_model.length - 2)
                            real_model = real_model.replace(" M"," media");
                        if(real_model.indexOf(" MN") == real_model.length - 3)
                            real_model = real_model.replace(" MN"," mini");
                        
                        return real_model;
                    }
                }


                function getSupplierSiteLink(original_model, model,arr_category,component,assets_json){
                    var ret = undefined;
                    
                    var original_model_arr = descToArray(original_model);
                    if(isOutOfStock(model, arr_category, original_model_arr))
                        return "out of stock"

                    var category = arr_category[0];

                    if(model.toLowerCase() == "lunae"){
                        category = "parete";
                    }
                    if(model.toLowerCase() =="magie" && category=="soffitto"){
                        category = "faretto";
                    }

                    if(model.toLowerCase() =="poc" && category=="soffitto"){
                        category = "faretto";
                    }

                    if(model.toLowerCase() =="tahoma" && category=="soffitto"){
                        category = "faretto";
                    }
                    

                    if(category=="terra"){
                        category = "piantana";
                    }

                    

                    ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                    model = uniformaConListino(model);
                    

                    if(component == 0 ){
                        _.each(assets_json,function(elem){
                            if(model.toLowerCase() == elem.model && category == elem.category)
                                ret = elem.uri;
                        });
                    }
                    if(!_.is(ret) && component == 0){
                        _.log(count++  +")Attenzione uri non trovato per model: "+ model+" category: "+category);
                    }
                        
                    else
                        return ret;                      
                }

                ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                function uniformaConListino(model){
                    if(model=="MINIGIOGALI"){
                        return  "mini-giogali"
                    }
                    if(model=="GIOGALI 3D"){
                        return  "giogali-3d"
                    }
                    if(model=="SAN MARCO"){
                        return  "san-marco"
                    }
                    if(model=="SAN GIORGIO"){
                        return  "san-giorgio"
                    }
                    if(model=="TAHOMA ROUND"){
                        return  "tahoma-round"
                    }
                    if(model=="ALUM 09"){
                        return  "alum09"
                    }
                    if(model=="CHEOPE 09"){
                        return  "cheope-09"
                    }
                    if(model=="QUADRA09"){
                        return  "quadra-09"
                    }
                    if(model=="CHIMERA 09"){
                        return  "chimera-09"
                    }
                    if(model=="ENNE LUCI"){
                        return  "enne-luci"
                    }
                    if(model == "TABLO'")
                        return "tablo"
                        
                    if(model == "MARBLE'")
                       return "marblè";

                    return model;
                }

                function isOutOfStock(model, arr_category, original_model_arr){
                    if( 
                            (model == "COCUMIS" || model == "MENDELEE" || model == "SCUSEV" || model == "PUSKIN" || category == "altro") ||
                            (model == "DAMASCO" && arr_category[0] == "soffitto") ||
                            (model == "STARDUST" && arr_category[0] == "tavolo") ||
                            (model == "TUBES" && arr_category[0] == "tavolo") ||
                            (model == "VEGA" && arr_category[0] == "parete") ||
                            (model == "SEMAI" && arr_category[0] == "soffitto") ||
                            (model == "SEMAI" && arr_category[0] == "tavolo") ||
                            (model == "LUNAE") ||

                            // da qui in poi sono quei casi in cui non esiste una specifica variante di un dato articolo
                            // perchè questa non esiste nella sezione download
                            (_.isEqual(original_model_arr,["WITHWHIT","SOSPE","XL","BIANCO","BIANCO","E27"])) ||
                            (_.isEqual(original_model_arr,["WITHWHIT","SOSPE","36","XL","BIANCO","BIANCO","E27"])) ||
                            (_.isEqual(original_model_arr,["WITHWHIT","SOSPE","46","XL","BIANCO","BIANCO","E27"])) ||
                            (_.isEqual(original_model_arr,["WITHWHIT","SOSPE","XL","BIANCO","BIANCO","CA2"])) ||
                            (_.isEqual(original_model_arr,["WITHWHIT","SOSPE","36","XL","BIANCO","BIANCO","CA2"])) ||
                            (_.isEqual(original_model_arr,["WITHWHIT","SOSPE","46","XL","BIANCO","BIANCO","CA2"])) ||

                            ( model == "OTO" && arr_category[0] == "sospensione" && contains(original_model_arr,"RC60") ) ||
                            ( model == "OTO" && arr_category[0] == "sospensione" && contains(original_model_arr,"SURF") ) ||
                            ( model == "OTO" && arr_category[0] == "sospensione" && contains(original_model_arr,"SPHE") ) ||

                            ( model == "IMPLODE" && arr_category[0] == "soffitto" && contains(original_model_arr,"16") ) ||
                            ( model == "LUCCIOLA" && arr_category[0] == "soffitto" && contains(original_model_arr,"18") ) ||

                            ( model == "DAMASCO" && arr_category[0] == "tavolo" && contains(original_model_arr,"C") ) ||

                            ( model == "BOT" && arr_category[0] == "soffitto" && contains(original_model_arr,"16") ) ||

                            ( model == "DIADEMA" && arr_category[0] == "sospensione" && contains(original_model_arr,"C1") ) ||

                            ( model == "CHEOPE 09" && arr_category[0] == "sospensione" && contains(original_model_arr,"PICCO") ) ||
                            ( model == "CHEOPE 09" && arr_category[0] == "sospensione" && contains(original_model_arr,"PICCOD1") ) ||
                            ( model == "CHEOPE 09" && arr_category[0] == "sospensione" && contains(original_model_arr,"PICCOD2") )  ||

                            ( model == "TAHOMA ROUND" && arr_category[0] == "soffitto"  )
                        
                        )
                        return true;
                    else
                        return false;
                }
                
                
            }
            else{
                /* ================================================================= FLOS */
                if( fornitore == "flos"){

                    var hasAsset = _.is(getAsset(row["Codice articolo"])); // dice di questo articolo se è presente il rispettivo oggetto in asset_json recuperato dal sito
                    if(!hasAsset)
                        return undefined;

                    supplier = "flos";
                    supplier_id = supplierId(supplier);
                    original_model_id = row["Codice articolo"];
                    model_id = row["Codice articolo"];
                    component = (isComponent(model_id))? 1: 0;// recuperato dall'excel (row["Raggr. Commerciale"] == "SPAREPARTS")? 1: 0; // sono 525 "DECORATIVE" e 1084 SPAREPARTS              
                    model = getModelName(model_id);
                    item_id = original_model_id;
                    hicId = getHicId(supplier_id, item_id);
                    ean13 = undefined;
                    max_discount = 0.14;
                    sale = 1;
                    price = getPrice(row["PREZZO IVA ESCL."], max_discount);
                    quantity = 0;
                    delivery_time = "2-3 gg Italy, 5-6 days UE";
                    delivery_time_if_not_available = "Su ordinazione in 2-3 settimane";
                    

                    color = getColor(model_id);
                    desc_it = undefined;
                    desc_en = undefined;
                    cleaned_desc_it = getDesc(component,getAsset(model_id));
                    cleaned_desc_en = cleaned_desc_it;
                    dimmer = (row["Descrizione articolo"].indexOf("DIMM") != -1 )? 1: 0;
                    led = (row["Descrizione articolo"].indexOf("LED") != -1 || row["Descrizione articolo"].toLowerCase().indexOf(" led") != -1 )? 1: 0;
                    halogen = undefined;
                    screw = undefined;
                    switcher = undefined;
                    category = ( _.is(getAsset(model_id)) )? (!isComponent(model_id))?  getAsset(model_id).category : getFatherAsset(model_id).category : undefined;
                
                    type = undefined;       // è un valore unico ovvero una stringa

                    
                    component_of = ( isComponent(model_id) ) ? getAsset(model_id).component_of : undefined;
                    size = undefined;
                    outdoor = (row["Descrizione articolo"].indexOf("OUT") != -1 )? 1: 0;
                    wire_length = undefined;
                    more = getMore(model_id);
                    title = getTitle(model, component, component_of);
                    pic = ( _.is(getAsset(model_id)))? (_.is(getAsset(model_id).img)) ? getAsset(model_id).img : getAsset(model_id).image : undefined;
                    light_schema = getSchemaImages(model_id);
                    subtitle = getSubtitle(model, component, component_of, category);
                    otherColors = undefined;
                    projects = ( _.is(getAsset(model_id)) )? ( _.is( getAsset(model_id).other_images ) )? getAsset(model_id).other_images : undefined : undefined ;
                    link = getSupplierSiteLink(model_id);

                    meta_title = getMetaTitle(title, subtitle, category, component, max_discount);
                    meta_description = getMetaDescription(title, subtitle, category, component, max_discount);

                    function getModelName(model_id){
                        var asset = getAsset(model_id);
                        if( _.is(asset))
                            return asset.fullname || asset.model;
                    }

                    function getPrice(price, max_discount){
                        var price = parseFloat(price.replace("€ ","").replace(",","")).toFixed(2);
                        return parseFloat( price* (1 - max_discount) ).toFixed(2);
                    }

                    function getColor(model_id){
                        var asset = getAsset(model_id);
                        if(_.is(asset))
                            if(_.is(asset.color))
                                return asset.color.replace("colour_","");
                        
                            
                    }

                    function getDesc(component,asset){
                        if(component == 0 && _.is(asset))
                            return asset.desc;
                    }

                    function isComponent(model_id){
                        var asset = getAsset(model_id);
                        if( _.is(asset) )
                            return _.is(asset.fullname) == true;
                        else
                            return false;
                    }

                    

                    // dato un id articolo ritorna l'oggetto asset di asset_json
                    // se è undefined vuol dire che non l'ha trovato
                    // se ciò che torna ha "category" si tratta di un articolo vero e proprio
                    // altrimenti si tratta di un pezzo di ricambio
                    function getAsset(id){
                        
                        var ret = undefined;
                        _.each(assets_json,function(asset){
                            if(!_.is(ret)){
                                if(asset.code == id){
                                    ret = asset;
                                }
                                else{
                                    _.each(asset.accessories,function(accessory){
                                        if(accessory.id == id){
                                            ret = accessory;
                                        }
                                            
                                    })
                                }
                            }
                        });

                        return ret;
                    }

                    function getSchemaImages(mode_id){
                        var ret = [];
                        var asset = getAsset(mode_id)
                        if( _.is(asset)){
                            if( _.is(asset.size_image) )
                                ret.push( asset.size_image );
                            if( _.is(asset.summary_media) ){
                                _.each(asset.summary_media,function(elem){
                                    ret.push(elem);
                                })
                            }
                        }

                        return ret;   
                    }

                    function getFatherAsset(accessory_id){
                        if(!isComponent(accessory_id))
                            return undefined;
                        else{
                            var ret = undefined;

                            _.each(assets_json,function(asset){
                                _.each(asset.accessories,function(accessory){
                                    if(accessory.id == accessory_id && !_.is(ret)){
                                        ret = asset;
                                    }
                                });
                            });

                            return ret;
                        }
                    }
        
                    function getMore(model_id){
                        var more = undefined;
                        var asset = getAsset(model_id);
                        if ( _.is(asset) ){
                            if ( _.is( asset.more ) )
                                more = asset.more

                            if( _.is(asset.downloads))
                                more["downloads"] = asset.downloads;
                        }

                        return more;
                            

                    }

                    // ritorna il link alla pagine dell'articolo sul sito del fornitore
                    function getSupplierSiteLink(model_id){
                        var asset = getAsset(model_id);
                        if(_.is(asset))
                            if(_.is(asset.uri))
                                return asset.uri;
                    }

                    function getTitle(model, component, component_of){
                        return model;
                    }

                    function getSubtitle(model, component, component_of, category){
                        if(component == 0)
                            return category;
                        else{
                            var asset = getAsset(component_of);
                            return "accessorio di "+ asset.model +" "+ asset.category
                        }
                    }

                    function getMetaTitle(title, subtitle, category, component, max_discount){
                        if(component == 0){
                            var ret = "Arte in Luce "+title+" Flos™ "+category;
                        }
                        if(component == 1){
                            var ret = "Flos™ ricambio "+title;
                        }
                        return ret;
                    }

                    function getMetaDescription(title, subtitle, category, component, max_discount){
                        if(component == 0){
                            var ret = "Lampada "+title+" Flos™ da "+category+" in sconto al 14%, spedizione gratuita.";
                        }
                        if(component == 1){
                            var ret = "Flos™ ricambio "+title+" in sconto al 14%, spedizione gratuita.";
                        }
                        return ret;
                    }

                }
            }


        }

        

        

        return{
            supplier:               supplier,                                                       // nome del fornitore
            supplier_id :           supplier_id,                                                    // identificativo del fonitore
            model:                  (_.is(model))? model.toLowerCase() : undefined,                 // modello/famiglia dell'articolo
            title:                  title,                                                          // se possibile ricostruiamo un title da mettere nella pagina dell'articolo
            subtitle:               subtitle,                                                       // se possibile ricostruiamo un sottotitolo da mettere bella pagina dell'articolo
            original_model_id:      original_model_id,                                              // id originario (NON MANIPOLATO) dell'articolo
            model_id:               model_id,                                                       // identificativo della famiglia di articolo ottenuto con replace(" ","_");
            item_id:                item_id,                                                        // l'id originario manipolato
            hicId:                  hicId,                                                          // identificativo interno ottenuto come supplier_id + item_id
            ean13:                  ean13,                                                          // codice a barre
            price:                  price,                                                          // imponibile
            quantity:               quantity,                                                       // quantità disponibile in magazzino nel momento del caricamento massivo
            delivery_time:          delivery_time,                                                  // tempi di spedizione se in pronta consegna
            delivery_time_if_not_available : delivery_time_if_not_available,                        // tempi di consegna su ordinazione
            color:                  (_.is(color))? color.toLowerCase() : undefined,                // prova a recuperare il colore dall'id
            desc_it:                cleaned_desc_it,                                                // la descrizione in italiano
            desc_en:                cleaned_desc_en,                                                // la descrizione in inglese 
            dimmer:                 (dimmer==0)? "no" : "yes",                                      // se ha il dimmer o meno
            led:                    (led==0)? "no" : "yes",                                         // se ha il led o meno
            halogen:                (halogen==0)? "no" : "yes",                                     // se ha lampada alogena
            screw:                  screw,                                                          // tipo di attacco
            switcher:               (switcher==0)? "no" : "yes",                                    // se ha l'interruttore o meno
            category:               (_.is(category))? category.toLowerCase() : undefined,             // terra, tavolo, sospensione, soffitto, parete, montatura, kit, diffusore, set,
            type:                   type,                                                           // tipo di lampada
            component:              component,                                                      // indica se è un componente di una lampada (serve per distinguere i pezzi di ricambio dalle lampade)
            component_of:           component_of,                                                   // se l'articolo è un componente ritorna il modello di cui è componente
            size:                   size,                                                           // piuccola, media, grande,....
            outdoor:                (outdoor==0)? "no" : "yes",                                     // se è da esterno o meno
            wire_length:            wire_length,                                                    // se c'è dice quanto è lungo il cavo (in foscarini è una variante)
            max_discount:           max_discount * 100,                                             // massimo sconto applicabile espresso come frazione di uno viene qui moltiplicato per 100
            sale:                   sale,                                                           // 0 o 1 serve a prestashop per capire se c'è uno sconto o meno
            pic:                    pic,                                                            // contiene l'immagine primaria
            light_schema:           light_schema,                                                   // schema dell'articolo
            otherColors:            otherColors,                                                    // array dei path delle immagini di altri colori dello stesso articolo
            projects:               projects,                                                       // sono le immagini di progetti
            link:                   link,                                                           // ritorna la pagine dell'articolo sul sito del fornitore
            more:                   more,                                                           // contiene dei campi aggiuntivi (custom per ogni fornitore) esempio video, link a pdf, pagine html
            meta_title:             meta_title,
            meta_description:       meta_description,
            
        }
}



/* ================================================================= GLOBALI */

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function contains(arr,str){
    for(var i=0; i<arr.length; i++){
        if(arr[i]==str){
            return true;
            break
        }
    }
    return false;
}


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

function uniqByProp(arr,prop){
    var ret = [];
    var register = [];
    
    _.each(arr,function(elem){
        if(!contains(register,elem.prop)){
            register.push(elem.prop);
            ret.push(elem);
        }
    });
    
    return ret;
}

function uniqByFileName(arr){
    var ret = [];
    var register = [];
    
    _.each(arr,function(elem){
        if(!_.contains(register,elem.file_name)){
            register.push(elem.file_name);
            ret.push(elem);
        }
    });
    
    return ret;
}

function uniqByURL(arr){
    var ret = [];
    var register = [];
    
    _.each(arr,function(elem){
        if(!_.contains(register,elem.url)){
            register.push(elem.url);
            ret.push(elem);
        }
    });
    
    return ret;
}

function sameItem(model, category, elem_model, elem_category, caso){
    if(elem_model == "CHOUCHIN REVERSE 1") // su assets_json.json
        elem_model = "CHOUCHIN 1 REVERSE"; // da listino excel
    if(elem_model == "CHOUCHIN REVERSE 2")
        elem_model = "CHOUCHIN 2 REVERSE";
    if(elem_model == "CHOUCHIN REVERSE 3")
        elem_model = "CHOUCHIN 3 REVERSE";
    if(elem_model == "GIGA LITE")
        elem_model = "GIGA-LITE";
    if(elem_model == "TUTÙ")
        elem_model = "TUTU'";
    if(elem_model == "CRI CRI")
        elem_model = "CRI-CRI";
    
    if(elem_model == "MAGNETO" && elem_category == "terra"){
        elem_category = "lettura";
    }

    if(elem_model == "TWIGGY LETTURA"){
        elem_category = "lettura";
    }

    if(elem_model == "TWIGGY GRIDD"){
        category = "outdoor";
    }

    if(elem_model == "TWIGGY" && elem_category == "lettura"){
        elem_model = "TWIGGY LETTURA";
    }

    if( model == "BIRDIE LETTURA" || model ==  "BIRDIE LED LETTURA" ){
        model = "BIRDIE LETTURA";
        category = "terra";
    }
    

    if(elem_model == "LUMIERE XXL" && elem_category == "terra"){
        elem_category = "lettura";
    }

    if(elem_model == "SOLAR"){
        elem_category = "terra";
    }

    if(model == "PLASS MEDIA" && category == "sospensione"){
        model = "PLASS";
    }

    if(model == "BIT 1" || model == "BIT 2" || model == "BIT 3" || model == "BIT 4" || model == "BIT 5"){
        model = "BIT";
    }

   

    if(model == "HAVANA" && elem_model=="HAVANA"){
        //_.log(category+" - "+elem_category);
    }

    if(caso == "desc"){
        if( model == "BIRDIE 1" || model == "BIRDIE 3" || model == "BIRDIE 6" || model == "BIRDIE 9"){
            model = "BIRDIE";
            category = "soffitto";
        }
    }

    if( model == "LUMIERE XXL" || model == "LUMIERE XXS"){
        model = "LUMIERE XX";
        if(category == "lettura")
            category = "tavolo";
    }

    if(caso == "desc"){
        if( model == "FILO"){
            if(category != "parete")
                category = "terra";
        }
    }

    if(caso == "desc"){
        if(elem_model == "TWIGGY GRID"){
            category = "outdoor";
        }
    }

    return model == elem_model && category == elem_category;
}




function sameItemForVideo(model, category, elem_model, elem_category){
   
        
        if(elem_model == "GIGA LITE")
            elem_model = "GIGA-LITE";

        if(model.indexOf("TRESS") != -1 && elem_model.indexOf("TRESS") != -1 ){
            elem_model = "TRESS";
            model = "TRESS";
            elem_category = "terra";
            category = "terra";
        }

        if(model.indexOf("CHOUC") != -1 && elem_model.indexOf("CHOUC") != -1 ){
            elem_model = "CHOUCHIN 1";
            model = "CHOUCHIN 1"
        }

        if(model.indexOf("FILO") != -1 && elem_model.indexOf("FILO") != -1 ){
            elem_model = "FILO";
            model = "FILO";
            elem_category = "tavolo";
            category = "tavolo";
        }

        if(model.indexOf("BUDS") != -1 && elem_model.indexOf("BUDS") != -1 ){
            elem_model = "BUDS 2";
            model = "BUDS 2";
            elem_category = "tavolo";
            category = "tavolo";
        }

        if(model.indexOf("PLASS") != -1 && elem_model.indexOf("PLASS") != -1 ){
            elem_model = "PLASS MEDIA";
            model = "PLASS MEDIA";
            elem_category = "tavolo";
            category = "tavolo";
        }

        if(model.indexOf("LUMIER") != -1 && elem_model.indexOf("LUMIER") != -1 ){
            elem_model = "LUMIERE";
            model = "LUMIERE";
            elem_category = "tavolo";
            category = "tavolo";
        }
    

    return model == elem_model && category == elem_category;
}

function cleanedFeature(feature){
    if(_.isArray(feature))
        return undefined;
    else{
        var $feature = $("<div>"+ feature +"</div>");
        // devo fare questo perchè se ci sono virgole nel testo spezzano il CSV
        var ret = S($feature.text()).replaceAll(",","").s;
        return ret;
    }
    
}






/* ================================================================= POSTPRODUZIONE */


function postProduci(json,fornitore){
    
    if(fornitore=="flos"){
        

        

        var json_prodotti = [];
        // creo hicid è l'id del articolo primario che viene messo a tutte le sue varianti
        // l'articolo primario viene pompato in json_prodotti col price a zero
        var registro = {};
        
        _.each(json, function(elem,index){
            if( !_.is(registro[elem.model]) ){
                registro[elem.model] = elem.hicId;
                var new_elem = Object.assign({}, elem);
                new_elem.price = 0;
                json_prodotti.push(new_elem);
            }
            else{
                elem.hicId = registro[elem.model];
            }
            
        })


        // aggiungo gli accessori di ogni articolo
        _.each(json, function(elem){
            if( elem.component == 1 ){
                var cod_component = elem.hicId;
                var cod_item = elem.component_of;

                _.each(json, function(item, index){
                    
                    if(!_.is(item["accessories"]))
                        item["accessories"] = "";
                    
                    if(item.model_id == cod_item ){
                        //var new_accessories = item["accessories"] + cod_component+";";
                        item["accessories"] += (item["accessories"] != "" )? ","+cod_component : cod_component

                    }
                    
                    
                });
            }
        });

        



        // aggiungo le features che sono le proprietà statiche dell'articolo
        _.each(json, function(elem){
            elem["features"] = inlineCSVFeaturesFlos(elem,["category","outdoor"])
            elem["attributes"] = inlineCSVFlos(elem,[["color","select"]])
            elem["values"] = inlineCSVFlos(elem,["color"],"values")
        });


        function inlineCSVFeaturesFlos(obj,arr){
            let csv = "";
            let pos = 0;
            _.each(arr,function(elem){

                if( _.is(obj[elem]) ){
                    var singleton = elem +" : "+ obj[elem] +" : "+ pos+" , ";
                    pos++;
                }
                            
                csv += (_.is(singleton))? singleton : "";
            });

            //  alle features aggiungo i dati presenti in more (more c'è solo negli articoli componento == 0)
            if(obj.component == 0){
                _.each(obj.more, function(feature, key){
                    var cleaned_feature = cleanedFeature(feature);

                    if(_.is(cleaned_feature)){
                        csv += key +' : '+ cleaned_feature +' : '+ pos +' , ';
                        pos++;
                    } 
                    //var cleaned_feature = "'"+ feature.replace("<p>","").replace("</p>","") + "'";

                })
                /*
                csv += "codice fornitore :"         +"'"+ obj.more.codice_articolo +"'"+" : "+              parseInt(pos)+" , ";
                csv += "ambiente :"                 +"'"+ obj.more.ambiente +"'"+" : "+                     parseInt(pos+1)+" , ";
                csv += "finitura :"                 +"'"+ obj.more.finitura +"'"+" : "+                     parseInt(pos+2)+" , ";
                csv += "peso :"                     +"'"+ obj.more.peso +"'"+" : "+                         parseInt(pos+3)+" , ";
                csv += "descrizione tecnica :"      +"'"+ obj.more.descrizione_tecnica +"'"+" : "+          parseInt(pos+4)+" , ";
                csv += "emergenza :"                +"'"+ obj.more.emergenza +"'"+" : "+                    parseInt(pos+5)+" , ";
                csv += "regolazione :"              +"'"+ obj.more.regolazione +"'"+" : "+                  parseInt(pos+6)+" , ";
                csv += "voltaggio :"                +"'"+ obj.more.voltaggio +"'"+" : "+                    parseInt(pos+7)+" , ";
                csv += "potenza :"                  +"'"+ obj.more.potenza +"'"+" : "+                      parseInt(pos+8)+" , ";
                csv += "batteria :"                 +"'"+ obj.more.batteria +"'"+" : "+                     parseInt(pos+9)+" , ";
                csv += "alimentatore incluso :"     +"'"+ obj.more.alimentatore_incluso +"'"+" : "+         parseInt(pos+10)+" , ";
                csv += "lunghezza cavo (mm) :"      +"'"+ obj.more['lunghezza_del_cavo_(mm)'] +"'"+" : "+   parseInt(pos+11)+" , ";
                csv += "materiale :"                +"'"+ obj.more.materiale_di_costruzione +"'"+" : "+     parseInt(pos+12)+" , ";
                */
            }
           
            
            // tolgo l'ultima virgola
            return csv.substring(0, csv.length - 3);
        }

        function inlineCSVFlos(obj,arr, caso){
            
            let pos = 0;
            if(!_.is(caso)){ // caso dei attributes
                var csv = "fakeAttribute : radio : 0 , ";                
            }
            else{ // caso di values
                var csv = "fakeValue : 0 , ";
            }
            _.each(arr,function(elem){

                if(_.is(caso)){ // caso dei values
                    if( _.is(obj[elem]) ){
                        pos++;
                        var singleton = obj[elem] +" : "+ pos +" , ";
                    }
                }
                else{ // caso di attributes
                    pos++;
                    var singleton = elem[0] +" : "+ elem[1] +" : "+ pos+" , ";
                }
                
                csv += (_.is(singleton))? singleton : "";
            });

            // tolgo l'ultima virgola
            return csv.substring(0, csv.length - 3);
        }
        
        // in component_of invece del code metto hicId
        _.each(json, function(elem, index){
            var cod = elem.component_of;
            _.each(json, function(elem2){
                if( elem2.model_id == cod)
                   json[index].component_of = elem2.hicId;
            })
        })
        
        
       
    }




    if(fornitore=="foscarini"){
        var model_no_longer_available = [
            {
                model: "esa",
            },
            {
                model: "tress",
                category: "tavolo"
            },
            {
                model: "ellepi",
            },
            {
                model: "jamaica",
            },
            {
                model: "lightweight",
                category: "terra"
            }
        ]

        
 
        // elimino gli articoli che non hanno model o che sono no_longer_available
        
        json = _.filter(json,function(elem){
            if(!_.is(elem.model) || elem.model == ""){
                //_.log(_.toStr(elem))
                return false;
            }
                
            else{
                if( elem.model != "tress" )
                    return  ( elem.model != "esa" && elem.model != "ellepi" && elem.model != "jamaica" )
                else{
                    if( elem.model == "tress" && elem.category[0] == "tavolo")
                        return false;
                    else
                        return true;
                        
                }
            }
           
        });
        
            

        
        
        // aggiungo gli accessori ogni articolo
        _.each(json,function(elem){
            //ciclo sui componenti
            if(elem.component==1){
                var component_of = elem.component_of; // qui trovo model + category
                var model = elem.model;
                //ciclo sugli item
                _.each(json,function(item){
                    if(!_.is(item.accessories))
                        item.accessories = "";
                    if(item.component==0){
                        if(component_of == item.model+" "+item.category){
                            //item.accessories += model+";"
                            item["accessories"] += (item["accessories"] != "" )? ","+model : model
                        }
                    }
                })
            }
        });

        var json_prodotti = [];

    }



    if(fornitore=="vistosi"){
       

        var new_json = _.filter(json, function(elem){
            return elem.model != "out of stock"
        })

        json = new_json;

        var json_prodotti = [];

        
    }

    

    

    return {
        json_varianti : json,
        json_prodotti : json_prodotti,
    };
}

