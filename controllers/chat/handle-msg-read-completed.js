var handleMsgReadCompleted = function (data, io) {
    io.sockets.in(data.sender).emit('msg-read-completed-response', {
        readCompletedTimestamp: data.readCompletedTimestamp,
        sender:data.sender
    });

    //store the read timestamp into database
    var mongoClient = require('mongodb').MongoClient;
    mongoClient.connect("mongodb://localhost:27017", function (error, client) {
        if (error)
            return console.log('unable to connect to mongodb server... error : ', error);

        console.log('connected to mongodb server successfully!');

        var mongodb = client.db('mychat');
        mongodb.collection('messages').updateMany({
            sender: data.sender,
            receiver: data.receiver,
            readStatus : false
        },
            {
                $set : {readStatus : true,
                    readDateTime : new Date(data.readCompletedTimestamp)}
            },
            function (err, result) {
                if (error)
                    return console.log('error while updating message into db. error : ', error);
                console.log(result.ops);
            });
        client.close();
    });
}

module.exports = handleMsgReadCompleted;