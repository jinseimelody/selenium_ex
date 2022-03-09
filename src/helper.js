import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import * as exceljs from 'exceljs';

const dataPath = "./data";
export const log = (text, color) => {
    if (!color) {
        color = "white";
    }
    console.log(chalk[color](text));
};

export const load = async (callback) => {
    fs.readdir(dataPath, (err, files) => {
        const data = []
        if (err) {
            return;
        }
        files.forEach(fileName => {
            const rawData = fs.readFileSync(dataPath + '/' + fileName);
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

export const printPage = async (path, driver) => {
    try {
        const relativePath = path + '/' + uuidv4() + '.pdf';
        let base64 = await driver.printPage({pageRanges:["1-2"]});
        await fs.writeFileSync(relativePath, base64, 'base64');
    } catch (ex) {
        console.log(ex);
    }
}