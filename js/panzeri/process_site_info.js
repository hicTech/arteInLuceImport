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




// questo è l'array degli url delle pagine di tutti i prodotti (206) singoli FLOS copia e incollata da getSinglePageUrl_json.json
var arr_all_products = {

    // design/indoor
    
    0: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/agave/", prod_pic: "http://www.panzeri.it/media/FP/FP-Agave.jpg"},
    1: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/aldecimo/", prod_pic: "http://www.panzeri.it/media/FP/FP-Aldecimo.jpg"},
    2: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/app/", prod_pic: "http://www.panzeri.it/media/FP/FP-App.jpg"},
    3: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/blanca/", prod_pic: "http://www.panzeri.it/media/FP/FP-Blanca.jpg"},
    4: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/brooklyn line/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn_Line.jpg"},
    5: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/brooklyn round/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn_Round.jpg"},
    6: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/candle/", prod_pic: "http://www.panzeri.it/media/FP/FP-Candle.jpg"},
    7: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/carmen/", prod_pic: "http://www.panzeri.it/media/FP/FP-Carmen-Carmencita.jpg"},
    8: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/carmencita/", prod_pic: "http://www.panzeri.it/media/FP/FP-Carmen-Carmencita.jpg"},
    9: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/classic/", prod_pic: "http://www.panzeri.it/media/FP/FP-Classic.jpg"},
    10: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/clio/", prod_pic: "http://www.panzeri.it/media/FP/FP_Clio.jpg"},
    11: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/cross/", prod_pic: "http://www.panzeri.it/media/FP/FP-Cross.jpg"},
    12: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/disco/", prod_pic: "http://www.panzeri.it/media/FP/FP-Disco.jpg"},
    13: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/domino/", prod_pic: "http://www.panzeri.it/media/FP/FP-Domino.jpg"},
    14: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/elle/", prod_pic: "http://www.panzeri.it/media/FP/FP-Elle.jpg"},
    15: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/emma/", prod_pic: "http://www.panzeri.it/media/FP/FP-Emma.jpg"},
    16: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/flat/", prod_pic: "http://www.panzeri.it/media/FP/FP-Flat.jpg"},
    17: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/floral/", prod_pic: "http://www.panzeri.it/media/FP/FP-Floral.jpg"},
    18: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/giano/", prod_pic: "http://www.panzeri.it/media/FP/FP-Giano.jpg"},
    19: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/gilbert/", prod_pic: "http://www.panzeri.it/media/FP/FP-Gilbert.jpg"},
    20: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/golden ring/", prod_pic: "http://www.panzeri.it/media/FP/FP-Golden_Ring.jpg"},
    21: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/jackie/", prod_pic: "http://www.panzeri.it/media/FP/FP-Jackie.jpg"},
    22: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/jackie iot/", prod_pic: "http://www.panzeri.it/media/FP/FP-Jackie_IoT.jpg"},
    23: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/jackie spot/", prod_pic: "http://www.panzeri.it/media/FP/FP-Jackie_Spot.jpg"},
    24: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/jazz/", prod_pic: "http://www.panzeri.it/media/FP/FP-Jazz.jpg"},
    25: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/kubik/", prod_pic: "http://www.panzeri.it/media/FP/FP-Kubik.jpg"},
    26: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/line/", prod_pic: "http://www.panzeri.it/media/FP/FP-Line.jpg"},
    27: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/olivia/", prod_pic: "http://www.panzeri.it/media/FP/FP-Olivia-Emma-Clio.jpg"},
    28: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/one/", prod_pic: "http://www.panzeri.it/media/FP/FP-One.jpg"},
    29: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/planet ring/", prod_pic: "http://www.panzeri.it/media/FP/FP-Planet_Ring_P.jpg"},
    30: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/silver ring/", prod_pic: "http://www.panzeri.it/media/FP/FP-Silver_Ring_L.jpg"},
    31: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/tate/", prod_pic: "http://www.panzeri.it/media/FP/FP-Tate.jpg"},
    32: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/three/", prod_pic: "http://www.panzeri.it/media/FP/FP-Three.jpg"},
    33: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/to-be/", prod_pic: "http://www.panzeri.it/media/FP/FP-To-be-L027__.045.1701.jpg"},
    34: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/toy/", prod_pic: "http://www.panzeri.it/media/FP/FP-Toy.jpg"},
    35: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/toy gypso/", prod_pic: "http://www.panzeri.it/media/FP/FP-Toy_Gypso.jpg"},
    36: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/twister/", prod_pic: "http://www.panzeri.it/media/FP/FP-Twister.jpg"},
    37: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/two/", prod_pic: "http://www.panzeri.it/media/FP/FP-Two.jpg"},
    38: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/viisi/", prod_pic: "http://www.panzeri.it/media/FP/FP-Viisi.jpg"},
    39: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/viki/", prod_pic: "http://www.panzeri.it/media/FP/FP-Viki.jpg"},
    40: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/willy/", prod_pic: "http://www.panzeri.it/media/FP/FP-Willy-glass.jpg"},
    41: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/ypsilon/", prod_pic: "http://www.panzeri.it/media/FP/FP-Ypsilon.jpg"},
    42: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/zero/", prod_pic: "http://www.panzeri.it/media/FP/FP-Zero.jpg"},
    43: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/gong/", prod_pic: "http://www.panzeri.it/media/FP/FP-Gong.jpg"},
    44: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/ginevra/", prod_pic: "http://www.panzeri.it/media/FP/FP-Ginevra.jpg"},


    //design/outdoor
    45: {prod_page: "http://www.panzeri.it/prodotti/design/outdoor/box/", prod_pic: "http://www.panzeri.it/media/FP/FP-Box-XQ144.jpg"},
    46: {prod_page: "http://www.panzeri.it/prodotti/design/outdoor/draco/", prod_pic: "http://www.panzeri.it/media/FP/FP-Draco.jpg"},
    47: {prod_page: "http://www.panzeri.it/prodotti/design/outdoor/four/", prod_pic: "http://www.panzeri.it/media/FP/FP-Four.jpg"},
    48: {prod_page: "http://www.panzeri.it/prodotti/design/outdoor/lampyris/", prod_pic: "http://www.panzeri.it/media/FP/FP-LAMPyris.jpg"},
    49: {prod_page: "http://www.panzeri.it/prodotti/design/outdoor/potter/", prod_pic: "http://www.panzeri.it/media/FP/FP-Potter.jpg"},
    50: {prod_page: "http://www.panzeri.it/prodotti/design/outdoor/ralph/", prod_pic: "http://www.panzeri.it/media/FP/FP-Ralph.jpg"},

    // architectural/profili
    51: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/broadway/", prod_pic: "http://www.panzeri.it/media/FP/FP-Broadway.jpg"},
    52: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn.jpg"},
    53: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/brooklyn out/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn_Out.jpg"},
    54: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/brooklyn round/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn_Round.jpg"},
    55: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/brooklyn trim/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn_Trim.jpg"},
    56: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/corner/", prod_pic: "http://www.panzeri.it/media/FP/FP-Corner.jpg"},
    57: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/giano/", prod_pic: "http://www.panzeri.it/media/FP/FP-Giano.jpg"},
    58: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/manhattan/", prod_pic: "http://www.panzeri.it/media/FP/FP-Manhattan.jpg"},
    59: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/nolita/", prod_pic: "http://www.panzeri.it/media/FP/FP-Nolita.jpg"},
    60: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/nolita out/", prod_pic: "http://www.panzeri.it/media/FP/FP-Nolita_Out.jpg"},
    61: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/nolita trim/", prod_pic: "http://www.panzeri.it/media/FP/FP-Nolita_Trim.jpg"},
    62: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/tribeca/", prod_pic: "http://www.panzeri.it/media/FP/FP-Tribeca.jpg"},


    // architectural/incassi
    63: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/joe/", prod_pic: "http://www.panzeri.it/media/FP/FP-Joe.jpg"},
    64: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/roy/", prod_pic: "http://www.panzeri.it/media/FP/FP-Roy.jpg"},
    65: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/joe.q/", prod_pic: "http://www.panzeri.it/media/FP/FP-Joe.Q.jpg"},
    66: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/joe twist/", prod_pic: "http://www.panzeri.it/media/FP/FP-Joe_Twist.jpg"},
    67: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq0998/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ0998.jpg"},
    68: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq0999/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ0999.jpg"},
    69: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1000/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1000-1.jpg"},
    70: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1004/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1004.jpg"},
    71: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1015/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1015.jpg"},
    72: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1019/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1019.jpg"},
    73: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1025/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1025.jpg"},
    74: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1026/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1026.jpg"},
    75: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1031/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1031.jpg"},



    
    77: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1032/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1032.jpg"},
    78: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1034-1.jpg"},
    79: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1210/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1210.jpg"},
    80: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1211/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGQ1211.jpg"},
    81: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgr0997/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGR0997.jpg"},
    82: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgr1020/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGR1020.jpg"},
    83: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgr1021/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGR1021.jpg"},
    84: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgr1023/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGR1023.jpg"},
    85: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgr1024/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGR1024.jpg"},
    86: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgr1027/", prod_pic: "http://www.panzeri.it/media/FP/FP-XGR1027.jpg"},
    87: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xsv2008/", prod_pic: "http://www.panzeri.it/media/FP/FP-XSV2008.jpg"},
    88: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/queens in 60/", prod_pic: "http://www.panzeri.it/media/FP/FP-Queens_In-XR262.jpg"},
    89: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/queens in 50 ip65/", prod_pic: "http://www.panzeri.it/media/FP/FP-queens_in_50_ip65.jpg"},
    90: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/queens in 40/", prod_pic: "http://www.panzeri.it/media/FP/FP-queens_in_40.jpg"},

        // architectural/spotlight
    91: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/brooklyn spot/", prod_pic: "http://www.panzeri.it/media/FP/FP-Brooklyn_Spot_XM.jpg"},
    92: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/queens mini/", prod_pic: "http://www.panzeri.it/media/FP/FP-Queens_Mini-XM748-12.jpg"},
    93: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/queens spot/", prod_pic: "http://www.panzeri.it/media/FP/FP-Queens_Spot-XM742-19.jpg"},
    94: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/queens compact/", prod_pic: "http://www.panzeri.it/media/FP/FP-Queens_Compact-XM751.jpg"},
    95: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/soho spot micro/", prod_pic: "http://www.panzeri.it/media/FP/FP-soho_spot_micro.jpg"},
    96: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/soho spot micro low/", prod_pic: "http://www.panzeri.it/media/FP/FP-soho_spot_micro_low.jpg"},
    97: {prod_page: "http://www.panzeri.it/prodotti/architectural/spotlight/soho spot nano/", prod_pic: "http://www.panzeri.it/media/FP/FP-soho_spot_nano.jpg"},
}
    



