import { Chess } from 'chess.js';

const chess = new Chess();
let selectedSquare = null;
let legalMoves = [];
let playerColor = 'w';
let boardFlipped = false;
let currentLevel = 1300;
let moveHistory = [];

const PIECES_SVG = {
  'w': {
    k: '<svg class="piece white" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-1-9-1-5 2-8 2-5-2-8-2-4-1-9-1c-3 6 6 10.5 6 10.5v7" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" fill="none"/></g></svg>',
    q: '<svg class="piece white" viewBox="0 0 45 45"><g fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>',
    r: '<svg class="piece white" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>',
    b: '<svg class="piece white" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>',
    n: '<svg class="piece white" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#000" stroke="#000"/><path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000" stroke="#000"/></g></svg>',
    p: '<svg class="piece white" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>'
  },
  'b': {
    k: '<svg class="piece black" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-1-9-1-5 2-8 2-5-2-8-2-4-1-9-1c-3 6 6 10.5 6 10.5v7" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>',
    q: '<svg class="piece black" viewBox="0 0 45 45"><g fill="#000" stroke="#000" stroke-width="1.5" stroke-linejoin="round"><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#fff"/><circle cx="6" cy="12" r="2"/><circle cx="22.5" cy="7.5" r="2"/><circle cx="39" cy="12" r="2"/><circle cx="14" cy="8.5" r="2"/><circle cx="31" cy="9" r="2"/></g></svg>',
    r: '<svg class="piece black" viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21m-19-4h17m-18-3h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>',
    b: '<svg class="piece black" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>',
    n: '<svg class="piece black" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#fff" stroke="#fff"/><path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/></g></svg>',
    p: '<svg class="piece black" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>'
  }
};

const engine = new Worker('./engine.js', { type: 'module' });

engine.onmessage = (e) => {
  const { move, error } = e.data;
  if (error) { console.error('Error del motor:', error); return; }
  if (move) {
    const moveInfo = chess.move(move);
    if (moveInfo) moveHistory.push(moveInfo.san);
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
    updateStatus();
    updateMoveHistory();
  }
};

function requestEngineMove() {
  document.getElementById('status').textContent = '🤔 Pensando...';
  engine.postMessage({ fen: chess.fen(), level: currentLevel });
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = document.createElement('div');
      const squareName = String.fromCharCode(97 + f) + (8 - r);
      sq.className = 'square ' + ((r + f) % 2 === 0 ? 'light' : 'dark');
      sq.dataset.square = squareName;
      if (selectedSquare === squareName) sq.classList.add('selected');
      if (legalMoves.some(m => m.to === squareName)) sq.classList.add('highlight');
      const piece = board[r][f];
      if (piece) sq.innerHTML = PIECES_SVG[piece.color][piece.type];
      sq.addEventListener('click', () => onSquareClick(squareName));
      boardEl.appendChild(sq);
    }
  }
}

function onSquareClick(square) {
  if (chess.turn() !== playerColor || chess.isGameOver()) return;
  const piece = chess.get(square);
  if (selectedSquare && legalMoves.some(m => m.to === square)) {
    const move = legalMoves.find(m => m.to === square);
    const moveInfo = chess.move(move);
    if (moveInfo) moveHistory.push(moveInfo.san);
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
    updateStatus();
    updateMoveHistory();
    if (!chess.isGameOver()) setTimeout(requestEngineMove, 300);
    return;
  }
  if (piece && piece.color === playerColor) {
    selectedSquare = square;
    legalMoves = chess.moves({ square, verbose: true });
    renderBoard();
  } else {
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
  }
}

function updateStatus() {
  const statusEl = document.getElementById('status');
  if (chess.isCheckmate()) {
    statusEl.textContent = chess.turn() === playerColor ? '😞 ¡Jaque mate! Perdiste.' : ' ¡Jaque mate! Ganaste.';
  } else if (chess.isDraw()) {
    statusEl.textContent = '🤝 Tablas';
  } else if (chess.isCheck()) {
    statusEl.textContent = '⚠️ ¡Jaque!';
  } else {
    statusEl.textContent = chess.turn() === playerColor ? 'Tu turno' : 'Turno del rival';
  }
}

function updateMoveHistory() {
  const counterEl = document.getElementById('move-counter');
  const historyEl = document.getElementById('move-history');
  counterEl.textContent = `Jugada: ${moveHistory.length}`;
  historyEl.innerHTML = '';
  for (let i = 0; i < moveHistory.length; i += 2) {
    const row = document.createElement('div');
    row.className = 'move-row';
    const num = document.createElement('span');
    num.className = 'move-number';
    num.textContent = `${Math.floor(i / 2) + 1}.`;
    const white = document.createElement('span');
    white.className = 'move-white';
    white.textContent = moveHistory[i];
    row.appendChild(num);
    row.appendChild(white);
    if (moveHistory[i + 1]) {
      const black = document.createElement('span');
      black.className = 'move-black';
      black.textContent = moveHistory[i + 1];
      row.appendChild(black);
    }
    historyEl.appendChild(row);
  }
  historyEl.scrollTop = historyEl.scrollHeight;
}

document.getElementById('level-select').addEventListener('change', (e) => {
  currentLevel = parseInt(e.target.value);
});

document.getElementById('new-game').addEventListener('click', () => {
  chess.reset();
  selectedSquare = null;
  legalMoves = [];
  moveHistory = [];

  // Lógica para elegir color
  const colorSelect = document.getElementById('color-select').value;
  if (colorSelect === 'random') {
    playerColor = Math.random() < 0.5 ? 'w' : 'b';
  } else {
    playerColor = colorSelect;
  }

  // Girar el tablero si jugamos con negras
  boardFlipped = playerColor === 'b';
  const boardEl = document.getElementById('board');
  if (boardFlipped) boardEl.classList.add('flipped');
  else boardEl.classList.remove('flipped');

  renderBoard();
  updateStatus();
  updateMoveHistory();

  // Si jugamos con negras, la IA (blancas) mueve primero
  if (playerColor === 'b') {
    setTimeout(requestEngineMove, 300);
  }
});

renderBoard();
updateStatus();
updateMoveHistory();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
