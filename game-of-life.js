const CELL_SIZE = 8;
const CELL_LIFE_PROBABILITY = 0.185;
const LIFE = 1;
const DEATH = 0;
const UPDATE_INTERVAL_MS = 120;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const canvas = document.getElementById("game-of-life-canvas");
const ctx = canvas.getContext("2d");

let grid = [];
let rows, cols;
let lastUpdate = 0;

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  rows = Math.floor(canvas.height / CELL_SIZE);
  cols = Math.floor(canvas.width / CELL_SIZE);

  if (
    grid.length === 0 ||
    grid.length !== rows ||
    (grid.length > 0 && grid[0].length !== cols)
  ) {
    initializeGrid();
  }
}

function initializeGrid() {
  grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const isAlive = Math.random() < CELL_LIFE_PROBABILITY ? LIFE : DEATH;
      row.push(isAlive);
    }
    grid.push(row);
  }
}

function countLifeNeighbors(r, c) {
  let liveCount = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      if (grid[nr][nc] === LIFE) {
        liveCount++;
      }
    }
  }
  return liveCount;
}

function updateGrid() {
  const newGrid = Array.from({ length: rows }, () => Array(cols).fill(DEATH));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isAlive = grid[r][c];
      const lifeNeighbors = countLifeNeighbors(r, c);

      if (isAlive === LIFE) {
        if (lifeNeighbors === 2 || lifeNeighbors === 3) {
          newGrid[r][c] = LIFE;
        } else {
          newGrid[r][c] = DEATH;
        }
      }
      else {
        if (lifeNeighbors === 3) {
          newGrid[r][c] = LIFE;
        } else {
          newGrid[r][c] = DEATH;
        }
      }
    }
  }

  grid = newGrid;
}

function drawGrid() {
  ctx.fillStyle = "#020806";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === LIFE) {
        ctx.fillStyle = "#45ff72";
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function gameLoop(currentTime) {
  if (currentTime - lastUpdate >= UPDATE_INTERVAL_MS) {
    updateGrid();
    drawGrid();
    lastUpdate = currentTime;
  }

  requestAnimationFrame(gameLoop);
}

setupCanvas();
drawGrid();

window.addEventListener("resize", () => {
  setupCanvas();
  drawGrid();
});

if (!reduceMotion) {
  requestAnimationFrame(gameLoop);
}
