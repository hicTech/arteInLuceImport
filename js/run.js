node_xj = require("xls-to-json");
var _ = require("../lib/_node.js");

  node_xj({
    input: "../sample/sample.xls",  // input xls
    output: null, //"./sample/output.json", // output json
    //sheet: "sheetname"  // specific sheetname
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
        let json = result;
        _.each(json,function(articolo){
            _.each(articolo,function(dato){
                _.log(dato.replace(/  +/g, ' '));
            })
        })
      
    }
  });