
'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs')
const https = require('https')


async function main() {
  fs.copyFileSync('./assets_json.json', './assets_json_andrea.json');

  const assets = JSON.parse(fs.readFileSync('./assets_json_andrea.json'))
  const browser = await puppeteer.launch({ headless: true, devtools: true })
  const page = (await browser.pages())[0];
  for (const {more:{more_url:url, more:resources}} of assets) {
    // if (url !== 'https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=PL&cdvistfam=AUROR&cdling=0&fg_eur_usa=E') {
    //   continue;
    // }

    await page.goto(url)
    await page.evaluate(()=> {
      window.crawler = async function (url, file_req, res_exist, dsfile, tiporisorsa, nome_modello, cdvistelet) {
        if (!res_exist == null) return;

        document.querySelector(`[name="file_req"]`).value = file_req;
        document.querySelector(`[name="dsfile"]`).value = dsfile;
        document.querySelector(`[name="tiporisorsa"]`).value = tiporisorsa;
        document.querySelector(`[name="nome_modello"]`).value = nome_modello;
        document.querySelector(`[name="cdvistelet"]`).value = cdvistelet;

        let form = document.getElementById('downloadForm');

        let response = await fetch(
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
        )

        // if ((await response.text()).indexOf('org.postgresql.util.PSQLException:') >=0 ) {
        //   return [url, file_req]
        // } else {
        //   return 'ok'
        // }

        let {il_token} = await response.json()

        let action = new URL(`https://portal.vistosi.it/portal/download/${file_req}`)
        action.search = new URLSearchParams({
          f: file_req,
          tkc: il_token,
          lang: 'it',
        })

        return action.toString()
      }
    })

    for (const [i, resource] of resources.entries()) {
      let { name, category, download } = resource;
      
      let params = download
        .replace(/(.*atk_send_mail_risorsa\()(.*)(\);$)/g, '$2')
        .split(/,\s*/g)
      
      if (params.length === 7) {
        params = [
          params[0],
          params[1],
          params[2] + params[3],
          params[4],
          params[5],
          params[6],
        ]
      }
      params = params.map(d => d[0] == "'"? d.substring(1, d.length-1) : d)

      let link = await page.evaluate(async (params) =>
        await crawler(...params)
      , [url, ...params])
      
      resource.filename = `pdf/${category}_${name}-${i}.pdf`
      let file = fs.createWriteStream(resource.filename);
      https.get(link, response => response.pipe(file));

    }
    
  }

}

(async() => {
  try {
    await main()



    // await page.goto('https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=24PEA&cdling=0&fg_eur_usa=E');
    // let requests = await page.evaluate(() => {
    //   let selector = '#table1 > tbody:nth-child(1) > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > div > a:nth-child(1)'
    //   document.querySelector(selector).click();
    // })
    //await page.waitForSelector('#blue-button');
  } catch(e) {
    console.log('errore', e)
  }
})();