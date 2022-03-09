'use strict';
import * as helper from "./helper.js";
import {
    Builder,
    By,
    Key,
    until
} from 'selenium-webdriver';
import { toNumber } from "number-string";

// const imagePath = "./images";
const waitingLimit = 1500;
let processBar = [];
let driver = await new Builder().forBrowser('chrome').setChromeOptions().build();

const load = () => {
    helper.load(async (files) => {
        try {
            // foreach file in data folder
            for (let i = 0; i < files.length; i++) {
                const content = files[i];
                helper.log("file name: " + content.name);

                await execute(content);
            }
        } catch (err) {
            helper.log("exception: " + err, "red");
        } finally {
            // setTimeout(() => {
            //     await driver.quit();
            // }, 1000);
        }
    });
};

const execute = async (content) => {
    const url = content.url;
    helper.log("url: " + url, 'green');

    const tests = content.tests;
    if (!tests) return;

    // execute all test case
    processBar = Array(tests.length).fill(0);
    for (let i = 0; i < tests.length; i++) {
        const testCase = tests[i];
        const commands = testCase.commands;
        if (!commands) return;

        helper.log("case name: " + testCase.name, "green");
        commands.forEach(async (command) => {

            console.log(command.command);
            const exeResult = await executeCommand(url, command);
            if (!exeResult) {
                helper.log("test failed", "red");
                return;
            }
        })
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
            const element = await findElement(target);
            if (!element) return false;
            element.click();
        }; break;

        case "type": {
            const element = await findElement(target);
            if (!element) return false;
            element.sendKeys(value);
        }; break;

        case "mouseOver": {
            const element = await findElement(target);
            const actions = driver.actions({ async: true });
            await actions.move({ origin: element }).perform();
        }; break;
    }

    return true;
};

const findElement = async (target) => {
    let waitingTime = waitingLimit;
    const [locator, value] = target.split("=");
    let element = null;

    while (!element && waitingTime > 0) {
        try {
            element = await driver.findElement(By[locator](value));
            if (element) break;

            // waiting for 300 miliseconds to retry
            await sleep(300);
            waitingTime -= 300;
            if (waitingTime <= 0) {
                helper.log("waiting time limit exceeded", "red");
                break;
            }
        } catch { }
    }
    return element;
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

load();