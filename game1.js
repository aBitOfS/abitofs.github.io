function rand(max) {
	return Math.floor(Math.random() * max);
}
function collide(clickX, clickY, x, y, w, h) {
	if (clickX > x && clickX < x + w && clickY > y && clickY < y + h)
		return true;
	else
		return false;
}

// Game Functions
var c; // canvas

var game = {
	can: document.getElementsByTagName("canvas")[0],
	cW: 800,
	cH: 600,
	initialization: function () {
		this.size();
		window.addEventListener("resize", this.size);
		c = this.can.getContext("2d");
		this.startScreen();
	},
	size: function () { // NOT WORK
		//document.documentElement.requestFullscreen();
		this.can.width = document.documentElement.clientWidth;
		this.can.height = document.documentElement.clientHeight;
		this.cW = this.can.width;
		this.cH = this.can.height;
		game.ui.buttonsInitialization();
	},
	startScreen: function () {
		// Ekran startowy
		c.fillStyle = "red";
		c.fillRect(this.cW / 2 - 150, this.cH / 2 - 50, 300, 100);
		c.font = "60px Arial";
		c.fillStyle = "white";
		c.fillText("Start", this.cW / 2 - 60, this.cH / 2 + 20);
		this.can.addEventListener("click", game.startButtonClick);
	},
	startButtonClick: function (event) {
		if (collide(event.offsetX, event.offsetY, game.cW / 2 - 150, game.cH / 2 - 50, 300, 100)) {
			map.generate(40, 0);
			setInterval(game.play, 10);
			game.can.removeEventListener("click", game.startButtonClick);
			document.addEventListener("mousemove", game.click);
			document.addEventListener("click", game.click);
			document.addEventListener("mousedown", player.mouseButtonClick);
			document.addEventListener("mouseup", player.mouseButtonClick);
			document.addEventListener("mousemove", player.mousePositionSet);
			document.addEventListener("keydown", player.key);
		}
	},
	doing: 0, // 0> - equipment, 0 - none, 1 - sword, 2 - bow, 3 - pickaxe, 4 - build, 5-9 - build categories, 9> - building
	mainMenuOpen: false,
	buttonsPrefab: [[
		["Resume", function () { game.mainMenuOpen = false }], ["Save", function () { game.saveGame(); }], ["Load", function () { game.loadGame(); }],
		["Options", function () { alert("Function unavaliable"); }], ["Quit", function () { alert("Function unavaliable"); }]
	], [
		["sword", "white", "rgba(255,0,0,0.9)", "sword"], ["bow", "black", "rgba(255,255,255,0.9)", "bow"], ["pickaxe", "white", "rgba(30, 140, 65,0.9)", "pickaxe"],
		["build", "white", "rgba(0, 0, 255,0.9)", "build"]
	], [
		["people","house"],["mining","None"],["factoring","None"],["armory","None"],["fortifications","None"]
	], [
		["cottage", "None"], ["house", "house"]
	],[
		["woodcutter","None"],["mine", "None"]
	],[
		["factory","None"]
	],[
		["armory", "None"]
	],[
		["gate", "None"],["tower","None"],["castle","None"]
	]],
	ui: {
		buttons: [[[]],[[]],[[]],[[]],[[]],[[]],[[]],[[]]], // equal number as buttonsPrefab
		buttonsInitialization() {
			// Creating buttons functionality
			var buttonClick = function () {
				if (collide(player.mousePosition[0], player.mousePosition[1], this.x, this.y+this.highlight, this.w, this.h)) {
					game.doing = this.doing + 1 == game.doing ? 0 : this.doing + 1;
					return true;
				}
				return false;
			}
				
			var buttonRenderMenuBar = function () {
				if (this.doing + 1 == game.doing) {
					if (this.highlight > -50)
						this.highlight -= 4;
				}
				else {
					if ((game.doing >= 4 && this.highlight < game.cH / 10 * 0.75) || this.highlight < 0)
						this.highlight += 3;
					else if (game.doing < 4 && this.highlight > 0) {
						this.highlight -= 4;
						if (this.highlight < 0)
							this.highlight = 0;
					}
				}

				c.fillStyle = this.bgcolor;
				c.fillRect(this.x, this.y + this.highlight, this.w, this.h);
				if (this.image != "None")
					c.drawImage(document.getElementById(this.image), this.x, this.y + this.highlight-35, this.w, this.h);
				c.fillStyle = this.color;
				c.fillText(this.text, this.x + (this.w / 2), this.y + this.highlight +this.h-15);
			}
			var buttonRenderOpenMenu = function () {
				c.fillStyle = "rgba(200,50,50,0.9)";
				c.fillRect(100, 50, 100, 50);
				c.fillStyle = "white";
				c.fillText("MENU", 150, 85);
			}
			var buttonRenderMainMenu = function () {
				c.fillStyle = "rgba(255,255,255,0.8)";
				c.fillRect(this.x-5, this.y-5, this.w+10, this.h+10);
				c.fillStyle = "rgba(200,50,50,0.9)";
				c.fillRect(this.x, this.y, this.w, this.h);
				c.fillStyle = "rgba(250,250,250,1)";
				c.fillText(this.text, this.x+this.w/2, this.y+this.h/2+10);
			}
			var buttonRenderBuildCategory = function () {
				c.fillStyle = "rgba(255,255,255,1)";
				if (this.img != "None")
					c.drawImage(document.getElementById(this.img),this.x,this.y, this.h, this.h);
				c.fillText(this.text, this.x + (this.w + this.h) / 2, this.y + 30);
			}
			var buttonRenderBuilding = function () {
				c.fillStyle = "rgba(0,0,0,0.5)"
				c.fillRect(this.x, this.y, this.w, this.h)
				c.fillStyle = "white"
				if (this.img != "None")
					c.drawImage(document.getElementById(this.img), this.x + this.w/2 - this.h/2, this.y - 30, this.h, this.h)
				c.fillText(this.text, this.x + this.w / 2, this.y + this.h - 15)
			}
			
			// Inserting buttons functionality

			// Main Menu buttons
			var space = game.cH / 20;
			for (let bIndex = 0; bIndex < game.buttonsPrefab[0].length; bIndex++) {
				var b = game.buttonsPrefab[0][bIndex];
				this.buttons[0][bIndex] = {text: b[0], x: game.cW / 10 * 3, y: space * (bIndex + 1) * 3, w: game.cW / 10 * 4, h: space * 2, render: buttonRenderMainMenu,
					onClick: function () { if (collide(player.mousePosition[0], player.mousePosition[1], this.x, this.y, this.w, this.h)) { this.func(); } }, func: b[1] };
			}
			// Menu bar buttons
			space = game.cW / (game.buttonsPrefab[1].length * 3 + 1);
			for (let bIndex = 0; bIndex < game.buttonsPrefab[1].length; bIndex++) {
				var b = game.buttonsPrefab[1][bIndex];
				game.ui.buttons[1][bIndex] = {x: (1 + bIndex * 3) * space, w: 2 * space, y: game.cH / 10 * 8.25, h: game.cH / 10 * 1.5, text: b[0], color: b[1], bgcolor: b[2],
					image: b[3], doing: bIndex, render: buttonRenderMenuBar, onClick: buttonClick, highlight: 0};
			}
			game.ui.buttons[1][game.buttonsPrefab[1].length] = {render: buttonRenderOpenMenu,
				onClick: function () { if (collide(player.mousePosition[0], player.mousePosition[1], 100, 50, 100, 50)) { game.mainMenuOpen = true; } }};

			// Built Menu buttons

			//		Category
			space = (game.cW - (3.5 * space)) / (game.buttonsPrefab[2].length * 4);
			for (let bIndex = 0; bIndex < game.buttonsPrefab[2].length; bIndex++) {
				b = game.buttonsPrefab[2][bIndex];
				game.ui.buttons[2][bIndex] = { x: space * (bIndex*4 + 1), y: game.cH / 10 * 8, w: space * 3, h: game.cH / 15, text: b[0], img: b[1], doing: bIndex + 4,
					render: buttonRenderBuildCategory, onClick: buttonClick, highlight: 0 };
			}

			//		Building
			let d = 4 + game.buttonsPrefab[2].length;
			for (var i = 3; i < game.buttonsPrefab.length; i++) {
				space = game.cW / (3 * game.buttonsPrefab[i].length + 1)
				for (var j = 0; j < game.buttonsPrefab[i].length; j++) {
					b = game.buttonsPrefab[i][j]
					game.ui.buttons[i][j] = { x: space * (j * 3 + 1), y: game.cH / 10 * 7, w: space * 2, h: game.cH / 5, text: b[0], img: b[1], doing: d,
						render: buttonRenderBuilding, onClick: buttonClick, highlight: 0 }
					d++;
				}
			}

			// Equiment buttons

		},
		render() {
			c.fillStyle = "rgba(25,25,100,0.9)";
			c.fillRect(0, game.cH / 10 * 9, game.cW, game.cH / 10);
			c.font = "30px Calibri";
			c.textAlign = "center";
			if (game.doing >= 4 && game.doing <= 4 + game.buttonsPrefab[2].length)
			{
				c.fillStyle = "rgba(75,75,100,0.9)"
				c.fillRect(0, game.cH / 10 * 8, game.cW, game.cH / 10);
				for (let i = 0; i < this.buttons[game.doing - 2].length; i++)
					this.buttons[game.doing - 2][i].render();
			}
			for (let i = 0; i < this.buttons[1].length; i++) {
				this.buttons[1][i].render();
			}
			if (game.doing < 0) {

			}
			if (game.mainMenuOpen) {
				c.fillStyle = "rgba(0,0,0,0.3)"
				c.fillRect(0, 0, game.cW, game.cH);
				for (let i = 0; i < this.buttons[0].length; i++) {
					this.buttons[0][i].render();
				}
			}
		},
	},
	click() {
		var clicked = false;
		if (event.type == "click") {
			if (!game.mainMenuOpen) {
				for (let i = 1; i < 2; i++) {
					for (let j = 0; j < game.ui.buttons[i].length; j++) {
						if (game.ui.buttons[i][j].onClick()) // ERROR - onClick is not a function
							clicked = true;
					}
				}
				if (game.doing >= 4 && game.doing <= 9) {
					for (var i = 0; i < game.ui.buttons[game.doing - 2].length; i++) {
						if (game.ui.buttons[game.doing - 2][i].onClick())
							clicked = true;
					}
				}
			}
			else {
				for (let j = 0; j < game.ui.buttons[0].length; j++) {
					game.ui.buttons[0][j].onClick();
				}
			}
		}
		if (event.type == "click" && !clicked && !game.mainMenuOpen) {

		}
		if ((event.type == "click" || event.buttons == 1) && game.doing >= 4 && !clicked && !game.mainMenuOpen)
			player.building(game.doing - 4);
	},
	play: function () {
		map.draw();
		player.moveRender();
		game.ui.render();
	},
	saveGame() { alert("Filed to save");}, //Empty
	loadGame() { alert("Filed to load");}, //Empty
};

