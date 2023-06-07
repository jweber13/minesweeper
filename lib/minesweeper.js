// const gameTable = document.querySelector("#gametable");
const tableBody = document.querySelector("#minesweeper");
const easyBtn = document.querySelector(".btn-success");
const medBtn = document.querySelector(".btn-warning");
const hardBtn = document.querySelector(".btn-danger");
const flaggedMines = [];
const minesInGame = [];

const checkWin = () => {
  if (flaggedMines.length !== minesInGame.length) {
    return false;
  }

  flaggedMines.sort((a, b) => a.row - b.row);
  minesInGame.sort((a, b) => a.row - b.row);

  for (let i = 0; i < flaggedMines.length; i += 1) {
    if (flaggedMines[i].row !== minesInGame[i].row || flaggedMines[i].col !== minesInGame[i].col) {
      return false;
    }
  }
  return true;
};

const gameOverTable = () => {
  const allCells = document.querySelectorAll("td");
  allCells.forEach((cell) => {
    cell.classList.remove("unopened");
    cell.classList.add("opened");
    if (cell.classList.contains("is-mine")) {
      cell.classList.add("mine");
    }
  });
};

const gameWinTable = () => {
  gameOverTable();
  alert("You Win");
};

const gameLoseTable = () => {
  gameOverTable();
  alert("You Lose");
};

const openCell = (cell) => {
  if (cell.classList.contains("unopened")) {
    cell.classList.remove("unopened");
    cell.classList.add("opened");
  }
};

const countAdjecentMines = (row, col, number) => {
  let numMines = 0;
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, number - 1); i += 1) {
    for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, number - 1); j += 1) {
      if (i !== row || j !== col) {
        if (tableBody.rows[i].cells[j].classList.contains("is-mine")) {
          numMines += 1;
        }
      }
    }
  }
  return numMines;
};

const floodFill = (rowIndex, cellIndex, number) => {
  const currentCell = tableBody.rows[rowIndex].cells[cellIndex];
  currentCell.classList.add("opened");

  for (let i = rowIndex - 1; i <= rowIndex + 1; i += 1) {
    for (let j = cellIndex - 1; j <= cellIndex + 1; j += 1) {
      // Check if the neighbor cell is inside the grid
      if (i >= 0 && i < number && j >= 0 && j < number) {
        const neighborCell = tableBody.rows[i].cells[j];

        // Check if the neighbor cell has not been visited and is not a mine
        if (!neighborCell.classList.contains("opened") && !neighborCell.classList.contains("is-mine")) {
          const numAdjecentMines = countAdjecentMines(i, j, number);
          if (numAdjecentMines === 0) {
            // Recursively call floodFill on the neighbor cell
            floodFill(i, j, number);
          } else {
            neighborCell.classList.add("opened");
            neighborCell.classList.add(`mine-neighbour-${numAdjecentMines}`);
          }
        }
      }
    }
  }
};

const checkCellStatus = (cell, number) => {
  // debugger;
  if (cell.classList.contains("opened") || cell.classList.contains("question") || cell.classList.contains("flagged")) {
    return;
  }

  const row = cell.parentNode;
  const rowIndex = row.rowIndex;
  const cellIndex = cell.cellIndex;

  // check if cell is a mine
  if (cell.classList.contains("is-mine")) {
    gameLoseTable();
    return;
  }
  const numAdjecentMines = countAdjecentMines(rowIndex, cellIndex, number);
  // debugger;
  if (numAdjecentMines > 0) {
    cell.classList.add("opened");
    cell.classList.add(`mine-neighbour-${numAdjecentMines}`);
  } else {
    floodFill(rowIndex, cellIndex, number);
  }
};

const generateMines = (number) => {
  const numberOfMines = Math.floor((number * number) * 0.2);
  const mineProbability = numberOfMines / (number * number);
  const mines = [];
  for (let i = 0; i < number * number; i += 1) {
    mines.push(Math.random() < mineProbability);
  }
  console.log(mines);
  return mines;
};

const markCell = (cell) => {
  const ifFlagged = { row: cell.parentNode.rowIndex, col: cell.cellIndex };

  if (!cell.classList.contains("flagged") && !cell.classList.contains("question")) {
    cell.classList.add("question");
  } else if (cell.classList.contains("question")) {
    cell.classList.remove("question");
    cell.classList.add("flagged");
    flaggedMines.push(ifFlagged);
  } else if (cell.classList.contains("flagged")) {
    cell.classList.remove("flagged");
    cell.classList.remove("question");
    const index = flaggedMines.findIndex(item => item.row === ifFlagged.row
      && item.col === ifFlagged.col);
    if (index !== -1) {
      flaggedMines.splice(index, 1);
    }
  }
  if (checkWin()) {
    gameWinTable();
  }
};

const createGameTable = (number) => {
  flaggedMines.length = 0;
  minesInGame.length = 0;
  tableBody.innerHTML = "";
  const mines = generateMines(number);
  let mineCount = 0;
  for (let i = 0; i < number; i += 1) {
    const tableRow = tableBody.insertRow();
    for (let j = 0; j < number; j += 1) {
      const cell = tableRow.insertCell();
      cell.classList.add("unopened");
      if (mines[mineCount]) {
        cell.classList.add("is-mine");
        minesInGame.push({ row: i, col: j });
      }
      mineCount += 1;
      cell.addEventListener("click", (event) => {
        const clickedElement = event.currentTarget;
        checkCellStatus(cell, number);
      });
      cell.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const clickedElement = event.currentTarget;
        markCell(clickedElement);
      });
    }
  }
};

easyBtn.addEventListener("click", () => {
  createGameTable(10);
});

medBtn.addEventListener("click", () => {
  createGameTable(15);
});

hardBtn.addEventListener("click", () => {
  createGameTable(20);
});

window.onload = () => {
  createGameTable(10);
};
