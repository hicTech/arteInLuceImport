var _ = require("../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);




request({
        uri: encodeURI("https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=ASSIB&cdling=0&fg_eur_usa=E"),
        

    }, function(error, response, body) {
        _.log(body);
    });