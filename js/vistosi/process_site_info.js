var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);


// questo è l'array di tutti gli href presenti nella pagina https://www.vistosi.it/prodotti/ una volta che è tutta scrollata
var arr_all_products = [
    "https://www.vistosi.it/prodotti/24pearls.html", "https://www.vistosi.it/prodotti/accademia.html", "https://www.vistosi.it/prodotti/alega.html", "https://www.vistosi.it/prodotti/aliki.html", "https://www.vistosi.it/prodotti/alma.html", "https://www.vistosi.it/prodotti/alum.html", "https://www.vistosi.it/prodotti/alum09.html", 
    "https://www.vistosi.it/prodotti/aria.html", "https://www.vistosi.it/prodotti/assiba/", "https://www.vistosi.it/prodotti/aurea.html", "https://www.vistosi.it/prodotti/aurora.html", "https://www.vistosi.it/prodotti/baco.html", "https://www.vistosi.it/prodotti/bacona.html", "https://www.vistosi.it/prodotti/balance.html", 
    "https://www.vistosi.it/prodotti/bauta.html", "https://www.vistosi.it/prodotti/bianca.html", "https://www.vistosi.it/prodotti/bissa.html", "https://www.vistosi.it/prodotti/bissona.html", "https://www.vistosi.it/prodotti/boccia.html", "https://www.vistosi.it/prodotti/bolle/", "https://www.vistosi.it/prodotti/boreale.html", 
    "https://www.vistosi.it/prodotti/bot.html", "https://www.vistosi.it/prodotti/candela.html", "https://www.vistosi.it/prodotti/cheope.html", "https://www.vistosi.it/prodotti/cheope-09.html", "https://www.vistosi.it/prodotti/chimera.html", "https://www.vistosi.it/prodotti/chimera-09.html", "https://www.vistosi.it/prodotti/cild.html", 
    "https://www.vistosi.it/prodotti/ciondo.html", "https://www.vistosi.it/prodotti/cleo.html", "https://www.vistosi.it/prodotti/cloth.html", "https://www.vistosi.it/prodotti/cocumis.html", "https://www.vistosi.it/prodotti/comari.html", "https://www.vistosi.it/prodotti/corner.html", "https://www.vistosi.it/prodotti/cristallina.html", 
    "https://www.vistosi.it/prodotti/dafne.html", "https://www.vistosi.it/prodotti/damasco.html", "https://www.vistosi.it/prodotti/diadema.html", "https://www.vistosi.it/prodotti/diamante.html", "https://www.vistosi.it/prodotti/dodo.html", "https://www.vistosi.it/prodotti/dogi.html", "https://www.vistosi.it/prodotti/dos.html", 
    "https://www.vistosi.it/prodotti/dress.html", "https://www.vistosi.it/prodotti/ecos.html", "https://www.vistosi.it/prodotti/enne-luci.html", "https://www.vistosi.it/prodotti/essence.html", "https://www.vistosi.it/prodotti/ferea.html", "https://www.vistosi.it/prodotti/follia.html", "https://www.vistosi.it/prodotti/fuochi.html", 
    "https://www.vistosi.it/prodotti/futura/", "https://www.vistosi.it/prodotti/giglio.html", "https://www.vistosi.it/prodotti/giogali.html", "https://www.vistosi.it/prodotti/giogali-3d.html", "https://www.vistosi.it/prodotti/giubileo.html", "https://www.vistosi.it/prodotti/giudecca.html", "https://www.vistosi.it/prodotti/gloria.html", 
    "https://www.vistosi.it/prodotti/goccia.html", "https://www.vistosi.it/prodotti/goto.html", "https://www.vistosi.it/prodotti/implode.html", "https://www.vistosi.it/prodotti/incass.html", "https://www.vistosi.it/prodotti/infinita.html", "https://www.vistosi.it/prodotti/jo.html", "https://www.vistosi.it/prodotti/jube.html", 
    "https://www.vistosi.it/prodotti/kira.html", "https://www.vistosi.it/prodotti/lacrima.html", "https://www.vistosi.it/prodotti/laguna.html", "https://www.vistosi.it/prodotti/lepanto.html", "https://www.vistosi.it/prodotti/lio.html", "https://www.vistosi.it/prodotti/lucciola.html", "https://www.vistosi.it/prodotti/lunae.html", 
    "https://www.vistosi.it/prodotti/luxor.html", "https://www.vistosi.it/prodotti/magie.html", "https://www.vistosi.it/prodotti/marblè.html", "https://www.vistosi.it/prodotti/marea.html", "https://www.vistosi.it/prodotti/mia.html", "https://www.vistosi.it/prodotti/mini-giogali.html", "https://www.vistosi.it/prodotti/mirage.html", 
    "https://www.vistosi.it/prodotti/moby.html", "https://www.vistosi.it/prodotti/moris.html", "https://www.vistosi.it/prodotti/morrise.html", "https://www.vistosi.it/prodotti/mumba.html", "https://www.vistosi.it/prodotti/munega.html", "https://www.vistosi.it/prodotti/naranza.html", "https://www.vistosi.it/prodotti/naxos.html", 
    "https://www.vistosi.it/prodotti/nebula.html", "https://www.vistosi.it/prodotti/neochic.html", "https://www.vistosi.it/prodotti/nessa.html", "https://www.vistosi.it/prodotti/ninfea.html", "https://www.vistosi.it/prodotti/nodo.html", "https://www.vistosi.it/prodotti/noon.html", "https://www.vistosi.it/prodotti/norma.html", 
    "https://www.vistosi.it/prodotti/novecento.html", "https://www.vistosi.it/prodotti/nuvole.html", "https://www.vistosi.it/prodotti/oto.html", "https://www.vistosi.it/prodotti/ovalina.html", "https://www.vistosi.it/prodotti/pagoda.html", "https://www.vistosi.it/prodotti/peggy/", "https://www.vistosi.it/prodotti/penta.html", 
    "https://www.vistosi.it/prodotti/poc.html", "https://www.vistosi.it/prodotti/pod.html", "https://www.vistosi.it/prodotti/puppet.html", "https://www.vistosi.it/prodotti/quadra.html", "https://www.vistosi.it/prodotti/quadra-09.html", "https://www.vistosi.it/prodotti/redentore.html", "https://www.vistosi.it/prodotti/reder.html", 
    "https://www.vistosi.it/prodotti/rialto.html", "https://www.vistosi.it/prodotti/riga.html", "https://www.vistosi.it/prodotti/rina.html", "https://www.vistosi.it/prodotti/romanza.html", "https://www.vistosi.it/prodotti/saba.html", "https://www.vistosi.it/prodotti/san-giorgio.html", "https://www.vistosi.it/prodotti/san-marco.html", 
    "https://www.vistosi.it/prodotti/sata/", "https://www.vistosi.it/prodotti/segreto.html", "https://www.vistosi.it/prodotti/semai.html", "https://www.vistosi.it/prodotti/sissi.html", "https://www.vistosi.it/prodotti/smoking.html", "https://www.vistosi.it/prodotti/soffio.html", "https://www.vistosi.it/prodotti/soft.html", 
    "https://www.vistosi.it/prodotti/sogno.html", "https://www.vistosi.it/prodotti/sphere.html", "https://www.vistosi.it/prodotti/spirit.html", "https://www.vistosi.it/prodotti/sprout.html", "https://www.vistosi.it/prodotti/stardust.html", "https://www.vistosi.it/prodotti/starnet.html", "https://www.vistosi.it/prodotti/stone/", 
    "https://www.vistosi.it/prodotti/style.html", "https://www.vistosi.it/prodotti/surface.html", "https://www.vistosi.it/prodotti/tablo.html", "https://www.vistosi.it/prodotti/tahoma.html", "https://www.vistosi.it/prodotti/tahoma-round.html", "https://www.vistosi.it/prodotti/thor.html", "https://www.vistosi.it/prodotti/torcello.html", 
    "https://www.vistosi.it/prodotti/trepai.html", "https://www.vistosi.it/prodotti/tubes.html", "https://www.vistosi.it/prodotti/vega.html", "https://www.vistosi.it/prodotti/withwhite.html", "https://www.vistosi.it/prodotti/yuba.html",

];








