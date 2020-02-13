import { SVG } from '@svgdotjs/svg.js'
import Engine from './enginegame'
import Chess from 'chess.js'


var board = document.getElementsByTagName('cg-board')[0];
var boardSize = board.getBoundingClientRect();
var draw = SVG().addTo('body')
  .size(boardSize.width, boardSize.height)
  .addClass('cf-draw-area')
  .attr({
    'pointer-events': 'none'
  });

let container = document.getElementsByTagName('cg-container')[0];

var area = document.getElementsByClassName('cf-draw-area')[0];
area.style.left = parseInt(boardSize.x) + 'px';
area.style.top = parseInt(boardSize.y) + 'px';

var cellSize = boardSize.height / 8;
console.log(draw.style.left, draw.style.top);
console.log(boardSize.left, boardSize.top);

// letter to pixels
function l2p(letter) {
  return ((letter.charCodeAt(0) - 'a'.charCodeAt(0)) + 0.5) * cellSize;
}

// number to pixels
function n2p(number) {
  return (number - 0.5) * cellSize;
}

function getMovesList() {
  let divMoves = document.querySelector('div.moves');
  let  moves = Array.from(divMoves.querySelectorAll('m2'));
  return moves.map(m => m.textContent);
}

function getGameFen() {
  // let initialFen = getInitialFen();
  let chess = new Chess();
  let movesList = getMovesList();
  for(let move of movesList) {
    chess.move(move);
  }
  return chess.fen();
}

function getInitialFen() {
  let scriptElems = document.getElementsByTagName('script');

  for (let i = 0; i < scriptElems.length; i++) {
    var stringData = scriptElems[i].text;
    var initRegex = /LichessRound\.boot\((.+)\)/gm;
    var match = initRegex.exec(stringData);
    if (match !== null) {
      var initData = JSON.parse(match[1]);
      // console.log('fen', initData.data.game.fen);
      return initData.data.game.fen;
    }
  }
  console.error('Initial FEN was not found');
  return null;
}

function drawLine(from, to) {
  draw.clear();
  let x1 = l2p(from[0]);
  let y1 = boardSize.height - n2p(from[1]);

  let x2 = l2p(to[0]);
  let y2 = boardSize.height - n2p(to[1]);

  let line = draw.line(x1, y1, x2, y2)
    .stroke({ color: '#f06', width: 9, linecap: 'round', opacity: 0.6});
  line.marker('end', 4, 4, function(add) {
    add.path('M0,0 V4 L3,2 Z').size(4, 4);
    this.fill({ color: '#f06', opacity: 0.6});
  });
}

const eng = new Engine(drawLine);

const showBestMove = function(engine) {
  let fen = getGameFen();
  if (fen !== null) {
    console.info('fen', fen);
    engine.moveHint(fen);
  }
};

const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  for(let mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.target.className === 'moves') {
      showBestMove(eng);
    }
    // console.log(mutation, mutation.target);
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document, config);
