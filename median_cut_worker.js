
importScripts("median_cut.js");

onmessage = function(e) {
    const {imageData, colorCount} = e.data;
    const colorArray = medianCut(imageData, colorCount);
    postMessage(colorArray);
};
