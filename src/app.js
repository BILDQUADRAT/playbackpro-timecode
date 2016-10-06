const uri = "ws://localhost:8081/";
const debug = false;
const countdownInterval = 100;
var ws = null, elem = null, connected = false, time = 0, interval = null;

function init() {
    log("Starting");

    elem = document.getElementById('timecode');

    ws = new Websock();

    ws.on('open', open);
    ws.on('message', message);
    ws.on('close', close);
    ws.on('error', error);

    ws.open(uri);
}

function startCounter() {
    interval = setInterval(counter, countdownInterval);
}

function restartCounter() {
    clearInterval(interval);
    startCounter();
}

function open() {
    log("Open event");

    connected = true;
    doRequest();
    startCounter();
}

function message() {
    log("Message event");

    parseResponse(ws.rQshiftStr());

    setTimeout(function() {
        doRequest();
    }, 5000);
}

function doRequest() {
    if(connected) {
        ws.send_string("TR\n");
    }
}

function parseResponse(res) {
    log("Response: " + res);
    time = parseTimeString(res);
    restartCounter();
}

function counter() {
    time -= countdownInterval;
    elem.innerHTML = formatTimecode(time);
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
    console.err(e);
}

function close(e) {
    log("Close event");
}

function log() {
    if(debug) {
        console.log.apply(console, arguments);
    }
}

window.addEventListener("load", init, false);