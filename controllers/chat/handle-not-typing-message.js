var handletypingmessage = function(data,io)
{
    io.sockets.emit('user-is-not-typing-response',{
        response : data
    });
};

module.exports = handletypingmessage;