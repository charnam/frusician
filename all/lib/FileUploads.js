import { HTML } from "imperative-html";

class FileUploads {
	static upload(type) {
		return new Promise((res, rej) => {
			const fileInput = new HTML.input({
				type: "file",
				style: "display: none;",
				accept: type
			});
			fileInput.onchange = () => {
				res(fileInput.files[0]);
				fileInput.remove();
			}
			fileInput.oncancel = () => {
				fileInput.remove();
				rej("Upload cancelled.");
			}
			document.documentElement.appendChild(fileInput);
			fileInput.click();
		});
	}
	static uploadText(type) {
		return new Promise(async res => {
			const file = await this.upload(type);
			const reader = new FileReader();
			reader.onload = () => {
				let content = reader.result;
				res(content);
			}
			reader.readAsText(file);
		})
	}
	static uploadArrayBuffer(type) {
		return new Promise(async res => {
			const file = await this.upload(type);
			res(await file.arrayBuffer());
		})
	}
}

export default FileUploads;