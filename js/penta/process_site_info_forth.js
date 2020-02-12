var _ = require("../../lib/_node.js");
var S = require('string');
var request = require("request");
var fs = require('fs');



 /* 
                                            siccome per Penta nel suo assets_json.json non è stato possibile recuperare la categoria
                                            cerchiamo di "aumentare" asses.json partendo dal campo prod_name (che è del tipo glo-applique)
                                            e aggiungendo i campi:
                                                real_prod_name : "glo";
                                                category : "parete"
                                                outdoor: false;
 */




// qui copio e incollo assets.json

var assets = [

    {
        "prod_page": "https://pentalight.it/en/prodotto/glo-applique/",
        "prod_name": "glo-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Glo-wall-1-1400x1400.jpg",
        "desc": "Glo è un’icona della nostra collezione, una sfera di vetro che esalta il riverbero della luce, in un gioco di riflessioni e rimandi tra la lampada e lo spazio o fra le lampade tra loro. La ricca palette e le diverse misure della variante sospesa sono un invito alla composizione.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Glo_wall-lamp-VERTI-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A1921.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Glo_04_HI_RES-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Glo_03_HI_RES-ORIZZ-1400x1224.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Glo-wall-medium-1.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Glo-wall-mini-1.svg"
        ],
        "video": "https://pentalight.it/wp-content/uploads/2019/09/pentalight_GLO_v04-1.mp4"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/acorn-sospensione/",
        "prod_name": "acorn-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Acorn-1-1400x1400.jpg",
        "desc": "La materialità del cemento si fonde con la leggerezza del vetro nella lampada a sospensione Acorn, nata per illuminare gli spazi all’esterno e protagonista di quelliall’interno. Il cemento, spatolato a mano, fa filtrare una luce calda e avvolgente.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/49A0678-1-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Acorn_02_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Acorn_01_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A0735-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Acorn-1400x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Acorn-Large-2.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Acorn-medium-2.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Acorn-mini-2.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/altura/",
        "prod_name": "altura",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/colori-1400x1400.jpg",
        "desc": "Una matita si scioglie nel mare.L’orizzonte si piega in un cielo in equilibrio.Ed è luce.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/10/ALT_TOTO_Vertical-1156x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/Altura_Dettaglio_cappello-1190x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/Altura_Dettaglio-asta-1190x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/ALTURA_LIVING_TOTALE-1400x989.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/Altura_ettaglio_interruttore-1190x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/10/Altura-terra.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/altura-sospensione/",
        "prod_name": "altura-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/Altura_living_verticale-1120x1400.jpg",
        "desc": "Una matita si scioglie nel mare.L’orizzonte si piega in un cielo in equilibrio.Ed è luce.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/10/Altura_living_verticale-1120x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/Altura_sosp_slide-1400x1083.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/Altura_Dettaglio_cappello-1190x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/10/Altura-sosp.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/angolo/",
        "prod_name": "angolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Angolo-1-1400x1400.jpg",
        "desc": "Un elemento illuminante dalle linee essenziali e una struttura monoblocco in pietra o legno: Angolo è una scultura di luce che unisce sapientemente pulizia delle forme e ricchezza materica, per atmosfere sofisticate sia all’interno che all’esterno.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2018/04/A04A9335-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Angolo-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2018/04/A04A9342-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Angolo-1-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2018/04/49A0791-1-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2018/04/Angolo-large-horizontal-1.svg",
            "https://pentalight.it/wp-content/uploads/2018/04/Angolo-large-vertical-1.svg",
            "https://pentalight.it/wp-content/uploads/2018/04/Angolo-medium-horiziontal-1.svg",
            "https://pentalight.it/wp-content/uploads/2018/04/Angolo-medium-vertical-1.svg",
            "https://pentalight.it/wp-content/uploads/2018/04/Angolo-small-horizontal.svg",
            "https://pentalight.it/wp-content/uploads/2018/04/Angolo-smnall-vertical.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/aprile-applique/",
        "prod_name": "aprile-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Aprile-1-1400x1400.jpg",
        "desc": "Un quadro luminoso capace di far vibrare le pareti con una luce delicata come  quella del sole in primavera.Aprile è un’applique liberamente orientabile che esplora l’eleganza della luce, più intensa da un lato e più morbida dall’altro.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/49A7944-1-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A7953-1400x813.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Aprile_02_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Aprile_01_HI_RES-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Aprile_02_bianca_LOW_RES.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Aprile.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/bag-outdoor-da-terra/",
        "prod_name": "bag-outdoor-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Bag-1-1400x1400.jpg",
        "desc": "Prima lampada da esterni della collezione, Bag è un abat-jour in versione maxi realizzato in espanso termoplastico. Un volume monolitico e imponente per una luce di grande atmosfera.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/49A0812_1-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/BAG-outdoor-image-04-1-1400x1050.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/BAG-outdoor-image-01___-1400x1050.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A0812_1-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A1664-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Bag.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-sospensione/",
        "prod_name": "chi-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Chi-1-1400x1400.jpg",
        "desc": "Un classico della nostra collezione, C’hi si riconosce dal paralume in vetro, che con le sue onde delicate disegna luci e ombre sulle pareti e nello spazio.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/49A1314-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A1342-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A1342-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI_SOSP_BIANCA_intera-947x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A2333-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-sospensione-maxi.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-sospensione-large.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/chi-sospensione-media.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-sospensione-piccola.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/club-house-appliques/",
        "prod_name": "club-house-appliques",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/02/COPERTINA-PROD-COLLEZIONE-STILL_club-house_0001-1398x1400.jpg",
        "desc": "Club House è una collezione dall’indole decorativa che rilegge con ironia il classico paralume in seta con passamaneria a contrasto.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/CH-wall-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/Club-House-wall-30.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Club-House-wall-31.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Club-House-wall-32.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Club-House-wall-33.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/spoon-applique/",
        "prod_name": "spoon-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Spoon-wall-1400x1400.jpg",
        "desc": "L’estrema pulizia della forma incontra la ricchezza della pelle intrecciata nella collezione Spoon, un piccolo capolavoro di bellezza e funzionalità, con stelo e calotta da orientare a piacere.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_wall-lamp-1183x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_mont_HI_RES-1400x1042.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_wall_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon-wall.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/spoon-tavolo/",
        "prod_name": "spoon-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Spoon-1-1400x1400.jpg",
        "desc": "L’estrema pulizia della forma incontra la ricchezza della pelle intrecciata nella collezione Spoon, un piccolo capolavoro di bellezza e funzionalità, con stelo e calotta da orientare a piacere.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_table-1-1088x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_table_still-1400x1134.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_table_detail-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_detail_01-1-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_adjustable-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/spoon-tavolo-2.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/spoon-terra/",
        "prod_name": "spoon-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Spoon-terra-1400x1400.jpg",
        "desc": "L’estrema pulizia della forma incontra la ricchezza della pelle intrecciata nella collezione Spoon, un piccolo capolavoro di bellezza e funzionalità, con stelo e calotta da orientare a piacere.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_floor_vert-1183x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_detail_01-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon_floor_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Spoon-terra.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/storm/",
        "prod_name": "storm",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Storm-1-1400x1400.jpg",
        "desc": "Steli sottili in preziose finiture metalliche creano suggestive armonie di luce. Disponibile in tre misure, Storm è una lampada che vive anche da sola ma è pensata per essere usata in gruppo, negli spazi del contract come in quelli di casa.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Storm_cluster-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Storm_04_HI_RES-1400x965.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Storm_0311-1336x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Storm_light-detail-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Storm_stem-detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Storm-large.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Storm-medium.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Storm-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/taaac-da-terra/",
        "prod_name": "taaac-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Taaac-1-1400x1400.jpg",
        "desc": "Taaac rielabora in forma contemporanea il classico arco, con in più il tocco sartoriale dei dettagli in cuoio a impreziosire la struttura in materiale  termoplastico.Protagonista è l’emissione luminosa, i cui parametri illuminotecnici si programmano con il telecomando",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Taaac-verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/TAAAC-image-06-1-1400x1050.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/TAAAC-image-02-1-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Taaac_slide-1400x840.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Taaac_base_orizz-1400x933.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Taaac-1.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Taaac-2.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tic-toc-da-tavolo/",
        "prod_name": "tic-toc-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/Senza-titolo-1-1400x1400.jpg",
        "desc": "Luce, trasparenza, leggerezza: la collezione Tic/Toc si compone di due lampade diverse ma affini. La prima è completamente in vetro colorato con un’anima luminosa, la seconda unisce una base a sfera di vetro a un paralume in tessuto.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Tic-1-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Toc-3-1400x1322.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/TIC-TOC-image-01-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tic_detail-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Toc_detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Tic.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tic-glass-shade.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tic-fabric-shade.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Toc.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Toc-shade.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tile/",
        "prod_name": "tile",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/tile-1-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tosca-da-tavolo/",
        "prod_name": "tosca-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/Tosca-1400x1400.jpg",
        "desc": "Un sostegno essenziale in metallo supporta un paralume rettangolare in tessuto in questa lampada da terra o da tavolo che mostra tutta l’eleganza della semplicità, perun effetto luminoso di grande atmosfera.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca_table-lamp-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca_table_detail-1400x1191.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca_table_still-1220x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca-tavolo-grande.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca-tavolo-piccola.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca-shade-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca-shade-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/tosca-da-terra/",
        "prod_name": "tosca-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/PRODOTTO-Tosca-terra-vetro-opalino--991x1400.jpg",
        "desc": "Un sostegno essenziale in metallo supporta un paralume rettangolare in tessuto in questa lampada da terra o da tavolo che mostra tutta l’eleganza della semplicità, perun effetto luminoso di grande atmosfera.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca_floor-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca_table_detail-1400x1191.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca_floor_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca-floor.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Tosca-shade-floor.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/vela/",
        "prod_name": "vela",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/VELA-FOTO-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/wonder-a-sospensione/",
        "prod_name": "wonder-a-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Wonder-1-1400x1400.jpg",
        "desc": "La meraviglia della combinazione di più lampade Wonder di dimensioni, finiture e altezze diverse ha la stessa luminosa bellezza del vetro borosilicato con cui sonorealizzate le singole canne, in finitura trasparente o fumé.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder_slide-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder_01_HI_RES-1158x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder_suspension_still-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder_dett.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Wonder-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/woody-a-sospensione/",
        "prod_name": "woody-a-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Woody-1-1400x1400.jpg",
        "desc": "Una forma essenziale e iper-contemporanea vestita della ricchezza decorativa del marmo di Carrara: il minimalismo non è mai stato più lussuoso.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/Woody_marble_detail-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/WOODY-image-03-1-1400x1050.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Woody_marble_-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/Woody-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Woody-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/yan-sospensione/",
        "prod_name": "yan-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/YAN-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-sospensione/",
        "prod_name": "chi-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Chi-1-1400x1400.jpg",
        "desc": "Un classico della nostra collezione, C’hi si riconosce dal paralume in vetro, che con le sue onde delicate disegna luci e ombre sulle pareti e nello spazio.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/49A1314-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A1342-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A1342-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI_SOSP_BIANCA_intera-947x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A2333-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-sospensione-maxi.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-sospensione-large.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/chi-sospensione-media.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-sospensione-piccola.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-terra/",
        "prod_name": "chi-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Chi-terra-1400x1400.jpg",
        "desc": "Un classico della nostra collezione, C’hi si riconosce dal paralume in vetro, che con le sue onde delicate disegna luci e ombre sulle pareti e nello spazio. Una famigliacompleta formata da lampade a sospensione, da tavolo, da terra e applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-Floor-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi_floor_detail-1242x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi_floor_verti-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-terra.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-applique/",
        "prod_name": "chi-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/chi-wall-1400x1400.jpg",
        "desc": "Un classico della nostra collezione, C’hi si riconosce dal paralume in vetro, che con le sue onde delicate disegna luci e ombre sulle pareti e nello spazio.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/49A2184-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi_wall-lamp-1400x1018.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI-Applique-image-02-1-1400x1124.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI-Applique-image-02-1-1400x1124.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi_wall-lamp-1400x1018.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-wall-large.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/chi-wall-small-1.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/chi-da-tavolo/",
        "prod_name": "chi-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/chi-tavolo-1400x1400.jpg",
        "desc": "Un classico della nostra collezione, C’hi si riconosce dal paralume in vetro, che con le sue onde delicate disegna luci e ombre sulle pareti e nello spazio.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2015/12/table-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI-Table-Lamp-image-02-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI-Table-Lamp-image-06-1400x905.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/CHI-Table-Lamp-image-03-1-1099x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2015/12/49A9136-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-tavolo-grande.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-medium-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2015/12/Chi-small-tavolo.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/china-da-tavolo/",
        "prod_name": "china-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/China-1-1400x1400.jpg",
        "desc": "Un’elegante lampada da lettura che diffonde una luce soffusa grazie al basamento riflettente. La ricchezza delle finiture, dal bianco lucido all’oro, permette di interpretare China in modo sempre diverso a seconda del contesto.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/49A7767-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A7779-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A7729-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A8165-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A8159-grafite-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/China-tavolo-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/China-tavolo-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/china-floor-lamp/",
        "prod_name": "china-floor-lamp",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/china-floor-1400x1400.jpg",
        "desc": "Un’elegante lampada da lettura che diffonde una luce soffusa grazie al basamento riflettente. La ricchezza delle finiture, dal bianco lucido all’oro, permette di interpretare China in modo sempre diverso a seconda del contesto.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/49A7427-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/CHINA-Floor-Lamp-image-01-1-1158x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A8377-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/China-terra-alta.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/China-terra-bassa.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/clash-applique/",
        "prod_name": "clash-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Clash-1-1400x1400.jpg",
        "desc": "Clash è un’applique che combina la leggerezza del vetro e la forza del metallo per creare un oggetto dall’estetica moderna e sofisticata, reso futuristico dalle finiturein grafite e bronzo. La parte inferiore è orientabile, una caratteristica funzionale prima che estetica.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/49A2099_verti-1055x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A2150_orizz.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clash_03_LOW_RES-1.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clash_01_LOW_RES-1.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clash_wall_still-1400x1131.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Clash-fix.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clash-adjustable.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/clip-sospensione/",
        "prod_name": "clip-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Clip-1-1400x1400.jpg",
        "desc": "Clip è una collezione di lampade a sospensione caratterizzata da un disco sottile accoppiato a un’asola, aperta o chiusa, agganciata al cavo di sostegno. Un accessorio dall’estetica contemporanea, un sofisticato gioiello da soffitto.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/49A1479_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clip_01_HI_RES_orizz-1400x1257.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clip_02_HI_RES-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A1460-1058x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clip_03_HI_RES-1400x1000.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Clip-large-open.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clip-large-closed.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clip-small-open.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Clip-small-closed.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/elisabeth-tavolo/",
        "prod_name": "elisabeth-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Elisabeth-1-1400x1400.jpg",
        "desc": "Un gioco astronomico di semisfere ispira la collezione Elisabeth – dalla più composta versione da tavolo alle suggestioni art déco della sospensione.Metalli lucidi e marmo di Carrara impreziosiscono la pulizia formale dei volumi.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_table_metal_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_table_marble_orizz-1400x1105.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_table_metal01-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_03_HI_RES_tav-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_02_HI_RES_tav-1400x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth-tavolo-grande.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth-tavolo-piccola.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/elisabeth-sospensione/",
        "prod_name": "elisabeth-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Elisabeth-sospensione-1400x1400.jpg",
        "desc": "Un gioco astronomico di semisfere ispira la collezione Elisabeth – dalla più composta versione da tavolo alle suggestioni art déco della sospensione.Metalli lucidi e marmo di Carrara impreziosiscono la pulizia formale dei volumi.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_suspension_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_suspension_still_orizz-1400x1276.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_suspension_01-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth-sospensione-grande-1.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth-sospensione-piccola-1.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/elisabeth-applique/",
        "prod_name": "elisabeth-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Elisabeth-wall-1-1400x1400.jpg",
        "desc": "Un gioco astronomico di semisfere ispira la collezione Elisabeth – dalla più composta versione da tavolo alle suggestioni art déco della sospensione.Metalli lucidi e marmo di Carrara impreziosiscono la pulizia formale dei volumi.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/DSC0748_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth_04_HI_RES-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/DSC0748_verti-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Elisabeth-applique.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/enoki-applique/",
        "prod_name": "enoki-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Enoki-1-1400x1400.jpg",
        "desc": "Applique che riprende forme art déco combinando una lamina di metallo a una semicupola sporgente, Enoki vive come oggetto singolo o combinata ad altri elementi simili, anche con orientamenti diversi.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Enoki_verti-1182x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Enoki_still-orizz-1400x1260.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Enoki_06_HI_RES-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Enoki_01_HI_RES-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Enoki_07_oro_rosa_HI_RES-1400x933.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Enoki-1.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/feel/",
        "prod_name": "feel",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Feel-1-1400x1400.jpg",
        "desc": "Feel è in un sistema modulare e componibile per migliorare le qualità ambientali dell’architettura contemporanea attraverso il controllo sapiente di onde luminose e sonore. Dalla combinazione di dischi tessili e steli luminosi prendono forma una serie di configurazioni morfologiche e spaziali sempre diverse da sospendere a soffitto o fissare a parete secondo necessità.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2018/05/FILL-Mexico-2.jpg",
            "https://pentalight.it/wp-content/uploads/2018/05/feel_orizz-1400x810.jpg",
            "https://pentalight.it/wp-content/uploads/2018/05/FILL-Mexico-1.jpg",
            "https://pentalight.it/wp-content/uploads/2018/05/49A1237-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2018/05/49A2807-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-asta-large.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-asta-medium.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-asta-mini.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-asta-medium-cieca.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-asta-mini-cieca.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-disco-large.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/Feel-disco-medium.svg",
            "https://pentalight.it/wp-content/uploads/2018/05/feel-disco-mni.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/glifo/",
        "prod_name": "glifo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/Glifo-contract_dettaglio_interruttore-1120x1400.jpg",
        "desc": "Un segno fende l’aria, immobile una bandiera, la notte si illumina.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/10/glifo_VERTICAL_OK-1022x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/GLIFO_TOT_AMB-1400x989.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/GLIFO_TOT_Vert.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/Glifo-contract_dettaglio_interruttore-1120x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/GLIFO_CLOSE-UP-1022x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/10/Glifo_large.svg",
            "https://pentalight.it/wp-content/uploads/2019/10/Glifo_medium-1.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/glo-da-terra/",
        "prod_name": "glo-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Glo-floor-1-1400x1400.jpg",
        "desc": "Glo è un’icona della nostra collezione, una sfera di vetro che esalta il riverbero della luce, in un gioco di riflessioni e rimandi tra la lampada e lo spazio o fra le lampade tra loro. La ricca palette e le diverse misure della variante sospesa sono un invito alla composizione.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_floor-verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A1586-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-terra.svg"
        ],
        "video": "https://pentalight.it/wp-content/uploads/2019/09/pentalight_GLO_v04-1.mp4"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/glo-da-tavolo/",
        "prod_name": "glo-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Glo-table-1-1400x1400.jpg",
        "desc": "Glo è un’icona della nostra collezione, una sfera di vetro che esalta il riverbero della luce, in un gioco di riflessioni e rimandi tra la lampada e lo spazio o fra le lampade tra loro. La ricca palette e le diverse misure della variante sospesa sono un invito alla composizione.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_table-lamp_VERTI-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/GLO-Table-Lamp-image-05-1400x979.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_table_still-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_table-lamp_detail-ORIZ-1400x933.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-tavolo-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-tavolo-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-tavolo-mini.svg"
        ],
        "video": "https://pentalight.it/wp-content/uploads/2019/09/pentalight_GLO_v04-1.mp4"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/gli-composizione-multipla-sospensione/",
        "prod_name": "gli-composizione-multipla-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Glo-1-1400x1400.jpg",
        "desc": "Glo è un’icona della nostra collezione, una sfera di vetro che esalta il riverbero della luce, in un gioco di riflessioni e rimandi tra la lampada e lo spazio o fra le lampade tra loro. La ricca palette e le diverse misure della variante sospesa sono un invito alla composizione.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_cluster-verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_suspension-orizz-1400x1236.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Penta_Stand_05-1-913x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo_mini_detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-sospensione-large-1.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-sospensione-medium-1.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Glo-sospensione-mini-1.svg"
        ],
        "video": "https://pentalight.it/wp-content/uploads/2019/09/pentalight_GLO_v04-1.mp4"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/hang-out-sospensione/",
        "prod_name": "hang-out-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/HANG-OUT-1-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jacqueline-lampada-tavolo/",
        "prod_name": "jacqueline-lampada-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Jacqueline-verti-933x1400.jpg",
        "desc": "Jacqueline è una lampada portatile dall’allure femminile e giocosa che associa tecnologia e sartorialità: i dettagli in pelle sono cuciti a mano e si abbinano al coloredell’alluminio anodizzato della struttura.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Jacqueline-verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A9575-2.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A9357-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A9350-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/49A9395-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Jacqueline-large-filo.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/jacqueline-large.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Jacqueline-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/je-suis-da-tavolo/",
        "prod_name": "je-suis-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/JeSuis-1400x1400.jpg",
        "desc": "Una lampada scultorea formata da una sfera bicolore in vetro bianco e argento e da un basamento monumentale in marmo di Carrara o legno. Je suis è una dichiarazione d’intenti, tra ricchezza delle finiture e bellezza che supera la funzione.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/Je-Suis_table-verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/JeSuis_table_still_orizz-1400x1050.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/JE-SUIS-image-01-904x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/49A0439-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/JE-SUIS-image-02-1-1132x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/JeSuis-table.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/je-suis-da-terra/",
        "prod_name": "je-suis-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/02/JeSuis-floor-1400x1400.jpg",
        "desc": "Una lampada scultorea formata da una sfera bicolore in vetro bianco e argento e da un basamento monumentale in marmo di Carrara o legno. Je suis è una  dichiarazione d’intenti, tra ricchezza delle finiture e bellezza che supera la funzione.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/49A0490-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/49A0532-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Je-Suis_floor_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/JeSuis-floor.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jei-jei-applique/",
        "prod_name": "jei-jei-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/Jei-Jei-wall-1400x1400.jpg",
        "desc": "Reinterpretazione del classico lampadario in vetro, Jei Jei è maestosa ed essenziale. Le canne in vetro borosilicato sottilissimo si innestano nella corona centrale dando vita a composizioni più o meno ricche, anche in versione applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/49A2464-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/JEI-JEI-Applique-image-02-1-1100x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/JEI-JEI-Applique-image-01-1128x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Jei-Jei-wall-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/JeiJei-wall-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/jei-jei-sospensione/",
        "prod_name": "jei-jei-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/JeiJei-1400x1400.jpg",
        "desc": "Reinterpretazione del classico lampadario in vetro, Jei Jei è maestosa ed essenziale. Le canne in vetro borosilicato sottilissimo si innestano nella corona centrale dando vita a composizioni più o meno ricche, anche in versione applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Jei-Jei_maxi-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/JEI-JEI-Pendant-image-02-1400x1011.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Jei-Jei_detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Jei-Jei-super-maxi.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/JeiJei-maxi.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/JeiJei-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/JeiJei-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/klint-da-tavolo/",
        "prod_name": "klint-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Klint-1-1400x1400.jpg",
        "desc": "Klint è un oggetto scultoreo, un cesto di luce ispirato alla tecnica del vetro a lume della tradizione veneziana. Le canne in tondino di vetro trasparente portano verso l’alto la luce della fonte luminosa a LED.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Klint-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/49A1738.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/KLINT-image-003.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Klint.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lit-sospensione/",
        "prod_name": "lit-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Lit-1400x1400.jpg",
        "desc": "Un oggetto mutevole che cambia con la luce. Spenta, Lit sembra una scultura sospesa, un tubo essenziale reso prezioso dai riflessi che si riverberano sul vetro. Accesa, la lampada rivela un’anima luminosa, calda e gentile.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/49A0940-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/49A0954.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/49A2713-accesa-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/49A2713-spente-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/Lit-large.svg",
            "https://pentalight.it/wp-content/uploads/2019/01/Lit-Medium.svg",
            "https://pentalight.it/wp-content/uploads/2019/01/Lit-small.svg"
        ],
        "video": "https://pentalight.tk/wp-content/uploads/2019/09/pentalight_LIT_v04.mp4"
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/ludo/",
        "prod_name": "ludo",
        "prod_pic": null,
        "desc": "",
        "projects": [],
        "light_schema": []
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lula-da-tavolo/",
        "prod_name": "lula-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Lula-1-1400x1400.jpg",
        "desc": "Un sottile stelo metallico sorregge un corpo illuminante in vetro dalle linee morbide e femminili.Nasce così Lula, lampada da tavolo e da terra che decora lo spazio con eleganza.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/49A8781-2-verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/49A8798-orizz-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/49A8911-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/49A0188-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Lula_table-1400x1025.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/Lula-tavolo-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/Lula-tavolo-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/lula-da-terra/",
        "prod_name": "lula-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/02/Lula-floor-1400x1400.jpg",
        "desc": "Un sottile stelo metallico sorregge un corpo illuminante in vetro dalle linee morbide e femminili.Nasce così Lula, lampada da tavolo e da terra che decora lo spazio con eleganza.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/Lula_floor-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/LULA-image-06-1400x934.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Lula_floor_detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/Lula-floor.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-a-sospensione/",
        "prod_name": "mami-a-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/02/mami-sospensione-1-1400x1400.jpg",
        "desc": "Tra design e arte, Mamì è una collezione dall’eleganza versatile. Merito del modulo ovale in vetro soffiato bianco, reinterpretato in chiave modernista nelle configurazioni sospese e più lineare nelle varianti da tavolo, da terra e applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/mami-sosp-1183x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-asta-orizzontale-1400x993.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Mami_stem-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/MAMI_MAXI_SPIRALE_BIANCA-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami_metal_detail-1400x933.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/mami-sospensione-maxi.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-sospensione-xl.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-sospensione-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-sospensione-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-sospensione-small.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-orizzontale.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-asta-fissa-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-asta-fissa-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-asta-fissa-small.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-ceiling-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/mami-ceiling-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-da-terra/",
        "prod_name": "mami-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/PRODOTTO-MAMI_TERRA_STILL-1049x1400.jpg",
        "desc": "Tra design e arte, Mamì è una collezione dall’eleganza versatile. Merito del modulo ovale in vetro soffiato bianco, reinterpretato in chiave modernista nelle configurazioni sospese e più lineare nelle varianti da tavolo, da terra e applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_floor-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/1K3G9319.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_still_terra-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Mami-terra.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-da-tavolo/",
        "prod_name": "mami-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/02/Mami-tavolo-1400x1400.jpg",
        "desc": "Tra design e arte, Mamì è una collezione dall’eleganza versatile. Merito del modulo ovale in vetro soffiato bianco, reinterpretato in chiave modernista nelle configurazioni sospese e più lineare nelle varianti da tavolo, da terra e applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_table-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/1K3G9319.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_table_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Mami-tavolo.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mami-applique/",
        "prod_name": "mami-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/mami-applique-1400x1400.jpg",
        "desc": "Tra design e arte, Mamì è una collezione dall’eleganza versatile. Merito del modulo ovale in vetro soffiato bianco, reinterpretato in chiave modernista nelle configurazioni sospese e più lineare nelle varianti da tavolo, da terra e applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_wall-lamp_4light_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_wall_still-1-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Mami_wall-lamp-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Mami-wall-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/mami-wall-medium.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/mami-wall-small.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/mami-wall-4luci.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mira-tavolo/",
        "prod_name": "mira-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/Mira-table-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mom-sospensione/",
        "prod_name": "mom-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/10/Mom-1400x1400.jpg",
        "desc": "Sono ispirate alla tradizione veneziana le lampade Mom, che nella forma e nelle finiture opache si rifanno ai classici vasi in vetro di Murano. Disponibili anche nellevarianti da tavolo e applique, in versione lucida sono simili a pietre preziose.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/10/mom-opache-sosp-999x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM_cluster_01-1183x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM_01-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM_06-copia-1156x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM_02-copia-923x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/10/MoM-low-sospensione.svg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM-tall-sospensione.svg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM-slim-sospensione.svg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM-fatty-sospensione.svg",
            "https://pentalight.it/wp-content/uploads/2016/10/MoM-little-sospensione.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mom-applique/",
        "prod_name": "mom-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Mom-wall-lamp-1400x1400.jpg",
        "desc": "Sono ispirate alla tradizione veneziana le lampade Mom, che nella forma e nelle finiture opache si rifanno ai classici vasi in vetro di Murano. Disponibili anche nellevarianti da tavolo e applique, in versione lucida sono simili a pietre preziose.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_wall-lamp-verti-934x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_wall_still-1400x1193.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_wall_still_-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/MoM-fatty-wall.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM-slim-wall.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/mom-tavolo/",
        "prod_name": "mom-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Mom-tavolo-1400x1400.jpg",
        "desc": "Sono ispirate alla tradizione veneziana le lampade Mom, che nella forma e nelle finiture opache si rifanno ai classici vasi in vetro di Murano. Disponibili anche nellevarianti da tavolo e applique, in versione lucida sono simili a pietre preziose.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_table-lamp_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_Little_table_still_oriz-1400x927.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_table_black-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Mom_low_still-1400x1114.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM_table_detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/MoM-low-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM-tall-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM-fatty-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/MoM-little-tavolo.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/morsetto-tavolo/",
        "prod_name": "morsetto-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/morsetto_FOTO-933x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-910x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-1050x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161502-455x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181213_161511-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG_20181214_121413-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0008-1-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg",
            "https://pentalight.it/wp-content/uploads/2019/01/IMG-20190114-WA0028-525x700.jpg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/narciso-sospensione/",
        "prod_name": "narciso-sospensione",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Narciso-sospensione-1-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_suspension-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_suspension_detail_01-1400x933.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_suspension_detail-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso-sospensione.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/narciso-terra/",
        "prod_name": "narciso-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Narciso-terra_-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_floor_01-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_low-floor-1400x739.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_floor_-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_floor_still-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_low_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso-terra.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/narciso-tavolo/",
        "prod_name": "narciso-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Narciso-1-1400x1400.jpg",
        "desc": "Come nel mito classico Narciso guarda la sua immagine riflessa nell’acqua, così il cono dell’omonima lampada si sdoppia per diffondere e riemettere la luce delicata del corpo illuminante.Omaggio alla musica la versione da tavolo, con diffusore audio bluetooth.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_table_-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_table_graphite-1400x1008.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_gold_detail-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_graphite_01_still-1-1400x1210.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso_04_LOW_RES.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso-tavolo-large-filo.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso-tavolo-large.svg",
            "https://pentalight.it/wp-content/uploads/2017/06/Narciso-tavolo-small.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/new-classic-da-tavolo/",
        "prod_name": "new-classic-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/New-Classic-1-1400x1400.jpg",
        "desc": "Reinterpretazione sofisticata del classico abat-jour, New classic ha una base a bottiglia in vetro di diverse forme e un paralume in tessuto – o in materiale traslucido, per un ulteriore tocco di modernità.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/NC_Bon-Ton_table_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC_Desir_orizz-1400x1207.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC_Pascia-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC_blue_detail_slide-1400x1359.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC_Bon-Ton_shade-slide-1400x933.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/NC-Bon-ton-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-Desir-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-Pascia-tavolo.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-paralume-semicono.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-paralume-high-cylinder.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-paralume-low-cylinder.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/new-classic-da-terra/",
        "prod_name": "new-classic-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/NewClassic_floor_verti-933x1400.jpg",
        "desc": "Reinterpretazione sofisticata del classico abat-jour, New classic ha una base a bottiglia in vetro di diverse forme e un paralume in tessuto – o in materiale traslucido, per un ulteriore tocco di modernità.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/NewClassic_floor_verti-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/NewClassic_detail_terra-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/BonTon_floor_still-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/NC-Bon-ton-terra.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-paralume-low-semicone.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/NC-paralume-high-semicone.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/polar-da-tavolo/",
        "prod_name": "polar-da-tavolo",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Polar-tavolo-1400x1400.jpg",
        "desc": "Polar è un volume puro di vetro soffiato opalino che diffonde un chiarore caldo e morbido. Un totem di luceche rende subito accogliente qualsiasi spazio.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Polar_table-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Polar_table_still_orizz-1400x1170.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Polar_base-933x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Polar-tavolo.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/polar-da-terra/",
        "prod_name": "polar-da-terra",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2017/06/Polar-terra-1400x1400.jpg",
        "desc": "Polar è un volume puro di vetro soffiato opalino che diffonde un chiarore caldo e morbido. Un totem di luce che rende subito accogliente qualsiasi spazio.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/Polar_floor-1182x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/Polar_still-1400x1182.jpg",
            "https://pentalight.it/wp-content/uploads/2016/01/POLAR-image-03-1050x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Polar-terra.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/pop-applique/",
        "prod_name": "pop-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2015/12/Pop-1-1400x1400.jpg",
        "desc": "Una lampada dalle forme giocose, un oggetto indisciplinato che mescola ironia ed eleganza: Pop è un applique sferica che dipinge sulla parete luci e ombre inattese.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2017/06/Pop-Recuperato-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Pop_06_HI_RES-1400x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Pop_02_HI_RES-1076x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Pop_06_bianco_HI_RES-1120x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2017/06/Pop_04_oro_rosa_HI_RES-1126x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2017/06/Pop.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/sop/",
        "prod_name": "sop",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2019/10/SOP_KITCHEN-1120x1400.jpg",
        "desc": "SOP è una lampada a sospensione.  La forma, che richiama l’eleganza dei vasi e delle ampolle del periodo greco e romano, è esagonale. SOP è un unico e affusolato blocco di cemento chiuso all’estremità inferiore da un led che richiama la forma e l’eleganza di un pistillo di un fiore.  L’utilizzo del cemento, materiale estremamente contemporaneo, consente un abbinamento perfetto di SOP con l’ambiente e il contesto in cui viene inserita. La lampada risulta essere un elemento discreto tono su tono, di contrasto quando è colorata.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2019/10/SOP_KITCHEN-1120x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/SOP_PICCIOLO_DETT.jpg",
            "https://pentalight.it/wp-content/uploads/2019/10/SOP_LOUNGE.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2019/10/Sop_large-1.svg",
            "https://pentalight.it/wp-content/uploads/2019/10/sop_medium-1.svg",
            "https://pentalight.it/wp-content/uploads/2019/10/sop_small-1.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/vanity-applique/",
        "prod_name": "vanity-applique",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/Vanity-1400x1400.jpg",
        "desc": "La stessa morbida qualità della luce e la bellezza tattile delle sospensioni in tessuto in versione applique.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/01/VANITY-RECTANGULAR-Version-image-01-1400x1006.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Vanity-small-rectangular.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Vanity-large-rectangular.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Vanity-small-round.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Vanity-large-round.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/sospensioni-tessuto/",
        "prod_name": "sospensioni-tessuto",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/02/Cylinder_fabric-933x1400.jpg",
        "desc": "Un oggetto dalle linee pulite che diventa protagonista dello spazio, esaltando attraverso la luce la morbidezza del tessuto.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/Cylinder_fabric-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Double-cylinder_still-1-1400x1299.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/Low-cylinder_still-933x1400.jpg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp-tessuto_5_06-1183x1400.jpg",
            "2000w"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/02/Sosp.-20-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-30-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-40-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-50-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-60-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-70-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-80-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-100-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-double-large.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-double-small.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-high-cylinder-contrappeso.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-high-cylinder.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-low-cylinder-60.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-low-cylinder-80.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-low-cylinder-100.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-square-60.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-square-80.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/sosp.-square-100.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/XL-sosp-120-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/XL-sosp-150-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/XL-sosp-180-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/XL-sosp-200-cilindro.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/XL-sosp-200-rectangular.svg",
            "https://pentalight.it/wp-content/uploads/2016/02/XL-sosp-250-rectangular.svg"
        ]
    },
    {
        "prod_page": "https://pentalight.it/en/prodotto/luxury-suspension/",
        "prod_name": "luxury-suspension",
        "prod_pic": "https://pentalight.it/wp-content/uploads/2016/01/Luxury_still.slide_-1400x762.jpg",
        "desc": "Luxury è una sospensione in tessuto resa più ricca dalla lavorazione a plissé. È disponibile nelle forme semiconica, cilindrica e rettangolare.",
        "projects": [
            "https://pentalight.it/wp-content/uploads/2016/02/SOSPENSIONI-Tessuto-image-08-1-1130x1400.jpg"
        ],
        "light_schema": [
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-cilindro-60.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-cilindro-80.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-cilindro-100.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-semicone-60.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-semicone-80.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-semicone-100.svg",
            "https://pentalight.it/wp-content/uploads/2016/01/Luxury-rectangular.svg"
        ]
    }
]

