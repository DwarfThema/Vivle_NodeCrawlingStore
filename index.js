"use strict";
const express = require("express");
const app = express();

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

const selenium = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

app.listen(process.env.PORT, () => {
  console.log("start");
});

const driver = new selenium.Builder()
  .forBrowser(selenium.Browser.CHROME)
  .setChromeOptions(new chrome.Options().headless())
  .build();

app.get("/db", async (req, res) => {
  res.send("DB페이지\n");
  console.log("셀레니움 시작");

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

                await client.assets.upsert({
                  where: {
                    assetName: alt,
                  },
                  create: {
                    assetName: alt,
                    photoUrl: src,
                    linkUrl: hrefLink,
                  },
                  update: {},
                });
              }
            });
        }, 1000)
      );
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      driver.quit();
    }, 500000);
  }
});

app.get("/toDb", async (req, res) => {
  var takeAsset;
  try {
    takeAsset = await client.assets.findMany();
  } catch (error) {
    console.log(error);
  } finally {
    res.json({
      ok: true,
      data: takeAsset,
    });
  }
});

console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
