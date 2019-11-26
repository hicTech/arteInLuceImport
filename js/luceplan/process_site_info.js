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
     "name":"Agave",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/agave_lamp_suspension_product_cover.jpg/51b0a6537ed798f915a0cb1c91be332e.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/agave-sospensione"
  },
  {
     "name":"Aircon",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/aircon_lamp_suspension_producthome.jpg/b52f49b714c62b0aa7c932d4386a6896.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/aircon-sospensione"
  },
  {
     "name":"Any",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/any/ceiling-wall/any-d69-product-coever.jpg/310f4264da417d9c6c0973bb6e8b1527.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/any-parete"
  },
  {
     "name":"Ascent",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/ascent_lamp_table_producthome.jpg/9541a61fa0fdb851f3c71b4d2042effa.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/ascent-tavolo"
  },
  {
     "name":"Bap LED",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/bapled_lamp_wall_producthome-1499767858.jpg/aa4a386d7d2de721bbebb97e0e2d6bd2.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/bap-led-parete"
  },
  {
     "name":"Bap LED",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/bapled_lamp_table_producthome.jpg/ef91b50292a53b4673cc9957f59c1d1e.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/bap-led-tavolo"
  },
  {
     "name":"Berenice",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/berenice_lamp_floor_producthome.jpg/e92f3a0b528c9999c6b1591df1d29a73.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/berenice-terra"
  },
  {
     "name":"Berenice LED",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/bereniceLED_lamp_table_producthome.jpg/5563d59fe21c6374ff9393b68fbc5c37.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/berenice-led-tavolo"
  },
  {
     "name":"Berenice",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/berenice_lamp_wall_producthome.jpg/0bbfbca03b19f8fe9e8e16640d987733.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/berenice-parete"
  },
  {
     "name":"Berenice",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/berenice_lamp_table_producthome.jpg/474997ad1ecf2dca807f92cad18b6ad2.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/berenice-tavolo"
  },
  {
     "name":"Blow",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/blow/ceiling-wall/D28-blow-product-cover.jpg/3e8300421b000bc74274dcdabf03ea19.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/blow-soffitto"
  },
  {
     "name":"Cappuccina",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cappuccina_lamp_SUSPENSION_producthome.jpg/4f00ffa650c7d499e2b813031895c293.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/cappuccina-sospensione"
  },
  {
     "name":"Cappuccina",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cappuccina_lamp_table_producthome.jpg/3147f8d2d65637be0bf9216cbe564004.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/cappuccina-tavolo"
  },
  {
     "name":"Cappuccina",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cappuccina_lamp_floor_producthome.jpg/6be6f7cb36b93b54ecedc200c38be687.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/cappuccina-terra"
  },
  {
     "name":"Carrara",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/carrara_lamp_floor_producthome__.jpg/2e1a54f433d47792479e3fe566f9f1ec.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/carrara-terra"
  },
  {
     "name":"Chichibio",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/chichibio_lamp_floor_producthome.jpg/020c1b36e05cda4fa849d2e16b52a29e.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/chichibio-terra"
  },
  {
     "name":"Compendium",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/compendium_lamp_suspension_producthome.jpg/1bb8b4a5105fc1878b7dcee963411fd8.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/compendium-sospensione"
  },
  {
     "name":"Compendium",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/compendium_lamp_floor_producthome_1.jpg/087aa79e28c949470fb5b359914591b1.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/compendium-terra"
  },
  {
     "name":"Compendium Circle",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Compendium-Circle-d81C-productcover.jpg/cab0e58acf0be1c54b46f14cb6101a58.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/compendium-circle-sospensione"
  },
  {
     "name":"Compendium Plate",
     "category":[
        "Parete",
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/CompendiumPlate-d81p-productcover.jpg/1b5ec7ff063dd958f304f236903370f0.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/compendium-plate-parete"
  },
  {
     "name":"Costanza",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/white-thumb-1539684776.jpg/913800fc3e8c530fc1c48926e5c04c59.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-parete"
  },
  {
     "name":"Costanza",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/costanza-d13-product-cover-1499868586.jpg/ae1a2e484d9bec7816cb9a5ca98eafdc.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-tavolo"
  },
  {
     "name":"Costanza",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Costanza-d13s-product-cover.jpg/bdc5dd066c97d76d650001c77fe33568.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-sospensione"
  },
  {
     "name":"Costanza LED",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/CostanzaLED_table_lamp.jpg/0cc588e3ccc36464337366cf2cf1d9d4.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-led-tavolo"
  },
  {
     "name":"Costanza Friends of Hue",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/terra_cover.jpg/8812b5d022831ef8d0dfe8d3e0da75e3.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-fiends-of-hue-terra"
  },
  {
     "name":"Costanza",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Costanza_terra_slide.jpg/ad2f3c017536b8fb10b6f7191e8f18fa.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-terra"
  },
  {
     "name":"Costanza LED",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/CostanzaLED_floor_lamp.jpg/2c39ca0f422e8ccd1a7ca427fc6026ea.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-led-terra"
  },
  {
     "name":"Costanza LED",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/costanzaLED_lamp_suspension_producthome.jpg/287b80fd617c5f52a6a2c64dc9f616a9.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-led-sospensione"
  },
  {
     "name":"Costanza Friends of Hue",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/TABLE_COVER.jpg/2504608cb669b257c290ce80077a616b.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanza-fiends-of-hue-tavolo"
  },
  {
     "name":"Costanzina",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Costanzina-d13s-product-cover.jpg/b8864348f6d06d85a5517c732e12a0f3.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanzina-sospensione"
  },
  {
     "name":"Costanzina",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/costanzina_lamp_table_producthome.jpg/ff49c4d0cb9826ed829e3072da8c6088.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanzina-tavolo"
  },
  {
     "name":"Costanzina",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/costanzinawall-product-cover.jpg/cde0e665fa4af75127c30d6a95c93b4f.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/costanzina-parete"
  },
  {
     "name":"Counterbalance floor",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/counterbalance_lamp_floor_producthome.jpg/418e07bf3bcf74793cdb00980d8829f2.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/counterbalance-floor-terra"
  },
  {
     "name":"Counterbalance spot",
     "category":[
        "Soffitto",
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/counterbalancespot-product-cover.jpg/fa26a7d37aa4a961006701f307801c0f.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/counterbalance-spot-parete"
  },
  {
     "name":"Counterbalance",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/counterbalance_lamp_wall_producthome.jpg/adb84ae373180a59d9eaaa6fc5d2b874.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/counterbalance-parete"
  },
  {
     "name":"Diade",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/diade-d93-product-cover-1499929153.jpg/7230467de54a67c90cea8af5bd2fea63.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/diade-sospensione"
  },
  {
     "name":"E04 ceiling",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/E04-product-cover-1500296037.jpg/1fc99e0ed9925cebe447a447ec681788.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/e04-ceiling-parete"
  },
  {
     "name":"E04 suspension",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/E04-product-cover-1501582403.jpg/854fc87c061e3c390a9d602ddbfb3318.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/e04-sospensione"
  },
  {
     "name":"E06",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/e06/ceiling-wall/E06-product-cover.jpg/039c2a0846bca16a143f1a18963ea63b.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/e06-parete"
  },
  {
     "name":"Farel",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cover_Farel-1531388717.jpg/ee4a06979474f6595ddddcd9138122e3.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/farel-sospensione"
  },
  {
     "name":"Fortebraccio",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33t-product-cover.jpg/a301b7826c9184b4ffd7f332d8950375.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/fortebraccio-terra"
  },
  {
     "name":"Fortebraccio",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33-product-cover.jpg/f3f23084921be83197ee21d273a3e504.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/fortebraccio-tavolo"
  },
  {
     "name":"Fortebraccio",
     "category":[
        "Soffitto",
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/forte_3-1506088601.jpg/d17ccdb4c0375806982b5980f310d4bf.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/fortebraccio-parete"
  },
  {
     "name":"Fortebraccio",
     "category":[
        "Parete",
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33Nsp60-product-cover.jpg/e7832df0b32bdf3cfe4eaf460392f822.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/fortebraccio-spot"
  },
  {
     "name":"Fortebraccio LED",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/fortebraccio-d33Nled-product-cover.jpg/4bf6df84593a29737fc68de1668cdef5.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/fortebraccio-led-tavolo"
  },
  {
     "name":"Garbì",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/garbi-product-cover.jpg/b266607192df3f499716922c5fa24f19.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/garbi-parete"
  },
  {
     "name":"GlassGlass",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/glassglass-d31-product-cover.jpg/ddd26da93fd750096a0741aff8a0f09f.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/glassglass-sospensione"
  },
  {
     "name":"Goggle",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/goggle-d52-product-cover.jpg/00093675a022a8a9f009863115f9010b.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/goggle-parete"
  },
  {
     "name":"Grande Costanza",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/grandecostanza-d13gs-product-cover.jpg/8a8ba81591fa321b43596fb868e09a43.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/grande-costanza-sospensione"
  },
  {
     "name":"Grande Costanza",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/grandecostanza-d13Gt-product-cover.jpg/68fd963bfdfc1de32f17e5071524d6b0.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/grande-costanza-terra"
  },
  {
     "name":"Grande Costanza Open Air",
     "category":[
        "Esterno"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/grandecostanzaopenair_lamp_floor_producthome_US.jpg/b6c9f03d77c8e5597ce78e3dd76238cf.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/grande-costanza-open-air-esterno"
  },
  {
     "name":"Honeycomb",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/honeycomb-d70-product-slider-1500295631.jpg/a909362c4047cfd73a27bb1e59c5136d.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/honeycomb-sospensione"
  },
  {
     "name":"Hope",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/hopeceiling-d66-product-cober.jpg/d9de2422b67770a91b7a75b971561f12.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/hope-soffitto"
  },
  {
     "name":"Hope",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/hope_lamp_floor_producthome_US.jpg/3dbaf1c99857c3cea892abb9fde9fad4.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/hope-terra"
  },
  {
     "name":"Hope",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/hopewall-d66-product-cover-1500295910.jpg/6f5fa4f35917df763e367924e54e31e1.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/hope-parete"
  },
  {
     "name":"Hope",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/hope-d66-product-cover.jpg/5da7103285af26e7db8df95825615279.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/hope-sospensione"
  },
  {
     "name":"Javelot Macro",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/javelot-macro/ceiling-wall/javelot-d54p-product-cover.jpg/0f0a08fc100d764c55b0a2e8b7770e79.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/javelot-macro-parete"
  },
  {
     "name":"Javelot Macro",
     "category":[
        "Esterno"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/javelotmacroterra-d54-product-cover.jpg/7ecc21e8cad5c34c9f0bf7dd7ad9eaa2.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/javelot-macro-1-esterno"
  },
  {
     "name":"Lady Costanza",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/ladycostanza_lamp_table_producthome.jpg/92963ffb3be468d5b1bb492b054e8248.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lady-costanza-terra"
  },
  {
     "name":"Lady Costanza",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/ladycostanza_lamp_suspension_producthome.jpg/8b964278ecebfb30fa62c58575ea8396.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lady-costanza-sospensione"
  },
  {
     "name":"Lady Costanza",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/ladycostanza_lamp_wall_producthome.jpg/0969b8188d6434cf21f657403b853d48.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lady-costanza-parete"
  },
  {
     "name":"Lane",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/lane-d64-product-cover.jpg/c8322b3bc4b5e0a2f0ce64752723dddb.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lane-parete"
  },
  {
     "name":"LightDisc",
     "category":[
        "Soffitto",
        "Parete",
        "Esterno",
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/lightdisc-d41-product-cover.jpg/f58a0d150f6ffd1d506df822f46b3938.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lightdisc-parete"
  },
  {
     "name":"Lita",
     "category":[
        "Soffitto",
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cover_Lita_wall.jpg/1f5f849ed3ce35b46578a8d2aa7973a4.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lita-wall"
  },
  {
     "name":"Lita",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cover_Lita_table.jpg/4082e67bf716421e2f252369d30aa089.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lita"
  },
  {
     "name":"Lita",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cover_LIta_susp.jpg/c58f84cf8155316a6bdbbfe1e82508e9.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lita-suspension"
  },
  {
     "name":"Lita",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cover_LIta_floor.jpg/88e291e30126e6dcaad706a9b172d393.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lita-floor"
  },
  {
     "name":"Lola",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/lola/ceiling-wall/white-thumb.jpg/4374739dbcbeb7aeceb024b91f48ba93.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lola-parete"
  },
  {
     "name":"Lola",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/lola-d15-product-cover.jpg/cff3292ffa4bddcbabf0241cde9447eb.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/lola-terra"
  },
  {
     "name":"Mesh Plafone",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Mesh_plafone_nero.jpg/d0832d23d4187b4dccbec5f8cb4d2a0e.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/mesh-ceiling"
  },
  {
     "name":"Mesh",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Mesh_rosone_nero.jpg/3728e3fb9eab21a052c7e7478296f98b.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/mesh-sospensione"
  },
  {
     "name":"Mesh wireless",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Mesh_cover.jpg/57badec53736a025f1a421cfeb2c6487.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/mesh-wireless"
  },
  {
     "name":"Metropoli",
     "category":[
        "Soffitto",
        "Parete",
        "Esterno"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/metropoli_lamp_wall_producthome.jpg/88b01dd4b4867882cb2af4c16ae3a7cd.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/metropoli-parete"
  },
  {
     "name":"E08 Mini mini",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/MiniMini_1-1519036791.jpg/30c23508c7c614dfe18e73d35e9e486c.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/mini-mini-sospensione"
  },
  {
     "name":"Miranda",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Miranda-d60-product-cover.jpg/e41a4f73a66daeae8e7775035670dc36.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/miranda-tavolo"
  },
  {
     "name":"Mirandolina",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Mirandolina-d66pi-product-cover.jpg/0515c66488cc22c3baf6bba729cfb9c3.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/mirandolina-tavolo"
  },
  {
     "name":"Nothing",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Nothing-d75-product-cover.jpg/98decd2eb28ceff320627e31073739dc.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/nothing-terra"
  },
  {
     "name":"Otto Watt",
     "category":[
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Ottowatt-d72a-product-cover.jpg/bf13f49161f7ffcfb26c10bb405f55cc.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/otto-watt-parete"
  },
  {
     "name":"Otto Watt",
     "category":[
        "Tavolo"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Ottowatt-d72-product-cover.jpg/31d3da75b1013b217adb9844379ab142.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/otto-watt-tavolo"
  },
  {
     "name":"Plissé",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Plisse-d62-product-cover.jpg/0f7e847ef0eb96996af33d2c8e3e3664.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/plisse-sospensione"
  },
  {
     "name":"Pod Lens",
     "category":[
        "Esterno"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Podlens-d30-product-slider.jpg/02ff8bde8b244565e93c4f4d4f012dd0.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/pod-lens-esterno"
  },
  {
     "name":"Pétale",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/petale-d71-product-cover-1501582425.jpg/fea42e332f95d10863f9f64e0172c4b6.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/petale-sospensione"
  },
  {
     "name":"Pétale RGB/DMX (for Americas only)",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/cover.jpg/52ff382e63cb397c8d359940715fa9a8.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/petale-rgbdmx-for-americas-only"
  },
  {
     "name":"Silenzio",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/silenzio_lamp_suspension_producthome.jpg/f87177690cef3dbd4dce5bcfa30ae036.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/silenzio-sospensione"
  },
  {
     "name":"Sky",
     "category":[
        "Esterno",
        "Parete",
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/COVER-SKY.jpg/a5d05d1df65b4621d2762e7d4e38cf6e.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/sky-terra"
  },
  {
     "name":"Soleil Noir",
     "category":[
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/SoleilNoir-d89p-product-cover.jpg/46bf278865deebd987350fc29bb1afbd.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/soleil-noir-parete"
  },
  {
     "name":"Soleil Noir",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/SoleilNoir-d89s-product-cover.jpg/4d2b9ccfca68bb15506591ae6bc8148b.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/soleil-noir-sospensione"
  },
  {
     "name":"Stochastic",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Stochastic-d87-product-cover.jpg/a717e9ad066ad3a8d415e330153ae0e3.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/stochastic-sospensione"
  },
  {
     "name":"Strip",
     "category":[
        "Parete",
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/stip-d22-product-cover-1499178940.jpg/ac8a97e95aaf62a5259ac440c7beb3aa.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/strip-1-parete"
  },
  {
     "name":"Synapse (for Americas only)",
     "category":[
        "Soffitto",
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Cover-1518016607.jpg/dce9a52b567c66218f3829a8445d0328.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/synapse-parete"
  },
  {
     "name":"Synapse (for Americas only)",
     "category":[
        "Sospensione",
        "Soffitto"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/synapse-d74-product-cover.jpg/01c008f8a3fcd513b495b75608b60527.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/synapse-sospensione"
  },
  {
     "name":"Tango",
     "category":[
        "Terra"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Tango-d77-product-cover.jpg/c7293cd9080c683f030dc06b115bf0bd.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/tango-terra"
  },
  {
     "name":"Titania",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/Titania-d17-product-cover.jpg/cba54565b2c98d392f9d46d3ce669056.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/titania-sospensione"
  },
  {
     "name":"Queen Titania",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/QueenTitania-d17q-product-slider.jpg/ef4afc609c419b1720e24b31a9199030.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/queen-titania-sospensione"
  },
  {
     "name":"Trama",
     "category":[
        "Sospensione"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/trama_lamp_suspension_productpage.jpg/a3e566f2bd817e93d52a480c9cdd4f78.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/trama-sospensione"
  },
  {
     "name":"Trama",
     "category":[
        "Soffitto",
        "Parete"
     ],
     "prod_pic":"https://www.luceplan.com/it/img/containers/main/products/trama-d14-product-cover.jpg/8e8ec3043cee135fba16d9c635bc8a6f.jpg",
     "prod_page":"https://www.luceplan.com/it/prodotti/trama-parete"
  }
];


// da un successivo excell luceplan sistemato da Monica sono emersi altri prodotti
var alcuni_aggiunti_a_mano =[
  {
      "name": "Curl",
      "category": [
        "Tavolo"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/curl-d76-thumb-1498213503.jpg/1695989ce6ffc125f967e11f33813036.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/curl-tavolo"
   },
   {
      "name": "Ecran",
      "category": [
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/ecran_lamp_light_wall_thumb.jpg/c22332613ac5bbc9660559916fb5b2ef.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/ecran-ineout-parete"
   },
   {
      "name": "Hope Friends of Hue",
      "category": [
        "Sospensione"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/Thumb_FOH.jpg/2ecadc009410d4fce6dc5d44513b7285.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/hope-friends-of-hue"
   },
   {
      "name": "Illusione",
      "category": [
        "Soffitto",
        "Parete"
      ],
      "prod_pic": "https://www.luceplan.com/it/img/containers/main/products/illusion-d80-thumb.jpg/3e4fa5324c5978102474f5d5212597e6.jpg",
      "prod_page": "https://www.luceplan.com/it/prodotti/illusion-parete"
   },

    
  ]

 arr_all_products = arr_all_products.concat(alcuni_aggiunti_a_mano)






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
          name: $(this).html().toUpperCase(),
          light_schema: "http://www.luceplan.com"+light_schema,
          data : data,
        })
      })
      

      /* video */
      var video = $body.find(".embed-container").find("iframe").attr("src");

      /* website item name */
      var website_name = $body.find("#product-title").text().trim();
      
      await browser.close();
      index++;

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



