var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');
var svg_to_png = require('svg-to-png');


fs.readdir("./assets/svg", function(err, items) {
    _.each(items,function(item){
        svg_to_png.convert(__dirname+"/assets/svg/"+item,__dirname+"/assets/png/");
    })
});

//svg_to_png.convert(__dirname+"/assets/svg/aaa.svg",__dirname+"/assets/png/")