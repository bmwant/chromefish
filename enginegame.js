import stockfish from './stockfish.asm.js'


function Engine(moveCallback) {
  var engine = STOCKFISH();
  var engineStatus = {};
  var moveTime = 500; // miliseconds
  var isEngineRunning = false;

  var _engine = this;
  this.moveCallback = moveCallback;

  function uciCmd(cmd) {
    // console.warn('sending', cmd);
    engine.postMessage(cmd);
  }

  uciCmd('uci');

  function suggestMove(fen) {
    uciCmd('ucinewgame');
    uciCmd('isready');
    uciCmd('position fen ' + fen);
    uciCmd('go movetime ' + moveTime);
  }

  engine.onmessage = function(event) {
    var line;
    if (event && typeof event === "object") {
      line = event.data;
    } else {
      line = event;
    }

    // console.log("Reply: " + line);
    if(line == 'uciok') {
      engineStatus.engineLoaded = true;
    } else if(line == 'readyok') {
      engineStatus.engineReady = true;
    } else {
      var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
      if(match) {
        isEngineRunning = false;
        // console.log('engine move', match[1], match[2], match[3]);
        _engine.moveCallback(match[1], match[2]);
      } else if(match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
        engineStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
      }

      // if(match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
      //   var score = parseInt(match[2]) * (game.turn() == 'w' ? 1 : -1);
      //   if(match[1] == 'cp') {
      //     engineStatus.score = (score / 100.0).toFixed(2);
      //   } else if(match[1] == 'mate') {
      //     engineStatus.score = '#' + score;
      //   }
      //   if(match = line.match(/\b(upper|lower)bound\b/)) {
      //     engineStatus.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + engineStatus.score
      //   }
      // }
    }
  };

  this.moveHint = function(fen) {
    suggestMove(fen);
  }
}

export default Engine;
