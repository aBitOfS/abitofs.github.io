class RepairQuiz {
	questionIndex = -1;
	displayingQuesions = [];
	nextQuestion() {
		if (this.quiz.questions.length > ++this.questionIndex) {
			this.displayingQuesions.push(this.questionIndex);
			let newChild = document.createElement("div");
			newChild.innerHTML = `<h3>${this.quiz.questions[this.questionIndex][0]}<h3>
			<input onkeydown="repairQuiz.submit(event,this,${this.questionIndex})"
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

repairQuiz = new RepairQuiz();