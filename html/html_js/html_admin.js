/*************************************************************
  ad_manager.js
*************************************************************/

MODULENAME = "ad_manager.js";
ad_console(MODULENAME, '\n--------------------', 'blue');

/**************************************************************/
// ad_load()
// Called by ad_manager.html onload
// Prepare admin 
// Input:  n/a
// Return: n/a
/**************************************************************/
function ad_load() {
  ad_console('ad_load', 'called', COL_FUNC);

  // Initilising firebase and getting the values from sesion storage
  fbR_initialise();
  manager_getValues();

  ad_user();
}

/**************************************************************/
// ad_user()
// Input event; called by ad_admin and when admin's USER button clicked.
// Display user screen
// Input:  n/a
// Return: n/a
/**************************************************************/
function ad_user() {
  ad_console('ad_user', 'called', COL_FUNC);

  ad_alterClass('ad_btn', 'grey');
  document.getElementById("b_adUser").style.backgroundColor = "white";

  fb_readAll(fbV_LOGINDETAILSPATH, '', ad_processUSERReadAll);
}

/**************************************************************/
// ad_FB()
// Input event; called when admin's FB button clicked
// Display FB admin screen
// Input:  n/a
// Return: n/a
/**************************************************************/
function ad_FB() {
  ad_console('ad_FB', 'called', COL_FUNC);

  ad_alterClass('ad_btn', 'grey');
  document.getElementById("b_adFB").style.backgroundColor = "white";

  fb_readAll(fbV_FLAPPYSCOREPATH, '', ad_processFBReadAll);
}

/**************************************************************/
// ad_PF()
// Input event; called when admin's PF button clicked
// Display PF admin screen
// Input:  n/a
// Return: n/a
/**************************************************************/
function ad_PF() {
  ad_console('ad_PF', 'called', COL_FUNC);

  ad_alterClass('ad_btn', 'grey');
  document.getElementById("b_adPF").style.backgroundColor = "white";

  fb_readAll(fbV_PFSCOREPATH, '', ad_processPFReadAll);
}

/**************************************************************/
// ad_processUSERReadAll(snapshot)
// Called by fb_readAll to handle result of read ALL USER records request.
// Save data & update display with record info
// Input:  snapshot from read
//         NOTE: this is the raw data, EG snapshot, NOT snapshot.val()
// Return: n/a
/**************************************************************/
function ad_processUSERReadAll(snapshot) {
  ad_console('ad_processUSERReadAll', '', COL_FUNC);

  var childKey;
  var childData;
  var ad_adminArray = [];

  if (snapshot.val() != null) {
    snapshot.forEach(function(childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();

      // ENSURE THE FEILDS YOU PUSH INTO THE ARRAY OF OBJECTS            //<=======
      //  MATCH YOUR FIREBASE RECORDS FOR THE PATH                       //<=======
      ad_adminArray.push({
        email: childData.email,
        name: childData.name,

        // NOTE: in this case the uid or key is the 5th field            //<=======
        //  so it is the 5th column.                                     //<=======
        // See explaination of ad_displayAll's 7th parameter below.      //<=======
        // Therefore if you add or delete fields you will                //<=======
        //    need to alter the 7th parameter below to match.            //<=======
        uid: childKey
      });
    });

    // build & display user data
    // MAKE SURE THE FOLOWING PARAMETERS ARE CORRECT. PARAMETER:         //<=======
    //  4 = HTML ID OF DIV TO HIDE OR LEAVE EMPTY                        //<=======
    //  5 = HTML ID OF DIV TO HIDE OR LEAVE EMPTY                        //<=======
    //  6 = HTML ID OF DIV TO SHOW OR LEAVE EMPTY                        //<=======
    //  7 = COLUMMN NUMBER WHICH CONTAINS THE DATABASE KEY.              //<=======
    //  8 = DATABASE PATH THE RECORDS WERE READ FROM.                    //<=======
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      3, fbV_LOGINDETAILSPATH);                                           //<=======
  }
}

