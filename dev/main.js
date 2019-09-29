
const fs = require('fs')
const path = require('path')
const express = require('express')
const proc = require('child_process')

const app = express()

const port = 3000

module.exports = () => {
    // expose public directory to serve static files
    app.use(express.static(path.join(__dirname, "/assets/pub")));
    app.listen(port, () => console.log(`PunchBoard Server is listening on port ${port}`))

    // return list of all movies
    app.get('/list', (req, res) => {
        var start = Date.now();
        var path = "\\\\192.168.86.10\\plexmedia\\Misc\\apptest";
        // var path = "Z:/Misc/McMyAdmin 08-01-2019";
        var ls = getFileList(path);
        var end = Date.now();
        res.json(ls);
        console.log(`Finished scanning ${path} in ${end - start}ms`)
    });

    // API helpers
    function getFileList(dir) {
        var list = new Array();
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var completename = path.join(dir, files[i]);
            if (fs.existsSync(completename)) {
                if (fs.statSync(completename).isFile()) {
                    list.push(new MediaObject(files[i], getFileInfo(completename)));
                }
                if (fs.statSync(completename).isDirectory()) {
                    list.push(getFileList(completename));
                }
            }
        }
        var splitpath = dir.split("\\");
        // console.log(splitpath[splitpath.length - 1]);
        var folderName = splitpath[splitpath.length - 1];
        return new DirectoryObject(folderName, list);
    }

    function getFileInfo(fname) {
        var cmd = `"${path.join(__dirname, '/assets/ext/info.exe')}" --Output=JSON "${fname}"`;
        proc.exec(cmd, (error, stdout, stderr) => {
            if(error){
                // console.log(error);
                return null;
            }
            if(stderr){
                // console.log(stderr);
                return null;
            }

            // console.log(stdout);
            return stdout;
        })
    }

    // serializable object definitions
    function MovieList(list) {
        this.files = list;
    }

    function MediaObject(name, info) {
        this.name = name;
        this.info = info;
    }

    function DirectoryObject(name, items) {
        this.isDirectory = true;
        this.name = name;
        this.items = items;
    }

    // Auxiliary Helpers
    function jprint(obj) {
        console.log(JSON.stringify(obj, false, 3));
    }
}