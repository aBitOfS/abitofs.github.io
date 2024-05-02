class RepairQuiz {
	qelem: HTMLElement | null;
	main: HTMLElement | null;
	questions: [string,number][] = []
	secondRound: [string,number][] = [["capable",2],["usual",0],["willing",0],["logical",4],
		["approve",1],["adequate",2],["responsible",5],["legal",4],
		["probable",3],["mature",3],["safe",0]]
	correctCount = 0
	finished = false
	start() {
		// Setup
		this.qelem = document.getElementById("pqTemplate");
		this.main = document.getElementsByTagName("main")[0];
		// Sortowanie pytań
		this.setupQuestions()
	}
	restart(elem) {
		elem.classList.add("disappear")
		setTimeout(()=>{elem.remove()},1950)

		this.setupQuestions()
	}
	setupQuestions() {
		this.correctCount = 0;
		if (this.secondRound.length == 0)
			location.reload()
		while (this.secondRound.length > 0) {
			let pos = Math.floor(Math.random() * this.secondRound.length);
			this.questions.push(this.secondRound[pos]);
			this.secondRound.splice(pos,1);
		}

		//this.field = QuestionField(this.questions[0][0])
		this.nextQuestion();
	}
	nextQuestion() {
		if (this.questions.length > 0) {
			//this.field.header = this.questions[0][0]
			if (!this.qelem || !this.main) return;
			let nn = this.qelem.cloneNode(true) as HTMLElement;
			nn.children[0].textContent = this.questions[0][0];
			nn.classList.add("question")
			this.main.appendChild(nn);
		}
		else {
			this.finished = true
			let fin = document.getElementById("finishMessage");
			if (!fin || !this.main) return;
			let el = fin.cloneNode(true) as HTMLElement;
			let counters = el.getElementsByTagName("span");
			counters[0].innerText = this.correctCount.toString();
			counters[1].innerText = (this.secondRound.length + this.correctCount).toString();
			this.main.appendChild(el)
		}
	}
	answer(ans, elem) {
		if (!elem.classList.contains("question"))
			return
		let correct = this.questions[0][1];
		if (ans == correct) {
			elem.classList.add("good");
			this.correctCount++;
		}
		else {
			elem.classList.add("bad");
			this.secondRound.push(this.questions[0])
		}
		elem.children[2+Math.trunc(correct/3)].children[correct%3].classList.add("correct");
		elem.classList.add("disappear")
		elem.classList.remove("question")
		this.questions.shift()
		this.nextQuestion()
		setTimeout(()=>{elem.remove()},1950)
	}
	goodAnswer() {}
	badAnswer() {

	}
	keyboard(event) {
		if (!isNaN(event.key) && parseInt(event.key) > 0 && parseInt(event.key) < 7
			&& document.getElementsByClassName("question").length > 0)
			this.answer(parseInt(event.key)-1,document.getElementsByClassName("question")[0])
	}
}
var QuestionField = function(question, answers, correct, parent) {
	let elem = document.createElement("div");
	elem.classList.add("pinquestion");

	let headerElem = document.createElement("h3");
	headerElem.innerText=question;

	let inputElem = document.createElement("input");
	inputElem.type = "password";

	let answersElems = []
	for (let i = 0; i < answers.length; i++) {
		let el = document.createElement("button");
		if (i === correct)
			el.onclick = parent.goodAnswer()
		else
			el.onclick = parent.badAnswer()
	}

	elem.appendChild(headerElem);
	elem.appendChild(inputElem);
	document.body.appendChild(elem);
	return {
		set header(newHeader) {
			headerElem.innerText = newHeader;
		},
	}
}

const repairQuiz = new RepairQuiz();