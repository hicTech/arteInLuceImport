var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');



var download_queue = [];
var download_queue_pdf = [];

var count = 0;


fs.readFile('./site_info_remote.json', 'utf8', function(err, contents) {
    var json = JSON.parse(contents);
    _.each(json,function(elem,key){
        
        // carousel
        _.each(elem.carousel,function(carousel_elem,index){
            var url = carousel_elem;
            json[key].carousel[index] = getAugmentedImg(url, elem.model, elem.category, "carousel");
            download_queue.push( url )
        });

        // other_imgs
        _.each(elem.other_imgs,function(other_imgs_elem,index){
            var url = other_imgs_elem;
            json[key].other_imgs[index] = getAugmentedImg(url, elem.model, elem.category, "others_images");
            download_queue.push( url )
        });

        // projects
        _.each(elem.projects,function(projects_elem,index){
            var url = projects_elem;
            json[key].projects[index] = getAugmentedImg(url, elem.model, elem.category, "project");
            download_queue.push( url )
        });

        // related_imgs
        _.each(elem.related_imgs,function(related_imgs_elem,index){
            var url = related_imgs_elem.url;
            var model = related_imgs_elem.model;
            var category = related_imgs_elem.category;
            json[key].related_imgs[index] = getAugmentedImg(url, model, category, "related_images");
            download_queue.push( url )
        });

        // light_schema
        _.each(elem.specs,function(spec, spec_index){
                var url = spec.light_schema;
                json[key].specs[spec_index].light_schema = getAugmentedImg(url, elem.model, elem.category, "light_schema");
                download_queue.push( url )
        });
        

        // specs
        
        _.each(elem.specs,function(spec, spec_index){
            _.each(spec.downloads,function(download, download_index){
                // considero solo il caso in cui c'è "url"
                if( _.is(download.url) ){
                    var url = download.url;
                    json[key].specs[spec_index].downloads[download_index].url = url;
                    download_queue_pdf.push( url )
                }
                
            });    
        });
        
        
    });

    
   

    fs.writeFile('assets_json.json', JSON.stringify(json, null, 4), 'utf8', function(){
        _.log("JSON localizzato");
    });




    function localizeUrl(url, path){
        if( !_.is(path))
            return url.substr(url.lastIndexOf("/"));
        else
            return path+url.substr(url.lastIndexOf("/"));
    }

    function localizeDownload(url, path){
        var global_path = (_.is(path))? path : "";
        // l'id del documento è compreso fra "pid=" e "&" esempio: pid=2345&
        return global_path+"/doc_"+S(url).between("pid=","&").s+".pdf"

    }

    function getAugmentedImg(url, model, category, caso){
        var file_name = url.substr(url.lastIndexOf("/")+1);
        return{
            url : url,
            file_name: file_name,
            model: getModel(model,file_name), // serve per gestire casi particolari
            // per la categoria provo a recuperarla dal nome della foto...se non trovo nessuna indicazione gli associo la categoria della pagina in cui la foto è contenuta (potrebbe ono esere la categorya giusta)
            category: getCategory(file_name,category),
            img_type: caso, // "carousel","others_images","project","related_imgs","light_schema",
            size: getSize(file_name),
            primary: caso == "related_images",
            colors: getColor(file_name),
        }

        function getSize(local_url){
            if(local_url.indexOf("GRANDE") != -1)
                return "grande";
            if(local_url.indexOf("MEDIA") != -1)
                return "media";
            if(local_url.indexOf("PICCOLA") != -1)
                return "piccola";  
        }

        function getColor(local_url){
            var colors = [];
            local_url = local_url.toLowerCase();
            if(local_url.indexOf("_bianc") != -1 || local_url.indexOf("white") != -1 ){
                if(local_url.indexOf("bianco-caldo") != -1 || local_url.indexOf("warm-white") != -1)
                    colors.push("bianco caldo");
                else
                    colors.push("bianco");
            }
                
            
            if(local_url.indexOf("nero") != -1 || local_url.indexOf("black") != -1)
                colors.push("nero");
            if(local_url.indexOf("cromo") != -1)
                colors.push("cromo");
            if(local_url.indexOf("yellow") != -1 || local_url.indexOf("giallo") != -1)
                colors.push("giallo");
            if(local_url.indexOf("arancio") != -1 || local_url.indexOf("orange") != -1)
                colors.push("arancio");
            if(local_url.indexOf("alluminio") != -1 || local_url.indexOf("alumin") != -1)
                colors.push("alluminio");
            if(local_url.indexOf("turchese") != -1)
                colors.push("turchese");
            if(local_url.indexOf("indaco") != -1)
                colors.push("indaco");
            if(local_url.indexOf("brown") != -1 || local_url.indexOf("marrone") != -1)
                colors.push("marrone");
             if(local_url.indexOf("grafite") != -1)
                colors.push("grafite");
            if(local_url.indexOf("azzurro") != -1)
                colors.push("azzurro");
            if(local_url.indexOf("rame") != -1)
                colors.push("rame");
            if(local_url.indexOf("avory") != -1 || local_url.indexOf("ivory") != -1)
                colors.push("avorio");
            if(local_url.indexOf("green") != -1 || local_url.indexOf("verde") != -1)
                colors.push("verde");
            if(local_url.indexOf("grey") != -1 || local_url.indexOf("grigio") != -1)
                colors.push("grigio");
            if(local_url.indexOf("_red") != -1 || local_url.indexOf("rosso") != -1)
                colors.push("rosso");
            if(local_url.indexOf("ciliegia") != -1)
                colors.push("ciliegia");
            if(local_url.indexOf("greige") != -1)
                colors.push("greige");
            if(local_url.indexOf("cremisi") != -1)
                colors.push("cremisi");
            if(local_url.indexOf("antracite") != -1)
                colors.push("antracite");
            if(local_url.indexOf("amaranto") != -1)
                colors.push("amaranto");
            if(local_url.indexOf("amethist") != -1)
                colors.push("amethist queen");
            if(local_url.indexOf("emerald-king") != -1)
                colors.push("emerald king");
            if(local_url.indexOf("ruby-jaypure") != -1)
                colors.push("ruby jaypure");
            if(local_url.indexOf("teodora") != -1)
                colors.push("teodora");
            if(local_url.indexOf("eastern") != -1)
                colors.push("eastern coral");
            if(local_url.indexOf("bronze") != -1)
                colors.push("bronzo");
            if(local_url.indexOf("blu") != -1)
                colors.push("blu");
            if(local_url.indexOf("trasparent") != -1 || local_url.indexOf("transparent") != -1)
                colors.push("trasparente");
            if(local_url.indexOf("natural") != -1)
                colors.push("naturale");
            if(local_url.indexOf("carminio") != -1)
                colors.push("carminio");
            

            return colors;
            
            



        }

        function getCategory(file_name, category){
            file_name = file_name.toLowerCase();
            if(file_name.indexOf("te_") != -1){
                if( 
                    file_name.indexOf("kite_") == -1 &&
                    file_name.indexOf("lite_") == -1 &&
                    file_name.indexOf("mite_") == -1 &&
                    file_name.indexOf("trasparente_") == -1 &&
                    file_name.indexOf("grafite_") == -1 &&
                    file_name.indexOf("kite_") == -1 
                )
                return "TERRA";
            }

            if( file_name.indexOf("ta_") != -1)
                return "TAVOLO" 
            
            if(file_name.indexOf("sos_") != -1)
                return "SOSPENSIONE"
            
            if(file_name.indexOf("sof_") != -1)
                return "SOFFITTO"
            
            if(file_name.indexOf("pa_") != -1)
                return "PARETE"
            else    
                return category;

        }
    }

    function getModel(model, file_name){
            var new_model = model;
            if(file_name.toLowerCase().indexOf("birdie-6") != -1)
                new_model = "BIRDIE 6";
            if(file_name.toLowerCase().indexOf("birdie-9") != -1)
                new_model = "BIRDIE 9";
            if(file_name.toLowerCase().indexOf("birdie-3") != -1)
                new_model = "BIRDIE 3";

            return new_model;
        }

    //////////// QUESTO SERVE PER SCARICARE I SOLI PDF

    /*
    download_queue_pdf = _.uniq(download_queue_pdf);
    var download_queue_pdf_number = download_queue_pdf.length;

    _.log(download_queue_pdf_number)

    var progress_pdf = 0;
    
    
    startDownloadPdf();

    function startDownloadPdf(){
        if(progress_pdf == download_queue_pdf_number){
            _.log("donwload finito");
            return true;
        }
        else{
            var url = download_queue_pdf[progress_pdf];
            _.log("scarico il pdf: "+progress_pdf+" di: "+download_queue_pdf_number);
            request
                .get(url)
                .on('error', function(err) {
                    console.log(err)
                    _.log("------------------------- url: "+url)
                })
                .pipe(fs.createWriteStream("./assets/pdfs"+localizeDownload(url)))
            progress_pdf++;
            setTimeout(function(){
                startDownloadPdf();
            },3000)
        }

    }
    
    */

    
    

    /*

    //////////// QUESTO SERVE PER SCARICARE LE SOLE IMMAGINI

    download_queue = _.uniq(download_queue);
    var download_number = download_queue.length;

 
    var progress = 0;
    startDownload();

    function startDownload(){
        if(progress == download_number){
            _.log("donwload finito");
            return true;
        }
        else{
            var url = download_queue[progress];
            _.log("scarico l'immagine: "+progress+" di: "+download_number);
            request
                .get(url)
                .on('error', function(err) {
                    console.log(err)
                    _.log("------------------------- url: "+url)
                })
                .pipe(fs.createWriteStream("./assets/imgs/"+localizeUrl(url)))
            progress++;
            setTimeout(function(){
                startDownload();
            },300)
        }

    }
    */

});