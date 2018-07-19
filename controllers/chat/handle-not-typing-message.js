var handletypingmessage = function(data,io)
{
    io.sockets.in(data.receiver).emit('user-is-not-typing-response',{
        response : data
    });
};

module.exports = handletypingmessage;