/**
 * Daniel Facchiano, Customer Submit front end JS
 */
 //var urlStr = 'http://localhost:3001/customers'; //Put our server link here
 var urlStr = 'http://flip3.engr.oregonstate.edu:7403/customers';
 
 // Bind the customerPost button and build the initial table
 document.addEventListener('DOMContentLoaded', customerPost);			//bind first submit button
 document.addEventListener('DOMContentLoaded', htmlReadCustomers());			//bind first submit button
 /*
 	Function to add a customer to the database. Gets attribute information by retreiving ids from the
 	html form. uses these attributes to build an object. sends that object to the server (if null fields
 	return) Recieves the complete row added back from the server. Passes that row object to the function
 	to add it to the customers table to reflect added row. 
 */
 function customerPost(){
	document.getElementById('customerSubmit').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		//Prepare payload to send to server
		var payload = {customerFirstName:null, customerLastName:null, customerStreet:null, customerZIP:null};
		payload.customerFirstName = 	document.getElementById('customerFirstName').value || null;
		payload.customerLastName = 		document.getElementById('customerLastName').value || null;
		payload.customerStreet 	= 	document.getElementById('customerStreet').value || null;
		payload.customerZIP = document.getElementById('customerZIP').value || null;
		
		if (payload.customerFirstName == null || payload.customerLastName == null || payload.customerStreet == null || payload.customerZIP == null){
			event.preventDefault();	
			return;
		}
		//send request
		req.open('POST', urlStr, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function(){
			if(req.status>= 200 && req.status < 400){
				var response = req.responseText;
				payload.customerID =  response;
				appendCustomersTableRow(payload);
			}
			else{
				console.log("Error Code: )"+req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();					//do not refresh page
	})
};
/*
	Makes a get request to the server to get the initial customer rows. Passes these rows to the fill customers table
	to well, fill the customers table.
*/
function htmlReadCustomers(){
	//	Make get request, get the contents of the customer table in an array of objects. Use that array of objects in the fill 
	// Customers table function, after emptying the table to rebuild the customer's table with the accurate amount of stuff.
		var req = new XMLHttpRequest();
		req.open('GET', urlStr, true);
		req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			var response = JSON.parse(req.responseText);		//Creates array of rows, super helpful for front end
			emptyCustomersTable();
			fillCustomersTable(response);
		}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(null);

}
// Utility function to empt all rows in the customers table
function emptyCustomersTable(){
    /**
     * Empty customers table data
     */
    var table = document.getElementById('customer-table');
    Array.from(table.children).slice(1).forEach(function(){
        table.removeChild(table.children[1]);
    });
}
// takes an array of objects Passes each object in the array to the appendrow function to build
// that row and put it in the table
function fillCustomersTable(customers){
    /**
     * Fill customers table with data
     */
    customers.forEach(function(customer){
        appendCustomersTableRow(customer);
    });
}
/*
	Function takes an object of customer row Attributes. Function uses these attributes to build
	a Table row. Row cells contain ids corresponding to their sql id. Also binds delete buttons
	to the created row.
*/
function appendCustomersTableRow(customer){
    /**
     * Append customers table row with data
     */
    var customerID = customer.customerID;
    var customerFirstName = customer.customerFirstName;
    var customerLastName = customer.customerLastName;
    var customerStreet = customer.customerStreet;
    var customerZIP = customer.customerZIP;

    // Get table
    var table = document.getElementById('customer-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${customerID}`;
    table.appendChild(tableRow);

    // Append customer ID table cell
    var customerIDCell = document.createElement('div');
    customerIDCell.style.display = 'table-cell';
    var customerIDinput = document.createElement('input');
    customerIDinput.id = `customer-id-${customerID}`;
    customerIDinput.disabled = true;
    customerIDinput.name = 'customer-id';
    customerIDinput.value = customerID;
    customerIDCell.appendChild(customerIDinput);
    tableRow.appendChild(customerIDCell);

    // Append customer first name table cell
    var customerFirstNameCell = document.createElement('div');
    customerFirstNameCell.style.display = 'table-cell';
    var customerFirstNameInput = document.createElement('input');
    customerFirstNameInput.id = `customer-first-name-${customerID}`;
    customerFirstNameInput.type = 'text';
    customerFirstNameInput.disabled = true;
    customerFirstNameInput.name = 'customer-first-name';
    customerFirstNameInput.value = customerFirstName;
    customerFirstNameCell.appendChild(customerFirstNameInput);
    tableRow.appendChild(customerFirstNameCell);

    // Append customer last name table cell
    var customerLastNameCell = document.createElement('div');
    customerLastNameCell.style.display = 'table-cell';
    var customerLastNameInput = document.createElement('input');
    customerLastNameInput.id = `customer-last-name-${customerID}`;
    customerLastNameInput.type = 'text';
    customerLastNameInput.disabled = true;
    customerLastNameInput.name = 'customer-last-name';
    customerLastNameInput.value = customerLastName;
    customerLastNameCell.appendChild(customerLastNameInput);
    tableRow.appendChild(customerLastNameCell);

    // Append orders assigned table cell
    var customerStreetCell = document.createElement('div');
    customerStreetCell.style.display = 'table-cell';
    var customerStreetInput = document.createElement('input');
    customerStreetInput.id = `customer-street-${customerID}`;
    customerStreetInput.type = 'text';
    customerStreetInput.name = 'customer-street';
    customerStreetInput.disabled = true;
    customerStreetInput.value = customerStreet;
    customerStreetCell.appendChild(customerStreetInput);
    tableRow.appendChild(customerStreetCell);
    
    // Append orders assigned table cell
    var customerZIPCell = document.createElement('div');
    customerZIPCell.style.display = 'table-cell';
    var customerZIPInput = document.createElement('input');
    customerZIPInput.id = `customer-ZIP-${customerID}`;
    customerZIPInput.type = 'text';
    customerZIPInput.name = 'customer-street';
    customerZIPInput.disabled = true;
    customerZIPInput.value = customerZIP;
    customerZIPCell.appendChild(customerZIPInput);
    tableRow.appendChild(customerZIPCell);

    // Append customer table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${customerID}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeletecustomer(customerID);
    });
}
/*
	Sends a delete request to the server. Delete request contains the id of the row that the delete was
	selected in. Server will delete this row from the customers table. Upon success, pass row id to the 
	delete row function to remove it from the html table
*/
function htmlDeletecustomer(customerID){
    /**
     * Delete from customers table with database delete over HTML
     */
	var payload = {};
	payload.customerID = customerID;
	var req = new XMLHttpRequest();
	req.open('DELETE', urlStr, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if (req.status >=200 && req.status < 400){
			deleteRow(customerID);
			}
		else{
			console.log("Error "+req.statusText);
		}
	});
	req.send(JSON.stringify(payload));

}
/*
	function to delete row from the html table. Removes row with id from table via Dom manipulation
*/
function deleteRow(customerID){
	var table = document.getElementById('customer-table');
	var removedRow = document.getElementById("row-" +customerID);
	table.removeChild(removedRow);
}

