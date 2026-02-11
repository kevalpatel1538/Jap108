let count = 0;
let selectedMantra = "Ram Ram";

const counter = document.getElementById("counter");
const countDisplay = document.getElementById("count");
const resetBtn = document.querySelector(".reset-btn");
const mantraButtons = document.querySelectorAll(".mantra-buttons button");
const currentMantra = document.getElementById("currentMantra");
const mantraDisplay = document.getElementById("mantraDisplay");
const progressCircle = document.querySelector(".progress-circle");
const streakDisplay = document.getElementById("streakCount");
const historyList = document.getElementById("historyList");

// Soft Bell
let bellSound;
try {
    bellSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    bellSound.volume = 0.15;
    
} catch (e) {}
// Long completion bell
let completionBell;
try {
    completionBell = new Audio("https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3");
    completionBell.volume = 0.3; // thoda noticeable but still soft
} catch (e) {}

function updateProgress() {
    let progress = (count / 108) * 360;
    progressCircle.style.background =
        `conic-gradient(#D4AF37 ${progress}deg, #f0f0f0 ${progress}deg)`;
}

// PAGE SWITCH
function showPage(page) {
    document.getElementById("japPage").style.display = "none";
    document.getElementById("streakPage").style.display = "none";
    document.getElementById("historyPage").style.display = "none";

    if (page === "jap") document.getElementById("japPage").style.display = "block";
    if (page === "streak") document.getElementById("streakPage").style.display = "block";
    if (page === "history") document.getElementById("historyPage").style.display = "block";
}

// COUNTER CLICK
counter.addEventListener("click", function () {

    if (count < 108) {
        count++;
        countDisplay.textContent = count;
        mantraDisplay.textContent = selectedMantra;
        updateProgress();

        if (bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(() => {});
        }
    }

    if (count === 108) {
        saveCompletion();
        document.getElementById("completionPopup").style.display = "flex";

    }
});

// RESET
resetBtn.addEventListener("click", function () {
    count = 0;
    countDisplay.textContent = count;
    mantraDisplay.textContent = "";
    updateProgress();
});

// MANTRA CHANGE
mantraButtons.forEach(button => {
    button.addEventListener("click", function () {

        mantraButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        selectedMantra = this.textContent;
        currentMantra.textContent = selectedMantra;

        count = 0;
        countDisplay.textContent = count;
        mantraDisplay.textContent = "";
        updateProgress();
    });
});

// SAVE COMPLETION (Streak + History)
function saveCompletion() {

    const today = new Date().toDateString();
    let lastDate = localStorage.getItem("lastDate");
    let streak = parseInt(localStorage.getItem("streak")) || 0;

    if (lastDate) {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (new Date(lastDate).toDateString() === yesterday.toDateString()) {
            streak++;
        } else if (lastDate !== today) {
            streak = 1;
        }
    } else {
        streak = 1;
    }

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastDate", today);

    streakDisplay.textContent = streak + " Days";

    // Save history
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({ date: today, mantra: selectedMantra });
    localStorage.setItem("history", JSON.stringify(history));

    loadHistory();
}

// LOAD STREAK
function loadStreak() {
    let streak = localStorage.getItem("streak") || 0;
    streakDisplay.textContent = streak + " Days";
}

// LOAD HISTORY
function loadHistory() {
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.forEach(entry => {
        let li = document.createElement("li");
        li.textContent = entry.date + " - " + entry.mantra;
        historyList.appendChild(li);
    });
}

loadStreak();
loadHistory();
updateProgress();
function closePopup() {
    document.getElementById("completionPopup").style.display = "none";
}
