
var socket = io.connect('http://localhost:3000');


$('#txtMsgBody').keyup(function (event) {
    if (event.key == "Enter") {
        socket.emit("chat-message-request", {
            message: $('#txtMsgBody').val()
        });
        $('#txtMsgBody').val('');
    }
});


socket.on('chat-message-response',function(data){
    //$('#txtMessages').text();
    console.log(data.response.message);
    var messages = $('#txtMessages');
    messages.append("<img class=\"messageCircleImage\" src=\"../../images/502.jpg\"/><span>"+data.response.message+"</span></br></br>");
    //messages.append("<span style=\"float:right;padding:8px;\">How are you, im fine </span></br>");
    
    //messages.scrollTop(messages.prop("scrollHeight"));
    messages.animate({ scrollTop: messages.prop("scrollHeight")}, 1000);
});