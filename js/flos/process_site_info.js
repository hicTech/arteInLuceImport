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


// questo è l'array degli url delle pafine di tutti i prodotti (206) singoli FLOS copia e incollata da getSinglePageUrl_json.json
var arr_all_products = [
    "https://flos.com/it/prodotti/lampade-tavolo/aoy/aoy/", "https://flos.com/it/prodotti/lampade-tavolo/bellhop/bellhop/", "https://flos.com/it/prodotti/lampade-tavolo/biagio/biagio/", "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour/", 
    "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour-unplugged/", "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour-versailles/", "https://flos.com/it/prodotti/lampade-tavolo/bon-jour/bon-jour-versailles-small/", "https://flos.com/it/prodotti/lampade-tavolo/chapo/chapo/", 
    "https://flos.com/it/prodotti/lampade-tavolo/cocoon/gatto/", "https://flos.com/it/prodotti/lampade-tavolo/cocoon/gatto-piccolo/", "https://flos.com/it/prodotti/lampade-tavolo/copycat/copycat/", "https://flos.com/it/prodotti/lampade-tavolo/de-light/de-light/", "https://flos.com/it/prodotti/lampade-tavolo/extra-t2/extra-t/", 
    "https://flos.com/it/prodotti/lampade-tavolo/gaku/gaku-wire/", "https://flos.com/it/prodotti/lampade-tavolo/gaku/gaku-wireless/", "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-basic-2/", 
    "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-basic-1/", "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-basic-zero-dimmer/", "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-basic-zero-switch/", 
    "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/mini-glo-ball-t/", "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-t2/", "https://flos.com/it/prodotti/lampade-tavolo/glo-ball/glo-ball-t1/", 
    "https://flos.com/it/prodotti/lampade-tavolo/goldman/goldman/", "https://flos.com/it/prodotti/lampade-tavolo/ic-lights/ic-lights-t1-high/", "https://flos.com/it/prodotti/lampade-tavolo/ic-lights/ic-lights-t1-low/", 
    "https://flos.com/it/prodotti/lampade-tavolo/ic-lights/ic-lights-t2/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-edge-base/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-edge-clamp/", 
    "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-edge-desk-support-visible-cable/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-edge-desk-support-hidden-cable/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-edge-wall-support/", 
    "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-led-base/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-led-clamp/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-led-desk-support-visible-cable/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-led-desk-support-hidden-cable/", 
    "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/kelvin-led-wall-support/", "https://flos.com/it/prodotti/lampade-tavolo/kelvin-led/mini-kelvin-led/", "https://flos.com/it/prodotti/lampade-tavolo/ktribe/ktribe-t2/", "https://flos.com/it/prodotti/lampade-tavolo/ktribe/ktribe-t1/", "https://flos.com/it/prodotti/lampade-tavolo/ktribe/ktribe-t1-glass/", 
    "https://flos.com/it/prodotti/lampade-tavolo/lampadina/lampadina/", "https://flos.com/it/prodotti/lampade-tavolo/may-day/may-day/", "https://flos.com/it/prodotti/lampade-tavolo/ktribe/miss-k/", "https://flos.com/it/prodotti/lampade-tavolo/miss-sissi/miss-sissi/", "https://flos.com/it/prodotti/lampade-tavolo/piani/piani/", 
    "https://flos.com/it/prodotti/lampade-tavolo/piani/piani-big/", "https://flos.com/it/prodotti/lampade-tavolo/ray/ray-t-dimmer-2/", "https://flos.com/it/prodotti/lampade-tavolo/romeo-moon/romeo-moon-t1/", "https://flos.com/it/prodotti/lampade-tavolo/romeo-soft/romeo-soft-t/", "https://flos.com/it/prodotti/lampade-tavolo/serena/serena/", 
    "https://flos.com/it/prodotti/lampade-tavolo/snoopy/snoopy/", "https://flos.com/it/prodotti/lampade-tavolo/snoopy/snoopy-50-limited-edition/", "https://flos.com/it/prodotti/lampade-tavolo/spun-light/spun-light-t2/", "https://flos.com/it/prodotti/lampade-tavolo/spun-light/spun-light-t1/", "https://flos.com/it/prodotti/lampade-tavolo/tab/tab-t/", 
    "https://flos.com/it/prodotti/lampade-tavolo/guns/guns-table-gun/", "https://flos.com/it/prodotti/lampade-tavolo/guns/guns-bedside-gun/", "https://flos.com/it/prodotti/lampade-tavolo/taccia/taccia/", "https://flos.com/it/prodotti/lampade-tavolo/taccia/taccia-pmma/", "https://flos.com/it/prodotti/lampade-tavolo/taccia/taccia-small/",
    "https://flos.com/it/prodotti/lampade-tavolo/tatou/tatou-t/", "https://flos.com/it/prodotti/lampadari-sospensione/2097/2097-50/", "https://flos.com/it/prodotti/lampadari-sospensione/2097/2097-30/", "https://flos.com/it/prodotti/lampadari-sospensione/2620/2620/", "https://flos.com/it/prodotti/lampadari-sospensione/aim/aim/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/aim/aim-cable-plug/", "https://flos.com/it/prodotti/lampadari-sospensione/aim/aim-small/", "https://flos.com/it/prodotti/lampadari-sospensione/aim/aim-small-cable-plug/", "https://flos.com/it/prodotti/lampadari-sospensione/aim/aim-small-fix/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-round-large/",
    "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-round-medium/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-round-small/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-drop-down/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-drop-up/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-square-large/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-square-small/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-broken-line/", "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-line/",
    "https://flos.com/it/prodotti/lampadari-sospensione/chasen/chasen/", "https://flos.com/it/prodotti/lampadari-sospensione/overlap/overlap-suspension-2/", "https://flos.com/it/prodotti/lampadari-sospensione/overlap/overlap-suspension-1/", "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/taraxacum-2/", "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/taraxacum-1/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/viscontea/", "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/zeppelin-2/", "https://flos.com/it/prodotti/lampadari-sospensione/cocoon/zeppelin-1/", "https://flos.com/it/prodotti/lampadari-sospensione/frisbi/frisbi/", "https://flos.com/it/prodotti/lampadari-sospensione/fucsia/fucsia-12/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/fucsia/fucsia-8/", "https://flos.com/it/prodotti/lampadari-sospensione/fucsia/fucsia-3/", "https://flos.com/it/prodotti/lampadari-sospensione/fucsia/fucsia-1/", "https://flos.com/it/prodotti/lampadari-sospensione/glo-ball/glo-ball-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/glo-ball/glo-ball-s2-eco/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/glo-ball/glo-ball-s1/", "https://flos.com/it/prodotti/lampadari-sospensione/glo-ball/mini-glo-ball-s/", "https://flos.com/it/prodotti/lampadari-sospensione/ic-lights/ic-lights-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/ic-lights/ic-lights-s1/", "https://flos.com/it/prodotti/lampadari-sospensione/ktribe/ktribe-s3/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/ktribe/ktribe-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/ktribe/ktribe-s1/", "https://flos.com/it/prodotti/lampadari-sospensione/nebula/nebula/", "https://flos.com/it/prodotti/lampadari-sospensione/ok/ok/", "https://flos.com/it/prodotti/lampadari-sospensione/parentesi/parentesi/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/parentesi/parentesi-dimmer/", "https://flos.com/it/prodotti/lampadari-sospensione/ray/ray-s/", "https://flos.com/it/prodotti/lampadari-sospensione/romeo-moon/romeo-babe-s/", "https://flos.com/it/prodotti/lampadari-sospensione/romeo-moon/romeo-moon-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/romeo-moon/romeo-moon-s1/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/romeo-soft/romeo-babe-soft-s/", "https://flos.com/it/prodotti/lampadari-sospensione/romeo-soft/romeo-soft-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/romeo-soft/romeo-soft-s1/", "https://flos.com/it/prodotti/lampadari-sospensione/skygarden/skygarden-2/", "https://flos.com/it/prodotti/lampadari-sospensione/skygarden/skygarden-2-eco/",
    "https://flos.com/it/prodotti/lampadari-sospensione/skygarden/skygarden-1/", "https://flos.com/it/prodotti/lampadari-sospensione/skygarden/skygarden-1-eco/", "https://flos.com/it/prodotti/lampadari-sospensione/smithfield/smithfield-suspension-led-dimmable-dali/", "https://flos.com/it/prodotti/lampadari-sospensione/smithfield/smithfield-s/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/smithfield/smithfield-s-led/", "https://flos.com/it/prodotti/lampadari-sospensione/splugen-brau/splugen-brau/", "https://flos.com/it/prodotti/lampadari-sospensione/string-light/string-light-cone-head-12mt-cable/", "https://flos.com/it/prodotti/lampadari-sospensione/string-light/string-light-cone-head-22mt-cable/", 
    "https://flos.com/it/prodotti/lampadari-sospensione/string-light/string-light-sphere-head-12mt-cable/", "https://flos.com/it/prodotti/lampadari-sospensione/string-light/string-light-sphere-head-22mt-cable/", "https://flos.com/it/prodotti/lampadari-sospensione/taraxacum-88/taraxacum-88-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/taraxacum-88/taraxacum-88-s1/",
    "https://flos.com/it/prodotti/lampadari-sospensione/tatou/tatou-s2/", "https://flos.com/it/prodotti/lampadari-sospensione/tatou/tatou-s1/", "https://flos.com/it/prodotti/lampadari-sospensione/wan/wan-s/", "https://flos.com/it/prodotti/plafoniere/265/265/", "https://flos.com/it/prodotti/plafoniere/ariette/ariette-3/", "https://flos.com/it/prodotti/plafoniere/ariette/ariette-2/",
    "https://flos.com/it/prodotti/plafoniere/ariette/ariette-1/", "https://flos.com/it/prodotti/plafoniere/button/button/", "https://flos.com/it/prodotti/plafoniere/button/button-hl/", "https://flos.com/it/prodotti/plafoniere/button/mini-button/", "https://flos.com/it/prodotti/plafoniere/clara/clara/", "https://flos.com/it/prodotti/plafoniere/clessidra/clessidra/",
    "https://flos.com/it/prodotti/plafoniere/clessidra/clessidra-2/", "https://flos.com/it/prodotti/plafoniere/foglio/foglio/", "https://flos.com/it/prodotti/plafoniere/glo-ball/glo-ball-c2/", "https://flos.com/it/prodotti/plafoniere/glo-ball/glo-ball-c1/", "https://flos.com/it/prodotti/plafoniere/glo-ball/glo-ball-cw-zero/", "https://flos.com/it/prodotti/plafoniere/glo-ball/mini-glo-ball-cw/",
    "https://flos.com/it/prodotti/plafoniere/glo-ball/mini-glo-ball-cw-mirror/", "https://flos.com/it/prodotti/plafoniere/glo-ball/glo-ball-w/", "https://flos.com/it/prodotti/plafoniere/ic-lights/ic-lights-cw-2/", "https://flos.com/it/prodotti/plafoniere/ic-lights/ic-lights-cw-1/", "https://flos.com/it/prodotti/plafoniere/ktribe/ktribe-w/", 
    "https://flos.com/it/prodotti/plafoniere/lightspring/lightspring-double/", "https://flos.com/it/prodotti/plafoniere/lightspring/lightspring-single/", "https://flos.com/it/prodotti/plafoniere/long-light-cw/long-light/", "https://flos.com/it/prodotti/plafoniere/moni/moni-1/", "https://flos.com/it/prodotti/plafoniere/moni/moni-2/", 
    "https://flos.com/it/prodotti/plafoniere/ontherocks/ontherocks-hl/", "https://flos.com/it/prodotti/plafoniere/pochette/pochette/", "https://flos.com/it/prodotti/plafoniere/pochette/pochette-updown/", "https://flos.com/it/prodotti/plafoniere/pochette/pochette-led/", "https://flos.com/it/prodotti/plafoniere/pochette/pochette-updown-led/", 
    "https://flos.com/it/prodotti/plafoniere/romeo-moon/romeo-babe-w/", "https://flos.com/it/prodotti/plafoniere/romeo-soft/romeo-babe-soft-w/", "https://flos.com/it/prodotti/plafoniere/skygarden/skygarden-recessed-g9/", "https://flos.com/it/prodotti/plafoniere/skygarden/skygarden-recessed-gy6-35/", "https://flos.com/it/prodotti/plafoniere/smithfield/smithfield-ceiling-led-dimmable-dali/", 
    "https://flos.com/it/prodotti/plafoniere/smithfield/smithfield-c/", "https://flos.com/it/prodotti/plafoniere/smithfield/smithfield-c-led/", "https://flos.com/it/prodotti/plafoniere/taraxacum-88/taraxacum-88-cw/", "https://flos.com/it/prodotti/plafoniere/tight-light-cw/tight-light/", "https://flos.com/it/prodotti/plafoniere/tilee/tilee/", 
    "https://flos.com/it/prodotti/plafoniere/wan/wan-cw/", "https://flos.com/it/prodotti/plafoniere/wirering/wirering-bianco/", "https://flos.com/it/prodotti/plafoniere/wirering/wirering-pink/", "https://flos.com/it/prodotti/plafoniere/wirering/wirering-grigio/", "https://flos.com/it/prodotti/lampade-terra/arco/arco/", "https://flos.com/it/prodotti/lampade-terra/arco/arco-led/", 
    "https://flos.com/it/prodotti/lampade-terra/bibliotheque-nationale/bibliotheque-nationale/", "https://flos.com/it/prodotti/lampade-terra/captain-flint/captain-flint/", "https://flos.com/it/prodotti/lampade-terra/cocoon/chrysalis/", "https://flos.com/it/prodotti/lampade-terra/cocoon/fantasma-piccolo/", "https://flos.com/it/prodotti/lampade-terra/cocoon/fantasma/",
    "https://flos.com/it/prodotti/lampade-terra/glo-ball/glo-ball-f3/", "https://flos.com/it/prodotti/lampade-terra/glo-ball/glo-ball-f2/", "https://flos.com/it/prodotti/lampade-terra/glo-ball/glo-ball-f1/", "https://flos.com/it/prodotti/lampade-terra/ic-lights/ic-lights-f2/", "https://flos.com/it/prodotti/lampade-terra/ic-lights/ic-lights-f1/", 
    "https://flos.com/it/prodotti/lampade-terra/ipnos/ipnos/", "https://flos.com/it/prodotti/lampade-terra/kelvin-led/kelvin-led-f/", "https://flos.com/it/prodotti/lampade-terra/ktribe/ktribe-f3/", "https://flos.com/it/prodotti/lampade-terra/ktribe/ktribe-f2/", "https://flos.com/it/prodotti/lampade-terra/ktribe/ktribe-f1/", "https://flos.com/it/prodotti/lampade-terra/guns/guns-lounge-gun/",
    "https://flos.com/it/prodotti/lampade-terra/luminator/luminator/", "https://flos.com/it/prodotti/lampade-terra/ray/ray-f2/", "https://flos.com/it/prodotti/lampade-terra/ray/ray-f1/", "https://flos.com/it/prodotti/lampade-terra/romeo-moon/romeo-moon-f/", "https://flos.com/it/prodotti/lampade-terra/romeo-soft/romeo-soft-f/", 
    "https://flos.com/it/prodotti/lampade-terra/romeo-soft/superarchimoon-2/", "https://flos.com/it/prodotti/lampade-terra/rosy-angelis/rosy-angelis/", "https://flos.com/it/prodotti/lampade-terra/sawaru/sawaru/", "https://flos.com/it/prodotti/lampade-terra/shade/shade/", "https://flos.com/it/prodotti/lampade-terra/spun-light/spun-light-f/", 
    "https://flos.com/it/prodotti/lampade-terra/stylos/stylos/", "https://flos.com/it/prodotti/lampade-terra/superloon/superloon/", "https://flos.com/it/prodotti/lampade-terra/tab/tab-f/", "https://flos.com/it/prodotti/lampade-terra/tatou/tatou-f/", "https://flos.com/it/prodotti/lampade-terra/toio/toio/", "https://flos.com/it/prodotti/lampade-terra/toio/toio-limited-edition-matt-black/",
]

