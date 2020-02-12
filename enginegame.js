import stockfish from './stockfish.asm.js'
// import Chess from 'chess.js'


function engineGame(options) {
  var board;
  // var game = new Chess();
  var engine = STOCKFISH();
  var engineStatus = {};
  var time = { wtime: 300000, btime: 300000, winc: 2000, binc: 2000, depth: 2 };
  var playerColor = 'white';
  var isEngineRunning = false;

  function uciCmd(cmd) {
    console.warn('sending', cmd);
    engine.postMessage(cmd);
  }

  uciCmd('uci');

  function suggestMove(fen) {
    uciCmd('ucinewgame');
    uciCmd('isready');
    uciCmd('position fen ' + fen);
    uciCmd('go movetime 500');
  }

  function prepareMove() {
    // stopClock();
    $('#pgn').text(game.pgn());
    board.position(game.fen());
    // updateClock();
    var turn = game.turn() == 'w' ? 'white' : 'black';
    if(!game.game_over()) {
      if(turn != playerColor) {
        var moves = '';
        var history = game.history({verbose: true});
        for(var i = 0; i < history.length; ++i) {
          var move = history[i];
          moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
        }
        uciCmd('position startpos moves' + moves);
        if(time.depth) {
          uciCmd('go depth ' + time.depth);
        } else if(time.nodes) {
          uciCmd('go nodes ' + time.nodes);
        } else {
          uciCmd('go wtime ' + time.wtime + ' winc ' + time.winc + ' btime ' + time.btime + ' binc ' + time.binc);
        }
        isEngineRunning = true;
      }
      // if(game.history().length >= 2 && !time.depth && !time.nodes) {
      //   startClock();
      // }
    }
  }

  engine.onmessage = function(event) {
    var line;
    if (event && typeof event === "object") {
      line = event.data;
    } else {
      line = event;
    }
    if (line === undefined) {
      console.info('something wrong');
      return
    }
    console.log("Reply: " + line);
    if(line == 'uciok') {
      engineStatus.engineLoaded = true;
    } else if(line == 'readyok') {
      engineStatus.engineReady = true;
    } else {
      var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
      if(match) {
        isEngineRunning = false;
        console.log('move', match[1], match[2], match[3]);
        // game.move({from: match[1], to: match[2], promotion: match[3]});
        // suggestMove()
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

  return {
    moveHint: function(fen) {
      suggestMove(fen);
    }
  };
}

export default engineGame;
