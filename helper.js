const config = require('./config.test.json');
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');
const {
    By,
} = require('selenium-webdriver');

const isNullOrEmpty = function (input) {
    return input === undefined || input === null || input === '';
}

exports.ensureOutputDir = function () {
    const directories = config.evidenceFolder.split("/").reverse();
    let path = "";
    while (directories.length > 0) {
        const directory = directories.pop();
        if (isNullOrEmpty(directory)) continue;

        path += path === "" ? directory : "/" + directory;
        if (!fs.existsSync(path)) {
            console.log("create: " + path);
            fs.mkdirSync(path);
        }
    }
}

exports.sleep = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.login = async function (driver) {
    await driver.get(config.baseUrl + "/login");
    // login to github
    const loginField = await driver.findElement(By.id("login_field"));
    loginField.click();
    loginField.sendKeys(config.userName);

    const password = await driver.findElement(By.id("password"));
    password.click();
    password.sendKeys(config.password);

    await driver.findElement(By.name("commit")).click();
};

// driver: selenium driver
exports.takeScreenShot = async function (driver) {
    const encodedString = await driver.takeScreenshot();
    const fileName = uuidv4() + '.png';
    const relativePath = config.evidenceFolder + "/" + fileName;
    await fs.writeFileSync(relativePath, encodedString, 'base64');
    return fileName;
}

exports.findElement = async function (driver, locator, limit) {
    let element = null;
    let waitingTime = 3000;

    if (limit) {
        waitingTime = limit;
    }

    while (!element && waitingTime > 0) {
        try {
            element = await driver.findElement(locator);
            // return when element had been found by "target" prop
            if (element) return element;

            // waiting for 300 miliseconds to retry
            await sleep(300);
            waitingTime -= 300;
            if (waitingTime <= 0) {
                helper.log("waiting time limit exceeded", "red");
                break;
            }
        } catch {}
    }

    return element;
}