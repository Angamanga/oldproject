 var cloudinary = require('cloudinary'),
     cloudinaryConfig = require('../../config/cloudinary'),
     bodyParser = require('body-parser'),
     fileParser = require('connect-multiparty')(),
     ObjectID = require('mongodb').ObjectID;

 module.exports = function (app, db) {

     //definierar objekt för ny sak
     var newThing;

     function saveInfo(req, res) {
         cloudinary.config(cloudinaryConfig.cloudinaryCredentials);

         cloudinary.uploader.upload(req.files.file.path, function (result) {
             if (result.url) {
                 newThing = {
                     title: req.body.title,
                     category: req.body.category,
                     description: req.body.description,
                     contact: {
                         telephone: req.body.telephone,
                         email: req.body.email
                     },
                     time: Date.now(),
                     location: req.body.location,
                     photopath: result.url
                 }
                 res.send(newThing);
             } else {
                 console.log('error uploading to cloudinary: ', result);
                 res.send('did not get url');
             }
         });
     };


     app.post('/nysak', fileParser, function (req, res) {
         saveInfo(req, res)
     });

     app.get('/newthing', function (req, res) {
         res.json(newThing);
     });


     app.post('/forhandsgranskaEdit', fileParser, function (req, res) {
         saveInfo(req, res);
     });

     app.post('/spara', function (req, res) {
         //lägger objektet i databasen
         newThing = req.body;
         db.collection('things').insert(newThing, function (err, result) {
             if (err) {
                 res.send(err);
             } else {

                 res.send(newThing._id);
             }
         });
     });

     app.delete('/sak/:thing_id', function (req, res) {
         var thing_id = ObjectID.createFromHexString(req.params.thing_id);
         db.collection('things').remove({
             _id: thing_id
         }, function (err, doc) {
             res.send(doc);
         })
     });
     app.put('/sak/:thing_id', function (req, res) {

         var thing_id = ObjectID.createFromHexString(req.params.thing_id);
         console.log(req.body);
         console.log(thing_id);
         db.collection('things').update({
                 _id: thing_id
             }, {
                 $set: req.body

             }

             ,
             function (err, doc) {
                 res.send(thing_id);
             })
     });


 }