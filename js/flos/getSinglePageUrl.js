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


// queste sono le singole pagine copiate e incolltate da getAllUrl_json
var single_pages = [
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/aoy/aoy/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/bellhop/bellhop/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/biagio/biagio/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour-unplugged/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour-versailles/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/chapo/chapo/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/cocoon/gatto/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/copycat/copycat/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/de-light/de-light/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/extra-t2/extra-t/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/gaku/gaku-wire/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-basic-2/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-t2/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/goldman/goldman/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/ic-lights/ic-lights-t1-high/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-edge-base/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-led-base/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/mini-kelvin-led/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/ktribe/ktribe-t2/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/lampadina/lampadina/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/may-day/may-day/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/ktribe/miss-k/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/miss-sissi/miss-sissi/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/piani/piani/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/ray/ray-t-dimmer-2/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/romeo-moon/romeo-moon-t1/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/romeo-soft/romeo-soft-t/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/serena/serena/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/snoopy/snoopy/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/snoopy/snoopy-50-limited-edition/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/spun-light/spun-light-t2/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/tab/tab-t/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/guns/guns-table-gun/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/taccia/taccia/"
    },
    {
        "category": "tavolo",
        "url": "https://flos.com/it/prodotti/lampade-tavolo/tatou/tatou-t/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/2097/2097-50/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/2620/2620/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/aim/aim/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-round-large/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/chasen/chasen/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/overlap/overlap-suspension-2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/taraxacum-2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/viscontea/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/zeppelin-2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/frisbi/frisbi/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/fucsia/fucsia-12/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/glo-ball/glo-ball-s2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/ic-lights/ic-lights-s2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/ktribe/ktribe-s3/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/nebula/nebula/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/ok/ok/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/parentesi/parentesi/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/ray/ray-s/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/romeo-moon/romeo-babe-s/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/romeo-moon/romeo-moon-s2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/romeo-soft/romeo-babe-soft-s/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/romeo-soft/romeo-soft-s2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/skygarden/skygarden-2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/smithfield/smithfield-s/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/splugen-brau/splugen-brau/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/string-light/string-light-cone-head-12mt-cable/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/taraxacum-88/taraxacum-88-s2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/tatou/tatou-s2/"
    },
    {
        "category": "sospensione",
        "url": "https://flos.com/it/prodotti/lampadari-sospensione/wan/wan-s/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/265/265/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/ariette/ariette-3/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/button/button/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/clara/clara/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/clessidra/clessidra/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/foglio/foglio/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/glo-ball/glo-ball-c2/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/ic-lights/ic-lights-cw-2/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/ktribe/ktribe-w/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/lightspring/lightspring-double/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/long-light-cw/long-light/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/moni/moni-2/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/ontherocks/ontherocks-hl/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/pochette/pochette/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/romeo-moon/romeo-babe-w/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/romeo-soft/romeo-babe-soft-w/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/skygarden/skygarden-recessed-gy6-35/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/smithfield/smithfield-c/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/taraxacum-88/taraxacum-88-cw/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/tight-light-cw/tight-light/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/tilee/tilee/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/wan/wan-cw/"
    },
    {
        "category": "soffitto",
        "url": "https://flos.com/it/prodotti/plafoniere/wirering/wirering-bianco/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/arco/arco/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/bibliotheque-nationale/bibliotheque-nationale/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/captain-flint/captain-flint/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/cocoon/chrysalis/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/cocoon/fantasma/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/glo-ball/glo-ball-f3/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/ic-lights/ic-lights-f2/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/ipnos/ipnos/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/kelvin-led/kelvin-led-f/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/ktribe/ktribe-f3/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/guns/guns-lounge-gun/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/luminator/luminator/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/ray/ray-f2/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/romeo-moon/romeo-moon-f/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/romeo-soft/romeo-soft-f/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/romeo-soft/superarchimoon-2/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/rosy-angelis/rosy-angelis/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/sawaru/sawaru/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/shade/shade/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/spun-light/spun-light-f/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/stylos/stylos/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/superloon/superloon/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/tab/tab-f/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/tatou/tatou-f/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/toio/toio/"
    },
    {
        "category": "terra",
        "url": "https://flos.com/it/prodotti/lampade-terra/toio/toio-limited-edition-matt-black/"
    }
]





var pages_number = single_pages.length; 



var info = [];

var index = 0;

avvia(index);

function avvia(index){



    if(index == pages_number ){
        fs.writeFile('getSinglePageUrl_json.json', JSON.stringify(info, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var url = single_pages[index].url;
        var category = single_pages[index].category;
        
            _.log("processo: "+url+" mancano: "+parseInt(pages_number-1-index))
        request({
            url: encodeURI(url),

        }, function(error, response, body) {
            createJsonFromAPage(body, url, category);
        });

    }
}







var arr_single_product = [];

function createJsonFromAPage(body, url, category){

    var $body = $(body);

    var $all_products = $body.find(".product-models-slider").eq(0);

    $all_products.find("a").each(function(){
        var href = $(this).attr("href");
        info.push(href);
    })

    index++;

    avvia(index);


    
    
    

}
