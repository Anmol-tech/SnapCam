let videoPlayer = document.querySelector("video");
let constraint = { video: true, audio: true };
let recordBtn = document.querySelector("#recordBtn");
let captureBtn = document.querySelector("#captureBtn");
let isRecording = false;
let recordedData;
let videoCanvas = document.querySelector("#video-canvas");
let ctx = videoCanvas.getContext("2d");
let drawCanvas = document.querySelector("#draw-canvas");
let dctx = drawCanvas.getContext("2d");
let drawLeft = 0;
let drawTop = 0;
let isDrawMode = false;
let isMouseDown = false;
let editMode = document.querySelector(".editMode");
let drawTool = document.querySelector(".draw-tool");

videoPlayer.addEventListener(
	"play",
	function () {
		let $this = this; //cache
		(function loop() {
			if (!$this.paused && !$this.ended) {
				ctx.drawImage($this, 0, 0);
				setTimeout(loop, 1000 / 30); // drawing at 60fps
			}
		})();
	},
	0
);

videoPlayer.addEventListener("loadedmetadata", function (e) {
	// set height of canvas when video load

	drawCanvas.width = videoPlayer.videoWidth;
	drawCanvas.height = videoPlayer.videoHeight;
	videoCanvas.width = videoPlayer.videoWidth;
	videoCanvas.height = videoPlayer.videoHeight;

	drawTop = videoCanvas.getBoundingClientRect().top;
	drawLeft = videoCanvas.getBoundingClientRect().left;

	// drawCanvas.style.top = drawTop;
	// drawCanvas.style.left = drawLeft;
});

(async function () {
	let media = await navigator.mediaDevices.getUserMedia(constraint);
	videoPlayer.srcObject = media;
	let mediaRecorder = new MediaRecorder(media, {
		mimeType: "video/webm; codecs=vp9",
	});

	mediaRecorder.onstart = function (e) {};

	mediaRecorder.onstop = function () {
		saveVideo();
	};

	mediaRecorder.ondataavailable = function (e) {
		recordedData = e.data;
	};

	recordBtn.addEventListener("click", function () {
		if (isRecording) {
			mediaRecorder.stop();
			document.querySelector(".record-animate").classList.remove("onrecord");
			// recordBtn.textContent = "Record";
		} else {
			// recordBtn.textContent = "Recording";
			document.querySelector(".record-animate").classList.add("onrecord");
			mediaRecorder.start();
		}
		isRecording = !isRecording;
	});

	captureBtn.addEventListener("click", saveImage);
})();

editMode.addEventListener("click", function (e) {
	isDrawMode = !isDrawMode;
	if (isDrawMode) {
		drawCanvas.style.cursor = `url("./pencil.png"), auto`;
		drawTool.style.visibility = "visible";
	} else {
		drawCanvas.style.cursor = `auto`;
		drawTool.style.visibility = "hidden";
	}
});

function saveVideo() {
	let videoUrl = window.URL.createObjectURL(recordedData);

	console.log("Saving Video");
	// file object in recordedData
	let blob = new Blob([recordedData], { type: "video/webm" });

	let iv = setInterval(function () {
		if (db) {
			saveMedia("video", blob);
			clearInterval(iv);
		}
	}, 100);

	// document.querySelector("#show").src = videoUrl;
	// console.log(video);
	// let aTag = document.createElement("a");
	// aTag.download = "video.webm";
	// aTag.href = videoUrl;
	// aTag.click();

	window.URL.revokeObjectURL(videoUrl);
}

function saveImage() {
	document.querySelector(".capture-animate").classList.add("oncapture");
	setTimeout(
		() =>
			document.querySelector(".capture-animate").classList.remove("oncapture"),
		1000
	);
	let imageUrlvideo = videoCanvas.toDataURL("image/jpg");

	let imageUrldraw = drawCanvas.toDataURL("image/jpg");

	mergeImages([imageUrlvideo, imageUrldraw]).then(function (data) {
		let iv = setInterval(function () {
			if (db) {
				saveMedia("image", data);
				clearInterval(iv);
			}
		}, 100);
		// let aTag = document.createElement("a");
		// aTag.download = "image.jpg";
		// aTag.href = data;
		// aTag.click();
	});
}
