
const image = new Image();

image.onload = analysis;
image.onerror = () => {
    domProcessing.style.display = "none";
    domError.style.display = "";
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
const domResult = document.querySelector("#result");
const domProcessing = document.querySelector("#processing");
const domError = document.querySelector("#error");
const domNoColor = document.querySelector("#no-color");
let colorCount = 12;
let ignoreColorLevel = 220;

canvas.style.display = "none";

function analysis() {
    domProcessing.style.display = "none";
    domError.style.display = "none";
    canvas.style.display = "block";
    canvas.style.maxWidth = `${image.width}px`;
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorArray = toColorArray(imageData);
    const newColorArray = medianCut(colorArray, colorCount, ignoreColorLevel);
    
    if (newColorArray.length > 0) {
        domNoColor.style.display = "none";
    }
    else {
        domNoColor.style.display = "";
    }
    for (const color of newColorArray) {
        const domColor = document.createElement("div");
        domColor.classList.add("color");
        domColor.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        domResult.appendChild(domColor);
    }
}

function resetResult() {
    while (domResult.firstChild) {
        domResult.removeChild(domResult.firstChild);
    }
}

const domRandomImage = document.querySelector("#random-image");
domRandomImage.onclick = e => {
    domProcessing.style.display = "";
    canvas.style.display = "none";
    resetResult();
    URL.revokeObjectURL(image.src);
    image.src = "https://picsum.photos/800/400";
};

const domBtnFile = document.querySelector("#btn-file");
const domFile = document.querySelector("#file");
const domFileName = document.querySelector("#file-name");
domBtnFile.onclick = e => domFile.click();
domFile.onchange = e => {
    const file = e.target.files[0];
    if (file == null) {
        return;
    }
    domProcessing.style.display = "";
    canvas.style.display = "none";
    resetResult();
    domFileName.textContent = file.name;
    image.src = URL.createObjectURL(file);
};

const domColorCount = document.querySelector("#color-count");
domColorCount.setAttribute("value", colorCount);
domColorCount.onblur = e => {
    const val = Number(e.target.value);
    if (val < 1) {
        e.target.value = colorCount;
        return;
    }
    domProcessing.style.display = "";
    resetResult();
    e.target.value = val;
    colorCount = val;
    analysis();
};

const domIgnoreColorLevel = document.querySelector("#ignore-color-level");
domIgnoreColorLevel.setAttribute("value", ignoreColorLevel);
domIgnoreColorLevel.onblur = e => {
    const val = Number(e.target.value);
    if (val < 0 || val > 255) {
        e.target.value = ignoreColorLevel;
        return;
    }
    domProcessing.style.display = "";
    resetResult();
    e.target.value = val;
    ignoreColorLevel = val;
    analysis();
};
