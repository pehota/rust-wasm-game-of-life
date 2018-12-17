// Import the WebAssembly memory at the top of the file.
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import {
  Universe,
  Cell,
  UniverseInit as UniverseInitType,
} from 'wasm-game-of-life';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#000000';
const ALIVE_COLOR = '#FFFFFF';

const GameModel = {
  universe: null,
  isPlayig: false,
  config: {
    initialState: UniverseInitType.Random,
    width: 128,
    height: 128,
  },
};

const canvas = document.getElementById('game-of-life-canvas');
const toggleLoopButton = document.getElementById('toggle-loop');
const initialStateSelector = document.getElementById('universe-state-selector');

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

const drawCells = (cellsPtr, width, height) => {
  const ctx = canvas.getContext('2d');
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = row * width + col;

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE,
      );
    }
  }

  ctx.stroke();
};

const renderGame = universe => {
  const [width, height] = [universe.width(), universe.height()];
  drawGrid(width, height);
  drawCells(universe.cells(), width, height);
};

const renderLoop = universe => {
  renderGame(universe);

  if (GameModel.isPlaying) {
    universe.tick();
    requestAnimationFrame(() => renderLoop(universe));
  }
};

const initializeGame = () => {
  const universeWidth = GameModel.config.width;
  const universeHeight = GameModel.config.height;
  canvas.height = (CELL_SIZE + 1) * universeHeight + 1;
  canvas.width = (CELL_SIZE + 1) * universeWidth + 1;
  drawGrid(universeWidth, universeHeight);
  toggleLoopButton.textContent = 'Start game';
};
const startGame = () => {
  const universeWidth = GameModel.config.width;
  const universeHeight = GameModel.config.height;
  const universe = (GameModel.universe =
    GameModel.config.initialState === UniverseInitType.Random
      ? Universe.new(universeWidth, universeHeight)
      : Universe.new_with_ship(universeWidth, universeHeight));

  initialStateSelector.disabled = true;
  toggleLoopButton.textContent = 'Stop game';
  GameModel.isPlaying = true;
  renderLoop(GameModel.universe);
};

const toggleLoop = () => {
  if (!GameModel.universe) {
    return startGame();
  }
  GameModel.isPlaying = !GameModel.isPlaying;
  toggleLoopButton.textContent = GameModel.isPlaying
    ? 'Stop game'
    : 'Resume game';
  if (GameModel.isPlaying) {
    renderLoop(GameModel.universe);
  }
};

toggleLoopButton.addEventListener('click', toggleLoop);

initialStateSelector.addEventListener('change', e => {
  switch (e.target.value) {
    case 'ship':
      GameModel.config.initialState = UniverseInitType.Ship;
      break;
    case 'random':
    default:
      GameModel.config.initialState = UniverseInitType.Random;
      break;
  }
});

initializeGame();
