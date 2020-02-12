var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');





var download_queue = [];


var count = 0;


fs.readFile('./assets_json.json', 'utf8', function(err, contents) {
    var json = JSON.parse(contents);

    _.each(json,function(elem){
        _.each(elem.light_schema,function(schema){
            download_queue.push(schema)
        })
    });

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
                .pipe(fs.createWriteStream("./assets/svg/"+localizeUrl(url)));
                
                
            progress++;
            setTimeout(function(){
                startDownload();
            },300)
        }

    }


    function localizeUrl(url, path){
        if( !_.is(path))
            return url.substr(url.lastIndexOf("/"));
        else
            return path+url.substr(url.lastIndexOf("/"));
    }

    
    

});



    