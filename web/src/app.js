const debug = false;
const countdownInterval = 100;
const queryInterval = 2000;
const reconnectInterval = 10000;
var ws = null,
    host = '',
    port = 4647,
    elem = null,
    connected = false,
    running = false,
    time = 0,
    interval = null,
    reconnectTimer = null;

function init() {
    log("Starting");

    elem = document.getElementById('timecode');

    loadSettings();

    ws = new Websock();

    ws.on('open', open);
    ws.on('message', message);
    ws.on('close', close);
    ws.on('error', error);

    connect();
}

function connect() {
    if(reconnectTimer) {
        clearTimeout(reconnectTimer);
    }

    var uri = 'ws://' + location.host + '/remote/' + host + ':' + port;
    ws.open(uri);
}

function loadSettings() {
    host = QS().get('host') || localStorage.host || host;
    port = QS().get('port') || localStorage.port || port
}

function saveSettings(hostArg, portArg) {
    if(hostArg !== host || portArg !== port) {
        ws.close();

        host = hostArg;
        port = portArg;

        localStorage.host = hostArg;
        localStorage.port = portArg;

        connect();
    }
}

function startCounter() {
    interval = setInterval(counter, countdownInterval);
}

function restartCounter() {
    if(interval) {
        clearInterval(interval);
    }
    startCounter();
}

function open() {
    log("Open event");

    connected = true;
    elem.innerHTML = "";
    doRequest();
    restartCounter();
}

function message() {
    log("Message event");

    parseResponse(ws.rQshiftStr());

    setTimeout(function() {
        doRequest();
    }, queryInterval);
}

function doRequest() {
    if(connected) {
        ws.send_string("TR\n");
    }
}

function parseResponse(res) {
    log("Response: " + res);
    if(res.search(/\d{2}:\d{2}:\d{2}:\d{2}/) !== -1) {
        time = parseTimeString(res);
        running = true;
    } else {
        time = -1;
        running = false;
        elem.innerHTML = "";
    }

    restartCounter();
}

function counter() {
    if(running) {
        time = Math.max(0, time - countdownInterval);
        elem.innerHTML = formatTimecode(time);
    }
}

function parseTimeString(str) {
    var hours = parseInt(str.substr(0,2));
    var minutes = parseInt(str.substr(3,2));
    var seconds = parseInt(str.substr(6,2));
    var frames = parseInt(str.substr(9,2));

    var sum = 0;
    try {
        sum = (hours*3600 + minutes*60 + seconds)*1000 + Math.floor(frames/60*1000);
    } catch(Exception) {
    }
    return sum;
}

function formatTimecode(millis) {
    var hours = padNum(Math.floor(millis/(1000*60*60)), 2);
    var minutes = padNum(Math.floor((millis/(1000*60))%60), 2);
    var seconds = padNum(Math.floor((millis/1000)%60), 2);
    var frames = padNum(Math.floor((millis*25/1000)%25), 2);

    return '-' + hours + ':' + minutes + ':' + seconds + '.' + frames;
}

function padNum(num, len) {
    num = num + '';
    return num.length >= len ? num : new Array(len - num.length + 1).join('0') + num;
}

function error(e) {
    console.log("ERROR", e);
}

function close(e) {
    log("Close event");

    connected = false;
    running = false;

    elem.innerHTML = "Disconnected";

    // reconnect
    reconnectTimer = setTimeout(function() {
        connect();
    }, reconnectInterval);
}

function log() {
    if(debug) {
        console.log.apply(console, arguments);
    }
}

window.addEventListener("load", init, false);

var hoverTimeout = null;

// frontend UI
jQuery(document).ready(function($) {
    $('#settings-trigger').click(function(e) {
        e.preventDefault();

        $('#inputHostname').val(host);
        $('#inputPort').val(port);

        $('#settings').modal('show');
    });

    $('#settings-save').click(function() {
        saveSettings($('#inputHostname').val(), $('#inputPort').val());

        $('#settings').modal('hide');
    });

    $('#settings').keydown(function(e) {
        if(e.keyCode == 13) {
            $('#settings-save').click();
        }
    });

    $('#settings-trigger').hide();
    document.body.style.cursor = 'none';
    $('body').mousemove(function() {
        if(hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        $('#settings-trigger').fadeIn();
        document.body.style.cursor = 'auto';

        hoverTimeout = setTimeout(function() {
            $('#settings-trigger').fadeOut();
            document.body.style.cursor = 'none';
        }, 5000);
    });
});