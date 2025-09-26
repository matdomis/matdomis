const CELL_SIZE = 8;
const CELL_LIFE_PROBABILITY = 0.185;
const LIFE = 1;
const DEATH = 0;
const UPDATE_INTERVAL_MS = 100; // 100ms = 10 atualizações por segundo (para a lógica)

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
      // Atribui vida baseado na probabilidade
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

    // Verifica se o vizinho está dentro dos limites da grade
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

      // Regras do Jogo da Vida:

      // 1. Célula VIVA
      if (isAlive === LIFE) {
        if (lifeNeighbors === 2 || lifeNeighbors === 3) {
          newGrid[r][c] = LIFE; // Sobrevive
        } else {
          newGrid[r][c] = DEATH; // Morre por solidão (<2) ou superpopulação (>3)
        }
      }
      // 2. Célula MORTA
      else {
        if (lifeNeighbors === 3) {
          newGrid[r][c] = LIFE; // Revive
        } else {
          newGrid[r][c] = DEATH; // Continua morta
        }
      }
    }
  }

  grid = newGrid;
}

function drawGrid() {
  // Limpa o canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === LIFE) {
        ctx.fillStyle = "white"; // Cor da célula viva (como no seu código Python)
        // Desenha o quadrado
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function gameLoop(currentTime) {
  // Usa o timestamp para controlar a taxa de atualização da LÓGICA (não apenas do desenho)
  if (currentTime - lastUpdate >= UPDATE_INTERVAL_MS) {
    updateGrid(); // Atualiza o estado da grade
    lastUpdate = currentTime;
  }

  drawGrid(); // Sempre redesenha a grade na taxa de frames do navegador (normalmente 60 FPS)

  requestAnimationFrame(gameLoop);
}

setupCanvas();

window.addEventListener("resize", setupCanvas);

requestAnimationFrame(gameLoop);
