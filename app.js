let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newgameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  document.body.classList.remove("win-active");
  turn0 = true;
  enableBoxes();
  msgContainer.classList.add("hide");
};

//Ai bulid
const checkWinnerForMinimax = () => {
  for (let pattern of winPatterns) {
    let pos1 = boxes[pattern[0]].innerText;
    let pos2 = boxes[pattern[1]].innerText;
    let pos3 = boxes[pattern[2]].innerText;

    if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
      if (pos1 === pos2 && pos2 === pos3) {
        if (pos1 === pos2 && pos2 === pos3) {
          if (pos1 === "X") return 1; // ai wins
          if (pos1 === "O") return -1; //user win
        }
      }
    }
  }

  //draw
  let openSport = [...boxes].filter((box) => box.innerText === "");
  if (openSport.length === 0) return 0;

  return null;
};

const minimax = (boxes, depth, isMaximizing) => {
  let result = checkWinnerForMinimax();
  if (result != null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    boxes.forEach((box, index) => {
      if (box.innerText === "") {
        box.innerText = "X";
        let score = minimax(boxes, depth + 1, false);
        box.innerText = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;

    boxes.forEach((box, index) => {
      if (box.innerText === "") {
        box.innerText = "O";
        let score = minimax(boxes, depth + 1, true);
        box.innerText = "";
        bestScore = Math.min(score, bestScore);
      }
    });

    return bestScore;
  }
};
//auto move X
const computerMove = () => {
  let bestScore = -Infinity;
  let move;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = "X";

      let score = minimax(boxes, 0, false);

      box.innerText = "";

      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  boxes[move].innerText = "X";
  boxes[move].style.color = "#ff4d4d"; // red
  boxes[move].style.textShadow = "0 0 10px #ff4d4d";
  boxes[move].disabled = true;

  checkWinner();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return;

    box.innerText = "O";
    box.style.color = "#00e6e6"; // cyan
    box.style.textShadow = "0 0 10px #00e6e6";
    box.disabled = true;

    checkWinner();

    // stop if game finished
    if (!msgContainer.classList.contains("hide")) return;

    setTimeout(computerMove, 100);
  });
});

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const showWinner = (winner) => {
  document.body.classList.add("win-active");
  msg.innerText = `congratulations, winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1 = boxes[pattern[0]].innerText;
    let pos2 = boxes[pattern[1]].innerText;
    let pos3 = boxes[pattern[2]].innerText;

    if (pos1 != "" && pos2 != "" && pos3 != "") {
      if (pos1 === pos2 && pos2 === pos3) {
        console.log("winner", pos1);
        showWinner(pos1);
      }
    }
  }
};

newgameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
