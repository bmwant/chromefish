import { SVG, adopt } from '@svgdotjs/svg.js'
import engineGame from './enginegame'


var board = document.getElementsByTagName('cg-board')[0];
var boardSize = board.getBoundingClientRect();
var draw = SVG().addTo('body')
  .size(boardSize.width, boardSize.height)
  .addClass('cf-draw-area')
  .attr({
    'pointer-events': 'none'
  });


let container = document.getElementsByTagName('cg-container')[0];
let svg = container.getElementsByTagName('svg')[0];
// console.log('This is our svg', container, svg);
// var draw = adopt(svg);
//
// console.log('This is our svg', draw);

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


function getFen() {
  let scriptElems = document.getElementsByTagName('script');

  for (let i = 0; i < scriptElems.length; i++) {
    var stringData = scriptElems[i].text;
    var initRegex = /LichessRound\.boot\((.+)\)/gm;
    var match = initRegex.exec(stringData);
    if (match !== null) {
      var initData = JSON.parse(match[1]);
      console.log('fen', initData.data.game.fen);
      return initData.data.game.fen;
    }
  }
  // scriptElems.forEach(function(s) {
  //   var stringData = s.text;
  //   var initRegex = /LichessRound\.boot\((.+)\)/gm;
  //   var match = initRegex.exec(stringData);
  //   if (match !== null) {
  //     var initData = JSON.parse(match[1]);
  //     console.log('fen', initData.data.game.fen);
  //     fen = initData.data.game.fen;
  //   }
  // });
  console.error('FEN was not found');
  return null;
}

function drawLine(from, to) {
  let x1 = l2p(from[0]);
  let y1 = n2p(from[1]);

  let x2 = l2p(to[0]);
  let y2 = n2p(to[1]);

  let line = draw.line(x1, y1, x2, y2)
    .stroke({ color: '#f06', width: 9, linecap: 'round', opacity: 0.6});
  line.marker('end', 4, 4, function(add) {
    add.path('M0,0 V4 L3,2 Z').size(4, 4);
    this.fill({ color: '#f06', opacity: 0.6});
  });
}


function showBestMove() {
  let fen = getFen();
  console.log('this is result', fen);
  let game = new engineGame();
  game.moveHint(fen);
}

// getFen();
drawLine('f6', 'd4');
// showBestMove();
