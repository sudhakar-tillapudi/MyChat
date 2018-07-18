var handleChatMessage = function (data, io) {
    console.log('seperate file');
    console.log('data : ' + data.message);
    var today = new Date();
    var time = today.toLocaleTimeString();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    data.sentDateTime = today.toLocaleDateString("en-US", options) + ", "+ time.substr(0,time.lastIndexOf(':'));
    io.sockets.emit('chat-message-response', {
        response: data,
    });

    //store the message into database
    var mongoClient = require('mongodb').MongoClient;
    mongoClient.connect("mongodb://localhost:27017", function (error, client) {
        if (error)
            return console.log('unable to connect to mongodb server... error : ', error);

        console.log('connected to mongodb server successfully!');

        var mongodb = client.db('mychat');
        mongodb.collection('messages').insertOne({
            sender: data.sender,
            receiver: data.receiver,
            senderName: data.senderName,
            receiverName: data.receiverName,
            message: data.message,
            sentDateTime: today, //data.msgDateTime,
            readStatus: false,
            readDateTime: null,
        }, function (err, result) {
            if (error)
                return console.log('error while inserting message into db. error : ', error);
            console.log(result.ops);
        });
        client.close();
    });
}

module.exports = handleChatMessage;