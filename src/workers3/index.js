import './style.scss';

const worker = new SharedWorker('workers/workers3/worker.js');

const log = document.getElementById('log');
worker.port.onmessage = function(e) { // note: not worker.onmessage!
  log.textContent += '\n' + e.data;
}
