
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
            red, green, blue
        });
    }
    return rgbArray;
}

function medianCut(rgbArray, maxDivisionCount) {
    let targetColor = "red"; // red, green, blue
    const red =   {min: 255, max: 0};
    const green = {min: 255, max: 0};
    const blue =  {min: 255, max: 0};

    for (const color of rgbArray) {
        red.min = Math.min(red.min, color.red);
        red.max = Math.max(red.max, color.red);
        green.min = Math.min(green.min, color.green);
        green.max = Math.max(green.max, color.green);
        blue.min = Math.min(blue.min, color.blue);
        blue.max = Math.max(blue.max, color.blue);
    }


}



