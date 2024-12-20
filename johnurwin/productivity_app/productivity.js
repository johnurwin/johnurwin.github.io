const challenges = [
    "Organize one folder on your desktop",
    "Stretch for 120 seconds",
    "Write down 3 tasks you want to complete today",
    "Drink a glass of water",
    "Delete 5 unnecessary emails",
    "Take 10 deep breaths",
    "Clean your desk for 2 minutes",
    "Plan your next meal",
    "Send a quick thank-you note to someone",
    "Step outside and get some fresh air for 2 minutes"
];

const badges = [
    { name: "Consistency King/Queen", description: "Complete challenges 5 days in a row!", icon: "👑" },
    { name: "Go-Getter", description: "Complete 10 challenges!", icon: "🚀" },
    { name: "Self-Care Star", description: "Focus on 5 self-care challenges!", icon: "✨" },
    { name: "Declutterer", description: "Organize 3 folders or spaces!", icon: "🗂" },
    { name: "Hydration Hero", description: "Drink water during 5 challenges!", icon: "💧" }
];

// Current user state
let currentUser = null;

// Retrieve user data from localStorage
function getUserData(username) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users[username] || { completedChallenges: [], earnedBadges: [] };
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
    const userData = getUserData(currentUser);

    // Update state
    userState = userData;

    // Update UI
    document.getElementById("challenge-section").style.display = "block";
    document.getElementById("badges-section").style.display = "block";
    document.getElementById("login-section").style.display = "none";
    document.getElementById("user-greeting").textContent = `Welcome, ${currentUser}!`;
    document.getElementById("logoutBtn").style.display = "inline-block";

    displayChallenge();
    updateBadges();
}

// Log in the user
function loginUser() {
    const username = document.getElementById("usernameInput").value.trim();
    if (!username) return alert("Please enter a username!");

    currentUser = username;

    displayUserData();
}

// Log out the user
function logoutUser() {
    currentUser = null;

    // Hide user sections
    document.getElementById("challenge-section").style.display = "none";
    document.getElementById("badges-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("user-greeting").textContent = "Welcome, Guest!";
}

// Generate a random challenge
function getRandomChallenge() {
    return challenges[Math.floor(Math.random() * challenges.length)];
}

// Display a new challenge
function displayChallenge() {
    document.getElementById("challenge").textContent = getRandomChallenge();
}

// Complete a challenge
function completeChallenge() {
    if (!currentUser) return alert("Please log in first!");
    const challenge = document.getElementById("challenge").textContent;

    userState.completedChallenges.push(challenge);
    saveUserData(currentUser, userState);

    alert("Challenge completed! Well done!");

    checkForBadges();
    displayChallenge();
}

// Award badges
function checkForBadges() {
    if (userState.completedChallenges.length === 5 && !userState.earnedBadges.includes(badges[0])) {
        userState.earnedBadges.push(badges[0]);
        alert(`You earned a badge: ${badges[0].name} ${badges[0].icon}`);
    }

    saveUserData(currentUser, userState);
    updateBadges();
}

// Update badges UI
function updateBadges() {
    const badgesContainer = document.getElementById("badges");
    badgesContainer.innerHTML = userState.earnedBadges.length
        ? userState.earnedBadges.map(badge => `<div class="badge">${badge.icon} ${badge.name}</div>`).join("")
        : "No badges earned yet. Start your journey!";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn").addEventListener("click", loginUser);
    document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    document.getElementById("completeChallengeBtn").addEventListener("click", completeChallenge);
});

function updateProgress() {
    const progressCount = userState.completedChallenges.length;
    const progressBar = document.getElementById("progress");
    const progressCountEl = document.getElementById("progressCount");
    const congratsMessage = document.getElementById("congrats-message");
    const secondProgressBar = document.getElementById("secondProgress");

    // Update the main progress bar
    progressCountEl.textContent = progressCount;
    progressBar.style.width = `${(progressCount / 10) * 100}%`;

    // Check if 10 challenges are completed
    if (progressCount >= 10) {
        congratsMessage.style.display = "block";

        // Start filling the second progress bar for challenges 11–20
        const secondProgress = progressCount - 10;
        secondProgressBar.style.width = `${(secondProgress / 10) * 100}%`;
    } else {
        congratsMessage.style.display = "none";
    }
}


function checkStreak() {
    const today = new Date().toDateString();
    const lastCompletedDate = localStorage.getItem("lastCompletedDate");

    if (lastCompletedDate === today) return; // Already completed today
    if (new Date(lastCompletedDate).toDateString() === new Date(new Date() - 86400000).toDateString()) {
        userState.streak = (userState.streak || 0) + 1;
    } else {
        userState.streak = 1; // Reset streak
    }

    localStorage.setItem("lastCompletedDate", today);
}

function updateStreak() {
    const today = new Date().toDateString(); // Today's date as a string
    const lastCompletedDate = localStorage.getItem("lastCompletedDate");

    // If the last completion was today, do nothing
    if (lastCompletedDate === today) return;

    // Check if the last completion was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day
    if (lastCompletedDate === yesterday.toDateString()) {
        // Increment the streak if it was yesterday
        userState.streak = (userState.streak || 0) + 1;
    } else {
        // Reset the streak if it wasn't yesterday
        userState.streak = 1;
    }

    // Save the current date and updated streak
    localStorage.setItem("lastCompletedDate", today);
    document.getElementById("streakCount").textContent = userState.streak || 0;
}


function showSections() {
    document.getElementById("challenge-section").style.display = "block";
    document.getElementById("badges-section").style.display = "block";
    document.getElementById("streak-section").style.display = "block";
    document.getElementById("progress-section").style.display = "block";
    document.getElementById("login-section").style.display = "none";
}

function completeChallenge() {
    // Assuming challenge completion logic exists
    const currentChallenge = document.getElementById("challenge").textContent;

    // Push completed challenge into user state
    userState.completedChallenges.push(currentChallenge);

    // Save the updated state to local storage
    saveUserData(currentUser, userState);

    // Update streaks, progress, and sections
    updateStreak();
    updateProgress();
    showSections(); // Ensure all sections are visible after a challenge

    // Provide user feedback
    alert("Challenge completed! Well done!");

    // Generate and display a new challenge
    displayChallenge();
}