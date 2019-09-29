const fs = require('fs')
const path = require('path')
const proc = require('child_process')

exports.getFileList = function (trackers) {
    var dirs = new Array();
    for (t in trackers) {
        dirs.push(getFileListSync(trackers[t]))
    }
    return dirs;
}

exports.getFileInfo = async function (filepath) {
    return await new Promise((resolve, reject) => {
        proc.exec(`"${path.join(process.cwd(), '/appdata/info.exe')}" --Output=JSON "${filepath}"`, (error, stdout, stderr) => {
            if (error) { reject(error) }
            else if (stderr) { reject(stderr) }
            else { resolve(stdout) }
        })
    }).then((info) => {
        // Remove @ from JSON
        info = JSON.parse(info.replace(/@/g, ""));
        let fname = filepath;
        fname = fname.split("\\");
        fname = fname[fname.length - 1];
        fname = fname.split(".");
        fname.pop();
        info.media.filename = fname;

        // Restructure object
        for (t of info.media.track) {
            switch (t.type) {
                case "General":
                    if (!info.media.general) { info.media.general = new Array() }
                    info.media.general.push(t)
                    break;
                case "Video":
                    if (!info.media.video) { info.media.video = new Array() }
                    info.media.video.push(t)
                    break;
                case "Audio":
                    if (!info.media.audio) { info.media.audio = new Array() }
                    info.media.audio.push(t)
                    break;
                case "Text":
                    if (!info.media.text) { info.media.text = new Array() }
                    info.media.text.push(t)
                    break;
                case "Menu":
                    if (!info.media.menu) { info.media.menu = new Array() }
                    info.media.menu.push(t)
                    break;
                default:
                    if (!info.media.misc) { info.media.misc = new Array() }
                    info.media.misc.push(t)
                    break;
            }
        }
        delete info.media.track;
        return JSON.stringify(info);
    })
}

function getFileListSync(dir) {
    try {
        var list = new Array();
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var completename = path.join(dir, files[i]);
            if (fs.existsSync(completename)) {
                if (fs.statSync(completename).isFile()) {
                    list.push(new FileObject(files[i].split(".")[0], completename));
                }
                if (fs.statSync(completename).isDirectory()) {
                    list.push(getFileListSync(completename));
                }
            }
        }
        var splitpath = dir.split("\\");
        var folderName = splitpath[splitpath.length - 1];
        list.sort((a, b) => {
            let aval = 0; let bval = 0;
            if (a.isDirectory) { aval += 10 }
            if (b.isDirectory) { bval += 10 }
            return bval - aval;
        });
        return new DirectoryObject(folderName, list);
    }
    catch (error) {
        console.log(error);
        return new ErrorObject(error);
    }
}

function FileObject(name, path) {
    this.name = name;
    this.path = path;
}

function DirectoryObject(name, items) {
    this.isDirectory = true;
    this.name = name;
    this.items = items;
}

function ErrorObject(err) {
    this.name = "Error Occurred";
    this.err = err;
}