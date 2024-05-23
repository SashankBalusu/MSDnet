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
