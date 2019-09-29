// Mason Wray - 2019

// definitions
let $ = require('jquery');
const { dialog } = require('electron').remote;
let data = require('nedb');
let paths = new data({ filename: "pages/import/paths", autoload: true });
