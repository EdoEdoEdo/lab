import './style.scss';

var worker = new Worker('./workers/workers1/worker.js');
console.log('worker', worker);

worker.onmessage = function (event) {
  document.getElementById('result').textContent = event.data;
};
