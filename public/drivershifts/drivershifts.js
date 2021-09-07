//var SERVER = 'http://localhost:3001/drivershifts';
var SERVER = 'http://flip3.engr.oregonstate.edu:7403/drivershifts';

function htmlFillDriversSelect(){
    /**
     * Fill driverID select options
     */
    var select = document.getElementById('new-driver-id');
    var drivers = 'http://flip3.engr.oregonstate.edu:7403/drivers';
    var req = new XMLHttpRequest();
    req.open('GET', drivers, true);
    req.onload = function(){
        if(req.status >= 200 && req.status <= 400){
            var res = JSON.parse(req.responseText);
            var ids = res.map(function(driver){
                return `${driver.driverID} ${driver.driverFirstName} ${driver.driverLastName}`;
            });
            // Add driverID select option
            ids.forEach(function(id){
                var option = document.createElement('option');
                option.textContent = id;
                option.value = id;
                select.appendChild(option);
            });
        }
    };
    req.send();
}

function htmlFillShiftsSelect(){
    /**
     * Fill shiftID select options
     */
    var select = document.getElementById('new-shift-id');
    var shifts = 'http://flip3.engr.oregonstate.edu:7403/shifts';
    var req = new XMLHttpRequest();
    req.open('GET', shifts, true);
    req.onload = function(){
        if(req.status >= 200 && req.status <= 400){
            var res = JSON.parse(req.responseText);
            var ids = res.map(function(shift){
                return `${shift.shiftID} ${shift.shiftPeriod}`;
            });
            // Add shiftID select option
            ids.forEach(function(id){
                var option = document.createElement('option');
                option.textContent = id;
                option.value = id;
                select.appendChild(option);
            });
        }
    };
    req.send();
}

function htmlCreateDriverShift(){
    /**
     * Create drivershifts table row in database write over HTML
     */
    // Get create form
    var form = document.getElementById('new-drivershift');
    resetForm();

    // Add create form event listener
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var driverID = document.getElementById('new-driver-id').value || null;
        var shiftID = document.getElementById('new-shift-id').value || null;
        if(driverID === null || shiftID === null){
            emptyForm();
            return;
        }

        var req = new XMLHttpRequest();
        var url = `${SERVER}?driverID=${driverID}&shiftID=${shiftID}`;
        req.open('POST',url,true);
        req.onload = function(){
            if(req.status === 200){
                resetForm();
                emptyDriverShiftsTable();
                htmlReadDriverShifts();
            }
        };
        req.send();
    });
}

function resetForm(){
    /**
     * Reset new shift form
     */
    htmlFillDriversSelect();
    htmlFillShiftsSelect();
}

function htmlReadDriverShifts(){
    /**
     * Build drivershifts table from database read over HTML
     */
    var req = new XMLHttpRequest();
    req.open('GET', SERVER, true);
    req.onload = function(){
        if(req.status >= 200 && req.status < 400){
            emptyDriverShiftsTable();
            var drivershifts = JSON.parse(req.responseText);
            fillDriverShiftsTable(drivershifts);
        }
    };
    req.send();
    
}

function emptyDriverShiftsTable(){
    /**
     * Empty drivers table data
     */
    var table = document.getElementById('drivershifts-table');
    Array.from(table.children).slice(1).forEach(function(){
        table.removeChild(table.children[1]);
    });
}

function fillDriverShiftsTable(drivershifts){
    /**
     * Fill drivershifts table with data
     */
    drivershifts.forEach(function(drivershift){
        appendDriverShiftsTableRow(drivershift);
    });
}

function appendDriverShiftsTableRow(drivershift){
    /**
     * Append drivershifts table row with data
     */
    var driverID = drivershift.driverID;
    var shiftID = drivershift.shiftID;

    // Get table
    var table = document.getElementById('drivershifts-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${driverID}-${shiftID}`;
    table.appendChild(tableRow);

    // Append driver ID table cell
    var driverIDCell = document.createElement('div');
    driverIDCell.style.display = 'table-cell';
    var driverIDInput = document.createElement('input');
    driverIDInput.id = `driver-id-${driverID}-${Math.floor(Math.random() * Date.now())}`;
    driverIDInput.disabled = true;
    driverIDInput.name = 'driver-id';
    driverIDInput.value = driverID;
    driverIDCell.appendChild(driverIDInput);
    tableRow.appendChild(driverIDCell);

    // Append shift ID table cell
    var shiftIDCell = document.createElement('div');
    shiftIDCell.style.display = 'table-cell';
    var shiftIDInput = document.createElement('input');
    shiftIDInput.id = `shift-id-${shiftID}-${Math.floor(Math.random() * Date.now())}`;
    shiftIDInput.disabled = true;
    shiftIDInput.name = 'shift-id';
    shiftIDInput.value = shiftID;
    shiftIDCell.appendChild(shiftIDInput);
    tableRow.appendChild(shiftIDCell);

    // Append delete table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${driverID}-${shiftID}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeleteDriverShift(driverID, shiftID);
    });
}

function htmlDeleteDriverShift(driverID,shiftID){
    /**
     * Delete from drivershifts table with database delete over HTML
     */
    var req = new XMLHttpRequest();
    var url = `${SERVER}?driverID=${driverID}&shiftID=${shiftID}`;
    req.open('DELETE',url,true);
    req.onload = function(){
        if(req.status === 200){
            emptyDriverShiftsTable();
            htmlReadDriverShifts();
        }
    };
    req.send();
}

/**
 * Main
 */

document.addEventListener('DOMContentLoaded', htmlCreateDriverShift());
document.addEventListener('DOMContentLoaded', htmlReadDriverShifts());
