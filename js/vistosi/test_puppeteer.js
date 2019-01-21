
'use strict';

const puppeteer = require('puppeteer');


async function crawler() {
  window.request = async function (file_req, res_exist, dsfile, tiporisorsa, nome_modello, cdvistelet) {
    if (!res_exist == null) return;

    document.querySelector(`[name="file_req"]`).value = file_req;
    document.querySelector(`[name="dsfile"]`).value = dsfile;
    document.querySelector(`[name="tiporisorsa"]`).value = tiporisorsa;
    document.querySelector(`[name="nome_modello"]`).value = nome_modello;
    document.querySelector(`[name="cdvistelet"]`).value = cdvistelet;

    let form = document.getElementById('downloadForm');
    let data = [...form.querySelectorAll('input')].map(d => {
      return { name: d.name, value: d.value }
    })

    return [
      `epRichiesta_risorse_pubblica_ajax.jsp?finto=${Math.floor(Math.random() * 1000000000)}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams(new FormData(form)).toString()
      }
    ]

  }
  let url = 'fileresources/assembling_instructions/SP24PEK2.PDF'
  let opt = await request(url, true, 'Istruzioni montaggio 24PEARLS SP K2 G9 ', 'TECHSHEET', '24PEASP  K2    -', 'G9')
  let resp = await fetch(...opt)
  let json = await resp.json()
  let data = Object.entries(json)
    .filter(([_, value]) => value)
    .reduce((data, [key, value]) => {
      data.append(key, value)
      return data
    }, new FormData)


  let resp = await fetch(url, ...opt)

  //let selector = '#table1 > tbody:nth-child(1) > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > div > a:nth-child(1)'
  //document.querySelector(selector).click();
}

(async() => {
  try {
    const browser = await puppeteer.launch({headless: true, devtools: true});
    const page = await browser.newPage({ networkidle0: true});
    await page.goto('https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=24PEA&cdling=0&fg_eur_usa=E');
    // let requests = await page.evaluate(() => {
    //   let selector = '#table1 > tbody:nth-child(1) > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > div > a:nth-child(1)'
    //   document.querySelector(selector).click();
    // })
    await page.waitForSelector('#blue-button');
  } catch(e) {
    console.log('errore', e)
  }
})();