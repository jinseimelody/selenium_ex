// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('search', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('search', async function() {
    // Test name: search
    // Step # | name | target | value
    // 1 | open | / | 
    // open URL
    await driver.get("https://www.google.com/")
    // 2 | setWindowSize | 1032x634 | 
    await driver.manage().window().setRect({ width: 1032, height: 634 })
    // 3 | type | name=q | gss-sol
    const searchBox = await driver.findElement(By.name("q"))
    searchBox.sendKeys("gss-sol")
    searchBox.sendKeys(Key.ENTER);
  })
})
