"use strict";

const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();
const selenium = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const PORT = 8080;
const HOST = `192.168.0.4`;

app.listen(PORT, () => {
  console.log("start");
});

const driver = new selenium.Builder()
  .forBrowser(selenium.Browser.CHROME)
  .setChromeOptions(new chrome.Options().headless())
  .build();

app.get("/db", (req, res) => {
  res.send("DB페이지11\n");
  async function mySelenium() {
    try {
      await driver.get("https://polyhaven.com/models");
      console.log("드라이버 실행");
      driver
        .executeScript(
          `window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"})`
        )
        .then(
          setTimeout(async () => {
            await driver
              .findElements(
                selenium.By.xpath(`//a[@class="GridItem_gridItem__0cuEz"]`)
              )
              .then(async function (productAnchor) {
                for (var i = 1; i < productAnchor.length; i++) {
                  var hrefLink;
                  productAnchor[i].getAttribute(`href`).then(function (href) {
                    hrefLink = href;
                  });
                  console.log(i);

                  const div = await productAnchor[i].findElement(
                    selenium.By.className("GridItem_thumb__M8icc")
                  );

                  const img = await div.findElement(selenium.By.css("img"));

                  const src = await img.getAttribute(`src`);

                  const alt = await img.getAttribute(`alt`);
                  const asset = await client.assets.upsert({
                    where: {
                      assetName: alt,
                    },
                    create: {
                      id: i,
                      assetName: alt,
                      photoUrl: src,
                      linkUrl: hrefLink,
                    },
                    update: {},
                  });
                  console.log(asset);

                  /*                console.log(`assetName : ${alt}`);
                  console.log(`photoUrl : ${src}`);
                  console.log(`linkUrl : ${hrefLink}`); */
                }
              });
          }, 1000)
        );
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        driver.quit();
      }, 200000);
    }
  }
  mySelenium();
  console.log("셀레니움 끝");
});

console.log(`Running on http://${HOST}:${PORT}`);
