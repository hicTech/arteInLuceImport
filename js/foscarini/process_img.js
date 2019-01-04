var fs = require('fs');
var _ = require("../../lib/_node.js");
var S = require('string');
const FileHound = require('filehound');

const files = FileHound.create()
  .paths('/Volumes/SSD-32giga/fornitori\ arteinluce/vistosi/immagini')
  .ext('jpg','jpeg')
  .find()
  .then( files => {
    processaImmagini(files);
  });


  function processaImmagini(files){
        
        var images_json = {};
        _.each(files,function(file){
          let file_name = file.substr(file.lastIndexOf("/")+1);
          let file_id = S(file_name).replaceAll(" ","_").s;
          
          // siccome ho visto che ci sono doppioni, ovvero foto col medesimo nome,
          // costruisco un oggetto images_json nel quale elimino i doppioni
          // per ogni doppione viene presa la foto di maggior peso
          let stats = fs.statSync(file);
          let size = stats.size;
          
          if(!_.is(images_json[file_id])){
              images_json[file_id] = {
                  path: file,
                  id: file_id,
                  name: file_name,
                  size: size,
              }
          }else{
              if(size > images_json[file_id].size){
                images_json[file_id] = {
                    path: file,
                    id: file_id,
                    name: file_name,
                    size: size,
                }
              }
          }
          
        });

        fs.writeFile('images_json.json', JSON.stringify(images_json), 'utf8', function(){
            //_.log("FINITO");
        });

       
  }