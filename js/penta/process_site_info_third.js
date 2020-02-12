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



// tutto il json info_second.json copiato e incollato
var arr_all_products = [
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/glo-applique/",
        "prod_name": "glo-applique"
    },
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/acorn-sospensione/",
        "prod_name": "acorn-sospensione"
    },
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/altura/",
        "prod_name": "altura"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/altura-sospensione/",
        "prod_name": "altura-sospensione"
    },
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/angolo/",
        "prod_name": "angolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/aprile-applique/",
        "prod_name": "aprile-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/bag-outdoor-da-terra/",
        "prod_name": "bag-outdoor-da-terra"
    },
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-sospensione/",
        "prod_name": "chi-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-terra/",
        "prod_name": "chi-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-applique/",
        "prod_name": "chi-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-da-tavolo/",
        "prod_name": "chi-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/china-da-tavolo/",
        "prod_name": "china-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/china-floor-lamp/",
        "prod_name": "china-floor-lamp"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/clash-applique/",
        "prod_name": "clash-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/clip-sospensione/",
        "prod_name": "clip-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/elisabeth-tavolo/",
        "prod_name": "elisabeth-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/elisabeth-sospensione/",
        "prod_name": "elisabeth-sospensione"
    },

    {
        "prod_page": "https://pentalight.it/en/prodotto/elisabeth-applique/",
        "prod_name": "elisabeth-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/enoki-applique/",
        "prod_name": "enoki-applique"
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
        "prod_page": "https://pentalight.it/en/prodotto/glo-da-terra/",
        "prod_name": "glo-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/glo-da-tavolo/",
        "prod_name": "glo-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/gli-composizione-multipla-sospensione/",
        "prod_name": "gli-composizione-multipla-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/hang-out-sospensione/",
        "prod_name": "hang-out-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jacqueline-lampada-tavolo/",
        "prod_name": "jacqueline-lampada-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/je-suis-da-tavolo/",
        "prod_name": "je-suis-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/je-suis-da-terra/",
        "prod_name": "je-suis-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jei-jei-applique/",
        "prod_name": "jei-jei-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jei-jei-sospensione/",
        "prod_name": "jei-jei-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/klint-da-tavolo/",
        "prod_name": "klint-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lit-sospensione/",
        "prod_name": "lit-sospensione"
    },
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/ludo/",
        "prod_name": "ludo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lula-da-tavolo/",
        "prod_name": "lula-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lula-da-terra/",
        "prod_name": "lula-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-a-sospensione/",
        "prod_name": "mami-a-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-da-terra/",
        "prod_name": "mami-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-da-tavolo/",
        "prod_name": "mami-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-applique/",
        "prod_name": "mami-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mira-tavolo/",
        "prod_name": "mira-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mom-sospensione/",
        "prod_name": "mom-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mom-applique/",
        "prod_name": "mom-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mom-tavolo/",
        "prod_name": "mom-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/morsetto-tavolo/",
        "prod_name": "morsetto-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/narciso-sospensione/",
        "prod_name": "narciso-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/narciso-terra/",
        "prod_name": "narciso-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/narciso-tavolo/",
        "prod_name": "narciso-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/new-classic-da-tavolo/",
        "prod_name": "new-classic-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/new-classic-da-terra/",
        "prod_name": "new-classic-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/polar-da-tavolo/",
        "prod_name": "polar-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/polar-da-terra/",
        "prod_name": "polar-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/pop-applique/",
        "prod_name": "pop-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/sop/",
        "prod_name": "sop"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/vanity-applique/",
        "prod_name": "vanity-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/sospensioni-tessuto/",
        "prod_name": "sospensioni-tessuto"
    },

    {
        "prod_page": "https://pentalight.it/en/prodotto/luxury-suspension/",
        "prod_name": "luxury-suspension"
    },
    
    {
        "prod_page": "https://pentalight.it/en/prodotto/club-house-appliques/",
        "prod_name": "club-house-appliques"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/spoon-applique/",
        "prod_name": "spoon-applique"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/spoon-tavolo/",
        "prod_name": "spoon-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/spoon-terra/",
        "prod_name": "spoon-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/storm/",
        "prod_name": "storm"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/taaac-da-terra/",
        "prod_name": "taaac-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tic-toc-da-tavolo/",
        "prod_name": "tic-toc-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tile/",
        "prod_name": "tile"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tosca-da-tavolo/",
        "prod_name": "tosca-da-tavolo"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tosca-da-terra/",
        "prod_name": "tosca-da-terra"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/vela/",
        "prod_name": "vela"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/wonder-a-sospensione/",
        "prod_name": "wonder-a-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/woody-a-sospensione/",
        "prod_name": "woody-a-sospensione"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/yan-sospensione/",
        "prod_name": "yan-sospensione"
    }

]



var pages_number = arr_all_products.length;



var index = 0;




avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('assets.json', JSON.stringify(arr_single_product, null, 4), 'utf8', function(){
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
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index));

        fs.writeFile('assets.json', JSON.stringify(arr_single_product, null, 4), 'utf8', function(){
            _.log("non ho finito.... procedo");
        });


        request({
            uri: encodeURI(uri),
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            //createJsonFromAPage(body, uri, model, name, prod_pic, category);

            
            createJsonFromAPage(name, uri);
        });

    }
}





var arr_single_product = [];

//function createJsonFromAPage(body, uri, model, name, prod_pic, category){
function createJsonFromAPage(name, uri){


            (async() => {
                
            const browser = await puppeteer.launch({
                args: ['--lang=it-IT,it']
            });
            const page = await browser.newPage();

            await page.goto(uri);

            await page.setExtraHTTPHeaders({
                'Accept-Language': 'it'
            });


            let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);

            // aspetto comunque un po per accertarmi che ogni elemento della pagina sia scaricato e renderizzato
            await page.waitFor(2000);
            
            var $body = $(preloaded_bodyHTML);

            // prod_pic
            var prod_pic = $body.find(".front_bk_secondo").attr("style");
                prod_pic = (_.is(prod_pic))? S(prod_pic).between("background-image: url(", ")").s : null;
            

            // desc
            var desc = $body.find(".wk_product_content").eq(0).text();
                desc = S(desc).replaceAll("\n","").s.trim()
            
            //projects
            var projects = [];

            //light-schema
            var light_schema = [];
            $body.find(".wk_measure_img").each(function(){
                light_schema.push($(this).attr("src"))
            })
            
            $body.find("[data-gallery] img").each(function(){
                
                if(_.is($(this).attr("srcset"))){
                    var srcset_arr = $(this).attr("srcset").split(", ");
                    var img = srcset_arr[srcset_arr.length -  1].trim().replace(" 2000w","")
                    projects.push( img )
                }
                    
                
            });

            var video = $body.find("video source").attr("src")

            arr_single_product.push({
                prod_page : uri,
                prod_name : name,
                prod_pic: prod_pic,
                desc: desc,
                projects : projects,
                light_schema : light_schema,
                video: video,
            });

            /*


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
                            accessories: getAccessories(model),
                        })




                         arr_single_product.push({
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

           
            
            
            
            await browser.close();
            index++;

            avvia(index);
                
        


            })();

        

    

}



