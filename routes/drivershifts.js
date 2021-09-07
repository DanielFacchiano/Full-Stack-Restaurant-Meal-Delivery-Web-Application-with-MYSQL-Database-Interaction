var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/*
	Inserts into the db the attributes received from the querystring sent from the fron end into
	drivershifts. 
*/
router.post('/', function(req, res, next){
    var query = 'INSERT INTO DriverShifts (driverID, shiftID) VALUES (?, ?)';
    var params = [req.query.driverID, req.query.shiftID];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});
/*
	Returns all of the rows and their attributes from driver shifts to the front end
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM DriverShifts`, function(err, rows){
        if(err){
            next(err);
            return;
        }
        res.json(rows);
    });
});
/*
	Deletes from driver shifts rows that correspond to the received driverID and shiftID.
*/
router.delete('/', function(req, res, next){
    var query = 'DELETE FROM DriverShifts WHERE driverID=? AND shiftID=?';
    var params = [req.query.driverID, req.query.shiftID];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});

module.exports = router;
