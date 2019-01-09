var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');


/*
request
  .get('https://www.foscarini.com/wp-content/uploads/2018/10/Gallery_Plena_02.jpg')
  .on('error', function(err) {
    console.log(err)
  })
  .pipe(fs.createWriteStream('doodle.png'))
*/

var download_queue = [];

fs.readFile('./site_info_remote.json', 'utf8', function(err, contents) {
    var json = JSON.parse(contents);
    _.each(json,function(elem,key){
        
        // carousel
        _.each(elem.carousel,function(carousel_elem,index){
            var url = carousel_elem;
            json[key].carousel[index] = localizeUrl(url);
            download_queue.push( url )
        });

        // other_imgs
        _.each(elem.other_imgs,function(other_imgs_elem,index){
            var url = other_imgs_elem;
            json[key].other_imgs[index] = localizeUrl(url);
            download_queue.push( url )
        });

        // projects
        _.each(elem.projects,function(projects_elem,index){
            var url = projects_elem;
            json[key].projects[index] = localizeUrl(url);
            download_queue.push( url )
        });

        // related_imgs
        _.each(elem.related_imgs,function(related_imgs_elem,index){
            var url = related_imgs_elem.img;
            json[key].related_imgs[index] = localizeUrl(url);
            download_queue.push( url )
        });

        // light_schema
        
        _.each(elem.specs,function(spec, spec_index){
            
                var url = spec.light_schema;
                json[key].specs[spec_index].light_schema = localizeUrl(url);
                download_queue.push( url )
            
        });
        

        // specs
        /*
        _.each(elem.specs,function(spec, spec_index){
            _.each(spec.downloads,function(download, download_index){
                var url = download.url;
                json[key].specs[spec_index].downloads[download_index].url = localizeUrl(url);
                download_queue.push( url )
            });    
        });
        */
        
    });

    _.log(_.uniq(download_queue).length)

    fs.writeFile('site_info_local.json', JSON.stringify(json, null, 4), 'utf8', function(){
        _.log("FINITO");
    });

    function localizeUrl(url){
        return url.substr(url.lastIndexOf("/")+1);
    }
});