/**************************************************************/
// ad_processFBReadAll(snapshot)
// Called by fb_readAll to handle result of read ALL FB records request.
// Save data & update display with record info
// Input:  snapshot from read
//         NOTE: this is the raw data, EG snapshot, NOT snapshot.val()
// Return: n/a
/**************************************************************/
function ad_processFBReadAll(snapshot) {
  ad_console('ad_processFBReadAll', '', COL_FUNC);

  var childKey;
  var childData;
  var ad_adminArray = [];

  if (snapshot != null) {
    snapshot.forEach(function(childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();
      console.log(Object.keys(childData));

      // ENSURE THE FEILDS YOU PUSH INTO THE ARRAY OF OBJECTS            //<=======
      //  MATCH YOUR FIREBASE RECORDS FOR THE PATH                       //<=======
      ad_adminArray.push({
        uid: childKey,
        highScore: childData.highScore,
        userName: childData.userName,
        score: childData.score,
      });
    });

    // build & display user data
    // MAKE SURE THE FOLOWING PARAMETERS ARE CORRECT. PARAMETER:         //<=======
    //  7 = COLUMMN NUMBER WHICH CONTAINS THE DATABASE KEY.              //<=======
    //  8 = DATABASE PATH THE RECORDS WERE READ FROM.                    //<=======
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      1, fbV_FLAPPYSCOREPATH);                                                //<=======
  } else if (snapshot == null) {
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      1, fbV_FLAPPYSCOREPATH);                                                //<=======
  }
}

/**************************************************************/
// ad_processPFReadAll(snapshot)
// Called by fb_readAll to handle result of read ALL PF records request.
// Save data & update display with record info
// Input:  snapshot from read
//         NOTE: this is the raw data, EG snapshot, NOT snapshot.val()
// Return: n/a
/**************************************************************/
function ad_processPFReadAll(snapshot) {
  ad_console('ad_processPFReadAll', '', COL_FUNC);

  var childKey;
  var childData;
  var ad_adminArray = [];

  if (snapshot != null) {
    snapshot.forEach(function(childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();
      console.log(Object.keys(childData));

      ad_adminArray.push({
        uid: childKey,
        highScore: childData.highScore,
        userName: childData.userName,
        score: childData.score
      });
    });

    // build & display user data
    // MAKE SURE THE FOLOWING PARAMETERS ARE CORRECT. PARAMETER:         //<=======
    //  7 = COLUMMN NUMBER WHICH CONTAINS THE DATABASE KEY.              //<=======
    //  8 = DATABASE PATH THE RECORDS WERE READ FROM.                    //<=======
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      1, fbV_PFSCOREPATH);                                                //<=======
  } else if (snapshot == null) {
    ad_displayAll("t_userData", ad_adminArray, true, "", "", "",
      1, fbV_PFSCOREPATH);                                                //<=======
  }
}

/**************************************************************/
// ad_userInput(_fieldName, _data)
// Called by finishTdEdit
// Validate numeric data & convert string number input to numerics
// Input:  field and user input
// Return: if validation ok: [true, numeric user input] else: [false, user input]
/**************************************************************/
function ad_userInput(_fieldName, _data) {
  ad_console('ad_userInput', '_fieldName = ' + _fieldName +
    ',  _data = ' + _data, COL_FUNC);
  // Set up data types; 'a' for aplhabetic,   'n' for numeric  &  'b' for both
  // ENSURE THE FEILDS BELOW MATCH YOUR PF FILEDS                       //<=======
  //   AND THE DATATYPE IS CORRECTLY SET                                //<=======
  var vd_dataTypes = {
    uid: 'b',
    highScore: 'n',
    name: 'a',
    score: 'n',
    email: 'b',
  };

  if (vd_dataTypes[_fieldName] == 'n') {
    temp = Number(_data);
    if (isNaN(temp)) {
      return [false, _data];
    }
    return [true, temp];
  }

  else {
    return [true, _data];
  }
}

//================================================================================= 
//        YOU SHOULD NOT ALTER ANY OF THE CODE BELOW                     //<=======
//=================================================================================

/**************************************************************/
// ad_alterClass(_class, _colour)
// Called by various
// Alter classes colour
// Input:  html class to act on & the colour to set it to
// Return: n/a
/**************************************************************/
function ad_alterClass(_class, _colour) {
  ad_console('ad_alterClass', 'class= ' + _class +
    ' / colour= ' + _colour, COL_FUNC);

  var element = document.getElementsByClassName(_class);
  for (i = 0; i < element.length; i++) {
    element[i].style.backgroundColor = _colour;
  }
}

