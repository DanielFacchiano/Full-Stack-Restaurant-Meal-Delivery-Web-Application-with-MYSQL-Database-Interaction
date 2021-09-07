/**
 * Daniel Facchiano, restaurant Submit front end JS
 */
//var urlStr = 'http://localhost:3001/restaurants'; //Put our server link here
var urlStr = 'http://flip3.engr.oregonstate.edu:7403/restaurants';

 document.addEventListener('DOMContentLoaded', restaurantPost);			//bind first submit button
 document.addEventListener('DOMContentLoaded', htmlReadrestaurants);			//bind first submit button
 /*
 	Binds the submit button with a function to start and http request, build an object out of input data,
 	check if that data is null. If it is don't send it. We post this data to the server. We get the full
 	row back in response. We put that row in the appendrows function to add it to the html table.
 */
 function restaurantPost(){
	document.getElementById('restaurantSubmit').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		//Prepare payload to send to server
		var payload = {restaurantName:null, restaurantStreet:null, restaurantZIP:null};
		payload.restaurantName = 	document.getElementById('restaurantName').value || null;
		payload.restaurantStreet = 		document.getElementById('restaurantStreet').value || null;
		payload.restaurantZIP 	= 	document.getElementById('restaurantZIP').value || null;
		
		if(payload.restaurantName == null || payload.restaurantStreet == null || payload.restaurantZIP == null  ){
			event.preventDefault();					//do not refresh page
			return;
		};
		
		//send request
		req.open('POST', urlStr, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function(){
			if(req.status>= 200 && req.status < 400){
				var response = req.responseText;
				payload.restaurantID =  response;
				appendrestaurantsTableRow(payload);
				console.log("The customer was succesfully added to the database");
			}
			else{
				console.log("Error: you dun goofed. Error Code: )"+req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();					//do not refresh page
	})
};
/*
	function to build the initial table. Makes get request to the server. Request returns all restaurant rows. We parse
	these rows into a useable object. We empty the table, then pass the new rows to the fill restaurants table function, 
	to fill the html restaurants table. 
*/
function htmlReadrestaurants(){
	//	Make get request, get the contents of the customer table in an array of objects. Use that array of objects in the fill 
	// Customers table function, after emptying the table to rebuild the customer's table with the accurate amount of stuff.
		var req = new XMLHttpRequest();
		req.open('GET', urlStr, true);
		req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
			console.log("response received");
			emptyrestaurantsTable();
			fillrestaurantsTable(response);
		}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(null);
}
/*
	Utility function to empty the restaurants table
*/
function emptyrestaurantsTable(){
    var table = document.getElementById('restaurant-table');
    Array.from(table.children).slice(1).forEach(function(){
        table.removeChild(table.children[1]);
    });
}
/*
	Takes array of objects and builds html restaurants table with it
*/
function fillrestaurantsTable(restaurants){
    restaurants.forEach(function(restaurant){
        appendrestaurantsTableRow(restaurant);
    });
}
/*
	Takes restaurant object and uses its attributes to build and html table row
	appends row built out of object with delete button to the table of restaurants.
*/
function appendrestaurantsTableRow(restaurant){
    var restaurantID = restaurant.restaurantID;
    var restaurantFirstName = restaurant.restaurantFirstName;
    var restaurantName = restaurant.restaurantName;
    var restaurantStreet = restaurant.restaurantStreet;
    var restaurantZIP = restaurant.restaurantZIP;

    // Get table
    var table = document.getElementById('restaurant-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${restaurantID}`;
    table.appendChild(tableRow);

    // Append restaurant ID table cell
    var restaurantIDCell = document.createElement('div');
    restaurantIDCell.style.display = 'table-cell';
    var restaurantIDinput = document.createElement('input');
    restaurantIDinput.id = `restaurant-id-${restaurantID}`;
    restaurantIDinput.disabled = true;
    restaurantIDinput.name = 'restaurant-id';
    restaurantIDinput.value = restaurantID;
    restaurantIDCell.appendChild(restaurantIDinput);
    tableRow.appendChild(restaurantIDCell);

    // Append restaurant  name table cell
    var restaurantNameCell = document.createElement('div');
    restaurantNameCell.style.display = 'table-cell';
    var restaurantNameInput = document.createElement('input');
    restaurantNameInput.id = `restaurant--name-${restaurantID}`;
    restaurantNameInput.type = 'text';
    restaurantNameInput.name = 'restaurant--name';
    restaurantNameInput.disabled = true;
    restaurantNameInput.value = restaurantName;
    restaurantNameCell.appendChild(restaurantNameInput);
    tableRow.appendChild(restaurantNameCell);

    // Append orders assigned table cell
    var restaurantStreetCell = document.createElement('div');
    restaurantStreetCell.style.display = 'table-cell';
    var restaurantStreetInput = document.createElement('input');
    restaurantStreetInput.id = `restaurant-street-${restaurantID}`;
    restaurantStreetInput.type = 'text';
    restaurantStreetInput.name = 'restaurant-street';
    restaurantStreetInput.disabled = true;
    restaurantStreetInput.value = restaurantStreet;
    restaurantStreetCell.appendChild(restaurantStreetInput);
    tableRow.appendChild(restaurantStreetCell);
    
    // Append orders assigned table cell
    var restaurantZIPCell = document.createElement('div');
    restaurantZIPCell.style.display = 'table-cell';
    var restaurantZIPInput = document.createElement('input');
    restaurantZIPInput.id = `restaurant-ZIP-${restaurantID}`;
    restaurantZIPInput.type = 'text';
    restaurantZIPInput.disabled = true;
    restaurantZIPInput.name = 'restaurant-street';
    restaurantZIPInput.value = restaurantZIP;
    restaurantZIPCell.appendChild(restaurantZIPInput);
    tableRow.appendChild(restaurantZIPCell);

    // Append restaurant table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${restaurantID}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeleterestaurant(restaurantID);
    });
}
/*
	Sends a delete request to the restaurants route. Using the id sent
	the server will delete the row from the db, after delete is succesful
	front end will delete row front html table by passings its id to the
	deleteRow function
*/
function htmlDeleterestaurant(restaurantID){
	var payload = {};
	payload.restaurantID = restaurantID;
	var req = new XMLHttpRequest();
	req.open('DELETE', urlStr, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			deleteRow(restaurantID);
			console.log("row deleted from db")
			}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	console.log(sent);

}
/*
	Deletes row front html table corresponding to the id passed
*/
function deleteRow(restaurantID){
	var table = document.getElementById('restaurant-table');
	var removedRow = document.getElementById("row-" +restaurantID);
	table.removeChild(removedRow);
}
