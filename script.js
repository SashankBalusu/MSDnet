
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBY3NSt8IsWNcEntJiO8QM_Z26Nv4WdrWM",
    authDomain: "msdnet-7307d.firebaseapp.com",
    projectId: "msdnet-7307d",
    storageBucket: "msdnet-7307d.appspot.com",
    messagingSenderId: "55003346420",
    appId: "1:55003346420:web:7f3693c50fe0ca598df5a1",
    measurementId: "G-GGHX0BXHLD"
  };

  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const db = getDatabase();

// Menu bar
document.querySelector('.menu-icon').addEventListener('click', function() {
    var menuContainer = document.querySelector('.menu-container');
    menuContainer.classList.toggle('show');
    var menuIcon = document.querySelector('.menu-icon');
    menuIcon.classList.toggle('show');
});

  // Get form elements
  const eventForm = document.getElementById('eventForm');
  const eventName = document.getElementById('eventName');
  const eventDate = document.getElementById('eventDate');
  const eventTime = document.getElementById('eventTime');
  const eventLocation = document.getElementById('eventLocation');
  const eventType = document.getElementById('eventType');
  const eventDescription = document.getElementById('eventDescription');
  
  // Add event listener to the form
  eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Create an event object
    const eventData = {
      name: eventName.value,
      date: eventDate.value,
      time: eventTime.value,
      location: eventLocation.value,
      type: eventType.value,
      description: eventDescription.value
    };
  
  // Push the event data to the Realtime Database
  const newEventRef = ref(db, 'events/' + eventName.value);

  // Set the event data for the new node
  set(newEventRef, eventData)
    .then(() => {
      console.log('Event created with name:', eventName.value);
      // Reset the form
      eventForm.reset();
    })
    .catch((error) => {
      console.error('Error creating event:', error);
    });
});

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
