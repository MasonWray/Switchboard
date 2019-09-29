const accentColor = "#95e8b6";

function activatePage(id) {
    $(".page").hide();
    $(`#${id}`).show();
}

function activateTab(id) {
    $(".header-tab").removeClass("tab-active");
    $(`#${id}`).addClass("tab-active");
}

function setElementSizes() {
    $(".page").height($(window).height() - $("#header").height() - 1)
    $("#fileInfo").width($(window).width() - $("#content_list").outerWidth() - 0)
    // console.log(`Treeview Width: ${$("#content_list").outerWidth()}`)
}

$(document).ready(() => {

    // Handle element sizing
    setElementSizes();
    $(window).resize(() => { setElementSizes() })

    // Compile templates
    const template_listbody = Handlebars.compile($("#template_listbody").html());
    Handlebars.registerPartial("list", $("#template_list").html());
    const template_fileDetails = Handlebars.compile($("#template_fileDetails").html());

    // Show default page and enable tab navigation
    activatePage("page_dashboard");
    activateTab("tab_dashboard");
    $(".header-tab").on("click", (event) => { activateTab(event.currentTarget.id) })
    $("#tab_dashboard").click(() => { activatePage("page_dashboard") })
    $("#tab_library").click(() => { activatePage("page_library") })
    $("#tab_import").click(() => { activatePage("page_import") })
    $("#tab_backup").click(() => { activatePage("page_backup") })
    $("#tab_queue").click(() => { activatePage("page_queue") })
    $("#tab_settings").click(() => { activatePage("page_settings") })

    // Get settings object
    $.get("/settings", (data) => { })

    // Get dashboard data
    Chart.defaults.global.defaultFontFamily = "'Open Sans', sans-serif";
    var chartResources = new Chart($("#chartResources"), resourcesChartObject);
    var chartNetwork = new Chart($("#chartNetwork"), networkChartObject);
    var chartDisk = new Chart($("#chartDisk"), diskChartObject);

    $.get("/stats/system", (data) => {
        // console.log(data.netLoad)
    })

    setInterval(() => {
        $.get("/stats/system", (data) => {
            var memData = chartResources.data.datasets.find(d => d.label == "Memory").data;
            memData.push((data.memLoad * 100).toFixed(2));
            if (memData.length > chartResources.data.labels.length) {
                memData.shift();
            }
            chartResources.data.datasets.find(d => d.label == "Memory").data = memData;

            var cpuData = chartResources.data.datasets.find(d => d.label == "CPU").data;
            cpuData.push(data.cpuLoad.toFixed(2));
            if (cpuData.length > chartResources.data.labels.length) {
                cpuData.shift();
            }
            chartResources.data.datasets.find(d => d.label == "CPU").data = cpuData;

            chartResources.update();

            var netData = chartNetwork.data.datasets;
            if(netData.length != data.netLoad.length){
                netData = new Array();

                chartNetwork.data.datasets = netData;
            }

        })
    }, 1000);

    // Get content list
    $.get("/list", (data) => {
        $("#list_body").html(template_listbody({ items: data }));
        $("#contentTreeLoader").hide();

        $("#content_list").find(".collapsible").on("click", function () {
            $(this).parent().find(".nested").first().toggleClass("active");
            $(this).toggleClass("fa-plus-square fa-minus-square");
        })

        $(".file").on("click", function () {
            $("#fileInfo").find("div").hide();
            $("#fileInfo").find("#fileInfoLoader").show();
            $.get(`/info/${btoa($(this).find(".filepath").first().text())}`, (info) => {
                info = JSON.parse(info);
                console.log(info)

                $("#fileInfo").find("div").hide();
                $("#fileInfo").find("#fileInfoData").show();
                $("#fileInfo").find("#fileInfoData").html(template_fileDetails({ info: info }));
            })
        })
    })
})

var resourcesChartObject = {
    type: 'line',
    data: {
        labels: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
        datasets: [
            {
                label: "Memory",
                data: [],
                borderWidth: 2,
                borderColor: "#d595e8",
                lineTension: 0.2,
                fill: false
            },
            {
                label: "CPU",
                data: [],
                borderWidth: 2,
                borderColor: "#95d1e8",
                lineTension: 0.4,
                fill: false
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Server Resource Utilization (%)'
        },
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100
                }
            }]
        }
    }
}

var networkChartObject = {
    type: 'line',
    labels: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
    datasets: [],
    options: {
        title: {
            display: true,
            text: 'Network Utilization (%)'
        },
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100
                }
            }]
        }
    }
}

var diskChartObject = {
    type: 'line',
    labels: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
    datasets: [],
    options: {
        title: {
            display: true,
            text: 'Disk I/O (%)'
        },
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100
                }
            }]
        }
    }
}