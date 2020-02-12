const tesseract = require("node-tesseract-ocr");
var svg_to_png = require('svg-to-png');
var fs = require('fs');
var _ = require("../../lib/_node.js");

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

var ocr_json = [];

fs.readdir("./assets/svg", function(err, items) {




    var svg_number = items.length;

    converti(svg_number);



    function converti(i){
      i--;
      if(i==0){
        _.log("conversione conclusa");

        fs.writeFile('ocr_result.json', JSON.stringify(ocr_json, null, 4), 'utf8', function(){
          _.log("FINITO");
        });
        return true;
      }
      else{

        svg_to_png.convert(__dirname+"/assets/svg/"+items[i], __dirname+"/assets/png/",{"defaultHeight": "900px"}).then(function(){
        
          var converted_file_name = items[i].replace(".svg",".png");
          
          
          tesseract.recognize(__dirname+"/assets/png/"+converted_file_name, config)
          .then(text => {
            _.log("processo la --------------------------------- "+i)
            console.log("Result:", text.split("\n"));
            ocr_json.push({
              file : "file:///Users/macbookmarconi/Desktop/Workspace/arteInLuceImport/js/penta/assets/png/"+converted_file_name,
              ocr_result : text.split("\n")
            })
            converti(i)
          })
          .catch(error => {
            console.log(error.message)
          })
          
          
  
        })
      }
    }





});


