const API_BASE_URL = "https://cquizy-api.onrender.com/api";

const cardFront = document.querySelector(".card-front");
const cardBack = document.querySelector(".card-back");
const cardInner = document.querySelector(".card-inner");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const buttons = document.querySelectorAll(".button-group button");
const categoryElement = cardFront.querySelector(".category");
const questionContextElement = cardFront.querySelector(".context");
const questionElement = cardFront.querySelector(".question");
const answerElement = cardBack.querySelector(".answer");
const questionNumberElement = document.createElement("div");
const bookmarkButton = document.querySelector(".bookmark-btn");
const reviewLaterButton = document.getElementById("review-later-btn");
const spinnerContainer = document.getElementById("spinner-container");
const shufflingMessage = document.getElementById("shuffling-message");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const themeToggle = document.getElementById("theme-toggle");

questionNumberElement.classList.add("question-number");
cardFront.appendChild(questionNumberElement);

spinnerContainer.style.display = "none";
shufflingMessage.style.display = "none";

const categoryFilter = document.createElement("select");
categoryFilter.id = "category-filter";
categoryFilter.className = "form-select mb-3";
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "All Categories";
categoryFilter.appendChild(defaultOption);

document
  .querySelector(".container")
  .insertBefore(categoryFilter, document.querySelector(".card-container"));

const STORAGE_VERSION = "1.0";
const STORAGE_KEYS = {
  BOOKMARKS: "cquizy_bookmarks",
  LAST_POSITION: "cquizy_lastPosition",
  VERSION: "cquizy_version",
  THEME: "theme_preference",
  STATS: "cquizy_stats",
};

let currentQuestionIndex = 0;
let questions = [];
let fullQuestionSet = [];
let reviewingBookmarks = false;
let bookmarkedQuestions = [];
let darkMode = true;
let studyTimer;
let studySeconds = 0;

const stats = {
  cardsViewed: 0,
  flips: 0,
  startTime: Date.now(),
  sessionDuration: 0,
};

async function fetchFromAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Server error: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

async function fetchQuestions(category = null) {
  spinnerContainer.style.display = "flex";

  try {
    let endpoint = "/questions";
    if (category) {
      endpoint += `?category=${encodeURIComponent(category)}`;
    }

    const data = await fetchFromAPI(endpoint);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No questions available or incorrect format.");
    }

    questions = data;
    fullQuestionSet = [...data];
    loadCategories();
    loadQuestion(0);
  } catch (error) {
    alert(`Failed to load questions: ${error.message}`);
  } finally {
    spinnerContainer.style.display = "none";
  }
}

