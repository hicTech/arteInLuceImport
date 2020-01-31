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


//  nella pagina https://pentalight.it/?s=&post_type=collezione ci sono 42 link a relative collezioni contenenti appunto href del tipo: https://pentalight.it/collezione/acorn/, https://pentalight.it/collezione/altura/, ....
//  ora alcuni link vengono redirettati per esempio  https://pentalight.it/collezione/acorn/  ---> https://pentalight.it/en/prodotto/acorn-sospensione/ ciò indica che questa è la scheda finale del prodotto (unico prodotto)
//  questo prima script crea info_first.json che contiene tutte le pagine dei link inclusi nella pagina https://pentalight.it/?s=&post_type=collezione nella fase successiva (second) verificheremo che ogni pagina sia un prodotto finale
//  oppure contiene i link ai prodotti effettivi



// tutto il json collezioni.json copiato e incollato
var arr_all_products = [{
    "prod_page": "https://pentalight.it/collezione/acorn/",
    "prod_name": "acorn"
}, {
    "prod_page": "https://pentalight.it/collezione/altura/",
    "prod_name": "altura"
}, 
{
    "prod_page": "https://pentalight.it/collezione/angolo/",
    "prod_name": "angolo"
}, {
    "prod_page": "https://pentalight.it/collezione/aprile/",
    "prod_name": "aprile"
}, {
    "prod_page": "https://pentalight.it/collezione/bag-outdoor/",
    "prod_name": "bag-outdoor"
}, {
    "prod_page": "https://pentalight.it/collezione/chi/",
    "prod_name": "chi"
}, {
    "prod_page": "https://pentalight.it/collezione/china/",
    "prod_name": "china"
}, {
    "prod_page": "https://pentalight.it/collezione/clash/",
    "prod_name": "clash"
}, {
    "prod_page": "https://pentalight.it/collezione/clip/",
    "prod_name": "clip"
}, {
    "prod_page": "https://pentalight.it/collezione/elisabeth/",
    "prod_name": "elisabeth"
}, {
    "prod_page": "https://pentalight.it/collezione/enoki/",
    "prod_name": "enoki"
}, {
    "prod_page": "https://pentalight.it/collezione/feel/",
    "prod_name": "feel"
}, {
    "prod_page": "https://pentalight.it/collezione/glifo/",
    "prod_name": "glifo"
}, {
    "prod_page": "https://pentalight.it/collezione/glo/",
    "prod_name": "glo"
}, {
    "prod_page": "https://pentalight.it/collezione/hang-out/",
    "prod_name": "hang-out"
}, {
    "prod_page": "https://pentalight.it/collezione/jacqueline/",
    "prod_name": "jacqueline"
}, {
    "prod_page": "https://pentalight.it/collezione/je-suis/",
    "prod_name": "je-suis"
}, {
    "prod_page": "https://pentalight.it/collezione/jei-jei/",
    "prod_name": "jei-jei"
}, {
    "prod_page": "https://pentalight.it/collezione/klint/",
    "prod_name": "klint"
}, {
    "prod_page": "https://pentalight.it/collezione/lit/",
    "prod_name": "lit"
}, {
    "prod_page": "https://pentalight.it/collezione/ludo/",
    "prod_name": "ludo"
}, {
    "prod_page": "https://pentalight.it/collezione/lula/",
    "prod_name": "lula"
}, {
    "prod_page": "https://pentalight.it/collezione/mami/",
    "prod_name": "mami"
}, {
    "prod_page": "https://pentalight.it/collezione/mira/",
    "prod_name": "mira"
}, {
    "prod_page": "https://pentalight.it/collezione/mom/",
    "prod_name": "mom"
}, {
    "prod_page": "https://pentalight.it/collezione/morsetto/",
    "prod_name": "morsetto"
}, {
    "prod_page": "https://pentalight.it/collezione/narciso/",
    "prod_name": "narciso"
}, {
    "prod_page": "https://pentalight.it/collezione/new-classic/",
    "prod_name": "new-classic"
}, {
    "prod_page": "https://pentalight.it/collezione/polar/",
    "prod_name": "polar"
}, {
    "prod_page": "https://pentalight.it/collezione/pop/",
    "prod_name": "pop"
}, {
    "prod_page": "https://pentalight.it/collezione/sop/",
    "prod_name": "sop"
}, {
    "prod_page": "https://pentalight.it/collezione/sospensioni-in-tessuto/",
    "prod_name": "sospensioni-in-tessuto"
}, {
    "prod_page": "https://pentalight.it/collezione/spoon/",
    "prod_name": "spoon"
}, {
    "prod_page": "https://pentalight.it/collezione/storm/",
    "prod_name": "storm"
}, {
    "prod_page": "https://pentalight.it/collezione/taaac/",
    "prod_name": "taaac"
}, {
    "prod_page": "https://pentalight.it/collezione/tic-toc/",
    "prod_name": "tic-toc"
}, {
    "prod_page": "https://pentalight.it/collezione/tile/",
    "prod_name": "tile"
}, {
    "prod_page": "https://pentalight.it/collezione/tosca/",
    "prod_name": "tosca"
}, {
    "prod_page": "https://pentalight.it/collezione/vela/",
    "prod_name": "vela"
}, {
    "prod_page": "https://pentalight.it/collezione/wonder/",
    "prod_name": "wonder"
}, {
    "prod_page": "https://pentalight.it/collezione/woody/",
    "prod_name": "woody"
}, {
    "prod_page": "https://pentalight.it/collezione/yan/",
    "prod_name": "yan"
}

]




