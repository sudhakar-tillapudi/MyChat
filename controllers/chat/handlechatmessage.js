var handleChatMessage = function(data,socket)
{
    console.log('seperate file');
    console.log('socket : '+socket );
    console.log('data : '+data.message);
    socket.emit('chat-message-response',{
        response : data
    });
}

module.exports = handleChatMessage;