var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/*
	Server insert/post function. Inserts into db a row with items corresponding to received
	querystring. Then inserts into drivershifts a corresponding row.
*/
router.post('/', function(req, res, next){
    var query;
    var params;
    // Insert Drivers
    query = 'INSERT INTO Drivers (driverFirstName, driverLastName, ordersAssigned) VALUES (?, ?, ?)';
    params = [req.query.driverFirstName, req.query.driverLastName, req.query.ordersAssigned];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        // Insert DriverShifts
        query = 'INSERT INTO DriverShifts (driverID, shiftID) VALUES (?, ?)';
        params = [row.insertId, null];
        db.pool.query(query, params, function(err, row){
            if(err){
                next(err);
                return;
            }
            res.json(true);
        });
    });
});
/*
	Drivers get request, returns all rows and their attributes to the front end
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Drivers`, function(err, rows){
        if(err){
            next(err);
            return;
        }
        res.json(rows);
    });
});
/*
	Inserts driver into the db based on the querystring received from the front end, returns true if success
*/
router.put('/', function(req, res, next){
    var query = `UPDATE Drivers SET
    driverFirstName=?,
    driverLastName=?,
    ordersAssigned=?
    WHERE driverID=?`;
    var params = [
    req.query.driverFirstName,
    req.query.driverLastName,
    req.query.ordersAssigned,
    req.query.driverID
    ];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});
/*
	Deletes from the db the driver that corresponds to the driverID recevied from the front end
*/
router.delete('/', function(req, res, next){
    var query = 'DELETE FROM Drivers WHERE driverID=?';
    var params = [req.query.driverID];
    db.pool.query(query,params,function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});

module.exports = router;
