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
	questions = [["capable",2],["usual",0],["willing",0],["logical",4],
		["approve",1],["adequate",2],["responsible",5],["legal",4],
		["probable",3],["mature",3],["safe",0]]
	questionIndex = -1
	correctCount = 0
	start() {
		this.qelem = document.getElementById("pqTemplate");
		this.main = document.getElementsByTagName("main")[0];
		//this.field = QuestionField(this.questions[0][0])
		this.nextQuestion();
	}
	nextQuestion() {
		this.questionIndex++;
		if (this.questionIndex < this.questions.length) {
			//this.field.header = this.questions[this.questionIndex][0]
			let nn = this.qelem.cloneNode(true);
			nn.children[0].innerHTML = this.questions[this.questionIndex][0];
			this.main.appendChild(nn);
		}
		else {
			let el = document.getElementById("finshMessage");
			let counters = el.getElementsByTagName("span");
			counters[0].innerText = this.correctCount;
			counters[1].innerText = this.questions.length;
			this.main.append(el)
		}
	}
	answer(ans, elem) {
		let correct = this.questions[this.questionIndex][1];
		if (ans == correct) {
			elem.classList.add("good");
			this.correctCount++;
		}
		else
			elem.classList.add("bad");
		elem.children[2+Math.trunc(correct/3)].children[correct%3].classList.add("correct");
		this.nextQuestion()
		setTimeout(()=>{elem.remove()},1950)
	}
	goodAnswer() {}
	badAnswer() {

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