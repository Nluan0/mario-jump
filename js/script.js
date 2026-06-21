const mario    = document.querySelector('.mario');
const pipe     = document.querySelector('.pipe');
const gameOver = document.getElementById('game-over');
const scoreEl  = document.getElementById('score');

let score      = 0;
let scoreTimer = null;
let pipeSpeed  = 2.8;
let running    = false;
let loopId     = null;

// ---------- Velocidade do cano ----------
function setPipeSpeed() {
  pipe.style.animationDuration = pipeSpeed + 's';
}

// ---------- Reinicia animação do cano do zero ----------
function resetPipe() {
  pipe.style.animation = 'none';
  pipe.offsetHeight; // força reflow
  pipe.style.animation = '';
  setPipeSpeed();
}

// ---------- Pulo ----------
function jump() {
  if (!running) return;
  if (mario.classList.contains('jump')) return;
  mario.classList.add('jump');
  setTimeout(() => mario.classList.remove('jump'), 600);
}

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);

// ---------- Score ----------
function startScore() {
  clearInterval(scoreTimer);
  scoreTimer = setInterval(() => {
    if (!running) return;
    score++;
    scoreEl.textContent = score;

    if (score % 10 === 0 && pipeSpeed > 0.8) {
      pipeSpeed = Math.max(0.8, pipeSpeed - 0.15);
      setPipeSpeed();
    }
  }, 200);
}

// ---------- Colisão ----------
function checkCollision() {
  if (!running) return;

  const marioRect = mario.getBoundingClientRect();
  const pipeRect  = pipe.getBoundingClientRect();

  const hit =
    marioRect.right  - 10 > pipeRect.left &&
    marioRect.left   + 10 < pipeRect.right &&
    marioRect.bottom - 5  > pipeRect.top &&
    marioRect.top         < pipeRect.bottom;

  if (hit) {
    running = false;
    clearInterval(scoreTimer);
    cancelAnimationFrame(loopId);
    pipe.style.animationPlayState  = 'paused';
    gameOver.style.display = 'block';
    document.addEventListener('keydown', restart);
    document.addEventListener('touchstart', restart);
    return;
  }

  loopId = requestAnimationFrame(checkCollision);
}

// ---------- Start ----------
function startGame() {
  running    = true;
  score      = 0;
  pipeSpeed  = 2.8;
  scoreEl.textContent = '0';

  // limpa estilos inline que possam ter sobrado
  mario.style.animationPlayState = '';
  pipe.style.animationPlayState  = '';
  mario.classList.remove('jump');

  gameOver.style.display = 'none';
  resetPipe();
  startScore();

  cancelAnimationFrame(loopId);
  loopId = requestAnimationFrame(checkCollision);
}

// ---------- Restart ----------
function restart() {
  document.removeEventListener('keydown', restart);
  document.removeEventListener('touchstart', restart);
  startGame();
}

// Inicia ao carregar
startGame();
