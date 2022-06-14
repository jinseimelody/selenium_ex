// Generated by Selenium IDE
const addContext = require("mochawesome/addContext");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { app } = require("../app");
const baseUrl = "https://promotion.thbeverage.vn/";

describe("Access page", function () {
  this.timeout(9000);
  let driver;

  before("before execute", async () => {
    try {
      let options = new chrome.Options().headless();
      driver = await new Builder()
        .setChromeOptions(options)
        .forBrowser("chrome")
        .build();
    } catch (error) {
      console.log(error);
    }
  });

  after("after all", async () => {
    await driver.quit();
  });

  it("No. 001 - Login and display dash board", async function () {
    const chars = ["A", "B"];
    const phone = "0961159460";
    const code = "AAAAAAAA";

    app.getPassword(3, chars);

    await driver.get(baseUrl);
    // login to github
    const txtPhone = await driver.findElement(By.id("phone-on"));
    txtPhone.sendKeys(phone);

    const txtCode = await driver.findElement(By.id("code-on"));
    txtCode.sendKeys(code);

    const chkConfirm = await driver.findElement(By.className("checkmark"));
    chkConfirm.click();

    const btnSubmit = await driver.findElement(
      By.className("submit-btn btn btn-danger m-font")
    );
    btnSubmit.click();

    const btnConfirm = await driver.wait(
      until.elementLocated(By.className("btn btn-danger confirm-info"))
    );
    btnConfirm.click();

    await driver.wait(
      until.elementLocated(By.xpath('//h4[text()="THÔNG BÁO"]'))
    );

    const imgPath = await app.takeScreenShot(driver);
    addContext(this, imgPath);
  });
});
