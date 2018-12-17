// Import the WebAssembly memory at the top of the file.
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Universe, Cell } from 'wasm-game-of-life';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#000000';
const ALIVE_COLOR = '#FFFFFF';

// const universe = Universe.new(128, 128);
const universe = Universe.new_with_ship(128, 128);
const universeWidth = universe.width();
const universeHeight = universe.height();

const canvas = document.getElementById('game-of-life-canvas');
canvas.height = (CELL_SIZE + 1) * universeHeight + 1;
canvas.width = (CELL_SIZE + 1) * universeWidth + 1;

const getIndex =(row, column) => row * universeWidth + column;

const drawGrid = (width, height) => {
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const drawCells = (width, height) => {
  const ctx = canvas.getContext('2d');
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead
        ? DEAD_COLOR
        : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const toggleLoopButton = document.getElementById('toggle-loop');
let LOOP_IS_ON = false;
const toggleLoop = () => {
  LOOP_IS_ON = !LOOP_IS_ON;
  toggleLoopButton.textContent = LOOP_IS_ON ? 'Stop game' : 'Resume game';
  if (LOOP_IS_ON) {
    renderLoop();
  }
};

toggleLoopButton.addEventListener('click', toggleLoop);

const renderGame = (width, height) => {
  drawGrid(width, height);
  drawCells(width, height);
};

const renderLoop = () => {
  renderGame(universeWidth, universeHeight);

  if (LOOP_IS_ON) {
    universe.tick();
    requestAnimationFrame(renderLoop);
  }
};

const initializeGame = () => {
  toggleLoopButton.textContent = 'Start game';
  drawGrid(universeWidth, universeHeight);
};

initializeGame();
