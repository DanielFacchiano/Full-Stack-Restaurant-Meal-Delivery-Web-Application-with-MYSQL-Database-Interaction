var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/*
	Inserts a shift row into the DB, Shift row built out attributes received from
	front end querystring. After inserting into shifts, inserts appropriate row into
	driverShifts.
*/
router.post('/', function(req, res, next){
    var query;
    var params;
    // Insert Shifts
    query = 'INSERT INTO Shifts (shiftPeriod, shiftStartTime, shiftEndTime) VALUES (?, ?, ?)';
    params = [req.query.shiftPeriod, req.query.shiftStartTime, req.query.shiftEndTime];
    db.pool.query(query, params, function(err, row){
        if(err){
            next(err);
            return;
        }
        // Insert DriverShifts
        query = 'INSERT INTO DriverShifts (driverID, shiftID) VALUES (?, ?)';
        params = [null, row.insertId];
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
	Returns all rows from the DB from shifts
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Shifts`, function(err, rows){
        if(err){
            next(err);
            return;
        }
        res.json(rows);
    });
});
/*
	Updates a shift row by settings the corresponding shifts attributes to what was
	received from the front end.
*/
router.put('/', function(req, res, next){
    var query = `UPDATE Shifts SET
    shiftPeriod=?,
    shiftStartTime=?,
    shiftEndTime=?
    WHERE shiftID=?`;
    var params = [
    req.query.shiftPeriod,
    req.query.shiftStartTime,
    req.query.shiftEndTime,
    req.query.shiftID
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
	Delets the row from shifts with the corresponding shiftID
*/
router.delete('/', function(req, res, next){
    var query = 'DELETE FROM Shifts WHERE shiftID=?';
    var params = [req.query.shiftID];
    db.pool.query(query,params,function(err, row){
        if(err){
            next(err);
            return;
        }
        res.json(true);
    });
});

module.exports = router;
