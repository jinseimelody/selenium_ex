import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const dataPath = "./data";

export const fetch = async (callback) => {
    fs.readdir(dataPath, (err, files) => {
        const data = []
        if (err) {
            return;
        }
        files.forEach(fileName => {
            const rawData = fs.readFileSync(dataPath + '/' + fileName);
            // console.log(JSON.parse(rawData));
            data.push(JSON.parse(rawData));
        });
        callback(data);
    });
}

// driver: selenium driver
export const takeScreenShot = async (path, driver) => {
    const encodedString = await driver.takeScreenshot();
    try {
        const relativePath = path + '/' + uuidv4() + '.png';
        console.log(relativePath);
        await fs.writeFileSync(relativePath, encodedString, 'base64');

    } catch(ex) {
        console.log(ex);
    }
}