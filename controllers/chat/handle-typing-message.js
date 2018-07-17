var handletypingmessage = function(data,io)
{
    io.sockets.emit('user-is-typing-response',{
        response : data
    });
};

module.exports = handletypingmessage;