// elimino eventuali doppioni
arr_all_products = _.uniq(arr_all_products);
var pages_number = arr_all_products.length;



var index = 0;

avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('all_products_single_pages.json', JSON.stringify(arr_single_product, null, 4), 'utf8', function(){
            _.log(arr_single_product);
        });
        return true;
    }
    else{
        var uri = arr_all_products[index];
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            createJsonFromAPage(body, uri);
        });

    }
}







var arr_single_product = [];

function createJsonFromAPage(body, uri){

    var $body = $(body);
    var desc = $body.find("p").html();

    var model = getModel(uri);
    
    


   function getModel(uri){

        // alcuni url finiscono per ".html" altri per "/"
        if(uri.indexOf(".html") != -1)
            return S(uri).between("prodotti/",".html").s;
        else
            return S(uri).between("prodotti/","/").s;
   }


    if($body.find("[alt='Soffitto']").length != 0)
        arr_single_product.push({
            model : model,
            category: "soffitto",
            uri : uri.replace(".html","/")+"soffitto.html",
            desc : desc
        });

    if($body.find("[alt='Sospensione']").length != 0)
        arr_single_product.push({
            model : model,
            category: "sospensione",
            uri : uri.replace(".html","/")+"sospensione.html",
            desc : desc
        });

    if($body.find("[alt='Parete']").length != 0)
        arr_single_product.push({
            model : model,
            category: "parete",
            uri : uri.replace(".html","/")+"parete.html",
            desc : desc
        });

    if($body.find("[alt='Tavolo']").length != 0)
        arr_single_product.push({
            model : model,
            category: "tavolo",
            uri : uri.replace(".html","/")+"tavolo.html",
            desc : desc
        });

    if($body.find("[alt='Piantana']").length != 0)
        arr_single_product.push({
            model : model,
            category: "piantana",
            uri : uri.replace(".html","/")+"piantana.html",
            desc : desc
        });
    
    if($body.find("[alt='Faretti']").length != 0)
        arr_single_product.push({
            model : model,
            category: "faretto",
            uri : uri.replace(".html","/")+"faretto.html",
            desc : desc
        });

    /*
    _.log($body.find("[alt='']").length);
    _.log($body.find("[alt='Parete']").length);
    _.log($body.find("[alt='Faretti']").length);
    _.log($body.find("[alt='Tavolo']").length);
    _.log($body.find("[alt='Piantana']").length);

/*
    


    //_.log(body)

    /*
        
    info.push({
        model : model,
        category: category,
        desc: desc,
        carousel: car_imgs_arr,
        video : video_url,
        other_imgs : imgs_arr,
        projects: hide_imgs,
        related_imgs : related_imgs,
        specs: specs_arr 
    })
    */

    index++;
    
    avvia(index);
    

}