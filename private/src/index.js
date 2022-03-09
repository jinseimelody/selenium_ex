'use strict';
import * as helper from "./helper.js";
import {
    Builder,
    By,
    Key,
    until
} from 'selenium-webdriver';
import { toNumber } from "number-string";

const imagePath = "./images";
const waitingLimit = 1500;
const driver = await new Builder().forBrowser('chrome').setChromeOptions().build();

const load = () => {
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
    await driver.findElement(By.name("q")).sendKeys("gss-sol")
    // 4 | click | name=btnK | 
    await driver.findElement(By.name("btnK")).click()
    // 5 | click | xpath=//h3[contains(.,'Công Ty Cổ Phần Giải Pháp Không Gian Xanh')] | 
    await driver.findElement(By.xpath("//h3[contains(.,\'Công Ty Cổ Phần Giải Pháp Không Gian Xanh\')]")).click()
    // 6 | assertElementPresent | xpath=//div[@class='footer_bottom' and contains(., "Green Space Solution")]  | 
    // confirm the GSS website is opened
    {
      const elements = await driver.findElements(By.xpath("//div[@class=\'footer_bottom\' and contains(., \"Green Space Solution\")] "))
      assert(elements.length)
    }
  })
};

const execute = async (pageObject) => {
    const url = pageObject.url;
    helper.log("url: " + url, 'green');

    const tests = pageObject.tests;
    if (!tests) return;

    // execute all test case
    for (const testCase of tests) {
        const commands = testCase.commands;
        if (!commands) return;

        helper.log("case name: " + testCase.name, "green");
        try {
            for (let command of commands) {
                await executeCommand(url, command);
                // take screenshot when command executed successfully
                helper.takeScreenShot(imagePath, driver);
            }
        } catch (err) {
            helper.log("test failed", "red");
            break;
        }

        // todo: write test result to excel
        console.log("=========================================================");
    }
};

const executeCommand = async (url, command) => {
    const commandName = command.command;
    const target = command.target;
    const value = command.value;
    switch (commandName) {
        case "open": {
            await driver.get(url + command.target);
        } break;

        case "setWindowSize": {
            const [width, height] = target.split("x");
            await driver.manage().window().setRect({ width: toNumber(width), height: toNumber(height) });
        }; break;

        case "click": {
            const element = await findElement(command);
            element.click();
        }; break;

        case "type":
        case "sendKeys": {
            const element = await findElement(command);
            element.sendKeys(value);
        }; break;

        case "mouseOver": {
            const element = await findElement(command);
            const actions = driver.actions({ async: true });
            await actions.move({ origin: element }).perform();
        }; break;
    }

    return true;
};

const findElement = async (command) => {
    let element = null;
    if (command.target) {
        let waitingTime = waitingLimit;
        const [locator, value] = command.target.split("=");

        while (!element && waitingTime > 0) {
            try {
                element = await driver.findElement(By[locator](value));
                // return when element had been found by "target" prop
                if (element) return element;

                // waiting for 300 miliseconds to retry
                await sleep(300);
                waitingTime -= 300;
                if (waitingTime <= 0) {
                    helper.log("waiting time limit exceeded", "red");
                    break;
                }
            } catch { }
        }
    }

    // when element not found by "target" then try to find by "targets"
    if (command.targets) {
        for (const target in command.targets) {
            const [expression, _] = target;
            const [locator, value] = expression.split("=");
            element = await driver.findElement(By[locator](value));
            if (element) return element;
        }
    }

    return element;
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

load();