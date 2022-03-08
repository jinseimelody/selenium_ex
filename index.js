'use strict';
import * as helper from "./helper.js";
import {
    Builder,
    By,
    Key,
    until
} from 'selenium-webdriver';

const url = 'https://toidicodedao.com/';
const imagePath = "./images"

const execute = async () => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get(url);

    await helper.takeScreenShot(imagePath, driver);

    await driver.quit();

    // helper.fetch((data) => {
    //     console.log(JSON.stringify(data));
    // });

}

execute();