//var SERVER = 'http://localhost:3001/drivers';
var SERVER = 'http://flip3.engr.oregonstate.edu:7403/drivers';

/*
	Adds an event listener to the submit button. Retreieves attributes from html form and puts them
	into attributes. Checks for nulls. Opens a http request and puts variables in url string. Sends
	request with attributes in url string to the server. Emtpys the table and rebuilds the tale with
	the update rows.
	
*/
function htmlCreateDriver(){
    // Get create form
    var form = document.getElementById('new-driver');
    // Add create form event listener
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var driverFirstName = document.getElementById('new-driver-first-name').value || null;
        var driverLastName = document.getElementById('new-driver-last-name').value || null;
        var ordersAssigned = document.getElementById('new-orders-assigned').value || null;
        if(driverFirstName === null || driverLastName === null || ordersAssigned === null){
            emptyForm();
            return;
        }
        
        var req = new XMLHttpRequest();
        var url = `${SERVER}?driverFirstName=${driverFirstName}&driverLastName=${driverLastName}&ordersAssigned=${ordersAssigned}`;
        req.open('POST', url, true);
        req.onload = function(){
            if(req.status === 200){
                emptyForm();
                emptyDriversTable();
                htmlReadDrivers();
            }
        };
        req.send();
    });
}
function emptyForm(){
    /**
     * Empty new shift form
     */
    document.getElementById('new-driver-first-name').value = null;
    document.getElementById('new-driver-last-name').value = null;
    document.getElementById('new-orders-assigned').value = null;
}

function htmlReadDrivers(){
    /**
     * Build drivers table from database read over HTML
     */
    var req = new XMLHttpRequest();
    req.open('GET', SERVER, true);
    req.onload = function(){
        if(req.status === 200){
            emptyDriversTable();
            var drivers = JSON.parse(req.responseText);
            fillDriversTable(drivers);
        }
    };
    req.send();
}

function emptyDriversTable(){
    /**
     * Empty drivers table data
     */
    var table = document.getElementById('drivers-table');
    Array.from(table.children).slice(1).forEach(function(){
        table.removeChild(table.children[1]);
    });
}

function fillDriversTable(drivers){
    /**
     * Fill drivers table with data
     */
    drivers.forEach(function(driver){
        appendDriversTableRow(driver);
    });
}

function appendDriversTableRow(driver){
    /**
     * Append drivers table row with data
     */
    var driverID = driver.driverID;
    var driverFirstName = driver.driverFirstName;
    var driverLastName = driver.driverLastName;
    var ordersAssigned = driver.ordersAssigned;

    // Get table
    var table = document.getElementById('drivers-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${driverID}`;
    table.appendChild(tableRow);

    // Append driver ID table cell
    var driverIDCell = document.createElement('div');
    driverIDCell.style.display = 'table-cell';
    var driverIDInput = document.createElement('input');
    driverIDInput.id = `driver-id-${driverID}`;
    driverIDInput.disabled = true;
    driverIDInput.name = 'shift-id';
    driverIDInput.value = driverID;
    driverIDCell.appendChild(driverIDInput);
    tableRow.appendChild(driverIDCell);

    // Append driver first name table cell
    var driverFirstNameCell = document.createElement('div');
    driverFirstNameCell.style.display = 'table-cell';
    var driverFirstNameInput = document.createElement('input');
    driverFirstNameInput.id = `driver-first-name-${driverID}`;
    driverFirstNameInput.type = 'text';
    driverFirstNameInput.name = 'driver-first-name';
    driverFirstNameInput.value = driverFirstName;
    driverFirstNameCell.appendChild(driverFirstNameInput);
    tableRow.appendChild(driverFirstNameCell);

    // Append driver last name table cell
    var driverLastNameCell = document.createElement('div');
    driverLastNameCell.style.display = 'table-cell';
    var driverLastNameInput = document.createElement('input');
    driverLastNameInput.id = `driver-last-name-${driverID}`;
    driverLastNameInput.type = 'text';
    driverLastNameInput.name = 'driver-last-name';
    driverLastNameInput.value = driverLastName;
    driverLastNameCell.appendChild(driverLastNameInput);
    tableRow.appendChild(driverLastNameCell);

    // Append orders assigned table cell
    var ordersAssignedCell = document.createElement('div');
    ordersAssignedCell.style.display = 'table-cell';
    var ordersAssignedInput = document.createElement('input');
    ordersAssignedInput.id = `orders-assigned-${driverID}`;
    ordersAssignedInput.type = 'number';
    ordersAssignedInput.name = 'orders-assigned';
    ordersAssignedInput.value = ordersAssigned;
    ordersAssignedCell.appendChild(ordersAssignedInput);
    tableRow.appendChild(ordersAssignedCell);

    // Append update table cell
    var updateCell = document.createElement('div');
    updateCell.style.display = 'table-cell';
    var updateInput = document.createElement('input');
    updateInput.id = `update-${driverID}`;
    updateInput.type = 'button';
    updateInput.name = 'update';
    updateInput.value = 'Update';
    updateCell.appendChild(updateInput);
    tableRow.appendChild(updateCell);

    // Add update event listener
    updateInput.addEventListener('click',function(e){
        e.preventDefault();
        var driver = {
            driverID: driverIDInput.value,
            driverFirstName: driverFirstNameInput.value,
            driverLastName: driverLastNameInput.value,
            ordersAssigned: ordersAssignedInput.value
        };
        htmlUpdateDriver(driver);
    });

    // Append driver table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${driverID}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeleteDriver(driverID);
    });
}

function htmlUpdateDriver(driver){
    /**
     * Update Drivers table with database update over HTML
     */
    var driverID = driver.driverID;
    var driverFirstName = driver.driverFirstName;
    var driverLastName = driver.driverLastName;
    var ordersAssigned = driver.ordersAssigned;
    var req = new XMLHttpRequest();
    var url = `${SERVER}?driverID=${driverID}&driverFirstName=${driverFirstName}&driverLastName=${driverLastName}&ordersAssigned=${ordersAssigned}`;
    req.open('PUT', url, true);
    req.onload = function(){
        if(req.status === 200){
            emptyDriversTable();
            htmlReadDrivers();
        }
    };
    req.send();
}

function htmlDeleteDriver(driverID){
    /**
     * Delete from drivers table with database delete over HTML
     */
    var req = new XMLHttpRequest();
    var url = `${SERVER}?driverID=${driverID}`;
    req.open('DELETE', url, true);
    req.onload = function(){
        if(req.status === 200){
            emptyDriversTable();
            htmlReadDrivers();
        }
    };
    req.send();
}

/**
 * Main
 */

document.addEventListener('DOMContentLoaded', htmlCreateDriver());
document.addEventListener('DOMContentLoaded', htmlReadDrivers());
