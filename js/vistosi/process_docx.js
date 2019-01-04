var fs = require('fs');
var _ = require("../../lib/_node.js");
var S = require('string');
const FileHound = require('filehound');
var mammoth = require("mammoth");

var count = 0;

const files = FileHound.create()
  .paths('/Volumes/SSD-32giga/fornitori\ arteinluce/vistosi/immagini')
  //.paths('/Users/marcoallori/Desktop/testWord')
  .ext('doc','docx')
  .find()
  .then( files => {
    processaDocx(files);
  });


  function processaDocx(files){
      
      var arr_files = [];

      var files_number = files.length;
      var progress = 0;

      _.each(files, function(file){
          mammoth.extractRawText({path: file})
            .then(function(result){
                var text = result.value; // The raw text
                var arr = text.split("\n\n\n");

                var arr_pulito = _.filter(arr, function(elem){
                    return elem != "" && elem != "\n";
                })    

                arr_files.push({
                    model :             S(arr_pulito[0]).replaceAll("\n","").s,
                    designer:           S(arr_pulito[1]).replaceAll("\n","").replace("design ","").s,
                    it:                 S(arr_pulito[2]).replaceAll("\n","").s,
                    en:                 S(arr_pulito[3]).replaceAll("\n","").s,
                });

                progress++;
                if(progress == files_number){
                    fs.writeFile('docx_json.json', JSON.stringify(arr_files, null, 4), 'utf8', function(){
                        //_.log("FINITO");
                    });
                }
                    
                
            })
            .done();
      });

     
    
  }



