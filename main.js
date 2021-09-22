const files = [];

var inputElement = document.getElementById("fileInput");
var dropbox = document.getElementById("dropzone");

inputElement.addEventListener("change", () => handleFiles(inputElement.files), false);

const plusPlaceholder = document.createElement("div");
plusPlaceholder.classList.add("plus-placeholder");
plusPlaceholder.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
</svg>
<span>Agrega otra imagen</span>
`;

const archivosRepetidos = {}

async function handleFiles(fileList) {
	for (let i = 0; i < fileList.length; i++) {
		if (files.length === 0) {
			dropbox.classList.add("files");
			dropbox.appendChild(plusPlaceholder);
		}

		const repeated = files.find((obj) => obj.name === fileList[i].name);

		if (repeated) {
			if (confirm(`${fileList[i].name} ya existe, deseas agregarlo de todas formas?`)) {
                if(!archivosRepetidos[fileList[i].name]) archivosRepetidos[fileList[i].name] = 1
                else archivosRepetidos[fileList[i].name] = archivosRepetidos[fileList[i].name] + 1
				var blob = fileList[i].slice(0, fileList[i].size, "image/png");
				const newFile = new File([blob], fileList[i].name.split(".")[0] + ` (${archivosRepetidos[fileList[i].name]}).` + fileList[i].name.split(".")[1], { type: "image/png" });
				const filePrev = document.createElement("div");
				filePrev.onclick = (e) => {
					e.stopPropagation();
				};
				filePrev.classList.add("item");
				filePrev.setAttribute("index", files.length);
				const base64 = await getBase64(fileList[i]);
				filePrev.innerHTML = `
                    <img src="${base64}" height="16" />
                    <span>${newFile.name}</span>
                    <svg class="close" xmlns="http://www.w3.org/2000/svg" width="16" viewBox="4 4 8 8" onclick="handleItemRemove(this)">
                        <path d="M 4.646 4.646 a 0.5 0.5 0 0 1 0.708 0 L 8 7.293 l 2.646 -2.647 a 0.5 0.5 0 0 1 0.708 0.708 L 8.707 8 l 2.647 2.646 a 0.5 0.5 0 0 1 -0.708 0.708 L 8 8.707 l -2.646 2.647 a 0.5 0.5 0 0 1 -0.708 -0.708 L 7.293 8 L 4.646 5.354 a 0.5 0.5 0 0 1 0 -0.708 z" fill="#000000"/>
                    </svg>
                `;

				dropbox.insertBefore(filePrev, plusPlaceholder);
				dropbox.scrollTo({ top: dropbox.scrollHeight, behavior: "smooth" });
				files.push(newFile);
			}
		} else {
			const filePrev = document.createElement("div");
			filePrev.onclick = (e) => {
				e.stopPropagation();
			};
			filePrev.classList.add("item");
			filePrev.setAttribute("index", files.length);
			const base64 = await getBase64(fileList[i]);
			filePrev.innerHTML = `
                <img src="${base64}" height="16" />
                <span>${fileList[i].name}</span>
                <svg class="close" xmlns="http://www.w3.org/2000/svg" width="16" viewBox="4 4 8 8" onclick="handleItemRemove(this)">
                    <path d="M 4.646 4.646 a 0.5 0.5 0 0 1 0.708 0 L 8 7.293 l 2.646 -2.647 a 0.5 0.5 0 0 1 0.708 0.708 L 8.707 8 l 2.647 2.646 a 0.5 0.5 0 0 1 -0.708 0.708 L 8 8.707 l -2.646 2.647 a 0.5 0.5 0 0 1 -0.708 -0.708 L 7.293 8 L 4.646 5.354 a 0.5 0.5 0 0 1 0 -0.708 z" fill="#000000"/>
                </svg>
            `;

			dropbox.insertBefore(filePrev, plusPlaceholder);
			dropbox.scrollTo({ top: dropbox.scrollHeight, behavior: "smooth" });
			files.push(fileList[i]);
		}
	}
}

const getBase64 = (file) => {
	return new Promise((resolve) => {
		let baseURL = "";
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			baseURL = reader.result;
			resolve(baseURL);
		};
	});
};

async function handleItemRemove(item) {
	const index = parseInt(item.parentElement.getAttribute("index"));
	files.splice(index, 1);
	console.log(
		$(dropbox)
			.children()
			.eq(index + 2)
	);
	$(dropbox)
		.children()
		.eq(index + 2)
		.remove();

	files.map(async (item, index) => {
		dropbox.children[index + 2].setAttribute("index", index);
	});
	if (files.length === 0) {
		dropbox.classList.remove("files");
		dropbox.removeChild(plusPlaceholder);
	}
}

dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("dragleave", dragleave, false);
dropbox.addEventListener("drop", drop, false);
dropbox.addEventListener("click", openInput, false);

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
	dropbox.classList.add("over");
}

function dragleave(e) {
	e.stopPropagation();
	e.preventDefault();
	dropbox.classList.remove("over");
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();
	dropbox.classList.remove("over");

	var dt = e.dataTransfer;
	var files = dt.files;

	handleFiles(files);
}

function openInput() {
	inputElement.click();
}