var map = {
	map: [[], [], []],
	scale: 50,
	position: [0, 0],
	//          green     d green   f green   brown1    brown2    brown3      
	colors: [["#00a32c", "#046e20", "#00eb3f", "#806e47", "#4f401f", "#59400b"], // 0 - forest
		//
	],
	//
	buildings: [[["Detached house", "house"]]],
	halfType: function (stepAble, strength) {
		this.strength = strength;
		this.stepAble = stepAble;
	},
	element: function (bgcolor, imageOrColor, type) {
		this.bgcolor = bgcolor;
		this.imageOrColor = imageOrColor; // if color begins with # and apperars as a spot on bgcolor
		this.type = type; // is it ore of rock or any other
		this.show = function (positionX, positionY) {
			c.fillStyle = this.bgcolor;
			c.fillRect(positionX, positionY, map.scale + 1, map.scale + 1);
		}
	},
	generate: function (mapSize, mapIndex) {
		this.map[mapIndex] = [[]];
		var theme = rand(this.colors.length);
		for (let i = 0; i < mapSize; i++) {
			var m = [];
			for (let j = 0; j < mapSize; j++) {
				var stepAble = (i + 2 > mapSize / 2 && i - 2 < mapSize / 2 && j + 2 > mapSize / 2 && j - 2 < mapSize / 2) ? true : (rand(10) > 8 ? false : true);
				m[j] = new this.element(stepAble ? this.colors[theme][rand(this.colors[theme].length)] : "grey",// bgcolor
					this.colors[theme][rand(this.colors[theme].length)],//color
					new this.halfType(stepAble, 0)// properties
				);
			}
			this.map[mapIndex][i] = m;
		}
	},
	draw() {
		var x, y;
		c.clearRect(0, 0, game.cW, game.cH)

		sx = Math.round((-100 - game.cW / 2) / map.scale - map.position[0] + map.map[0].length / 2);
		sy = Math.round((-100 - game.cH / 2) / map.scale - map.position[1] + map.map[0].length / 2);

		ex = Math.round((100 + game.cW / 2) / map.scale - map.position[0] + map.map[0].length / 2);
		ey = Math.round((100 + game.cH / 2) / map.scale - map.position[1] + map.map[0].length / 2);

		if (sx < 0)
			sx = 0;
		if (ex > this.map[0].length)
			ex = this.map[0].length - 1

		if (sy < 0)
			sy = 0;
		if (ey > this.map[0].length)
			ey = this.map[0][0].length - 1

		for (let i = sx; i < ex; i++) {
			for (let j = sy; j < ey; j++) {
				x = game.cW / 2 + (i + this.position[0] - this.map[0].length / 2) * this.scale;
				y = game.cH / 2 + (j + this.position[1] - this.map[0].length / 2) * this.scale;
				this.map[0][i][j].show(x, y, this.scale);
			}
		}
	},
};

