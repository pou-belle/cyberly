// server.js

// =============================================================================

// call the packages we need
var express    = require('express');        
var app        = express();                
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');




mongoose.connect(uristring, function (err, res) {

 	if (err) {
     	console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      	console.log ('Succeeded connected to: ' + uristring);
   }
});

)

var Fingerprint = require('./app/models/fingerprint'); 
var System32 = require('./app/models/system32');
var ProgramFiles86 = require('./app/models/programfiles86');
var User = require('./app/models/user');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Content-Type', 'application/json')
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(allowCrossDomain);



var port = process.env.PORT || 8080;   
// var port = process.env.PORT || 3000;        // set our port

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

        var uuid=req.body.uuid;
        var userQuery ={ 'uuid':req.body.uuid};
        var userUpdate = {'uuid':req.body.uuid};

	    User.findOneAndUpdate( userQuery, userUpdate, {upsert:true, returnOriginal:false},function(err,doc){

	    //
	    if(err) {
	    return res.send(500, {error:err});
	    }



	        console.log(doc);
	        var userId = doc.id;

	        for(var i = 0; i < req.body.fingerprints.length; i++) {

            	       	var fingerprint = new Fingerprint();      // create a new instance of the Fingerprint model
            	        // fingerprint.uuid = req.body.uuid;  // set the uuid
            	        // fingerprint.parentName = req.body.fingerprints[i].parentName;//set the parentName
            	        // fingerprint.filename = req.body.fingerprints[i].filename;  // set the fingerprint filename
            	        // fingerprint.md5 = req.body.fingerprints[i].md5;  // set the md5

            	       	var query = {'uuid':req.body.uuid, 'filename':req.body.fingerprints[i].filename};
            	       	var update = {'uuid':req.body.uuid, 'filename':req.body.fingerprints[i].filename, 'md5':req.body.fingerprints[i].md5, 'parentName': req.body.fingerprints[i].parentName};

            	   		Fingerprint.findOneAndUpdate(query, update, {upsert:true, returnOriginal:false}, function(err, doc) {

            	    		if (err)
            	   				return res.send(500, { error: err });
            	   			else {
            	   			    return res.send(userId);
                            }
            			});

            	    }
	    });


	});




// second post request  for system32 in order for a second diagram to be created 
router.route('/system32')

    // create a system32 (accessed at POST http://localhost:8080/api/system32)
    .post(function(req, res) {
        var uuid=req.body.uuid;
                var userQuery ={ 'uuid':req.body.uuid};
                var userUpdate = {'uuid':req.body.uuid};
        User.findOneAndUpdate( userQuery, userUpdate, {upsert:true, returnOriginal:false},function(err,doc){
        	        console.log(doc);
        for(var i = 0; i < req.body.fingerprints.length; i++) {

   // create a new instance of the System32 model

            // system32.uuid = req.body.uuid;  // set the uuid
            // system32.parentName = req.body.fingerprints[i].parentName;//set the parentName
            // system32.filename = req.body.fingerprints[i].filename;  // set the fingerprint filename(fingerprints is the same because i want also fingerprints in system32 folder)
            // system32.md5 = req.body.fingerprints[i].md5;  // set the md5

            var query = {'uuid':req.body.uuid, 'filename':req.body.fingerprints[i].filename};
	       	var update = {'uuid':req.body.uuid, 'filename':req.body.fingerprints[i].filename, 'md5':req.body.fingerprints[i].md5, 'parentName': req.body.fingerprints[i].parentName};

            // save the system32 and check for errors
          	System32.findOneAndUpdate(query, update, {upsert:true,returnOriginal:false}, function(err, doc) {

    			if (err)
   					return res.send(500, { error: err });

    			return res.send(doc.id);
			});
    	}
	});
	});





//            var system32 = new System32();
//third post request fro program files(x86)

router.route('/programfiles86')

    // create a bear (accessed at POST http://localhost:8080/api/fingerprints)
    .post(function(req, res) {

        var uuid=req.body.uuid;
        var userQuery ={ 'uuid':req.body.uuid};
        var userUpdate = {'uuid':req.body.uuid};

	    User.findOneAndUpdate( userQuery, userUpdate, {upsert:true, returnOriginal:false},function(err,doc){
	        console.log(doc);
	        var userId = doc.id;

	        for(var i = 0; i < req.body.fingerprints.length; i++) {

            	       	var programfiles86 = new ProgramFiles86();      // create a new instance of the Fingerprint model
            	        // fingerprint.uuid = req.body.uuid;  // set the uuid
            	        // fingerprint.parentName = req.body.fingerprints[i].parentName;//set the parentName
            	        // fingerprint.filename = req.body.fingerprints[i].filename;  // set the fingerprint filename
            	        // fingerprint.md5 = req.body.fingerprints[i].md5;  // set the md5

            	       	var query = {'uuid':req.body.uuid, 'filename':req.body.fingerprints[i].filename};
            	       	var update = {'uuid':req.body.uuid, 'filename':req.body.fingerprints[i].filename, 'md5':req.body.fingerprints[i].md5, 'parentName': req.body.fingerprints[i].parentName};

            	   		ProgramFiles86.findOneAndUpdate(query, update, {upsert:true, returnOriginal:false}, function(err, doc) {

            	    		if (err)
            	   				return res.send(500, { error: err });
                            res.writeHead(200, {
                                                                    'Content-Type': 'text/json',
                                                            		'Access-Control-Allow-Origin': '*',
                                                            		'X-Powered-By':'nodejs'
                                                                });s
            	    		return res.send(userId);

            			});

            	    }
	    });


	});



