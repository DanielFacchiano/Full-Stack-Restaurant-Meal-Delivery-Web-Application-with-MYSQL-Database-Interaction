var express = require('express');
var db = require('../database/db-connector');
var router = express.Router();
/* 
	Returns all of the rows and their attributes from the orders table to the front end
*/
router.get('/', function(req, res, next){
    db.pool.query(`SELECT * FROM Orders`, function(err, rows){
        if(err){
            next(err);
            return;
        }
		//console.log(rows);
        res.json(rows);
    });
});

/*
	Special route that returns rows and attributes of Orders joined with customers on customerID to 
	the front end. Used to show which customers placed what orders for holding/resumption
*/
router.get('/joinCustomer', function(req, res, next){
    db.pool.query("SELECT * FROM `Orders` INNER JOIN `Customers` ON `Orders`.`customerID` = `Customers`.`customerID`", function(err, rows){
        if(err){
            next(err);
            return;
        }
        res.json(rows);
    });
});

/* 
	Route to add new order into the db. Recieves orderTotal, restaurantID and CustomerID from the front end.
	Query generates CURRENT_TIME from db and uses it as timestamp for order as orderTime attribute. Assigns a driver
	by combining drivers on drivershifts and seeing which of them are working on the shift corresponding to the current time.
	from this pool of drivers, we select the driver with the smallest running ordersAssigned total, so that drivers should
	be naturally assigned a similar amount of orders everyday. We do this by grouping drivers and using the select min 
	aggregate function. We select the first driver working on the current shift with that number. limit 1 prevents errors here.
	Current shift is assigned by detecting which shifts start and end time is between the currentTime. We then increment the
	assigned drivers ordersAssigned attribute, and return the row we just updated to update in the front end table.
*/
router.post('/', function(req, res, next){
 	var insertedID;
	var bResults = req.body; // body results refrences our post body data
	var query1 = "INSERT INTO Orders (orderTotal, orderTime, driverID, shiftID, restaurantID, customerID)										\
 	 SELECT	? AS orderTotal,																													\
    CURRENT_TIME AS orderTime,																													\
    (Select `Drivers`.driverID from `DriverShifts` INNER JOIN `Drivers` on `DriverShifts`.driverID = `Drivers`.driverID WHERE shiftID = 		\
	(SELECT shiftID FROM Shifts WHERE shiftStartTime <= (SELECT CURRENT_TIME) AND shiftEndTime >= (SELECT CURRENT_TIME)) 						\
	AND ordersAssigned = 																														\
	(select min(ordersAssigned) from `DriverShifts` INNER JOIN `Drivers` on `DriverShifts`.driverID = `Drivers`.driverID WHERE shiftID = 		\
	(SELECT shiftID FROM Shifts WHERE shiftStartTime <= (SELECT CURRENT_TIME) AND shiftEndTime >=  (SELECT CURRENT_TIME))) LIMIT 1) AS driverID,\
    (SELECT shiftID FROM Shifts WHERE shiftStartTime <= (SELECT CURRENT_TIME) AND shiftEndTime >=  (SELECT CURRENT_TIME)) AS shiftID,			\
    ? AS restaurantID,																															\
    ? AS customerID;"	
	db.pool.query(query1, [bResults.orderTotal, bResults.restaurantID, bResults.customerID], function (err, result){
	  	if(err){
            next(err);
            return;
    	}
	console.log("data inserted");
	insertedID = result.insertId;
	var query2 = "																\
	UPDATE `Drivers` 															\
	SET ordersAssigned = ordersAssigned + 1										\
	WHERE driverID = (															\
    SELECT `Drivers`.driverID FROM `DriverShifts`								\
    INNER JOIN `Drivers` ON `DriverShifts`.driverID = `Drivers`.driverID		\
    WHERE shiftID = (															\
        SELECT shiftID FROM Shifts												\
        WHERE shiftStartTime <= (SELECT CURRENT_TIME)							\
        AND shiftEndTime >= (SELECT CURRENT_TIME)								\
    )																			\
    AND ordersAssigned = (														\
        SELECT MIN(ordersAssigned) FROM `DriverShifts`							\
        INNER JOIN `Drivers` ON `DriverShifts`.driverID = `Drivers`.driverID	\
        WHERE shiftID = (														\
            SELECT shiftID FROM Shifts											\
            WHERE shiftStartTime <= (SELECT CURRENT_TIME)						\
            AND shiftEndTime >= (SELECT CURRENT_TIME)							\
        )																		\
  	  )LIMIT 1																	\
	);																			\
	"
	db.pool.query(query2, function (err, result){
	  	if(err){
            next(err);
            return;
    	}
		console.log("Driver ordersAssigned updated");
		
    });
	var query3 = "SELECT * FROM Orders WHERE orderID = ?"
	db.pool.query(query3, [insertedID], function (err, result){
	  	if(err){
            next(err);
            return;
    	}
		console.log(result);
		res.json(result);

    });
		//res.json(result.insertId);
 	});
});
/* 
	Deletes a row from the orders table where the order id corresponds to that received by the front end
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
	Dual purpose route with two query strings. If the request from the front end's put type is null then
	update that row with the corresponding ids attributes to null. If not, retreive a driverID and shiftID
	based upon the time the reusme was placed (mechanics of this explained in post) Return updated rows
	attributes to display in the front end table
*/
router.put('/', function(req, res, next){
    var nullQuery = 'UPDATE Orders SET shiftID = NULL, driverID = NULL WHERE orderID=?';
	var resumeQuery = 'UPDATE Orders SET shiftID = (SELECT shiftID FROM Shifts WHERE shiftStartTime <= 		\
	(SELECT CURRENT_TIME) AND shiftEndTime >= (SELECT CURRENT_TIME)), driverID = (SELECT `Drivers`.driverID \
	FROM `DriverShifts` INNER JOIN `Drivers` ON `DriverShifts`.driverID = `Drivers`.driverID				\
    WHERE shiftID = (SELECT shiftID FROM Shifts	WHERE shiftStartTime <= (SELECT CURRENT_TIME)				\
        AND shiftEndTime >= (SELECT CURRENT_TIME))AND ordersAssigned = (									\
        SELECT MIN(ordersAssigned) FROM `DriverShifts`														\
        INNER JOIN `Drivers` ON `DriverShifts`.driverID = `Drivers`.driverID								\
        WHERE shiftID = (																					\
            SELECT shiftID FROM Shifts																		\
            WHERE shiftStartTime <= (SELECT CURRENT_TIME)													\
            AND shiftEndTime >= (SELECT CURRENT_TIME)														\
        ))LIMIT 1) WHERE orderID = ?';
   	var theQuery = "";
	var params = [req.body.orderID];
	if (req.body.putType == "resume"){
		theQuery = resumeQuery;
	}
	else{
		theQuery = nullQuery;
	}
    db.pool.query(theQuery, params, function(err, row){
        if(err){
            next(err);
            return;
        }
  		db.pool.query(`SELECT * FROM Orders WHERE orderID = ?`,params ,function(err, row){
        if(err){
            next(err);
            return;
        }
		console.log(row);
        res.json(row);
	    });
	});
        //res.json(true);
});

module.exports = router;
