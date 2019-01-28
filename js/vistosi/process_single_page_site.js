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


// questo è l'array di tutti gli oggetti pagina devi copiarlo/incollarlo da all_products_single_pages.json
var single_pages = [
    {
        "model": "24pearls",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/24pearls/sospensione.html",
        "desc": "Caratterizzano questa collezione due corolle di sfere in vetro soffiato nei colori bianco e cromato, disposte sugli anelli della montatura a due livelli, per creare un caleidoscopico effetto di luce e riflessi."
    },
    {
        "model": "accademia",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/accademia/soffitto.html",
        "desc": "Riprende la forma classica della foglia, ma l'arricchisce di una nuova decorazione a fili di vetro, con il bordo in vetro fuso, coniugando così la bellezza di un effetto luminoso unico alla funzionalità della sorgente nascosta."
    },
    {
        "model": "accademia",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/accademia/parete.html",
        "desc": "Riprende la forma classica della foglia, ma l'arricchisce di una nuova decorazione a fili di vetro, con il bordo in vetro fuso, coniugando così la bellezza di un effetto luminoso unico alla funzionalità della sorgente nascosta."
    },
    {
        "model": "alega",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/alega/tavolo.html",
        "desc": "Ispirazione retro e idea del classico nello stesso design."
    },
    {
        "model": "aliki",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/aliki/soffitto.html",
        "desc": "Modello caratterizzato dalla forma a base conica e dal taglio ovoidale, in vetro soffiato satinato."
    },
    {
        "model": "aliki",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/aliki/sospensione.html",
        "desc": "Modello caratterizzato dalla forma a base conica e dal taglio ovoidale, in vetro soffiato satinato."
    },
    {
        "model": "aliki",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/aliki/parete.html",
        "desc": "Modello caratterizzato dalla forma a base conica e dal taglio ovoidale, in vetro soffiato satinato."
    },
    {
        "model": "alma",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/alma/sospensione.html",
        "desc": "Un design peculiare che si adatta a qualsiasi tipo di arredamento."
    },
    {
        "model": "alma",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/alma/parete.html",
        "desc": "Un design peculiare che si adatta a qualsiasi tipo di arredamento."
    },
    {
        "model": "alum",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/alum/sospensione.html",
        "desc": "Linee essenziali per il paralume semicircolare di questa collezione, impreziosito dall'esclusiva finitura a specchio.&nbsp;"
    },
    {
        "model": "alum",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/alum/parete.html",
        "desc": "Linee essenziali per il paralume semicircolare di questa collezione, impreziosito dall'esclusiva finitura a specchio.&nbsp;"
    },
    {
        "model": "alum09",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/alum09/soffitto.html",
        "desc": "Linee essenziali per il paralume semicircolare di questa collezione, impreziosito dall'esclusiva finitura a specchio.&nbsp;"
    },
    {
        "model": "alum09",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/alum09/sospensione.html",
        "desc": "Linee essenziali per il paralume semicircolare di questa collezione, impreziosito dall'esclusiva finitura a specchio.&nbsp;"
    },
    {
        "model": "alum09",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/alum09/parete.html",
        "desc": "Linee essenziali per il paralume semicircolare di questa collezione, impreziosito dall'esclusiva finitura a specchio.&nbsp;"
    },
    {
        "model": "aria",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/aria/sospensione.html",
        "desc": "Collezione di lampade a sospensione ed a plafone in vetro soffiato a bocca all'interno di una gabbia di acciaio. La tecnica di soffiaggio libera rende ciascuna lampada sempre diversa."
    },
    {
        "model": "assiba",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/assiba/soffitto.html",
        "desc": "Collezione ispirata a forme, colori e texture dell'oceano."
    },
    {
        "model": "assiba",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/assiba/sospensione.html",
        "desc": "Collezione ispirata a forme, colori e texture dell'oceano."
    },
    {
        "model": "assiba",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/assiba/parete.html",
        "desc": "Collezione ispirata a forme, colori e texture dell'oceano."
    },
    {
        "model": "assiba",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/assiba/tavolo.html",
        "desc": "Collezione ispirata a forme, colori e texture dell'oceano."
    },
    {
        "model": "aurea",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/aurea/sospensione.html",
        "desc": "Linea ispirata dalla forma sferica di un tipo di molecole di carbonio, i fullereni."
    },
    {
        "model": "aurora",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/aurora/soffitto.html",
        "desc": "Un modello dalla forma lenticolare che può essere usato come plafoniera o lampada da parete."
    },
    {
        "model": "aurora",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/aurora/sospensione.html",
        "desc": "Un modello dalla forma lenticolare che può essere usato come plafoniera o lampada da parete."
    },
    {
        "model": "aurora",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/aurora/parete.html",
        "desc": "Un modello dalla forma lenticolare che può essere usato come plafoniera o lampada da parete."
    },
    {
        "model": "baco",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/baco/sospensione.html",
        "desc": "Esclusiva sospensione a forma di lacrima, soffiata a bocca con una tecnica che trascolora il vetro di Murano dai toni del bianco al trasparente."
    },
    {
        "model": "baco",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/baco/parete.html",
        "desc": "Esclusiva sospensione a forma di lacrima, soffiata a bocca con una tecnica che trascolora il vetro di Murano dai toni del bianco al trasparente."
    },
    {
        "model": "bacona",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/bacona/sospensione.html",
        "desc": "Esclusiva sospensione a forma di lacrima, soffiata a bocca con una tecnica che trascolora il vetro di Murano dai toni del bianco al trasparente."
    },
    {
        "model": "bacona",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/bacona/parete.html",
        "desc": "Esclusiva sospensione a forma di lacrima, soffiata a bocca con una tecnica che trascolora il vetro di Murano dai toni del bianco al trasparente."
    },
    {
        "model": "balance",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/balance/soffitto.html",
        "desc": "La traiettoria delle orbite planetarie intorno al sole ispira questa collezione, che ripropone il movimento creato dall'armonia e dall'equilibrio di forze invisibili con vetro e luce."
    },
    {
        "model": "balance",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/balance/sospensione.html",
        "desc": "La traiettoria delle orbite planetarie intorno al sole ispira questa collezione, che ripropone il movimento creato dall'armonia e dall'equilibrio di forze invisibili con vetro e luce."
    },
    {
        "model": "balance",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/balance/parete.html",
        "desc": "La traiettoria delle orbite planetarie intorno al sole ispira questa collezione, che ripropone il movimento creato dall'armonia e dall'equilibrio di forze invisibili con vetro e luce."
    },
    {
        "model": "bauta",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/bauta/sospensione.html",
        "desc": "Ispirata alla tradizionale maschera veneziana di cui porta il nome, combina nel diffusore una parte superiore in cristallo ed una inferiore satinata, rappresentando un elegante punto di luce per qualsiasi ambiente."
    },
    {
        "model": "bianca",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/bianca/soffitto.html",
        "desc": "Collezione versatile, disponibile in quattro dimensioni, come sospensione, applique e plafoniera."
    },
    {
        "model": "bianca",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/bianca/sospensione.html",
        "desc": "Collezione versatile, disponibile in quattro dimensioni, come sospensione, applique e plafoniera."
    },
    {
        "model": "bianca",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/bianca/parete.html",
        "desc": "Collezione versatile, disponibile in quattro dimensioni, come sospensione, applique e plafoniera."
    },
    {
        "model": "bissa",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/bissa/tavolo.html",
        "desc": "Oggetto decorativo più che lampada da tavolo, riflette le linee semplici del design vintage nella qualità e unicità del suo vetro artigianale."
    },
    {
        "model": "bissona",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/bissona/tavolo.html",
        "desc": "Oggetto decorativo più che lampada da tavolo, riflette le linee semplici del design vintage nella qualità e unicità del suo vetro artigianale."
    },
    {
        "model": "boccia",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/boccia/parete.html",
        "desc": "Collezione di lampade da parete dalla forma compatta semicircolare in cristallo bianco, che riduce al minimo la sporgenza dal supporto."
    },
    {
        "model": "bolle",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/bolle/soffitto.html",
        "desc": "La caratteristica texture di questa collezione viene dalla tecnica baloton, che consiste nell'inserimento di bolle d'aria nel vetro durante la lavorazione."
    },
    {
        "model": "bolle",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/bolle/sospensione.html",
        "desc": "La caratteristica texture di questa collezione viene dalla tecnica baloton, che consiste nell'inserimento di bolle d'aria nel vetro durante la lavorazione."
    },
    {
        "model": "bolle",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/bolle/tavolo.html",
        "desc": "La caratteristica texture di questa collezione viene dalla tecnica baloton, che consiste nell'inserimento di bolle d'aria nel vetro durante la lavorazione."
    },
    {
        "model": "bolle",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/bolle/faretto.html",
        "desc": "La caratteristica texture di questa collezione viene dalla tecnica baloton, che consiste nell'inserimento di bolle d'aria nel vetro durante la lavorazione."
    },
    {
        "model": "boreale",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/boreale/soffitto.html",
        "desc": "Un globo di luce, formato da due semisfere di vetro soffiato: l'una trasparente e l'altra bianco opalino."
    },
    {
        "model": "boreale",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/boreale/sospensione.html",
        "desc": "Un globo di luce, formato da due semisfere di vetro soffiato: l'una trasparente e l'altra bianco opalino."
    },
    {
        "model": "bot",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/bot/soffitto.html",
        "desc": "Un volume in movimento che ne genera uno nuovo è il concetto rappresentato dalla collezione Bot."
    },
    {
        "model": "bot",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/bot/sospensione.html",
        "desc": "Un volume in movimento che ne genera uno nuovo è il concetto rappresentato dalla collezione Bot."
    },
    {
        "model": "bot",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/bot/parete.html",
        "desc": "Un volume in movimento che ne genera uno nuovo è il concetto rappresentato dalla collezione Bot."
    },
    {
        "model": "bot",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/bot/tavolo.html",
        "desc": "Un volume in movimento che ne genera uno nuovo è il concetto rappresentato dalla collezione Bot."
    },
    {
        "model": "bot",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/bot/faretto.html",
        "desc": "Un volume in movimento che ne genera uno nuovo è il concetto rappresentato dalla collezione Bot."
    },
    {
        "model": "candela",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/candela/sospensione.html",
        "desc": "Sospensione in vetro soffiato incamiciato. Le dimensioni ridotte del corpo tubolare richiedono un’elevata maestria nella fase di soffiatura, per garantire uno spessore omogeneo. Grazie alla sorgente luminosa alogena Candela crea un effetto luce di sicuro fascino.&nbsp;"
    },
    {
        "model": "cheope",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/cheope/sospensione.html",
        "desc": "La semplicità delle forme e la gamma di colori del vetro in cui può essere realizzata rendono Cheope un modello estremamente facile da combinare nelle più diverse tipologie di arredamento."
    },
    {
        "model": "cheope-09",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/cheope-09/sospensione.html",
        "desc": "La semplicità delle forme e la gamma di colori del vetro in cui può essere realizzata rendono Cheope un modello estremamente facile da combinare nelle più diverse tipologie di arredamento."
    },
    {
        "model": "chimera",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/chimera/soffitto.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/chimera/sospensione.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/chimera/parete.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/chimera/tavolo.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/chimera/piantana.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera-09",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/chimera-09/soffitto.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera-09",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/chimera-09/sospensione.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera-09",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/chimera-09/parete.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera-09",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/chimera-09/tavolo.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "chimera-09",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/chimera-09/piantana.html",
        "desc": "La serie Chimera nasce dall'idea di un corpo trasparente che filtri la luce, nascondendo il portalampade al centro del diffusore in cristallo satinato."
    },
    {
        "model": "cild",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/cild/sospensione.html",
        "desc": "Lampada da tavolo, da parete o sospensione, Cild è caratterizzata da un volume fortemente definito, disponibile in tre dimensioni diverse."
    },
    {
        "model": "cild",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/cild/parete.html",
        "desc": "Lampada da tavolo, da parete o sospensione, Cild è caratterizzata da un volume fortemente definito, disponibile in tre dimensioni diverse."
    },
    {
        "model": "ciondo",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/ciondo/sospensione.html",
        "desc": "Ciondo è una sospensione ispirata alle forme di un monile femminile. Disponibile anche come applique e lampada da tavolo, consente con ununica montatura di fissare diversi punti luce in maniera molto flessibile."
    },
    {
        "model": "ciondo",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/ciondo/parete.html",
        "desc": "Ciondo è una sospensione ispirata alle forme di un monile femminile. Disponibile anche come applique e lampada da tavolo, consente con ununica montatura di fissare diversi punti luce in maniera molto flessibile."
    },
    {
        "model": "cleo",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/cleo/sospensione.html",
        "desc": "Questa linea di lampade è caratterizzata dalla suggestione prodotta dalla rottura della simmetria."
    },
    {
        "model": "cleo",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/cleo/parete.html",
        "desc": "Questa linea di lampade è caratterizzata dalla suggestione prodotta dalla rottura della simmetria."
    },
    {
        "model": "cloth",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/cloth/sospensione.html",
        "desc": "La complessa soffiatura di Cloth trasforma il vetro in un tessuto increspato, di grande effetto.<br>Nella versione cromata, grazie ad un'esclusiva finitura esterna, Cloth è metallizzata quando è spenta, e assume un tono caldo beige scuro quando viene accesa."
    },
    {
        "model": "cloth",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/cloth/parete.html",
        "desc": "La complessa soffiatura di Cloth trasforma il vetro in un tessuto increspato, di grande effetto.<br>Nella versione cromata, grazie ad un'esclusiva finitura esterna, Cloth è metallizzata quando è spenta, e assume un tono caldo beige scuro quando viene accesa."
    },
    {
        "model": "cloth",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/cloth/tavolo.html",
        "desc": "La complessa soffiatura di Cloth trasforma il vetro in un tessuto increspato, di grande effetto.<br>Nella versione cromata, grazie ad un'esclusiva finitura esterna, Cloth è metallizzata quando è spenta, e assume un tono caldo beige scuro quando viene accesa."
    },
    {
        "model": "cloth",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/cloth/piantana.html",
        "desc": "La complessa soffiatura di Cloth trasforma il vetro in un tessuto increspato, di grande effetto.<br>Nella versione cromata, grazie ad un'esclusiva finitura esterna, Cloth è metallizzata quando è spenta, e assume un tono caldo beige scuro quando viene accesa."
    },
    {
        "model": "comari",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/comari/soffitto.html",
        "desc": "Collezione di lampade disponibile in due misure. La superficie ondulata del paralume esalta la qualità, la trasparenza e i riflessi del vetro soffiato, decorato con scaglie dorate."
    },
    {
        "model": "comari",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/comari/sospensione.html",
        "desc": "Collezione di lampade disponibile in due misure. La superficie ondulata del paralume esalta la qualità, la trasparenza e i riflessi del vetro soffiato, decorato con scaglie dorate."
    },
    {
        "model": "comari",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/comari/parete.html",
        "desc": "Collezione di lampade disponibile in due misure. La superficie ondulata del paralume esalta la qualità, la trasparenza e i riflessi del vetro soffiato, decorato con scaglie dorate."
    },
    {
        "model": "comari",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/comari/tavolo.html",
        "desc": "Collezione di lampade disponibile in due misure. La superficie ondulata del paralume esalta la qualità, la trasparenza e i riflessi del vetro soffiato, decorato con scaglie dorate."
    },
    {
        "model": "corner",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/corner/parete.html",
        "desc": "Il vetro bianco satinato e la forma ideata per uno spazio angolare rendono Corner perfetta per ambienti dalla luce intima, come le stanze da letto."
    },
    {
        "model": "cristallina",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/cristallina/sospensione.html",
        "desc": "L’idea guida della collezione si sviluppa attorno a un paralume, caratterizzato dalla bombatura sulla sommità e dalla tecnica dello sfumato nel cristallo, che permette alla luce di irradiarsi e diffondersi in modo confortevole nell’ambiente."
    },
    {
        "model": "dafne",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/dafne/parete.html",
        "desc": "Le linee eleganti e discrete di Dafne ne fanno una lampada da parete adatta ai più vari stili d'arredamento."
    },
    {
        "model": "damasco",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/damasco/sospensione.html",
        "desc": "Collezione realizzata con la tecnica bozzolo, in cui l'originale decoro diventa un vero e proprio materiale: la sovrapposizione di fili di vetro fuso a creare una texture in rilievo."
    },
    {
        "model": "damasco",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/damasco/parete.html",
        "desc": "Collezione realizzata con la tecnica bozzolo, in cui l'originale decoro diventa un vero e proprio materiale: la sovrapposizione di fili di vetro fuso a creare una texture in rilievo."
    },
    {
        "model": "damasco",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/damasco/tavolo.html",
        "desc": "Collezione realizzata con la tecnica bozzolo, in cui l'originale decoro diventa un vero e proprio materiale: la sovrapposizione di fili di vetro fuso a creare una texture in rilievo."
    },
    {
        "model": "damasco",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/damasco/piantana.html",
        "desc": "Collezione realizzata con la tecnica bozzolo, in cui l'originale decoro diventa un vero e proprio materiale: la sovrapposizione di fili di vetro fuso a creare una texture in rilievo."
    },
    {
        "model": "damasco",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/damasco/faretto.html",
        "desc": "Collezione realizzata con la tecnica bozzolo, in cui l'originale decoro diventa un vero e proprio materiale: la sovrapposizione di fili di vetro fuso a creare una texture in rilievo."
    },
    {
        "model": "diadema",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/diadema/soffitto.html",
        "desc": "Diadema è un sistema di illuminazione basato sul singolo elemento della canna in puro vetro. Combinando canne di diverse dimensioni, la luce si riflette e si trasmette in una sensazione di movimento."
    },
    {
        "model": "diadema",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/diadema/sospensione.html",
        "desc": "Diadema è un sistema di illuminazione basato sul singolo elemento della canna in puro vetro. Combinando canne di diverse dimensioni, la luce si riflette e si trasmette in una sensazione di movimento."
    },
    {
        "model": "diadema",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/diadema/parete.html",
        "desc": "Diadema è un sistema di illuminazione basato sul singolo elemento della canna in puro vetro. Combinando canne di diverse dimensioni, la luce si riflette e si trasmette in una sensazione di movimento."
    },
    {
        "model": "diadema",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/diadema/tavolo.html",
        "desc": "Diadema è un sistema di illuminazione basato sul singolo elemento della canna in puro vetro. Combinando canne di diverse dimensioni, la luce si riflette e si trasmette in una sensazione di movimento."
    },
    {
        "model": "diadema",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/diadema/piantana.html",
        "desc": "Diadema è un sistema di illuminazione basato sul singolo elemento della canna in puro vetro. Combinando canne di diverse dimensioni, la luce si riflette e si trasmette in una sensazione di movimento."
    },
    {
        "model": "diadema",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/diadema/faretto.html",
        "desc": "Diadema è un sistema di illuminazione basato sul singolo elemento della canna in puro vetro. Combinando canne di diverse dimensioni, la luce si riflette e si trasmette in una sensazione di movimento."
    },
    {
        "model": "diamante",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/diamante/soffitto.html",
        "desc": "Massima la versatilità di questa creazione, realizzata con un processo esclusivamente artigianale."
    },
    {
        "model": "diamante",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/diamante/sospensione.html",
        "desc": "Massima la versatilità di questa creazione, realizzata con un processo esclusivamente artigianale."
    },
    {
        "model": "diamante",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/diamante/parete.html",
        "desc": "Massima la versatilità di questa creazione, realizzata con un processo esclusivamente artigianale."
    },
    {
        "model": "diamante",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/diamante/tavolo.html",
        "desc": "Massima la versatilità di questa creazione, realizzata con un processo esclusivamente artigianale."
    },
    {
        "model": "diamante",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/diamante/faretto.html",
        "desc": "Massima la versatilità di questa creazione, realizzata con un processo esclusivamente artigianale."
    },
    {
        "model": "dodo",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/dodo/soffitto.html",
        "desc": "Grazie al vetro soffiato satinato, Dodo regala una luce morbida e senza ombre."
    },
    {
        "model": "dodo",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/dodo/parete.html",
        "desc": "Grazie al vetro soffiato satinato, Dodo regala una luce morbida e senza ombre."
    },
    {
        "model": "dogi",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/dogi/soffitto.html",
        "desc": "Il vetro colato che contraddistingue questa serie di lampade da soffitto, da parete e da tavolo, permette di occultare la sorgente luminosa, senza privare il paralume della trasparenza."
    },
    {
        "model": "dogi",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/dogi/parete.html",
        "desc": "Il vetro colato che contraddistingue questa serie di lampade da soffitto, da parete e da tavolo, permette di occultare la sorgente luminosa, senza privare il paralume della trasparenza."
    },
    {
        "model": "dos",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/dos/sospensione.html",
        "desc": "Il nome Dos richiama i due rettangoli che caratterizzano la collezione: la sagoma esterna in vetro bianco satinato e il foro centrale realizzato con la tecnica del taglio waterjet."
    },
    {
        "model": "dos",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/dos/parete.html",
        "desc": "Il nome Dos richiama i due rettangoli che caratterizzano la collezione: la sagoma esterna in vetro bianco satinato e il foro centrale realizzato con la tecnica del taglio waterjet."
    },
    {
        "model": "dress",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/dress/soffitto.html",
        "desc": "Il design pulito di Dress si armonizza a qualsiasi atmosfera."
    },
    {
        "model": "dress",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/dress/sospensione.html",
        "desc": "Il design pulito di Dress si armonizza a qualsiasi atmosfera."
    },
    {
        "model": "dress",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/dress/parete.html",
        "desc": "Il design pulito di Dress si armonizza a qualsiasi atmosfera."
    },
    {
        "model": "ecos",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/ecos/soffitto.html",
        "desc": "Collezione di lampade componibili con anelli di vetro di diversi colori e textures."
    },
    {
        "model": "ecos",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/ecos/sospensione.html",
        "desc": "Collezione di lampade componibili con anelli di vetro di diversi colori e textures."
    },
    {
        "model": "ecos",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/ecos/parete.html",
        "desc": "Collezione di lampade componibili con anelli di vetro di diversi colori e textures."
    },
    {
        "model": "ecos",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/ecos/piantana.html",
        "desc": "Collezione di lampade componibili con anelli di vetro di diversi colori e textures."
    },
    {
        "model": "enne-luci",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/enne-luci/sospensione.html",
        "desc": "Enne Luci reinterpreta le linee di un design affermato, in vetro soffiato bianco opalino o con la finitura argentata per ambienti dal gusto più contemporaneo."
    },
    {
        "model": "enne-luci",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/enne-luci/parete.html",
        "desc": "Enne Luci reinterpreta le linee di un design affermato, in vetro soffiato bianco opalino o con la finitura argentata per ambienti dal gusto più contemporaneo."
    },
    {
        "model": "enne-luci",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/enne-luci/tavolo.html",
        "desc": "Enne Luci reinterpreta le linee di un design affermato, in vetro soffiato bianco opalino o con la finitura argentata per ambienti dal gusto più contemporaneo."
    },
    {
        "model": "enne-luci",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/enne-luci/piantana.html",
        "desc": "Enne Luci reinterpreta le linee di un design affermato, in vetro soffiato bianco opalino o con la finitura argentata per ambienti dal gusto più contemporaneo."
    },
    {
        "model": "essence",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/essence/sospensione.html",
        "desc": "Collezione di lampade con diffusore in canne di vetro lavorato a mano. La superficie è parzialmente opacizzata da una sabbiatura sfumata. Sorgente luminosa a LED."
    },
    {
        "model": "essence",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/essence/tavolo.html",
        "desc": "Collezione di lampade con diffusore in canne di vetro lavorato a mano. La superficie è parzialmente opacizzata da una sabbiatura sfumata. Sorgente luminosa a LED."
    },
    {
        "model": "essence",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/essence/piantana.html",
        "desc": "Collezione di lampade con diffusore in canne di vetro lavorato a mano. La superficie è parzialmente opacizzata da una sabbiatura sfumata. Sorgente luminosa a LED."
    },
    {
        "model": "ferea",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/ferea/sospensione.html",
        "desc": "Le linee uniche di Ferea sono rese possibili dall'impiego del taglio waterjet, che permette al designer di esplorare e plasmare forme inedite nella tradizione del vetro muranese."
    },
    {
        "model": "ferea",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/ferea/parete.html",
        "desc": "Le linee uniche di Ferea sono rese possibili dall'impiego del taglio waterjet, che permette al designer di esplorare e plasmare forme inedite nella tradizione del vetro muranese."
    },
    {
        "model": "ferea",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/ferea/tavolo.html",
        "desc": "Le linee uniche di Ferea sono rese possibili dall'impiego del taglio waterjet, che permette al designer di esplorare e plasmare forme inedite nella tradizione del vetro muranese."
    },
    {
        "model": "ferea",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/ferea/piantana.html",
        "desc": "Le linee uniche di Ferea sono rese possibili dall'impiego del taglio waterjet, che permette al designer di esplorare e plasmare forme inedite nella tradizione del vetro muranese."
    },
    {
        "model": "follia",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/follia/soffitto.html",
        "desc": "Le striature del vetro fuso applicate alla superficie di questo modello, ne rendono unico ogni esemplare."
    },
    {
        "model": "follia",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/follia/sospensione.html",
        "desc": "Le striature del vetro fuso applicate alla superficie di questo modello, ne rendono unico ogni esemplare."
    },
    {
        "model": "follia",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/follia/parete.html",
        "desc": "Le striature del vetro fuso applicate alla superficie di questo modello, ne rendono unico ogni esemplare."
    },
    {
        "model": "follia",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/follia/tavolo.html",
        "desc": "Le striature del vetro fuso applicate alla superficie di questo modello, ne rendono unico ogni esemplare."
    },
    {
        "model": "fuochi",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/fuochi/soffitto.html",
        "desc": "Le foglie in vetro soffiato e i dettagli della rifinitura in oro 24k, rendono questa linea di applique e plafoniere protagonista di qualsiasi ambiente elegante."
    },
    {
        "model": "fuochi",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/fuochi/parete.html",
        "desc": "Le foglie in vetro soffiato e i dettagli della rifinitura in oro 24k, rendono questa linea di applique e plafoniere protagonista di qualsiasi ambiente elegante."
    },
    {
        "model": "futura",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/futura/soffitto.html",
        "desc": "Collezione di lampade a sospensione in vetro soffiato disponibile in tre esclusive colorazioni abbinate a differenti finiture dell'anello metallico. Il vetro soffiato è in pezzo unico ma la particolare lavorazione lo rende di colore trasparente nella parte superiore e di colore diffusore nella parte inferiore."
    },
    {
        "model": "futura",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/futura/sospensione.html",
        "desc": "Collezione di lampade a sospensione in vetro soffiato disponibile in tre esclusive colorazioni abbinate a differenti finiture dell'anello metallico. Il vetro soffiato è in pezzo unico ma la particolare lavorazione lo rende di colore trasparente nella parte superiore e di colore diffusore nella parte inferiore."
    },
    {
        "model": "futura",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/futura/parete.html",
        "desc": "Collezione di lampade a sospensione in vetro soffiato disponibile in tre esclusive colorazioni abbinate a differenti finiture dell'anello metallico. Il vetro soffiato è in pezzo unico ma la particolare lavorazione lo rende di colore trasparente nella parte superiore e di colore diffusore nella parte inferiore."
    },
    {
        "model": "futura",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/futura/tavolo.html",
        "desc": "Collezione di lampade a sospensione in vetro soffiato disponibile in tre esclusive colorazioni abbinate a differenti finiture dell'anello metallico. Il vetro soffiato è in pezzo unico ma la particolare lavorazione lo rende di colore trasparente nella parte superiore e di colore diffusore nella parte inferiore."
    },
    {
        "model": "futura",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/futura/piantana.html",
        "desc": "Collezione di lampade a sospensione in vetro soffiato disponibile in tre esclusive colorazioni abbinate a differenti finiture dell'anello metallico. Il vetro soffiato è in pezzo unico ma la particolare lavorazione lo rende di colore trasparente nella parte superiore e di colore diffusore nella parte inferiore."
    },
    {
        "model": "giglio",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/giglio/parete.html",
        "desc": "Si ispira al calice del fiore che le dà il nome questa applique, disponibile in due misure e in due versioni simmetriche. Il vetro colato, con cui è realizzato il paralume, nasconde la sorgente luminosa mantenendo la trasparenza del cristallo."
    },
    {
        "model": "giogali",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/giogali/soffitto.html",
        "desc": "Un sistema decorativo d'illuminazione basato sull'elemento del gancio di cristallo componibile. Disponibile in diversi colori, montabile in versione da tavolo, da soffitto, sospensione, da parete. Può essere impiegato in grandi lampadari e strutture di qualsiasi dimensione."
    },
    {
        "model": "giogali",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/giogali/sospensione.html",
        "desc": "Un sistema decorativo d'illuminazione basato sull'elemento del gancio di cristallo componibile. Disponibile in diversi colori, montabile in versione da tavolo, da soffitto, sospensione, da parete. Può essere impiegato in grandi lampadari e strutture di qualsiasi dimensione."
    },
    {
        "model": "giogali",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/giogali/parete.html",
        "desc": "Un sistema decorativo d'illuminazione basato sull'elemento del gancio di cristallo componibile. Disponibile in diversi colori, montabile in versione da tavolo, da soffitto, sospensione, da parete. Può essere impiegato in grandi lampadari e strutture di qualsiasi dimensione."
    },
    {
        "model": "giogali",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/giogali/piantana.html",
        "desc": "Un sistema decorativo d'illuminazione basato sull'elemento del gancio di cristallo componibile. Disponibile in diversi colori, montabile in versione da tavolo, da soffitto, sospensione, da parete. Può essere impiegato in grandi lampadari e strutture di qualsiasi dimensione."
    },
    {
        "model": "giogali-3d",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/giogali-3d/sospensione.html",
        "desc": "La versione 3D di Giogali permette di creare strutture sia orizzontali che verticali, incatenando tra loro i ganci di cristallo, per installazioni standard o su misura."
    },
    {
        "model": "giubileo",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/giubileo/soffitto.html",
        "desc": "Tre misure per questa collezione di plafoniere, caratterizzata da una corolla di foglie in vetro fuso, che ricordano tutta l'eleganza della tradizione veneziana."
    },
    {
        "model": "giubileo",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/giubileo/sospensione.html",
        "desc": "Tre misure per questa collezione di plafoniere, caratterizzata da una corolla di foglie in vetro fuso, che ricordano tutta l'eleganza della tradizione veneziana."
    },
    {
        "model": "giubileo",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/giubileo/parete.html",
        "desc": "Tre misure per questa collezione di plafoniere, caratterizzata da una corolla di foglie in vetro fuso, che ricordano tutta l'eleganza della tradizione veneziana."
    },
    {
        "model": "giudecca",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/giudecca/soffitto.html",
        "desc": "La lavorazione del vetro della linea Giudecca con le sue costole di cristallo rigate, spezza la luce in una molteplicità di riflessi, che generano eleganti giochi di luce.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    },
    {
        "model": "giudecca",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/giudecca/sospensione.html",
        "desc": "La lavorazione del vetro della linea Giudecca con le sue costole di cristallo rigate, spezza la luce in una molteplicità di riflessi, che generano eleganti giochi di luce.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    },
    {
        "model": "giudecca",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/giudecca/parete.html",
        "desc": "La lavorazione del vetro della linea Giudecca con le sue costole di cristallo rigate, spezza la luce in una molteplicità di riflessi, che generano eleganti giochi di luce.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    },
    {
        "model": "gloria",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/gloria/soffitto.html",
        "desc": "La lavorazione 'rigadin' del vetro color seta, impreziosito dalle scaglie dorate a 24k, è il tratto identificativo di quest'ampia collezione di sospensioni, lampade a soffitto, a parete, da tavolo, piantane."
    },
    {
        "model": "gloria",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/gloria/sospensione.html",
        "desc": "La lavorazione 'rigadin' del vetro color seta, impreziosito dalle scaglie dorate a 24k, è il tratto identificativo di quest'ampia collezione di sospensioni, lampade a soffitto, a parete, da tavolo, piantane."
    },
    {
        "model": "gloria",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/gloria/parete.html",
        "desc": "La lavorazione 'rigadin' del vetro color seta, impreziosito dalle scaglie dorate a 24k, è il tratto identificativo di quest'ampia collezione di sospensioni, lampade a soffitto, a parete, da tavolo, piantane."
    },
    {
        "model": "gloria",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/gloria/tavolo.html",
        "desc": "La lavorazione 'rigadin' del vetro color seta, impreziosito dalle scaglie dorate a 24k, è il tratto identificativo di quest'ampia collezione di sospensioni, lampade a soffitto, a parete, da tavolo, piantane."
    },
    {
        "model": "gloria",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/gloria/piantana.html",
        "desc": "La lavorazione 'rigadin' del vetro color seta, impreziosito dalle scaglie dorate a 24k, è il tratto identificativo di quest'ampia collezione di sospensioni, lampade a soffitto, a parete, da tavolo, piantane."
    },
    {
        "model": "goccia",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/goccia/parete.html",
        "desc": "La delicata combinazione dell'inconfondibile linea del paralume e del gambo realizzato a mano in vetro con scaglie d'oro a 24k, fa di Goccia il modello perfetto per ambientazioni sia eleganti che moderne."
    },
    {
        "model": "goto",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/goto/soffitto.html",
        "desc": "Ideale per gli ambienti d'impronta classica, questa collezione di applique prende ispirazione dalle forme della botanica, riprodotte in vetro soffiato bianco o color seta con scaglie d'oro a 24k."
    },
    {
        "model": "goto",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/goto/sospensione.html",
        "desc": "Ideale per gli ambienti d'impronta classica, questa collezione di applique prende ispirazione dalle forme della botanica, riprodotte in vetro soffiato bianco o color seta con scaglie d'oro a 24k."
    },
    {
        "model": "goto",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/goto/parete.html",
        "desc": "Ideale per gli ambienti d'impronta classica, questa collezione di applique prende ispirazione dalle forme della botanica, riprodotte in vetro soffiato bianco o color seta con scaglie d'oro a 24k."
    },
    {
        "model": "goto",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/goto/tavolo.html",
        "desc": "Ideale per gli ambienti d'impronta classica, questa collezione di applique prende ispirazione dalle forme della botanica, riprodotte in vetro soffiato bianco o color seta con scaglie d'oro a 24k."
    },
    {
        "model": "implode",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/implode/soffitto.html",
        "desc": "Questa linea rappresenta l'illusione di una superficie creatasi dall'implosione di un volume."
    },
    {
        "model": "implode",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/implode/sospensione.html",
        "desc": "Questa linea rappresenta l'illusione di una superficie creatasi dall'implosione di un volume."
    },
    {
        "model": "implode",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/implode/tavolo.html",
        "desc": "Questa linea rappresenta l'illusione di una superficie creatasi dall'implosione di un volume."
    },
    {
        "model": "implode",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/implode/faretto.html",
        "desc": "Questa linea rappresenta l'illusione di una superficie creatasi dall'implosione di un volume."
    },
    {
        "model": "incass",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/incass/soffitto.html",
        "desc": "Collezione di applique a muro e soffitto che racchiudono la montatura all'interno, mostrando solo il vetro."
    },
    {
        "model": "incass",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/incass/parete.html",
        "desc": "Collezione di applique a muro e soffitto che racchiudono la montatura all'interno, mostrando solo il vetro."
    },
    {
        "model": "infinita",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/infinita/soffitto.html",
        "desc": "In versione sospensione o applique, è la risposta alla sempre crescente domanda di lampade di grandi dimensioni con portalampade multipli."
    },
    {
        "model": "infinita",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/infinita/sospensione.html",
        "desc": "In versione sospensione o applique, è la risposta alla sempre crescente domanda di lampade di grandi dimensioni con portalampade multipli."
    },
    {
        "model": "infinita",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/infinita/parete.html",
        "desc": "In versione sospensione o applique, è la risposta alla sempre crescente domanda di lampade di grandi dimensioni con portalampade multipli."
    },
    {
        "model": "jo",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/jo/tavolo.html",
        "desc": "La lampada da tavolo Jo è una forma di puro vetro e luce."
    },
    {
        "model": "jube",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/jube/sospensione.html",
        "desc": "\nEssenziale,\nsinuosa e delicata, nasce dall’unione di due vetri soffiati che, una volta\nassemblati, danno vita a un gioco di sovrapposizioni e creano un effetto tono\nsu tono dal fascino retrò. Grazie a un potente waterjet, che permette di\neffettuare sul vetro fori di diametri molto grandi, si integra al meglio la\nfusione dei due vetri, facendoli apparire come un pezzo unico.\n\n"
    },
    {
        "model": "kira",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/kira/sospensione.html",
        "desc": "Kira è una famiglia di lampade che combina il vetro soffiato con il metallo, generando una serie di apparecchi composti da due metà antitetiche: un diffusore in vetro cristallo, decorato e impreziosito da una ricca texture superficiale, sormontato da un cappello in metallo tornito, dall’aspetto più minimale e pulito. Questa collezione combina forme contemporanee alla preziosità e allo sfarzo luminoso del cristallo dei classici lampadari veneziani."
    },
    {
        "model": "lacrima",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/lacrima/sospensione.html",
        "desc": "Realizzata in due dimensioni, grazie alla forma di goccia allungata, Lacrima è la soluzione ideale per vani scale e soffitti alti."
    },
    {
        "model": "laguna",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/laguna/sospensione.html",
        "desc": "Linee non convenzionali caratterizzano questa collezione, realizzata in vetro soffiato a tecnica 'rigadin', in un caldo colore seta con scaglie d'oro a 24k."
    },
    {
        "model": "laguna",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/laguna/parete.html",
        "desc": "Linee non convenzionali caratterizzano questa collezione, realizzata in vetro soffiato a tecnica 'rigadin', in un caldo colore seta con scaglie d'oro a 24k."
    },
    {
        "model": "laguna",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/laguna/tavolo.html",
        "desc": "Linee non convenzionali caratterizzano questa collezione, realizzata in vetro soffiato a tecnica 'rigadin', in un caldo colore seta con scaglie d'oro a 24k."
    },
    {
        "model": "laguna",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/laguna/piantana.html",
        "desc": "Linee non convenzionali caratterizzano questa collezione, realizzata in vetro soffiato a tecnica 'rigadin', in un caldo colore seta con scaglie d'oro a 24k."
    },
    {
        "model": "lepanto",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/lepanto/sospensione.html",
        "desc": "Lepanto è una vera scultura in vetro di Murano, che richiede grande abilità tecnica nella realizzazione."
    },
    {
        "model": "lepanto",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/lepanto/piantana.html",
        "desc": "Lepanto è una vera scultura in vetro di Murano, che richiede grande abilità tecnica nella realizzazione."
    },
    {
        "model": "lio",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/lio/soffitto.html",
        "desc": "Ampia gamma di lampade che in un design minimalista e discreto esaltano la sorgente luminosa, grazie alla fascia di vetro traslucida imprigionata tra gli strati del cristallo."
    },
    {
        "model": "lio",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/lio/sospensione.html",
        "desc": "Ampia gamma di lampade che in un design minimalista e discreto esaltano la sorgente luminosa, grazie alla fascia di vetro traslucida imprigionata tra gli strati del cristallo."
    },
    {
        "model": "lio",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/lio/parete.html",
        "desc": "Ampia gamma di lampade che in un design minimalista e discreto esaltano la sorgente luminosa, grazie alla fascia di vetro traslucida imprigionata tra gli strati del cristallo."
    },
    {
        "model": "lio",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/lio/tavolo.html",
        "desc": "Ampia gamma di lampade che in un design minimalista e discreto esaltano la sorgente luminosa, grazie alla fascia di vetro traslucida imprigionata tra gli strati del cristallo."
    },
    {
        "model": "lio",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/lio/piantana.html",
        "desc": "Ampia gamma di lampade che in un design minimalista e discreto esaltano la sorgente luminosa, grazie alla fascia di vetro traslucida imprigionata tra gli strati del cristallo."
    },
    {
        "model": "lio",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/lio/faretto.html",
        "desc": "Ampia gamma di lampade che in un design minimalista e discreto esaltano la sorgente luminosa, grazie alla fascia di vetro traslucida imprigionata tra gli strati del cristallo."
    },
    {
        "model": "lucciola",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/lucciola/soffitto.html",
        "desc": "Una delle più versatili collezioni. La sua forma ovale in vetro soffiato satinato è disponibile in diverse dimensioni, che si prestano a innumerevoli combinazioni d'installazione."
    },
    {
        "model": "lucciola",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/lucciola/sospensione.html",
        "desc": "Una delle più versatili collezioni. La sua forma ovale in vetro soffiato satinato è disponibile in diverse dimensioni, che si prestano a innumerevoli combinazioni d'installazione."
    },
    {
        "model": "lucciola",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/lucciola/parete.html",
        "desc": "Una delle più versatili collezioni. La sua forma ovale in vetro soffiato satinato è disponibile in diverse dimensioni, che si prestano a innumerevoli combinazioni d'installazione."
    },
    {
        "model": "lucciola",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/lucciola/tavolo.html",
        "desc": "Una delle più versatili collezioni. La sua forma ovale in vetro soffiato satinato è disponibile in diverse dimensioni, che si prestano a innumerevoli combinazioni d'installazione."
    },
    {
        "model": "lucciola",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/lucciola/piantana.html",
        "desc": "Una delle più versatili collezioni. La sua forma ovale in vetro soffiato satinato è disponibile in diverse dimensioni, che si prestano a innumerevoli combinazioni d'installazione."
    },
    {
        "model": "lucciola",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/lucciola/faretto.html",
        "desc": "Una delle più versatili collezioni. La sua forma ovale in vetro soffiato satinato è disponibile in diverse dimensioni, che si prestano a innumerevoli combinazioni d'installazione."
    },
    {
        "model": "lunae",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/lunae/parete.html",
        "desc": "L'ispirazione di Lunae è la delicata intersezione di luce, riflessi e ombre che si manifestano durante l'eclissi lunare, in un'unica forma controllata."
    },
    {
        "model": "luxor",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/luxor/sospensione.html",
        "desc": "Collezione di sospensioni e lampade da parete disponibili in due dimensioni. Luxor combina un elegante design con un'ispirazione di provenienza classica."
    },
    {
        "model": "luxor",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/luxor/parete.html",
        "desc": "Collezione di sospensioni e lampade da parete disponibili in due dimensioni. Luxor combina un elegante design con un'ispirazione di provenienza classica."
    },
    {
        "model": "magie",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/magie/sospensione.html",
        "desc": "Un colpo d'occhio suggestivo per questo modello che combina vetro bianco opaco e trasparente sulla superficie illuminante, creando un effetto scintillante."
    },
    {
        "model": "magie",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/magie/faretto.html",
        "desc": "Un colpo d'occhio suggestivo per questo modello che combina vetro bianco opaco e trasparente sulla superficie illuminante, creando un effetto scintillante."
    },
    {
        "model": "marblè",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/marblè/soffitto.html",
        "desc": "La particolarità della collezione Marblè sta nell'inserzione di scaglie argentate nel vetro fuso prima della soffiatura, con un effetto che rende ogni pezzo diverso dall'altro."
    },
    {
        "model": "marblè",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/marblè/sospensione.html",
        "desc": "La particolarità della collezione Marblè sta nell'inserzione di scaglie argentate nel vetro fuso prima della soffiatura, con un effetto che rende ogni pezzo diverso dall'altro."
    },
    {
        "model": "marblè",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/marblè/parete.html",
        "desc": "La particolarità della collezione Marblè sta nell'inserzione di scaglie argentate nel vetro fuso prima della soffiatura, con un effetto che rende ogni pezzo diverso dall'altro."
    },
    {
        "model": "marblè",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/marblè/tavolo.html",
        "desc": "La particolarità della collezione Marblè sta nell'inserzione di scaglie argentate nel vetro fuso prima della soffiatura, con un effetto che rende ogni pezzo diverso dall'altro."
    },
    {
        "model": "marblè",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/marblè/piantana.html",
        "desc": "La particolarità della collezione Marblè sta nell'inserzione di scaglie argentate nel vetro fuso prima della soffiatura, con un effetto che rende ogni pezzo diverso dall'altro."
    },
    {
        "model": "marea",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/marea/soffitto.html",
        "desc": "Plafoniera e applique ispirate alle forme e ai colori di una conchiglia, realizzate in vetro soffiato color seta, a tecnica 'rigadin', con inserzioni d'oro a 24k."
    },
    {
        "model": "marea",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/marea/parete.html",
        "desc": "Plafoniera e applique ispirate alle forme e ai colori di una conchiglia, realizzate in vetro soffiato color seta, a tecnica 'rigadin', con inserzioni d'oro a 24k."
    },
    {
        "model": "mia",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/mia/soffitto.html",
        "desc": "Quattro dimensioni diverse per MIA, disponibile come sospensione e plafoniera."
    },
    {
        "model": "mia",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/mia/sospensione.html",
        "desc": "Quattro dimensioni diverse per MIA, disponibile come sospensione e plafoniera."
    },
    {
        "model": "mia",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/mia/parete.html",
        "desc": "Quattro dimensioni diverse per MIA, disponibile come sospensione e plafoniera."
    },
    {
        "model": "mini-giogali",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/mini-giogali/soffitto.html",
        "desc": "La versione ridotta di Giogali, che permette di impiegare i ganci in cristallo per installazioni a parete di minori dimensioni, standard o su misura."
    },
    {
        "model": "mini-giogali",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/mini-giogali/sospensione.html",
        "desc": "La versione ridotta di Giogali, che permette di impiegare i ganci in cristallo per installazioni a parete di minori dimensioni, standard o su misura."
    },
    {
        "model": "mini-giogali",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/mini-giogali/parete.html",
        "desc": "La versione ridotta di Giogali, che permette di impiegare i ganci in cristallo per installazioni a parete di minori dimensioni, standard o su misura."
    },
    {
        "model": "mini-giogali",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/mini-giogali/tavolo.html",
        "desc": "La versione ridotta di Giogali, che permette di impiegare i ganci in cristallo per installazioni a parete di minori dimensioni, standard o su misura."
    },
    {
        "model": "mini-giogali",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/mini-giogali/piantana.html",
        "desc": "La versione ridotta di Giogali, che permette di impiegare i ganci in cristallo per installazioni a parete di minori dimensioni, standard o su misura."
    },
    {
        "model": "mirage",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/mirage/sospensione.html",
        "desc": "Il vetro soffiato restituisce alla luce il suo ruolo centrale, direzionandola e diffondendola nell’ambiente in modo confortevole, sottolineandone la luminosità.<br>"
    },
    {
        "model": "moby",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/moby/parete.html",
        "desc": "Semplice e funzionale, Moby è un modello da parete in vetro soffiato satinato."
    },
    {
        "model": "moris",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/moris/soffitto.html",
        "desc": "Disponibile in tre diverse dimensioni, Moris si presta ad essere installata come lampada da soffitto o da parete."
    },
    {
        "model": "moris",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/moris/parete.html",
        "desc": "Disponibile in tre diverse dimensioni, Moris si presta ad essere installata come lampada da soffitto o da parete."
    },
    {
        "model": "morrise",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/morrise/soffitto.html",
        "desc": "Raffinata collezione di lampade da soffitto combinabili con applique e lampada da tavolo, che armonizza la qualità del vetro fuso e del decoro a scaglie dorate, in un riconoscibile design classico."
    },
    {
        "model": "morrise",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/morrise/parete.html",
        "desc": "Raffinata collezione di lampade da soffitto combinabili con applique e lampada da tavolo, che armonizza la qualità del vetro fuso e del decoro a scaglie dorate, in un riconoscibile design classico."
    },
    {
        "model": "morrise",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/morrise/tavolo.html",
        "desc": "Raffinata collezione di lampade da soffitto combinabili con applique e lampada da tavolo, che armonizza la qualità del vetro fuso e del decoro a scaglie dorate, in un riconoscibile design classico."
    },
    {
        "model": "mumba",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/mumba/sospensione.html",
        "desc": "L'effetto di una luce vibrante è l'obiettivo del design di Mumba, le cui forme monolitiche sono addolcite dalla texture ondulata della superficie."
    },
    {
        "model": "mumba",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/mumba/parete.html",
        "desc": "L'effetto di una luce vibrante è l'obiettivo del design di Mumba, le cui forme monolitiche sono addolcite dalla texture ondulata della superficie."
    },
    {
        "model": "munega",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/munega/soffitto.html",
        "desc": "L'emblema del design senza tempo, unisce all'ispirazione scultorea una grandissima abilità artigianale dando forma ad una collezione unica."
    },
    {
        "model": "munega",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/munega/sospensione.html",
        "desc": "L'emblema del design senza tempo, unisce all'ispirazione scultorea una grandissima abilità artigianale dando forma ad una collezione unica."
    },
    {
        "model": "munega",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/munega/tavolo.html",
        "desc": "L'emblema del design senza tempo, unisce all'ispirazione scultorea una grandissima abilità artigianale dando forma ad una collezione unica."
    },
    {
        "model": "naranza",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/naranza/sospensione.html",
        "desc": "L'originalità delle sue linee si ispira alla forma della medusa ed è realizzata dall'accoppiamento di due componenti in vetro che richiedono estrema maestrìa nella soffiatura e nel taglio."
    },
    {
        "model": "naxos",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/naxos/sospensione.html",
        "desc": "Collezione di lampade da tavolo, sospensioni e piantane dal design riconoscibile, che esalta la qualità del vetro satinato."
    },
    {
        "model": "naxos",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/naxos/tavolo.html",
        "desc": "Collezione di lampade da tavolo, sospensioni e piantane dal design riconoscibile, che esalta la qualità del vetro satinato."
    },
    {
        "model": "naxos",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/naxos/piantana.html",
        "desc": "Collezione di lampade da tavolo, sospensioni e piantane dal design riconoscibile, che esalta la qualità del vetro satinato."
    },
    {
        "model": "nebula",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/nebula/soffitto.html",
        "desc": "L'impronta scultorea del vetro di questa linea di lampade viene dalla morbidezza delle forme e dei colori, caratteri comuni ad altre opere di Mangiarotti e che valorizzano il principale obiettivo di questa creazione: dare luce."
    },
    {
        "model": "nebula",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/nebula/sospensione.html",
        "desc": "L'impronta scultorea del vetro di questa linea di lampade viene dalla morbidezza delle forme e dei colori, caratteri comuni ad altre opere di Mangiarotti e che valorizzano il principale obiettivo di questa creazione: dare luce."
    },
    {
        "model": "neochic",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/neochic/soffitto.html",
        "desc": "Trae ispirazione dall'effetto di acqua e vento sulla pietra il design di questa collezione di lampade."
    },
    {
        "model": "neochic",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/neochic/sospensione.html",
        "desc": "Trae ispirazione dall'effetto di acqua e vento sulla pietra il design di questa collezione di lampade."
    },
    {
        "model": "neochic",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/neochic/parete.html",
        "desc": "Trae ispirazione dall'effetto di acqua e vento sulla pietra il design di questa collezione di lampade."
    },
    {
        "model": "nessa",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/nessa/tavolo.html",
        "desc": "Una lampada da tavolo prodotta a mano, molto più che funzionale."
    },
    {
        "model": "ninfea",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/ninfea/sospensione.html",
        "desc": "Design elegante e produzione artigianale che esaltano al massimo le caratteristiche del vetro muranese."
    },
    {
        "model": "ninfea",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/ninfea/parete.html",
        "desc": "Design elegante e produzione artigianale che esaltano al massimo le caratteristiche del vetro muranese."
    },
    {
        "model": "nodo",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/nodo/sospensione.html",
        "desc": "Elemento soffiato e lavorato a mano libera. Disponibile in due dimensioni anche componibili a piacere. Illuminazione direzionale verso il basso e diffusa nell'ambiente.&nbsp;"
    },
    {
        "model": "noon",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/noon/sospensione.html",
        "desc": "Collezione dal carattere femminile, pacifico e rassicurante, che si riflette nelle linee morbide e classiche ispirate alle fasi della luna."
    },
    {
        "model": "norma",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/norma/parete.html",
        "desc": "Questa lampada è la sintesi della ricerca di continuità tra la parete e la forma di vetro."
    },
    {
        "model": "novecento",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/novecento/soffitto.html",
        "desc": "La chiave di lettura della collezione '900 è la volontà di sintetizzare la tradizione muranese del lampadario, nel suo elemento più riconoscibile: il profilo."
    },
    {
        "model": "novecento",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/novecento/sospensione.html",
        "desc": "La chiave di lettura della collezione '900 è la volontà di sintetizzare la tradizione muranese del lampadario, nel suo elemento più riconoscibile: il profilo."
    },
    {
        "model": "novecento",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/novecento/tavolo.html",
        "desc": "La chiave di lettura della collezione '900 è la volontà di sintetizzare la tradizione muranese del lampadario, nel suo elemento più riconoscibile: il profilo."
    },
    {
        "model": "novecento",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/novecento/piantana.html",
        "desc": "La chiave di lettura della collezione '900 è la volontà di sintetizzare la tradizione muranese del lampadario, nel suo elemento più riconoscibile: il profilo."
    },
    {
        "model": "nuvole",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/nuvole/soffitto.html",
        "desc": "La principale caratteristica di Nuvole, disponibile in quattro diverse dimensioni, sta nel decoro artigianale incavato sulla superficie del diffusore, che lascia intravedere i differenti strati di cristallo e bianco lattimo che la compongono."
    },
    {
        "model": "nuvole",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/nuvole/sospensione.html",
        "desc": "La principale caratteristica di Nuvole, disponibile in quattro diverse dimensioni, sta nel decoro artigianale incavato sulla superficie del diffusore, che lascia intravedere i differenti strati di cristallo e bianco lattimo che la compongono."
    },
    {
        "model": "nuvole",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/nuvole/parete.html",
        "desc": "La principale caratteristica di Nuvole, disponibile in quattro diverse dimensioni, sta nel decoro artigianale incavato sulla superficie del diffusore, che lascia intravedere i differenti strati di cristallo e bianco lattimo che la compongono."
    },
    {
        "model": "oto",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/oto/sospensione.html",
        "desc": "Elementi sferici in vetro soffiato disponibili in 4 misure e due decori, con e senza sorgente luminosa. Il particolare design permette l'installazione verticale di più elementi in vetro ed infinite composizioni a scelta del cliente&nbsp;"
    },
    {
        "model": "ovalina",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/ovalina/parete.html",
        "desc": "Design discreto ed essenziale per esaltare la resa del vetro soffiato satinato sono le caratteristiche di Ovalina."
    },
    {
        "model": "pagoda",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/pagoda/soffitto.html",
        "desc": "Serie di elementi modulari in vetro soffiato, realizzati con la tecnica della sfumatura da cristallo trasparente a bianco pastello."
    },
    {
        "model": "pagoda",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/pagoda/sospensione.html",
        "desc": "Serie di elementi modulari in vetro soffiato, realizzati con la tecnica della sfumatura da cristallo trasparente a bianco pastello."
    },
    {
        "model": "peggy",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/peggy/sospensione.html",
        "desc": "Il vetro soffiato bianco lavorato a mano insieme al metallo lucido color piombo, interpretano la polarità cromatica del black&amp;white con la leggerezza di un segno razionale ed elegante. Con un’installazione di grande effetto, il lighting system Peggy illumina il Cafè del Peggy Guggenheim Museum di Venezia.<br>"
    },
    {
        "model": "peggy",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/peggy/parete.html",
        "desc": "Il vetro soffiato bianco lavorato a mano insieme al metallo lucido color piombo, interpretano la polarità cromatica del black&amp;white con la leggerezza di un segno razionale ed elegante. Con un’installazione di grande effetto, il lighting system Peggy illumina il Cafè del Peggy Guggenheim Museum di Venezia.<br>"
    },
    {
        "model": "penta",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/penta/soffitto.html",
        "desc": "Penta reinterpreta in maniera contemporanea la classica forma sferica nel vetro soffiato, armonizzando linee naturali e geometriche."
    },
    {
        "model": "penta",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/penta/sospensione.html",
        "desc": "Penta reinterpreta in maniera contemporanea la classica forma sferica nel vetro soffiato, armonizzando linee naturali e geometriche."
    },
    {
        "model": "poc",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/poc/sospensione.html",
        "desc": "L'esclusivo impiego della membrana interna nella collezione Poc genera, come una lente, l'effetto di una sfera composta da due metà. La resa di ogni membrana è diversa, creando per ciascun pezzo dinamiche variazioni di intensità di luce e colore sulla superficie."
    },
    {
        "model": "poc",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/poc/tavolo.html",
        "desc": "L'esclusivo impiego della membrana interna nella collezione Poc genera, come una lente, l'effetto di una sfera composta da due metà. La resa di ogni membrana è diversa, creando per ciascun pezzo dinamiche variazioni di intensità di luce e colore sulla superficie."
    },
    {
        "model": "poc",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/poc/faretto.html",
        "desc": "L'esclusivo impiego della membrana interna nella collezione Poc genera, come una lente, l'effetto di una sfera composta da due metà. La resa di ogni membrana è diversa, creando per ciascun pezzo dinamiche variazioni di intensità di luce e colore sulla superficie."
    },
    {
        "model": "pod",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/pod/soffitto.html",
        "desc": "La collezione Pod è un esperimento di luce, traslucidità e trasparenza."
    },
    {
        "model": "pod",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/pod/sospensione.html",
        "desc": "La collezione Pod è un esperimento di luce, traslucidità e trasparenza."
    },
    {
        "model": "pod",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/pod/parete.html",
        "desc": "La collezione Pod è un esperimento di luce, traslucidità e trasparenza."
    },
    {
        "model": "puppet",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/puppet/sospensione.html",
        "desc": "Collezione di lampadari con diffusori in vetro soffiato sfumato e rigato irregolarmente. Le braccia del lampadario sono appese singolarmente a piacere del cliente. "
    },
    {
        "model": "puppet",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/puppet/parete.html",
        "desc": "Collezione di lampadari con diffusori in vetro soffiato sfumato e rigato irregolarmente. Le braccia del lampadario sono appese singolarmente a piacere del cliente. "
    },
    {
        "model": "puppet",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/puppet/tavolo.html",
        "desc": "Collezione di lampadari con diffusori in vetro soffiato sfumato e rigato irregolarmente. Le braccia del lampadario sono appese singolarmente a piacere del cliente. "
    },
    {
        "model": "puppet",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/puppet/piantana.html",
        "desc": "Collezione di lampadari con diffusori in vetro soffiato sfumato e rigato irregolarmente. Le braccia del lampadario sono appese singolarmente a piacere del cliente. "
    },
    {
        "model": "quadra",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/quadra/soffitto.html",
        "desc": "Collezione di plafoniere installabili anche come punti luce da parete, progettate per ottimizzare i consumi energetici senza sacrificare la resa luminosa."
    },
    {
        "model": "quadra",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/quadra/parete.html",
        "desc": "Collezione di plafoniere installabili anche come punti luce da parete, progettate per ottimizzare i consumi energetici senza sacrificare la resa luminosa."
    },
    {
        "model": "quadra-09",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/quadra-09/soffitto.html",
        "desc": "Collezione di plafoniere installabili anche come punti luce da parete, progettate per ottimizzare i consumi energetici senza sacrificare la resa luminosa."
    },
    {
        "model": "quadra-09",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/quadra-09/parete.html",
        "desc": "Collezione di plafoniere installabili anche come punti luce da parete, progettate per ottimizzare i consumi energetici senza sacrificare la resa luminosa."
    },
    {
        "model": "redentore",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/redentore/soffitto.html",
        "desc": "Le foglie in vetro fuso d'ispirazione classica e i dettagli in oro a 24k sono le caratteristiche comuni a questa famiglia di lampade da soffitto e parete, punti luce perfetti in qualsiasi arredamento elegante."
    },
    {
        "model": "redentore",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/redentore/parete.html",
        "desc": "Le foglie in vetro fuso d'ispirazione classica e i dettagli in oro a 24k sono le caratteristiche comuni a questa famiglia di lampade da soffitto e parete, punti luce perfetti in qualsiasi arredamento elegante."
    },
    {
        "model": "reder",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/reder/sospensione.html",
        "desc": "Sintesi di due materiali diversi, la linea Reder presenta una montatura metallica che è più di un supporto per il diffusore: è il naturale sviluppo delle linee decorative del vetro soffiato, in un volume unitario."
    },
    {
        "model": "reder",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/reder/parete.html",
        "desc": "Sintesi di due materiali diversi, la linea Reder presenta una montatura metallica che è più di un supporto per il diffusore: è il naturale sviluppo delle linee decorative del vetro soffiato, in un volume unitario."
    },
    {
        "model": "reder",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/reder/tavolo.html",
        "desc": "Sintesi di due materiali diversi, la linea Reder presenta una montatura metallica che è più di un supporto per il diffusore: è il naturale sviluppo delle linee decorative del vetro soffiato, in un volume unitario."
    },
    {
        "model": "reder",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/reder/piantana.html",
        "desc": "Sintesi di due materiali diversi, la linea Reder presenta una montatura metallica che è più di un supporto per il diffusore: è il naturale sviluppo delle linee decorative del vetro soffiato, in un volume unitario."
    },
    {
        "model": "rialto",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/rialto/soffitto.html",
        "desc": "L'eleganza di questa collezione viene dalla finitura ondulata del vetro 'costolato' e dal bordo di cristallo fuso in rilievo, tipici della tradizione muranese."
    },
    {
        "model": "rialto",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/rialto/parete.html",
        "desc": "L'eleganza di questa collezione viene dalla finitura ondulata del vetro 'costolato' e dal bordo di cristallo fuso in rilievo, tipici della tradizione muranese."
    },
    {
        "model": "riga",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/riga/soffitto.html",
        "desc": "Collezione di plafoniere e punti luce a parete in vetro fuso, d'ispirazione classica, e dalle linee semplici ed eleganti."
    },
    {
        "model": "riga",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/riga/parete.html",
        "desc": "Collezione di plafoniere e punti luce a parete in vetro fuso, d'ispirazione classica, e dalle linee semplici ed eleganti."
    },
    {
        "model": "rina",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/rina/soffitto.html",
        "desc": "Si ispira al tarassaco del quale ricorda il pappo grazie alla leggera texture della superficie, realizzata con la tradizionale tecnica delle murrine."
    },
    {
        "model": "rina",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/rina/sospensione.html",
        "desc": "Si ispira al tarassaco del quale ricorda il pappo grazie alla leggera texture della superficie, realizzata con la tradizionale tecnica delle murrine."
    },
    {
        "model": "rina",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/rina/tavolo.html",
        "desc": "Si ispira al tarassaco del quale ricorda il pappo grazie alla leggera texture della superficie, realizzata con la tradizionale tecnica delle murrine."
    },
    {
        "model": "rina",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/rina/piantana.html",
        "desc": "Si ispira al tarassaco del quale ricorda il pappo grazie alla leggera texture della superficie, realizzata con la tradizionale tecnica delle murrine."
    },
    {
        "model": "rina",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/rina/faretto.html",
        "desc": "Si ispira al tarassaco del quale ricorda il pappo grazie alla leggera texture della superficie, realizzata con la tradizionale tecnica delle murrine."
    },
    {
        "model": "romanza",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/romanza/soffitto.html",
        "desc": "All'insegna di un'eleganza sobria questa collezione di lampade da soffitto e da parete, fatte di foglie in vetro fuso e dettagli di vetro ambrato con scaglie d'oro 24k."
    },
    {
        "model": "romanza",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/romanza/parete.html",
        "desc": "All'insegna di un'eleganza sobria questa collezione di lampade da soffitto e da parete, fatte di foglie in vetro fuso e dettagli di vetro ambrato con scaglie d'oro 24k."
    },
    {
        "model": "saba",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/saba/soffitto.html",
        "desc": "Disponibile in quattro dimensioni diverse, Saba può essere installata come lampada da soffitto o da parete."
    },
    {
        "model": "saba",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/saba/sospensione.html",
        "desc": "Disponibile in quattro dimensioni diverse, Saba può essere installata come lampada da soffitto o da parete."
    },
    {
        "model": "saba",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/saba/parete.html",
        "desc": "Disponibile in quattro dimensioni diverse, Saba può essere installata come lampada da soffitto o da parete."
    },
    {
        "model": "san-giorgio",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/san-giorgio/soffitto.html",
        "desc": "La raffinatissima lavorazione della foglia, con decoro 'diamantato' e 'fraco' a rilievo ondulato, rende questa collezione di lampade in vetro colato, il dettaglio ideale per ambienti dall'eleganza esclusiva.&nbsp;"
    },
    {
        "model": "san-giorgio",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/san-giorgio/parete.html",
        "desc": "La raffinatissima lavorazione della foglia, con decoro 'diamantato' e 'fraco' a rilievo ondulato, rende questa collezione di lampade in vetro colato, il dettaglio ideale per ambienti dall'eleganza esclusiva.&nbsp;"
    },
    {
        "model": "san-marco",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/san-marco/soffitto.html",
        "desc": "Collezione che esalta la decorazione artigianale a rombi e la superficie a bolle sospese, d'ispirazione botanica, creando un effetto luminoso esclusivo."
    },
    {
        "model": "san-marco",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/san-marco/parete.html",
        "desc": "Collezione che esalta la decorazione artigianale a rombi e la superficie a bolle sospese, d'ispirazione botanica, creando un effetto luminoso esclusivo."
    },
    {
        "model": "sata",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/sata/sospensione.html",
        "desc": "Questo sistema di illuminazione prosegue la riflessione stilistica di Trepai, mettendo ancora più in risalto il legno, sulla cui struttura rigorosa e geometrica poggia il corpo illuminante in vetro soffiato. La collezione è declinata in più versioni per adattarsi a diversi contesti, sia classici sia moderni."
    },
    {
        "model": "sata",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/sata/tavolo.html",
        "desc": "Questo sistema di illuminazione prosegue la riflessione stilistica di Trepai, mettendo ancora più in risalto il legno, sulla cui struttura rigorosa e geometrica poggia il corpo illuminante in vetro soffiato. La collezione è declinata in più versioni per adattarsi a diversi contesti, sia classici sia moderni."
    },
    {
        "model": "sata",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/sata/piantana.html",
        "desc": "Questo sistema di illuminazione prosegue la riflessione stilistica di Trepai, mettendo ancora più in risalto il legno, sulla cui struttura rigorosa e geometrica poggia il corpo illuminante in vetro soffiato. La collezione è declinata in più versioni per adattarsi a diversi contesti, sia classici sia moderni."
    },
    {
        "model": "segreto",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/segreto/sospensione.html",
        "desc": "Grazie alla forma e alla doppia tonalità del vetro soffiato, la trasparenza centrale permette alla luce di fluire mentre le fasce semitrasparenti laterali regalano all'ambiente dei toni morbidi."
    },
    {
        "model": "segreto",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/segreto/parete.html",
        "desc": "Grazie alla forma e alla doppia tonalità del vetro soffiato, la trasparenza centrale permette alla luce di fluire mentre le fasce semitrasparenti laterali regalano all'ambiente dei toni morbidi."
    },
    {
        "model": "semai",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/semai/sospensione.html",
        "desc": "Collezione di lampade a sospensione ed a plafone in vetro soffiato a bocca all'interno di una gabbia di acciaio. La tecnica di soffiaggio libera rende ciascuna lampada sempre diversa."
    },
    {
        "model": "sissi",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/sissi/sospensione.html",
        "desc": "Un punto di luce verticale e tecnico, reso possibile dalle forme sinuose e allungate di questa collezione di sospensioni in vetro soffiato."
    },
    {
        "model": "smoking",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/smoking/sospensione.html",
        "desc": "L'effetto d'impatto di questa creazione viene dal contrasto tra due elementi: il diffusore lavorato a mano che crea intricati effetti di luce, e l'elegante corpo in vetro soffiato bianco o nero semitrasparente che ne marca l'eleganza."
    },
    {
        "model": "smoking",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/smoking/piantana.html",
        "desc": "L'effetto d'impatto di questa creazione viene dal contrasto tra due elementi: il diffusore lavorato a mano che crea intricati effetti di luce, e l'elegante corpo in vetro soffiato bianco o nero semitrasparente che ne marca l'eleganza."
    },
    {
        "model": "soffio",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/soffio/soffitto.html",
        "desc": "Lampada da soffitto dal design discreto, che sfrutta al meglio le caratteristiche del vetro colato per occultare la sorgente luminosa, senza perdere trasparenza. La scelta ottimale per lampadine a risparmio energetico."
    },
    {
        "model": "soffio",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/soffio/parete.html",
        "desc": "Lampada da soffitto dal design discreto, che sfrutta al meglio le caratteristiche del vetro colato per occultare la sorgente luminosa, senza perdere trasparenza. La scelta ottimale per lampadine a risparmio energetico."
    },
    {
        "model": "soft",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/soft/soffitto.html",
        "desc": "Plafoniera di misura unica, installabile anche a parete, grazie alla forma lenticolare del paralume in vetro satinato offre una resa luminosa eccellente.&nbsp;"
    },
    {
        "model": "soft",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/soft/parete.html",
        "desc": "Plafoniera di misura unica, installabile anche a parete, grazie alla forma lenticolare del paralume in vetro satinato offre una resa luminosa eccellente.&nbsp;"
    },
    {
        "model": "sogno",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/sogno/soffitto.html",
        "desc": "Disponibile in due misure, Sogno si può montare come lampada da soffitto o da parete."
    },
    {
        "model": "sogno",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/sogno/sospensione.html",
        "desc": "Disponibile in due misure, Sogno si può montare come lampada da soffitto o da parete."
    },
    {
        "model": "sogno",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/sogno/parete.html",
        "desc": "Disponibile in due misure, Sogno si può montare come lampada da soffitto o da parete."
    },
    {
        "model": "sphere",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/sphere/sospensione.html",
        "desc": "Disponibile in due misure, è adatta ad essere installata come singolo elemento o in una composizione multipla."
    },
    {
        "model": "spirit",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/spirit/soffitto.html",
        "desc": "Spirit è la forma del diamante soffiata nel vetro."
    },
    {
        "model": "spirit",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/spirit/sospensione.html",
        "desc": "Spirit è la forma del diamante soffiata nel vetro."
    },
    {
        "model": "spirit",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/spirit/parete.html",
        "desc": "Spirit è la forma del diamante soffiata nel vetro."
    },
    {
        "model": "spirit",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/spirit/tavolo.html",
        "desc": "Spirit è la forma del diamante soffiata nel vetro."
    },
    {
        "model": "sprout",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/sprout/soffitto.html",
        "desc": "Le linee discrete di Sprout la rendono ideale per ogni contesto di arredo."
    },
    {
        "model": "sprout",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/sprout/parete.html",
        "desc": "Le linee discrete di Sprout la rendono ideale per ogni contesto di arredo."
    },
    {
        "model": "stardust",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/stardust/sospensione.html",
        "desc": "Collezioni di lampadari con braccia in vetro soffiato e lavorato a mano. Le strutture in metallo nascondono un originale sistema di fissaggio dei bracci e del sistema di cablaggio.&nbsp;"
    },
    {
        "model": "stardust",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/stardust/parete.html",
        "desc": "Collezioni di lampadari con braccia in vetro soffiato e lavorato a mano. Le strutture in metallo nascondono un originale sistema di fissaggio dei bracci e del sistema di cablaggio.&nbsp;"
    },
    {
        "model": "starnet",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/starnet/sospensione.html",
        "desc": "Infinite trame di tessuti di cristallo permettono di realizzare le composizioni preferite e di modificarle a proprio piacimento in qualsiasi momento. Sorgente luminosa a LED."
    },
    {
        "model": "stone",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/stone/sospensione.html",
        "desc": "Stone è caratterizzata da volumi quasi scolpiti, dove la leggerezza del vetro soffiato si oppone alla solidità di geometrie lineari. In questo contrappunto, tra l’utilizzo di un materiale che naturalmente tende alla forma tonda e un design rigoroso che impone spigoli e linee ortogonali, si esprime l’equilibrio di una composizione luminosa di carattere, inedita."
    },
    {
        "model": "style",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/style/soffitto.html",
        "desc": "Linee essenziali che esaltano la qualità e la bellezza del suo cristallo satinato."
    },
    {
        "model": "style",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/style/sospensione.html",
        "desc": "Linee essenziali che esaltano la qualità e la bellezza del suo cristallo satinato."
    },
    {
        "model": "style",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/style/parete.html",
        "desc": "Linee essenziali che esaltano la qualità e la bellezza del suo cristallo satinato."
    },
    {
        "model": "surface",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/surface/sospensione.html",
        "desc": "Surface ridefinisce il concetto di superficie: un’estensione del vetro la cui forma è in continuo mutamento. Generata dall’unione e l’intersezione di due solidi in rotazione, assume figure diverse a seconda del punto di vista, lasciando all’osservatore il compito di interpretarlo e reinterpretarlo volta per volta.<br>"
    },
    {
        "model": "tablo",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/tablo/sospensione.html",
        "desc": "La peculiarità di questa linea sta nella grande accuratezza e abilità che richiedono soffiatura e taglio di un vetro unico. L'elemento vitreo viene fissato alla struttura di laminato personalizzato in esclusiva da Abet Laminati, senza l'ausilio di alcuna parte metallica. La forma trae ispirazione dai caratteri maschile e femminile ed è disponibile in differenti combinazioni e opzioni d'illuminazione."
    },
    {
        "model": "tablo",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/tablo/tavolo.html",
        "desc": "La peculiarità di questa linea sta nella grande accuratezza e abilità che richiedono soffiatura e taglio di un vetro unico. L'elemento vitreo viene fissato alla struttura di laminato personalizzato in esclusiva da Abet Laminati, senza l'ausilio di alcuna parte metallica. La forma trae ispirazione dai caratteri maschile e femminile ed è disponibile in differenti combinazioni e opzioni d'illuminazione."
    },
    {
        "model": "tablo",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/tablo/piantana.html",
        "desc": "La peculiarità di questa linea sta nella grande accuratezza e abilità che richiedono soffiatura e taglio di un vetro unico. L'elemento vitreo viene fissato alla struttura di laminato personalizzato in esclusiva da Abet Laminati, senza l'ausilio di alcuna parte metallica. La forma trae ispirazione dai caratteri maschile e femminile ed è disponibile in differenti combinazioni e opzioni d'illuminazione."
    },
    {
        "model": "tahoma",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/tahoma/sospensione.html",
        "desc": "La Dahlia che porta lo stesso nome ha ispirato questa collezione di lampade dalla complessa geometria."
    },
    {
        "model": "tahoma",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/tahoma/parete.html",
        "desc": "La Dahlia che porta lo stesso nome ha ispirato questa collezione di lampade dalla complessa geometria."
    },
    {
        "model": "tahoma",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/tahoma/tavolo.html",
        "desc": "La Dahlia che porta lo stesso nome ha ispirato questa collezione di lampade dalla complessa geometria."
    },
    {
        "model": "tahoma",
        "category": "faretto",
        "uri": "https://www.vistosi.it/prodotti/tahoma/faretto.html",
        "desc": "La Dahlia che porta lo stesso nome ha ispirato questa collezione di lampade dalla complessa geometria."
    },
    {
        "model": "tahoma-round",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/tahoma-round/soffitto.html",
        "desc": "L'evoluzione del design di Tahoma nella versione Round mantiene le stesse aspirazioni geometriche dell'originale, sovrapponendo verticalmente gli strati che danno vita a una forma sferica di maggiori dimensioni e aumentano la versatilità di questa collezione."
    },
    {
        "model": "tahoma-round",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/tahoma-round/sospensione.html",
        "desc": "L'evoluzione del design di Tahoma nella versione Round mantiene le stesse aspirazioni geometriche dell'originale, sovrapponendo verticalmente gli strati che danno vita a una forma sferica di maggiori dimensioni e aumentano la versatilità di questa collezione."
    },
    {
        "model": "tahoma-round",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/tahoma-round/parete.html",
        "desc": "L'evoluzione del design di Tahoma nella versione Round mantiene le stesse aspirazioni geometriche dell'originale, sovrapponendo verticalmente gli strati che danno vita a una forma sferica di maggiori dimensioni e aumentano la versatilità di questa collezione."
    },
    {
        "model": "thor",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/thor/sospensione.html",
        "desc": "Ampia gamma di sospensioni, lampade da tavolo, da soffitto e da parete caratterizzate da un design pulito e moderno."
    },
    {
        "model": "thor",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/thor/parete.html",
        "desc": "Ampia gamma di sospensioni, lampade da tavolo, da soffitto e da parete caratterizzate da un design pulito e moderno."
    },
    {
        "model": "thor",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/thor/tavolo.html",
        "desc": "Ampia gamma di sospensioni, lampade da tavolo, da soffitto e da parete caratterizzate da un design pulito e moderno."
    },
    {
        "model": "thor",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/thor/piantana.html",
        "desc": "Ampia gamma di sospensioni, lampade da tavolo, da soffitto e da parete caratterizzate da un design pulito e moderno."
    },
    {
        "model": "torcello",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/torcello/parete.html",
        "desc": "Modello da parete realizzato in vetro fuso, dalle linee classiche e pulite. La base impreziosita da scaglie dorate a 24k regala un tocco d'eleganza."
    },
    {
        "model": "trepai",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/trepai/sospensione.html",
        "desc": "La versatilità è la chiave di questa collezione di lampade: Trepai è perfetta in contesti sia classici che moderni, grazie al supporto in legno di noce nella versione da terra. All'origine dialettale veneziana del nome si unisce l'eco della fonetica giapponese, che richiama la severità e semplicità della cultura nipponica."
    },
    {
        "model": "trepai",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/trepai/piantana.html",
        "desc": "La versatilità è la chiave di questa collezione di lampade: Trepai è perfetta in contesti sia classici che moderni, grazie al supporto in legno di noce nella versione da terra. All'origine dialettale veneziana del nome si unisce l'eco della fonetica giapponese, che richiama la severità e semplicità della cultura nipponica."
    },
    {
        "model": "tubes",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/tubes/soffitto.html",
        "desc": "Una serie di cinque elementi lineari di diversa lunghezza in vetro soffiato, che si possono usare come singole sospensioni, lampade a soffitto o in combinazioni multiple."
    },
    {
        "model": "tubes",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/tubes/sospensione.html",
        "desc": "Una serie di cinque elementi lineari di diversa lunghezza in vetro soffiato, che si possono usare come singole sospensioni, lampade a soffitto o in combinazioni multiple."
    },
    {
        "model": "vega",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/vega/tavolo.html",
        "desc": "Una creazione storica del design italiano, recentemente rivisitata in una collezione che all'originale lampada da tavolo unisce i modelli da parete e a pavimento, anche in versione LED."
    },
    {
        "model": "vega",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/vega/piantana.html",
        "desc": "Una creazione storica del design italiano, recentemente rivisitata in una collezione che all'originale lampada da tavolo unisce i modelli da parete e a pavimento, anche in versione LED."
    },
    {
        "model": "withwhite",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/withwhite/soffitto.html",
        "desc": "Collezione di cinque elementi singoli in vetro soffiato satinato, che possono essere installati sia come sospensioni che come lampade da soffitto, ideali per lampadine a risparmio energetico."
    },
    {
        "model": "withwhite",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/withwhite/sospensione.html",
        "desc": "Collezione di cinque elementi singoli in vetro soffiato satinato, che possono essere installati sia come sospensioni che come lampade da soffitto, ideali per lampadine a risparmio energetico."
    },
    {
        "model": "yuba",
        "category": "soffitto",
        "uri": "https://www.vistosi.it/prodotti/yuba/soffitto.html",
        "desc": "Ampia gamma di applique, caratterizzate dalla decorazione a fili neri di vetro fuso applicati alla superficie, che rendono ogni pezzo unico ed esaltano la fattura artigianale."
    },
    {
        "model": "yuba",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/yuba/sospensione.html",
        "desc": "Ampia gamma di applique, caratterizzate dalla decorazione a fili neri di vetro fuso applicati alla superficie, che rendono ogni pezzo unico ed esaltano la fattura artigianale."
    },
    {
        "model": "yuba",
        "category": "parete",
        "uri": "https://www.vistosi.it/prodotti/yuba/parete.html",
        "desc": "Ampia gamma di applique, caratterizzate dalla decorazione a fili neri di vetro fuso applicati alla superficie, che rendono ogni pezzo unico ed esaltano la fattura artigianale."
    },
    {
        "model": "yuba",
        "category": "tavolo",
        "uri": "https://www.vistosi.it/prodotti/yuba/tavolo.html",
        "desc": "Ampia gamma di applique, caratterizzate dalla decorazione a fili neri di vetro fuso applicati alla superficie, che rendono ogni pezzo unico ed esaltano la fattura artigianale."
    },
    {
        "model": "yuba",
        "category": "piantana",
        "uri": "https://www.vistosi.it/prodotti/yuba/piantana.html",
        "desc": "Ampia gamma di applique, caratterizzate dalla decorazione a fili neri di vetro fuso applicati alla superficie, che rendono ogni pezzo unico ed esaltano la fattura artigianale."
    }
]

/*
var single_pages = [
        {
        "model": "tablo",
        "category": "sospensione",
        "uri": "https://www.vistosi.it/prodotti/tablo/sospensione.html",
        "desc": "La peculiarità di questa linea sta nella grande accuratezza e abilità che richiedono soffiatura e taglio di un vetro unico. L'elemento vitreo viene fissato alla struttura di laminato personalizzato in esclusiva da Abet Laminati, senza l'ausilio di alcuna parte metallica. La forma trae ispirazione dai caratteri maschile e femminile ed è disponibile in differenti combinazioni e opzioni d'illuminazione."
    },
]
*/




var pages_number = single_pages.length; // 336



var info = [];

var index = 0;

avvia(index);

function avvia(index){



    if(index == pages_number ){
        fs.writeFile('assets_json.json', JSON.stringify(info, null, 4), 'utf8', function(){
            _.log("FINITO");
        });
        return true;
    }
    else{
        var uri = single_pages[index].uri;
        var model = single_pages[index].model;
        var category = single_pages[index].category;
        var desc = single_pages[index].desc;
            _.log("processo: "+uri+" mancano: "+parseInt(pages_number-1-index))
        request({
            uri: encodeURI(uri),

        }, function(error, response, body) {
            createJsonFromAPage(body, uri, model, category, desc);
        });

    }
}







var arr_single_product = [];

function createJsonFromAPage(body, uri, model, category, desc){

    var $body = $(body);
    var variants = [];
    


    // varianti
    $body.find(".portfolio-item.team.itemsmall").each(function(){
        if( $(this).find('[data-lightbox="gallery-item"]').length > 0 ){
            var name = $(this).find(".team-title h4").html().toString().toLowerCase();
            variants.push({
                name: name,
                model: model,
                category: category,
                variant: (name != category)? name.replace(category+" ","") : undefined,
                url:"https://www.vistosi.it/"+$(this).find("a").attr("href"),
            });
        }
            
    })

    
    // projects
    var arr_projects = [];
    $body.find('.portfolio-overlay[data-lightbox="gallery"]').find("a").each(function(){
        arr_projects.push( "https://www.vistosi.it/"+$(this).attr("href") )
        
    })

    // more
    var more = $body.find('[data-lightbox="iframe"]').attr("href");    

    // uso puppeteer per recuperare i contenuti dentro l'iframe
    (async() => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        
        
        await page.goto(more);

       
        
        let preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);
        var trovati = $(preloaded_bodyHTML).find("#table1 tbody").length;

        if(trovati > 17 ){
            _.log("faccio super scroll della pagina");
            await page.waitFor(200);
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 13000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.evaluate('window.scrollTo(0, 15000)');
            await page.waitFor(200);
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 17000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 18000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.evaluate('window.scrollTo(0, 20000)');
            await page.waitFor(200);
            await page.evaluate('window.scrollTo(0, 21000)');
            await page.evaluate('window.scrollTo(0, 21000)');
            await page.evaluate('window.scrollTo(0, 21000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 22000)');
            await page.evaluate('window.scrollTo(0, 23000)');
            await page.evaluate('window.scrollTo(0, 23000)');
            await page.evaluate('window.scrollTo(0, 23000)');
            await page.evaluate('window.scrollTo(0, 23000)');

            preloaded_bodyHTML = await page.evaluate(() => document.body.innerHTML);
        }
        
        var bodyHTML = preloaded_bodyHTML;
        
        

        
        
        
        await browser.close();

        info.push({
            uri: uri,
            model : model,
            category: category,
            desc: desc,
            variants: variants,
            projects: arr_projects,
            more: {
                more_url : more,
                more: getMoreDate(bodyHTML, model, category),
            },
            //carousel: car_imgs_arr,
            //video : video_url,
            //other_imgs : imgs_arr,
            //projects: hide_imgs,
            //related_imgs : related_imgs,
            //specs: specs_arr 
        })
        
    
        index++;
        
        avvia(index);


      })();
        
    
    

}

function getMoreDate(bodyHTML, root_model, category){
    var $body = $(bodyHTML);
    var $tables = $body.find("#table1 tbody");
    var ret = [];
    $tables.each(function(){
        $(this).find("tbody").each(function(){
                var $title = $(this).find("h3");
                var model = $title.html().trim();
                var $tbody = $title.closest("tbody");
                var light_schema = $tbody.find("img").attr("src");
                var light_system = $tbody.find("div").eq(0).html();
                var download = $tbody.find("div").eq(1).find("a").eq(0).attr("href");
                ret.push({
                    name : model,
                    root_model: root_model,
                    category: category,
                    variant: adjustVariant(model,root_model),
                    light_schema: encodeURI(light_schema),
                    light_system: light_system,
                    download : download,
                    //html: $tbody.html()
                });
            
        })
    })

    return ret;

}

function adjustVariant(model, root_model){
    // caso particolare per TABLO' sospensione 
    var model_low = model.toLowerCase();
    if(model_low == "tablo' sp 2ap"){
        return "tablo'2ap"
    }
    else{
        var ret = model_low.replace(root_model+" ","").replace("sp","").replace("lt","").replace("pl","").replace("pt","").replace("fa","").replace("ap","").trim().replace("  ","");
    }

    
    
    return ret;
}