// Compare user with the rest of the others
 router.route('/results/system32/:userId').get(function(req, res) {
     getUserComparisonResults(req, res, System32, "System32", "system32");
     console.log(req.params.userId);
    
    });

    router.route('/results/programfiles/:userId').get(function(req, res) {
         getUserComparisonResults(req, res, Fingerprint, "Program Files", "programfiles");
         console.log(req.params.userId);
        
        });

 router.route('/results/programfiles86/:userId').get(function(req, res) {
         getUserComparisonResults(req, res, ProgramFiles86, "Program Files (x86)", "programfiles86");
         console.log(req.params.userId);
      
        });

function  getUserComparisonResults(req, res,  Model,  name,  nameid) {
// request from client must have a path with the userId  then must get that and next
        var userId = req.params.userId;

        console.log("USERID: " + userId);
         // must create a query the percentage of the files are the same or not with the others from db
         //πρωτα πρεπει να παορυε την mac address απο συγκεκριμενο userId afoy uparxei antistixisi apo pinaka
        var ObjectId = mongoose.Types.ObjectId;
        var query = { "_id" : ObjectId(userId) };
        var userMacAddress;
        // finds the user mac address with the given userId
        User.findOne(query, function(err, doc) {
            var sameFilesCount = 0;

            if(err){
                console.log("ERROR"+err);
                return res.send(500, { error: err });
            } else {
                console.log("APOTELESMA QUERY"+doc);
            }
            // Finds md5s from System32 entries that this user has already in our system
            var userMacAddress = doc.uuid;


            // compare users' data with the rest
            var aggregateQuery = [
                              		{"$group" : { "_id": "$md5", "count": { "$sum": 1 }, "origin": { $push: "$uuid" } } },

                              		{"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 0} } },

                              		{"$sort": {"count" : -1} },

                              		{"$project": {"origin" : "$origin", "md5" : "$_id", "_id" : 0, "count" : "$count"} },

                              		{"$match": {"origin" : userMacAddress} },
// to arxeio einai poses fores koino kai me me poion xristi
                              		{"$group" : {"_id": "$count", "files_count": {"$sum": 1 }}}

              ]
            Model.aggregate(aggregateQuery,function(err,doc) {

            if(err){
                console.log("ERROR"+err);
                return res.send(500, { error: err });
            } else {
                var jsonResults = '{"scan_results": [' ;
                jsonResults+= '{';
                jsonResults+= ' "name":"'+name+'",';

                jsonResults+= '"id":"'+nameid+'",'
                jsonResults+='"results": ['
                for(var  i = 0; i < doc.length; i++){

                    jsonResults+= '{ "files_count":' +doc[i].files_count +',';
                    jsonResults+= '"users_count":'  + doc[i]._id + '}';

                    if(i < doc.length - 1) {
                       jsonResults+= ',';
                    }
                }
                jsonResults+= ']';
                jsonResults+= '}]';
                jsonResults+= '}';

            }
             return (res.send(jsonResults));
         });

     });}



//Top 10 apps
        router.route('/results/system32topten').get(function(req, res) {
         getTopTenResults(req, res, System32, "System32", "system32");
        });
         router.route('/results/programfilestopten').get(function(req, res) {
         getTopTenResults(req, res, Fingerprint, "Program Files", "programfiles");
           });

         router.route('/results/programfiles86topten').get(function(req, res) {
                 getTopTenResults(req, res, ProgramFiles86, "Program Files (x86)", "programfiles86");
              });

function  getTopTenResults(req, res,  Model,name,nameid) {
// request from client must have a path with the userId  then must get that and next

        var  aggregateQueryTop10 =
        [
            {"$group" : { "_id": "$md5", "count": { "$sum": 1}, "filename": { $push: "$filename" } } },

            {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 0} } },

            {"$sort": {"count" : -1} },
    //creates new collection
            {"$project": {"filename" : "$filename", "_id" : 0, "count" : "$count"} },

	    ]

         Model.aggregate(aggregateQueryTop10,function(err,doc) {
            if(err){
                console.log("ERROR"+err);
                return res.send(500, { error: err });
            } else {
                var jsonResults = '{"scan_results":[';
                jsonResults+= '{';
                jsonResults+= ' "name":"'+name+'",';

                jsonResults+= '"id":"'+nameid+'",'
                jsonResults+='"results": ['
                for(var  i = 0; i < doc.length; i++){

                    jsonResults+= '{ "filename":"' +doc[i].filename[0] +'",';
                    jsonResults+= ' "users_count":' +doc[i].count +'}';


                    if(i < doc.length - 1) {
                       jsonResults+= ',';
                    }
                }
                jsonResults+= ']';
                jsonResults+= '}]';
                jsonResults+= '}';

            }
             return (res.send(jsonResults));

     });}



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);







