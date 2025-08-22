# NOKIA-SNAKE-GAME
Nokia Snake (Retro LCD Style)

A tiny, dependency-free Snake game that mimics a retro Nokia LCD vibe.
Built with HTML + CSS + Canvas (vanilla JS). High score is saved in localStorage.

<!-- optional: add your own screenshot -->

✨ Features

Retro LCD look (scanlines, pixel font feel)

Smooth canvas rendering

Keyboard and on-screen D-Pad

Dynamic speed (auto increases as you eat)

Manual speed control buttons

Persistent high score via localStorage

Pixel-styled in-game “GAME OVER” text

🔧 Tech

No frameworks, just HTML/CSS/JS

Canvas-based rendering

Single, simple grid logic

🕹 Controls

Keyboard:

Arrow keys / WASD – move

Space – Pause / Resume

Enter – Restart

On-screen:

D-Pad buttons for movement

⏸️ / ▶️ Pause

⟳ Restart

− Speed / + Speed (adjust tick interval)

🚀 Getting Started
# clone
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# open the game
# Option 1: just open index.html in your browser
# Option 2: run a tiny static server (recommended for some browsers)
# Python 3
python -m http.server 8000
# then visit http://localhost:8000

📁 Project Structure
.
├── index.html     # markup & buttons
├── style.css      # retro LCD styling
└── script.js      # game logic (canvas, snake, food, input)

⚙️ Gameplay & Speed

Grid size: 21 × 21

Base tick: 160ms (shown as 1.0× in HUD)

Eating food:

+10 points

Slightly faster each time (down to ~70ms min)

Manual speed:

+ Speed → faster (to 40ms floor)

− Speed → slower (to 260ms ceiling)

Speed label shows a multiplier: multiplier = 160 / currentTickMs (min displayed is 0.5×).

🎨 Customization
Change Food Color (CSS variable)

Add a --food variable and use it in drawCell for food:

style.css

:root{
  --bg:#0b1d10; --lcd:#0f2a17; --pixel:#9be37a; --dim:#4c8f62;
  --bezel:#0a0f0c; --accent:#aef3a3;
  --food:#ff4444; /* Food color */
}


script.js
Replace food fill color line in drawCell:

function drawCell(x, y, isFood = false, isHead = false){
  const px = x*CELL, py = y*CELL, pad = 2;
  const foodColor = getCssVar('--food') || getCssVar('--accent');
  ctx.fillStyle = isFood ? foodColor : getCssVar('--pixel');
  ctx.fillRect(px+pad, py+pad, CELL-pad*2, CELL-pad*2);
  // ...rest is unchanged
}

Random Food Color (optional)

If you want a new color each time food spawns:

const FOOD_COLORS = ['#ff4444','#44ff44','#4444ff','#ffff44','#ff44ff','#44ffff'];

function randomFoodColor(){
  const c = FOOD_COLORS[Math.floor(Math.random()*FOOD_COLORS.length)];
  document.documentElement.style.setProperty('--food', c);
}

function placeFood(){
  do{
    food = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) };
  } while (snake.some(s => s.x===food.x && s.y===food.y));
  randomFoodColor(); // add this line
}

💾 High Score

Stored under key: nokia_snake_high

Auto-updates when your score beats the record

🛠 How It Works (Quick Overview)

Grid: 21×21, cell size derived from canvas.width / COLS

Snake: Array of segments ({x,y}), head is snake[0]

Movement: setInterval(step, tickMs); direction buffered in nextDir

Collisions: Walls or self → gameOver()

Food: Random empty cell; on eat → grow, score +10, speed up

Render: draw() clears LCD, draws food then snake cells with pixel lines

🗺 Roadmap / Ideas

Walls / wrap-around mode toggle

Multiple food types (bonus, poison)

Touch swipe controls (mobile)

Sound effects (clicky beeps)

Themes (amber/green/gray LCDs)
🧾 License

MIT © Ajay Ingle
