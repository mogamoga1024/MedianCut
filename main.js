
const image = new Image();

image.onload = main;
image.onerror = () => URL.revokeObjectURL(image.src);
image.setAttribute("crossorigin", "anonymous");
image.src = "images/clover_days.jpg";
// image.src = "images/2.jpg";
// image.src = "images/kyu.jpg";
// image.src = "images/images.png";
// image.src = "images/jeff.jpg";
// image.src = "images/sanrio.jpg";
// image.src = "images/しもんきん.jpg";
// image.src = "images/野獣先輩.png";
// image.src = "images/watya.jpg";

function main() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorArray = toColorArray(imageData);
    const newColorArray = medianCut(colorArray, 12);
    
    const resultHE = document.querySelector("#result");
    while (resultHE.firstChild) {
        resultHE.removeChild(resultHE.firstChild);
    }
    for (const color of newColorArray) {
        const colorHE = document.createElement("div");
        colorHE.classList.add("color");
        colorHE.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        resultHE.appendChild(colorHE);
    }
}

const randomImageButton = document.querySelector("#random-image");
randomImageButton.onclick = e => {
    URL.revokeObjectURL(image.src);
    image.src = "https://picsum.photos/800/400";
};

const fileHE = document.querySelector("#file");
fileHE.onchange = e => {
    const file = e.target.files[0];
    image.src = URL.createObjectURL(file);
};
