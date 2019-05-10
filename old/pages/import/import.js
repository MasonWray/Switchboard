// Import Page Script
// Mason Wray - 2019

// definitions
let $ = require('jquery');
const { dialog } = require('electron').remote;
let data = require('nedb');
let paths = new data({ filename: "pages/import/paths", autoload: true });

// path type enumeration
const pathtype = {
    "OPTICAL": 1,
    "DISK": 2,
    "IMPORT": 3
}

// add a popup notification to the "notification" area queue at the top of the page
function notify(message, style) {
    const newalert = `
    <div class='alert ${style} alert-dismissible fade show mt-3' role='alert'>
        ${message}
        <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
            <span aria-hidden='true'>&times;</span>
        </button>
    </div>
    `;

    $("#notification").html(newalert + $("#notification").html());
}

// update info for all paths
function updatePaths() {
    // update optical drive paths
    paths.find({ type: pathtype.OPTICAL }, function (err, docs) {
        var set = false;
        var listitems = "<ul class='list-group list-group-flush'>";
        docs.forEach(function (d) {
            set = true;
            listitems = listitems + `<li class="list-group-item smaller"> ${d.path} </li>`;
        })
        var list = `<ul class='list-group list-group-flush'> ${listitems} </ul>`

        if (set) {
            $("#odCardBody").html(list);
        }
    })

    // update disk drive paths
    // update import directory paths
}

$(document).ready(function () {
    updatePaths();

    // handle OD path addition
    $("#addOD").click(function () {
        var target = {
            type: pathtype.OPTICAL,
            path: dialog.showOpenDialog({ properties: ['openDirectory'] })[0]
        }
        paths.insert(target, function () {
            updatePaths();
        })
    });

    // handle DD path addition
    // handle import edit
    // set disk check interval
})