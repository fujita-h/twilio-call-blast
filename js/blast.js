function init() {
    log("Loaded.");
}

function setTwimlMethod(method) {
    document.getElementById("twiml-method-dropdown").innerHTML = method + ' <span class="caret"></span>';
    $("input#twiml-method").val(method);
}

function startBlast() {
    var formAccountSid = $("input#twilio-account-sid").val();
    var formAuthToken = $("input#twilio-auth-token").val();

    if (formAccountSid.length != 0 && formAuthToken.length != 0) {
        // Twilio Call API
        var apiURL = "https://api.twilio.com/2010-04-01/Accounts/" + formAccountSid + "/Calls.json";

        var formCallFrom = $("input#call-from-number").val();
        var formCallTo = $("input#call-to-number").val();
        var formCount = $("input#call-count").val();
        var formTwiMLMethod = $("input#twiml-method").val();
        var formTwiMLUrl = $("input#twiml-url").val();
        var callCount = parseInt(formCount, 10);
        if (isNaN(callCount)) {
            callCount = 1;
        }

        var href = window.location.href;

        if (formCallFrom.length != 0 && formCallTo.length != 0) {

            // params
            var data = {
                "To": formCallTo,
                "From": formCallFrom,
                "Url": formTwiMLUrl,
                "Method" : formTwiMLMethod
            };

            for (var i = 0; i < callCount; i++) {
                $.ajax({
                    url: apiURL,
                    data: data,
                    type: "post",
                    dataType: "json",
                    timeout: 5000,
                    beforeSend: function (xhr) {
                        var credentials = Base64(formAccountSid + ":" + formAuthToken);
                        xhr.setRequestHeader("Authorization", "Basic " + credentials);
                    },
                    success: function (data) {
                        //console.log(data);
                        setCallStatus(data["sid"], data["from"], data["to"], data["status"]);
                        log("[Call Request] Success." + " -> Call Sid: " + data["sid"]);
                    },
                    error: function (request, errorMessage) {
                        log("[Call Request] Failed. Error: " + errorMessage);
                    }
                });
            }
        }
        else {
            alert("Call From / Call To has not been entered.");
        }

    } else {
        alert("Account Sid / Auth Token has not been entered.");
    }
}

function disconnect(callsid) {
    var formAccountSid = $("input#twilio-account-sid").val();
    var formAuthToken = $("input#twilio-auth-token").val();

    if (formAccountSid.length != 0 && formAuthToken.length != 0) {

        // Twilio Call Status API
        var apiURL = "https://api.twilio.com/2010-04-01/Accounts/" + formAccountSid + "/Calls/" + callsid + ".json";

        // params
        var data = {
            "Status": "completed"
        };

        $.ajax({
            url: apiURL,
            data: data,
            type: "post",
            dataType: "json",
            timeout: 5000,
            beforeSend: function (xhr) {
                var credentials = Base64(formAccountSid + ":" + formAuthToken);
                xhr.setRequestHeader("Authorization", "Basic " + credentials);
            },
            success: function (data) {
                //console.log(data);
                setCallStatus(data["sid"], data["from"], data["to"], data["status"]);
                log("[Disconnect Request] Success." + " -> Call Sid: " + callsid);
            },
            error: function (request, errorMessage) {
                //console.log(data);
                log("[Disconnect Request] Failed." + " -> Call Sid: " + callsid);
            }
        });

    } else {
        alert("Account Sid / Auth Token has not been entered.");
    }

}

function updateStatusTable() {
    var formAccountSid = $("input#twilio-account-sid").val();
    var formAuthToken = $("input#twilio-auth-token").val();

    var table = document.getElementById("table-twilio-call-status");
    var rows = table.rows.length;

    for (var i = 1; i < rows; i++) {
        var callsid = table.rows[i].cells[1].innerHTML;
        var apiURL = "https://api.twilio.com/2010-04-01/Accounts/" + formAccountSid + "/Calls/" + callsid + ".json";
        $.ajax({
            url: apiURL,
            type: "get",
            dataType: "json",
            timeout: 5000,
            beforeSend: function (xhr) {
                var credentials = Base64(formAccountSid + ":" + formAuthToken);
                xhr.setRequestHeader("Authorization", "Basic " + credentials);
            },
            success: function (data) {
                //console.log(data);
                setCallStatus(data["sid"], data["from"], data["to"], data["status"]);
            },
            error: function (request, errorMessage) {
                //console.log(data);
            }
        });
    }
}


// Call Status Table
var isCallSidExistInTable = function (callsid) {
    var table = document.getElementById("table-twilio-call-status");
    var rows = table.rows.length;
    for (var i = 1; i < rows; i++) {
        var currentsid = table.rows[i].cells[1].innerHTML;
        if (callsid === currentsid) {
            return true;
        }
    }
    return false;
}

function setCallStatus(callsid, callfrom, callto, status) {
    var table = document.getElementById("table-twilio-call-status");
    var rows = table.rows.length;

    if (!isCallSidExistInTable(callsid)) {
        var row = table.insertRow(-1);
        row.id = "callStatusTable-Row-" + callsid;
        var cell1 = row.insertCell(-1);
        cell1.id = "callStatusTable-Number-" + callsid;
        cell1.innerHTML = rows;
        var cell2 = row.insertCell(-1);
        cell2.id = "callStatusTable-CallSid-" + callsid;
        var cell3 = row.insertCell(-1);
        cell3.id = "callStatusTable-CallFrom-" + callsid;
        var cell4 = row.insertCell(-1);
        cell4.id = "callStatusTable-CallTo-" + callsid;
        var cell5 = row.insertCell(-1);
        cell5.id = "callStatusTable-Status-" + callsid;
        var cell6 = row.insertCell(-1);
        cell6.id = "callStatusTable-Action-" + callsid;
    }

    var cell = document.getElementById("callStatusTable-CallSid-" + callsid);
    cell.innerHTML = callsid;
    var cell = document.getElementById("callStatusTable-CallFrom-" + callsid);
    cell.innerHTML = callfrom;
    var cell = document.getElementById("callStatusTable-CallTo-" + callsid);
    cell.innerHTML = callto;
    var cell = document.getElementById("callStatusTable-Status-" + callsid);
    cell.innerHTML = status;

    switch (status) {
        case 'queued':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className="info"
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '<button class="btn btn-danger btn-xs" onclick="disconnect(' + "'" + callsid + "'" + ');">Disconnect</button>';
            break;
        case 'ringing':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className="info"
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '<button class="btn btn-danger btn-xs" onclick="disconnect(' + "'" + callsid + "'" + ');">Disconnect</button>';
            break;
        case 'in-progress':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className="success"
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '<button class="btn btn-danger btn-xs" onclick="disconnect(' + "'" + callsid + "'" + ');">Disconnect</button>';
            break;
        case 'canceled':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className=""
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '';
            break;
        case 'completed':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className=""
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '';
            break;
        case 'failed':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className="danger"
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '';
            break;
        case 'busy':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className="danger"
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '';
            break;
        case 'no-answer':
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className="danger"
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '';
            break;
        default:
            var row = document.getElementById("callStatusTable-Row-" + callsid);
            row.className=""
            var cell = document.getElementById("callStatusTable-Action-" + callsid);
            cell.innerHTML = '';
            break;
    }


}



// log function
function log(str) {
    var dt = new Date();
    $("div#log").append(formatDate(new Date()) + " : ");
    $("div#log").append(str);
    $("div#log").append("<br/>");

}

// base64 encoder
function Base64(str) {
    return btoa(unescape(encodeURIComponent(str)));
};

// date format
var formatDate = function (date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
};

