(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highEl = document.getElementById('high');
  const spdEl = document.getElementById('spd');

  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const btnUp = document.getElementById('up');
  const btnDown = document.getElementById('down');
  const btnLeft = document.getElementById('left');
  const btnRight = document.getElementById('right');
  const startBtn = document.getElementById('startBtn'); // ADD START BUTTON

  const COLS = 21, ROWS = 21;
  const CELL = Math.floor(canvas.width / COLS);
  canvas.height = CELL * ROWS;

  const DIRS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1],
    ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  const MIN_MS = 40, MAX_MS = 260, BASE_SPEED = 160;
  let snake, dir, nextDir, food, score, high, running, tickMs, ticker;

  function reset() {
    snake = [
      { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
      { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0; updateScore();
    high = Number(localStorage.getItem('nokia_snake_high') || 0) || 0;
    highEl.textContent = high;
    running = false;
    tickMs = BASE_SPEED;
    spdEl.textContent = toSpeedPercent(tickMs) + '%';
    placeFood();
    stopLoop();
    draw();
  }

  function toSpeedPercent(ms) {
    let percent = ((MAX_MS - ms) / (MAX_MS - MIN_MS)) * 100;
    return Math.round(Math.max(1, Math.min(100, percent)));
  }

  function startLoop() {
    stopLoop();
    ticker = setInterval(step, tickMs);
  }
  function stopLoop() {
    if (ticker) clearInterval(ticker);
  }

  function updateScore() { scoreEl.textContent = score; }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  function step() {
    if (!running) return;

    if ((nextDir.x !== -dir.x) || (nextDir.y !== -dir.y)) {
      dir = nextDir;
    }

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) return gameOver();
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) return gameOver();

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10; updateScore();
      if (score > high) {
        high = score;
        highEl.textContent = high;
        localStorage.setItem('nokia_snake_high', high);
      }
      if (tickMs > MIN_MS + 30) {
        tickMs -= 6;
        startLoop();
        spdEl.textContent = toSpeedPercent(tickMs) + '%';
      }
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function gameOver() {
    running = false; stopLoop();
    draw();
    ctx.fillStyle = 'rgba(11,29,16,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pixelText('GAME OVER', 3, Math.floor(COLS / 2) - 4, Math.floor(ROWS / 2) - 2);
    pixelText('ENTER=RESTART', 1, Math.floor(COLS / 2) - 6, Math.floor(ROWS / 2) + 2);
  }

  function clear() {
    ctx.fillStyle = getCssVar('--lcd');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.08; ctx.fillStyle = '#000000';
    for (let y = 0; y < canvas.height; y += 3) { ctx.fillRect(0, y, canvas.width, 1); }
    ctx.globalAlpha = 1;
  }

  function draw() {
    clear();
    drawCell(food.x, food.y, true);
    for (let i = 0; i < snake.length; i++) {
      const seg = snake[i];
      drawCell(seg.x, seg.y, false, i === 0);
    }
  }

  function drawCell(x, y, isFood = false, isHead = false) {
    const px = x * CELL, py = y * CELL, pad = 2;
    ctx.fillStyle = isFood ? getCssVar('--accent') : getCssVar('--pixel');
    ctx.fillRect(px + pad, py + pad, CELL - pad * 2, CELL - pad * 2);
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#000000';
    for (let i = px + pad; i < px + CELL - pad; i += 4) { ctx.fillRect(i, py + pad, 1, CELL - pad * 2); }
    for (let j = py + pad; j < py + CELL - pad; j += 4) { ctx.fillRect(px + pad, j, CELL - pad * 2, 1); }
    ctx.globalAlpha = 1;
    if (isHead) {
      ctx.fillStyle = getCssVar('--bg');
      ctx.fillRect(px + pad + 2, py + pad + 3, 2, 2);
      ctx.fillRect(px + CELL - pad - 4, py + pad + 3, 2, 2);
    }
  }

  function pixelText(text, scale, gridX, gridY) {
    const glyphs = {
      'A': [0x1E, 0x05, 0x05, 0x1E], 'E': [0x1F, 0x15, 0x15, 0x11], 'G': [0x0E, 0x11, 0x15, 0x1D],
      'M': [0x1F, 0x02, 0x04, 0x02, 0x1F], 'O': [0x0E, 0x11, 0x11, 0x0E], 'R': [0x1F, 0x05, 0x0D, 0x12],
      'V': [0x1C, 0x02, 0x01, 0x02, 0x1C], 'P': [0x1F, 0x05, 0x05, 0x02], 'S': [0x12, 0x15, 0x15, 0x09],
      'N': [0x1F, 0x04, 0x02, 0x01, 0x1F], 'T': [0x01, 0x01, 0x1F, 0x01, 0x01], 'D': [0x1F, 0x11, 0x0A, 0x04],
      'I': [0x11, 0x11, 0x1F, 0x11, 0x11], 'U': [0x1F, 0x10, 0x10, 0x1F], 'L': [0x1F, 0x10, 0x10, 0x10],
      'B': [0x1F, 0x15, 0x15, 0x0A], 'C': [0x0E, 0x11, 0x11, 0x0A], 'K': [0x1F, 0x04, 0x0A, 0x11],
      '0': [0x0E, 0x11, 0x11, 0x0E], '1': [0x00, 0x12, 0x1F, 0x10], '2': [0x19, 0x15, 0x15, 0x12],
      '3': [0x11, 0x15, 0x15, 0x0A], '4': [0x07, 0x04, 0x04, 0x1F], '5': [0x17, 0x15, 0x15, 0x09],
      '6': [0x1E, 0x15, 0x15, 0x1D], '7': [0x01, 0x01, 0x1D, 0x03], '8': [0x0A, 0x15, 0x15, 0x0A],
      '9': [0x13, 0x15, 0x15, 0x0E], '-': [0x04, 0x04, 0x04], ' ': []
    };
    let x = gridX * CELL + 2, y = gridY * CELL + 2;
    for (const ch of text) {
      const g = glyphs[ch] || glyphs[' '];
      let col = 0;
      for (const row of g) {
        for (let bit = 0; bit < 5; bit++) {
          if (row & (1 << (4 - bit))) {
            ctx.fillStyle = getCssVar('--pixel');
            ctx.fillRect(x + bit * scale, y + col * scale, scale, scale);
          }
        }
        col++;
      }
      x += (6 * scale);
    }
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setDir(dx, dy) { nextDir = { x: dx, y: dy }; }

  window.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === ' ') { togglePause(); return; }
    if (k === 'Enter') { reset(); running = true; startLoop(); return; }
    if (DIRS[k]) {
      const [dx, dy] = DIRS[k];
      setDir(dx, dy);
      e.preventDefault();
    }
  }, { passive: false });

  pauseBtn.addEventListener('click', togglePause);
  restartBtn.addEventListener('click', () => { reset(); running = true; startLoop(); });
  btnUp.addEventListener('click', () => setDir(0, -1));
  btnDown.addEventListener('click', () => setDir(0, 1));
  btnLeft.addEventListener('click', () => setDir(-1, 0));
  btnRight.addEventListener('click', () => setDir(1, 0));

  document.getElementById('fasterBtn').addEventListener('click', () => {
    if (tickMs > MIN_MS) {
      tickMs -= 10; startLoop();
      spdEl.textContent = toSpeedPercent(tickMs) + '%';
    }
  });
  document.getElementById('slowerBtn').addEventListener('click', () => {
    if (tickMs < MAX_MS) {
      tickMs += 10; startLoop();
      spdEl.textContent = toSpeedPercent(tickMs) + '%';
    }
  });

  startBtn.addEventListener('click', () => { running = true; startLoop(); }); // Start button runs game

  function togglePause() {
    running = !running;
    if (running) startLoop();
    else stopLoop();
  }

  reset();
})();
