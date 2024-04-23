/*class RepairQuiz {
	questionIndex = -1;
	displayingQuesions = [];
	nextQuestion() {
		if (this.quiz.questions.length > ++this.questionIndex) {
			this.displayingQuesions.push(this.questionIndex);
			let newChild = document.createElement("div");
			newChild.innerHTML = `<h3>${this.quiz.questions[this.questionIndex][0]}<h3>
			<input onkeydown="repairQuiz.submit(event,this,${this.questionIndex})" onsubmit="repairQuiz.submit(event,this,${this.questionIndex})"
			id="question${this.questionIndex}"/>`;
			this.htmlmain.append(newChild);
		}
	}
	start() {
		this.htmlmain = document.getElementsByTagName("main")[0];
		this.quiz = new SampleQuiz();
		for (let i = 0; i < this.quiz.questions.length; i++)
			this.nextQuestion();
		document.getElementById(`question${this.displayingQuesions[0]}`).focus()
	}
	submit(event, element, qInd) {
		if (event.key === "Enter") {
			if (element.value == this.quiz.questions[qInd][1]) {
				element.parentElement.parentElement.classList.add("good");
				element.parentElement.parentElement.classList.remove("bad");
			}
			else {
				element.parentElement.parentElement.classList.add("bad");
				element.parentElement.parentElement.classList.remove("good");
			}
			let ind =this.displayingQuesions.indexOf(qInd);
			if (ind >= 0)
				this.displayingQuesions.splice(ind,1);
			this.nextQuestion();
			if (this.displayingQuesions.length > 0)
				document.getElementById(`question${this.displayingQuesions[0]}`).focus();
		}
	}
}
class SampleQuiz {
	name = "Sample";
	questions = [
		["Jakiego koloru jest niebo", "niebieskie"],
		["Jakiego koloru jest morze", "niebieskie"],
		["Jakiego koloru jest Ziemia", "niebieska"],
		["Jakiego koloru jest Kosmos", "czarny"]
	]
}

repairQuiz = new RepairQuiz();*/

class nRepairQuiz {
	questions = []
	secondRound = [["capable",2],["usual",0],["willing",0],["logical",4],
		["approve",1],["adequate",2],["responsible",5],["legal",4],
		["probable",3],["mature",3],["safe",0]]
	correctCount = 0
	start() {
		// Setup
		this.qelem = document.getElementById("pqTemplate");
		this.main = document.getElementsByTagName("main")[0];
		// Sortowanie pytań
		this.setupQuestions()
	}
	restart(elem) {
		elem.classList.add("disappear")
		setTimeout(() => {
			let el = document.getElementById("finishMessage");
			document.getElementById("templateBox").appendChild(el);
			el.classList.remove("disappear");
		},1950)

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
			let nn = this.qelem.cloneNode(true);
			nn.children[0].innerHTML = this.questions[0][0];
			nn.classList.add("question")
			this.main.appendChild(nn);
		}
		else {
			let el = document.getElementById("finishMessage");
			let counters = el.getElementsByTagName("span");
			counters[0].innerText = this.correctCount;
			counters[1].innerText = this.secondRound.length + this.correctCount;
			this.main.append(el)
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

repairQuiz = new nRepairQuiz();