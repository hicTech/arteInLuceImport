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


// questo è l'array di tutti gli oggetti pagina devi copiarlo/incollarlo da assets_json.json
var single_pages = [

    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/agave/",
        "model": "AGAVE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Agave.jpg",
            "http://www.panzeri.it//media/FFS/Agave-3.jpg",
            "http://www.panzeri.it//media/FFS/Agave-4.jpg",
            "http://www.panzeri.it//media/FFS/Agave-8.jpg",
            "http://www.panzeri.it//media/FFS/Agave-9.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/agave/l03001.050.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/agave/l03001.070.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/agave/l03001.090.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/agave/p03001.050.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/aldecimo/",
        "model": "ALDECIMO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Aldecimo_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Aldecimo_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Aldecimo_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Aldecimo_gallery4.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/aldecimo/x02201.030.0112/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/app/",
        "model": "APP",
        "projects": [
            "http://www.panzeri.it//media/FFS/APP-4.jpg",
            "http://www.panzeri.it//media/FFS/app-5.jpg",
            "http://www.panzeri.it//media/FFS/App-1.jpg",
            "http://www.panzeri.it//media/FFS/App-2.jpg",
            "http://www.panzeri.it//media/FFS/app-3.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/app/a09801.001.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/app/a09819.001.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/app/a09830.001.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/app/a09801.002.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/app/a09819.002.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/app/a09830.002.0106/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/blanca/",
        "model": "BLANCA",
        "projects": [
            "http://www.panzeri.it//media/FFS/Blanca-1.jpg",
            "http://www.panzeri.it//media/FFS/Blanca.jpg",
            "http://www.panzeri.it//media/FFS/Blanca-4.jpg",
            "http://www.panzeri.it//media/FFS/Blanca-2.jpg",
            "http://www.panzeri.it//media/FFS/Blanca-5.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/blanca/l05710.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/blanca/l05744.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/blanca/l05710.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/blanca/l05744.060.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/brooklyn line/",
        "model": "BROOKLYN LINE",
        "projects": [
            "http://www.panzeri.it//media/FFS/ventitrentatre_slider_NEW.jpg",
            "http://www.panzeri.it//media/FFS/ventitrentatre_copertina.jpg",
            "http://www.panzeri.it//media/FFS/Ventitrentatre.jpg",
            "http://www.panzeri.it//media/FFS/Ventitrentatre-3.jpg",
            "http://www.panzeri.it//media/FFS/Ventitrentare-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23301.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23302.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23301.150.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23302.150.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/brooklyn round/",
        "model": "BROOKLYN ROUND",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery4.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery5.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery6.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery7.j"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23201.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23202.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23219.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23101.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23102.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23119.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23101.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23102.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23119.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23201.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23202.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/l23219.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23201.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23202.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23219.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23101.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23102.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23119.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23101.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23102.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23119.360.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23201.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23202.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20round/p23219.180.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/candle/",
        "model": "CANDLE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Candle.jpg",
            "http://www.panzeri.it//media/FFS/Candle-1.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/candle/m09501.000.0110/",
            "http://www.panzeri.it/prodotti/design/indoor/candle/l09501.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/candle/l09501.000.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/candle/m09501.000.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/carmen/",
        "model": "CARMEN",
        "projects": [
            "http://www.panzeri.it//media/FFS/Carmen-2.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-2-bracci-4.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-3.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-5.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-6.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/carmen/p06401.002.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/carmen/p06402.002.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/carmen/p06401.003.0103/",
            "http://www.panzeri.it/prodotti/design/indoor/carmen/p06402.003.0103/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/carmencita/",
        "model": "CARMENCITA",
        "projects": [
            "http://www.panzeri.it//media/FFS/Carmen-2.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-2-bracci-4.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-3.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-5.jpg",
            "http://www.panzeri.it//media/FFS/Carmen-6.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/carmencita/a06401.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/carmencita/a06402.000.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/classic/",
        "model": "CLASSIC",
        "projects": [
            "http://www.panzeri.it//media/FFS/Classic.jpg",
            "http://www.panzeri.it//media/FFS/Classic-2.jpg",
            "http://www.panzeri.it//media/FFS/Classic-3.jpg",
            "http://www.panzeri.it//media/FFS/Classic-4.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/classic/t02420.002.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/t02422.002.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/c02420.001.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/c02422.001.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/c02420.002.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/c02422.002.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/a02420.001.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/a02422.001.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/a02420.002.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/a02422.002.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/classic/za02420.002.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/clio/",
        "model": "CLIO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (1).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (3).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (2).jpg",
            "http://www.panzeri.it//media/FFS/clio_slider_01_new.jpg",
            "http://www.panzeri.it//media/FFS/clio_slider_02_new.jpg",
            "http://www.panzeri.it//media/FFS/clio_slider_03_new.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (4).jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09451.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09452.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09453.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09454.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09455.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09456.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09457.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09471.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09472.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09473.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09474.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09475.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09476.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/l09477.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09451.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09452.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09453.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09454.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09455.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09456.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09457.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09471.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09472.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09473.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09474.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09475.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09476.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/clio/m09477.000.0200/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/cross/",
        "model": "CROSS",
        "projects": [
            "http://www.panzeri.it//media/FFS/Cross-3.jpg",
            "http://www.panzeri.it//media/FFS/Cross.jpg",
            "http://www.panzeri.it//media/FFS/Cross-2.jpg",
            "http://www.panzeri.it//media/FFS/CROSS_30.jpg",
            "http://www.panzeri.it//media/FFS/CROSS_60.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04901.030.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04919.030.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04921.030.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04901.030.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04919.030.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04921.030.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04901.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04919.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04921.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04901.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04919.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/cross/a04921.060.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/disco/",
        "model": "DISCO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Disco.jpg",
            "http://www.panzeri.it//media/FFS/Disco_2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/disco/p06601.030.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/disco/p06601.040.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/disco/p06601.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/disco/p06601.040.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/disco/p06601.050.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/disco/p06601.030.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/domino/",
        "model": "DOMINO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Domino-1.jpg",
            "http://www.panzeri.it//media/FFS/Domino-20.jpg",
            "http://www.panzeri.it//media/FFS/Domino-21.jpg",
            "http://www.panzeri.it//media/FFS/Domino-191.jpg",
            "http://www.panzeri.it//media/FFS/Domino-Rame.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/domino/l09031.011.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/l09033.011.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/l09031.014.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/l09033.014.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09033.004.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09038.004.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09033.009.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09038.009.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09031.011.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09033.011.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09031.014.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/p09033.014.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/domino/zp09033.014.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/elle/",
        "model": "ELLE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Elle.jpg",
            "http://www.panzeri.it//media/FFS/Elle__1.jpg",
            "http://www.panzeri.it//media/FFS/Elle-1.jpg",
            "http://www.panzeri.it//media/FFS/Elle-2.jpg",
            "http://www.panzeri.it//media/FFS/Elle-4.jpg",
            "http://www.panzeri.it//media/FFS/Elle-6.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/elle/p05001.002.0011/",
            "http://www.panzeri.it/prodotti/design/indoor/elle/p05101.002.0011/",
            "http://www.panzeri.it/prodotti/design/indoor/elle/p05001.001.0011/",
            "http://www.panzeri.it/prodotti/design/indoor/elle/p05101.001.0011/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/emma/",
        "model": "EMMA",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (4).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (1).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (3).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (2).jpg",
            "http://www.panzeri.it//media/FFS/emma_home_4_new.jpg",
            "http://www.panzeri.it//media/FFS/emma_slider_03_new.jpg",
            "http://www.panzeri.it//media/FFS/emma_slider_04_new.jpg",
            "http://www.panzeri.it//media/FFS/emma_slider_05_new.jpg",
            "http://www.panzeri.it//media/FFS/emma_slider_06_new"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09151.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09152.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09153.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09154.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09155.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09156.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09157.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09171.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09172.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09173.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09174.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09175.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09176.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/l09177.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09151.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09152.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09153.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09154.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09155.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09156.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09157.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09171.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09172.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09173.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09174.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09175.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09176.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/emma/m09177.000.0200/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/flat/",
        "model": "FLAT",
        "projects": [
            "http://www.panzeri.it//media/FFS/Flat.jpg",
            "http://www.panzeri.it//media/FFS/Flat-2.jpg",
            "http://www.panzeri.it//media/FFS/Flat-4.jpg",
            "http://www.panzeri.it//media/FFS/Flat-5.jpg",
            "http://www.panzeri.it//media/FFS/Flat-6.jpg",
            "http://www.panzeri.it//media/FFS/Flat-parete.jpg",
            "http://www.panzeri.it//media/FFS/Flat-parete-sopra.jpg",
            "http://www.panzeri.it//media/FFS/Flat-parete-sotto.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/flat/l07501.051.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/flat/p07501.038.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/flat/p07501.051.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/flat/a07501.038.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/flat/x07501.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/flat/x07501.060.0107/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/floral/",
        "model": "FLORAL",
        "projects": [
            "http://www.panzeri.it//media/FFS/Floral.jpg",
            "http://www.panzeri.it//media/FFS/Floral-2.jpg",
            "http://www.panzeri.it//media/FFS/Floral-3.jpg",
            "http://www.panzeri.it//media/FFS/Floral-4.jpg",
            "http://www.panzeri.it//media/FFS/Floral-5.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/floral/c01322.040.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/floral/c01322.060.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/floral/l01322.040.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/floral/l01322.060.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/giano/",
        "model": "GIANO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery4.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery5.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery6.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery7.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery8.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery9.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24647.200.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24649.200.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24647.150.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24649.150.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24647.150.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24649.150.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24647.200.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/l24649.200.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.150.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.150.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24646.150.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/giano/a24648.150.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/gilbert/",
        "model": "GILBERT",
        "projects": [
            "http://www.panzeri.it//media/FFS/gilbert.jpg",
            "http://www.panzeri.it//media/FFS/Gilbert-1.jpg",
            "http://www.panzeri.it//media/FFS/Gilbert-2.jpg",
            "http://www.panzeri.it//media/FFS/Gilbert-3.jpg",
            "http://www.panzeri.it//media/FFS/Gilbert-5.jpg",
            "http://www.panzeri.it//media/FFS/gilbert-6.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/c06501.022.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/l06501.022.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/l06501.037.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/l06501.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/l06501.037.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/l06501.045.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/l06501.022.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/p06501.037.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/p06501.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/p06501.037.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/p06501.045.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/gilbert/zp06501.045.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/golden ring/",
        "model": "GOLDEN RING",
        "projects": [
            "http://www.panzeri.it//media/FFS/slider_golden_ring_01.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_02.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_03.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_04.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_05.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_06.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_07.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_08.jpg",
            "http://www.panzeri.it//media/FFS/slider_golden_ring_09.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08101.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08102.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08121.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08101.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08102.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08121.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08101.300.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08102.300.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08121.300.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08101.080.0108/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08102.080.0108/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08121.080.0108/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08101.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08102.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/golden%20ring/l08121.080.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/jackie/",
        "model": "JACKIE",
        "projects": [
            "http://www.panzeri.it//media/FFS/jackie_01.jpg",
            "http://www.panzeri.it//media/FFS/jackie_05.jpg",
            "http://www.panzeri.it//media/FFS/jackie_10.jpg",
            "http://www.panzeri.it//media/FFS/jackie_24.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-by-Panzeri-2_ok.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-by-Panzeri-3_ok.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-by-Panzeri-6_ok.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/jackie/t07701.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/t07702.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/t07703.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/t07730.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/c07701.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/c07702.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/c07703.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/c07719.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/c07730.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cm07701.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cm07702.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cm07703.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cm07730.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cp07701.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cp07702.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cp07703.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/cp07730.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/p07701.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/p07702.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/p07703.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/p07730.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/a07701.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/a07702.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/a07703.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/a07730.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/ca07701.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/ca07702.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/ca07703.000.0409/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie/ca07730.000.0409/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/jackie iot/",
        "model": "JACKIE IOT",
        "projects": [
            "http://www.panzeri.it//media/FFS/jackie_01.jpg",
            "http://www.panzeri.it//media/FFS/jackie_05.jpg",
            "http://www.panzeri.it//media/FFS/jackie_10.jpg",
            "http://www.panzeri.it//media/FFS/jackie_24.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-by-Panzeri-2_ok.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-by-Panzeri-3_ok.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-by-Panzeri-6_ok.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/t07701.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/t07702.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/t07703.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/t07730.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/c07701.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/c07702.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/c07703.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/c07730.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cm07701.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cm07702.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cm07703.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cm07730.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cp07701.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cp07702.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cp07703.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/cp07730.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/a07701.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/a07702.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/a07703.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/a07730.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/ca07701.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/ca07702.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/ca07703.000.0413/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20iot/ca07730.000.0413/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/jackie spot/",
        "model": "JACKIE SPOT",
        "projects": [
            "http://www.panzeri.it//media/FFS/jackie-spot.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-Spot-Binario.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-Spot-binario-multicolor.jpg",
            "http://www.panzeri.it//media/FFS/Jackie-Spot-binario-titanio.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20spot/b07701.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20spot/b07702.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20spot/b07703.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jackie%20spot/b07730.000.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/jazz/",
        "model": "JAZZ",
        "projects": [
            "http://www.panzeri.it//media/FFS/Jazz.jpg",
            "http://www.panzeri.it//media/FFS/Jazz_3.jpg",
            "http://www.panzeri.it//media/FFS/Jazz-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/jazz/m08901.000.0110/",
            "http://www.panzeri.it/prodotti/design/indoor/jazz/l08901.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/jazz/l08901.000.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/jazz/m08901.000.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/kubik/",
        "model": "KUBIK",
        "projects": [
            "http://www.panzeri.it//media/FFS/Kubik-2.jpg",
            "http://www.panzeri.it//media/FFS/Kubik-4.jpg",
            "http://www.panzeri.it//media/FFS/Kubik-5.jpg",
            "http://www.panzeri.it//media/FFS/Kubik-41.jpg",
            "http://www.panzeri.it//media/FFS/Kubik-LED.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/kubik/c07001.014.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/c07001.011.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/l07001.014.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/l07001.011.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/a07001.014.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/a07001.011.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/a07001.011.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/kubik/a07001.014.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/line/",
        "model": "LINE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Line-1.jpg",
            "http://www.panzeri.it//media/FFS/Line-3.jpg",
            "http://www.panzeri.it//media/FFS/Line-4.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/line/t03601.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/line/t03602.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/line/t03619.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/line/t03621.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/line/t03630.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/line/l03601.000.0100/",
            "http://www.panzeri.it/prodotti/design/indoor/line/l03602.000.0100/",
            "http://www.panzeri.it/prodotti/design/indoor/line/l03619.000.0100/",
            "http://www.panzeri.it/prodotti/design/indoor/line/l03621.000.0100/",
            "http://www.panzeri.it/prodotti/design/indoor/line/l03630.000.0100/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/olivia/",
        "model": "OLIVIA",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (1).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (3).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (2).jpg",
            "http://www.panzeri.it//media/FFS/clio_slider_01_new.jpg",
            "http://www.panzeri.it//media/FFS/clio_slider_02_new.jpg",
            "http://www.panzeri.it//media/FFS/clio_slider_03_new.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri - Emma Clio Olivia (4).jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09751.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09752.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09753.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09754.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09755.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09756.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09757.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09771.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09772.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09773.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09774.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09775.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09776.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/l09777.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09751.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09752.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09753.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09754.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09755.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09756.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09757.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09771.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09772.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09773.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09774.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09775.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09776.000.0200/",
            "http://www.panzeri.it/prodotti/design/indoor/olivia/m09777.000.0200/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/one/",
        "model": "ONE",
        "projects": [
            "http://www.panzeri.it//media/FFS/one.jpg",
            "http://www.panzeri.it//media/FFS/One-1.jpg",
            "http://www.panzeri.it//media/FFS/One-2.jpg",
            "http://www.panzeri.it//media/FFS/One-3.jpg",
            "http://www.panzeri.it//media/FFS/One-4.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/one/l03701.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03702.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03717.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03719.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03721.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03701.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03702.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03717.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03719.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/l03721.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03701.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03702.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03717.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03719.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03721.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03701.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03702.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03717.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03719.000.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/one/p03721.000.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/planet ring/",
        "model": "PLANET RING",
        "projects": [
            "http://www.panzeri.it//media/FFS/slider_planet_ring_01.jpg",
            "http://www.panzeri.it//media/FFS/slider_planet_ring_02.jpg",
            "http://www.panzeri.it//media/FFS/slider_planet_ring_03.jpg",
            "http://www.panzeri.it//media/FFS/slider_planet_ring_04.jpg",
            "http://www.panzeri.it//media/FFS/slider_planet_ring_05.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/l08301.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/l08301.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/l08301.100.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/l08301.070.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/l08301.070.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/l08301.070.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.100.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.040.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.040.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.040.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.070.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.070.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/p08301.070.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.100.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.040.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.040.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.040.0107/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.070.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.070.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/planet%20ring/x08301.070.0107/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/silver ring/",
        "model": "SILVER RING",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri Silver Ring (2).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Silver Ring (1).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Silver Ring (3).jpg",
            "http://www.panzeri.it//media/FFS/silver_ring_slider_01.jpg",
            "http://www.panzeri.it//media/FFS/silver_ring_slider_02.jpg",
            "http://www.panzeri.it//media/FFS/silver_ring_slider_03.jpg",
            "http://www.panzeri.it//media/FFS/silver_ring_slider_04.jpg",
            "http://www.panzeri.it//media/FFS/silver_ring_slider_05.jpg",
            "http://www.panzeri.it//media/FFS/silver_ring_slider_06.jpg",
            "http://www.panzeri.it//media/FFS/silver"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08201.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08202.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08217.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08221.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08201.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08202.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08217.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08221.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08201.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08202.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08217.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08221.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08201.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08202.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08217.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/l08221.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08201.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08202.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08217.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08221.180.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08201.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08202.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08217.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08221.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08201.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08202.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08217.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08221.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08201.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08202.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08217.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/silver%20ring/p08221.120.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/tate/",
        "model": "TATE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Tate.jpg",
            "http://www.panzeri.it//media/FFS/Tate-2.jpg",
            "http://www.panzeri.it//media/FFS/Tate-2-2.jpg",
            "http://www.panzeri.it//media/FFS/Tate-3.jpg",
            "http://www.panzeri.it//media/FFS/Tate-4.jpg",
            "http://www.panzeri.it//media/FFS/Tate-satinato.jpg",
            "http://www.panzeri.it//media/FFS/Tate-satinato-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/tate/y-tat-6l-bla/",
            "http://www.panzeri.it/prodotti/design/indoor/tate/y-tat-6l-whi/",
            "http://www.panzeri.it/prodotti/design/indoor/tate/y-tat-8l-bla/",
            "http://www.panzeri.it/prodotti/design/indoor/tate/y-tat-8l-whi/",
            "http://www.panzeri.it/prodotti/design/indoor/tate/y-tat-2a-bla/",
            "http://www.panzeri.it/prodotti/design/indoor/tate/y-tat-2a-whi/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/three/",
        "model": "THREE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Three.jpg",
            "http://www.panzeri.it//media/FFS/Three-2.jpg",
            "http://www.panzeri.it//media/FFS/Three-3.jpg",
            "http://www.panzeri.it//media/FFS/THREE-XL.jpg",
            "http://www.panzeri.it//media/FFS/Three-XL-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/three/p03901.011.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03902.011.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03917.011.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03919.011.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03901.015.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03902.015.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03917.015.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/three/p03919.015.0106/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/to-be/",
        "model": "TO-BE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery4.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery5.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery6.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery7.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_To_Be_gallery8.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02701.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02704.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02717.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02719.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02721.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02501.085.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02504.085.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02517.085.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02519.085.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02521.085.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02501.085.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02504.085.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02517.085.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02519.085.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02521.085.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02601.065.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02604.065.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02617.065.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02619.065.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/m02621.065.0510/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02601.065.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02604.065.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02617.065.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02619.065.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/l02621.065.0501/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/p02701.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/p02704.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/p02717.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/p02719.045.1701/",
            "http://www.panzeri.it/prodotti/design/indoor/to-be/p02721.045.1701/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/toy/",
        "model": "TOY",
        "projects": [
            "http://www.panzeri.it//media/FFS/Toy.jpg",
            "http://www.panzeri.it//media/FFS/Toy-8.jpg",
            "http://www.panzeri.it//media/FFS/Toy-9.jpg",
            "http://www.panzeri.it//media/FFS/Toy-10.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.045.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.045.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.045.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.045.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.045.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.045.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.045.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.090.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.090.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.090.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.090.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.090.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.090.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01617.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01619.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.090.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01601.007.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01621.007.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01637.007.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/toy/a01639.007.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/toy gypso/",
        "model": "TOY GYPSO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Toy-Gypso.jpg",
            "http://www.panzeri.it//media/FFS/Toy-Gypso-2.jpg",
            "http://www.panzeri.it//media/FFS/Toy-Gypso-3.jpg",
            "http://www.panzeri.it//media/FFS/Toy-gypso-4.jpg",
            "http://www.panzeri.it//media/FFS/toy-tutte-misure.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/toy%20gypso/a01642.025.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy%20gypso/a01642.025.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/toy%20gypso/a01642.060.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/toy%20gypso/a01642.060.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/twister/",
        "model": "TWISTER",
        "projects": [
            "http://www.panzeri.it//media/FFS/Twister-2.jpg",
            "http://www.panzeri.it//media/FFS/Twister.jpg",
            "http://www.panzeri.it//media/FFS/Twister-1.jpg",
            "http://www.panzeri.it//media/FFS/Twister-4.jpg",
            "http://www.panzeri.it//media/FFS/Twister-3.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/twister/t06730.000.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/twister/c06730.050.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/twister/c06730.035.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/twister/l06730.050.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/twister/a06730.050.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/twister/a06730.035.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/two/",
        "model": "TWO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Two-6.jpg",
            "http://www.panzeri.it//media/FFS/Two-4.jpg",
            "http://www.panzeri.it//media/FFS/Two-2.jpg",
            "http://www.panzeri.it//media/FFS/Two-1.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/two/l03801.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/l03802.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/l03817.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/l03819.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/l03821.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/p03801.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/p03802.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/p03817.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/p03819.000.0106/",
            "http://www.panzeri.it/prodotti/design/indoor/two/p03821.000.0106/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/viisi/",
        "model": "VIISI",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Viisi_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Viisi_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Viisi_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Viisi_gallery4.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Viisi_gallery5.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Viisi_gallery6.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/viisi/t02001.210.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/t02002.210.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02001.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02002.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/zl02002.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02101.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02102.120.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02001.210.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02002.210.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02101.210.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/viisi/l02102.210.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/viki/",
        "model": "VIKI",
        "projects": [
            "http://www.panzeri.it//media/FFS/Viki_soffitto.jpg",
            "http://www.panzeri.it//media/FFS/Viki-6.jpg",
            "http://www.panzeri.it//media/FFS/Viki-7.jpg",
            "http://www.panzeri.it//media/FFS/Viki-8.jpg",
            "http://www.panzeri.it//media/FFS/Viki-9.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/viki/l04101.055.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/viki/l04101.075.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/viki/p04101.055.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/viki/p04101.075.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/willy/",
        "model": "WILLY",
        "projects": [
            "http://www.panzeri.it//media/FFS/Willy.jpg",
            "http://www.panzeri.it//media/FFS/Willy-2.jpg",
            "http://www.panzeri.it//media/FFS/Willy-3.jpg",
            "http://www.panzeri.it//media/FFS/Willy-5.jpg",
            "http://www.panzeri.it//media/FFS/Willy-15.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07631.060.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07633.060.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07610.060.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07621.060.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07631.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07633.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07633.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07631.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07633.100.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07621.100.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07631.100.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07631.040.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07631.050.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07633.040.0000/",
            "http://www.panzeri.it/prodotti/design/indoor/willy/l07633.050.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/ypsilon/",
        "model": "YPSILON",
        "projects": [
            "http://www.panzeri.it//media/FFS/Ypsilon.jpg",
            "http://www.panzeri.it//media/FFS/Ypsilon_slider.jpg",
            "http://www.panzeri.it//media/FFS/Ypsilon-2.jpg",
            "http://www.panzeri.it//media/FFS/Ypsilon-3.jpg",
            "http://www.panzeri.it//media/FFS/ypsilon-A7222OUTpag90.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/a07201.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/a07202.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/a07217.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/a07219.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/a07222.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/x07201.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/x07202.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/x07217.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/x07219.000.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/ypsilon/x07222.000.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/zero/",
        "model": "ZERO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Zeroled-2 (1).jpg",
            "http://www.panzeri.it//media/FFS/Zeroled-2.jpg",
            "http://www.panzeri.it//media/FFS/Zeroled-5.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03501.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03517.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03519.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03521.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03522.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/za03522.050.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03501.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03517.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03519.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03521.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/zero/a03522.100.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/gong/",
        "model": "GONG",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri Gong (1).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Gong (2).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Gong (3).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Gong (4).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Gong.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/gong/l09301.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gong/l09302.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gong/l09321.060.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gong/l09301.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gong/l09302.100.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/gong/l09321.100.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/ginevra/",
        "model": "GINEVRA",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri Ginevra (1).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Ginevra (4).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Ginevra (2).jpg",
            "http://www.panzeri.it//media/FFS/Panzeri Ginevra (3).jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/l09280.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/l09281.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/l09280.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/l09281.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/p09280.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/p09281.050.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/p09280.080.0102/",
            "http://www.panzeri.it/prodotti/design/indoor/ginevra/p09281.080.0102/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/outdoor/box/",
        "model": "BOX",
        "projects": [
            "http://www.panzeri.it//media/FFS/Box-Q-bianco.jpg",
            "http://www.panzeri.it//media/FFS/Box-Q-bianco-frontale.jpg",
            "http://www.panzeri.it//media/FFS/Box-Q-bianco-laterale.jpg",
            "http://www.panzeri.it//media/FFS/Box-Q-nero.jpg",
            "http://www.panzeri.it//media/FFS/box-quadro.jpg",
            "http://www.panzeri.it//media/FFS/Box-T-bianco.jpg",
            "http://www.panzeri.it//media/FFS/Box-T-frontale.jpg",
            "http://www.panzeri.it//media/FFS/Box-T-nero.jpg",
            "http://www.panzeri.it//media/FFS/box-tondo.jpg",
            "http://www.panzeri.it//media/FFS/Box-T-profilo.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/outdoor/box/xq144-01/",
            "http://www.panzeri.it/prodotti/design/outdoor/box/xq144-02/",
            "http://www.panzeri.it/prodotti/design/outdoor/box/xr144-01/",
            "http://www.panzeri.it/prodotti/design/outdoor/box/xr144-02/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/outdoor/draco/",
        "model": "DRACO",
        "projects": [
            "http://www.panzeri.it//media/FFS/draco-EA-5401pag534.jpg",
            "http://www.panzeri.it//media/FFS/draco-EA-5401pag536.jpg",
            "http://www.panzeri.it//media/FFS/draco-EA-5433pag535.jpg",
            "http://www.panzeri.it//media/FFS/draco-EA-5444pag533.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/outdoor/draco/ea05401.000.0101/",
            "http://www.panzeri.it/prodotti/design/outdoor/draco/ea05433.000.0101/",
            "http://www.panzeri.it/prodotti/design/outdoor/draco/ea05444.000.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/outdoor/four/",
        "model": "FOUR",
        "projects": [
            "http://www.panzeri.it//media/FFS/four-pag120.jpg",
            "http://www.panzeri.it//media/FFS/four-pag539.jpg",
            "http://www.panzeri.it//media/FFS/four-pag540.jpg",
            "http://www.panzeri.it//media/FFS/four-pag541.jpg",
            "http://www.panzeri.it//media/FFS/four-pag542.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/outdoor/four/ep04401.000.0106/",
            "http://www.panzeri.it/prodotti/design/outdoor/four/ep04444.000.0106/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/outdoor/lampyris/",
        "model": "LAMPYRIS",
        "projects": [
            "http://www.panzeri.it//media/FFS/Lampyirs_1.jpg",
            "http://www.panzeri.it//media/FFS/Lampyirs_2.jpg",
            "http://www.panzeri.it//media/FFS/Lampyirs_3.jpg",
            "http://www.panzeri.it//media/FFS/LAMPyris_2.jpg",
            "http://www.panzeri.it//media/FFS/LAMPyris-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/outdoor/lampyris/et08044.000.0101/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/outdoor/potter/",
        "model": "POTTER",
        "projects": [
            "http://www.panzeri.it//media/FFS/potter-pag553.jpg",
            "http://www.panzeri.it//media/FFS/potter-pag554.jpg",
            "http://www.panzeri.it//media/FFS/potter-pag555.jpg",
            "http://www.panzeri.it//media/FFS/potter-pag557.jpg",
            "http://www.panzeri.it//media/FFS/potter-pag558.jpg",
            "http://www.panzeri.it//media/FFS/potter-rgb-pag556.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/outdoor/potter/et04201.000.0005/",
            "http://www.panzeri.it/prodotti/design/outdoor/potter/et04201.000.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/potter/t04201.000.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/design/outdoor/ralph/",
        "model": "RALPH",
        "projects": [
            "http://www.panzeri.it//media/FFS/Ralph-1.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-2.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-3.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-4.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-5.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-6.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-7.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-8.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-9.jpg",
            "http://www.panzeri.it//media/FFS/Ralph-9a.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/et04701.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/et04744.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/et04701.050.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/et04744.050.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/pe04701.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/pe04744.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/ec04701.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/ec04744.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/el04701.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/el04744.035.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/el04701.050.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/el04744.050.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/el04701.090.0000/",
            "http://www.panzeri.it/prodotti/design/outdoor/ralph/el04744.090.0000/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/broadway/",
        "model": "BROADWAY",
        "projects": [
            "http://www.panzeri.it//media/FFS/broadway_slider_01.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/broadway/xp2048track/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/",
        "model": "BROOKLYN",
        "projects": [
            "http://www.panzeri.it//media/FFS/XG2033.jpg",
            "http://www.panzeri.it//media/FFS/XG2033-2.jpg",
            "http://www.panzeri.it//media/FFS/xg2033-3.jpg",
            "http://www.panzeri.it//media/FFS/compo_XG2033_prisma.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-100track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-100track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-200track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-200track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-300track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-300track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-50track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn/xg2033-50track pr/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/brooklyn out/",
        "model": "BROOKLYN OUT",
        "projects": [
            "http://www.panzeri.it//media/FFS/XP2033-2.jpg",
            "http://www.panzeri.it//media/FFS/XP2033.jpg",
            "http://www.panzeri.it//media/FFS/compo_XP2033_big_prisma.jpg",
            "http://www.panzeri.it//media/FFS/compo_XP2033_prisma.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-100track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-100track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-200track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-200track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-300track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-300track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-50track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20out/xp2033-50track pr/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/brooklyn round/",
        "model": "BROOKLYN ROUND",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery4.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery5.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery6.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Brooklyn-Round_gallery7.j"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23201.360.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23101.090.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23201.045.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23101.180.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23201.090.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23101.360.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20round/xg23201.180.0099/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/brooklyn trim/",
        "model": "BROOKLYN TRIM",
        "projects": [
            "http://www.panzeri.it//media/FFS/brooklyn_trim_compo_XG2034_prisma.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn_trim_XG2034.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn-spot_P2033.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-100track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-100track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-200track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-200track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-300track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-300track pr/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-50track/",
            "http://www.panzeri.it/prodotti/architectural/profili/brooklyn%20trim/xg2034-50track pr/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/corner/",
        "model": "CORNER",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Corner_gallery1.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/corner/xg2045-100track/",
            "http://www.panzeri.it/prodotti/architectural/profili/corner/xg2045-200track/",
            "http://www.panzeri.it/prodotti/architectural/profili/corner/xg2045-300track/",
            "http://www.panzeri.it/prodotti/architectural/profili/corner/xg2045-50track/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/giano/",
        "model": "GIANO",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery3.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery4.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery5.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery6.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery7.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery8.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Giano_gallery9.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24646.050.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24648.050.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24646.100.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24648.100.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24646.200.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24648.200.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24646.300.0099/",
            "http://www.panzeri.it/prodotti/architectural/profili/giano/xp24648.300.0099/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/manhattan/",
        "model": "MANHATTAN",
        "projects": [
            "http://www.panzeri.it//media/FFS/Manhattan.jpg",
            "http://www.panzeri.it//media/FFS/Manhattan-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/manhattan/xg2044-100track/",
            "http://www.panzeri.it/prodotti/architectural/profili/manhattan/xg2044-200track/",
            "http://www.panzeri.it/prodotti/architectural/profili/manhattan/xg2044-300track/",
            "http://www.panzeri.it/prodotti/architectural/profili/manhattan/xg2044-50track/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/nolita/",
        "model": "NOLITA",
        "projects": [
            "http://www.panzeri.it//media/FFS/XG2038.jpg",
            "http://www.panzeri.it//media/FFS/compo_XG2038_prisma.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-60 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-60 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90 eco em/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-60/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-60 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120 eco em/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-150 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-150 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-150 eco em/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90 em/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120 em/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-150/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-150 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-120track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-150track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-240track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-60track jolly/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-60track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita/xg2038-90track/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/nolita out/",
        "model": "NOLITA OUT",
        "projects": [
            "http://www.panzeri.it//media/FFS/XP2038.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-60 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-60 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-90 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-90 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-60/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-60 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-120 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-120 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-150 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-150 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-90/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-90 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-120/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-120 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-150/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20out/xp2038-150 dali/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/nolita trim/",
        "model": "NOLITA TRIM",
        "projects": [
            "http://www.panzeri.it//media/FFS/XG2039.jpg",
            "http://www.panzeri.it//media/FFS/compo_XG2039_prisma.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-60 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-60 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-90 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-90 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-60/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-60 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-120 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-120 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-150 eco/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-150 eco dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-90/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-90 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-120/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-120 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-150/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-150 dali/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-120track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-150track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-240track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-60track jolly/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-60track/",
            "http://www.panzeri.it/prodotti/architectural/profili/nolita%20trim/xg2039-90track/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/profili/tribeca/",
        "model": "TRIBECA",
        "projects": [
            "http://www.panzeri.it//media/FFS/XG20361.jpg",
            "http://www.panzeri.it//media/FFS/compo_XG2036.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/profili/tribeca/xg2047track/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/joe/",
        "model": "JOE",
        "projects": [
            "http://www.panzeri.it//media/FFS/Joe-2.jpg",
            "http://www.panzeri.it//media/FFS/Joe-3.jpg",
            "http://www.panzeri.it//media/FFS/joe-4.jpg",
            "http://www.panzeri.it//media/FFS/Joe-black.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/joe/st.xa2115/",
            "http://www.panzeri.it/prodotti/architectural/incassi/joe/xa2115 bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/joe/xa2115/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/roy/",
        "model": "ROY",
        "projects": [
            "http://www.panzeri.it//media/FFS/roy.jpg",
            "http://www.panzeri.it//media/FFS/Roy-incasso.jpg",
            "http://www.panzeri.it//media/FFS/Roy-ottica.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/roy/xr255-43-3k/",
            "http://www.panzeri.it/prodotti/architectural/incassi/roy/xr255-43-4k/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/joe.q/",
        "model": "JOE.Q",
        "projects": [
            "http://www.panzeri.it//media/FFS/JOE-Q (1).jpg",
            "http://www.panzeri.it//media/FFS/joe-Q.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/joe.q/st.xa2116/",
            "http://www.panzeri.it/prodotti/architectural/incassi/joe.q/xa2116 bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/joe.q/xa2116/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/joe twist/",
        "model": "JOE TWIST",
        "projects": [
            "http://www.panzeri.it//media/FFS/Joe-Twist (1).jpg",
            "http://www.panzeri.it//media/FFS/joe-twist.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/joe%20twist/st.xa2117/",
            "http://www.panzeri.it/prodotti/architectural/incassi/joe%20twist/xa2117/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq0998/",
        "model": "XGQ0998",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ0998-pag613.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq0998/xgq0998/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq0998/nc xgq0998-gl/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq0998/xgq0998-gl/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq0999/",
        "model": "XGQ0999",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ0999.jpg",
            "http://www.panzeri.it//media/FFS/XGQ0999_120204.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq0999/xgq0999/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1000/",
        "model": "XGQ1000",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1000-1.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1000/xgq1000-1/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1004/",
        "model": "XGQ1004",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1004.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1004-2.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1004-3.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1004-45.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1004-GL-pag623.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1004/xgq1004/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1004/xgq1004-45/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1004/xgq1004-gl/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1015/",
        "model": "XGQ1015",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1015.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1015-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1015/xgq1015/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1019/",
        "model": "XGQ1019",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1019.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1019-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1019/xgq1019/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1025/",
        "model": "XGQ1025",
        "projects": [
            "http://www.panzeri.it//media/FFS/xgq1025_slide.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1025/xgq1025/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1026/",
        "model": "XGQ1026",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1026.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1026/xgq1026/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1031/",
        "model": "XGQ1031",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1031.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1031-2.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1031-3.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1031/xgq1031 led/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1032/",
        "model": "XGQ1032",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1032.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1032/xgq1032 led/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/",
        "model": "XGQ1034",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1034-1.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1034-2.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1034-2-2.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1034-3.jpg",
            "http://www.panzeri.it//media/FFS/XGQ1034-3-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-2 bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-2 whi/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-2c bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-2c whi/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-3 bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-3 whi/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-3c bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-3c whi/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-1 bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-1 whi/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-1c bla/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1034/xgq1034-1c whi/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1210/",
        "model": "XGQ1210",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1210.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1210/xgq1210 led dim/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1210/xgq1210 led/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgq1211/",
        "model": "XGQ1211",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGQ1211.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1211/xgq1211 led/",
            "http://www.panzeri.it/prodotti/architectural/incassi/xgq1211/xgq1211 led dim/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgr0997/",
        "model": "XGR0997",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGR0997.jpg",
            "http://www.panzeri.it//media/FFS/XGR0997-pag613.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgr0997/xgr0997/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgr1020/",
        "model": "XGR1020",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGR1020.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgr1020/xgr1020/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgr1021/",
        "model": "XGR1021",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGR1021.jpg",
            "http://www.panzeri.it//media/FFS/XGR1021-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgr1021/xgr1021/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgr1023/",
        "model": "XGR1023",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGR1023.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgr1023/xgr1023/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgr1024/",
        "model": "XGR1024",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGR1024.jpg",
            "http://www.panzeri.it//media/FFS/XGR1024-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgr1024/xgr1024/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xgr1027/",
        "model": "XGR1027",
        "projects": [
            "http://www.panzeri.it//media/FFS/XGR1027.jpg",
            "http://www.panzeri.it//media/FFS/XGR1027-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xgr1027/xgr1027/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/xsv2008/",
        "model": "XSV2008",
        "projects": [
            "http://www.panzeri.it//media/FFS/XSV2008.jpg",
            "http://www.panzeri.it//media/FFS/XSV2008-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/xsv2008/xsv2008 whi/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/queens in 60/",
        "model": "QUEENS IN 60",
        "projects": [
            "http://www.panzeri.it//media/FFS/FP-Queens_In-XR262.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/queens%20in%2060/xr26201.060.1715/",
            "http://www.panzeri.it/prodotti/architectural/incassi/queens%20in%2060/xr26201.060.2515/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/queens in 50 ip65/",
        "model": "QUEENS IN 50 IP65",
        "projects": [],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/queens%20in%2050%20ip65/xr22501.050.2515/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/incassi/queens in 40/",
        "model": "QUEENS IN 40",
        "projects": [],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/incassi/queens%20in%2040/xr25401.040.1815/",
            "http://www.panzeri.it/prodotti/architectural/incassi/queens%20in%2040/xr25401.040.2615/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/brooklyn spot/",
        "model": "BROOKLYN SPOT",
        "projects": [
            "http://www.panzeri.it//media/FFS/brooklyn_spot_intro.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn_spot_mov1.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn_spot_mov1_2.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn_spot_mov1_3.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn_spot_mov2.jpg",
            "http://www.panzeri.it//media/FFS/brooklyn_spot_vert.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/brooklyn%20spot/p2033 spot/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/brooklyn%20spot/p2033-01 spot/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/queens mini/",
        "model": "QUEENS MINI",
        "projects": [
            "http://www.panzeri.it//media/FFS/Panzeri_Queens-Mini_gallery1.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Queens-Mini_gallery2.jpg",
            "http://www.panzeri.it//media/FFS/Panzeri_Queens-Mini_gallery3.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20mini/xm748-9-01-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20mini/xm748-9-02-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20mini/xm748-12-01-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20mini/xm748-12-02-3k/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/queens spot/",
        "model": "QUEENS SPOT",
        "projects": [
            "http://www.panzeri.it//media/FFS/queens-spot.jpg",
            "http://www.panzeri.it//media/FFS/queens-spot2.jpg",
            "http://www.panzeri.it//media/FFS/queens-spot3.jpg",
            "http://www.panzeri.it//media/FFS/Perfetto-230-composizione-binario-bianco_R.jpg",
            "http://www.panzeri.it//media/FFS/Queens-Spot-Bianco.jpg",
            "http://www.panzeri.it//media/FFS/Queens-Spot-Movimento.jpg",
            "http://www.panzeri.it//media/FFS/Queens-Spot-Nero.jpg",
            "http://www.panzeri.it//media/FFS/Queens-Spot-Nero-con-driver.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm742-19-01-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm742-19-02-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm742-19-33-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm742-19-02-4k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm742-19-33-4k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm743-43-01-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm743-43-02-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm743-43-33-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm743-43-01-4k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm743-43-02-4k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20spot/xm743-43-33-4k/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/queens compact/",
        "model": "QUEENS COMPACT",
        "projects": [
            "http://www.panzeri.it//media/FFS/Queens-binario.jpg",
            "http://www.panzeri.it//media/FFS/compo_binario.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20compact/xm751-30-01-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20compact/xm751-30-02-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20compact/xm751-30-33-3k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20compact/xm751-30-01-4k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20compact/xm751-30-02-4k/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/queens%20compact/xm751-30-33-4k/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/soho spot micro/",
        "model": "SOHO SPOT MICRO",
        "projects": [],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/soho%20spot%20micro/b75401.021.2516/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/soho%20spot%20micro/b75402.021.2516/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/soho spot micro low/",
        "model": "SOHO SPOT MICRO LOW",
        "projects": [],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/soho%20spot%20micro%20low/b75301.018.2516/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/soho%20spot%20micro%20low/b75302.018.2516/"
        ]
    },
    {
        "uri": "http://www.panzeri.it/prodotti/architectural/spotlight/soho spot nano/",
        "model": "SOHO SPOT NANO",
        "projects": [],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/architectural/spotlight/soho%20spot%20nano/b75201.007.2516/",
            "http://www.panzeri.it/prodotti/architectural/spotlight/soho%20spot%20nano/b75202.007.2516/"
        ]
    }
]


var single_pages = [
    {
        "uri": "http://www.panzeri.it/prodotti/design/indoor/brooklyn line/",
        "model": "BROOKLYN LINE",
        "projects": [
            "http://www.panzeri.it//media/FFS/ventitrentatre_slider_NEW.jpg",
            "http://www.panzeri.it//media/FFS/ventitrentatre_copertina.jpg",
            "http://www.panzeri.it//media/FFS/Ventitrentatre.jpg",
            "http://www.panzeri.it//media/FFS/Ventitrentatre-3.jpg",
            "http://www.panzeri.it//media/FFS/Ventitrentare-2.jpg"
        ],
        "link_varianti": [
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23301.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23302.100.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23301.150.0101/",
            "http://www.panzeri.it/prodotti/design/indoor/brooklyn%20line/l23302.150.0101/"
        ]
    },
]




var arr_singole_pagine = [];

_.each(single_pages,function(elem){
    _.each(elem.link_varianti,function(item){
        arr_singole_pagine.push({
            family_uri: elem.uri,
            model: elem.model,
            projects: elem.projects,
            single_variant : item,
        })
    })
})

//_.log(_.toStr(arr_singole_pagine))



var pages_number = arr_singole_pagine.length; 



var info = [];

var index = 0;

setInterval(function(){
    _.log(_.toStr(info))
},90000)



avvia(index);

function avvia(index){

    if(index == pages_number ){
        fs.writeFile('assets_json_finale.json', JSON.stringify(info, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var uri = arr_singole_pagine[index].single_variant;
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        
        request({
            uri: encodeURI(uri),
        }, function(error, response, body) {
            createJsonFromAPage(body, uri, arr_singole_pagine[index]);
        });

    }
}







var arr_single_product = [];

function createJsonFromAPage(body, uri, single_page_obj){

    var $body = $(body);
    var title = $body.find("h1").eq(0).html();
    var model = S(title).between(""," -").s;
    var id = S(title).between("- ").s.trim();
    var primary_pic = $body.find(".c5").find("img").eq(0).attr("src");
    var light_schema = $body.find(".c5").find(".configuratore").find("img").eq(0).attr("src");
    var more_info = {};

    
    $body.find(".schedatecnica").eq(0).find("tbody").eq(0).find("tr").each(function(){
        var label = $(this).find("th").html();
        var value = $(this).find("td").html();
        more_info[label] = value;
    });

    var downloads = [];

    $body.find(".allegati").eq(0).find("a").each(function(){
        if($(this).html() == "_ Scheda tecnica"){
            downloads.push({
                title : "scheda_tecnica",
                uri: "http://www.panzeri.it"+$(this).attr("href")
            })
        }
        if($(this).html() == "_ Foglio di istruzioni"){
            downloads.push({
                title : "foglio_illustrativo",
                uri: "http://www.panzeri.it"+$(this).attr("href")
            })
        }
    });


    
    info.push({
        family_uri: single_page_obj.family_uri,
        single_product_uri: uri,
        model: single_page_obj.model,
        projects: single_page_obj.projects,
        id: id,
        model_from_site : model,
        primary_pic : "http://www.panzeri.it"+primary_pic,
        light_schema : "http://www.panzeri.it"+light_schema,
        more_info : more_info,
        downloads : downloads,
    })



    index++;
    
    avvia(index);
    

}



