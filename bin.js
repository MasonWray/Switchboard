const fs = require('fs')
const path = require('path')
const express = require('express')
const os = require('os')


const api = require('./assets/api/api')

const app = express()
const port = 3000

// Run startup checks
console.log("Server is starting...");

// Verify appdata directory
if (!fs.existsSync(path.join(process.cwd(), "/appdata/"))) {
    fs.mkdirSync(path.join(process.cwd(), "/appdata/"));
}

// Verify and load settings file
if (!fs.existsSync(path.join(process.cwd(), "/appdata/settings.json"))) {
    var settings = fs.readFileSync(path.join(__dirname, '/assets/def/default_settings.json'));
    fs.writeFileSync(path.join(process.cwd(), '/appdata/settings.json'), settings);
}
var settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "/appdata/settings.json")));

// Verify file info executable
if (!fs.existsSync(path.join(process.cwd(), "/appdata/info.exe"))) {
    var info = fs.readFileSync(path.join(__dirname, '/assets/ext/info.exe'));
    fs.writeFileSync(path.join(process.cwd(), '/appdata/info.exe'), info);
}

// Expose public directory to serve static files
app.use(express.static(path.join(__dirname, "/assets/pub")));
app.listen(port, () => console.log(`PunchBoard Server is listening on port ${port}`))

// Send the settings object
app.get('/settings', (req, res) => {
    res.json(settings);
})

// Update the settings object
app.post('/settings', (req, res) => {

})

app.get('/stats/files', (req, res) => {
    res.json(null);
})

app.get('/stats/system', async (req, res) => {
    res.json(await api.getSystemStats())
})

// List files in all tracked directories
app.get('/list', async (req, res) => {
    res.json(api.getFileList(settings.content.trackers));
})

// Get info for a specific file
app.get('/info/:base64path', async (req, res) => {
    res.json(await api.getFileInfo(Buffer.from(req.params.base64path, 'base64').toString('ascii')));
})