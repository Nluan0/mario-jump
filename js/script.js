const mario    = document.querySelector('.mario');
const pipe     = document.querySelector('.pipe');
const gameOver = document.getElementById('game-over');
const scoreEl  = document.getElementById('score');

let score     = 0;
let scoreTimer = null;
let pipeSpeed = 2.8;
let running    = true;

// ---------- Inicia velocidade do cano ----------
function setPipeSpeed() {
  pipe.style.animationDuration = pipeSpeed + 's';
}

setPipeSpeed();

// ---------- Pulo ----------
function jump() {
  if (!running) return;
  if (mario.classList.contains('jump')) return;
  mario.classList.add('jump');
  setTimeout(() => mario.classList.remove('jump'), 600);
}

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);  // suporte mobile

// ---------- Score ----------
function startScore() {
  scoreTimer = setInterval(() => {
    if (!running) return;
    score++;
    scoreEl.textContent = score;

    // Aumenta velocidade a cada 10 pontos
    if (score % 10 === 0 && pipeSpeed > 0.6) {
      pipeSpeed = Math.max(0.6, pipeSpeed - 0.1);
      setPipeSpeed();
    }
  }, 200);
}

startScore();

// ---------- Colisão ----------
function checkCollision() {
  if (!running) return;

  const marioRect = mario.getBoundingClientRect();
  const pipeRect  = pipe.getBoundingClientRect();

  const hit =
    marioRect.right  - 15 > pipeRect.left  &&
    marioRect.left   + 15 < pipeRect.right &&
    marioRect.bottom - 10 > pipeRect.top   &&
    marioRect.top         < pipeRect.bottom;

  if (hit) {
    running = false;
    clearInterval(scoreTimer);
    pipe.style.animationPlayState  = 'paused';
    mario.style.animationPlayState = 'paused';
    gameOver.style.display = 'block';
    document.addEventListener('keydown', restart);
    document.addEventListener('touchstart', restart);
    return; // para o loop
  }

  requestAnimationFrame(checkCollision);
}

requestAnimationFrame(checkCollision);

// ---------- Restart ----------
function restart() {
  document.removeEventListener('keydown', restart);
  document.removeEventListener('touchstart', restart);

  score     = 0;
  pipeSpeed = 1.8;
  running   = true;
  scoreEl.textContent = '0';

  gameOver.style.display = 'none';
  pipe.style.animationPlayState  = 'running';
  mario.style.animationPlayState = 'running';
  setPipeSpeed();
  startScore();
}
