const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const sizeElement = 40;
const gameAreaSize = 600;
const startX = 100;
const lastX = startX + gameAreaSize;
const startY = 0;
const lastY = startY + gameAreaSize;

let player = {
    x: sizeElement * 7 + startX,
    y: sizeElement * 7 + startY
}

drawBackground();
drawPlayer();

function drawBackground() {
    // Draw Game Area
    ctx.beginPath();
    ctx.rect(startX, startY, gameAreaSize, gameAreaSize);
    ctx.stroke();

    // Draw background border
    // Top border
    ctx.fillRect(startX, startY, sizeElement * 6, sizeElement * 1);
    ctx.fillRect(lastX, startY, -sizeElement * 6, sizeElement * 1);

    // Bottom border
    ctx.fillRect(startX, lastY, sizeElement * 6, -sizeElement * 1);
    ctx.fillRect(lastX, lastY, -sizeElement * 6, -sizeElement * 1);

    // Left border
    ctx.fillRect(startX, startY, sizeElement * 1, sizeElement * 6);
    ctx.fillRect(startX, lastY, sizeElement * 1, -sizeElement * 6);

    // Right border
    ctx.fillRect(lastX, startY, -sizeElement * 1, sizeElement * 6);
    ctx.fillRect(lastX, lastY, -sizeElement * 1, -sizeElement * 6);
}

function drawPlayer() {
    ctx.fillStyle = "darkgreen";
    ctx.fillRect(player.x, player.y, sizeElement, sizeElement);
}

// Cuadrados de pruebas
// ctx.fillStyle = "#FF0000";
// ctx.fillRect(380, 0, 40, 40);

// ctx.fillStyle = "#FF0000";
// ctx.fillRect(100, 280, 40, 40);

// ctx.fillStyle = "#FF0000";
// ctx.fillRect(420, 600, -40, -40);

// ctx.fillStyle = "#FF0000";
// ctx.fillRect(700, 320, -40, -40);