var player = {
	mousePosition: [0, 0],
	mousePositionSet(event) {
		player.mousePosition = [event.clientX, event.clientY];
	},
	mouseButtons: [false, false, false],
	mouseButtonClick(event) {
		player.mouseButtons[event.button] = event.type == "mousedown";
	},
	key(event) {
		if (event.key == "Escape") {
			game.mainMenuOpen = !game.mainMenuOpen;
		}
	},
	speed: 0.05,
	moveRender: function () {
		var angle;
		if (this.mousePosition[1] == game.cH / 2)
			angle = Math.PI * ((this.mousePosition[0] > game.cW / 2) ? 3 / 2 : 1 / 2);
		else {
			angle = Math.atan((this.mousePosition[0] - game.cW / 2) / (this.mousePosition[1] - game.cH / 2));
			if (this.mousePosition[1] > game.cH / 2)
				angle += Math.PI;
		}
		c.translate(game.cW / 2, game.cH / 2);
		c.rotate(-angle);
		c.drawImage(document.getElementById("playerImg"), -map.scale / 2, -map.scale / 2, map.scale, map.scale);
		c.rotate(angle);
		c.translate(-game.cW / 2, -game.cH / 2);
		
		if (this.mouseButtons[2] && !game.mainMenuOpen) {
			var can = [true, true, true];
			var newPos = [[map.position[0] + Math.sin(angle) * this.speed, map.position[1] + Math.cos(angle) * this.speed],
			[map.position[0] + Math.sin(angle) * this.speed, map.position[1]],
			[map.position[0], map.position[1] + Math.cos(angle) * this.speed]];
			for (let p = 0; p < 3; p++) {
				for (let i = 0; i < 2; i++) {
					for (let j = 0; j < 2; j++) {
						if (map.map[0][Math.round(-newPos[p][0] - i) + map.map[0].length / 2][Math.round(-newPos[p][1] - j) + map.map[0].length / 2].type.stepAble == false) {
							can[p] = false;
							break;
						}
					}
				}
			}
			if (can[0])
				map.position = newPos[0];
			else if (can[1])
				map.position = newPos[1];
			else if (can[2])
				map.position = newPos[2];
				
		}
	},
	building(event) {
		var i = (player.mousePosition[0] - game.cW / 2) / map.scale - map.position[0] + map.map[0].length / 2;
		var j = (player.mousePosition[1] - game.cH / 2) / map.scale - map.position[1] + map.map[0].length / 2;
		map.map[0][Math.round(i - 0.5)][Math.round(j - 0.5)].bgcolor = "black";
	},
};
document.close();
var testing = function () {
	game.size();
	window.addEventListener("resize", game.size);
	c = game.can.getContext("2d");
	map.generate(50, 0);
	setInterval(game.play, 10);
	document.addEventListener("mousemove", game.click);
	document.addEventListener("click", game.click);
	document.addEventListener("mousedown", player.mouseButtonClick);
	document.addEventListener("mouseup", player.mouseButtonClick);
	document.addEventListener("mousemove", player.mousePositionSet);
	document.addEventListener("keydown", player.key);
}
game.initialization();
//testing();

// budowanie po zamkniêciu menu, budowanie pod t³em menu

/*

i = (x - game.cW / 2) / map.scale - map.position[0] + map.map[m].length / 2 



y = game.cH / 2 + (j + this.position[1] - this.map[m][i].length / 2) * this.scale;
 
 
 */