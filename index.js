const puppeteer = require("puppeteer");
const fs = require("fs");

const parameters = [];
const championsDataList = [];

const convertLetter = (data) => {
  let word = "";

  const lowerString = (str) =>
    str[0].toLowerCase() + str.slice(1).toLowerCase();

  if (data.includes("&")) {
    word = data
      .split(" ")
      .filter((p) => p != "&")
      .join(" ");
    let newWord = word.split(" ").map(lowerString);

    return newWord.shift();
  } else if (data.includes("'")) {
    word = data.split("'").map(lowerString).join("-");
    return word;
  } else if (data.includes(".")) {
    word = data.split(". ").map(lowerString).join("-");
    return word;
  } else {
    word = data.split(" ").map(lowerString).join("-");
    return word;
  }
};

(async () => {
  const browser = await puppeteer.launch();
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

  for (let i = 0; i < nameList.length; i++) {
    parameters.push(await convertLetter(nameList[i].textContent));
  }

  console.log("Starting to get the data...");
  for (let i = 0; i < parameters.length; i++) {
    await page.goto(
      `https://na.leagueoflegends.com/en-us/champions/${parameters[i]}/`
    );
    await page.click(".hZPZqS button", { clickCount: 1 });

    //Collection datas from champions
    const id = i + 1;
    const name = nameList[i].textContent;
    const description = await page.evaluate(() => {
      const data = document.querySelector("#___gatsby .hZPZqS p");

      return data.textContent;
    });

    const role = await page.evaluate(() => {
      const data = document.querySelector("#___gatsby .hwEUco .ieHviE");

      return data.textContent;
    });

    const difficulty = await page.evaluate(() => {
      const data = document.querySelector("#___gatsby .TZXkX .ieHviE");

      return data.textContent;
    });

    const img = await page.evaluate(() => {
      const data = document.querySelector("#___gatsby .cVdVkh img");

      return data.src;
    });

    const dataComplete = { id, name, description, role, difficulty, img };
    championsDataList.push(dataComplete);
  }

  fs.writeFile(
    "./championsData.json",
    JSON.stringify(championsDataList, null, 2),
    (err) => {
      if (err) console.log(err);
      else console.log("File Successfully written!");
    }
  );

  await browser.close();
})();
