// Selects element by class
var timeEl = document.querySelector(".time");   // Timer
var scoreEl = document.querySelector(".score"); // Score

var timeIndEl = document.querySelector("#timeInd");   // -10 next to timer when incorrect
var scoreIndEl = document.querySelector("#scoreInd"); // +1 next to score when correct
var questionEl = document.querySelector(".question"); // element holds question

// Selects element by id
var mainEl = document.getElementById("main");

// Scoreboard Names
var scoreboard = [];

// Set up scoreboard from local storage
if (localStorage.getItem("scoreboard")) {
  scoreboard = JSON.parse(localStorage.getItem("scoreboard"))

  scoreboard.forEach(element => {
    document.querySelector("#scoreBoard").appendChild(newScore(element.name, element.score));
  });
}

// Stores the information of each button
const buttonInfo = [
  {
    value: 'A',
    domVal: document.querySelector("#A")
  },
  {
    value: 'B',
    domVal: document.querySelector("#B")
  },
  {
    value: 'C',
    domVal: document.querySelector("#C")
  },
  {
    value: 'D',
    domVal: document.querySelector("#D")
  }
]

// List of questions
const questionList = [
  {
    correct: 'D',
    question: "Whats the fourth letter in the alphabet?",
    answers: [
      "A",
      "B",
      "C",
      "D"
    ]
  },
  {
    correct: 'C',
    question: "How many numbers are in the alphabet?",
    answers: [
      "27",
      "26",
      "0",
      "28"
    ]
  },
  {
    correct: 'A',
    question: "What is the furthest year from today? (sept. 22, 2021)",
    answers: [
      "1892",
      "1992",
      "2027",
      "2018"
    ]
  },
  {
    correct: 'B',
    question: "How many sides does a pentagon have?",
    answers: [
      "10",
      "5",
      "6",
      "2"
    ]
  },
  {
    correct: 'B',
    question: "How many sides does a octagon have?",
    answers: [
      "10",
      "8",
      "6",
      "2"
    ]
  }
]

var currentQuestion;      // Current question info
var currentQuestionIndex; // Current index of question if 0 then game ends

var timerInterval;        // Timer tick update
var secondsLeft;          // Max time

function startGame() {

  // Reveal and or remove items to make game show
  document.querySelector("#scoreBoard").classList.add("none");
  document.querySelector("#game").classList.remove("none");
  document.querySelector("#start").classList.add("none");
  document.querySelector("#form").classList.add("none");

  secondsLeft = 50;
  currentQuestionIndex = questionList.length - 1;
  scoreEl.textContent = "0";
  timeEl.textContent = "" + secondsLeft;

  newQuestion(); // populates variable in html with question at given index

  // Sets interval in variable
  timerInterval = setInterval(function () {
    scoreIndEl.classList.remove("show");
    timeIndEl.classList.remove("show");

    secondsLeft--;
    timeEl.textContent = secondsLeft;

    if (secondsLeft <= 0)
      endGame();

  }, 1000);
}

// Resets game
function endGame() {
  clearInterval(timerInterval);
  
  scoreIndEl.classList.remove("show");
  timeIndEl.classList.remove("show");

  // Show scoreboard instead of game
  document.querySelector("#game").classList.add("none");
  document.querySelector("#scoreBoard").classList.remove("none");
  document.querySelector("#form").classList.remove("none");
  document.querySelector("#start").classList.remove("none");
  timeEl.textContent = "" + 0; // in case game time went negative, reset to 0

}

// Populates HTML
function newQuestion() {
  currentQuestion = questionList[currentQuestionIndex];

  for (var i = 0; i < buttonInfo.length; i++) {
    buttonInfo[i].domVal.textContent = currentQuestion.answers[i];
  }
  questionEl.textContent = currentQuestion.question;

}

// Sets html indicator +1 by score and increases score
function incScore() {
  var currentScore = parseInt(scoreEl.textContent);
  scoreEl.textContent = currentScore + 1;
  scoreIndEl.classList.add("show");

}

// Sets html indicator -10 seconds by timer and decreases timer
function decTime() {

  secondsLeft -= 10;
  timeEl.textContent = secondsLeft;

  timeIndEl.classList.add("show");
}

function checkAnswer(answer) {
  if (answer === currentQuestion.correct)
    incScore();
  else
    decTime();

  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    newQuestion();
  } else
    endGame();

}

// Builds score html element to add to score list
function newScore(name, score) {
  var newDiv = document.createElement("div");
  newDiv.classList.add("scoreElement");
  var h1 = document.createElement("h1");
  h1.textContent = name;
  var span = document.createElement("span");
  span.classList.add("hoverRight");
  span.textContent = "" + score;
  h1.appendChild(span);
  newDiv.appendChild(h1);
  return newDiv;
}

// Checks if score already exists in scoreboard
function scoreExists(name) {
  for (var i = 0; i < scoreboard.length; i++) {
    if (scoreboard[i].name === name)
      return scoreboard[i];
  }
}

// Start game button listener
document.querySelector("#start").addEventListener("click", startGame);

// For each button make a listener that passes the buttons value as a parameter
buttonInfo.forEach(button => { button.domVal.addEventListener("click", () => { checkAnswer(button.value) }) });

// Add scoreboard element
document.querySelector("#btnAddName").addEventListener("click", (event) => {
  event.preventDefault();
  var name = document.querySelector("#addName").value;

  if (name !== "") { // No name input
    var score = parseInt(scoreEl.textContent); // Gets score

    var scoreExist = scoreExists(name);

    if (scoreExist) {
      scoreExist.score = score;
    } else { // Add new score
      scoreboard.push({
        name: name,
        score: score
      });
    }

    // sort by score in scoreboard
    scoreboard.sort((a, b) => (a.score > b.score) ? -1 : 1)

    // Update local storage
    localStorage.setItem("scoreboard", JSON.stringify(scoreboard));

    // Reset and populate scoreboard
    document.querySelector("#scoreBoard").innerHTML = "";
    document.querySelector("#scoreBoard").appendChild(newScore("Name", "Score"));
    scoreboard.forEach(element => {
      document.querySelector("#scoreBoard").appendChild(newScore(element.name, element.score));
    });

    // Hide button and text field when name added
    document.querySelector("#addName").value = "";
    document.querySelector("#form").classList.add("none");
  }

});


