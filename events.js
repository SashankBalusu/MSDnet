import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

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
  const analytics = getAnalytics(app);
  const db = firebase.firestore();

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
      description: eventDescription.value
    };
  
    try {
      // Add the event to Firestore
      const docRef = await db.collection('events').add(eventData);
      console.log('Event created with ID:', docRef.id);
      // Reset the form
      eventForm.reset();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  });