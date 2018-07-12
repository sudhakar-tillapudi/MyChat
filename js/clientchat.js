
var socket = io.connect('http://localhost:3000');

socket.emit("chat-message-request",{
    message : "hi how are you?"
});