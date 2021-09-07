//var SERVER = 'http://localhost:3001/shifts';
var SERVER = 'http://flip3.engr.oregonstate.edu:7403/shifts';

function htmlCreateShift(){
    /**
     * Create shifts table row in database write over HTML
     */
    // Get create form
    var form = document.getElementById('new-shift');

    // Add create form event listener
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var shiftPeriod = document.getElementById('new-shift-period').value || null;
        var shiftStartTime = document.getElementById('new-shift-start-time').value || null;
        var shiftEndTime = document.getElementById('new-shift-end-time').value || null;
        if(shiftPeriod === null || shiftStartTime === null || shiftEndTime === null){
            emptyForm();
            return;
        }
        var req = new XMLHttpRequest();
        var url = `${SERVER}?shiftPeriod=${shiftPeriod}&shiftStartTime=${shiftStartTime}&shiftEndTime=${shiftEndTime}`;
        req.open('POST',url,true);
        req.onload = function(){
            if(req.status === 200){
                emptyForm();
                emptyShiftsTable();
                htmlReadShifts();
            }
        };
        req.send();
    });
}

function emptyForm(){
    /**
     * Empty new shift form
     */
    document.getElementById('new-shift-period').value = null;
    document.getElementById('new-shift-start-time').value = null;
    document.getElementById('new-shift-end-time').value = null;
}

function htmlReadShifts(){
    /**
     * Build shifts table from database read over HTML
     */
     var req = new XMLHttpRequest();
     req.onload = function(){
         if(req.status === 200){
             emptyShiftsTable();
             var shifts = JSON.parse(req.responseText);
             fillShiftsTable(shifts);
         }
     };
     req.open('GET', SERVER, true);
     req.send();
}

function emptyShiftsTable(){
    /**
     * Empty shifts table data
     */
    var table = document.getElementById('shifts-table');
    Array.from(table.children).slice(1).forEach(function(){
        table.removeChild(table.children[1]);
    });
}

function fillShiftsTable(shifts){
    /**
     * Fill shifts table with data
     */
    shifts.forEach(function(shift){
        appendShiftsTableRow(shift);
    });
}

function appendShiftsTableRow(shift){
    /**
     * Append shifts table row with data
     */
    var shiftID = shift.shiftID;
    var shiftPeriod = shift.shiftPeriod;
    var shiftStartTime = shift.shiftStartTime;
    var shiftEndTime = shift.shiftEndTime;

    // Get table
    var table = document.getElementById('shifts-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${shiftID}`;
    table.appendChild(tableRow);

    // Append shift ID table cell
    var shiftIDCell = document.createElement('div');
    shiftIDCell.style.display = 'table-cell';
    var shiftIDInput = document.createElement('input');
    shiftIDInput.id = `shift-id-${shiftID}`;
    shiftIDInput.disabled = true;
    shiftIDInput.name = 'shift-id';
    shiftIDInput.value = shiftID;
    shiftIDCell.appendChild(shiftIDInput);
    tableRow.appendChild(shiftIDCell);

    // Append shift period table cell
    var shiftPeriodCell = document.createElement('div');
    shiftPeriodCell.style.display = 'table-cell';
    var shiftPeriodInput = document.createElement('input');
    shiftPeriodInput.id = `shift-period-${shiftID}`;
    shiftPeriodInput.type = 'text';
    shiftPeriodInput.name = 'shift-period';
    shiftPeriodInput.value = shiftPeriod;
    shiftPeriodCell.appendChild(shiftPeriodInput);
    tableRow.appendChild(shiftPeriodCell);

    // Append shift start time table cell
    var shiftStartTimeCell = document.createElement('div');
    shiftStartTimeCell.style.display = 'table-cell';
    var shiftStartTimeInput = document.createElement('input');
    shiftStartTimeInput.id = `shift-start-time-${shiftID}`;
    shiftStartTimeInput.type = 'time';
    shiftStartTimeInput.name = 'shift-start-time';
    shiftStartTimeInput.value = shiftStartTime;
    shiftStartTimeCell.appendChild(shiftStartTimeInput);
    tableRow.appendChild(shiftStartTimeCell);

    // Append shift end time table cell
    var shiftEndTimeCell = document.createElement('div');
    shiftEndTimeCell.style.display = 'table-cell';
    var shiftEndTimeInput = document.createElement('input');
    shiftEndTimeInput.id = `shift-end-time-${shiftID}`;
    shiftEndTimeInput.type = 'time';
    shiftEndTimeInput.name = 'shift-end-time';
    shiftEndTimeInput.value = shiftEndTime;
    shiftEndTimeCell.appendChild(shiftEndTimeInput);
    tableRow.appendChild(shiftEndTimeCell);

    // Append update table cell
    var updateCell = document.createElement('div');
    updateCell.style.display = 'table-cell';
    var updateInput = document.createElement('input');
    updateInput.id = `update-${shiftID}`;
    updateInput.type = 'button';
    updateInput.name = 'update';
    updateInput.value = 'Update';
    updateCell.appendChild(updateInput);
    tableRow.appendChild(updateCell);

    // Add update event listener
    updateInput.addEventListener('click',function(e){
        e.preventDefault();
        var shift = {
            shiftID: shiftIDInput.value,
            shiftPeriod: shiftPeriodInput.value,
            shiftStartTime: shiftStartTimeInput.value,
            shiftEndTime: shiftEndTimeInput.value
        };
        htmlUpdateShift(shift);
    });

    // Append delete table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${shiftID}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click',function(e){
        e.preventDefault();
        htmlDeleteShift(shiftID);
    });
}

function htmlUpdateShift(shift){
    /**
     * Update shifts table with database update over HTML
     */
    var shiftID = shift.shiftID;
    var shiftPeriod = shift.shiftPeriod;
    var shiftStartTime = shift.shiftStartTime;
    var shiftEndTime = shift.shiftEndTime;
    var req = new XMLHttpRequest();
    var url = `${SERVER}?shiftID=${shiftID}&shiftPeriod=${shiftPeriod}&shiftStartTime=${shiftStartTime}&shiftEndTime=${shiftEndTime}`;
    req.open('PUT',url,true);
    req.onload = function(){
        if(req.status === 200){
            emptyShiftsTable();
            htmlReadShifts();
        }
    };
    req.send();
}

function htmlDeleteShift(shiftID){
    /**
     * Delete from shifts table with database delete over HTML
     */
    var req = new XMLHttpRequest();
    var url = `${SERVER}?shiftID=${shiftID}`;
    req.open('DELETE',url,true);
    req.onload = function(){
        if(req.status === 200){
            emptyShiftsTable();
            htmlReadShifts();
        }
    };
    req.send();
}

/**
 * Main
 */

document.addEventListener('DOMContentLoaded', htmlCreateShift());
document.addEventListener('DOMContentLoaded', htmlReadShifts());
