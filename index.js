const ExcelJS = require('exceljs/dist/es5');
const moment = require('moment');


const workbook = new ExcelJS.Workbook();

workbook.creator = 'jinseimelody@gmail.com';
workbook.lastModifiedBy = 'khoi.ngo@gss-sol.com';
workbook.created = moment().Date;
workbook.modified = moment().Date;
workbook.lastPrinted = moment.Date;

// Force workbook calculation on load
workbook.calcProperties.fullCalcOnLoad = true;
workbook.views = [{
    x: 0,
    y: 0,
    width: 10000,
    height: 20000,
    firstSheet: 0,
    activeTab: 1,
    visibility: 'visible'
}];

const sheet = workbook.addWorksheet('Selenium');
