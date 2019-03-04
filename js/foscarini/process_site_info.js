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


// questo è l'array di tutti gli href presenti nella pagina https://www.foscarini.com/it/products/ una volta che è tutta scrollata
var arr_all_products = [

"https://www.foscarini.com/it/products/plena/?color=3348","https://www.foscarini.com/it/products/soffio/?color=3609","https://www.foscarini.com/it/products/superficie/?color=3348","https://www.foscarini.com/it/products/sos-aplomb/?color=3390","https://www.foscarini.com/it/products/ta-rituals-2/?color=3348","https://www.foscarini.com/it/products/sos-gregg/?color=3348","https://www.foscarini.com/it/products/te-mite/?color=3352","https://www.foscarini.com/it/products/twiggy-grid-terra/?color=3596","https://www.foscarini.com/it/products/sos-caboche/?color=3358","https://www.foscarini.com/it/products/ta-buds-2/?color=3354","https://www.foscarini.com/it/products/aplomb/?color=3594","https://www.foscarini.com/it/products/te-twiggy/?color=3369","https://www.foscarini.com/it/products/ta-filo/?color=3380","https://www.foscarini.com/it/products/cri-cri/?color=3359","https://www.foscarini.com/it/products/sos-spokes-2-large/?color=3352","https://www.foscarini.com/it/products/te-birdie-lettura/?color=3345","https://www.foscarini.com/it/products/sos-chouchin-2/?color=3361","https://www.foscarini.com/it/products/ta-lumiere/?color=3348","https://www.foscarini.com/it/products/sos-rituals-xl/?color=3348","https://www.foscarini.com/it/products/sos-spokes-1/?color=3348","https://www.foscarini.com/it/products/ta-satellight/?color=3388","https://www.foscarini.com/it/products/twiggy-grid-sospensione/?color=3369","https://www.foscarini.com/it/products/sos-big-bang/?color=3359","https://www.foscarini.com/it/products/pa-bahia/?color=3622","https://www.foscarini.com/it/products/ta-kurage/?color=3348","https://www.foscarini.com/it/products/sos-le-soleil/?color=3348","https://www.foscarini.com/it/products/te-tress/?color=3370","https://www.foscarini.com/it/products/sos-allegro-assai/?color=3358","https://www.foscarini.com/it/products/sos-aplomb-mini/?color=3348","https://www.foscarini.com/it/products/ta-gem/?color=3348","https://www.foscarini.com/it/products/te-twice-as-twiggy/?color=3369","https://www.foscarini.com/it/products/sos-dolmen/?color=3399","https://www.foscarini.com/it/products/ta-birdie/?color=3341","https://www.foscarini.com/it/products/sos-rituals-3/?color=3348","https://www.foscarini.com/it/products/ta-lumiere-25th/?color=3393","https://www.foscarini.com/it/products/sos-chouchin-reverse-1/?color=3376","https://www.foscarini.com/it/products/te-orbital/?color=3351","https://www.foscarini.com/it/products/te-filo/?color=3380","https://www.foscarini.com/it/products/sos-plass/?color=3347","https://www.foscarini.com/it/products/sos-tartan/?color=3354","https://www.foscarini.com/it/products/te-havana/?color=3348","https://www.foscarini.com/it/products/sos-aplomb-large/?color=3348","https://www.foscarini.com/it/products/sos-tress-grande/?color=3357","https://www.foscarini.com/it/products/out-uto/?color=3352","https://www.foscarini.com/it/products/pa-birdie/?color=3348","https://www.foscarini.com/it/products/pa-lake/?color=3346","https://www.foscarini.com/it/products/ta-lumiere-xx/?color=3348","https://www.foscarini.com/it/products/sos-buds-2/?color=3354","https://www.foscarini.com/it/products/te-giga-lite/?color=3357","https://www.foscarini.com/it/products/ta-caboche/?color=3358","https://www.foscarini.com/it/products/sos-tite-1/?color=3357","https://www.foscarini.com/it/products/ta-binic/?color=3373","https://www.foscarini.com/it/products/sos-twice-as-twiggy/?color=3357","https://www.foscarini.com/it/products/sos-spokes-2/?color=3367","https://www.foscarini.com/it/products/out-gregg-sospensione","https://www.foscarini.com/it/products/sos-rituals-2/?color=3348","https://www.foscarini.com/it/products/ta-buds-3/?color=3374","https://www.foscarini.com/it/products/sos-maki/?color=3354","https://www.foscarini.com/it/products/te-lumiere-xxl/?color=3391","https://www.foscarini.com/it/products/sos-tress/?color=3372","https://www.foscarini.com/it/products/sos-caiigo/?color=3395","https://www.foscarini.com/it/products/sos-satellight/?color=3388","https://www.foscarini.com/it/products/pa-caboche/?color=3360","https://www.foscarini.com/it/products/ta-uto/?color=3352","https://www.foscarini.com/it/products/te-dolmen/?color=3363","https://www.foscarini.com/it/products/sos-twiggy/?color=3348","https://www.foscarini.com/it/products/sos-buds-3/?color=3374","https://www.foscarini.com/it/products/te-magneto/?color=3357","https://www.foscarini.com/it/products/te-caboche/?color=3358","https://www.foscarini.com/it/products/pa-bahia-mini/?color=3622","https://www.foscarini.com/it/products/sos-arumi/?color=3342","https://www.foscarini.com/it/products/sos-uto/?color=3348","https://www.foscarini.com/it/products/te-tress-stilo/?color=3348","https://www.foscarini.com/it/products/sos-allegro-ritmico/?color=3389","https://www.foscarini.com/it/products/pa-lumiere-xx/?color=3348","https://www.foscarini.com/it/products/pa-filo/?color=3379","https://www.foscarini.com/it/products/sof-twiggy/?color=3348","https://www.foscarini.com/it/products/sos-havana/?color=3348","https://www.foscarini.com/it/products/sos-allegretto-vivace/?color=3367","https://www.foscarini.com/it/products/ta-buds-1/?color=3374","https://www.foscarini.com/it/products/sos-tite-2/?color=3357","https://www.foscarini.com/it/products/pa-satellight/?color=3388","https://www.foscarini.com/it/products/ta-plass/?color=3347","https://www.foscarini.com/it/products/ta-magneto/?color=3617","https://www.foscarini.com/it/products/ta-rituals-3/?color=3348","https://www.foscarini.com/it/products/sos-birdie/?color=3354","https://www.foscarini.com/it/products/sos-buds-1/?color=3355","https://www.foscarini.com/it/products/te-twiggy-lettura/?color=3348","https://www.foscarini.com/it/products/ta-behive/?color=3348","https://www.foscarini.com/it/products/ta-rituals-xl/?color=3348","https://www.foscarini.com/it/products/pa-big-bang/?color=3359","https://www.foscarini.com/it/products/ta-twiggy-xl/?color=3348","https://www.foscarini.com/it/products/sos-tress-stilo/?color=3348","https://www.foscarini.com/it/products/sos-allegro-vivace/?color=3367","https://www.foscarini.com/it/products/ta-rituals-1/?color=3348","https://www.foscarini.com/it/products/pa-innerlight/?color=3348","https://www.foscarini.com/it/products/sos-chouchin-1/?color=3345","https://www.foscarini.com/it/products/sos-allegretto-ritmico/?color=3389","https://www.foscarini.com/it/products/ta-poly-gregg/?color=3348","https://www.foscarini.com/it/products/sos-chouchin-3/?color=3354","https://www.foscarini.com/it/products/sof-nuage/?color=3348","https://www.foscarini.com/it/products/sos-lightweight/?color=3344","https://www.foscarini.com/it/products/out-havana-sospensione/?color=3348","https://www.foscarini.com/it/products/sos-gem/?color=3348","https://www.foscarini.com/it/products/sof-rituals-1/?color=3348","https://www.foscarini.com/it/products/ta-anisha/?color=3348","https://www.foscarini.com/it/products/sos-chouchin-reverse-2/?color=3349","https://www.foscarini.com/it/products/ta-gregg/?color=3620","https://www.foscarini.com/it/products/sof-folio/?color=3348","https://www.foscarini.com/it/products/out-gregg-terra/?color=3348","https://www.foscarini.com/it/products/out-havana-terra/?color=3348","https://www.foscarini.com/it/products/pa-bit/?color=3351","https://www.foscarini.com/it/products/pa-tress/?color=3348","https://www.foscarini.com/it/products/sos-supernova/?color=3365","https://www.foscarini.com/it/products/sos-allegretto-assai/?color=3358","https://www.foscarini.com/it/products/sos-troag/?color=3366","https://www.foscarini.com/it/products/sos-giga-lite/?color=3357","https://www.foscarini.com/it/products/sof-caboche/?color=3360","https://www.foscarini.com/it/products/pa-gregg/?color=3348","https://www.foscarini.com/it/products/sof-rituals-2/?color=3348","https://www.foscarini.com/it/products/pa-kite/?color=3357","https://www.foscarini.com/it/products/sof-bahia-mini/?color=3622","https://www.foscarini.com/it/products/sof-rituals-3/?color=3348","https://www.foscarini.com/it/products/sos-chouchin-reverse-3/?color=3377","https://www.foscarini.com/it/products/sos-o-space/?color=3348","https://www.foscarini.com/it/products/pa-fields/?color=3348","https://www.foscarini.com/it/products/pa-le-soleil/?color=3359","https://www.foscarini.com/it/products/sos-rituals-1/?color=3348","https://www.foscarini.com/it/products/sof-lumiere-xx/?color=3348","https://www.foscarini.com/it/products/out-solar/?color=3355","https://www.foscarini.com/it/products/pa-rituals-1/?color=3348","https://www.foscarini.com/it/products/sof-birdie/?color=3343","https://www.foscarini.com/it/products/sof-gregg/?color=3348","https://www.foscarini.com/it/products/pa-circus/?color=3348","https://www.foscarini.com/it/products/pa-nuage/?color=3348","https://www.foscarini.com/it/products/pa-havana/?color=3348","https://www.foscarini.com/it/products/sof-bahia/?color=3621","https://www.foscarini.com/it/products/pa-aplomb/?color=3354","https://www.foscarini.com/it/products/sof-big-bang/?color=3348","https://www.foscarini.com/it/products/pa-rituals-3/?color=3348","https://www.foscarini.com/it/products/sos-behive/?color=3348","https://www.foscarini.com/it/products/te-gregg/?color=3348","https://www.foscarini.com/it/products/pa-blob-s/?color=3348","https://www.foscarini.com/it/products/pa-double/?color=3346","https://www.foscarini.com/it/products/pa-folio/?color=3348","https://www.foscarini.com/it/products/pa-tutu/?color=3348","https://www.foscarini.com/it/products/sof-circus/?color=3348","https://www.foscarini.com/it/products/sof-blob-s/?color=3348","https://www.foscarini.com/it/products/te-tuareg/?color=3357","https://www.foscarini.com/it/products/sos-allegretto-assai/","https://www.foscarini.com/it/products/sos-allegretto-ritmico/","https://www.foscarini.com/it/products/sos-allegretto-vivace/","https://www.foscarini.com/it/products/sos-allegro-assai/","https://www.foscarini.com/it/products/sos-allegro-ritmico/","https://www.foscarini.com/it/products/sos-allegro-vivace/","https://www.foscarini.com/it/products/ta-anisha/","https://www.foscarini.com/it/products/pa-aplomb/","https://www.foscarini.com/it/products/aplomb/","https://www.foscarini.com/it/products/sos-aplomb/","https://www.foscarini.com/it/products/sos-aplomb-large/","https://www.foscarini.com/it/products/sos-aplomb-mini/","https://www.foscarini.com/it/products/sos-arumi/","https://www.foscarini.com/it/products/sof-bahia/","https://www.foscarini.com/it/products/pa-bahia/","https://www.foscarini.com/it/products/pa-bahia-mini/","https://www.foscarini.com/it/products/sof-bahia-mini/","https://www.foscarini.com/it/products/ta-behive/","https://www.foscarini.com/it/products/sos-behive/","https://www.foscarini.com/it/products/pa-big-bang/","https://www.foscarini.com/it/products/sof-big-bang/","https://www.foscarini.com/it/products/sos-big-bang/","https://www.foscarini.com/it/products/ta-binic/","https://www.foscarini.com/it/products/pa-birdie/","https://www.foscarini.com/it/products/sos-birdie/","https://www.foscarini.com/it/products/sof-birdie/","https://www.foscarini.com/it/products/ta-birdie/","https://www.foscarini.com/it/products/te-birdie-lettura/","https://www.foscarini.com/it/products/pa-bit/","https://www.foscarini.com/it/products/pa-blob-s/","https://www.foscarini.com/it/products/sof-blob-s/","https://www.foscarini.com/it/products/ta-buds-1/","https://www.foscarini.com/it/products/sos-buds-1/","https://www.foscarini.com/it/products/sos-buds-2/","https://www.foscarini.com/it/products/ta-buds-2/","https://www.foscarini.com/it/products/ta-buds-3/","https://www.foscarini.com/it/products/sos-buds-3/","https://www.foscarini.com/it/products/ta-caboche/","https://www.foscarini.com/it/products/pa-caboche/","https://www.foscarini.com/it/products/te-caboche/","https://www.foscarini.com/it/products/sof-caboche/","https://www.foscarini.com/it/products/sos-caboche/","https://www.foscarini.com/it/products/sos-caiigo/","https://www.foscarini.com/it/products/sos-chouchin-1/","https://www.foscarini.com/it/products/sos-chouchin-2/","https://www.foscarini.com/it/products/sos-chouchin-3/","https://www.foscarini.com/it/products/sos-chouchin-reverse-1/","https://www.foscarini.com/it/products/sos-chouchin-reverse-2/","https://www.foscarini.com/it/products/sos-chouchin-reverse-3/","https://www.foscarini.com/it/products/pa-circus/","https://www.foscarini.com/it/products/sof-circus/","https://www.foscarini.com/it/products/cri-cri/","https://www.foscarini.com/it/products/te-dolmen/","https://www.foscarini.com/it/products/sos-dolmen/","https://www.foscarini.com/it/products/pa-double/","https://www.foscarini.com/it/products/pa-fields/","https://www.foscarini.com/it/products/te-filo/","https://www.foscarini.com/it/products/pa-filo/","https://www.foscarini.com/it/products/ta-filo/","https://www.foscarini.com/it/products/sof-folio/","https://www.foscarini.com/it/products/pa-folio/","https://www.foscarini.com/it/products/sos-gem/","https://www.foscarini.com/it/products/ta-gem/","https://www.foscarini.com/it/products/te-giga-lite/","https://www.foscarini.com/it/products/sos-giga-lite/","https://www.foscarini.com/it/products/ta-gregg/","https://www.foscarini.com/it/products/pa-gregg/","https://www.foscarini.com/it/products/sof-gregg/","https://www.foscarini.com/it/products/te-gregg/","https://www.foscarini.com/it/products/sos-gregg/","https://www.foscarini.com/it/products/out-gregg-sospensione/","https://www.foscarini.com/it/products/out-gregg-terra/","https://www.foscarini.com/it/products/te-havana/","https://www.foscarini.com/it/products/sos-havana/","https://www.foscarini.com/it/products/pa-havana/","https://www.foscarini.com/it/products/out-havana-sospensione/","https://www.foscarini.com/it/products/out-havana-terra/","https://www.foscarini.com/it/products/pa-innerlight/","https://www.foscarini.com/it/products/pa-kite/","https://www.foscarini.com/it/products/ta-kurage/","https://www.foscarini.com/it/products/pa-lake/","https://www.foscarini.com/it/products/pa-le-soleil/","https://www.foscarini.com/it/products/sos-le-soleil/","https://www.foscarini.com/it/products/sos-lightweight/","https://www.foscarini.com/it/products/ta-lumiere/","https://www.foscarini.com/it/products/ta-lumiere-25th/","https://www.foscarini.com/it/products/ta-lumiere-xx/","https://www.foscarini.com/it/products/pa-lumiere-xx/","https://www.foscarini.com/it/products/sof-lumiere-xx/","https://www.foscarini.com/it/products/te-lumiere-xxl/","https://www.foscarini.com/it/products/te-magneto/","https://www.foscarini.com/it/products/ta-magneto/","https://www.foscarini.com/it/products/sos-maki/","https://www.foscarini.com/it/products/te-mite/","https://www.foscarini.com/it/products/sof-nuage/","https://www.foscarini.com/it/products/pa-nuage/","https://www.foscarini.com/it/products/sos-o-space/","https://www.foscarini.com/it/products/te-orbital/","https://www.foscarini.com/it/products/sos-plass/","https://www.foscarini.com/it/products/ta-plass/","https://www.foscarini.com/it/products/plena/","https://www.foscarini.com/it/products/ta-poly-gregg/","https://www.foscarini.com/it/products/ta-rituals-1/","https://www.foscarini.com/it/products/sof-rituals-1/","https://www.foscarini.com/it/products/sos-rituals-1/","https://www.foscarini.com/it/products/pa-rituals-1/","https://www.foscarini.com/it/products/sos-rituals-2/","https://www.foscarini.com/it/products/sof-rituals-2/","https://www.foscarini.com/it/products/ta-rituals-2/","https://www.foscarini.com/it/products/ta-rituals-3/","https://www.foscarini.com/it/products/sof-rituals-3/","https://www.foscarini.com/it/products/pa-rituals-3/","https://www.foscarini.com/it/products/sos-rituals-3/","https://www.foscarini.com/it/products/ta-rituals-xl/","https://www.foscarini.com/it/products/sos-rituals-xl/","https://www.foscarini.com/it/products/sos-satellight/","https://www.foscarini.com/it/products/pa-satellight/","https://www.foscarini.com/it/products/ta-satellight/","https://www.foscarini.com/it/products/soffio/","https://www.foscarini.com/it/products/out-solar/","https://www.foscarini.com/it/products/sos-spokes-1/","https://www.foscarini.com/it/products/sos-spokes-2/","https://www.foscarini.com/it/products/sos-spokes-2-large/","https://www.foscarini.com/it/products/superficie/","https://www.foscarini.com/it/products/sos-supernova/","https://www.foscarini.com/it/products/sos-tartan/","https://www.foscarini.com/it/products/sos-tite-1/","https://www.foscarini.com/it/products/sos-tite-2/","https://www.foscarini.com/it/products/sos-tress/","https://www.foscarini.com/it/products/pa-tress/","https://www.foscarini.com/it/products/te-tress/","https://www.foscarini.com/it/products/sos-tress-grande/","https://www.foscarini.com/it/products/te-tress-stilo/","https://www.foscarini.com/it/products/sos-tress-stilo/","https://www.foscarini.com/it/products/sos-troag/","https://www.foscarini.com/it/products/te-tuareg/","https://www.foscarini.com/it/products/pa-tutu/","https://www.foscarini.com/it/products/sos-twice-as-twiggy/","https://www.foscarini.com/it/products/te-twice-as-twiggy/","https://www.foscarini.com/it/products/sos-twiggy/","https://www.foscarini.com/it/products/sof-twiggy/","https://www.foscarini.com/it/products/te-twiggy/","https://www.foscarini.com/it/products/twiggy-grid-sospensione/","https://www.foscarini.com/it/products/twiggy-grid-terra/","https://www.foscarini.com/it/products/te-twiggy-lettura/","https://www.foscarini.com/it/products/ta-twiggy-xl/","https://www.foscarini.com/it/products/out-uto/","https://www.foscarini.com/it/products/ta-uto/","https://www.foscarini.com/it/products/sos-uto/","https://www.foscarini.com/it/products/sos-allegretto-assai/","https://www.foscarini.com/it/products/sos-allegretto-ritmico/","https://www.foscarini.com/it/products/sos-allegretto-vivace/","https://www.foscarini.com/it/products/sos-allegro-assai/","https://www.foscarini.com/it/products/sos-allegro-ritmico/","https://www.foscarini.com/it/products/sos-allegro-vivace/","https://www.foscarini.com/it/products/ta-anisha/","https://www.foscarini.com/it/products/pa-aplomb/","https://www.foscarini.com/it/products/aplomb/","https://www.foscarini.com/it/products/sos-aplomb/","https://www.foscarini.com/it/products/sos-aplomb-large/","https://www.foscarini.com/it/products/sos-aplomb-mini/","https://www.foscarini.com/it/products/sos-arumi/","https://www.foscarini.com/it/products/sof-bahia/","https://www.foscarini.com/it/products/pa-bahia/","https://www.foscarini.com/it/products/pa-bahia-mini/","https://www.foscarini.com/it/products/sof-bahia-mini/","https://www.foscarini.com/it/products/ta-behive/","https://www.foscarini.com/it/products/sos-behive/","https://www.foscarini.com/it/products/pa-big-bang/","https://www.foscarini.com/it/products/sof-big-bang/","https://www.foscarini.com/it/products/sos-big-bang/","https://www.foscarini.com/it/products/ta-binic/","https://www.foscarini.com/it/products/pa-birdie/","https://www.foscarini.com/it/products/sos-birdie/","https://www.foscarini.com/it/products/sof-birdie/","https://www.foscarini.com/it/products/ta-birdie/","https://www.foscarini.com/it/products/te-birdie-lettura/","https://www.foscarini.com/it/products/pa-bit/","https://www.foscarini.com/it/products/pa-blob-s/","https://www.foscarini.com/it/products/sof-blob-s/","https://www.foscarini.com/it/products/ta-buds-1/","https://www.foscarini.com/it/products/sos-buds-1/","https://www.foscarini.com/it/products/sos-buds-2/","https://www.foscarini.com/it/products/ta-buds-2/","https://www.foscarini.com/it/products/ta-buds-3/","https://www.foscarini.com/it/products/sos-buds-3/","https://www.foscarini.com/it/products/ta-caboche/","https://www.foscarini.com/it/products/pa-caboche/","https://www.foscarini.com/it/products/te-caboche/","https://www.foscarini.com/it/products/sof-caboche/","https://www.foscarini.com/it/products/sos-caboche/","https://www.foscarini.com/it/products/sos-caiigo/","https://www.foscarini.com/it/products/sos-chouchin-1/","https://www.foscarini.com/it/products/sos-chouchin-2/","https://www.foscarini.com/it/products/sos-chouchin-3/","https://www.foscarini.com/it/products/sos-chouchin-reverse-1/","https://www.foscarini.com/it/products/sos-chouchin-reverse-2/","https://www.foscarini.com/it/products/sos-chouchin-reverse-3/","https://www.foscarini.com/it/products/pa-circus/","https://www.foscarini.com/it/products/sof-circus/","https://www.foscarini.com/it/products/cri-cri/","https://www.foscarini.com/it/products/te-dolmen/","https://www.foscarini.com/it/products/sos-dolmen/","https://www.foscarini.com/it/products/pa-double/","https://www.foscarini.com/it/products/pa-fields/","https://www.foscarini.com/it/products/te-filo/","https://www.foscarini.com/it/products/pa-filo/","https://www.foscarini.com/it/products/ta-filo/","https://www.foscarini.com/it/products/sof-folio/","https://www.foscarini.com/it/products/pa-folio/","https://www.foscarini.com/it/products/sos-gem/","https://www.foscarini.com/it/products/ta-gem/","https://www.foscarini.com/it/products/te-giga-lite/","https://www.foscarini.com/it/products/sos-giga-lite/","https://www.foscarini.com/it/products/ta-gregg/","https://www.foscarini.com/it/products/pa-gregg/","https://www.foscarini.com/it/products/sof-gregg/","https://www.foscarini.com/it/products/te-gregg/","https://www.foscarini.com/it/products/sos-gregg/","https://www.foscarini.com/it/products/out-gregg-sospensione/","https://www.foscarini.com/it/products/out-gregg-terra/","https://www.foscarini.com/it/products/te-havana/","https://www.foscarini.com/it/products/sos-havana/","https://www.foscarini.com/it/products/pa-havana/","https://www.foscarini.com/it/products/out-havana-sospensione/","https://www.foscarini.com/it/products/out-havana-terra/","https://www.foscarini.com/it/products/pa-innerlight/","https://www.foscarini.com/it/products/pa-kite/","https://www.foscarini.com/it/products/ta-kurage/","https://www.foscarini.com/it/products/pa-lake/","https://www.foscarini.com/it/products/pa-le-soleil/","https://www.foscarini.com/it/products/sos-le-soleil/","https://www.foscarini.com/it/products/sos-lightweight/","https://www.foscarini.com/it/products/ta-lumiere/","https://www.foscarini.com/it/products/ta-lumiere-25th/","https://www.foscarini.com/it/products/ta-lumiere-xx/","https://www.foscarini.com/it/products/pa-lumiere-xx/","https://www.foscarini.com/it/products/sof-lumiere-xx/","https://www.foscarini.com/it/products/te-lumiere-xxl/","https://www.foscarini.com/it/products/te-magneto/","https://www.foscarini.com/it/products/ta-magneto/","https://www.foscarini.com/it/products/sos-maki/","https://www.foscarini.com/it/products/te-mite/","https://www.foscarini.com/it/products/sof-nuage/","https://www.foscarini.com/it/products/pa-nuage/","https://www.foscarini.com/it/products/sos-o-space/","https://www.foscarini.com/it/products/te-orbital/","https://www.foscarini.com/it/products/sos-plass/","https://www.foscarini.com/it/products/ta-plass/","https://www.foscarini.com/it/products/plena/","https://www.foscarini.com/it/products/ta-poly-gregg/","https://www.foscarini.com/it/products/ta-rituals-1/","https://www.foscarini.com/it/products/sof-rituals-1/","https://www.foscarini.com/it/products/sos-rituals-1/","https://www.foscarini.com/it/products/pa-rituals-1/","https://www.foscarini.com/it/products/sos-rituals-2/","https://www.foscarini.com/it/products/sof-rituals-2/","https://www.foscarini.com/it/products/ta-rituals-2/","https://www.foscarini.com/it/products/ta-rituals-3/","https://www.foscarini.com/it/products/sof-rituals-3/","https://www.foscarini.com/it/products/pa-rituals-3/","https://www.foscarini.com/it/products/sos-rituals-3/","https://www.foscarini.com/it/products/ta-rituals-xl/","https://www.foscarini.com/it/products/sos-rituals-xl/","https://www.foscarini.com/it/products/sos-satellight/","https://www.foscarini.com/it/products/pa-satellight/","https://www.foscarini.com/it/products/ta-satellight/","https://www.foscarini.com/it/products/soffio/","https://www.foscarini.com/it/products/out-solar/","https://www.foscarini.com/it/products/sos-spokes-1/","https://www.foscarini.com/it/products/sos-spokes-2/","https://www.foscarini.com/it/products/sos-spokes-2-large/","https://www.foscarini.com/it/products/superficie/","https://www.foscarini.com/it/products/sos-supernova/","https://www.foscarini.com/it/products/sos-tartan/","https://www.foscarini.com/it/products/sos-tite-1/","https://www.foscarini.com/it/products/sos-tite-2/","https://www.foscarini.com/it/products/sos-tress/","https://www.foscarini.com/it/products/pa-tress/","https://www.foscarini.com/it/products/te-tress/","https://www.foscarini.com/it/products/sos-tress-grande/","https://www.foscarini.com/it/products/te-tress-stilo/","https://www.foscarini.com/it/products/sos-tress-stilo/","https://www.foscarini.com/it/products/sos-troag/","https://www.foscarini.com/it/products/te-tuareg/","https://www.foscarini.com/it/products/pa-tutu/","https://www.foscarini.com/it/products/sos-twice-as-twiggy/","https://www.foscarini.com/it/products/te-twice-as-twiggy/","https://www.foscarini.com/it/products/sos-twiggy/","https://www.foscarini.com/it/products/sof-twiggy/","https://www.foscarini.com/it/products/te-twiggy/","https://www.foscarini.com/it/products/twiggy-grid-sospensione/","https://www.foscarini.com/it/products/twiggy-grid-terra/","https://www.foscarini.com/it/products/te-twiggy-lettura/","https://www.foscarini.com/it/products/ta-twiggy-xl/","https://www.foscarini.com/it/products/out-uto/","https://www.foscarini.com/it/products/ta-uto/","https://www.foscarini.com/it/products/sos-uto/",

];

