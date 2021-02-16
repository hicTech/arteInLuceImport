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



// tutto il json assets_json.json copiato e incollato
var arr_all_products = [
  {
    "name": "la lollo suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/la-lollo-L-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/la-lollo-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli foliage suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/01/veli-foliage-suspension-650.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-foliage-suspension/",
    "category": "suspension"
  },
  {
    "name": "hugo vertical",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/03/Thumb_650_Thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/hugo-vertical/",
    "category": "suspension"
  },
  {
    "name": "nuvem",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/nuvem-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/nuvem/",
    "category": "suspension"
  },
  {
    "name": "hugo architectural system",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/11/Hugo-Architectural_650_Thumb.png",
    "page_url": "https://www.slamp.com/en/products/suspension/hugo-architectural-system/",
    "category": "suspension"
  },
  {
    "name": "accordéon suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/accordeon-thumb-650.png",
    "page_url": "https://www.slamp.com/en/products/suspension/accordeon/",
    "category": "suspension"
  },
  {
    "name": "kalatos suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/kalatos-suspension-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/kalatos-suspension/",
    "category": "suspension"
  },
  {
    "name": "la lollona",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/la-lollona-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/la-lollona/",
    "category": "suspension"
  },
  {
    "name": "atmosfera suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/atmosfera-suspension-thumn-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/atmosfera-suspension/",
    "category": "suspension"
  },
  {
    "name": "charlotte globe",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/12/charlotte-globe_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/charlotte-globe-suspension/",
    "category": "suspension"
  },
  {
    "name": "clizia pixel suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Clizia_pixel_suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/clizia-pixel-suspension/",
    "category": "suspension"
  },
  {
    "name": "dimple suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/dimple-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/dimple-suspension/",
    "category": "suspension"
  },
  {
    "name": "hugo",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Hugo_Prisma_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/hugo-suspension/",
    "category": "suspension"
  },
  {
    "name": "la belle étoile suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/04/la_belle_Etoile_suspension_650_thumb-new.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/la-belle-etoile-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli couture suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/veli-couture-susp_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-couture-suspension/",
    "category": "suspension"
  },
  {
    "name": "avia edition",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/04/Avia-Edition_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/avia-edition/",
    "category": "suspension"
  },
  {
    "name": "drusa suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Drusa_White_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/drusa-suspension/",
    "category": "suspension"
  },
  {
    "name": "clizia mama non mama suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Clizia_mamanonmama_suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/clizia-mama-non-mama-suspension/",
    "category": "suspension"
  },
  {
    "name": "aria gold",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/aria-gold_650_thumb_new.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/aria-gold-suspension/",
    "category": "suspension"
  },
  {
    "name": "la traviata",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/la-traviata-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/la-traviata/",
    "category": "suspension"
  },
  {
    "name": "veli mini single couture suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/01/Veli_Mini-Single_650_Thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-mini-single-couture-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli mini trio couture suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/01/Veli-Trio_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-mini-trio-couture-suspension/",
    "category": "suspension"
  },
  {
    "name": "cordoba suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Cordoba_650_thumb_new.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/cordoba-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli mini quartet couture suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/01/Veli-Mini-Quartet_650_Thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-mini-quartet-couture-suspension/",
    "category": "suspension"
  },
  {
    "name": "half charlotte suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Half-Charlotte_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/half-charlotte-suspension/",
    "category": "suspension"
  },
  {
    "name": "hanami suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Hanami_L_Suspension_650_thumb_new.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/hanami-suspension/",
    "category": "suspension"
  },
  {
    "name": "avia",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/avia-fade_650_thumb.png",
    "page_url": "https://www.slamp.com/en/products/suspension/avia-suspension/",
    "category": "suspension"
  },
  {
    "name": "clizia fumé suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia_Fume_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/clizia-fume-suspension/",
    "category": "suspension"
  },
  {
    "name": "étoile suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/05/new-Etoile_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/new-etoile-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli 7 suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_7_Prisma_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-7-suspension/",
    "category": "suspension"
  },
  {
    "name": "fabula suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Fabula_suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/fabula-suspension/",
    "category": "suspension"
  },
  {
    "name": "chantal suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Chantal_S_White_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/chantal-suspension/",
    "category": "suspension"
  },
  {
    "name": "aria transparent",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/aria-transparent_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/aria-transparent-suspension/",
    "category": "suspension"
  },
  {
    "name": "flora gold, silver, copper, pewter suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Flora_Gold_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/flora-gold-silver-copper-pewter-suspension/",
    "category": "suspension"
  },
  {
    "name": "liza suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Liza_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/liza-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli gold, silver, copper suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_Suspension_Copper_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-gold-silver-copper-suspension/",
    "category": "suspension"
  },
  {
    "name": "ginetta suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Ginetta_Black_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/ginetta-suspension/",
    "category": "suspension"
  },
  {
    "name": "fiorella suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Fiorella_White_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/fiorella-suspension/",
    "category": "suspension"
  },
  {
    "name": "gemmy suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Gemmy_Color_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/gemmy-suspension/",
    "category": "suspension"
  },
  {
    "name": "flora suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Flora_Suspension_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/flora-m-s-suspension/",
    "category": "suspension"
  },
  {
    "name": "luis",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Lui_suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/luis-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli prisma suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli-Prisma_susp_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-prisma-suspension/",
    "category": "suspension"
  },
  {
    "name": "ginetta prisma suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Ginetta-Prisma_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/ginetta-prisma-suspension/",
    "category": "suspension"
  },
  {
    "name": "woody suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Woody_Suspension_Family_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/woody-suspension/",
    "category": "suspension"
  },
  {
    "name": "goccia prisma suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Goccia_Prisma_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/goccia-prisma-suspension/",
    "category": "suspension"
  },
  {
    "name": "ceremony suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/ceremony-90_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/ceremony-suspension/",
    "category": "suspension"
  },
  {
    "name": "mille bolle suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Mille-Bolle-Suspension_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/mille-bolle-suspension/",
    "category": "suspension"
  },
  {
    "name": "cactus suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/cactus-gold-suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/cactus-suspension/",
    "category": "suspension"
  },
  {
    "name": "atlante suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/atlante-suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/atlante-suspension/",
    "category": "suspension"
  },
  {
    "name": "lillibet suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Lillibet_White_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/lillibet-suspension/",
    "category": "suspension"
  },
  {
    "name": "lillibet gold, silver, copper suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Lillibet_Copper_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/lillibet-gold-silver-copper-suspension/",
    "category": "suspension"
  },
  {
    "name": "medusa suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Medusa-Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/medusa-suspension/",
    "category": "suspension"
  },
  {
    "name": "fiorella mini suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Fiorella_Gold_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/fiorella-mini-gold-silver-copper-suspension/",
    "category": "suspension"
  },
  {
    "name": "aria",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/aria_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/aria-suspension/",
    "category": "suspension"
  },
  {
    "name": "clizia suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia_Suspension_white_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/clizia-suspension/",
    "category": "suspension"
  },
  {
    "name": "veli suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_Suspension_Large_Opal_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/veli-suspension/",
    "category": "suspension"
  },
  {
    "name": "goccia suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Goccia_Opal_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/goccia-suspension/",
    "category": "suspension"
  },
  {
    "name": "supermorgana",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Supermorgana_Gold_Black_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/supermorgana-suspension/",
    "category": "suspension"
  },
  {
    "name": "gemmy prisma suspension",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Gemmy_Prisma_Suspension_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/suspension/gemmy-prisma-suspension/",
    "category": "suspension"
  },
  {
    "name": "la vie ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/12/lampada-soffitto-la-vie-bianco.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/la-vie-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "veli foliage ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/01/veli-foliage-ceiling-650.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/veli-foliage-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "la lollo applique",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/01/La-Lollo-Applique_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/la-lollo-applique/",
    "category": "ceiling/wall"
  },
  {
    "name": "mida ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/12/Mida_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/mida-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "charlotte applique",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/12/charlotte-applique_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/charlotte-applique/",
    "category": "ceiling/wall"
  },
  {
    "name": "clizia mama non mama ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Clizia_mamanonmama_ceiling-wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/clizia-mama-non-mama-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "idea wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/idea-applique-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/idea-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "kalatos ceiling",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/kalatos-ceiling-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/ceiling/kalatos-ceiling/",
    "category": "ceiling/wall"
  },
  {
    "name": "mida applique",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/mida-applique-thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/mida-applique/",
    "category": "ceiling/wall"
  },
  {
    "name": "medusa wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Medusa-Wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/medusa-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "fiorella mini wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Fiorella_Wall_White_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/fiorella-mini-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "dafne ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Dafne-ceiling-wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/dafne-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "venti ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Venti_Plana_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/venti-ceilingwall/",
    "category": "ceiling/wall"
  },
  {
    "name": "bios ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/bios-ceiling-wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/bios-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "la belle etoile ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/04/la_belle_Etoile_Ceiling_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/la-belle-etoile-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "clizia mama non mama applique",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Clizia_mamanonmama_applique_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/clizia-mama-non-mama-applique/",
    "category": "ceiling/wall"
  },
  {
    "name": "clizia pixel ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Clizia_pixel_ceiling-wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/clizia-pixel-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "clizia pixel applique",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Clizia_pixel_applique_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/clizia-pixel-applique/",
    "category": "ceiling/wall"
  },
  {
    "name": "drusa ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/02/Drusa_Velvet_Ceiling_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/drusa-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "hanami ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Hanami_Ceiling_Wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/hanami-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "veli couture ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/veli-couture-ceiling-wall_650_thumb_new.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/veli-couture-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "étoile ceiling",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Etoile_Ceiling_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/etoile-ceiling/",
    "category": "ceiling/wall"
  },
  {
    "name": "fabula ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Fabula_Prisma_Ceiling_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/fabula-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "mirage",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Mirage_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/mirage/",
    "category": "ceiling/wall"
  },
  {
    "name": "clizia fumé ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia_Fume_Ceiling_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/clizia-fume-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "veli gold, silver, copper ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_ceiling_Gold_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/veli-gold-silver-copper-ceilingwall/",
    "category": "ceiling/wall"
  },
  {
    "name": "clizia ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/clizia_ceiling-white_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/clizia-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "veli ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_Ceiling_Opal_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/veli-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "veli prisma ceiling/wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_Prisma_ceiling_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/veli-prisma-ceiling-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "mille bolle wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Mille-Bolle-Wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/mille-bolle-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "aurora",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/aurora-large_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/ceiling/aurora-ceiling/",
    "category": "ceiling/wall"
  },
  {
    "name": "lillibet mini wall",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Lillibet_Trasparent_Wall_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/wall/lillibet-mini-wall/",
    "category": "ceiling/wall"
  },
  {
    "name": "hugo floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/03/hugo-floor_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/hugo-floor/",
    "category": "floor"
  },
  {
    "name": "la lollo floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/12/la-lollo-floor-prisma_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/la-lollo-floor/",
    "category": "floor"
  },
  {
    "name": "bach floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/bach_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/bach-floor/",
    "category": "floor"
  },
  {
    "name": "charlotte floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Charlotte-Floor_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/charlotte-floor/",
    "category": "floor"
  },
  {
    "name": "the lightning archives of studio job",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/lovepeacejoy_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/the-lightning-archives/",
    "category": "floor"
  },
  {
    "name": "flora floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Flora_Floor_Copper_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/flora-floor/",
    "category": "floor"
  },
  {
    "name": "liza floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Liza_Floor_Prisma_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/liza-floor/",
    "category": "floor"
  },
  {
    "name": "clizia fumé floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia_Floor_Fume_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/clizia-fume-floor/",
    "category": "floor"
  },
  {
    "name": "gemmy prisma floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Gemmy_Floor_Prisma_Color_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/gemmy-prisma-floor/",
    "category": "floor"
  },
  {
    "name": "clizia floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia_Floor_White_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/clizia-floor/",
    "category": "floor"
  },
  {
    "name": "cactus prisma floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Cactus_XL_Prisma_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/cactus-prisma-floor/",
    "category": "floor"
  },
  {
    "name": "mille bolle floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Mille-Bolle-Floor_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/mille-bolle-floor/",
    "category": "floor"
  },
  {
    "name": "cactus floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/cactus-gold_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/cactus-floor/",
    "category": "floor"
  },
  {
    "name": "fiorella floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Fiorella_Floor_Fume_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/fiorella-floor/",
    "category": "floor"
  },
  {
    "name": "las palmas floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Las-Palmas_Floor_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/las-palmas-floor/",
    "category": "floor"
  },
  {
    "name": "dafne floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Dafne_Xl_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/dafne-tube-floor/",
    "category": "floor"
  },
  {
    "name": "diamond floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Diamond_fllor_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/diamond-floor/",
    "category": "floor"
  },
  {
    "name": "venti floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Venti_Family_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/venti-floor/",
    "category": "floor"
  },
  {
    "name": "ecstacity floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Estacity_Floor_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/ecstacity-floor/",
    "category": "floor"
  },
  {
    "name": "bios floor",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/bios-tube_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/floor/bios-tube-floor/",
    "category": "floor"
  },
  {
    "name": "accordéon table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/03/Accordeon-table_650_Thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/accordeon-table/",
    "category": "table"
  },
  {
    "name": "lafleur",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/lafleur-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/table/lafleur-table/",
    "category": "table"
  },
  {
    "name": "veli foliage table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2020/01/veli-foliage-table-650.jpg",
    "page_url": "https://www.slamp.com/en/products/table/veli-foliage-table/",
    "category": "table"
  },
  {
    "name": "clizia battery",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/09/clizia-battery-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/table/clizia-battery-powered-table/",
    "category": "table"
  },
  {
    "name": "idea table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/10/idea-table-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/table/idea-table/",
    "category": "table"
  },
  {
    "name": "atmosfera fringe table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/atmosfera-table-fringe-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/table/atmosfera-fringe-table/",
    "category": "table"
  },
  {
    "name": "overlay table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/overlay-applique-thumb-650.jpg",
    "page_url": "https://www.slamp.com/en/products/table/overlay/",
    "category": "table"
  },
  {
    "name": "moon 25<sup>th</sup> anniversary",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2018/08/Moon_table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/moon-25th-anniversary/",
    "category": "table"
  },
  {
    "name": "atmosfera table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2019/04/atmosfera-table-thumb-650-1.jpg",
    "page_url": "https://www.slamp.com/en/products/table/atmosfera-table/",
    "category": "table"
  },
  {
    "name": "cactus table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/cactus-table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/cactus-table/",
    "category": "table"
  },
  {
    "name": "atlante table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/atlante-table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/atlante-table/",
    "category": "table"
  },
  {
    "name": "fiorellina table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Fiorellina_Table_White_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/fiorellina-table/",
    "category": "table"
  },
  {
    "name": "gemmy table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/gemmy-table-arlecchino-thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/gemmy-table/",
    "category": "table"
  },
  {
    "name": "las palmas table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Las-Palmas_table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/las-palmas-table/",
    "category": "table"
  },
  {
    "name": "dafne table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Dafne_table_S_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/dafne-tube-table/",
    "category": "table"
  },
  {
    "name": "bach table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Bach_S_White_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/bach-table/",
    "category": "table"
  },
  {
    "name": "diamond table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Diamond_table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/diamond-table/",
    "category": "table"
  },
  {
    "name": "venti table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Venti_table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/venti-table/",
    "category": "table"
  },
  {
    "name": "veli couture table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/veli-couture-table_650_thumb-new.jpg",
    "page_url": "https://www.slamp.com/en/products/table/veli-couture-table/",
    "category": "table"
  },
  {
    "name": "liza table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Liza-table-pewter_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/liza-table/",
    "category": "table"
  },
  {
    "name": "clizia fumé table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia_Fume_Table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/clizia-fume-table/",
    "category": "table"
  },
  {
    "name": "gemmy prisma table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Gemmy_Table_Prisma_Color_650_thumb-1.jpg",
    "page_url": "https://www.slamp.com/en/products/table/gemmy-prisma-table/",
    "category": "table"
  },
  {
    "name": "fiorellina gold, silver, copper table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Fiorellina_Table_Copper_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/fiorellina-gold-silver-copper-table/",
    "category": "table"
  },
  {
    "name": "clizia table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Clizia-Table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/clizia-table/",
    "category": "table"
  },
  {
    "name": "cactus prisma table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/Cactus_table_Prisma_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/cactus-prisma-table/",
    "category": "table"
  },
  {
    "name": "veli table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Veli_table_650_Thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/veli-table/",
    "category": "table"
  },
  {
    "name": "mille bolle table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/08/Mille-Bolle-Table_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/mille-bolle-table/",
    "category": "table"
  },
  {
    "name": "bios table",
    "pic_url": "https://www.slamp.com/wp-content/uploads/2017/07/bios-tube-S_650_thumb.jpg",
    "page_url": "https://www.slamp.com/en/products/table/bios-tube-table/",
    "category": "table"
  }
]



var pages_number = arr_all_products.length;



var index = 0;




avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('new_assets.json', JSON.stringify(arr_first, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var name = arr_all_products[index].name;
        //var prod_pic = arr_all_products[index].prod_pic;
        var uri = arr_all_products[index].page_url;
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
            prod_name: name,
        });


        
        
        /* foto di projects */
        
        var projects = [];
        var $project_images = $body.find(".content_slider_product img")
        $project_images.each(function(){
            _.log($(this).attr("src"));
            projects.push( $(this).attr("src") );
        });
        

        



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



