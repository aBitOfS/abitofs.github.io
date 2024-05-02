class DocumentInteractive {

}

class Kamery {
	leftContainer: HTMLElement | null;
	rightContainer: HTMLElement | null;

	leftTemplate: HTMLElement | null;
	constructor() {
		this.leftContainer = document.getElementById("left");
		this.rightContainer = document.getElementById("right");
		this.leftTemplate = document.getElementById("leftTemplate");
	}
	leftItems: [string,string][];
	loadLeft() {
		let leftCount = localStorage.getItem("leftCount");
		if (typeof leftCount !== "number")
			return;
		for (let i = 0; i < leftCount; i++) {
			let lN: string | null = localStorage.getItem(`leftName${i}`);
			let lU: string | null = localStorage.getItem(`leftUrl${i}`);
			if (lN && lU)
				this.leftItems.push([lN,lU]);
		}

		if (this.leftContainer) {
			this.leftContainer.innerHTML = "";
			for (let el of this.leftItems) {
				this.addLeft(el);
			}
		}
	}
	addLeft(toadd: [string,string]) {
		if (this.leftContainer && this.leftTemplate) {
			let sp = this.leftTemplate.getElementsByTagName("span");
			sp[0].innerText = toadd[0];
			sp[1].innerText = toadd[1];
			let ne = this.leftTemplate.cloneNode(true);
			this.leftContainer.appendChild(ne);
		}
	}
}

const kamery = new Kamery();