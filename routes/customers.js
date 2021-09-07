var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/*
	Server get route, selects all attributes from the db and returns them to the front end.
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Customers`, function(err, rows){
        if(err){
            next(err);
            return;
        }
		//console.log(rows);
        res.json(rows);
    });
});
/*
	Server delete route, deletes the row with the sent customerID from the db table, returns success to server
*/
router.delete('/', function(req, res, next){
    var query = 'DELETE FROM Customers WHERE customerID=?';
    var params = [req.body.customerID];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});
/*
	server insert/post route. Inserts into the db the attributes retreived from the front end, returns the allocated id of
	the succesfully added row.
*/
router.post('/', function(req, res){
 	var bResults = req.body; // body results refrences our post body data
	db.pool.query("INSERT INTO Customers (`customerFirstName`,`customerLastName`,`customerStreet`,`customerZIP`) VALUES (?,?,?,?)", 
		[bResults.customerFirstName, bResults.customerLastName, bResults.customerStreet, bResults.customerZIP],function (err, result){
	  	if(err){
            next(err);
            return;
    	}
		console.log("data inserted");
		res.json(result.insertId);
 	});
});

module.exports = router;
