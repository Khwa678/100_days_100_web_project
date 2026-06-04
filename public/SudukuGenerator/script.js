const boardElement = document.getElementById("sudoku-board");
const difficultySelect = document.getElementById("difficulty");
const generateBtn = document.getElementById("generate");
const resetBtn = document.getElementById("reset");
const message = document.getElementById("message");

let puzzleBoard = [];
let originalBoard = [];
let solvedBoard = [];

let seconds = 0;
let timerInterval;

function startTimer() {
    clearInterval(timerInterval);

    seconds = 0;

    timerInterval = setInterval(() => {
        seconds++;

        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        document.getElementById("timer").textContent =
            `Time: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }, 1000);
}

function isValid(board, row, col, num) {

    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
        if (board[x][col] === num) return false;
    }

    let startRow = row - row % 3;
    let startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num)
                return false;
        }
    }

    return true;
}

function fillBoard(board) {

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                let nums = [1,2,3,4,5,6,7,8,9];

                nums.sort(() => Math.random() - 0.5);

                for (let num of nums) {

                    if (isValid(board, row, col, num)) {

                        board[row][col] = num;

                        if (fillBoard(board))
                            return true;

                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

function removeCells(board, difficulty) {

    let removeCount;

    if (difficulty === "Easy")
        removeCount = 30;
    else if (difficulty === "Medium")
        removeCount = 45;
    else
        removeCount = 55;

    while (removeCount > 0) {

        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removeCount--;
        }
    }
}

function renderBoard(board) {

    boardElement.innerHTML = "";

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const input = document.createElement("input");

            input.type = "number";
            input.min = 1;
            input.max = 9;

            input.classList.add("cell");

            if (board[row][col] !== 0) {

                input.value = board[row][col];
                input.disabled = true;

            } else {

                input.addEventListener("input", () => {

                    let value = parseInt(input.value);

                    if (value < 1 || value > 9) {
                        input.value = "";
                    }

                    checkWin();
                });
            }

            boardElement.appendChild(input);
        }
    }
}

function checkWin() {

    const cells = document.querySelectorAll(".cell");

    let index = 0;

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            let cell = cells[index];

            let value = cell.value === "" ? 0 : parseInt(cell.value);

            if (value !== solvedBoard[row][col])
                return;

            index++;
        }
    }

    clearInterval(timerInterval);
    message.textContent = "🎉 Congratulations! You solved the Sudoku!";
}

function generateSudoku() {

    message.textContent = "";

    let board = Array(9).fill().map(() => Array(9).fill(0));

    fillBoard(board);

    solvedBoard = board.map(row => [...row]);

    let puzzle = board.map(row => [...row]);

    removeCells(puzzle, difficultySelect.value);

    puzzleBoard = puzzle.map(row => [...row]);
    originalBoard = puzzle.map(row => [...row]);

    renderBoard(puzzleBoard);

    startTimer();
}

function resetPuzzle() {

    renderBoard(originalBoard);

    message.textContent = "";
}

generateBtn.addEventListener("click", generateSudoku);
resetBtn.addEventListener("click", resetPuzzle);

generateSudoku();