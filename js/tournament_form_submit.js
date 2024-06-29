import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set
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
const db = getDatabase();

// Get form elements
const tournamentForm = document.getElementById("tournamentForm");
const tournamentName = document.getElementById("tournamentName");
const tournamentLocation = document.getElementById("tournamentLocation");
const tournamentType = document.getElementById("tournamentType");
const tournamentDescription = document.getElementById("tournamentDescription");

// Function to toggle dropdown
document.addEventListener('DOMContentLoaded', function() {
    const dropdownButton = document.getElementById('dropdownButton');
    const eventsDropdown = document.getElementById('eventsDropdown');

    if (!dropdownButton || !eventsDropdown) {
        console.error('Dropdown elements not found');
        return;
    }

    dropdownButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent this click from immediately closing the dropdown
        eventsDropdown.classList.toggle('show');
    });

    // Prevent clicks inside the dropdown from closing it
    eventsDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Close the dropdown when clicking outside of it
    window.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target) && !eventsDropdown.contains(event.target)) {
            eventsDropdown.classList.remove('show');
        }
    });
});


// Add event listener to the form
tournamentForm.addEventListener("submit", async (e) => {
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

  // Get selected events
  const checkedBoxes = document.querySelectorAll('#options input[type="checkbox"]:checked');
  const selectedEvents = Array.from(checkedBoxes).map(box => box.value);

  // Create a tournament object
  const tournamentData = {
    name: tournamentName.value,
    timeData: timeData,
    location: tournamentLocation.value,
    type: tournamentType.value,
    eventsOffered: selectedEvents,
    description: tournamentDescription.value,
  };

  // Push the tournament data to the Realtime Database
  const newTournamentRef = ref(db, "tournaments/" + tournamentName.value);

  // Set the tournament data for the new node
  set(newTournamentRef, tournamentData)
    .then(() => {
      console.log(tournamentData);
      // Reset the form
      tournamentForm.reset();
      // Clear checkboxes
      checkedBoxes.forEach(box => box.checked = false);
    })
    .catch((error) => {
      console.error("Error creating tournament:", error);
    });
});