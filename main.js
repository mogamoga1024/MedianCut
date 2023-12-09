
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
    const imageRgbData = toRgbData(imageData);
}

function toRgbData(data) {
    const rgbData = [];
    for (let i = 0; i < data.length; i += 4) {
        const red   = data[i];
        const green = data[i + 1];
        const blue  = data[i + 2];
        rgbData.push({
            r: red, g: green, b: blue
        });
    }
    return rgbData;
}


