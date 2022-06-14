const fs = require("fs");
const { v4 } = require("uuid");
const path = require("path");

const app = {};

app.ensureDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

app.takeScreenShot = async (driver) => {
  if (!app.imagePath) {
    app.imagePath = path.join(__dirname, "output", "images");
  }

  this.app.ensureDir(app.imagePath);
  const encodedString = await driver.takeScreenshot();
  const filePath = path.join(app.imagePath, `${v4()}.jpg`);
  await fs.writeFileSync(filePath, encodedString, "base64");
  return filePath.replace("\\", "/");
};

const process = (n, chars, rest) => {
  if (n == rest.length) {
    const str = rest.reduce((p, c) => p + chars[c], "");
    console.log(str);
    return;
  }

  for (let i = 0; i < chars.length; i++) {
    const nextRest = [...rest, i];
    process(n, chars, nextRest);
  }
};

app.getPassword = (n, chars) => {
  process(n, chars, []);
};

exports.app = app;
