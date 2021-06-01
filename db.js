let request = indexedDB.open("CameraGallery");
let db;

request.onsuccess = function (e) {
	db = e.target.result;
};

request.onupgradeneeded = function (e) {
	db = e.target.result;
	db.createObjectStore("Media", { keyPath: "mid" });
};