function loadCategories() {
  const categories = [];

  questions.forEach((q) => {
    if (q.category && !categories.includes(q.category)) {
      categories.push(q.category);
    }
  });

  categories.sort();

  while (categoryFilter.children.length > 1) {
    categoryFilter.removeChild(categoryFilter.lastChild);
  }

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function loadQuestion(index) {
  if (index < 0 || index >= questions.length) {
    questionElement.textContent = "No more questions!";
    answerElement.textContent = "End of cards";
    questionNumberElement.textContent = "";
    return;
  }

  const { _id, category, context, question, answer } = questions[index];

  categoryElement.textContent = category;
  questionContextElement.textContent = context ? `Context: ${context}` : "";
  questionElement.textContent = question;
  answerElement.textContent = answer;
  questionNumberElement.textContent = `${index + 1} of ${questions.length}`;

  cardInner.classList.remove("is-flipped");
  updateBookmarkIcon(_id);
  updateStats("view");
  updateProgressBar();
}

function updateProgressBar() {
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = `${progressPercent}%`;
  document.getElementById("progress-text").textContent = `${
    currentQuestionIndex + 1
  } of ${questions.length}`;
}

function flipCardBack(callback) {
  if (cardInner.classList.contains("is-flipped")) {
    gsap.to(cardInner, {
      duration: 0.2,
      rotationY: 0,
      scale: 1,
      ease: "power2.out",
      onComplete: () => {
        cardInner.classList.remove("is-flipped");
        if (callback) callback();
      },
    });
  } else if (callback) {
    callback();
  }
}

function shuffleQuestions() {
  flipCardBack(() => {
    shufflingMessage.style.display = "block";

    setTimeout(() => {
      questions.sort(() => Math.random() - 0.5);
      currentQuestionIndex = 0;
      loadQuestion(currentQuestionIndex);
      shufflingMessage.style.display = "none";
    }, 1000);
  });
}

function toggleBookmark(event) {
  event.stopPropagation();

  const currentQuestionId = questions[currentQuestionIndex]._id;

  if (bookmarkedQuestions.includes(currentQuestionId)) {
    bookmarkedQuestions = bookmarkedQuestions.filter(
      (id) => id !== currentQuestionId
    );
  } else {
    bookmarkedQuestions.push(currentQuestionId);
  }

  saveToStorage(STORAGE_KEYS.BOOKMARKS, bookmarkedQuestions);
  updateBookmarkIcon(currentQuestionId);
}

function updateBookmarkIcon(questionId) {
  if (bookmarkedQuestions.includes(questionId)) {
    bookmarkButton.classList.add("active");
  } else {
    bookmarkButton.classList.remove("active");
  }
}

function showBookmarkedQuestions() {
  if (!reviewingBookmarks) {
    fullQuestionSet = [...questions];
    questions = questions.filter((q) => bookmarkedQuestions.includes(q._id));
    reviewLaterButton.textContent = "Back to All";
    reviewingBookmarks = true;
  } else {
    questions = [...fullQuestionSet];
    reviewLaterButton.textContent = "Review Later";
    reviewingBookmarks = false;
  }
  currentQuestionIndex = 0;
  loadQuestion(currentQuestionIndex);
}

function getFromStorage(key, defaultValue = null) {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (version !== STORAGE_VERSION) {
      localStorage.clear();
      localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
      return defaultValue;
    }

    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
  }
}

function savePosition() {
  const position = {
    index: currentQuestionIndex,
    category: categoryFilter.value || null,
    reviewingBookmarks,
  };

  saveToStorage(STORAGE_KEYS.LAST_POSITION, position);
}

function restorePosition() {
  const position = getFromStorage(STORAGE_KEYS.LAST_POSITION);
  if (!position) return;

  if (position.category) {
    categoryFilter.value = position.category;
  }

  if (position.reviewingBookmarks) {
    showBookmarkedQuestions();
  }

  if (position.index && position.index < questions.length) {
    currentQuestionIndex = position.index;
    loadQuestion(currentQuestionIndex);
  }
}

function saveUserProgress() {
  savePosition();
}

function updateStats(action) {
  switch (action) {
    case "view":
      stats.cardsViewed++;
      break;
    case "flip":
      stats.flips++;
      break;
  }

  stats.sessionDuration = Math.floor((Date.now() - stats.startTime) / 1000);
  saveToStorage(STORAGE_KEYS.STATS, stats);
}

function handleKeyPress(event) {
  if (
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.tagName === "SELECT"
  ) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      if (currentQuestionIndex > 0) {
        flipCardBack(() => {
          currentQuestionIndex--;
          loadQuestion(currentQuestionIndex);
          saveUserProgress();
        });
      }
      break;
    case "ArrowRight":
      if (currentQuestionIndex < questions.length - 1) {
        flipCardBack(() => {
          currentQuestionIndex++;
          loadQuestion(currentQuestionIndex);
          saveUserProgress();
        });
      }
      break;
    case " ":
      cardInner.click();
      break;
    case "b":
    case "B":
      toggleBookmark(new Event("click"));
      break;
    case "r":
    case "R":
      shuffleQuestions();
      break;
  }
}

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("light-mode");
  themeToggle.innerHTML = darkMode
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
  saveToStorage(STORAGE_KEYS.THEME, darkMode);
}

