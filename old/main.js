const electron = require('electron');
const { app, BrowserWindow, Menu } = require('electron');

let win;

function setPage(page){
    win.loadFile(page);
}

function createMenu(){
    const template = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Settings',
                    click(){setPage('pages/settings/settings.html')}
                }
            ]
        },
        {
            label: 'Process',
            submenu: [
                {
                    label: 'Import',
                    click(){setPage('pages/import/import.html')}
                }
            ]
        }
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow(){
    win = new BrowserWindow({webPreferences: {nodeIntegration: true}});
    createMenu();
    setPage('pages/import/import.html');
    // win.webContents.openDevTools();
    win.on('closed', function(){win = null;});
}

app.on('ready', createWindow);