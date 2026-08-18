import { Chess } from 'chess.js';

const V = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST_MG = {
  p: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
  n: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
  b: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,10,10,10,10,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
  r: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
  q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
  k: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20]
};

const PST_EG_K = [-50,-40,-30,-20,-20,-30,-40,-50, -30,-20,-10,0,0,-10,-20,-30, -30,-10,20,30,30,20,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,20,30,30,20,-10,-30, -30,-30,0,0,0,0,-30,-30, -50,-30,-30,-30,-30,-30,-30,-50];

function countMaterial(chess) {
  let total = 0;
  const board = chess.board();
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (p && p.type !== 'k') total += V[p.type];
    }
  return total;
}

function evaluate(chess) {
  const board = chess.board();
  let mgScore = 0, egScore = 0, wBishops = 0, bBishops = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const type = piece.type;
      const color = piece.color;
      const idx = r * 8 + f;
      const pstIdx = color === 'w' ? idx : (7 - r) * 8 + f;
      const sign = color === 'w' ? 1 : -1;
      mgScore += sign * (V[type] + PST_MG[type][pstIdx]);
      let egVal = V[type];
      if (type === 'k') egVal += PST_EG_K[pstIdx];
      else egVal += PST_MG[type][pstIdx];
      egScore += sign * egVal;
      if (type === 'b') { if (color === 'w') wBishops++; else bBishops++; }
    }
  }
  if (wBishops >= 2) { mgScore += 30; egScore += 50; }
  if (bBishops >= 2) { mgScore -= 30; egScore -= 50; }
  const matTotal = countMaterial(chess);
  const phase = Math.min(matTotal / 6200, 1);
  return Math.round(mgScore * phase + egScore * (1 - phase));
}

const MVV = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 10 };
function orderMoves(moves) {
  return moves.map(m => {
    let s = 0;
    if (m.captured) s += 10 * MVV[m.captured] - MVV[m.piece];
    if (m.promotion) s += MVV[m.promotion] * 10;
    if (m.san && m.san.includes('+')) s += 2;
    return { m, s };
  }).sort((a, b) => b.s - a.s).map(x => x.m);
}

function quiescence(chess, alpha, beta, color, depth) {
  const standPat = evaluate(chess) * color;
  if (depth <= 0) return standPat;
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;
  const captures = chess.moves({ verbose: true }).filter(m => m.captured || m.promotion);
  const ordered = orderMoves(captures);
  for (const move of ordered) {
    chess.move(move);
    const score = -quiescence(chess, -beta, -alpha, -color, depth - 1);
    chess.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function alphaBeta(chess, depth, alpha, beta, color, useQ) {
  if (depth === 0) return useQ ? quiescence(chess, alpha, beta, color, 4) : evaluate(chess) * color;
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) {
    if (chess.isCheckmate()) return -99999 - depth;
    if (chess.isDraw() || chess.isStalemate()) return 0;
    return 0;
  }
  const ordered = depth >= 2 ? orderMoves(moves) : moves;
  let bestScore = -Infinity;
  for (const move of ordered) {
    chess.move(move);
    const score = -alphaBeta(chess, depth - 1, -beta, -alpha, -color, useQ);
    chess.undo();
    if (score > bestScore) bestScore = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return bestScore;
}

function iterativeDeepening(chess, maxDepth, timeLimit, color) {
  let bestMove = null, bestScore = -Infinity;
  const start = Date.now();
  for (let d = 1; d <= maxDepth; d++) {
    const moves = orderMoves(chess.moves({ verbose: true }));
    let iterationBest = null, iterationScore = -Infinity;
    for (const move of moves) {
      if (Date.now() - start > timeLimit * 0.8) break;
      chess.move(move);
      const score = -alphaBeta(chess, d - 1, -Infinity, Infinity, -color, true);
      chess.undo();
      if (score > iterationScore) { iterationScore = score; iterationBest = move; }
    }
    if (iterationBest && Date.now() - start <= timeLimit) { bestMove = iterationBest; bestScore = iterationScore; }
    if (Date.now() - start > timeLimit) break;
  }
  return bestMove;
}

const LEVELS = {
  600:  { depth: 1, noise: 250, blunder: 0.25, quiescence: false, iterDeep: false, time: 100 },
  1200: { depth: 2, noise: 80,  blunder: 0.05, quiescence: false, iterDeep: false, time: 200 },
  1300: { depth: 3, noise: 30,  blunder: 0.02, quiescence: true,  iterDeep: false, time: 500 },
  1500: { depth: 6, noise: 0,   blunder: 0.0,  quiescence: true,  iterDeep: true,  time: 1500 }
};

function getBestMove(fen, level = 1500) {
  const chess = new Chess(fen);
  const cfg = LEVELS[level] || LEVELS[1500];
  const color = chess.turn() === 'w' ? 1 : -1;
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0].san;
  if (Math.random() < cfg.blunder) return moves[Math.floor(Math.random() * moves.length)].san;
  if (cfg.iterDeep) {
    const best = iterativeDeepening(chess, cfg.depth, cfg.time, color);
    if (best) return best.san;
  }
  let bestMove = moves[0], bestScore = -Infinity;
  const noise = () => cfg.noise > 0 ? (Math.random() - 0.5) * 2 * cfg.noise : 0;
  const ordered = cfg.depth >= 2 ? orderMoves(moves) : moves;
  for (const move of ordered) {
    chess.move(move);
    let score = -alphaBeta(chess, cfg.depth - 1, -Infinity, Infinity, -color, cfg.quiescence);
    chess.undo();
    score += noise();
    if (score > bestScore) { bestScore = score; bestMove = move; }
  }
  return bestMove.san;
}

self.onmessage = function (e) {
  const { fen, level } = e.data;
  try {
    const move = getBestMove(fen, level);
    self.postMessage({ move, error: null });
  } catch (err) {
    self.postMessage({ move: null, error: err.message });
  }
};
