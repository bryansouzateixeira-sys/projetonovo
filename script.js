const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const gameArea = document.getElementById("gameArea");

// Configurações do Grid do Jogo
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Estado do Jogo
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1; // Velocidade X inicial (movendo para a direita)
let dy = 0; // Velocidade Y inicial
let score = 0;
let gameSpeed = 100; // Milissegundos por frame (menor = mais rápido)
let gameLoopTimeout;
let isGameOver = false;

// Inicialização do Jogo
function main() {
    if (hasGameEnded()) {
        isGameOver = true;
        drawGameOver();
        return;
    }

    gameLoopTimeout = setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, gameSpeed);
}

// Limpa a tela a cada frame
function clearCanvas() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha linhas sutis de grid de fundo
    ctx.strokeStyle = "#161616";
    for(let i=0; i<canvas.width; i+=gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// Desenha a cobrinha
function drawSnake() {
    snake.forEach((part, index) => {
        // Cabeça é verde escura, o corpo é verde claro degradê
        ctx.fillStyle = index === 0 ? "#2E7D32" : `hsl(120, 100%, ${40 + (index * 2) % 30}%)`;
        ctx.strokeStyle = "#111";
        
        // Desenha os blocos arredondados
        ctx.beginPath();
        ctx.roundRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1, index === 0 ? 6 : 4);
        ctx.fill();
        ctx.stroke();
    });
}

// Move a cobrinha e verifica se comeu a fruta
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.innerText = score;
        generateFood();
        // Aumenta a velocidade ligeiramente a cada fruta coletada
        if (gameSpeed > 50) gameSpeed -= 2; 
    } else {
        snake.pop();
    }
}

// Desenha a bolinha (comida) com um efeito brilhante
function drawFood() {
    ctx.fillStyle = "#FF5252";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF5252";
    ctx.beginPath();
    let radius = (gridSize / 2) - 1;
    ctx.arc((food.x * gridSize) + radius + 1, (food.y * gridSize) + radius + 1, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0; // Reseta o efeito de sombra para a cobra não brilhar
}

// Gera comida em uma posição aleatória vazia
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Garante que a comida não nasça em cima da cobra
    snake.forEach(part => {
        const hasEaten = part.x === food.x && part.y === food.y;
        if (hasEaten) generateFood();
    });
}

// Lógica de colisão
function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= tileCount;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= tileCount;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

// Tela de Game Over
function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Fim de Jogo!", canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.fillStyle = "#aaa";
    ctx.font = "16px Arial";
    ctx.fillText("Pressione ESPAÇO ou Toque para reiniciar", canvas.width / 2, canvas.height / 2 + 30);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 1;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    scoreElement.innerText = score;
    isGameOver = false;
    clearTimeout(gameLoopTimeout);
    main();
}

// --- CONTROLES (Teclado) ---
window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key.toLowerCase();
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (isGameOver && event.key === " ") {
        resetGame();
        return;
    }

    if ((keyPressed === 'arrowleft' || keyPressed === 'a') && !goingRight) {
        dx = -1; dy = 0;
    }
    if ((keyPressed === 'arrowup' || keyPressed === 'w') && !goingDown) {
        dx = 0; dy = -1;
    }
    if ((keyPressed === 'arrowright' || keyPressed === 'd') && !goingLeft) {
        dx = 1; dy = 0;
    }
    if ((keyPressed === 'arrowdown' || keyPressed === 's') && !goingUp) {
        dx = 0; dy = 1;
    }
}

// --- CONTROLES (Touch / Deslizar no Celular) ---
let touchstartX = 0;
let touchstartY = 0;

window.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches.screenX;
    touchstartY = e.changedTouches.screenY;
    if(isGameOver) resetGame();
}, false);

window.addEventListener('touchend', e => {
    let touchendX = e.changedTouches.screenX;
    let touchendY = e.changedTouches.screenY;
    handleSwipe(touchstartX, touchstartY, touchendX, touchendY);
}, false);

function handleSwipe(x1, y1, x2, y2) {
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dx !== -1) { dx = 1; dy = 0; } // Direita
        else if (diffX < 0 && dx !== 1) { dx = -1; dy = 0; } // Esquerda
    } else {
        if (diffY > 0 && dy !== -1) { dx = 0; dy = 1; } // Baixo
        else if (diffY < 0 && dy !== 1) { dx = 0; dy = -1; } // Cima
    }
}

// --- SISTEMA DE FULLSCREEN ---
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        gameArea.requestFullscreen().catch(err => {
            alert(`Erro ao ativar tela cheia: ${err.message}`);
        });
        fullscreenBtn.innerText = "❌ Sair de Tela Cheia";
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerText = "📺 Tela Cheia";
    }
});

// Detecta se o usuário saiu do modo tela cheia usando a tecla ESC
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerText = "📺 Tela Cheia";
    }
});

// Inicia o jogo automaticamente
main();
