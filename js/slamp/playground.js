var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');
const puppeteer = require('puppeteer');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var assets = require("./assets_json.json");

_.each(assets,function(asset){
    if ( asset.variations.length > 1 ){
        _.each(asset.variations,function(variantion){
            _.log(variantion.size)
        })
    }
})