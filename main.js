
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
    const colorArray = toColorArray(imageData);
    const divisiionColorArray = medianCut(colorArray);
    
    // todo
}

function toColorArray(imageData) {
    const colorArray = [];
    for (let i = 0; i < imageData.length; i += 4) {
        // 透明は排除する。
        if (imageData[i + 3] === 0) {
            continue;
        }
        const red   = imageData[i];
        const green = imageData[i + 1];
        const blue  = imageData[i + 2];
        colorArray.push({
            red, green, blue
        });
    }
    return colorArray;
}

function medianCut(colorArray, maxColorGroupCount = 4) {
    let colorName = "red"; // red, green, blue
    let colorGroupArray = [[...colorArray]];

    for (let i = 0; i < maxColorGroupCount - 1; i++) {
        // 最も要素が多い色空間を選択
        let maxLength = 0, maxLengthIndex = 0;
        for (let i = 0; i < colorGroupArray.length; i++) {
            if (colorGroupArray[i].length > maxLength) {
                maxLength = colorGroupArray[i].length;
                maxLengthIndex = i;
            }
        }
        if (maxLength <= 1) break;
        const colorGroup = colorGroupArray[maxLengthIndex];
        colorGroupArray.splice(maxLengthIndex, 1);
        
        let min = 255, max = 0;
        for (const color of colorGroup) {
            min = Math.min(min, color[colorName]);
            max = Math.max(max, color[colorName]);
        }
        const center = (min + max) / 2;

        const lowerGroup = [], upperGropu = [];
        for (const color of colorGroup) {
            if (color[colorName] < center) {
                lowerGroup.push(color);
            }
            else {
                upperGropu.push(color);
            }
        }
        colorGroupArray.push(lowerGroup);
        colorGroupArray.push(upperGropu);

        switch (colorName) {
            case "red":   colorName = "green"; break;
            case "green": colorName = "blue";  break;
            case "blue":  colorName = "red";   break;
            default: throw new Error(`不正な値：${colorName}`);
        }
    }

    return colorGroupArray.map(colorGroup => {
        const totalColor = colorGroup.reduce((total, color) => {
            total.red   += color.red;
            total.green += color.green;
            total.blue  += color.blue;
            return total;
        }, {red: 0, green: 0, blue: 0});
        return {
            red:   Math.round(totalColor.red   / colorGroup.length),
            green: Math.round(totalColor.green / colorGroup.length),
            blue:  Math.round(totalColor.blue  / colorGroup.length)
        };
    });
}



