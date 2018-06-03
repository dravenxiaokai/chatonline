var ws = new WebSocket("ws://127.0.0.1:9090/");
ws.onopen = function () {
    console.log("Opened");
    ws.send("I'm client");
};

ws.onmessage = function (evt) {
    // alert(evt.data);
    // var chatroom = document.getElementById('chatroom')
    // chatroom.innerHTML += '<br>' + evt.data
    var data = evt.data;
    if(data.retCode == 0){
        console.log('receive message:', evt.data);
    }
};

ws.onclose = function () {
    console.log("Server Closed");
};

ws.onerror = function (err) {
    alert("ws error: " + err);
};