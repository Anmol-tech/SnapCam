let eraser = document.querySelector("#eraser");
let pen = document.querySelector("#pen");
let showPenColor = document.querySelector("#show-pen-color");
let penColorInput = document.querySelector("#pen-color");
let penWidthSmall = document.querySelector(".small");
let penWidthMid = document.querySelector(".mid");
let penWidthLarge = document.querySelector(".large");
let isEraserActive = false;

drawCanvas.addEventListener("mousedown", function (e) {
	if (isDrawMode) {
		isMouseDown = true;
		dctx.beginPath();
	}
});

drawCanvas.addEventListener("mousemove", function (e) {
	if (isMouseDown) {
		// console.log(e);
		dctx.lineTo(e.clientX - drawLeft, e.clientY - drawTop);
		dctx.stroke();
	}
});
drawCanvas.addEventListener("mouseup", function (e) {
	dctx.stroke();
	isMouseDown = false;
	// console.log(e);
});

pen.addEventListener("click", function (e) {
	if (isEraserActive) {
		dctx.lineWidth /= 3;
		isEraserActive = !isEraserActive;
	}

	dctx.globalCompositeOperation = "source-over";

	drawCanvas.style.cursor = `url("./pencil.png"), auto`;
});

eraser.addEventListener("click", function (e) {
	if (!isEraserActive) {
		isEraserActive = true;
		dctx.lineWidth *= 3;
	}

	dctx.globalCompositeOperation = "destination-out";
	drawCanvas.style.cursor = `url("./eraser.png"), auto`;
});

eraser.addEventListener("dblclick", function (e) {
	dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
});

penColorInput.addEventListener("change", function (e) {
	pen.style.color = penColorInput.value;
	penWidthSmall.style.color = penColorInput.value;
	penWidthMid.style.color = penColorInput.value;
	penWidthLarge.style.color = penColorInput.value;
	showPenColor.style.backgroundColor = penColorInput.value;
	dctx.strokeStyle = penColorInput.value;
});

showPenColor.addEventListener("click", function (e) {
	penColorInput.click();
});

penWidthSmall.addEventListener("click", (e) => changePenWidth(1));
penWidthMid.addEventListener("click", (e) => changePenWidth(3));
penWidthLarge.addEventListener("click", (e) => changePenWidth(6));
function changePenWidth(val) {
	dctx.lineWidth = val * (isEraserActive ? 3 : 1);
}
