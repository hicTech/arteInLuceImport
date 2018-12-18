var fs = require('fs');
var _ = require("../../lib/_node.js");
var S = require('string');
const FileHound = require('filehound');

var count = 0;

const files = FileHound.create()
  .paths('/Volumes/SSD-32giga/fornitori\ arteinluce/vistosi/immagini')
  .ext('jpg','jpeg')
  .find()
  .then( files => {
    processaImmagini(files);
  });


  function processaImmagini(files){
        
        var files_json = {};
        _.each(files,function(file){
          let file_name = file.substr(file.lastIndexOf("/")+1);
          let file_id = S(file_name).replaceAll(" ","_").s;
          
          // siccome ho visto che ci sono doppioni, ovvero foto col medesimo nome,
          // costruisco un oggetto files_json nel quale elimino i doppioni
          // per ogni doppione viene presa la foto di maggior peso
          let stats = fs.statSync(file);
          let imgSize = stats.size;
          let type = getType(file_name);
          let size = getSize(file_name);
          
          if(!_.is(files_json[file_id])){
              files_json[file_id] = {
                  path: file,
                  id: file_id,
                  name: file_name,
                  imgSize: imgSize,
                  type: type,
                  size: size,
              }
          }else{
              if(imgSize > files_json[file_id].size){
                files_json[file_id] = {
                    path: file,
                    id: file_id,
                    name: file_name,
                    imgSize: imgSize,
                    type: type,
                    size: size,
                }
              }
          }
          
        });

        function getType(name){
            if(name.indexOf(" SP ") != -1 || name.indexOf(" SP-") != -1 || name.indexOf(" sp ") != -1 || name.indexOf(" SP.") != -1 || name.indexOf("-sp") != -1 || name.indexOf(" sosp") != -1){
                return "sospensione";
            }
            else{
                if(name.indexOf(" LT") != -1 || name.indexOf("-lt ") != -1){
                    return "lettura";
                }
                else{
                    if(name.indexOf(" AP ") != -1 || name.indexOf(" ap ") != -1 || name.indexOf(" AP") != -1 || name.indexOf(" AP.") != -1 || name.indexOf(" Apl") != -1 || name.indexOf(" apl") != -1 || name.indexOf("-ap") != -1){
                        return "applique";
                    }
                    else{
                        if(name.indexOf(" PL ") != -1 || name.indexOf(" PL.") != -1 || name.indexOf("-PL-") != -1 || name.indexOf("plaf") != -1 || name.indexOf("-pl") != -1){
                            return "plafone";
                        }
                        else{
                        if(name.indexOf(" PT ") != -1 || name.indexOf(" PT.") != -1 || name.indexOf("-pt-") != -1){
                                return "piantana";
                            }
                            else{
                                if(name.indexOf(" PP ") != -1 || name.indexOf(" PL-AP") != -1){
                                    return "plafone/applique";
                                }
                                else{
                                    if(name.indexOf(" FA ") != -1 || name.indexOf("-fa ") != -1){
                                        return "faretto";
                                    }
                                    else{
                                        if(name.indexOf("PT-SP") != -1){
                                            return "piantana/sospensione";
                                        }
                                        else{
                                            if(name.indexOf("AP-SP") != -1){
                                                return "applique/sospensione";
                                            }
                                            else{
                                                if(name.indexOf("pl+tr") != -1){
                                                    return "plafone/terra";
                                                }
                                                else{
                                                    return undefined;
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

        function getSize(name){
            if( name.indexOf(" G ") != -1 )
                return "grande";
            else{
                if( name.indexOf(" P ") != -1 )
                    return "piccola"
                else{
                    if( name.indexOf(" M ") != -1 )
                        return "media"
                    else{
                       return undefined;
                    }

                }
            }


        }

        fs.writeFile('files_json.json', JSON.stringify(files_json), 'utf8', function(){
            //_.log("FINITO");
        });

       
  }