var pages_number = arr_all_products.length;



var index = 0;




avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('info_first.json', JSON.stringify(arr_first, null, 4), 'utf8', function(){
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





var arr_first = [];

//function createJsonFromAPage(body, uri, model, name, prod_pic, category){
function createJsonFromAPage(name, uri){

    (async() => {
        
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(uri);


      let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);

      // aspetto comunque un po accertarmi che ogni elemento della pagina sia scaricato e renderizzato
      await page.waitFor(300);
      
      var $body = $(preloaded_bodyHTML);

      console.log("--------------------------------------------------------------"+page.url());

      var url = page.url();
      arr_first.push({
        prod_page: url,
        prod_name: (url.indexOf("/prodotto/") != -1) ? S(url).between("/prodotto/","/").s : name ,
      })
      
      /* foto di projects */
      /*
      var projects = [];
      var $project_images = $body.find(".carousel-cell");
      $project_images.each(function(){
        if( !$(this).is(".product-det") )
          projects.push( "http://www.luceplan.com"+$(this).find("img").attr("src") );
      });
      */



      /* descrizione */
      //let description = $body.find(".overview p").html();

      /* varianti */
      /*
      var $buttons = $body.find(".dots-data-sheet.dots-data-sheet-euro").find(".button-euro");
      var variations = [];

      $buttons.each(function(index){

        var $slide = $body.find(".slider-data-sheet-product").find(".carousel-cell").eq(index);
        var light_schema = $slide.find(".data-sheet img").attr("src");
        var $data_container = $slide.find(".data-sheet.g");
        
        var data = {};
        $data_container.find("p").each(function(){
          if($(this).is(".label")){
            let label = $(this).html();
            let value = $(this).next().html();
            data[label] = value
          }
        })
        
        variations.push({
          name: $(this).html().toUpperCase(),
          light_schema: "http://www.luceplan.com"+light_schema,
          data : data,
        })
      })
      */
      

      /* video */
      //var video = $body.find(".embed-container").find("iframe").attr("src");

      /* website item name */
      //var website_name = $body.find("#product-title").text().trim();
      
      await browser.close();
      index++;

      /*
      arr_first.push({
        name: website_name,
        prod_pic: prod_pic,
        prod_page : uri,
        projects : projects,
        category: category,
        description: description,
        video: video,
        variations: variations
      });
      */
      avvia(index);
        
   


    })();



    

}



