import * as filters from "./filters.js";

self.onmessage = e => {
  console.log('filters:', filters)
  console.log('received inside worker: ', e.data);
  const { imageData, filter } = e.data;



  filters[filter](imageData);
  self.postMessage(imageData, [imageData.data.buffer]);
}
