/**************************************************************/
// game_manager.js
/**************************************************************/
MODULENAME = "game_manager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

var leaderBoardContents = []

/*************************************************************/
//manager_checkLeaderBoard(_data)
//Checks the user high scores, gets data from firebase
//called when page loads
//input: n/a
//return: n/a
/*************************************************************/
function manager_checkLeaderBoard(_data) {
  console.log("manager_checkLeaderBoard();");
  let row = '';

  //Sorts high score from high to low
  _data.sort((a, b) => (a.highScore < b.highScore) ? 1 : -1);
  
  for (i = 0; i < _data.length; i++) {
    //Creating a string that will display the score
    row = _data[i].name + ": " + _data[i].highScore;
    console.log(_data[i].name + ": " + _data[i].highScore);

    leaderBoardContents.push({display: row, photoURL: _data[i].photoURL, highScore: _data[i].highScore});
  }
  manager_displayLeaderBoard(leaderBoardContents);
}


/*************************************************************/
//manager_displayLeaderBoard(_data)
//Displays the leader board
//called when page loads
//input: n/a
//return: n/a
/*************************************************************/
function manager_displayLeaderBoard(_data) {
  console.log("manager_displayLeaderBoard();");

  //Setting the title now that leader board is loaded
  document.getElementById("leaderBoard_title").innerHTML = "Flappy bird high scores:";
  
  let leaderBoard = document.getElementById("leaderBoard");
  
  for (i = 0; i < _data.length; i++) {
    let display = _data[i].display

    //Appending data to the leaderboard
    let div1 = document.createElement("div");
    leaderBoard.appendChild(div1);

    //Giving each row an id, such that it gose row1, row2, row3...
    //Also adding in styling for the row
    div1.setAttribute('id', 'row' + Number(i + 1))
    document.getElementById('row' + Number(i + 1)).classList.add('leaderBoard_row');

    let node = document.createTextNode("#" + Number(i + 1) + " ");
    div1.appendChild(node);

    //Adding user photo on leader board
    let img = document.createElement("img");
    img.src = _data[i].photoURL;
    
    let div2 = document.getElementById('row' + Number(i + 1));
    div2.appendChild(img);

    //Giving each img an id, such that it gose img1, img2, img3...
    //Also adding in styling for the img
    img.setAttribute('id', 'img' + Number(i + 1));
    document.getElementById('img' + Number(i + 1)).classList.add('leaderBoard_img');

    //Appending names and score to the leaderboard
    let node2 = document.createTextNode(" " + display);
    div1.appendChild(node2);
  }
}