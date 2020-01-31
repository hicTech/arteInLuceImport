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



// tutto il json info_first.json copiato e incollato
var arr_all_products = [
    {
        "prod_page": "https://pentalight.it/en/prodotto/acorn-sospensione/",
        "prod_name": "acorn"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/altura/",
        "prod_name": "altura"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/angolo/",
        "prod_name": "angolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/aprile-applique/",
        "prod_name": "aprile"
    },


    /*
    {
        "prod_page": "https://pentalight.it/en/prodotto/bag-outdoor-da-terra/",
        "prod_name": "bag-outdoor"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/chi/",
        "prod_name": "chi"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/china/",
        "prod_name": "china"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/clash-applique/",
        "prod_name": "clash"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/clip-sospensione/",
        "prod_name": "clip"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/elisabeth/",
        "prod_name": "elisabeth"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/enoki-applique/",
        "prod_name": "enoki"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/feel/",
        "prod_name": "feel"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/glifo/",
        "prod_name": "glifo"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/glo/",
        "prod_name": "glo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/hang-out-sospensione/",
        "prod_name": "hang-out"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jacqueline-lampada-tavolo/",
        "prod_name": "jacqueline"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/je-suis/",
        "prod_name": "je-suis"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/jei-jei/",
        "prod_name": "jei-jei"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/klint-da-tavolo/",
        "prod_name": "klint"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lit-sospensione/",
        "prod_name": "lit"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/ludo/",
        "prod_name": "ludo"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/lula/",
        "prod_name": "lula"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/mami/",
        "prod_name": "mami"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mira-tavolo/",
        "prod_name": "mira"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/mom/",
        "prod_name": "mom"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/morsetto-tavolo/",
        "prod_name": "morsetto"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/narciso/",
        "prod_name": "narciso"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/new-classic/",
        "prod_name": "new-classic"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/polar/",
        "prod_name": "polar"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/pop-applique/",
        "prod_name": "pop"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/sop/",
        "prod_name": "sop"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/sospensioni-in-tessuto/",
        "prod_name": "sospensioni-in-tessuto"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/spoon/",
        "prod_name": "spoon"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/storm/",
        "prod_name": "storm"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/taaac-da-terra/",
        "prod_name": "taaac"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tic-toc-da-tavolo/",
        "prod_name": "tic-toc"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tile/",
        "prod_name": "tile"
    },
    {
        "prod_page": "https://pentalight.it/en/collezione/tosca/",
        "prod_name": "tosca"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/vela/",
        "prod_name": "vela"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/wonder-a-sospensione/",
        "prod_name": "wonder"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/woody-a-sospensione/",
        "prod_name": "woody"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/yan-sospensione/",
        "prod_name": "yan"
    }
    */
]




var pages_number = arr_all_products.length;



var index = 0;




avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('info_second.json', JSON.stringify(arr_second, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var name = arr_all_products[index].prod_name;
        //var prod_pic = arr_all_products[index].prod_pic;
        var uri = arr_all_products[index].prod_page;
        //var category = arr_all_products[index].category;
        //var model = arr_all_products[index].name;
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            //createJsonFromAPage(body, uri, model, name, prod_pic, category);

            
            createJsonFromAPage(name, uri);
        });

    }
}





var arr_second = [];

//function createJsonFromAPage(body, uri, model, name, prod_pic, category){
function createJsonFromAPage(name, uri){

    if(uri.indexOf("/prodotto/") != -1){
        arr_second.push({
            prod_page: uri,
            prod_name: name,
        })
        index++;
        avvia(index);
    }
    else{

    


            (async() => {
                
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(uri);


            let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);

            // aspetto comunque un po per accertarmi che ogni elemento della pagina sia scaricato e renderizzato
            await page.waitFor(2000);
            
            var $body = $(preloaded_bodyHTML);

            

            $body.find("a").each(function(){

                var href = $(this).attr("href");
                if(href != undefined){
                    if(href.indexOf("/prodotto/") != -1){
                        _.log("-----------trovato sotto prodotto")
                        var prod_name = S(href).between("/prodotto/","/").s
                        arr_second.push({
                            prod_page: href,
                            prod_name: prod_name,
                        })
                    }
                }
            })

           
            
            
            
            await browser.close();
            index++;

            avvia(index);
                
        


            })();

        }

    

}



