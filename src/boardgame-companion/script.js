const rollBtn = document.getElementById("rollBtn");
const category = document.getElementById("category");
const questionBox = document.getElementById("questionBox");
const answerBox = document.getElementById("answerBox");

const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

let player = 1;
let p1 = 0;
let p2 = 0;
let currentAnswer = "";

const categories = {
    1: "History",
    2: "Science",
    3: "Sports",
    4: "Geography",
    5: "Entertainment",
    6: "General Knowledge"
};

rollBtn.addEventListener("click", async () => {

    const roll = Math.floor(Math.random() * 6) + 1;

    document.getElementById("dice").textContent = roll;

    category.textContent = "Category: " + categories[roll];

    const response = await fetch(
        "https://opentdb.com/api.php?amount=1&type=multiple"
    );

    const data = await response.json();

    questionBox.innerHTML = data.results[0].question;

    currentAnswer = data.results[0].correct_answer;

    answerBox.innerHTML = "";
});

document.getElementById("showAnswer").addEventListener("click", () => {
    answerBox.innerHTML = currentAnswer;
});

document.getElementById("addPoint").addEventListener("click", () => {

    if(player === 1){
        p1++;
        score1.textContent = p1;
        player = 2;
    } else {
        p2++;
        score2.textContent = p2;
        player = 1;
    }

    document.getElementById("currentPlayer").textContent =
        `Player ${player}'s Turn`;
});