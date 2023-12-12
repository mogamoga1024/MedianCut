
const image = new Image();

image.onload = analysis;
image.onerror = () => {
    processingHE.style.display = "none";
    errorHE.style.display = "";
    URL.revokeObjectURL(image.src);
};
image.setAttribute("crossorigin", "anonymous");
// image.src = "images/clover_days.jpg";
// image.src = "images/2.jpg";
// image.src = "images/kyu.jpg";
// image.src = "images/images.png";
// image.src = "images/jeff.jpg";
// image.src = "images/sanrio.jpg";
// image.src = "images/しもんきん.jpg";
// image.src = "images/野獣先輩.png";
// image.src = "images/watya.jpg";
image.src = "https://picsum.photos/800/400";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const resultHE = document.querySelector("#result");
const processingHE = document.querySelector("#processing");
const errorHE = document.querySelector("#error");
const noColorHE = document.querySelector("#no-color");
let colorCount = 12;
let ignoreColorLevel = 220;

canvas.style.display = "none";

function analysis() {
    processingHE.style.display = "none";
    errorHE.style.display = "none";
    canvas.style.display = "block";
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorArray = toColorArray(imageData);
    const newColorArray = medianCut(colorArray, colorCount, ignoreColorLevel);
    
    if (newColorArray.length > 0) {
        noColorHE.style.display = "none";
    }
    else {
        noColorHE.style.display = "";
    }
    for (const color of newColorArray) {
        const colorHE = document.createElement("div");
        colorHE.classList.add("color");
        colorHE.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        resultHE.appendChild(colorHE);
    }
}

function resetResult() {
    while (resultHE.firstChild) {
        resultHE.removeChild(resultHE.firstChild);
    }
}

const randomImageButton = document.querySelector("#random-image");
randomImageButton.onclick = e => {
    processingHE.style.display = "";
    canvas.style.display = "none";
    resetResult();
    URL.revokeObjectURL(image.src);
    image.src = "https://picsum.photos/800/400";
};

const fileHE = document.querySelector("#file");
fileHE.onchange = e => {
    const file = e.target.files[0];
    if (file == null) {
        return;
    }
    processingHE.style.display = "";
    canvas.style.display = "none";
    resetResult();
    image.src = URL.createObjectURL(file);
};

const colorCountHE = document.querySelector("#color-count");
colorCountHE.setAttribute("value", colorCount);
colorCountHE.onblur = e => {
    const val = Number(e.target.value);
    if (val < 1) {
        e.target.value = colorCount;
        return;
    }
    processingHE.style.display = "";
    resetResult();
    e.target.value = val;
    colorCount = val;
    analysis();
};

const ignoreColorLevelHE = document.querySelector("#ignore-color-level");
ignoreColorLevelHE.setAttribute("value", ignoreColorLevel);
ignoreColorLevelHE.onblur = e => {
    const val = Number(e.target.value);
    if (val < 0 || val > 255) {
        e.target.value = ignoreColorLevel;
        return;
    }
    processingHE.style.display = "";
    resetResult();
    e.target.value = val;
    ignoreColorLevel = val;
    analysis();
};
