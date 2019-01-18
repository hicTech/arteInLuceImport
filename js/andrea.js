var _ = require("../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');
const http = require('https')
const util = require('util');
const exec = util.promisify(require('child_process').exec); 

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

async function getDOM(url) {
  return (await exec(url)).stdout
}

async function main() {
  let res = await getDOM('https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=ASSIB&cdling=0&fg_eur_usa=console.error')
    
  console.log(res)
}

if (!!require.main) {
  (async () => {
    try {
      await main()
    } catch (e) {
      console.error(e);
    } finally {
      /* release resouce as db connection */
    }
  })()
}
