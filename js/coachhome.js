import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBY3NSt8IsWNcEntJiO8QM_Z26Nv4WdrWM",
  authDomain: "msdnet-7307d.firebaseapp.com",
  projectId: "msdnet-7307d",
  storageBucket: "msdnet-7307d.appspot.com",
  messagingSenderId: "55003346420",
  appId: "1:55003346420:web:7f3693c50fe0ca598df5a1",
  measurementId: "G-GGHX0BXHLD",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();

const auth = getAuth();

let authUser = auth.currentUser;

window.onload = function() {

  auth.onAuthStateChanged(function(user) {
    console.log(user);

  });
};
  // Array of motivational quotes
// const quotes = [
//     "\"The only way to do great work is to love what you do.\" - Steve Jobs",
//     "\"Believe you can and you're halfway there.\" - Theodore Roosevelt",
//     "\"Your limitation—it's only your imagination.\"",
//     "\"Push yourself, because no one else is going to do it for you.\"",
//     "\"Great things never come from comfort zones.\"",
//     "\"A pessimist sees difficulty in every opportunity. But an optimist? An optimist sees opportunity in every difficulty.\" <br> - <s>Winston Churchill</s> </br> - Sashank Balusu",
//   ];
  
//   // Function to shuffle the quotes
//   function shuffleQuotes() {
//     return quotes[Math.floor(Math.random() * quotes.length)];
//   }
  
//   // Display a random quote when the page loads
//   document.addEventListener("DOMContentLoaded", function() {
//     const quoteText = document.getElementById("quote-text");
//     quoteText.textContent = shuffleQuotes();
//   });
