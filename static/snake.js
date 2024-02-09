// JavaScript code for a simple Snake game
// Define canvas, context, and game variables
let canvas = document.getElementById('snakeGame');
let context = canvas.getContext('2d');
const box = 32;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };
let direction = "right";
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    let key = event.keyCode;
    if (key == 37 && direction != "right") direction = "left";
    else if (key == 38 && direction != "down") direction = "up";
    else if (key == 39 && direction != "left") direction = "right";
    else if (key == 40 && direction != "up") direction = "down";
}

function draw() {
    context.fillStyle = "#dcdcdc";
    context.fillRect(0, 0, 608, 608);

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i == 0) ? "#4caf50" : "#8bc34a";
        context.fillRect(snake[i].x, snake[i].y, box, box);

        context.strokeStyle = "#dcdcdc";
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < box || snakeY < 3 * box || snakeX > 17 * box || snakeY > 17 * box || collision(newHead, snake)) {
        clearInterval(game);
        alert(`Game over. Your score: ${score}`);
        // Optionally, add logic to submit score or restart the game
    }

    snake.unshift(newHead);

    context.fillStyle = "white";
    context.font = "45px Changa one";
    context.fillText(score, 2 * box, 1.6 * box);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(draw, 100);
