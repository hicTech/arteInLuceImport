
'use strict';

const puppeteer = require('puppeteer');



  (async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=ASSIB&cdling=0&fg_eur_usa=E');
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(bodyHTML)
    
    await browser.close();
  })();