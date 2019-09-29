const electron = require('electron');
const { app, BrowserWindow, Menu } = require('electron');

let win;
function createWindow() {
    win = new BrowserWindow({ frame: false, webPreferences: { nodeIntegration: true } });
    win.loadFile('./index.html');
    // win.webContents.openDevTools();
    win.on('closed', function () { win = null; });
}

app.on('ready', createWindow);