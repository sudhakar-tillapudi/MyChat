var mongoClient = require('mongodb').MongoClient;

mongoClient.connect("mongodb://sudhakar:sudhakar333@ds247141.mlab.com:47141/sudhamychat", function (error, db) {
    if (error)
        return console.log('unable to connect to mongodb server... error : ', error);

    console.log('connected mongodb server successfully!');

    var mongodb = db.db('sudhamychat');
    mongodb.collection('users').insertOne({
        name: "Sudhakar",
        EmailId: "sudha@gmail.com"
    }, function (err, result) {
        if (error)
            return console.log('error while creating record');
        console.log(result.ops);
    });
    db.close();
});