/*
arr_all_products = ["https://www.foscarini.com/it/products/plena/?color=3348","https://www.foscarini.com/it/products/soffio/?color=3609","https://www.foscarini.com/it/products/superficie/?color=3348","https://www.foscarini.com/it/products/sos-aplomb/?color=3390","https://www.foscarini.com/it/products/ta-rituals-2/?color=3348"];
*/

// elimino eventuali doppioni
arr_all_products = _.uniq(arr_all_products);
var pages_number = arr_all_products.length;

var info = [];

var index = 0;

avvia(index);

function avvia(index){



    if(index == pages_number){
        fs.writeFile('site_info_remote.json', JSON.stringify(info, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var uri = arr_all_products[index];
        _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: uri,
            //uri : "https://www.foscarini.com/it/products/ta-twiggy-xl/",

        }, function(error, response, body) {
            createJsonFromAPage(body, uri);
        });

    }
}









function createJsonFromAPage(body, uri){

    var $body = $(body);
    //_.log(body)

    





    // memorizzo e rimuovo il container delle foto di eventuali prodotti correlati
    var $other_prod = $body.find(".alternate-products").clone();
        $body.find(".alternate-products").remove();
    var related_imgs = [];
        
        $other_prod.find(".item").each(function(){
            var model = $(this).find("h4").html().toUpperCase();
            var category = $(this).find("h5").html().toUpperCase();
            var img = $(this).find("img").attr("src");
            var size = (img.toLowerCase().indexOf("grande") != -1)? "grande" : (img.toLowerCase().indexOf("piccola") != -1)? "piccola" : (img.toLowerCase().indexOf("media") != -1)? "media" : undefined;
            related_imgs.push({
                model: model,
                category : category,
                url: img,
                size: size,
            })
        })
    
    

    // memorizzo e rimuovo il container dei dati tecnici
    var $specs = $body.find(".specs").clone();
    $body.find(".specs").remove();
    var specs_arr = [];
        $specs.find(".inner .tabs ul li").each(function(){
            let specs_model = $(this).html().toUpperCase();
            let index = $(this).index();
            let $panel = $(this).parents(".inner").find(".panel .variant").eq(index);

            let $col1 = $panel.find(".columns .col").eq(0);
            let light_schema = $col1.find("img").eq(0).attr("data-src");

            let $col2 = $panel.find(".columns .col").eq(1);

            let $material_ul = $col2.find(".group").eq(0).find("ul");
            let material = "";
            $material_ul.find("li").each(function(){ material += $(this).html()+" "})

            let $source_ul = $col2.find(".group").eq(1).find("ul");
            let source_pulita = S($source_ul.html()).replaceAll("\n","").replaceAll("\t","").s;
            let commento = S(source_pulita).between("<!--","-->").s;
                source_pulita = source_pulita.replace(commento,"").replace("<!---->  ","").replace('<li style=\"margin-bottom: 15px;\">','').replace('<div style=\"margin-top: 15px; margin-bottom: 25px;\">','').replace("</li>","").replace("</div>","")
            let source = source_pulita;
            

            

            let $download_ul = $col2.find(".group.dl ul");
            let downloads = [];
            $download_ul.find("li").each(function(){
                var label = ( $(this).find("a").text().indexOf("scheda") != -1) ? "data_sheet" : ( $(this).find("a").text().indexOf("curve") != -1) ? "light_curves" : ( $(this).find("a").text().indexOf("istruzioni") != -1) ? "instructions" : "drawings";

                // qui in seguito ho capito che il primo link è un pdf gli altri sono solo link a pagine html
                // quindi prendo solo il primo e il secondo (terzo e quarto sono identici al secondo)
                if(label == "data_sheet")
                    downloads.push({
                        label : label,
                        url : $(this).find("a").attr("href"),
                    })
                if(label == "light_curves")
                    downloads.push({
                        label : "more",
                        link : $(this).find("a").attr("href"),
                    })
            })


            specs_arr.push({
                model: specs_model,
                light_schema: light_schema,
                material: material,
                //source: source, // non so perchè prima riuscivo a parserizzare bene questi dati, poi si è rotto.... se serve rifacciamo la funzione $source_ul
                downloads : downloads,
            })

            
        })

    

    

    var model = $body.find(".cover .wrapper h4").html().toUpperCase();
    var category = $body.find(".cover .wrapper h5").html().toUpperCase();

    // descrizione
    var desc = $body.find(".image-description p").html();

    // immagini nel carousel
    var $car_imgs = $body.find(".carousel .bg");
    var car_imgs_arr = [];
    $car_imgs.each(function(){
        var attr_style = $(this).attr("style");
        car_imgs_arr.push(S(attr_style).between("(",")").s);
    });


    // video
    var $iframe = $body.find("iframe");
    var video_url;
    if( $iframe.length > 0 ){
        video_url = $iframe.attr("src");
    }

    // immagini nascoste
    var $projects = $body.find('a[data-overlay="gallery-projects"]');
    var projects = [];
    $projects.each(function(){
        var attr_href = $(this).attr("href");
        projects.push(attr_href);
    });

    // immagini spuree
    var $imgs = $body.find("img");
    
    var imgs_arr = [];
    $imgs.each(function(){
        if( _.is($(this).attr("data-src")) ){
            var url = $(this).attr("data-src");
            // elimino immagini del tema wordpress
            if( url.indexOf("themes/foscarini/assets") == -1)
                imgs_arr.push(url);
        }
           
        if( _.is($(this).attr("src")) ){
            var url = $(this).attr("src");
            // elimino immagini del tema wordpress
            if( url.indexOf("themes/foscarini/assets") == -1)
                imgs_arr.push(url);
        }
            
    });
        
    info.push({
        model : model,
        uri: uri,
        category: category,
        desc: desc,
        carousel: car_imgs_arr,
        video : video_url,
        other_imgs : imgs_arr,
        projects: projects,
        related_imgs : related_imgs,
        specs: specs_arr 
    })
    

    index++;
    
    avvia(index);
    

}