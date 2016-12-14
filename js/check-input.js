function checkInputSid() {
    var targetVal = $("input#twilio-account-sid").val();
    var targetDiv = document.getElementById("div-twilio-account-sid");
    var targetIcon = document.getElementById("icon-twilio-account-sid");

    if (targetVal.length == 34) {
        targetDiv.className = "form-group has-success has-feedback";
        targetIcon.className = "glyphicon glyphicon-ok form-control-feedback"
    } else {
        targetDiv.className = "form-group has-error has-feedback";
        targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
    }
}

function checkInputToken() {
    var targetVal = $("input#twilio-auth-token").val();
    var targetDiv = document.getElementById("div-twilio-auth-token");
    var targetIcon = document.getElementById("icon-twilio-auth-token");

    if (targetVal.length == 32) {
        targetDiv.className = "form-group has-success has-feedback";
        targetIcon.className = "glyphicon glyphicon-ok form-control-feedback"
    } else {
        targetDiv.className = "form-group has-error has-feedback";
        targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
    }
}

function checkInputCallFrom() {
    var targetVal = $("input#call-from-number").val();
    var targetDiv = document.getElementById("div-call-from-number");
    var targetIcon = document.getElementById("icon-call-from-number");

    var re = new RegExp("^\\\+[0-9]+$");
    if (re.test(targetVal)) {
        targetDiv.className = "form-group has-success has-feedback";
        targetIcon.className = "glyphicon glyphicon-ok form-control-feedback"
    } else {
        targetDiv.className = "form-group has-error has-feedback";
        targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
    }
}

function checkInputCallTo() {
    var targetVal = $("input#call-to-number").val();
    var targetDiv = document.getElementById("div-call-to-number");
    var targetIcon = document.getElementById("icon-call-to-number");

    var re = new RegExp("^\\\+[0-9]+$");
    if (re.test(targetVal)) {
        targetDiv.className = "form-group has-success has-feedback";
        targetIcon.className = "glyphicon glyphicon-ok form-control-feedback"
    } else {
        targetDiv.className = "form-group has-error has-feedback";
        targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
    }
}
function checkInputTwiML() {
    var targetVal = $("input#twiml-url").val();
    var targetDiv = document.getElementById("div-twiml-url");
    var targetIcon = document.getElementById("icon-twiml-url");

    var re = new RegExp("^http[s]{0,1}://.*$");
    if (re.test(targetVal)) {
        targetDiv.className = "form-group has-success has-feedback";
        targetIcon.className = "glyphicon glyphicon-ok form-control-feedback"
    } else {
        targetDiv.className = "form-group has-error has-feedback";
        targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
    }
}

function checkInputCallCount() {
    var targetVal = $("input#call-count").val();
    var targetDiv = document.getElementById("div-call-count");
    var targetIcon = document.getElementById("icon-call-count");

    var re = new RegExp("^[0-9]+$");

    if (re.test(targetVal)) {
        if (Number(targetVal) > 0) {
            targetDiv.className = "form-group has-success has-feedback";
            targetIcon.className = "glyphicon glyphicon-ok form-control-feedback"
        } else {
            targetDiv.className = "form-group has-error has-feedback";
            targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
        }
    } else {
        targetDiv.className = "form-group has-error has-feedback";
        targetIcon.className = "glyphicon glyphicon-remove form-control-feedback"
    }
}