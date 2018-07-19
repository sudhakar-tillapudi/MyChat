var handletypingmessage = function(data,io)
{
    io.sockets.in(data.receiver).emit('user-is-typing-response',{
        response : data
    });
};

module.exports = handletypingmessage;