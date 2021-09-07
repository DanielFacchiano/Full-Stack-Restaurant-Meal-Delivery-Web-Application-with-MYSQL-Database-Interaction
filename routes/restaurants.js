var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/*
	Returns all of the rows and their attributes from the Restaurants table
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Restaurants`, function(err, rows){
        if(err){
            next(err);
            return;
        }
		//console.log(rows);
        res.json(rows);
    });
});
/*
	Deletes from restaurants the restaurant with a restaurant id that corresponds 
	the one received from the front end
*/
router.delete('/', function(req, res, next){
    var query = 'DELETE FROM Restaurants WHERE restaurantID=?';
    var params = [req.body.restaurantID];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});
/*
	Inserts a row into restaurants a row with attributes received from the front end. Return that rows
	db id.
*/
router.post('/', function(req, res){
 	var bResults = req.body; // body results refrences our post body data
	db.pool.query("INSERT INTO Restaurants (`restaurantName`,`restaurantStreet`,`restaurantZIP`) VALUES (?,?,?)", 
		[bResults.restaurantName, bResults.restaurantStreet, bResults.restaurantZIP],function (err, result){
	  	if(err){
            next(err);
            return;
    	}
		console.log("data inserted");
		console.log(result.insertId);
		res.json(result.insertId);
 	});
});

module.exports = router;
