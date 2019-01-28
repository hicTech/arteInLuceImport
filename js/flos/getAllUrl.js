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



var single_pages = [
    {
        "category": "tavolo",
        "uri": "https://flos.com/it/illuminazione-home-collection/lampade-tavolo/",
    },
    /*
    {
        "category": "sospensione",
        "uri": "https://flos.com/it/illuminazione-home-collection/lampadari-sospensione/"
    },
    {
        "category": "soffitto",
        "uri": "https://flos.com/it/illuminazione-home-collection/plafoniere/"
    },
    {
        "category": "terra",
        "uri": "https://flos.com/it/illuminazione-home-collection/lampade-terra/"
    }
    */
]





var pages_number = single_pages.length; 



var info = [];

var index = 0;

avvia(index);

function avvia(index){



    if(index == pages_number ){
        fs.writeFile('assets_json.json', JSON.stringify(info, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var uri = single_pages[index].uri;
        var category = single_pages[index].category;
        
            _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),

        }, function(error, response, body) {
            createJsonFromAPage(body, uri, category);
        });

    }
}







var arr_single_product = [];

function createJsonFromAPage(body, uri, category){

    var $body = $(body);
    //_.log(body)
    
    
 

    // uso puppeteer per recuperare i contenuti dentro l'iframe
    (async() => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(uri);       
        
        
        
        var $more_button = $body.find(".button.load-more");
        var $items = $body.find(".col-xs-12");
        

        // clicco sul pulsante load more aspetto 2 secondi e in $items avrò tutti gli articoli presenti nella pagina
        // ci clicco una sola volta perchè ho visto che in tutte e 4 le categorie non si va oltre un solo load more

        await page.click(".load-more");
        await page.waitFor(10000);

        let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);


        var $items = $(preloaded_bodyHTML).find(".col-xs-12");

        _.log($items.length)

        $items.each(function(item){
            var $a = $(this).find("a");
            var link = $a.attr("href");

            // prendo solo gli elementi che hanno una <a> al loro interno il cui href contiene la stringa "/prodotti/"
            if( $a.length > 0){
                if( link.indexOf("/prodotti/") != -1 ){
                    info.push({
                        category: category,
                        url: link,
                        //video : video_url,
                        //other_imgs : imgs_arr,
                        //projects: hide_imgs,
                        //related_imgs : related_imgs,
                        //specs: specs_arr 
                    })
                }
            }
        })
        
        
        

        
        
        
        await browser.close();

        
        
    
        index++;
        
        avvia(index);


      })();
        
    
    

}
