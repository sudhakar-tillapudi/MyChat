
var socket = io.connect('http://localhost:3000');


$('#txtMsgBody').keyup(function (event) {
    
    if (event.key == "Enter") {
        //alert('sender : '+$('#sender').val());
        //alert('receiver : '+$('#receiver').val());
        socket.emit("chat-message-request", {
            message: $('#txtMsgBody').val(),
            sender : $('#sender').val(),
            receiver : $('#receiver').val()
        });
        $('#txtMsgBody').val('');
    }
});


socket.on('chat-message-response',function(data){
    //$('#txtMessages').text();
    console.log(data.response);
    var messages = $('#txtMessages');
    if(data.response.sender === $("#sender").val())
        messages.append("<span style=\"float:right;padding-right:8px;width:50%\;word-wrap:break-word;\">"+data.response.message+"</span></br>");
    else
        messages.append("<img class=\"messageCircleImage\" src=\"../../images/"+data.response.sender+".jpg\"/><span>"+data.response.message+"</span></br></br>");
    
    
    //messages.scrollTop(messages.prop("scrollHeight"));
    messages.animate({ scrollTop: messages.prop("scrollHeight")}, 1000);
});