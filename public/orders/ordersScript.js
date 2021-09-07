
/**
* Daniel Facchiano, restaurant Submit front end JS
*/

//String to make server requests to.
//var urlStr = 'http://localhost:3001/orders'; //Put our server link here
var urlStr = 'http://flip3.engr.oregonstate.edu:7403/orders';

//Upon loading domcontent, bind all buttons, load initial orders list, make requests and load all selectors
document.addEventListener('DOMContentLoaded', orderPost);				//bind first submit button
document.addEventListener('DOMContentLoaded', orderHold);				//bind first submit button
document.addEventListener('DOMContentLoaded', orderResume);			//bind first submit button
document.addEventListener('DOMContentLoaded', htmlReadOrders);			
document.addEventListener('DOMContentLoaded', resetSelectors);

//Function to get the initial entrys for the three drop down menus on this page
function resetSelectors(){
	setOrderSelector();
	setRestaurantSelector();
	setCustomerSelector();	
};

/*
	function to build the restaurant drop down menu. First clears out old selector then sends
	a get request to the restaurants route to return the restaurant attribute information.
	Builds the drop down menu using the names returned from the get request.
*/
function setRestaurantSelector() {
	var selector1 = document.getElementById('restaurantSelector');   
    while (selector1.firstChild) {
        selector1.removeChild(selector1.firstChild);
    };
 	//var restaurantUrlStr = 'http://localhost:3001/restaurants'; //Put our server link here
	var restaurantUrlStr = 'http://flip3.engr.oregonstate.edu:7403/restaurants';
	var req = new XMLHttpRequest();
	req.open('GET', restaurantUrlStr, true);
	req.addEventListener('load', function(){
	if (req.status >=200 && req.status < 400){
		var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
		console.log("response received");
		
		response.forEach(function (id){
		var option = document.createElement('option');
		option.textContent = id.restaurantName;
		option.value = id.restaurantID;
		selector1.appendChild(option);
		});
	}
	else{
		console.log("Error "+req.statusText);
	}
	});
	req.send(null);
};
/*
	Function to build the customer drop down menu. First clears out the old selector then sends a get
	request to the customers route to return the customer attribute information. Builds the drop down
	menu using the names returned from the get request.
*/
function setCustomerSelector() {
	var selector1 = document.getElementById('customerSelector');   
    while (selector1.firstChild) {
        selector1.removeChild(selector1.firstChild);
    };
 	//var custUrlStr = 'http://localhost:3001/customers'; //Put our server link here
	var custUrlStr = 'http://flip3.engr.oregonstate.edu:7403/customers';
	var req = new XMLHttpRequest();
	req.open('GET', custUrlStr, true);
	req.addEventListener('load', function(){
	if (req.status >=200 && req.status < 400){
		var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
		response.forEach(function (id){
		var option = document.createElement('option');
		option.textContent = id.customerFirstName+" "+id.customerLastName;
		option.value = id.customerID;
		selector1.appendChild(option);
		});
	}
	else{
		console.log("Error "+req.statusText);
	}
	});
	req.send(null);
};
/*
	Function to build the two Orders drop down menus. makes a get request to a route that has joined
	customers and orders on customerID. Using the attribute information returned, build the two drop
	down menus that involve order information. 
*/
function setOrderSelector() {
	var selector2 = document.getElementById('resumeSelector');   
    while (selector2.firstChild) {
        selector2.removeChild(selector2.firstChild);
    };
	var selector1 = document.getElementById('holdSelector');   
    while (selector1.firstChild) {
        selector1.removeChild(selector1.firstChild);
    };
	var req = new XMLHttpRequest();
	req.open('GET', urlStr+"/joinCustomer" , true);
	req.addEventListener('load', function(){
	if (req.status >=200 && req.status < 400){
		var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
		response.forEach(function (id){
		var option = document.createElement('option');
		option.textContent = id.orderID+" "+id.customerFirstName+" "+id.customerLastName;
		option.value = id.orderID;
		selector2.appendChild(option);
		var option = document.createElement('option');
		option.textContent = id.orderID+" "+id.customerFirstName+" "+id.customerLastName;
		option.value = id.orderID;
		selector1.appendChild(option);
		});
	}
	else{
		console.log("Error "+req.statusText);
	}
	});
	req.send(null);
};
/*
	Function to Post an order to the Orders table. Build a payload object made out of the information the customer
	has selected by typing and the drop down menus. Send this payload to the order / post route. Will
	receive that complete resaturant Row generated by sql. We pass that row into the append tables function
	to add it to the table of orders. 
*/

