// Generated by Selenium IDE
const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const { takeScreenShot, findElement, sleep } = require('../helper');
const config = require('../config/github_login_config.json');

describe('login git hub', function () {
    this.timeout(30000);
    let driver;
    let vars;
    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        vars = {};
    })
    afterEach(async function () {
        await driver.quit();
    })
    it('login git hub', async function () {
        await driver.get("https://github.com/");
        await driver.manage().window().setRect({
            width: 1936,
            height: 1056
        })
        await takeScreenShot(config.name, driver)
        await driver.findElement(By.linkText("Sign in")).click()
        const loginField = await driver.findElement(By.id("login_field"))
        loginField.click()
        loginField.sendKeys(config.input.userName)

        const password = await driver.findElement(By.id("password"))
        password.click()
        password.sendKeys(config.input.password)

        await takeScreenShot(config.name, driver)
        await driver.findElement(By.name("commit")).click();
        const element = await findElement(driver, By.linkText("jinseimelody/selenium_ex"))
        await driver.actions({async: true}).move({origin:element}).perform()
        
        await sleep(300);
        await takeScreenShot(config.name, driver)
        await driver.findElement(By.linkText("jinseimelody/selenium_ex")).click()

        await sleep(300);
        await takeScreenShot(config.name, driver)
    })
})