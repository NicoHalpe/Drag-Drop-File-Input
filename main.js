const files = [];

var inputElement = document.getElementById("fileInput");
var dropbox = document.getElementById("dropzone");

inputElement.addEventListener("change", () => handleFiles(inputElement.files), false);

function handleFiles(fileList) {
	for (let i = 0; i < fileList.length; i++) {
		if (files.length === 0) dropbox.classList.add("files");

		const filePrev = document.createElement("div");
        filePrev.onclick = (e) => {e.stopPropagation()}
		filePrev.classList.add("item");
        filePrev.setAttribute("index", files.length)
		filePrev.innerHTML = `
        <img src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_image_x16.png" />
        <span>${fileList[i].name}</span>
        <svg class="close" xmlns="http://www.w3.org/2000/svg" width="16" viewBox="4 4 8 8" onclick="handleItemRemove(this)">
            <path d="M 4.646 4.646 a 0.5 0.5 0 0 1 0.708 0 L 8 7.293 l 2.646 -2.647 a 0.5 0.5 0 0 1 0.708 0.708 L 8.707 8 l 2.647 2.646 a 0.5 0.5 0 0 1 -0.708 0.708 L 8 8.707 l -2.646 2.647 a 0.5 0.5 0 0 1 -0.708 -0.708 L 7.293 8 L 4.646 5.354 a 0.5 0.5 0 0 1 0 -0.708 z" fill="#000000"/>
        </svg>
        `;

		dropbox.appendChild(filePrev);

        files.push(fileList[i]);
	}
}

/**
 * 
 * @param {HTMLElement} item 
 */
function handleItemRemove(item) {
    const index = item.parentElement.getAttribute("index")
    files.splice(index, 1)
    item.parentElement.parentElement.innerHTML = item.parentElement.parentElement.children[0].outerHTML + item.parentElement.parentElement.children[1].outerHTML
    files.map((item, index) => {
        const filePrev = document.createElement("div");
        filePrev.onclick = (e) => {e.stopPropagation()}
		filePrev.classList.add("item");
        filePrev.setAttribute("index", index)
		filePrev.innerHTML = `
        <img src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_image_x16.png" />
        <span>${item.name}</span>
        <svg class="close" xmlns="http://www.w3.org/2000/svg" width="16" viewBox="4 4 8 8" onclick="handleItemRemove(this)">
            <path d="M 4.646 4.646 a 0.5 0.5 0 0 1 0.708 0 L 8 7.293 l 2.646 -2.647 a 0.5 0.5 0 0 1 0.708 0.708 L 8.707 8 l 2.647 2.646 a 0.5 0.5 0 0 1 -0.708 0.708 L 8 8.707 l -2.646 2.647 a 0.5 0.5 0 0 1 -0.708 -0.708 L 7.293 8 L 4.646 5.354 a 0.5 0.5 0 0 1 0 -0.708 z" fill="#000000"/>
        </svg>
        `;

		dropbox.appendChild(filePrev);
    })
    if (files.length === 0) dropbox.classList.remove("files");
}

dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("dragleave", dragleave, false);
dropbox.addEventListener("drop", drop, false);
dropbox.addEventListener("click", openInput, false);

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
    dropbox.classList.add("over")
}

function dragleave(e) {
	e.stopPropagation();
	e.preventDefault();
    dropbox.classList.remove("over")
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	var dt = e.dataTransfer;
	var files = dt.files;

	handleFiles(files);
}

function openInput() {
	inputElement.click();
}
