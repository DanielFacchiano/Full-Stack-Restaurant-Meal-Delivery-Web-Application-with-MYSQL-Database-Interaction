var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/* 
	Returns the rows where the driverID corresponds to the one received from the front end
*/
router.post('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Orders WHERE driverID = ?`,[req.body.orderID], function(err, rows){
        if(err){
            next(err);
            return;
        }
        res.json(rows);
    });
});
/*
	Deletes rows from the DB where the order id corresponds to the one recevied from the front end
 */
router.delete('/', function(req, res, next){
    var query = 'DELETE FROM Orders WHERE orderID = ?';
    var params = [req.body.orderID];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});
/* 
	Update the row in orders delivery time to the current time in the DB.
*/
router.put('/', function(req, res, next){
    var query = 'UPDATE Orders SET deliveryTime = CURRENT_TIME WHERE orderID = ?';
    var params = [req.body.orderID];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});
/* 
	Returns all of the rows and their attributes from drivers
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Drivers`, function(err, rows){
        if(err){
            next(err);
            return;
        }
		//console.log(rows);
        res.json(rows);
    });
});

module.exports = router;
