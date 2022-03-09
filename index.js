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
    helper.load(async (pageObjects) => {
        try {
            // foreach file in data folder
            for (let pageObject of pageObjects) {
                helper.log("file name: " + pageObject.name);

                await execute(pageObject);
            }
        } catch (err) {
            helper.log("exception: " + err, "red");
        } finally {
            setTimeout(() => {
                await driver.quit();
            }, 1000);
        }
    });
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