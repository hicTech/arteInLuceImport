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
            json[key].carousel[index] = localizeUrl(url,"/foscarini/assets/imgs");
            download_queue.push( url )
        });

        // other_imgs
        _.each(elem.other_imgs,function(other_imgs_elem,index){
            var url = other_imgs_elem;
            json[key].other_imgs[index] = localizeUrl(url,"/foscarini/assets/imgs");
            download_queue.push( url )
        });

        // projects
        _.each(elem.projects,function(projects_elem,index){
            var url = projects_elem;
            json[key].projects[index] = localizeUrl(url,"/foscarini/assets/imgs");
            download_queue.push( url )
        });

        // related_imgs
        _.each(elem.related_imgs,function(related_imgs_elem,index){
            var url = related_imgs_elem.img;
            json[key].related_imgs[index].img = localizeUrl(url,"/foscarini/assets/imgs");
            download_queue.push( url )
        });

        // light_schema
        
        _.each(elem.specs,function(spec, spec_index){
                var url = spec.light_schema;
                json[key].specs[spec_index].light_schema = localizeUrl(url,"/foscarini/assets/imgs");
                download_queue.push( url )
        });
        

        // specs
        
        _.each(elem.specs,function(spec, spec_index){
            _.each(spec.downloads,function(download, download_index){
                // considero solo il caso in cui c'è "url"
                if( _.is(download.url) ){
                    var url = download.url;
                    json[key].specs[spec_index].downloads[download_index].url = localizeDownload(url,"/foscarini/assets/pdfs");
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