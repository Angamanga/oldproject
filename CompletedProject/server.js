//dependencies
var express = require('express'),
    ejs = require('ejs'),
    database = require('./app/database'),
    browse = require('./app/browse'),
    thing = require('./app/thing'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser');

//express
var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/public/views/');

//view engine = ejs 
app.set('view engine', 'ejs');
app.use(bodyParser.json());

//startar databas
var MongoClient = mongodb.MongoClient;
MongoClient.connect(database.url, function (err, db) {
    if (err) {
        console.log('Unable to connect to mongoDB server.Error', err);
    } else {
        console.log('Connection established to ' + database.url);
        //laddar routes och skickar med databasen om anslutningen till databasen funkar
        browse(app, db);
        thing(app, db);
    }
});

//startar servern
app.listen(80);
console.log('server has started');