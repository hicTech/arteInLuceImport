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
        
        var images_json = {};
        _.each(files,function(file){
          let file_name = file.substr(file.lastIndexOf("/")+1);
          let file_id = S(file_name).replaceAll(" ","_").s;

          //alcuni file hanno un capia che ha nel nodme copia.jpg
          file_id = file_id.replace("_copia.jpg",".jpg");


          
          
          // siccome ho visto che ci sono doppioni, ovvero foto col medesimo nome,
          // costruisco un oggetto images_json nel quale elimino i doppioni
          // per ogni doppione viene presa la foto di maggior peso
          let stats = fs.statSync(file);
          let imgSize = stats.size;
          let type = getType(file_name);
          let size = getSize(file_name);
          let color = getColor(file_name);
          let model = getModel(file_id);
          let led = hasLed(file_id);
          let category = getCategory(type);
          let more = getMore(file_id,model)
          
          if(!_.is(images_json[file_id])){
              images_json[file_id] = {
                  path: file,
                  id: file_id,
                  name: file_name,
                  imgSize: imgSize,
                  model: model,
                  type: type,
                  category: category,
                  size: size,
                  color: color,
                  led: led,
                  more : more,
                  
              }
          }else{
              if(imgSize > images_json[file_id].size){
                images_json[file_id] = {
                    path: file,
                    id: file_id,
                    name: file_name,
                    imgSize: imgSize,
                    model: model,
                    type: type,
                    category: category,
                    size: size,
                    color: color,
                    led: led,
                    more, more,
                }
              }
          }
          
        });

        function getType(name){

            if(name.indexOf(" PP ") != -1 || name.indexOf(" PL-AP") != -1 || name.indexOf("PL+AP") != -1 || name.indexOf("PL AP") != -1){
                return "plafone/applique";
            }
            if(name.indexOf("PT-SP") != -1){
                return "piantana/sospensione";
            }
            if(name.indexOf("AP-SP") != -1){
                return "applique/sospensione";
            }
            if(name.indexOf("pl+tr") != -1){
                return "plafone/terra";
            }

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
                                
                                
                                    if(name.indexOf(" FA ") != -1 || name.indexOf("-fa ") != -1){
                                        return "faretto";
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

        function getCategory(type){
            if(type=="sospensione")
                return ["sospensione"];
            if(type=="lettura")
                return ["tavolo"];
            if(type=="applique")
                return ["parete"];
            if(type=="plafone")
                return ["soffitto"];
            if(type=="piantana")
                return ["terra"];

            if(type=="plafone/applique" || type =="applique/sospensione")
                return ["soffitto","parete"];
            if(type=="faretto")
                return ["soffitto","parete"];
            if(type=="piantana/sospensione")
                return ["terra","sospensione"];
            if(type=="plafone/terra")
                return ["soffitto","terra"];
            else
                return undefined;
        }

        function getSize(name){
            if( name.indexOf(" G ") != -1 || name.indexOf("grande") != -1 )
                return "grande";
            else{
                if( name.indexOf(" P ") != -1 || name.indexOf("piccola") != -1)
                    return "piccola"
                else{
                    if( name.indexOf(" M ") != -1 || name.indexOf("media") != -1 )
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
            var index = 0;
            for(var i=0;i<file_id.length;i++){
                if(file_id[i] != "_" && file_id[i] != "-")
                    index++;
                else
                    break;
            }
            
            return S(file_id).substr(0,index).s.toLowerCase();
            
        } 
        
        function hasLed(file_id){
            if(file_id.indexOf("led") != -1)
                return 1;
            return 0;

        }

        function getMore(file_id,model){
            file_id = file_id.replace(".jpg","").replace(model.toUpperCase()+"_","");
            var file_id_arr = file_id.split("_");

           // _.log(file_id_arr)
            
            var d = undefined;

            for(var i=0; i<file_id_arr.length;i++){
                if( _.is(getD(file_id_arr[i])) ){
                    d = getD(file_id_arr[i]);
                }
            }

            var screw = undefined;

            for(var i=0; i<file_id_arr.length;i++){
                var val = file_id_arr[i];
                if( val.indexOf("E27") != -1){
                    screw = "e27";
                    break;
                }
                if( val.indexOf("G9") != -1){
                    screw = "g9";
                    break;
                }
                if( val.indexOf("GA3") != -1){
                    screw = "ga3";
                    break;
                }
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
                d : d,
                screw: screw,
            };
            
        }
            
            
        //_.log(_.keys(images_json).length)
        

        fs.writeFile('images_json.json', JSON.stringify(images_json, null, 4), 'utf8', function(){
            //_.log("FINITO");
        });

       
  }



String.prototype.count=function(s1) { 
    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}