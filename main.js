
const image = new Image();

image.onload = analysis;
image.onerror = () => {
    domProcessing.style.display = "none";
    domError.style.display = "";
    domError.textContent = "エラー！本当に画像？";
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
// image.src = "images/bug.png";
// image.src = "images/test.png";
// image.src = "images/toka.png";
image.src = "https://picsum.photos/800/400";

const canvasWrapper = document.querySelector("#canvas-wrapper");
const srcCanvas = document.querySelector("#original-image");
const srcContext = srcCanvas.getContext("2d", {willReadFrequently: true});
const dstCanvas = document.querySelector("#result-image");
const dstContext = dstCanvas.getContext("2d");
const domPallet = document.querySelector("#pallet");
const domProcessing = document.querySelector("#processing");
const domError = document.querySelector("#error");
let colorCount = 64;
let worker = undefined;

canvasWrapper.style.display = "none";

function analysis() {
    domError.style.display = "none";
    canvasWrapper.style.display = "none";
    srcCanvas.style.maxWidth = dstCanvas.style.maxWidth = `${image.width}px`;
    srcCanvas.width = dstCanvas.width = image.width;
    srcCanvas.height = dstCanvas.height = image.height;

    const isValidCanvas = canvasSize.test({
        width : image.width,
        height: image.height
    });

    if (!isValidCanvas) {
        domProcessing.style.display = "none";
        domError.style.display = "";
        domError.textContent = "画像サイズがでかすぎます…";
        return;
    }

    srcContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, srcCanvas.width, srcCanvas.height);
    const imageData = srcContext.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

    worker?.terminate();
    worker = new Worker("median_cut_worker.js");
    worker.onmessage = function(e) {
        domProcessing.style.display = "none";
        canvasWrapper.style.display = "";

        const {colorArray, imageData} = e.data;
        dstContext.putImageData(imageData, 0, 0);
        for (const color of colorArray) {
            const domColor = document.createElement("div");
            domColor.classList.add("color");
            domColor.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            domPallet.appendChild(domColor);
        }
    };
    worker.onerror = function(e) {
        console.error(e);
        domProcessing.style.display = "none";
        domError.style.display = "";
        domError.textContent = "よく分からんエラー…";
    };
    worker.postMessage({imageData, colorCount});
}

function resetPallet() {
    while (domPallet.firstChild) {
        domPallet.removeChild(domPallet.firstChild);
    }
}

const domRandomImage = document.querySelector("#random-image");
domRandomImage.onclick = e => {
    domProcessing.style.display = "";
    canvasWrapper.style.display = "none";
    resetPallet();
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
    canvasWrapper.style.display = "none";
    resetPallet();
    domFileName.textContent = file.name;
    image.src = URL.createObjectURL(file);
};

const domColorCount = document.querySelector("#color-count");
domColorCount.setAttribute("value", colorCount);
domColorCount.onblur = e => {
    const val = Number(e.target.value);
    if (val < 1 || val === colorCount) {
        e.target.value = colorCount;
        return;
    }
    resetPallet();
    e.target.value = val;
    colorCount = val;
    if (domError.style.display !== "") {
        domProcessing.style.display = "";
        analysis();
    }
};
