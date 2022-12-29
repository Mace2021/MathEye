const easy = [
  "5--------=5---------=53--------=5---------=51--------=5",
  "5-2-3+1+4=54*3-2-5*1=53-4-1+2+5=52+1-5+4+3=51+5+4-3-2=5",
];
/*let medium =[
  [0,0,0,0,0,0,0,0,0,=,10],[-,-,-,-,-,-,-,-,-,=,10],[-,-,-,-,-,-,-,-,-,=,10],[-,-,-,-,-,-,-,-,-,=,10],[-,-,-,-,-,-,-,-,-,=10],
  [10,-,4,/,6,*,2,+,8,=,10],[8,*,6,-,4,-,10,*,2,=,10],[6,-,8,+,2,+,4,+,10,=,10],4,+,2,-,10,+,8,+,6,=,10,2,+,10,+,8,-,6,-,4,=,10");
]
  const hard =
  ("-,-,-,-,-,-,-,-,-,=,15,-,-,-,-,-,-,-,-,-,=,15,-,-,-,-,-,-,-,-,-,=15,-,-,-,-,-,-,-,-,-,=15,-,-,-,-,-,-,-,-,-,=15",
  "15,-,6,/,9,*,3,+,12,=15,12,*,9,-,6,-,15,*,3,=,15,9,-,12,+,3,*,6,+,15,=,15,6,+,3,-,15,+,12,+,9,=,15,3,+,15,+,12,-,9,-,6,=,15");
*/
/*const medium = [
  "---------=0---------=10---------=10---------=10---------=10",
  "10-4/6*2+10=108*6-4-10*2=106-8+2*4+10=104+2-10+8+6=102+10+8-6-4=10",
];*
const hard = [
  "---------=15---------=15---------=15---------=15---------=15",
  "15-6/9*3+15=1512*9-6-15*3=159-12+3*6+15=156+3-15+12+9=153+15+12-9-6=15",
];*/
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectTile;
var disableSelect;
window.onload = function () {
  id("start-btn").addEventListener("click", startGame);
  // add eventlistener to number-container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      // if selection is not disable
      if (!disableSelect) {
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          for (let i = 0; i < id("number-container").children.length; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
  setTimeout("alert('Please support us by donating')", 180000);
};
function startGame() {
  let board;
  if (id("diff1").checked) board = easy[0];
  else if (id("diff2").checked) board = medium[0];
  else board = hard[0];
  lives = 10;
  disableSelect = false;
  id("lives").textContent = "Lives remaining:" + lives;
  // generate board base on level
  generateBoard(board);
  //set timer
  startTimer();
  //set theme
  if (id("theme1").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }
  //show board contatiner
  id("number-container").classList.remove("hidden");
}
function startTimer() {
  if (id("time1").checked) timeRemaining = 300;
  else if (id("time2").checked) timeRemaining = 600;
  else timeRemaining = 900;
  //set timer
  id("timer").textContent = timeConversion(timeRemaining);
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}
function timeConversion(time) {
  let minuts = Math.floor(time / 60);
  if (minuts < 10) minuts = "0" + minuts;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minuts + ":" + seconds;
}
function generateBoard(board) {
  //clear previous board
  clearPrevious();
  //add tiles
  let idCount = 0;
  //create 55 tiles
  for (let i = 0; i < 55; i++) {
    let tile = document.createElement("p");
    //if not a black tile
    if (board.charAt(i) != "-") {
      //set tile to coresponding num
      tile.textContent = board.charAt(i);
    } else {
      // add event listerner
      tile.addEventListener("click", function () {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            selectTile = null;
          } else {
            for (let i = 0; i < 55; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //add selection and update variable
            tile.classList.add("selected");
            selectTile = tile;
            updateMove();
          }
        }
      });
    }

    //assign tile id
    tile.id = idCount;
    //increment idcount
    idCount++;
    //add tile class

    tile.classList.add("tile");
    if (
      (tile.id >= 0 && tile.id < 12) ||
      (tile.id > 11) & (tile.id < 23) ||
      (tile.id > 20) & (tile.id < 36) ||
      (tile.id > 34) & (tile.id < 44)
    ) {
      tile.classList.add("bottomBorder");
    }
    tile.classList.add("tile");
    if (
      (tile.id >= 0 && tile.id < 12) ||
      (tile.id > 11) & (tile.id < 23) ||
      (tile.id > 20) & (tile.id < 36) ||
      (tile.id > 34) & (tile.id < 44)
    ) {
      tile.style.fWebkitFlexWrap = "wrap";
      tile.style.boxSizing = "border-box";
      tile.style.flexGrow = "inherit";
      tile.style.flexShrink = "inherit";
      tile.style.flexbasis = "10%";
    }
    //add tile to board
    id("board").appendChild(tile);
  }
}
function updateMove() {
  //if a tile and num is selected
  if (selectTile && selectedNum) {
    // set tile to correct num
    selectTile.textContent = selectedNum.textContent;
    //if num matched
    if (checkCorrect(selectTile)) {
      //deselect tile
      selectTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      // clear variable
      selectTile = null;
      selectedNum = null;
      //check if board is completed
      if (checkDone()) {
        endGame();
      }
    } else {
      //disable selected for 1 second
      disableSelect = true;
      // turn red if incorrect
      selectTile.classList.add("incorrect");
      // run in one second
      setTimeout(function () {
        //subtract live by one
        lives--;
        //if no lives left end game
        if (lives === 0) {
          endGame();
        } else {
          //if lives is not equal to zero; updat lives text
          id("lives").textContent = "lives remaing: " + lives;
          //reenable selecting num& tile
          disableSelect = false;
        }
        // retore tile color
        selectTile.classList.remove("incorrect");
        selectTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        //clear text and variable
        selectTile.textContent = "";
        selectTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}
function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}
function endGame() {
  //disable moves
  disableSelect = true;
  clearTimeout(timer);
  //display win or loss message
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "You lost. Don't feel too bad, try again";
  } else {
    id("lives").textContent =
      "Congratulations, You Won! I see you are a badass. You know your arithmetic. Good for you.";
  }
}
function checkCorrect(tile) {
  //set solution
  let solution;
  if (id("diff1").checked) solution = easy[1];
  else if (id("diff2").checked) solution = medium[1];
  else solution = hard[1];
  if (solution.charAt(tile.id) == tile.textContent) return true;
  else return false;
}
function clearPrevious() {
  //access tiles
  let tiles = qsa(".tile");
  //removed tiles
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  //clear remaing timer
  if (timer) clearTimeout(timer);
  // deselect nums
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }
  // clear selected variables
  selectTile = null;
  selectedNum = null;
}
//Helper functions
function id(id) {
  return document.getElementById(id);
}
function qs(selector) {
  return document.querySelector(selector);
}
function qsa(selector) {
  return document.querySelectorAll(selector);
}
