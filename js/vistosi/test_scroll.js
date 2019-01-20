const fs = require('fs');
const puppeteer = require('puppeteer');

function extractItems() {
  const extractedElements = document.querySelectorAll('#table1');
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}

(async () => {
    // Set up browser and page.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Navigate to the demo page.
    await page.goto('https://portal.vistosi.it/eprogen/epRichiesta_risorse_pubblica_v2.jsp?cdvisttp=SP&cdvistfam=ASSIB&cdling=0&fg_eur_usa=E');

    // Scroll and extract items from the page.
    const items = await scrapeInfiniteScrollItems(page, extractItems, 3);

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(bodyHTML);

    // Save extracted items to a file.
    //fs.writeFileSync('./items.txt', items.join('\n') + '\n');

    // Close the browser.
    await browser.close();
})();