const tesseract = require("node-tesseract-ocr");
var svg_to_png = require('svg-to-png');
var fs = require('fs');
var _ = require("../../lib/_node.js");

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}


fs.readdir("./svg", function(err, items) {
  _.each(items,function(item){
      svg_to_png.convert(__dirname+"/svg/"+item, __dirname+"/png/",{"defaultHeight": "900px"}).then(function(){
        
        tesseract.recognize("./png/test2.png ", config)
        .then(text => {
          console.log("Result:", text)
        })
        .catch(error => {
          console.log(error.message)
        })

      })

     

    })
});


