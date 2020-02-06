import { SVG } from '@svgdotjs/svg.js'
import { Chess } from 'chess.js'


var board = document.getElementsByTagName('cg-board')[0];
var boardSize = board.getBoundingClientRect();
var draw = SVG().addTo('body')
  .size(boardSize.width, boardSize.height)
  .addClass('cf-draw-area');


var area = document.getElementsByClassName('cf-draw-area')[0];
area.style.left = parseInt(boardSize.x) + 'px';
area.style.top = parseInt(boardSize.y) + 'px';

var cellSize = boardSize.height / 8;
console.log(draw.style.left, draw.style.top);
console.log(boardSize.left, boardSize.top);

// letter to pixels
function l2p(letter) {
  return ('a'.charCodeAt(0) - letter.charCodeAt(0)) * cellSize;
}

// number to pixels
function n2p(number) {
  return (number-1) * cellSize;
}


function getFen() {
  var scriptElems = document.getElementsByTagName('script');
  scriptElems.forEach(function(s) {
    var stringData = s.text;
    var initRegex = /LichessRound\.boot\((.+)\)/gm;
    var match = initRegex.exec(stringData);
    if (match !== null) {
      console.log(match[1]);
      var initData = JSON.parse(match[1]);
      // console.log('fen', initData.data.game.fen);
      return initData.data.game.fen;
    }
  });
}

function drawLine(from, to) {
  let x1 = l2p(from[0]);
  let y1 = n2p(from[1]);

  let x2 = l2p(to[0]);
  let y2 = n2p(to[1]);

  console.log('cell size', cellSize);
  console.log('from', x1, y1);
  console.log('to', x2, y2);

  var line = draw.line(x1, y1, x2, y2)
    .stroke({ color: '#f06', width: 9, linecap: 'round', opacity: 0.6});
  line.marker('end', 4, 4, function(add) {
    add.path('M0,0 V4 L3,2 Z').size(4, 4);
    this.fill({ color: '#f06', opacity: 0.6});
  });
}


function showBestMove() {
  // var Chess = require('chess').Chess;
  let fen = getFen();
  var chess = new Chess();
  console.log(chess.validate_fen(fen));

}

getFen();
drawLine('f6', 'd4');
showBestMove();
