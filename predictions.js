// predictions.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLuhn5a9K-EocuW7bR5becPjvhjkm6a1w",
  authDomain: "football-scores-6b06c.firebaseapp.com",
  projectId: "football-scores-6b06c",
  storageBucket: "football-scores-6b06c.appspot.com",
  messagingSenderId: "936463376856",
  appId: "1:936463376856:web:e2ba2715fc56947925d2ad",
  measurementId: "G-TZ8NC0SRDZ"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const username = localStorage.getItem("username");
const isAdmin = localStorage.getItem("isAdmin") === "true";

if (!username) {
  alert("You must log in first.");
  window.location.href = "index.html";
}

document.getElementById("welcomeMsg").textContent = `Welcome, ${username}${isAdmin ? " (Admin)" : ""}!`;

// Define logout function globally so inline onclick works
window.logout = function() {
  localStorage.clear();
  window.location.href = "index.html";
};

// Load predictions from Firestore
async function loadPredictions() {
  const list = document.getElementById("predictionList");
  list.innerHTML = "Loading...";
  try {
    const docRef = doc(db, "predictions", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const userPredictions = data.scores || [];
      list.innerHTML = "";
      userPredictions.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.match} → ${p.score}`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No predictions yet.</li>";
    }
  } catch (error) {
    list.innerHTML = "<li>Error loading predictions.</li>";
    console.error("Error loading predictions:", error);
  }
}

// Save a new prediction to Firestore
async function savePrediction(match, score) {
  try {
    const docRef = doc(db, "predictions", username);
    const docSnap = await getDoc(docRef);

    let currentScores = [];
    if (docSnap.exists()) {
      currentScores = docSnap.data().scores || [];
    }

    currentScores.push({ match, score });

    await setDoc(docRef, { scores: currentScores });
    loadPredictions();
  } catch (error) {
    console.error("Error saving prediction:", error);
  }
}

document.getElementById("predictionForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const match = document.getElementById("match").value.trim();
  const score = document.getElementById("score").value.trim();
  if (!match || !score) return;

  savePrediction(match, score);

  this.reset();
  const status = document.getElementById("statusMessage");
  status.textContent = "Prediction saved!";
  setTimeout(() => {
    status.textContent = "";
  }, 3000);
});

// Initial load
loadPredictions();
