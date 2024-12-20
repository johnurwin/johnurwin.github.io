// Question bank with multiple-choice answers and correct answers
const questions = [
    {
        question: "What is the output of `len([1, 2, 3])` in Python?",
        choices: ["2", "3", "4", "Error"],
        answer: "3",
    },
    {
        question: "Which library is used for data manipulation in Python?",
        choices: ["NumPy", "Matplotlib", "Pandas", "Scikit-learn"],
        answer: "Pandas",
    },
    {
        question: "What is the result of `2 ** 3` in Python?",
        choices: ["6", "8", "9", "Error"],
        answer: "8",
    },
    {
        question: "Which metric measures the average squared error of a model?",
        choices: ["MAE", "R2", "MSE", "RMSE"],
        answer: "MSE",
    },
    {
        question: "Which Python library is used for creating machine learning models?",
        choices: ["TensorFlow", "Pandas", "Seaborn", "Scikit-learn"],
        answer: "Scikit-learn",
    },
    {
        question: "Which SQL clause is used to filter rows?",
        choices: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
        answer: "WHERE",
    },
    {
        question: "Which of the following is not a supervised learning algorithm?",
        choices: ["Linear Regression", "K-Means", "Decision Tree", "Random Forest"],
        answer: "K-Means",
    },
    {
        question: "What does the term 'overfitting' refer to?",
        choices: [
            "A model performing poorly on training data",
            "A model performing poorly on unseen data",
            "A model with high bias",
            "A model with high variance",
        ],
        answer: "A model performing poorly on unseen data",
    },
    {
        question: "Which method is used to handle missing data in pandas?",
        choices: ["fillna()", "dropna()", "interpolate()", "All of the above"],
        answer: "All of the above",
    },
    {
        question: "Which visualization library is used for statistical plots in Python?",
        choices: ["Matplotlib", "Seaborn", "Plotly", "Bokeh"],
        answer: "Seaborn",
    },
];

// Badge definitions
const badges = [
    { name: "Novice Data Scientist", description: "Answer 3 questions correctly!", icon: "🎓" },
    { name: "Intermediate Analyst", description: "Answer 6 questions correctly!", icon: "📊" },
    { name: "Expert Modeler", description: "Answer 10 questions correctly!", icon: "🤖" },
];

// Current user and state
let currentUser = null;
let userState = { correctAnswers: 0, earnedBadges: [] };

// Retrieve user data from localStorage
function getUserData(username) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[username] || { correctAnswers: 0, earnedBadges: [] };
}

// Save user data to localStorage
function saveUserData(username, data) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    users[username] = data;
    localStorage.setItem("users", JSON.stringify(users));
}

// Display logged-in user's data
function displayUserData() {
    if (!currentUser) return;

    userState = getUserData(currentUser);

    document.getElementById("challenge-section").style.display = "block";
    document.getElementById("badges-section").style.display = "block";
    document.getElementById("progress-section").style.display = "block";
    document.getElementById("login-section").style.display = "none";
    document.getElementById("user-greeting").textContent = `Welcome, ${currentUser}!`;
    document.getElementById("logoutBtn").style.display = "inline-block";

    updateBadges();
    updateProgress();
    displayQuestion();
}

// Log in the user
function loginUser() {
    const username = document.getElementById("usernameInput").value.trim();
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    currentUser = username;
    displayUserData();
}

// Log out the user
function logoutUser() {
    currentUser = null;

    document.getElementById("challenge-section").style.display = "none";
    document.getElementById("badges-section").style.display = "none";
    document.getElementById("progress-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("user-greeting").textContent = "Welcome, Guest!";
}

// Generate a random question
function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
}

// Initialize a list of unused questions
let unusedQuestions = [...questions]; // Clone the questions array

// Display a new question
function displayQuestion() {
    // If all questions have been used, reset the list
    if (unusedQuestions.length === 0) {
        alert("You've completed all the questions! Restarting the quiz.");
        unusedQuestions = [...questions];
        userState.correctAnswers = 0; // Optional: Reset score
        updateProgress(); // Reset progress bar
        saveUserData(currentUser, userState);
    }

    // Get a random question from the unused questions
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const randomQuestion = unusedQuestions[randomIndex];

    // Remove the selected question from the unused questions array
    unusedQuestions.splice(randomIndex, 1);

    // Display the question and its choices
    const questionContainer = document.getElementById("challenge-question");
    const choicesContainer = document.getElementById("choices-container");

    questionContainer.textContent = randomQuestion.question;
    choicesContainer.innerHTML = "";

    randomQuestion.choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.textContent = choice;
        button.onclick = () => submitAnswer(choice, randomQuestion.answer);
        choicesContainer.appendChild(button);
    });
}


// Check answer and update state
function submitAnswer(userAnswer, correctAnswer) {
    if (userAnswer === correctAnswer) {
        alert("Correct! 🎉");
        userState.correctAnswers += 1;
        saveUserData(currentUser, userState);
        updateProgress();
        updateBadges();
        displayQuestion();
    } else {
        alert(`Incorrect! The correct answer was: ${correctAnswer}`);
        displayQuestion();
    }
}

// Update badges
function updateBadges() {
    const badgesContainer = document.getElementById("badges");
    const correctCount = userState.correctAnswers;

    badges.forEach(badge => {
        if (correctCount >= parseInt(badge.description.match(/\d+/)[0]) && !userState.earnedBadges.includes(badge)) {
            userState.earnedBadges.push(badge);
            alert(`You earned a badge: ${badge.name} ${badge.icon}`);
        }
    });

    badgesContainer.innerHTML = userState.earnedBadges.length
        ? userState.earnedBadges.map(badge => `<div class="badge">${badge.icon} ${badge.name}</div>`).join("")
        : "No badges earned yet.";
}

// Update progress bar
function updateProgress() {
    const progressCount = userState.correctAnswers;
    const progressBar = document.getElementById("progress");
    const progressCountEl = document.getElementById("progressCount");

    progressCountEl.textContent = progressCount;
    progressBar.style.width = `${(progressCount / questions.length) * 100}%`;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn").addEventListener("click", loginUser);
    document.getElementById("logoutBtn").addEventListener("click", logoutUser);
});
