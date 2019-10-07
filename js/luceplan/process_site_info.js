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





var arr_all_products =[
    {
      "name": "Agave",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/agave_lamp_suspension_product_cover.jpg/51b0a6537ed798f915a0cb1c91be332e.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/agave-sospensione"
    },
    {
      "name": "Aircon",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/aircon_lamp_suspension_producthome.jpg/b52f49b714c62b0aa7c932d4386a6896.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/aircon-sospensione"
    },
    {
      "name": "Any",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/any/ceiling-wall/any-d69-product-coever.jpg/310f4264da417d9c6c0973bb6e8b1527.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/any-parete"
    },
    {
      "name": "Ascent",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/ascent_lamp_table_producthome.jpg/9541a61fa0fdb851f3c71b4d2042effa.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/ascent-tavolo"
    },
    {
      "name": "Bap LED",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/bapled_lamp_table_producthome.jpg/ef91b50292a53b4673cc9957f59c1d1e.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/bap-led-tavolo"
    },
    {
      "name": "Bap LED",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/bapled_lamp_wall_producthome-1499767858.jpg/aa4a386d7d2de721bbebb97e0e2d6bd2.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/bap-led-parete"
    },
    {
      "name": "Berenice",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/berenice_lamp_floor_producthome.jpg/e92f3a0b528c9999c6b1591df1d29a73.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/berenice-terra"
    },
    {
      "name": "Berenice LED",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/bereniceLED_lamp_table_producthome.jpg/5563d59fe21c6374ff9393b68fbc5c37.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/berenice-led-tavolo"
    },
    {
      "name": "Berenice",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/berenice_lamp_table_producthome.jpg/474997ad1ecf2dca807f92cad18b6ad2.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/berenice-tavolo"
    },
    {
      "name": "Berenice",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/berenice_lamp_wall_producthome.jpg/0bbfbca03b19f8fe9e8e16640d987733.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/berenice-parete"
    },
    {
      "name": "Blow",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/blow/ceiling-wall/D28-blow-product-cover.jpg/3e8300421b000bc74274dcdabf03ea19.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/blow-soffitto"
    },
    {
      "name": "Cappuccina",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cappuccina_lamp_table_producthome.jpg/3147f8d2d65637be0bf9216cbe564004.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/cappuccina-tavolo"
    },
    {
      "name": "Cappuccina",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cappuccina_lamp_SUSPENSION_producthome.jpg/4f00ffa650c7d499e2b813031895c293.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/cappuccina-sospensione"
    },
    {
      "name": "Cappuccina",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cappuccina_lamp_floor_producthome.jpg/6be6f7cb36b93b54ecedc200c38be687.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/cappuccina-terra"
    },
    {
      "name": "Carrara",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/carrara_lamp_floor_producthome__.jpg/2e1a54f433d47792479e3fe566f9f1ec.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/carrara-terra"
    },
    {
      "name": "Chichibio",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/chichibio_lamp_floor_producthome.jpg/020c1b36e05cda4fa849d2e16b52a29e.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/chichibio-terra"
    },
    {
      "name": "Compendium",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/compendium_lamp_floor_producthome_1.jpg/087aa79e28c949470fb5b359914591b1.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/compendium-terra"
    },
    {
      "name": "Compendium",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/compendium_lamp_suspension_producthome.jpg/1bb8b4a5105fc1878b7dcee963411fd8.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/compendium-sospensione"
    },
    {
      "name": "Compendium Circle",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Compendium-Circle-d81C-productcover.jpg/cab0e58acf0be1c54b46f14cb6101a58.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/compendium-circle-sospensione"
    },
    {
      "name": "Compendium Plate",
      "category": [
        "Parete",
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/CompendiumPlate-d81p-productcover.jpg/1b5ec7ff063dd958f304f236903370f0.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/compendium-plate-parete"
    },
    {
      "name": "Costanza",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/white-thumb-1539684776.jpg/913800fc3e8c530fc1c48926e5c04c59.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-parete"
    },
    {
      "name": "Costanza LED",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/CostanzaLED_table_lamp.jpg/0cc588e3ccc36464337366cf2cf1d9d4.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-led-tavolo"
    },
    {
      "name": "Costanza LED",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/CostanzaLED_floor_lamp.jpg/2c39ca0f422e8ccd1a7ca427fc6026ea.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-led-terra"
    },
    {
      "name": "Costanza",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/costanza-d13-product-cover-1499868586.jpg/ae1a2e484d9bec7816cb9a5ca98eafdc.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-tavolo"
    },
    {
      "name": "Costanza",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Costanza-d13s-product-cover.jpg/22020c6c52b9c90ff838559ac98fbd2a.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-sospensione"
    },
    {
      "name": "Costanza Friends of Hue",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/terra_cover.jpg/0bb8a708a5e7965668f90a598d889e7a.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-fiends-of-hue-terra"
    },
    {
      "name": "Costanza",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Costanza_terra_slide.jpg/83d7d89543fb42144c9b1327b5588bfe.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-terra"
    },
    {
      "name": "Costanza LED",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/costanzaLED_lamp_suspension_producthome.jpg/f1d7e12c8002bbbc27691706d79c9433.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-led-sospensione"
    },
    {
      "name": "Costanza Friends of Hue",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/TABLE_COVER.jpg/0ef1a56acbb7942fb15149b0026bafbf.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanza-fiends-of-hue-tavolo"
    },
    {
      "name": "Costanzina",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Costanzina-d13s-product-cover.jpg/b8864348f6d06d85a5517c732e12a0f3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanzina-sospensione"
    },
    {
      "name": "Costanzina",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/costanzina_lamp_table_producthome.jpg/ff49c4d0cb9826ed829e3072da8c6088.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanzina-tavolo"
    },
    {
      "name": "Costanzina",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/costanzinawall-product-cover.jpg/cde0e665fa4af75127c30d6a95c93b4f.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/costanzina-parete"
    },
    {
      "name": "Counterbalance floor",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/counterbalance_lamp_floor_producthome.jpg/418e07bf3bcf74793cdb00980d8829f2.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/counterbalance-floor-terra"
    },
    {
      "name": "Counterbalance spot",
      "category": [
        "Soffitto",
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/counterbalancespot-product-cover.jpg/fa26a7d37aa4a961006701f307801c0f.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/counterbalance-spot"
    },
    {
      "name": "Counterbalance",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/counterbalance_lamp_wall_producthome.jpg/adb84ae373180a59d9eaaa6fc5d2b874.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/counterbalance-parete"
    },
    {
      "name": "Diade",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/diade-d93-product-cover-1499929153.jpg/7230467de54a67c90cea8af5bd2fea63.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/diade-sospensione"
    },
    {
      "name": "E04 ceiling",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/E04-product-cover-1500296037.jpg/f24f33244549bb5a4f17bbf5ff07f87d.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/e04-ceiling-parete"
    },
    {
      "name": "E04 suspension",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/E04-product-cover-1501582403.jpg/e75426007b1590e1f62c8a00da839d92.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/e04-sospensione"
    },
    {
      "name": "E06",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/e06/ceiling-wall/E06-product-cover.jpg/d664faef9c4b6b5bb1b1260f7e10a52e.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/e06-parete"
    },
    {
      "name": "Farel",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cover_Farel-1531388717.jpg/012e5b3b9b4f342c6d52d13009184657.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/farel-sospensione"
    },
    {
      "name": "Fortebraccio",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33t-product-cover.jpg/dbd8e4c70403b18c98943b993fc5fdd3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/fortebraccio-terra"
    },
    {
      "name": "Fortebraccio",
      "category": [
        "Soffitto",
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/forte_3-1506088601.jpg/95aa36cf3b7df900edcded6406d14a82.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/fortebraccio-parete"
    },
    {
      "name": "Fortebraccio",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33-product-cover.jpg/c23547c050f14ddaccc794c21136fe9c.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/fortebraccio-tavolo"
    },
    {
      "name": "Fortebraccio",
      "category": [
        "Parete",
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33Nsp60-product-cover.jpg/ead27c37fbfc6a893a3b46e510fe8ff8.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/fortebraccio-spot"
    },
    {
      "name": "Fortebraccio LED",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33Nled-product-cover.jpg/6c2c0a5b78468db8c7c49f0f2596f3f3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/fortebraccio-led-tavolo"
    },
    {
      "name": "Garbì",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/garbi-product-cover.jpg/cf3f426e4745c81240461d11a3da5568.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/garbi-parete"
    },
    {
      "name": "GlassGlass",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/glassglass-d31-product-cover.jpg/fe3e76ec2d21267b3a163801d865d508.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/glassglass-sospensione"
    },
    {
      "name": "Goggle",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/goggle-d52-product-cover.jpg/5f9140958f7e5ae689a5145d4ae0dc82.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/goggle-parete"
    },
    {
      "name": "Grande Costanza",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/grandecostanza-d13gs-product-cover.jpg/e2d90508f5ef571fe9b4171f53e63fd1.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/grande-costanza-sospensione"
    },
    {
      "name": "Grande Costanza",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/grandecostanza-d13Gt-product-cover.jpg/97157392d3adad358dfea474ff6c2cad.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/grande-costanza-terra"
    },
    {
      "name": "Grande Costanza Open Air",
      "category": [
        "Esterno"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/grandecostanzaopenair_lamp_floor_producthome_US.jpg/c61059e94365dba17300bbfcf27bce78.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/grande-costanza-open-air-esterno"
    },
    {
      "name": "Honeycomb",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/honeycomb-d70-product-slider-1500295631.jpg/e45dc07edeaf5c120719d58a5469dcf7.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/honeycomb-sospensione"
    },
    {
      "name": "Hope",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/hope_lamp_floor_producthome_US.jpg/fd54c4debc187b7e1e73f4427d620652.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/hope-terra"
    },
    {
      "name": "Hope",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/hopeceiling-d66-product-cober.jpg/98f2593e96d10191869ad9ed32a020ca.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/hope-soffitto"
    },
    {
      "name": "Hope",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/hope-d66-product-cover.jpg/c21b1de244eca8520049ada63c178ab4.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/hope-sospensione"
    },
    {
      "name": "Hope",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/hopewall-d66-product-cover-1500295910.jpg/112e59bc27b5f3350a12deba7adb4ad3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/hope-parete"
    },
    {
      "name": "Javelot Macro",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/javelot-macro/ceiling-wall/javelot-d54p-product-cover.jpg/3f4c5edb3b70b4afcd837d482b6d6651.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/javelot-macro-parete"
    },
    {
      "name": "Javelot Macro",
      "category": [
        "Esterno"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/javelotmacroterra-d54-product-cover.jpg/d6012e1f5b2bff4fe28e224dbcdeafb8.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/javelot-macro-1-esterno"
    },
    {
      "name": "Lady Costanza",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/ladycostanza_lamp_table_producthome.jpg/87396a10270df6972d7bd67ddf6fc2ff.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lady-costanza-terra"
    },
    {
      "name": "Lady Costanza",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/ladycostanza_lamp_suspension_producthome.jpg/946ae3a234d0e90699f9d45bf57d2155.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lady-costanza-sospensione"
    },
    {
      "name": "Lady Costanza",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/ladycostanza_lamp_wall_producthome.jpg/d68d315d023566487abeec6c02bb510f.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lady-costanza-parete"
    },
    {
      "name": "Lane",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/lane-d64-product-cover.jpg/b05c3f65f729d335aba4e148990c092c.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lane-parete"
    },
    {
      "name": "LightDisc",
      "category": [
        "Soffitto",
        "Parete",
        "Esterno",
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/lightdisc-d41-product-cover.jpg/1c8052a018ff0b60c7a89dbd86915515.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lightdisc-parete"
    },
    {
      "name": "Lita",
      "category": [
        "Soffitto",
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cover_Lita_wall.jpg/1df8d24a1afb292852f077aef4bd3cdb.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lita-wall"
    },
    {
      "name": "Lita",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cover_Lita_table.jpg/97696d06f2001f45c169e9af63e39229.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lita"
    },
    {
      "name": "Lita",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cover_LIta_susp.jpg/a63fc78899e8bd2f4d44ef6321ef47f3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lita-suspension"
    },
    {
      "name": "Lita",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cover_LIta_floor.jpg/0ca048f2d1acc2d9ed1ef6e95aae4106.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lita-floor"
    },
    {
      "name": "Lola",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/lola-d15-product-cover.jpg/fffab855b8384b106c2cc81a13ad0862.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lola-terra"
    },
    {
      "name": "Lola",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/lola/ceiling-wall/white-thumb.jpg/6f31e4223f8276e05a6b08cfdc1fa69b.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/lola-parete"
    },
    {
      "name": "Mesh Plafone",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Mesh_plafone_nero.jpg/83a5364faa452904375d47c88f937e62.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/mesh-ceiling"
    },
    {
      "name": "Mesh",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Mesh_rosone_nero.jpg/551cbc059789a11d3cd947d985f47c70.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/mesh-sospensione"
    },
    {
      "name": "Mesh wireless",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Mesh_cover.jpg/7dbb81aaa0a25c8a01ddc018de7d9ce3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/mesh-wireless"
    },
    {
      "name": "Metropoli",
      "category": [
        "Soffitto",
        "Parete",
        "Esterno"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/metropoli_lamp_wall_producthome.jpg/c5ca1d12cda9250cc9f6a6788a5744e1.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/metropoli-parete"
    },
    {
      "name": "E08 Mini mini",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/MiniMini_1-1519036791.jpg/ce67b8d0b617b24563d722360924f32b.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/mini-mini-sospensione"
    },
    {
      "name": "Miranda",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Miranda-d60-product-cover.jpg/e664564c32cbb880113779a2c8df2003.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/miranda-tavolo"
    },
    {
      "name": "Mirandolina",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Mirandolina-d66pi-product-cover.jpg/d6e855614e7016dc3f9adcecaff47068.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/mirandolina-tavolo"
    },
    {
      "name": "Nothing",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Nothing-d75-product-cover.jpg/a3195df29719563bc6f93da8b370d944.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/nothing-terra"
    },
    {
      "name": "Otto Watt",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Ottowatt-d72-product-cover.jpg/625ec212cb2b181ce307af714ccd1a0e.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/otto-watt-tavolo"
    },
    {
      "name": "Otto Watt",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Ottowatt-d72a-product-cover.jpg/4fabe83f109bd7882c0dc3bf953c6c38.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/otto-watt-parete"
    },
    {
      "name": "Plissé",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Plisse-d62-product-cover.jpg/a5e4641ed53cf9ee80bea584b095e9b6.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/plisse-sospensione"
    },
    {
      "name": "Pod Lens",
      "category": [
        "Esterno"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Podlens-d30-product-slider.jpg/c921d624cc6f2af407a8b6d9f9529210.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/pod-lens-esterno"
    },
    {
      "name": "Pétale",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/petale-d71-product-cover-1501582425.jpg/e7c3821038f2653160d7c0a4d79536c2.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/petale-sospensione"
    },
    {
      "name": "Pétale RGB/DMX (for Americas only)",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/cover.jpg/693d55fe69b669278c26dbfef73a42a5.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/petale-rgbdmx-for-americas-only"
    },
    {
      "name": "Silenzio",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/silenzio_lamp_suspension_producthome.jpg/bc3ec5f45a4716294d2cb3f16a2aeb92.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/silenzio-sospensione"
    },
    {
      "name": "Sky",
      "category": [
        "Esterno",
        "Parete",
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/COVER-SKY.jpg/1777013fbb2394200b69676aea76bdb8.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/sky-terra"
    },
    {
      "name": "Soleil Noir",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/SoleilNoir-d89s-product-cover.jpg/749c60d3b1f916fdcbf353975e13cd57.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/soleil-noir-sospensione"
    },
    {
      "name": "Soleil Noir",
      "category": [
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/SoleilNoir-d89p-product-cover.jpg/93a85592ac84d2ce2f2e3a8695155a36.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/soleil-noir-parete"
    },
    {
      "name": "Stochastic",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Stochastic-d87-product-cover.jpg/55190a1f65e2ff9574e179a1bcc1ced2.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/stochastic-sospensione"
    },
    {
      "name": "Strip",
      "category": [
        "Parete",
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/stip-d22-product-cover-1499178940.jpg/9bad0f9d0468bbff0c29017dc71cf6df.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/strip-1-parete"
    },
    {
      "name": "Synapse (for Americas only)",
      "category": [
        "Soffitto",
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Cover-1518016607.jpg/872a73fb63a7dad0bad6ad3003888d25.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/synapse-parete"
    },
    {
      "name": "Synapse (for Americas only)",
      "category": [
        "Sospensione",
        "Soffitto"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/synapse-d74-product-cover.jpg/375a425e640e6daccee977a2ee8cbe86.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/synapse-sospensione"
    },
    {
      "name": "Tango",
      "category": [
        "Terra"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Tango-d77-product-cover.jpg/c910b328023baa72b709d1275e3f3a10.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/tango-terra"
    },
    {
      "name": "Titania",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Titania-d17-product-cover.jpg/61981d253a22de00bd2ca32de3ee6a12.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/titania-sospensione"
    },
    {
      "name": "Queen Titania",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/QueenTitania-d17q-product-slider.jpg/6a9d262b26b55fdb149a970fb50eafe3.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/queen-titania-sospensione"
    },
    {
      "name": "Trama",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/trama_lamp_suspension_productpage.jpg/c0ed5049fda917c6c88f34b7784e8599.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/trama-sospensione"
    },
    {
      "name": "Trama",
      "category": [
        "Soffitto",
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/trama-d14-product-cover.jpg/49b5e1afed4bc3a266eef39221d9de9e.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/trama-parete"
    }
  ]


  /*
var arr_all_products =[
  {
    "name": "Costanza",
    "category": [
      "Tavolo"
    ],
    "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/costanza-d13-product-cover-1499868586.jpg/ae1a2e484d9bec7816cb9a5ca98eafdc.jpg",
    "prod_page": "https://www.luceplan.com/it/prodotti/costanza-tavolo"
  },
    
  ]

*/



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
        var category = arr_all_products[index].category;
        var model = arr_all_products[index].name;
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            createJsonFromAPage(body, uri, model, name, prod_pic, category);
        });

    }
}





var arr_single_product = [];

function createJsonFromAPage(body, uri, model, name, prod_pic, category){


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
      var $project_images = $body.find(".carousel-cell");
      $project_images.each(function(){
        if( !$(this).is(".product-det") )
          projects.push( "http://www.luceplan.com"+$(this).find("img").attr("src") );
      });

      /* descrizione */
      let description = $body.find(".overview p").html();

      /* varianti */
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
          name: $(this).html().replace("/","").toUpperCase(),
          light_schema: "http://www.luceplan.com"+light_schema,
          data : data,
        })
      })
      

      /* video */
      var video = $body.find(".embed-container").find("iframe").attr("src");
      
      await browser.close();
      index++;

      arr_single_product.push({
        name: name,
        prod_pic: prod_pic,
        prod_page : uri,
        projects : projects,
        category: category,
        description: description,
        video: video,
        variations: variations
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



