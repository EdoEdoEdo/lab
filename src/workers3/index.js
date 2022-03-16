import './style.scss';

const worker = new SharedWorker('workers/workers3-shared/worker.js');

const log = document.getElementById('log');
worker.port.onmessage = function(e) { // note: not worker.onmessage!
  log.textContent += '\n' + e.data;
}

// Shared worker ex 2
var sharedWorker = new SharedWorker('workers/workers3-shared/shared2.js');
  var log2 = document.getElementById('log2');
  sharedWorker.port.addEventListener('message', function(e) {
    log2.textContent += '\n' + e.data;
  }, false);
  sharedWorker.port.start(); // note: need this when using addEventListener
  sharedWorker.port.postMessage('ping');
