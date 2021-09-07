/*
	By Daniel Facchiano and Ethan Davis
	Main server, sets up approrpiate node dependancies, sets port, sets directories, sets up routes
	and listens on designated port.
*/

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var drivers = require('./routes/drivers');
var drivershifts = require('./routes/drivershifts');
var shifts = require('./routes/shifts');
var customers = require('./routes/customers');
var restaurants = require('./routes/restaurants');
var orders = require('./routes/orders');
var ordersByDriver = require('./routes/ordersByDriver');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
var PORT = 7403;

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname,'/public/index.html'));
});
app.use('/drivers', drivers);
app.use('/drivershifts', drivershifts);
app.use('/shifts', shifts);
app.use('/customers', customers);
app.use('/restaurants', restaurants);
app.use('/orders', orders);
app.use('/ordersByDriver', ordersByDriver);


app.listen(PORT, function(){
    console.log(`Visit http://flip3.engr.oregonstate.edu:${PORT}`);
});
