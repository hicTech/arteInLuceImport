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
                                            fs.readFile('./'+cartella+'/assets_json.json', 'utf8', function(err, contents) {
                                               let assets_json = ( _.is(contents) )? JSON.parse(contents) : {};
                                                _.each(json_fornitore,function(row){
                                                    if(!rigaVuota(row)){
                                                        json_aumentato.push(adjustRow(row,cartella,assets_json, desc_json));
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
        var size = undefined;
        var outdoor = undefined;
        var max_discount = undefined;

        var more = undefined;

        var pic = undefined;
        var otherColors = undefined;
        

    

        /* ================================================================= FOSCARINI */
        if(false){

            
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
                "BIRDIE 1",
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
            
            var model_no_longer_available = [
                {
                    model: "ESA",
                },
                {
                    model: "TRESS",
                    category: "tavolo"
                },
                {
                    model: "ELLEPI",
                },
                {
                    model: "JAMAICA",
                },
                {
                    model: "LIGHTWEIGHT",
                    category: "terra"
                }
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
                price = row["Europa"];
                color = getColor(articolo);
                category = getCategory(row["Sottofamiglia"]);
                cleaned_desc_it = getDesc(model,category,assets_json);
                dimmer = (articolo.indexOf("DIM") != -1)? 1 : 0;
                led = (articolo.indexOf("LED") != -1)? 1 : 0;
                halogen = (articolo.indexOf("ALO") != -1)? 1 : 0;
                screw = getScrew(articolo);
                switcher = (articolo.indexOf("ON/OFF") != -1)? 1 : 0;
                type = undefined;
                component = isComponent(model_id,row["Componente"]);
                size = getSize(articolo);
                outdoor = (articolo.indexOf("OUTDOOR") != -1)? 1 : 0;
                max_discount = 0;
                pic = getPics(model, category, color, component, createAllImgsArr(assets_json), "primary" );
                otherColors = getPics(model, category, color, component, createAllImgsArr(assets_json), "colors" );
                more = JSON.stringify({
                    video : getVideo(model, category, component, createAllVideosArr(assets_json)),
                    link : getLink(model, category, component, createAllLinksArr(assets_json)),
                });
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
                    category.push("parete");
                    category.push("soffitto");
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

                if( sottofamiglia.indexOf("OUTDOOR") != -1 ){
                    category.push("outdoor");
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
                if(component == 1){
                    return undefined; // è un ricambio quindi per ora non ha foto
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
            
                return ret;

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

            function getDesc(model,category,assets_json){
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
                component = (model=="VETRO" || model=="FISCHER" || model=="ROSONE" || model=="ROSO" || model=="SCATOLA")? 1 : 0;
                size = getSize(row["Descrizione"]);;
                outdoor = undefined;
                max_discount = undefined;
                pic = getPics(row["Descrizione"], model, category, type, assets_json,component, "primary");
                //otherColors = getOtherPics(model, size, category, type, color, more);
                //more = getMore(row["Descrizione"],model);
                

                



                function getModel(desc){
                    var desc_arr = descToArray(desc);
                    var ret = desc_arr[0];

                    // alcuni casi speciali
                    if(ret == "FISC")
                        ret = "FISCHER";
                    if(ret == "VETR")
                        ret = "VETRO";
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

                function getPrice(str){
                    var str_cleaned = str.replace("¤","").replace("Û ","");
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

                function getPics(original_model, model, arr_category, type, assets_json, component, caso){
                    
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

                    if(component == 0){

                        

                        ///////////////////////// uniformo alcuni nome che fra listino e sito differiscono
                        if(model=="MINIGIOGALI"){
                            model = "mini-giogali"
                        }
                        if(model=="GIOGALI 3D"){
                            model = "giogali-3d"
                        }
                        if(model=="SAN MARCO"){
                            model = "san-marco"
                        }
                        if(model=="SAN GIORGIO"){
                            model = "san-giorgio"
                        }
                        if(model=="TAHOMA ROUND"){
                            model = "tahoma-round"
                        }
                        if(model=="ALUM 09"){
                            model = "alum09"
                        }
                        if(model=="CHEOPE 09"){
                            model = "cheope-09"
                        }
                        if(model=="QUADRA09"){
                            model = "quadra-09"
                        }
                        if(model=="CHIMERA 09"){
                            model = "chimera-09"
                        }
                        if(model=="ENNE LUCI"){
                            model = "enne-luci"
                        }
                        if(model == "TABLO'")
                            model = "tablo"
                            
                        if(model == "MARBLE'")
                            model = "marblè"
                            
                        
                        var arr_varianti = [];
                        _.each(assets_json,function(elem){
                            _.each(elem.variants,function(variant){
                                var variant_model = variant.model;
                                var variant_category = variant.category;
                                    model = model.toLowerCase();
                                    category = arr_category[0];

                            
                                
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
                                    _.log(count++);
                                   
                                        _.log("----------------------model: "+model+"--------category: "+category);
                                        _.log("----------------------original model: "+original_model_arr);
                                        _.log(arr_varianti)
                                    
                                    
                                }



                                
                                
                            
                            
                        }
                    }
                    else{
                        
                    }
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
            component:              component,                          // indica se è un componente di una lampada (serve per distinguere i pezzi di ricambio dalle lampade)
            size:                   size,                               // piuccola, media, grande,....
            outdoor:                outdoor,                            // se è da esterno o meno
            max_discount:           undefined,                          // massimo sconto applicabile
            pic:                    pic,                                // contiene l'immagine primaria
            otherColors:            otherColors,                              // array dei path delle immagini di altri colori dello stesso articolo
            more:                   more,                               // contiene dei campi aggiuntivi (custom per ogni fornitore) esempio video, link a pdf, pagine html     
        }
}



/* ================================================================= GLOBALI */

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


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
