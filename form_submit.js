import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

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

// Get form elements
const eventForm = document.getElementById("eventForm");
const eventName = document.getElementById("eventName");
const eventType = document.getElementById("eventType");
const eventLocation = document.getElementById("eventLocation");
const eventDescription = document.getElementById("eventDescription");

// Add event listener to the form
eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let timeData = [];

  $('[id^="dateTimeInputContainer-"]').each(function () {
    let eventDate = $(this).find('input[type="date"]').val();
    let eventTimeStart = $(this).find('input[type="time"]').first().val();
    let eventTimeEnd = $(this).find('input[type="time"]').last().val();

    timeData.push({
      date: eventDate,
      timeStart: eventTimeStart,
      timeEnd: eventTimeEnd,
    });
  });

  // Create an event object
  const eventData = {
    name: eventName.value,
    timeData: timeData,
    location: eventLocation.value,
    type: eventType.value,
    description: eventDescription.value,
  };

  // Push the event data to the Realtime Database
  const newEventRef = ref(db, "events/" + eventName.value);

  // Set the event data for the new node
  set(newEventRef, eventData)
    .then(() => {
      console.log(eventData);
      // Reset the form
      eventForm.reset();
    })
    .catch((error) => {
      console.error("Error creating event:", error);
    });
});

