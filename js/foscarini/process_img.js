var fs = require('fs');
var _ = require("../../lib/_node.js");
var S = require('string');
const FileHound = require('filehound');

const files = FileHound.create()
  .paths('/Volumes/SSD-32giga/fornitori\ arteinluce/foscarini/immagini')
  .ext('jpg','jpeg')
  .find()
  .then( files => {
    processaImmagini(files);
  });


  function processaImmagini(files){
        
        var temp_arr = [];
        _.each(files,function(file){
            let file_name = file.substr(file.lastIndexOf("/")+1).toLowerCase();
            let file_name_id = S(file_name).replaceAll(" ","_").replaceAll("__","_").replaceAll(".jpg","").s;
            //let prefix_code = file_name_id.substr(0,file_name_id.indexOf("_"));
            temp_arr.push(file_name_id);

          
        });

        _.log(temp_arr.length)
        

        //fs.writeFile('images_json.json', JSON.stringify(images_json), 'utf8', function(){
            //_.log("FINITO");
        //});

       
  }