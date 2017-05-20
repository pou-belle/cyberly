// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cyberly_db'); // connect to our database
var Fingerprint = require('./app/models/fingerprint'); 
var System32 = require('./app/models/system32')


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});




// on routes that end in /fingerprints
// ----------------------------------------------------
router.route('/fingerprints')

    // create a bear (accessed at POST http://localhost:8080/api/fingerprints)
    .post(function(req, res) {

        for(var i = 0; i < req.body.fingerprints.length; i++){
            
            var fingerprint = new Fingerprint();      // create a new instance of the Fingerprint model
            
            fingerprint.uuid = req.body.uuid;  // set the uuid
            fingerprint.filename = req.body.fingerprints[i].filename;  // set the fingerprint filename
            fingerprint.md5 = req.body.fingerprints[i].md5;  // set the md5
            
            // save the fingerprint and check for errors
            fingerprint.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Fingerprint created!', fingerprint: fingerprint });
            });
        }
    });




// second post request  for system32 in order for a second diagram to be created 
router.route('/system32')

    // create a system32 (accessed at POST http://localhost:8080/api/system32)
    .post(function(req, res) {

        for(var i = 0; i < req.body.fingerprints.length; i++){
            
              var system32 = new System32();       // create a new instance of the System32 model
            
            system32.uuid = req.body.uuid;  // set the uuid
            system32.filename = req.body.fingerprints[i].filename;  // set the fingerprint filename(fingerprints is the same because i want also fingerprints in system32 folder)
            system32.md5 = req.body.fingerprints[i].md5;  // set the md5
            
            // save the system32 and check for errors
            system32.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Fingerprint created !', system32: system32  });
            });
        }
    });








// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);