// arr piccolo di prova


/*
var arr_all_products = {

    // design/indoor
    0: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/giano/", prod_pic: "http://www.panzeri.it/media/FP/FP-Giano.jpg"},
    1: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/domino/", prod_pic: "http://www.panzeri.it/media/FP/FP-Domino.jpg"},
    2: {prod_page: "http://www.panzeri.it/prodotti/design/indoor/emma/", prod_pic: "http://www.panzeri.it/media/FP/FP-Emma.jpg"},
    3: {prod_page: "http://www.panzeri.it/prodotti/architectural/profili/nolita/", prod_pic: "http://www.panzeri.it/media/FP/FP-Nolita.jpg"},
}


var arr_all_products = {

    // design/indoor
    0: {prod_page: "http://www.panzeri.it/prodotti/architectural/incassi/xgq1031/", prod_pic: "http://www.panzeri.it/media/FP/FP-Giano.jpg"}
}

*/
    


var pages_number = _.keys(arr_all_products).length;



var index = 0;




avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('assets_json_intermendio.json', JSON.stringify(arr_single_product, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var uri = arr_all_products[index].prod_page;
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            createJsonFromAPage(body, uri);
        });

    }
}


// siccome capita che si impinga ogni minuto faccio il console.log dell'array in modo che posso ripartire da dove si è impinto
setInterval(function(){
    _.log(_.toStr(JSON.stringify(arr_single_product, null, 4)))
},60000)



