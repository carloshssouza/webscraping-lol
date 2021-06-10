const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://na.leagueoflegends.com/en-us/champions/");

  const nameList = await page.evaluate(() => {
    //toda essa funcao sera executada no browser

    //pegar os nomes que estao na parte dos personagens
    const nodeList = document.querySelectorAll("#___gatsby .gPUACV");

    const spanArray = [...nodeList];

    const nameList = spanArray.map(({ textContent }) => ({
      textContent,
    }));

    return nameList;
  });

  console.log(nameList);

  // await browser.close();
})();
