const files = require('./files')
const stats = require('./stats')

exports.getFileList = (dir) => {
    var start = Date.now();
    var list = files.getFileList(dir);
    var end = Date.now();
    console.log(`Finished scanning ${dir} in ${end - start}ms`)
    return list;
}

exports.getFileInfo = async function (path) {
    var start = Date.now();
    var info = await files.getFileInfo(path)
    var end = Date.now();
    console.log(`Info collected in ${end - start}ms`)
    return info;
}

exports.getSystemStats = async function () {
    return await stats.getSystemStats();
}

exports.getFileStats = async function () {
}