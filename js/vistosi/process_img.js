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
          let color = getColor(file_name);
          let model = getModel(file_id);
          
          if(!_.is(files_json[file_id])){
              files_json[file_id] = {
                  path: file,
                  id: file_id,
                  name: file_name,
                  imgSize: imgSize,
                  model: model,
                  type: type,
                  size: size,
                  color: color,
              }
          }else{
              if(imgSize > files_json[file_id].size){
                files_json[file_id] = {
                    path: file,
                    id: file_id,
                    name: file_name,
                    imgSize: imgSize,
                    model: model,
                    type: type,
                    size: size,
                    color: color,
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

        function getColor(name){
            let colors = [];
            var str = name.toLowerCase();
            
            //  ripulisco la stringa da tutti i caratteri che non indicano colori e quindi potrebbero 
            //  disturbare il recupero dei colori
            str = str.substr(str.indexOf(" ")); // elimino la prima parola fino alla spazio (sarebbe il nome dell'articolo)

            // se trova che iniziano per questi valori li elimina
            if(str.indexOf("lt - ")==1)
                str = str.replace("lt - ","");

            if(str.indexOf("sp - ")==1)
                str = str.replace("sp - ","");
            
            if(str.indexOf("pt - ")==1)
                str = str.replace("pt - ","");

            if(str.indexOf("pp - ")==1)
                str = str.replace("pp - ","");
            
            if(str.indexOf("ap - ")==1)
                str = str.replace("ap - ","");
            
            if(str.indexOf("pl - ")==1)
                str = str.replace("pl - ","");


            if(str.indexOf("lt ")==1)
                str = str.replace("lt ","");

            if(str.indexOf("sp ")==1)
                str = str.replace("sp ","");
            
            if(str.indexOf("pt ")==1)
                str = str.replace("pt ","");

            if(str.indexOf("pp ")==1)
                str = str.replace("pp ","");
            
            if(str.indexOf("ap ")==1)
                str = str.replace("ap ","");
            
            if(str.indexOf("pl ")==1)
                str = str.replace("pl ","");

            // elimina tutte queste sossostringhe
            str = S(str).replaceAll("copia","").replaceAll(".jpg","").replaceAll("apl","").replaceAll(" part","")
                        .replaceAll("rev.","").replaceAll("rev","").replaceAll("led","").replaceAll("still","").replaceAll(" p ","")
                        .replaceAll(" m ","").replaceAll(" p ","").replaceAll(" ap ","").replaceAll(" lt ","").replaceAll(" pl ","").replaceAll("grande","")
                        .replaceAll("senza","").replaceAll("marmo","").replaceAll("parete","").replaceAll("istallo-particolare","").replaceAll("chiaro","")
                        .replaceAll("apicolare","").replaceAll("apicolare","")
                        .replaceAll(" g ","").s;

            // elimino tutti i numeri
            str = str.replace(/[0-9]/g, '');

            

            if(str.indexOf("bc") != -1){
                for(var i=0; i< str.count("bc");i++)
                    colors.push("bianco")
            }
            if(str.indexOf("white") != -1){
                for(var i=0; i< str.count("white");i++)
                    colors.push("bianco")
            }
            if(str.indexOf("bianca") != -1){
                for(var i=0; i< str.count("bianca");i++)
                    colors.push("bianca")
            }
            if(str.indexOf("sf") != -1){
                for(var i=0; i< str.count("sf");i++)
                    colors.push("sfumato")
            }
            if(str.indexOf("cr") != -1){
                for(var i=0; i< str.count("cr");i++)
                    colors.push("cromo")
            }
            if(str.indexOf("fu") != -1){
                for(var i=0; i< str.count("fu");i++)
                    colors.push("fume")
            }
            if(str.indexOf("amb") != -1){
                for(var i=0; i< str.count("amb");i++)
                    colors.push("ambra")
            }
            if(str.indexOf("am") != -1){
                for(var i=0; i< str.count("am");i++)
                    colors.push("ambra")
            }
            if(str.indexOf("to") != -1){
                for(var i=0; i< str.count("to");i++)
                    colors.push("topazio")
            }
            

            if(str.indexOf("-ri") != -1 || str.indexOf(" ri ") != -1){
                colors.push("rigato")
            }

            if(str.indexOf(" ne") != -1 || str.indexOf("-ne") != -1 || str.indexOf("ne") == 0){
                colors.push("nero")
            
            }
            if(str.indexOf(" or") != -1 ){
                colors.push("oro")
            }
            if(str.indexOf(" gr") != -1 ){
                colors.push("nero")
            }
            if(str.indexOf(" mc") != -1 ){
                colors.push("multicolore")
            }
            if(str.indexOf(" ag") != -1 ){
                colors.push("argento")
            }
            if(str.indexOf("-rs") != -1 ){
                colors.push("rosa")
            }
            if(str.indexOf("-av") != -1 ){
                colors.push("avorio")
            }
            if(str.indexOf(" se ") != -1 || str.indexOf("  se") != -1 ){
                colors.push("seta")
            }
            if(str.indexOf("tabacco") != -1 ){
                colors.push("tabacco")
            }
            if(str.indexOf("sabbia") != -1 ){
                colors.push("sabbia")
            }
            if(str.indexOf("sb") != -1 ){
                colors.push("sabbia")
            }
            if(str.indexOf("satin") != -1 ){
                colors.push("satinato")
            }
            if(str.indexOf("lucido") != -1 ){
                colors.push("lucido")
            }
            if(str.indexOf("-cm") != -1 ){
                colors.push("metallizzato")
            }
            if(str.indexOf("fl") != -1 ){
                colors.push("florescente")
            }
            if(str.indexOf("sp") != -1 ){
                colors.push("specchiato")
            }
            if(str.indexOf("ar") != -1 ){
                if(str.indexOf("arancio") != -1 ){
                    colors.push("arancio")
                }
                else{
                    if(str.indexOf(" ar") != -1 ){
                        colors.push("arancio")
                    }
                }
            }
            

            

            return colors;
        }

        function getModel(file_id){
            return S(file_id).substr(0,file_id.indexOf("_")).s;
        }    
            
            
            
        

        fs.writeFile('files_json.json', JSON.stringify(files_json), 'utf8', function(){
            //_.log("FINITO");
        });

       
  }



String.prototype.count=function(s1) { 
    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}