var augmented_assetes = [];
_.each(assets,function(asset){
    var new_asset = asset;
    var real_prod_name = S(asset.prod_name).replaceAll("-sospensione", "")
                                                .replaceAll("-applique", "")
                                                .replaceAll("-suspension", "")
                                                .replaceAll("sospensioni-", "")
                                                .replaceAll("-lampada", "")
                                                .replaceAll("-tessuto", "")
                                                .replaceAll("-lamp", "")
                                                .replaceAll("-tavolo", "")
                                                .replaceAll("-da", "")
                                                .replaceAll("-outdoor", "")
                                                .replaceAll("-terra", "")
                                                .replaceAll("-da", "")
                                                .replaceAll("-floor", "")
                                                .replaceAll("-a", "").s;

        /* alucni casi particolari */
        real_prod_name = real_prod_name.replace("new-classic","new classic")
        real_prod_name = real_prod_name.replace("hang-out","hang out")
        real_prod_name = real_prod_name.replace("tic-toc","tic toc")
        real_prod_name = real_prod_name.replace("club-house","club house")
        real_prod_name = real_prod_name.replace("je-suis","je suis")
        real_prod_name = real_prod_name.replace("jei-jei","jei jei")
        real_prod_name = real_prod_name.replace("gli-composizione-multipla","glo")

        /* alcuni prodotti con nomi particolari */
        real_prod_name = (real_prod_name == "mami")? "mamì" : real_prod_name;
        real_prod_name = (real_prod_name == "chi")? "c'hi" : real_prod_name;

    var category =  (asset.prod_name.indexOf("-sospensione") != -1 )? "sospensione" : 
                    (asset.prod_name.indexOf("-suspension") != -1 )? "sospensione" : 
                    (asset.prod_name.indexOf("sospensioni") != -1 )? "sospensione" : 
                    (asset.prod_name.indexOf("-tavolo") != -1 )? "tavolo" :
                    (asset.prod_name.indexOf("-terra") != -1 )? "terra" :  
                    (asset.prod_name.indexOf("-floor") != -1 )? "terra" :  
                    (asset.prod_name.indexOf("-applique") != -1 )? "parete" : undefined;

    // altri casi particolari
    if(category == undefined){
        // c'è un altura-sospensioni e un altura e basta..... dal sito si capisce che quest secondo caso è terra
        if(asset.prod_name == "altura")
            category = "terra";
        
        if(asset.prod_name == "angolo")
            category = "terra";
        
        if(asset.prod_name == "storm")
            category = "sospensione";
                    
        if(asset.prod_name == "tile")
            category = "sospensione";

        if(asset.prod_name == "vela")
            category = "sospensione";
        
        if(asset.prod_name == "feel")
            category = "sospensione";

        if(asset.prod_name == "sop")
            category = "sospensione";

        if(asset.prod_name == "glifo")
            category = "parete";
    }
    

    if(asset.prod_name.indexOf("-outdoor") != -1 )
        new_asset["outdoor"] = true;    
    
    new_asset["real_prod_name"] = real_prod_name;
    new_asset["category"] = category;

    augmented_assetes.push(new_asset)
})


fs.writeFile('assets_json.json', JSON.stringify(augmented_assetes, null, 4), 'utf8', function(){
    _.log("FINITO");
});

