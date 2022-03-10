const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');

exports.sleep = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// driver: selenium driver
exports.takeScreenShot =  async function (path, driver) {
    const encodedString = await driver.takeScreenshot();
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    const relativePath = path + '/' + uuidv4() + '.png';
    console.log(relativePath);
    await fs.writeFileSync(relativePath, encodedString, 'base64');
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
        } catch { }
    }

    return element;
}