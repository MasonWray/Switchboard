const si = require('systeminformation')

exports.getSystemStats = async function () {
    var info = new Object();
    info.cpuLoad = await si.currentLoad().then((data) => {
        return data.currentload;
    })

    info.memLoad = await si.mem().then((data) => {
        return (data.used / data.total);
    })

    info.netLoad = await si.networkStats().then(async (data) => {
        var ifaces = await si.networkInterfaces().then((data) => {
            return data;
        })
        for (var i in ifaces) {
            for (var j in data) {
                if (ifaces[i].iface == data[j].iface) {
                    data[j].speed = ifaces[i].speed;
                }
            }
        }
        // console.log(data);
        return data;
    })

    return info;
}
