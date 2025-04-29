// Select Elements from html
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let countSpan = document.querySelector(".count span");
let categorySpan = document.querySelector(".category span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let numberOfquestions = 10;
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getRandomUniqueValues(max, count) {
  // Check if count is greater than max, which is not allowed
  if (count > max) {
    throw new Error("Count cannot be greater than max.");
  }

  // Create a Set to store unique random values (Set automatically ensures uniqueness)
  const values = new Set();

  // Keep generating random values until we have 'count' unique values
  while (values.size < count) {
    // Generate a random number between 1 and max (inclusive)
    const randomValue = Math.floor(Math.random() * max) + 1;

    // Add the random value to the Set (duplicates are automatically ignored)
    values.add(randomValue);
  }

  // Convert the Set to an array and return the result
  return [...values];
}
// // Example usage:
// const randomValues = getRandomUniqueValues(80, 10);
// console.log(randomValues);

// array types category
const types = ["series", "football", "food", "religious"];

// random index of array
const randomIndex = Math.floor(Math.random() * types.length);
const randomType = types[randomIndex];
const randomNameFile = `${randomType}_questions.json`;
// console.log(randomType);

function getQuestions() {
  let myRequset = new XMLHttpRequest();

  myRequset.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;

      // create Bullets + Set Questions Count
      createBullets(numberOfquestions);

      // Call a function Random
      const randomValues = getRandomUniqueValues(
        questionCount,
        numberOfquestions
      );
      // console.log(randomValues);

      // Add Question Data
      addQuestionsData(
        questionObject[randomValues[currentIndex] - 1],
        numberOfquestions
      );
      // console.log(randomValues[currentIndex] - 1);
      // Click On Submit

      // Start CountDown
      countdown(10, numberOfquestions);

      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer =
          questionObject[randomValues[currentIndex] - 1].right_answer;
        // console.log(theRightAnswer);

        // Increase Index
        currentIndex++;

        // check The Answer
        checkAnswer(theRightAnswer);

        // remove Previous Questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionsData(questionObject[randomValues[currentIndex] - 1], numberOfquestions);

        // Handle Bullets Class
        handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
        countdown(10, numberOfquestions);

        // Show Results
        showResults(numberOfquestions);
      };
    }
  };

  myRequset.open("GET", randomNameFile, true);
  myRequset.send();
}

getQuestions();

function createBullets(num) {
  // number of questions count
  countSpan.textContent = num;

  // name of category
  categorySpan.textContent = randomType;

  // Create span
  for (let i = 0; i < num; i++) {
    // Create bullets
    let theBullets = document.createElement("span");

    if (i === 0) {
      theBullets.className = "on";
    }

    // Append span to main bullets container
    bulletsSpanContainer.appendChild(theBullets);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    // create H2 Questions Title
    let questionTitle = document.createElement("h2");

    // create Questions Text
    let questionsText = document.createTextNode(obj["title"]);

    // Append text To title
    questionTitle.appendChild(questionsText);

    // Append title To quiz-area
    quizArea.appendChild(questionTitle);

    // create The Answer
    for (let i = 1; i <= 4; i++) {
      // create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add class To main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // if (i === 1) {
      //   radioInput.checked = true;
      // }

      // Create Label
      let theLabel = document.createElement("label");

      // Add for Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Append Text To Label
      theLabel.appendChild(theLabelText);

      // Append input + label To Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append main Div TO answers-area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(aAnswer) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }



  if (aAnswer === theChoosenAnswer) {
    rightAnswer++;
    console.log("Good Answer");
  }
  else {
    console.log("the Right Answer is : " + aAnswer );
    console.log("the choosen Answer is : " + theChoosenAnswer );
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOFSpans = Array.from(bulletsSpans);
  arrayOFSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    } else {
      span.classList.remove("on");
    }
  });
};

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswer > (count / 2) && rightAnswer < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
    };

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  };
};

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }

    }, 1000);
  }
}
