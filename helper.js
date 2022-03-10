const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');

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