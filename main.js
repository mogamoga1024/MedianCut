
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const image = new Image();

image.onload = main;
image.src = "images/clover_days.jpg";

function main() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const imageRgbArray = toRgbArray(imageData);
}

function toRgbArray(imageData) {
    const rgbArray = [];
    for (let i = 0; i < imageData.length; i += 4) {
        // 透明は排除する。
        if (imageData[i + 3] === 0) {
            continue;
        }
        const red   = imageData[i];
        const green = imageData[i + 1];
        const blue  = imageData[i + 2];
        rgbArray.push({
            r: red, g: green, b: blue
        });
    }
    return rgbArray;
}

function medianCut(rgbArray) {

}