var arr_single_product = [];

function createJsonFromAPage(body, uri){


    (async() => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        
        
        await page.goto(uri);

       
        
        let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);
        
       

        var trovati = $(preloaded_bodyHTML).find(".articolo").length;

        _.log("comunque aspettto")
        await page.waitFor(6000);
        _.log("HO ASPETTATO")

        if(trovati > 5 ){
            _.log("faccio super scroll della pagina");
            await page.waitFor(2000);
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.waitFor(2000);
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.waitFor(2000);
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.waitFor(3000);
            await page.evaluate('window.scrollTo(0, 21000)');
            await page.evaluate('window.scrollTo(0, 21000)');
            await page.evaluate('window.scrollTo(0, 21000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.waitFor(2000);
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 23000)');
            await page.evaluate('window.scrollTo(0, 23000)');
            await page.evaluate('window.scrollTo(0, 23000)');
            await page.evaluate('window.scrollTo(0, 23000)');

            preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);
        }


        var $body = $(preloaded_bodyHTML);
        

        var $model = $body.find(".row.inner.column_container").eq(1);
        var model = $model.find("h1").html();      
        
        var projects = [];

        var $project_images = $body.find(".swiper-slide");

        $project_images.each(function(){
            projects.push("http://www.panzeri.it/"+ $(this).find("img").attr("src"))
        });



        var link_varianti = [];

        var $article = $body.find(".articolo");


        $article.each(function(){
            $(this).find(".c6").each(function(){
                var $c6 = $(this);
                if($(this).find(".emissionelist").length != 0){
                    $c6.find("a").each(function(){
                        var href = $(this).attr("href");
                        link_varianti.push(href)
                    })
                }
            })
        })



        arr_single_product.push({
            uri: uri,
            model: model,
            projects : projects,
            link_varianti: link_varianti,
        })
        
        
        await browser.close();

       
    
        index++;
        
        avvia(index);


    })();



    

}



