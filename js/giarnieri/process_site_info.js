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





var arr_all_products = [
   {
       "name": "Allen AL",
       "prod_pic": "https://www.giarnierilight.com/file/allen_AL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/allen-al/it"
   },
   {
       "name": "Allen AM",
       "prod_pic": "https://www.giarnierilight.com/file/allen_AM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/allen-am/it"
   },
   {
       "name": "Allen AS",
       "prod_pic": "https://www.giarnierilight.com/file/allen_AS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/allen-as/it"
   },
   {
       "name": "Aster E3",
       "prod_pic": "https://www.giarnierilight.com/file/aster_E3_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/aster-e3/it"
   },
   {
       "name": "Aster E5",
       "prod_pic": "https://www.giarnierilight.com/file/aster_E5_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/aster-e5/it"
   },
   {
       "name": "Aster E7",
       "prod_pic": "https://www.giarnierilight.com/file/aster_multipla_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/aster-e7/it"
   },
   {
       "name": "Aster ES",
       "prod_pic": "https://www.giarnierilight.com/file/aster_piccola_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/aster-es/it"
   },
   {
       "name": "Aster EXL",
       "prod_pic": "https://www.giarnierilight.com/file/aster_grande_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/aster-exl/it"
   },
   {
       "name": "Babol A",
       "prod_pic": "https://www.giarnierilight.com/file/babol_A_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/babol/it"
   },
   {
       "name": "Bell L3",
       "prod_pic": "https://www.giarnierilight.com/file/bell_BI_piccola_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bell-l3/it"
   },
   {
       "name": "Bell L5",
       "prod_pic": "https://www.giarnierilight.com/file/bell_BT_multipla_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bell-l5/it"
   },
   {
       "name": "Bell L7",
       "prod_pic": "https://www.giarnierilight.com/file/bell_L7_BT_multipla_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bell-l7/it"
   },
   {
       "name": "Bell LL",
       "prod_pic": "https://www.giarnierilight.com/file/bell_AM_grande_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bell-ll/it"
   },
   {
       "name": "Bell LS",
       "prod_pic": "https://www.giarnierilight.com/file/bell_BI_piccola_LS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bell-ls/it"
   },
   {
       "name": "Bilde PL",
       "prod_pic": "https://www.giarnierilight.com/file/bilde_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bilde-pl/it"
   },
   {
       "name": "Bilde PM",
       "prod_pic": "https://www.giarnierilight.com/file/bilde_PM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bilde-pm/it"
   },
   {
       "name": "Bilde PS",
       "prod_pic": "https://www.giarnierilight.com/file/bilde_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/bilde-ps/it"
   },
   {
       "name": "Blob A",
       "prod_pic": "https://www.giarnierilight.com/file/blob_A_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/blob-a/it"
   },
   {
       "name": "Blob PL",
       "prod_pic": "https://www.giarnierilight.com/file/blob_PL_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/blob-pl/it"
   },
   {
       "name": "Blob PS",
       "prod_pic": "https://www.giarnierilight.com/file/blob_PS_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/blob-ps/it"
   },
   {
       "name": "Corba A",
       "prod_pic": "https://www.giarnierilight.com/file/corba_A_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/corba/it"
   },
   {
       "name": "Drop A",
       "prod_pic": "https://www.giarnierilight.com/file/drop_A_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/drop-a1/it"
   },
   {
       "name": "Drop PM",
       "prod_pic": "https://www.giarnierilight.com/file/drop_PL_2019_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/drop-pm/it"
   },
   {
       "name": "Drop S2",
       "prod_pic": "https://www.giarnierilight.com/file/drop_S2_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/drop-s2/it"
   },
   {
       "name": "Drop S2-Mini",
       "prod_pic": "https://www.giarnierilight.com/file/drop_S2_mini_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/drop-s2mini/it"
   },
   {
       "name": "Drop SM",
       "prod_pic": "https://www.giarnierilight.com/file/drop_SM_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/drop-sm/it"
   },
   {
       "name": "Kamak AL",
       "prod_pic": "https://www.giarnierilight.com/file/kamak_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/kamak-al/it"
   },
   {
       "name": "Kamak AS",
       "prod_pic": "/images/made/file/kamak_ambientata_2019_400_400_s_c1.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/kamak-as/it"
   },
   {
       "name": "Mikado AL",
       "prod_pic": "https://www.giarnierilight.com/file/mikado_A_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/mikado-al/it"
   },
   {
       "name": "Mikado AS",
       "prod_pic": "https://www.giarnierilight.com/file/mikado_AS_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/mikado-as/it"
   },
   {
       "name": "Mikado PL",
       "prod_pic": "https://www.giarnierilight.com/file/mikado_PL_apertura_ok_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/mikado-pl/it"
   },
   {
       "name": "Mikado PM",
       "prod_pic": "https://www.giarnierilight.com/file/mikado_PM_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/mikado-pm/it"
   },
   {
       "name": "Mikado PS",
       "prod_pic": "https://www.giarnierilight.com/file/mikado_PS_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/mikado-ps/it"
   },
   {
       "name": "Orione A",
       "prod_pic": "https://www.giarnierilight.com/file/orione_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/orione-a125/it"
   },
   {
       "name": "Pixel PL",
       "prod_pic": "https://www.giarnierilight.com/file/pixel_PL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/pixel-pl/it"
   },
   {
       "name": "Pixel PM",
       "prod_pic": "https://www.giarnierilight.com/file/pixel_PM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/pixel-pm2/it"
   },
   {
       "name": "Pixel PS",
       "prod_pic": "https://www.giarnierilight.com/file/pixel_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/pixel-ps1/it"
   },
   {
       "name": "Pixel R-PM",
       "prod_pic": "https://www.giarnierilight.com/file/pixel_R_PM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/pixel-r-pm/it"
   },
   {
       "name": "Pixel R-PS",
       "prod_pic": "https://www.giarnierilight.com/file/pixel_R_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/pixel-r-ps/it"
   },
   {
       "name": "Plissè L3-E3C",
       "prod_pic": "https://www.giarnierilight.com/file/plisse_VT_multipla_3led_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/plisse-l3/it"
   },
   {
       "name": "Plissè L5-E5C",
       "prod_pic": "https://www.giarnierilight.com/file/plisse_BI_multipla_5led_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/plisse-l5/it"
   },
   {
       "name": "Plissè L7-E7C",
       "prod_pic": "https://www.giarnierilight.com/file/plisse_BT_multipla_7led_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/plisse-l7/it"
   },
   {
       "name": "Plissè LL-ELC",
       "prod_pic": "https://www.giarnierilight.com/file/plisse_BI_grande_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/plisse-ll/it"
   },
   {
       "name": "Plissè LS-ESC",
       "prod_pic": "https://www.giarnierilight.com/file/plisse_LS_piccola_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/plisse-ls/it"
   },
   {
       "name": "Plug A",
       "prod_pic": "https://www.giarnierilight.com/file/plug_A_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/plug/it"
   },
   {
       "name": "Rake AL",
       "prod_pic": "https://www.giarnierilight.com/file/rake_AL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rake-al/it"
   },
   {
       "name": "Rake AM",
       "prod_pic": "https://www.giarnierilight.com/file/rake_AM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rake-am/it"
   },
   {
       "name": "Rake AS",
       "prod_pic": "https://www.giarnierilight.com/file/rake_AS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rake-as/it"
   },
   {
       "name": "Rake AXL",
       "prod_pic": "https://www.giarnierilight.com/file/rake_AXL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rake-axl/it"
   },
   {
       "name": "Rake AXS",
       "prod_pic": "https://www.giarnierilight.com/file/rake_AXS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rake-axs/it"
   },
   {
       "name": "Rantan E3",
       "prod_pic": "https://www.giarnierilight.com/file/rantan_E3_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rantan-e3/it"
   },
   {
       "name": "Rantan E5",
       "prod_pic": "https://www.giarnierilight.com/file/rantan_E5_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rantan-e5/it"
   },
   {
       "name": "Rantan E7",
       "prod_pic": "https://www.giarnierilight.com/file/rantan_E7_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rantan-e7/it"
   },
   {
       "name": "Rantan EL",
       "prod_pic": "https://www.giarnierilight.com/file/rantan_grande_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rantan-el/it"
   },
   {
       "name": "Rantan ES",
       "prod_pic": "https://www.giarnierilight.com/file/rantan_piccola_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/rantan-es1/it"
   },
   {
       "name": "Review PL",
       "prod_pic": "https://www.giarnierilight.com/file/review_PL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/review-pl/it"
   },
   {
       "name": "Review PM",
       "prod_pic": "https://www.giarnierilight.com/file/review_PM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/review-pm/it"
   },
   {
       "name": "Review PS",
       "prod_pic": "https://www.giarnierilight.com/file/review_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/review-ps/it"
   },
   {
       "name": "Spoke Q-PL",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_Q_PL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-q-pl/it"
   },
   {
       "name": "Spoke Q-PS",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_Q_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-q-ps/it"
   },
   {
       "name": "Spoke Q-SL",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_Q_SL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-q-sl/it"
   },
   {
       "name": "Spoke Q-SS",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_Q_SS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-q-ss/it"
   },
   {
       "name": "Spoke T-PL",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_T_PL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-pl/it"
   },
   {
       "name": "Spoke T-PS",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_T_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-ps/it"
   },
   {
       "name": "Spoke T-SL",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_T_SL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-s-l/it"
   },
   {
       "name": "Spoke T-SS",
       "prod_pic": "https://www.giarnierilight.com/file/spoke_T_SS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/spoke-s-s/it"
   },
   {
       "name": "Step AL",
       "prod_pic": "https://www.giarnierilight.com/file/step_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/step-al/it"
   },
   {
       "name": "Step AS",
       "prod_pic": "https://www.giarnierilight.com/file/step_AS_apertura_2018.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/step-as/it"
   },
   {
       "name": "Step PM",
       "prod_pic": "https://www.giarnierilight.com/file/step_P_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/step-pm/it"
   },
   {
       "name": "Step PS",
       "prod_pic": "https://www.giarnierilight.com/file/step_P_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/step-ps/it"
   },
   {
       "name": "Surf PL",
       "prod_pic": "https://www.giarnierilight.com/file/surf_PL_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/surf-pl/it"
   },
   {
       "name": "Surf PM",
       "prod_pic": "https://www.giarnierilight.com/file/surf_PM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/surf-pm/it"
   },
   {
       "name": "Surf PS",
       "prod_pic": "https://www.giarnierilight.com/file/surf_PS_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/surf-ps/it"
   },
   {
       "name": "Surf SL",
       "prod_pic": "https://www.giarnierilight.com/file/surf_SL_apertura_2019.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/surf-sl/it"
   },
   {
       "name": "Surf SM",
       "prod_pic": "https://www.giarnierilight.com/file/surf_SM_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/surf-ss/it"
   },
   {
       "name": "Tilt S",
       "prod_pic": "https://www.giarnierilight.com/file/tilt_S_bianca_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/tilt-s1/it"
   },
   {
       "name": "Wow A",
       "prod_pic": "https://www.giarnierilight.com/file/wow_grigio_apertura.jpg",
       "prod_page": "https://www.giarnierilight.com/prodotto/wow/it"
   }
]







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
        var name = arr_all_products[index].name;
        var prod_pic = arr_all_products[index].prod_pic;
        var uri = arr_all_products[index].prod_page;
        //var category = arr_all_products[index].category;
        //var model = arr_all_products[index].name;
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            createJsonFromAPage(body, uri, name, prod_pic );
        });

    }
}