/*
var arr_all_products = [
    "https://flos.com/it/prodotti/lampade-tavolo/gaku/gaku-wireless/",
    "https://flos.com/it/prodotti/lampade-tavolo/aoy/aoy/", "https://flos.com/it/prodotti/plafoniere/romeo-moon/romeo-babe-w/",
    "https://flos.com/it/prodotti/lampade-terra/kelvin-led/kelvin-led-f/", "https://flos.com/it/prodotti/lampadari-sospensione/tatou/tatou-s2/"
]



var arr_all_products = [
    "https://flos.com/it/prodotti/lampade-terra/ipnos/ipnos/#tech-specs",
    "https://flos.com/it/prodotti/lampadari-sospensione/string-light/string-light-cone-head-12mt-cable/"
    
]



var arr_all_products = [
    "https://flos.com/it/prodotti/lampadari-sospensione/arrangements/arrangements-round-large/"
]

*/

// elimino eventuali doppioni
arr_all_products = _.uniq(arr_all_products);
var pages_number = arr_all_products.length;



var index = 0;

avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('assets_json.json', JSON.stringify(arr_single_product, null, 4), 'utf8', function(){
            _.log("FINITO");
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

    //_.log(body)

    

    var $body = $(body);
    var $model = $body.find("h1.product_title.entry-title");
        $model.find("a").remove();
    var model = $model.html();    

    
    $body.find("h2").each(function(){
        if( $(this).html() == "Accessori" )
            _.log("------------------------------------------------------------------------------------------ACCESSORI")
    })



    var $summary = $body.find(".summary.entry-summary");
    var category = $summary.find("ul").eq(0).find(".active a").html();
    var $desc = $summary.find(".product-description");
        desc = $desc.text();


    var other_images = [];
    $body.find("figure.addModalSlider img").each(function(){
        var src = $(this).attr("src");
        if( src.indexOf(".svg") == -1)
            other_images.push($(this).attr("src"));
    })   



    var size_image = $summary.find(".product-models").eq(0).find(".item.active").find(".bg-image img").attr("data-src");

    var color_variations = $summary.find("[data-product_variations]").eq(0).attr("data-product_variations");
        color_variations = S(color_variations).replaceAll('\"','"').s;
        color_variations = JSON.parse(color_variations);

    var secondary_image = $body.find(".masonry").eq(0).find("figure").eq(0).find("img").attr("src");

    var $summary_media = $body.find(".summary-media img");
    summary_media = [];
    $summary_media.each(function(){
        var src = $(this).attr("data-src");
        if(src.indexOf(".svg")!=-1){
            var new_src = "www.arteinluce.shop/assets_ecommerce/flos/png" +src.substr(src.lastIndexOf("/")).replace(".svg",".png");
            summary_media.push(new_src);
        }
            
    });

    var $downloads = $body.find("ul.list-download li");
    var downloads = [];
    $downloads.each(function(){
        var type = $(this).find("strong").html();
        if(type.indexOf("Istruzioni")!=-1)
            downloads.push({
                label: "istruzioni",
                url : $(this).find("a").attr("href"),
            })
        if(type.indexOf("Parti")!=-1)
            downloads.push({
                label: "ricambi",
                url : $(this).find("a").attr("href"),
            })
    });

    var $rows = $body.find(".summery-details .row");

    

    var more = {};

    $rows.each(function(){
        var label = $(this).find("strong").html().toLowerCase().replace(" ","_").replace(" ","_").replace(" ","_");
        var value = $(this).find("span").html();
            value = (_.is(value))? S(value).replaceAll("  ","").replaceAll("\n","").replaceAll("\n ","").s.trim() : undefined;

        if(label == "colori"){
            value = value.split("<br>");
            var colors = [];
            _.each(value,function(elem){
                    colors.push({
                        name: S(elem).between("</span>").s.split(" - ")[1],
                        id: S(elem).between("</span>").s.split(" - ")[0],
                    })
                
            });
            value = colors;
        }

        more[label] = value;
    })

    


    
    _.each(color_variations,function(variation){
        arr_single_product.push({
            uri: uri,
            model : model,
            category: (category == "Tavolo")? "tavolo" : (category == "Pavimento")? "terra" : (category == "Muro/Soffitto")? "soffitto" : "sospensione",
            code: getCode(variation.sku),
            desc :desc,
            size_image: size_image,
            color: variation.attributes.attribute_pa_color,
            image: variation.image.url,
            secondary_image: secondary_image,
            summary_media : summary_media,
            other_images: filteredImages(other_images,variation.image.url,secondary_image),
            downloads : downloads,
            more: more,
            accessories: getAccessories(getCode(variation.sku), model),
        })
    });

    function filteredImages(images, first, second){
        var ret = _.filter(images, function(elem){
            return (elem != first && elem != second);
        })

        return _.uniq(ret);
    }




    function getAccessories(father_code,model){
        var $accessories = $body.find(".related-accessories .item");
        var accessories = [];
        $accessories.each(function(){
            accessories.push({
                id : $(this).find("h3").html(),
                fullname : getFullname($(this), model),
                name: ( $(this).find("p").html().indexOf(" - ") != -1) ? $(this).find("p").html().split(" - ")[0] : $(this).find("p").html(),
                color: ( $(this).find("p").html().indexOf(" - ") != -1) ? $(this).find("p").html().split(" - ")[1] : undefined,
                img : $(this).find("figure img").attr("src"),
                component_of: father_code,
            })
        });

        return accessories;
    }

    function getFullname($elem, model){
        var ret = ( $elem.find("p").html() != "")? $elem.find("p").html() : ( $elem.find("h4").html() != "")? $elem.find("h4").html() : undefined;
        if( !_.is(ret))
            ret = "accessorio "+$elem.index()+" di "+model;
        return ret;
    }
    
    function getCode(sku){
        // trovati casi particolari, guarda note.txt si FLOS
        if(sku == "F29550")
            return "F2955000";
        if(sku == "F31730")
            return "F3173030";
        if(sku == "f9550039")
            return "F9550039";
        if(sku == "F95140030")
            return "F9514030";
        if(sku == "F9512020")
            return "F9513020";
        if(sku == "F63070")
            return "F6307007";
        if(sku == "F63050")
            return "F6305007";
        if(sku == "F62650")
            return "F6265007";
        if(sku == "F3120030")
            return "F3150030";
        if(sku == "F3120046")
            return "F3150046";
        if(sku == "F3120054")
            return "F3150054";

        else
            return sku;

    }


  

    index++;
    
    avvia(index);
    

}

