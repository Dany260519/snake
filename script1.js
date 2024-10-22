const boardGame = document.getElementById('boardGame');
const scoreElement = document.getElementById('score');
const start = document.getElementById('start');
const gameO = document.getElementById('gameO');
const reason = document.getElementById('reason');
const display = document.getElementById('display');

const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowLeft: -1,
    ArrowRight: 1,
};

let snake;
let newScore;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const createBoard = () => {
    boardGame.innerHTML = ''; // Limpiar el tablero
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    emptySquares = [];

    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}-${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.className = 'square emptySquare';
            squareElement.id = squareValue;
            boardGame.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
};

const drawSquare = (square, type) => {
    const [row, column] = square.split('-');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.className = `square ${type}`;

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        emptySquares = emptySquares.filter(sq => sq !== square);
    }
};

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

const createRandomFood = () => {
    const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomSquare, 'foodSquare');
};

const updateScore = () => {
    scoreElement.innerText = newScore;
};

const setGame = () => {
    snake = ['0-0', '0-1', '0-2'];
    newScore = snake.length;
    direction = 'ArrowRight';
    createBoard();
    drawSnake();
    updateScore();
    createRandomFood();
};

const moveSnake = () => {
    const head = snake[snake.length - 1];
    const [row, col] = head.split('-').map(Number);
    let newRow = row;
    let newCol = col;

    switch (direction) {
        case 'ArrowUp': newRow--; break;
        case 'ArrowDown': newRow++; break;
        case 'ArrowLeft': newCol--; break;
        case 'ArrowRight': newCol++; break;
    }

    const newSquare = `${newRow}-${newCol}`;

    if (
        newRow < 0 || newRow >= boardSize ||
        newCol < 0 || newCol >= boardSize ||
        boardSquares[newRow][newCol] === squareTypes.snakeSquare
    ) {
        endGame();
        return;
    }

    snake.push(newSquare);

    if (boardSquares[newRow][newCol] === squareTypes.foodSquare) {
        newScore++;
        updateScore();
        createRandomFood();
    } else {
        const tail = snake.shift();
        drawSquare(tail, 'emptySquare');
    }

    drawSnake();
};

const endGame = () => {
    gameO.style.display = 'block';
    display.style.display = 'none';
    reason.innerText = 'You lost!';
    clearInterval(moveInterval);
};

const startGame = () => {
    gameO.style.display = 'none';
    setGame();
    moveInterval = setInterval(moveSnake, gameSpeed);
};

start.addEventListener('click', startGame);

document.addEventListener('keydown', event => {
    if (directions[event.key]) {
        direction = event.key;
    }
});