function orderPost() {
	document.getElementById('orderSubmit').addEventListener('click', function (event) {
		var req = new XMLHttpRequest();
		//Prepare payload to send to server
		var payload = { orderTotal: null, restaurantID: null, customerID: null };
		payload.orderTotal = document.getElementById('orderTotal').value;
		payload.restaurantID = document.getElementById('restaurantSelector').value;
		payload.customerID = document.getElementById('customerSelector').value;

		//send request
		req.open('POST', urlStr, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				var response2 = JSON.parse(req.responseText);
				appendrestaurantsTableRow(response2[0]);
				setOrderSelector();

			}
			else {
				console.log("Error: you dun goofed. Error Code: )" + req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();					//do not refresh page
	})
};
	/*
		Function to make a put request to set driverID and shiftID to null. attaches order type
		to payload so we can reuse the put route for resumes. Gets attribute information on order
		to hold from the the drop down menus present in the html. Sends information to the
		server, receives the completed row back. Pass that row to editRow so the table
		can reflect the changes.
	*/
function orderHold() {
	document.getElementById('orderHold').addEventListener('click', function (event) {
		var req = new XMLHttpRequest();
		var payload = { putType: "hold", orderID: null };	//holds data we are sending
		payload.orderID = document.getElementById('holdSelector').value;
		var selector1 = document.getElementById('holdSelector');  
		req.open('PUT', urlStr, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				console.log(req.responseText);
				var response = JSON.parse(req.responseText);
				console.log(response);
				var editObject = response[0];
				editRow(editObject);
			}
			else {
				console.log("Error: you dun goofed. Error Code: " + req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();									//do not refresh page
	})
};

	/*
		receives an object of order row data. Uses that data to update existing order row
	*/
function editRow(editObject){
	driverEditCell = document.getElementById("driver-id-"+editObject.orderID);
	driverEditCell.value = editObject.driverID;
	shiftEditCell = document.getElementById("shift-id-"+editObject.orderID);
	shiftEditCell.value = editObject.shiftID;
}
	/*
		Function makes a put request to the orders request. sets payload to resume to designate
		the type of put we are doing to reuse / route. sets Id of order to re-assign by retreiving it
		from the drop down menu for orders and sending via put request to server. server will
		assign id corresponding order a new shift and driver based upon drivers assigned to the current
		shift.
	*/
function orderResume() {
	document.getElementById('orderResume').addEventListener('click', function (event) {
		var req = new XMLHttpRequest();
		var payload = { putType: "resume", orderID: null };	 //holds data we are sending
		payload.orderID = document.getElementById('resumeSelector').value;
		req.open('PUT', urlStr, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("The order was succesfully resumed");
				var response = JSON.parse(req.responseText);
				var editObject = response[0];
				editRow(editObject);
			}
			else {
				console.log("Error: you dun goofed. Error Code: " + req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();									//do not refresh page
	})
}
/*
	Function to retreive the initial orders data to build the initital orders table. Makes a get request
	to the server, retreives an array of all the rows for orders in the database. Using this array, builds
	the orders table showing all of the orders present in the database. Does this by passing array to the
	"fillOrdersTables" function.
*/
function htmlReadOrders(){
	//	Make get request, get the contents of the customer table in an array of objects. Use that array of objects in the fill 
		var req = new XMLHttpRequest();
		req.open('GET', urlStr, true);
		req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
			console.log("response received");
			emptyOrdersTable();
			fillOrdersTable(response);
		}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(null);
}
// Utility function to empty the Orders table
function emptyOrdersTable(){
    var table = document.getElementById('order-table');
    Array.from(table.children).slice(1).forEach(function(){
        table.removeChild(table.children[1]);
    });
}
// Function receives an array of orders. passes each object in that array to a function to append it's attributes
// to the Orders table
function fillOrdersTable(orders){
    orders.forEach(function(order){
        appendrestaurantsTableRow(order);
    });
}
/*
	Function takes an object of order row Attributes. Function uses these attributes to build
	a Table row. Row cells contain ids corresponding to their sql id. Also binds delete buttons
	to the created row.
*/
function appendrestaurantsTableRow(order){
	console.log(order);
    var orderID = order.orderID;
    var restaurantID = order.restaurantID;
    var customerID = order.customerID;
    var orderTime = order.orderTime;
    var deliveryTime = order.deliveryTime;
    var driverID = order.driverID;
    var shiftID = order.shiftID;
    var orderTotal = order.orderTotal;
    var table = document.getElementById('order-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${orderID}`;
    table.appendChild(tableRow);

    // Append restaurant ID table cell
    var orderIDCell = document.createElement('div');
    orderIDCell.style.display = 'table-cell';
    var orderIDinput = document.createElement('input');
    orderIDinput.id = `order-id-${orderID}`;
    orderIDinput.disabled = true;
    orderIDinput.name = 'order-id';
    orderIDinput.value = orderID;
    orderIDCell.appendChild(orderIDinput);
    tableRow.appendChild(orderIDCell);
    
    var orderTotalCell = document.createElement('div');
    orderTotalCell.style.display = 'table-cell';
    var orderTotalinput = document.createElement('input');
    orderTotalinput.id = `order-total-${orderID}`;
    orderTotalinput.name = 'order-total';
    orderTotalinput.disabled = true;
    orderTotalinput.value = orderTotal;
    orderTotalCell.appendChild(orderTotalinput);
    tableRow.appendChild(orderTotalCell);

    // Append restaurant  name table cell
    var restaurantIDCell = document.createElement('div');
    restaurantIDCell.style.display = 'table-cell';
    var restaurantIDInput = document.createElement('input');
    restaurantIDInput.id = `restaurant-id-${orderID}`;
    restaurantIDInput.type = 'text';
    restaurantIDInput.disabled = true;
    restaurantIDInput.name = 'restaurant-id';
    restaurantIDInput.value = restaurantID;
    restaurantIDCell.appendChild(restaurantIDInput);
    tableRow.appendChild(restaurantIDCell);

    // Append orders assigned table cell
    var customerIDCell = document.createElement('div');
    customerIDCell.style.display = 'table-cell';
    var customerIDInput = document.createElement('input');
    customerIDInput.id = `customer-id-${orderID}`;
    customerIDInput.type = 'text';
    customerIDInput.disabled = true;
    customerIDInput.name = 'customer-id';
    customerIDInput.value = customerID;
    customerIDCell.appendChild(customerIDInput);
    tableRow.appendChild(customerIDCell);
    
    // Append orders assigned table cell
    var orderTimeCell = document.createElement('div');
    orderTimeCell.style.display = 'table-cell';
    var orderTimeInput = document.createElement('input');
    orderTimeInput.id = `order-time-${orderID}`;
    orderTimeInput.type = 'text';
    orderTimeInput.disabled = true;
    orderTimeInput.name = 'order-time';
    orderTimeInput.value = orderTime;
    orderTimeCell.appendChild(orderTimeInput);
    tableRow.appendChild(orderTimeCell);

    // Append orders assigned table cell
    var orderDeliveryTimeCell = document.createElement('div');
    orderDeliveryTimeCell.style.display = 'table-cell';
    var orderDeliveryTimeInput = document.createElement('input');
    orderDeliveryTimeInput.id = `order-delivery-time-${orderID}`;
    orderDeliveryTimeInput.type = 'text';
    orderDeliveryTimeInput.disabled = true;
    orderDeliveryTimeInput.name = 'order-delivery-time';
    orderDeliveryTimeInput.value = deliveryTime;
    orderDeliveryTimeCell.appendChild(orderDeliveryTimeInput);
    tableRow.appendChild(orderDeliveryTimeCell);
    
    var driverIDCell = document.createElement('div');
    driverIDCell.style.display = 'table-cell';
    var driverIDInput = document.createElement('input');
    driverIDInput.id = `driver-id-${orderID}`;
    driverIDInput.type = 'text';
    driverIDInput.name = 'driver-ID';
    driverIDInput.disabled = true;
    driverIDInput.value = driverID;
    driverIDCell.appendChild(driverIDInput);
    tableRow.appendChild(driverIDCell);

    
    // Append orders assigned table cell
    var shiftIDCell = document.createElement('div');
    shiftIDCell.style.display = 'table-cell';
    var shiftIDInput = document.createElement('input');
    shiftIDInput.id = `shift-id-${orderID}`;
    shiftIDInput.type = 'text';
    shiftIDInput.disabled = true;
    shiftIDInput.name = 'shift-ID';
    shiftIDInput.value = shiftID;
    shiftIDCell.appendChild(shiftIDInput);
    tableRow.appendChild(shiftIDCell);

    // Append restaurant table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${orderID}`;
    deleteInput.type = 'button';

    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeleteOrder(orderID);
    });
}
/*
	Function recieves an Order id, using this id we send a delete request to the server
	After we have confirmed the delete was succesful, we delete the row from the Order table
	by passing orderID to the deleteRow function
*/
function htmlDeleteOrder(orderID){
	var payload = {};
	payload.orderID = orderID;
	var req = new XMLHttpRequest();
	req.open('DELETE', urlStr, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			
			deleteRow(orderID);
			setOrderSelector();

			}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	console.log("sent");

}
// Deletes a row with the corresponding orderID via dom manipulation
function deleteRow(orderID){
	var table = document.getElementById('order-table');
	var removedRow = document.getElementById("row-" + orderID);
	table.removeChild(removedRow);
}


