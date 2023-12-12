
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const image = new Image();

image.onload = main;
image.setAttribute("crossorigin", "anonymous");
// image.src = "images/clover_days.jpg";
// image.src = "images/2.jpg";
image.src = "images/kyu.jpg";
// image.src = "images/images.png";
// image.src = "images/jeff.jpg";
// image.src = "images/sanrio.jpg";
// image.src = "images/しもんきん.jpg";
// image.src = "https://picsum.photos/800/400";
// image.src = "images/野獣先輩.png";
// image.src = "images/watya.jpg";

function main() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorArray = toColorArray(imageData);
    const newColorArray = medianCut(colorArray, 5);
    
    const resultHE = document.querySelector("#result");
    for (const color of newColorArray) {
        const colorHE = document.createElement("div");
        colorHE.classList.add("color");
        colorHE.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        resultHE.appendChild(colorHE);
    }
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

function medianCut(colorArray, maxColorGroupCount = 8) {
    // 薄い色は無視する
    const colorGroupArray = [colorArray.filter(color => {
        return color.red < 220 || color.green < 220 || color.blue < 220 
    })];

    for (let i = 0; i < maxColorGroupCount - 1; i++) {
        // 最も要素が多い色空間を選択
        let maxLength = 0, maxLengthIndex = 0;
        for (let i = 0; i < colorGroupArray.length; i++) {
            if (colorGroupArray[i].length > maxLength) {
                maxLength = colorGroupArray[i].length;
                maxLengthIndex = i;
            }
        }
        const colorGroup = colorGroupArray[maxLengthIndex];
        colorGroupArray.splice(maxLengthIndex, 1);
        
        const statistics = {
            red:   {min: 255, max: 0},
            green: {min: 255, max: 0},
            blue:  {min: 255, max: 0}
        }
        for (const color of colorGroup) {
            for (const key in statistics) {
                const obj = statistics[key];
                obj.min = Math.min(obj.min, color[key]);
                obj.max = Math.max(obj.max, color[key]);
            }
        }

        let colorName = undefined;
        const redDiff   = statistics.red.max   - statistics.red.min;
        const greenDiff = statistics.green.max - statistics.green.min;
        const blueDiff  = statistics.blue.max  - statistics.blue.min;

        // RGBで強弱が大きい要素を求める
        if (redDiff >= greenDiff && redDiff >= blueDiff) {
            colorName = "red";
        }
        else if (greenDiff >= redDiff && greenDiff >= blueDiff) {
            colorName = "green";
        }
        else {
            colorName = "blue";
        }

        const center = (statistics[colorName].min + statistics[colorName].max) / 2;

        // 中央値で分割する
        const lowerGroup = [], upperGropu = [];
        for (const color of colorGroup) {
            if (color[colorName] < center) {
                lowerGroup.push(color);
            }
            else {
                upperGropu.push(color);
            }
        }

        if (lowerGroup.length > 0) colorGroupArray.push(lowerGroup);
        if (upperGropu.length > 0) colorGroupArray.push(upperGropu);
    }

    // 分割された色空間の平均値を求める
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



