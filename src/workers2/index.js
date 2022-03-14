import './style.scss';

const worker = new Worker('./workers/workers2/worker.js', { type: 'module' });
worker.onmessage = receiveFromWorker;

const url = document.querySelector('#image-url')
const filter = document.querySelector('#filter')
const output = document.querySelector('#output')

url.oninput = updateImage
filter.oninput = sendToWorker

let imageData, context;

function updateImage() {
  console.log('updateImage called')
  const img = new Image();
  img.src = url.value;
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    console.log('img onload')
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    sendToWorker();
    output.replaceChildren(canvas);
  }
}

function sendToWorker() {
  worker.postMessage({
    imageData,
    filter: filter.value
  });
}

function receiveFromWorker(e) {
  console.log('receiveFromWorker: ', e.data);
  context.putImageData(e.data, 0, 0);

}

