'use strict';
import * as helper from "./helper.js";
import {
    Builder,
    By,
    Key,
    until
} from 'selenium-webdriver';
import { camelCase } from "change-case";
import { toNumber } from "number-string";
// import { promise } from "selenium-webdriver";

// const imagePath = "./images";
let driver = await new Builder().forBrowser('chrome').setChromeOptions().build();

const load = () => {
    helper.load(async (files) => {
        try {
            // foreach file in data folder
            for (let i = 0; i < files.length; i++) {
                const content = files[i];
                helper.log("file name: " + content.name);

                // dotask
                await execute(content);
            }
        } catch(err) {
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
    for (let i = 0; i < tests.length; i++) {
        const testCase = tests[i];
        const commands = testCase.commands;
        if (!commands) return;

        helper.log("case name: " + testCase.name, 'green');
        commands.forEach(async (command) => {
            await executeCommand(url, command);
        })
        console.log("=========================================================");
    }
};

const executeCommand = async (url, command) => {
    const commandName = command.command;
    switch(commandName) {
        case "open": {
            // open url
            await driver.get(url + command.target);
        } break;

        case "setWindowSize": {
            const target = command.target;
            const [ width, height ] = target.split("x");
            await driver.manage().window().setRect({ width: toNumber(width) , height: toNumber(height) });
        }; break;

        case "click": {
            const target = command.target;
            const [ locator, value ] = target.split("=");
            const element = driver.findElement(By[locator](value));
            element.click();
        }; break;
    }
};

load();