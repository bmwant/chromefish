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

var area = document.getElementsByClassName('cf-draw-area')[0];
area.style.left = parseInt(boardSize.x) + 'px';
area.style.top = parseInt(boardSize.y) + 'px';

var cellSize = boardSize.height / 8;

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

function getBoardOrientation() {
  let boardClasses = Array.from(document.querySelector('div.cg-wrap').classList);
  for(let className of boardClasses) {
    if(className.startsWith('orientation')) {
      return className.split('-')[1];
    }
  }
  console.error('Cannot find board orientation');
  return null;
}

function drawLine(from, to) {
  let orientation = getBoardOrientation();
  draw.clear();
  let x1 = l2p(from[0]);
  let y1 = n2p(from[1]);

  let x2 = l2p(to[0]);
  let y2 = n2p(to[1]);

  if(orientation === 'black') {
    x1 = boardSize.width - x1;
    x2 = boardSize.width - x2;
  } else if(orientation === 'white') {
    y1 = boardSize.height - y1;
    y2 = boardSize.height - y2;
  }

  const opacity = 0.4;
  let line = draw.line(x1, y1, x2, y2)
    .stroke({ color: '#f06', width: 9, linecap: 'round', opacity: opacity});
  line.marker('end', 4, 4, function(add) {
    add.path('M0,0 V4 L3,2 Z').size(4, 4);
    this.fill({ color: '#f06', opacity: opacity});
  });
}

const eng = new Engine(drawLine);

const showBestMove = function(engine) {
  let fen = getGameFen();
  if (fen !== null) {
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
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document, config);
