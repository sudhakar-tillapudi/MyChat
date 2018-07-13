var handleChatMessage = function(data,io)
{
    console.log('seperate file');
    console.log('data : '+data.message);
    io.sockets.emit('chat-message-response',{
        response : data
    });
}

module.exports = handleChatMessage;