function startStudyTimer() {
  const timerDisplay = document.getElementById("timer-display");

  studyTimer = setInterval(() => {
    studySeconds++;
    const minutes = Math.floor(studySeconds / 60);
    const seconds = studySeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function stopStudyTimer() {
  clearInterval(studyTimer);
}

function searchQuestions() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    questions = [...fullQuestionSet];
  } else {
    questions = fullQuestionSet.filter(
      (q) =>
        q.question.toLowerCase().includes(searchTerm) ||
        q.answer.toLowerCase().includes(searchTerm) ||
        q.category.toLowerCase().includes(searchTerm)
    );
  }

  currentQuestionIndex = 0;
  if (questions.length > 0) {
    loadQuestion(currentQuestionIndex);
  } else {
    questionElement.textContent = "No matching questions found";
    answerElement.textContent = "Try a different search term";
    questionNumberElement.textContent = "";
  }
}

async function initializeApp() {
  try {
    spinnerContainer.style.display = "flex";

    bookmarkedQuestions = getFromStorage(STORAGE_KEYS.BOOKMARKS, []);

    const savedTheme = getFromStorage(STORAGE_KEYS.THEME, true);
    if (!savedTheme) {
      document.body.classList.add("light-mode");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      darkMode = false;
    }

    await fetchQuestions();
    restorePosition();
    startStudyTimer();
  } catch (error) {
    console.error("Failed to initialize app:", error);
    alert(
      "There was a problem loading the application. Please refresh the page."
    );
  } finally {
    spinnerContainer.style.display = "none";
  }
}

cardInner.addEventListener("click", () => {
  if (!cardInner.classList.contains("is-flipped")) {
    gsap.to(cardInner, {
      duration: 0.5,
      rotationY: 180,
      ease: "back.out(1.2)",
      onComplete: () => {
        cardInner.classList.add("is-flipped");
      },
    });
    updateStats("flip");
  } else {
    gsap.to(cardInner, {
      duration: 0.4,
      rotationY: 0,
      ease: "power3.out",
      onComplete: () => {
        cardInner.classList.remove("is-flipped");
      },
    });
  }
});

leftArrow.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    flipCardBack(() => {
      currentQuestionIndex--;
      loadQuestion(currentQuestionIndex);
      saveUserProgress();
    });
  }
});

rightArrow.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    flipCardBack(() => {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
      saveUserProgress();
    });
  }
});

document
  .getElementById("randomize-btn")
  .addEventListener("click", shuffleQuestions);
bookmarkButton.addEventListener("click", toggleBookmark);
reviewLaterButton.addEventListener("click", showBookmarkedQuestions);
themeToggle.addEventListener("click", toggleTheme);
searchBtn.addEventListener("click", searchQuestions);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchQuestions();
});

categoryFilter.addEventListener("change", async () => {
  try {
    currentQuestionIndex = 0;
    reviewingBookmarks = false;
    reviewLaterButton.textContent = "Review Later";

    if (categoryFilter.value) {
      await fetchQuestions(categoryFilter.value);
    } else {
      await fetchQuestions();
    }
  } catch (error) {
    console.error("Error filtering questions:", error);
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    gsap.to(button, { duration: 0.2, scale: 0.9, ease: "power1.inOut" });
    gsap.to(button, {
      duration: 0.2,
      scale: 1,
      delay: 0.2,
      ease: "power1.out",
    });
  });
});

[leftArrow, rightArrow].forEach((button) => {
  button.addEventListener("click", saveUserProgress);
});

window.addEventListener("beforeunload", () => {
  saveUserProgress();
  stopStudyTimer();
});

window.addEventListener("keydown", handleKeyPress);
document.addEventListener("DOMContentLoaded", initializeApp);
