//String containing the route we will be making requests to
 //var urlStr = 'http://localhost:3001/ordersByDriver'; //Put our server link here
 var urlStr = 'http://flip3.engr.oregonstate.edu:7403/ordersByDriver';
 
// upon dom-content being loaded, bind the search button and set the id/name drop down menu
document.addEventListener('DOMContentLoaded', searchPost());			//bind first submit button
document.addEventListener('DOMContentLoaded', setSelector());			//bind first submit button

/*
	First clears out selector menu, then  sends a get request to the order by driver route. route
	returns the driverID and driver name we append this to the selector text content. The menu
	selects the id for sending to get order by driver id.
*/
function setSelector() {
	var selector = document.getElementById('selector');   
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    };
	var req = new XMLHttpRequest();
	req.open('GET', urlStr, true);
	req.addEventListener('load', function(){
	if (req.status >=200 && req.status < 400){
		var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
		console.log("response received");
		response.forEach(function (id){
            var option = document.createElement('option');
            option.textContent = id.driverID+" "+id.driverFirstName+" "+id.driverLastName;
            option.value = id.driverID;
            selector.appendChild(option);
		});
	}
	else{
		console.log("Error "+req.statusText);
	}
	});
	req.send(null);
};

/* 
	Binds the submit button. Gets the driverID corresponding to the drop down menu. Sends that id to the server
	and receives back an array of orders where the driverID is the same as the sent id. Empties out
	previous orders table. Builds new orders table with array of order objects.
*/

function searchPost() {
	document.getElementById('searchSubmit').addEventListener('click', function (event) {
		var req = new XMLHttpRequest();
		//Prepare payload to send to server
		var payload = { orderID: null};
		//payload.orderID = document.getElementById('driverID').value;
		payload.orderID = document.getElementById('selector').value;
		//send request
		req.open('POST', urlStr, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function () {
			if (req.status >= 200 && req.status < 400) {
				emptyOrdersTable();
				var response2 = JSON.parse(req.responseText); //string to useable object
				htmlReadOrders(response2); //instead of sample data, we would pass the returned object into the build table function
			}
			else {
				console.log("Error Code: )" + req.statusText);
			}
		});
		console.log(payload.orderID);
		req.send(JSON.stringify(payload));
		event.preventDefault();					//do not refresh page
	})
};
//mediates the building of the orders table with orders object
function htmlReadOrders(orders){
    emptyOrdersTable();
    fillOrdersTable(orders)
}

//Empties the Orders table by removing children rows until none remain
function emptyOrdersTable(){
    var table = document.getElementById('order-table');
	// Empties rows of orders table without removing header
    Array.from(table.children).slice(1).forEach(function(){ 
        table.removeChild(table.children[1]);
    });
}
//fills the orders html table by passing an orders object to the append row table
function fillOrdersTable(orders){
    orders.forEach(function(order){
        appendrestaurantsTableRow(order);
    });
}
/*
	adds an orders to the orders table by building a table row out of the orders object's attributes 
	adds a button to mark an order as delivered by the order row.
*/
function appendrestaurantsTableRow(order){
    var orderID = order.orderID;
    var restaurantID = order.restaurantID;
    var customerID = order.customerID;
    var orderTime = order.orderTime;
    var deliveryTime = order.deliveryTime;
    var shiftID = order.shiftID;


    // Get table
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

    // Append restaurant  name table cell
    var restaurantIDCell = document.createElement('div');
    restaurantIDCell.style.display = 'table-cell';
    var restaurantIDInput = document.createElement('input');
    restaurantIDInput.id = `restaurant-id-${orderID}`;
    restaurantIDInput.type = 'text';
    restaurantIDInput.name = 'restaurant-id';
    restaurantIDInput.disabled = true;

    restaurantIDInput.value = restaurantID;
    restaurantIDCell.appendChild(restaurantIDInput);
    tableRow.appendChild(restaurantIDCell);

    // Append orders assigned table cell
    var customerIDCell = document.createElement('div');
    customerIDCell.style.display = 'table-cell';
    var customerIDInput = document.createElement('input');
    customerIDInput.id = `customer-id-${orderID}`;
    customerIDInput.type = 'text';
    customerIDInput.name = 'customer-id';
    customerIDInput.disabled = true;
    customerIDInput.value = customerID;
    customerIDCell.appendChild(customerIDInput);
    tableRow.appendChild(customerIDCell);
    
    // Append orders assigned table cell
    var orderTimeCell = document.createElement('div');
    orderTimeCell.style.display = 'table-cell';
    var orderTimeInput = document.createElement('input');
    orderTimeInput.id = `order-time-${orderID}`;
    orderTimeInput.type = 'text';
    orderTimeInput.name = 'order-time';
    orderTimeInput.disabled = true;
    orderTimeInput.value = orderTime;
    orderTimeCell.appendChild(orderTimeInput);
    tableRow.appendChild(orderTimeCell);

    // Append orders assigned table cell
    var orderDeliveryTimeCell = document.createElement('div');
    orderDeliveryTimeCell.style.display = 'table-cell';
    var orderDeliveryTimeInput = document.createElement('input');
    orderDeliveryTimeInput.id = `order-delivery-time-${orderID}`;
    orderDeliveryTimeInput.type = 'text';
    orderDeliveryTimeInput.name = 'order-delivery-time';
    orderDeliveryTimeInput.disabled = true;
    orderDeliveryTimeInput.value = deliveryTime;
    orderDeliveryTimeCell.appendChild(orderDeliveryTimeInput);
    tableRow.appendChild(orderDeliveryTimeCell);

    
    // Append orders assigned table cell
    var shiftIDCell = document.createElement('div');
    shiftIDCell.style.display = 'table-cell';
    var shiftIDInput = document.createElement('input');
    shiftIDInput.id = `shift-id-${orderID}`;
    shiftIDInput.type = 'text';
    shiftIDInput.name = 'shift-ID';
    shiftIDInput.disabled = true;
    shiftIDInput.value = shiftID;
    shiftIDCell.appendChild(shiftIDInput);
    tableRow.appendChild(shiftIDCell);

    // Append restaurant table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${orderID}`;
    deleteInput.type = 'button';
    deleteInput.name = 'Mark as Delivered';
    deleteInput.value = 'Mark as Delivered';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeleteOrder(orderID);
    });
}

/*
	Name is from previous iteration. Marks an order as delivered by sending a put request
	to the orders by driver route with driver id from drop down selector. Server sets 
	timeDelivered attribute and removes entry from the orders list to simulate an order 
	being checked off by a driver.
*/
function htmlDeleteOrder(orderID){
	var payload = {};
	payload.orderID = orderID;
	var req = new XMLHttpRequest();
	req.open('PUT', urlStr, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			
			deleteRow(orderID);
			console.log("row deleted from db")
			}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	console.log("sent");

}
// function to remove a row from the html order table, removes row corresponding the id sent
function deleteRow(orderID){
	var table = document.getElementById('order-table');
	var removedRow = document.getElementById("row-" + orderID);
	table.removeChild(removedRow);
}
