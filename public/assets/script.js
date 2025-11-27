// Código do jogo do dinossauro inspirado no jogo offline do Chrome.
const gameContainer = document.getElementById('game-container');

// Criando o jogo usando o canvas
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 300;
gameContainer.appendChild(canvas);

const ctx = canvas.getContext('2d');

// Variáveis do jogo
let dino = {
    x: 50,
    y: 200,
    width: 20,
    height: 30,
    velocityY: 0,
    jumpHeight: -15
};

let ground = {
    x: 0,
    y: 270,
    width: canvas.width,
    height: 30
};

let obstacles = [];
let isJumping = false;

// Função que desenha o dinossauro, chão e obstáculos
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhando o dinossauro
    ctx.fillStyle = '#ffdd00';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Desenhando o chão
    ctx.fillStyle = '#4e4e4e';
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    // Desenhando obstáculos
    ctx.fillStyle = '#555';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Atualizando a física do pulo
    if (dino.y < ground.y - dino.height && !isJumping) {
        dino.velocityY += 1; // Gravidade
        dino.y += dino.velocityY;
    } else {
        dino.y = ground.y - dino.height;
        dino.velocityY = 0;
        isJumping = false;
    }

    // Movendo os obstáculos
    obstacles.forEach(obstacle => {
        obstacle.x -= 5;
    });

    // Remover obstáculos fora da tela
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Detecção de colisão
    obstacles.forEach(obstacle => {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y + dino.height > obstacle.y
        ) {
            alert('Game Over');
            resetGame();
        }
    });

    requestAnimationFrame(draw);
}

// Função para pular
function jump() {
    if (!isJumping) {
        dino.velocityY = dino.jumpHeight;
        isJumping = true;
    }
}

// Gerando obstáculos
function generateObstacle() {
    const height = Math.random() * (200 - 50) + 50;
    const width = 20 + Math.random() * 30;
    const obstacle = {
        x: canvas.width,
        y: ground.y - height,
        width: width,
        height: height
    };
    obstacles.push(obstacle);
}

// Resetando o jogo
function resetGame() {
    dino.y = 200;
    dino.velocityY = 0;
    obstacles = [];
    isJumping = false;
    draw();
}

// Controlando o pulo
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        jump();
    }
});

// Gerando obstáculos a cada 2 segundos
setInterval(generateObstacle, 2000);

// Iniciar o jogo
draw();
