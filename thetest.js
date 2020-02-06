var stockfish = new Worker('stockfish.js');

stockfish.addEventListener('message', function (e) {
  console.log(e.data);
});

stockfish.postMessage('uci');