var arr_single_product = [];

function createJsonFromAPage(body, uri, name, prod_pic){


    (async() => {
        
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(uri);


      let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);

      // aspetto comunque 2 secondi per accertarmi che ogni elemento della pagina sia scaricato e renderizzato
      await page.waitFor(300);
      
      var $body = $(preloaded_bodyHTML);

      
      /* foto di projects */
      var projects = [];
      var $project_images = $body.find("#toslider img");
      $project_images.each(function(){
          projects.push( "https://www.giarnierilight.com"+$(this).attr("src") );
      });

      /* light schema */
      var light_schema;
      $body.find(".col-sm-4").each(function(){
         if($(this).find("img").length != 0)
            light_schema = $(this).find("img").attr("src");
      })


      /* descrizione */
      let description = $body.find(".text-w-70 p").html();

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
      });

      */
      

      /* video */
      // var video = $body.find(".embed-container").find("iframe").attr("src");

      /* website item name */
      // var website_name = $body.find("#product-title").text().trim();
      
      await browser.close();
      index++;

      arr_single_product.push({
        name: name,
        prod_pic: prod_pic,
        prod_page : uri,
        projects : projects,
        light_schema : light_schema,
        //category: category,
        description: description,
        //video: video,
        //variations: variations
      });
      avvia(index);
        
        
      /*
        
        


        
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

        */
        


    })();



    

}



