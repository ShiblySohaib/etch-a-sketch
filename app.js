const sketchboard = document.querySelector("#sketchboard");
const sketchboardBg = document.querySelector("#sketchboardBg");
const brushColor = document.querySelector("#brushColor");
const brushOpacity = document.querySelector("#brushOpacity");
const rainbowOn = document.querySelector("#rainbowOn");
const rainbowOff = document.querySelector("#rainbowOff");
const colorPicker = document.querySelector("#colorPicker");
const opacityBox = document.querySelector("#opacity");
const opacitySlider = document.querySelector("#opacitySlider");
const eraser = document.querySelector("#eraser");
const brush = document.querySelector("#brush");
const canvasColorPicker = document.querySelector("#canvasColorPicker");
const clear = document.querySelector("#clear");
const gridSlider = document.querySelector("#gridSlider");
const gridSize = document.querySelector("#gridSize");
const rainbowColor = [
    "violet",
    "indigo",
    "blue",
    "green",
    "yellow",
    "orange",
    "red",
];
var boxCount = 16;
let penColor = "black";
let bgColor = "white";
var opacity = 100;
let rainbow = false;
let colorCounter = 0;
let height = `${sketchboard.offsetHeight / boxCount}px`;
let width = `${sketchboard.offsetWidth / boxCount}px`;
let boxes;
let eraserMode = false;

brush.style.opacity = "30%";

colorPicker.value = "#000000";
canvasColorPicker.value = "#FFFFFF";
rainbowOff.style.opacity = "30%";
opacitySlider.value = 100;
gridSlider.value = 16;

//brush event
brush.onclick = brushOn;
function brushOn() {
    brush.style.opacity = "30%";
    eraser.style.opacity = "100%";
    penColor = colorPicker.value;
    eraserMode = false;
}

//eraser event
eraser.onclick = eraserOn;
function eraserOn() {
    eraser.style.opacity = "30%";
    brush.style.opacity = "100%";
    eraserMode = true;
}

opacityBox.onclick = () => {
    opacityBox.readOnly = false;
};

opacityBox.onkeydown = (e) => {
    if (e.key === "Enter") {
        if (e.target.value >= 0 && e.target.value <= 100) {
            opacity = e.target.value;
            e.target.value = "";
            e.target.placeholder = opacity;
            opacityBox.readOnly = true;
            opacitySlider.value = opacity;
        } else {
            e.target.value = 100;
            alert("Invalid opacity. Try between (0-100)");
        }
    }
};

opacitySlider.oninput = (e) => {
    opacity = e.target.value;
    opacityBox.placeholder = opacity;
};

colorPicker.oninput = (e) => {
    penColor = e.target.value;
};

rainbowOff.onclick = () => {
    rainbow = false;
    rainbowOn.style.opacity = "100%";
    rainbowOff.style.opacity = "30%";
    brushColor.style.opacity = "100%";
    colorPicker.disabled = false;
    colorPicker.style.opacity = "100%";
    penColor = colorPicker.value;
    brushOn();
};
rainbowOn.onclick = () => {
    rainbow = true;
    rainbowOn.style.opacity = "30%";
    rainbowOff.style.opacity = "100%";
    colorPicker.style.opacity = "30%";
    colorPicker.disabled = true;
    brushOn();
};

function draw(box) {
    if (eraserMode) {
        box.style.backgroundColor = "";
        box.style.opacity = 1;
    } else if (rainbow == true) {
        colorCounter = (colorCounter + 1) % 7;
        penColor = rainbowColor[colorCounter];
        if (box.style.backgroundColor == "") {
            box.style.backgroundColor = penColor;
            box.style.opacity = opacity / 100;
        }
        else{
            box.style.backgroundColor = penColor;
            box.style.opacity =
                parseFloat(box.style.opacity) + parseFloat(opacity / 100);
            if(box.style.opacity >1) box.style.opacity =1;
        } 
    } else {
        if (box.style.backgroundColor == "") {
            box.style.backgroundColor = penColor;
            box.style.opacity = opacity / 100;
        }
        else{
            box.style.backgroundColor = penColor;
            box.style.opacity =
                parseFloat(box.style.opacity) + parseFloat(opacity / 100);
            if(box.style.opacity >1) box.style.opacity =1;
        } 
    }
}

function setGrid(boxCount) {
    sketchboard.style.display = "grid";
    sketchboard.style.gridTemplateColumns = `repeat(${boxCount},1fr)`;
    sketchboard.style.gridTemplateRows = `repeat(${boxCount},1fr)`;
    sketchboardBg.style.backgroundColor = bgColor;
    for (let i = 0; i < boxCount * boxCount; i++) {
        let box = document.createElement("div");
        box.classList.add("boxes");
        box.style.opacity = 1;
        box.style.backgroundColor = "";
        var mouseIsDown = false;

        box.addEventListener("mousedown", (e) => {
            mouseIsDown = true;
            draw(e.target);
        });

        box.addEventListener("mouseup", () => {
            mouseIsDown = false;
        });

        box.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
        box.addEventListener("mouseover", (e) => {
            if (mouseIsDown) {
                draw(e.target);
            }
        });
        sketchboard.appendChild(box);
    }
    boxes = document.querySelectorAll(".boxes");
}

setGrid(boxCount);

canvasColorPicker.oninput = (e) => {
    bgColor = e.target.value;
    sketchboardBg.style.backgroundColor = bgColor;
    boxes.forEach((box) => {
        box.style.backgroundColor = bgColor;
        box.style.opacity = 1;
    });
    brush.style.opacity = "30%";
    eraser.style.opacity = "100%";
    penColor = colorPicker.value;
    eraserMode = false;
};

clear.onclick = () => {
    boxes.forEach((box) => {
        box.style.backgroundColor = "";
    });
};

gridSlider.oninput = (e) => {
    boxCount = e.target.value;
    sketchboard.innerHTML = "";
    setGrid(boxCount);
    gridSize.textContent = `${boxCount} x ${boxCount}`;
};