/**************************************************************/
// ad_displayAll(_tableId, _array, _action, _hideId, _showId, _path)
// Called by ad_PFRAllUResult & ad_PFRAllBBResult
// Display all user records screen:
//    1. optionaly hide other screen & display the admin screen.
//    2. empty the html table.
//    3. dyanmicaly build html table & display all records. 
// Input:  1. html table id to dynamicaly build and populate.
//         2. data (an array of objects) to add to the table.
//         3. add DELETE & MODIFY capability to the table (true OR false).
//         4. to hide the previous screen, supply the html ids
//           of the associated divs to hide it OR leave them empty ''
//         5. to show the admin screen, supply the html id
//           of the associated div to show it OR leave empty ''
//         6. table item number containing the db key.
//         7. firebase path for delete capability.
// Return: n/a
//
// V01: Initial version
// v02: Add delete & update code
//
// Example call of ad_displayAll:
//  ad_displayAll("t_userData", dbArray, true, "landingPage", "", "adminPage", 
//                1, DETAILS);
/**************************************************************/
function ad_displayAll(_tableId, _array, _action, _hideId1, _hideId2, _showId, _item, _path) {
  ad_console('ad_displayAll', 'called', COL_FUNC);

  // Optionaly hide html divs and show another html div
  if (_hideId1 != null && _hideId1 != "") {
    document.getElementById(_hideId1).style.display = "none";
  }
  if (_hideId2 != null && _hideId2 != "") {
    document.getElementById(_hideId2).style.display = "none";
  }
  if (_showId != null && _showId != "") {
    document.getElementById(_showId).style.display = "block";
  }

  // Ensure the html table is empty before we start
  if (document.getElementById(_tableId).rows.length > 0) {
    document.getElementById(_tableId).innerHTML = "";
  }

  var tableInfo = document.getElementById(_tableId); //Get info on target table

  if (_array.length > 0) { // Only if there is data
    var fieldNames = Object.keys(_array[0]); //Get header from 1st entry 

    // Dynamically build html table & display the data
    ad_genTableEntry(tableInfo, _array, _action, _tableId, _item, _path);
    ad_genTableHead(tableInfo, fieldNames, _action);

    ad_clickEditCell(_tableId, _item, _path); // Make cells editable
  }
}

/**************************************************************/
// ad_genTableHead(_tableInfo, _fieldNames, _action)
// Called by ad_BB
// Create table header
// Input:  table & object array of data 
//         if _action = true, then add action column
// Return: n/a
/**************************************************************/
function ad_genTableHead(_tableInfo, _fieldNames, _action) {
  ad_console('ad_genTableHead', 'called', COL_FUNC);

  let thead = _tableInfo.createTHead();
  let row = thead.insertRow();

  // Optionaly create ACTION header
  if (_action != null && _action != "") {
    let th = document.createElement("th");
    let text = document.createTextNode("action");
    th.appendChild(text);
    row.appendChild(th);
  }

  // Loop thru array of object's field names creating header for entry each
  for (let key of _fieldNames) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

/**************************************************************/
// ad_genTableEntry(_tableInfo, _array, _action, _tableId, _item, _path)
// Called by ad_BB
// Create table entries
// Input:  table & object array of data
//         if _action = true, then add DELETE button
//         table id & table item number containing db key
//         db path
// Return: n/a
/**************************************************************/
function ad_genTableEntry(_tableInfo, _array, _action, _tableId, _item, _path) {
  ad_console('ad_genTableEntry', 'called', COL_FUNC);

  // Loop thru array of object's data creating cell for entry each
  for (let element of _array) {
    let row = _tableInfo.insertRow();
    // Optionaly create ACTION cell
    if (_action != null && _action != "") {
      // add a button control.
      var button = document.createElement('input');

      // set the attributes.
      button.setAttribute('type', 'button');
      button.setAttribute('value', 'Delete');

      // add button's "onclick" event.         
      button.addEventListener("click", function() {
        ad_PFDelRec(_tableId, this, _item, _path);
      });
      let cell = row.insertCell();
      cell.appendChild(button);
      cell.classList.add("cell");
    }

    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
      cell.classList.add("cell");
    }
  }
}

