var camers = [["Chałupy","https://player.nadmorski24.pl/_camera2.php?id=7"],
	["Jastarnia","https://player.nadmorski24.pl/_camera2.php?id=20"],
	["Jastarnia kemping","https://player.nadmorski24.pl/_camera2.php?id=83"],
	["Jurata","https://player.nadmorski24.pl/_camera2.php?id=23"],
	["Puck","https://player.nadmorski24.pl/_camera2.php?id=28"],
	["Windy","https://embed.windy.com/embed2.html?lat=54.633&lon=18.509&detailLat=54.633&detailLon=18.509&width=&height=500&zoom=10&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=kt%2Fh&metricTemp=%C2%B0C&radarRange=-1"],
	["Rewa","https://player.nadmorski24.pl/_camera2.php?id=106"]]; // index, nazwa, url
var viewedCameras = [];

function addPopupOpen() {
	document.getElementById("addPopup").style.display = "block";
}
function addPopupClose() {
	document.getElementById("addPopup").style.display = "none";
	document.getElementById("nameInput").value = "";
	document.getElementById("urlInput").value = "";
}
function addCamera() {
	camers.push([document.getElementById("nameInput").value,document.getElementById("urlInput").value]);
	addPopupClose();
	camUpdate()
}
			
function camUpdate() {
	var cont = "";
	for (let i = 0; i < camers.length; i++) {
		cont += `<div onpointerdown="camlistClick(${i})">${camers[i][0]}</div>`;
	}
	document.getElementById("camList").innerHTML = cont;
	// Pack camers
	localStorage.setItem("camListLength",camers.length);
	for (let i = 0; i < camers.length; i++) {
		localStorage.setItem("camListName"+i,camers[i][0]);
		localStorage.setItem("camListUrl"+i,camers[i][1]);
	}
}

function camViewUpdate() {
	var cont = "";
	for (let i = 0; i < viewedCameras.length; i++) {
		cont += `<div>
			<h2>${camers[viewedCameras[i]][0]}</h2>
			<iframe src="${camers[viewedCameras[i]][1]}"></iframe>
		</div>`;
	}
	document.getElementById("content").innerHTML = cont;
}

function changeMode(nmode) {
	if (tryb === nmode)
		tryb = 0;
	else
		tryb = nmode;
}

var ind = 0;
function camlistClick(index) {
	ind = index;
	document.getElementById("follows").innerHTML = camers[index][0]; 
	document.body.addEventListener("pointermove",follow);
	document.body.addEventListener("pointerup",stopfollowing);
}

function placingByMouse(x, cont) {
	var start, end;
	if (x < 0) { // kliknięcie - całość
		start = 1;
		end = 7;
	}
	else if (x < cont.offsetWidth/4) { // <1/4 - 1/3 lewo
		start = 1;
		end = 3;
	}
	else if (x < cont.offsetWidth*2/5) {
		start = 1;
		end = 4;
	}
	else if (x < cont.offsetWidth*3/5) {
		start = 3;
		end = 5;
	}
	else if (x < cont.offsetWidth*3/4) {
		start = 4;
		end = 7;
	}
	else {
		start = 5;
		end = 7;
	}
	return [start,end];
}

function follow(event) {
	var e = document.getElementById("follows");
	e.style.left = (event.clientX-e.offsetWidth/2)+"px";
	e.style.top = (event.clientY-e.offsetHeight/2)+"px";
	
	var cont = document.getElementById("content");
	var vc = document.getElementById("virtualContent");
	var x = event.clientX;
	x -= cont.offsetLeft;
	var pos = placingByMouse(x, cont);
	pos[0]--;
	pos[1]-= pos[0]+1;

	vc.style.left = (cont.offsetLeft+pos[0]*(cont.offsetWidth-10)/6+5)+"px";
	vc.style.width = (pos[1]*(cont.offsetWidth-10)/6)+"px";
}

function stopfollowing() {
	document.body.removeEventListener("pointermove",follow);
	document.body.removeEventListener("pointerup",stopfollowing);

	var cont = document.getElementById("content");
	var fol = document.getElementById("follows");
	var x = fol.offsetLeft + fol.offsetWidth/2 - cont.offsetLeft;
	var y = fol.offsetTop + fol.offsetHeight/2 - cont.offsetTop;
	
	document.getElementById("virtualContent").style.width = "0px";

	var pos = placingByMouse(x,cont);

	var nel = document.createElement("div");
	nel.style = `grid-column-start:${pos[0]}; grid-column-end:${pos[1]}`;
	nel.innerHTML = `<h2 onpointerdown="contentElementClick(${ind}, this)">${camers[ind][0]}</h2>
			<button onclick="contentElementRemove(this)">x</button>
			<iframe src="${camers[ind][1]}"></iframe>`;
	cont.appendChild(nel);
	document.getElementById("follows").style.left = "-1000px";
	localStorage.setItem("camViewElem",document.getElementById("content").innerHTML);
}

function contentElementClick(index, elem) {
	ind = index;
	elem.parentElement.remove();
	document.getElementById("follows").innerHTML = camers[index][0];
	document.body.addEventListener("pointermove",follow);
	document.body.addEventListener("pointerup",stopfollowing);
}

function contentElementRemove(elem) {
	elem.parentElement.remove();
	localStorage.setItem("camViewElem",document.getElementById("content").innerHTML);
}

function clearContent() {
	document.getElementById("content").innerHTML = "";
	localStorage.clear();
}

function onLoad() {
	document.getElementById("content").innerHTML = localStorage.getItem("camViewElem");
	// Unpack camers
	let l = localStorage.getItem("camListLength")
	if (l != null) {
		console.log("camers unpacking",l)
		camers = [];
		l = Number(l);
		for (let i = 0; i < l; i++) {
			camers.push([localStorage.getItem("camListName"+i),localStorage.getItem("camListUrl"+i)]);
		}
	}
	//camViewUpdate();
	camUpdate();
}