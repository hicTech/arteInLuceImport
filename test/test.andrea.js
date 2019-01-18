var {curl} = require('../js/andrea.js')

const url = "https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=ASSIB&cdling=0&fg_eur_usa=E"

curl(url, (err, out) => console.log(out));