/**************************************************************/
// ad_clickEditCell(_tableId _item, _path)
// Called by user clicking on a table's cell
// Edit the cell's data except for cell 0.
// Input:  table id
// Return: n/a
/**************************************************************/
function ad_clickEditCell(_tableId, _item, _path) {
  ad_console('ad_clickEditCell', 'path = ' + _path +
    ', item = ' + _item, COL_FUNC);

  let table = document.getElementById(_tableId);
  let editingTd;
  var cell;
  var row;
  var dbKey;
  var dbFieldName;

  //document.querySelector("table").addEventListener("click", function(event) {
  table.onclick = function(event) {
    //ad_console('ad_clickEditCell', 'click event called. path = ' +
    //           _path, COL_FUNC); 
    // 4 possible targets:                
    let target = event.target.closest('.edit-cancel,.edit-ok,td');

    if (!table.contains(target)) return;

    if (target.className == 'edit-cancel') {
      finishTdEdit(editingTd.elem, false);
    } else if (target.className == 'edit-ok') {
      finishTdEdit(editingTd.elem, true, _path, dbKey, dbFieldName);
    } else if (target.nodeName == 'TD') {
      if (editingTd) return; // already editing
      if (typeof event.target.cellIndex == 'undefined') return;

      cell = event.target.cellIndex;
      row = target.parentNode.rowIndex;
      dbKey = table.rows[row].cells[_item].innerHTML;
      dbFieldName = table.rows[0].cells[cell].innerHTML;

      makeTdEditable(target);
    }
  }

  function makeTdEditable(td) {
    editingTd = {
      elem: td,
      data: td.innerHTML
    };

    td.classList.add('edit-td'); // td is in edit state, CSS also styles the area inside

    let textArea = document.createElement('textarea');
    textArea.style.width = td.clientWidth + 'px';
    textArea.style.height = td.clientHeight + 'px';
    textArea.className = 'edit-area';

    textArea.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(textArea);
    textArea.focus();

    td.insertAdjacentHTML("beforeEnd",
      '<div class="edit-controls"><button class="edit-ok">OK' +
      '</button><button class="edit-cancel">cancel</button></div>'
    );
  }

  function finishTdEdit(td, isOk, _path, _PFKey, _PFFieldName) {
    if (isOk) {
      td.innerHTML = td.firstChild.value;
      ad_console('finishTdEdit', 'path/key = ' + _path + '/' +
        _PFKey + ',  field name = ' + _PFFieldName +
        ', data = ' + td.innerHTML, COL_INFO);

      var data = {};
      var rtn = [];
      rtn = ad_userInput(_PFFieldName, td.innerHTML);
      if (rtn[0]) {        // User input validated ok?
        data[_PFFieldName] = rtn[1];
        ad_console('finishTdEdit', 'td.innerHTML = ' + rtn[1] +
          '  type = ' + typeof (rtn[1]), COL_INFO);
        td.style.background = 'red';
        ad_PFUpdateRec(_path, _PFKey, _PFFieldName, data, td);
      }
      else {
        td.style.background = 'red';
      }
    }
    else {
      td.innerHTML = editingTd.data;
    }
    td.classList.remove('edit-td');
    editingTd = null;
  }
}

/**************************************************************/
// ad_PFUpdateRec(_tableId, _row, _item, _path)
// Called by finishTdEdit when user clicks OK button
// Update the associated record from firebase
// Input:  path, key, field name, data & td object
// Return: n/a
/**************************************************************/
function ad_PFUpdateRec(_path, _PFKey, _PFFieldName, _data, _td) {
  ad_console('ad_PFUpdateRec', '_path/_PFKey = ' + _path + '/' +
    _PFKey + ',  _PFFieldName = ' + _PFFieldName +
    ',  _data = ' + _data + '  _td = ' + _td, COL_FUNC);

  var dbRef = firebase.database().ref(_path + '/' + _PFKey);
  dbRef.update(_data).then(function() {
    _td.style.background = 'Azure';
    ad_console('ad_PFUpdateRec', 'Update succeeded for ' +
      _path + '/' + _PFKey, COL_INFO);
    //ad_delRow(_tableId, _row, item, _path);
  })
    .catch(function(error) {
      ad_console('ad_PFUpdateRec', 'Update failed for ' + _path +
        '/' + _PFKey + ': ' + error.message, COL_INFO);
    });
}

/**************************************************************/
// ad_PFDelRec(_tableId, _row, _item, _path)
// Called when user clicks DELETE button
// Delete the associated record from firebase
// Input:  html table id, row & item number of firebase key and firebase path 
// Return: n/a
/**************************************************************/
function ad_PFDelRec(_tableId, _row, _item, _path) {
  ad_console('ad_PFDelRec', '_tableId/_row = ' + _tableId + '/' + _row +
    ',  _item = ' + _item + ',  _path = ' + _path, COL_FUNC);

  var i = _row.parentNode.parentNode.rowIndex;
  var key = document.getElementById(_tableId).rows[i].cells.item(_item).innerHTML;
  ad_console('ad_PFDelRec', 'db path/key = ' + _path + '/' + key, COL_INFO);

  var dbRef = firebase.database().ref(_path + '/' + key);
  dbRef.remove().then(function() {
    ad_console('ad_PFDelRec', 'Remove succeeded for ' + _path + '/' +
      key, COL_INFO);
    ad_delRow(_tableId, _row);
  })
    .catch(function(error) {
      ad_console('ad_PFDelRec', 'Remove failed for ' + _path + '/' +
        key + ': ' + error.message, COL_INFO);
    });
}

/**************************************************************/
// ad_delRow(_tableId, _row)
// Called by ad_PFDelRec when user clicks DELETE button
// Delete a row from a table
// Input:  table id & row to delete
// Return:
/**************************************************************/
function ad_delRow(_tableId, _row) {
  ad_console('ad_delRow', '_tableId/_row = ' + _tableId + '/' +
    _row, COL_FUNC);

  var i = _row.parentNode.parentNode.rowIndex;
  ad_console('ad_delRow', 'i = ' + i, COL_INFO);
  document.getElementById(_tableId).deleteRow(i);
}

/**************************************************************/
// ad_enterEvent(_tableId)
// Called by user entering data in a table's cell
// Display the cell's data
// Input:  table id
// Return: n/a
/**************************************************************/
function ad_enterEvent(_tableId) {
  ad_console('ad_enterEvent', '_tableId = ' + _tableId, COL_FUNC);

  // Listen for typing into a cell - display what is being typed into the cell.
  document.getElementById(_tableId).addEventListener("input", function(event) {
    var td = event.target;
    while (td !== this && !td.matches("td")) {
      td = td.parentNode;
    }

    if (td === this) {
      ad_console('ad_PFRAllUResult', 'enter - No table cell found', COL_INFO);
    } else {
      ad_console('ad_PFRAllUResult', 'enter - cell= ' + td.innerHTML, COL_INFO);
      if (td.innerHTML == 'd') {
        //document.getElementById(_tableId).deleteRow(2);
      }
    }
  });
}

/**************************************************************/
// ad_clickCell(_tableId)
// Called by user clicking on a table's cell
// Edit the cell's data
// Input:  table id
// Return: n/a
/**************************************************************/
function ad_clickCell(_tableId) {
  ad_console('ad_clickCell', '_tableId = ' + _tableId, COL_FUNC);

  // Click on cell to display its contents
  document.querySelector("table").addEventListener("click", function(event) {
    var td = event.target;
    while (td !== this && !td.matches("td")) {
      td = td.parentNode;
    }
    if (td === this) {
      ad_console('ad_PFRAllUResult', 'click - No table cell found', COL_ERROR);
    } else {
      ad_console('ad_PFRAllUResult', 'click - cell= ' + td.innerHTML, COL_INFO);
    }
  });
}

/**************************************************************/
// ad_console(_function, _text, _colour)
// Called by all ad_ functions
// Log information to console if logIt is y
// Input:  calling function, text to display, colour code
//         If calling function = "%" use console.table
//                               "&" use just console.log
// Return: n/a
/**************************************************************/
const COL_FUNC = 'brown';
const COL_INFO = 'black';
const COL_WARN = 'yellow';
const COL_SUCCESS = 'blue';
const COL_ERROR = 'red';

var logIt = 'y';

function ad_console(_function, _text, _colour) {
  if (logIt == 'y') {
    if (_function == "%") {
      console.table(_text);
      return;
    }
    if (_function == "&") {
      console.log(_text);
      return;
    }

    if (_colour == COL_FUNC) {
      console.info("%c" + _function + ': ' + _text, "color:" + COL_FUNC);
    }
    else if (_colour == COL_INFO) {
      console.info("%c" + _function + ': ' + _text, "color:" + COL_INFO);
    }
    else if (_colour == COL_WARN) {
      console.warn("%c" + _function + ': ' + _text, "color:" + COL_WARN);
    }
    else if (_colour == COL_SUCCESS) {
      console.info("%c" + _function + ': ' + _text, "color:" + COL_SUCCESS);
    }
    else if (_colour == COL_ERROR) {
      console.error("%c" + _function + ': ' + _text, "color:" + COL_ERROR);
    }
    else {
      console.log("%c" + _function + ': ' + _text, "color:" + _colour);
    }
  }
}

/**************************************************************/
//  END OE APP
/**************************************************************/