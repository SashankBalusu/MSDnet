// coachevents.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Initialize Firebase (add your config here)
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
const db = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchEventsAndTournaments();
    } else {
      console.log("User not logged in");
    }
  });

  // Add event listeners for create buttons
  document.getElementById('createEventBtn').addEventListener('click', () => {
    window.location.href = 'eventcreation.html';
  });

  document.getElementById('createTournamentBtn').addEventListener('click', () => {
    window.location.href = 'tournamentcreation.html';
  });
});

function fetchEventsAndTournaments() {
  const eventsRef = ref(db, 'events');
  const tournamentsRef = ref(db, 'tournaments');

  Promise.all([
    new Promise(resolve => onValue(eventsRef, resolve, { onlyOnce: true })),
    new Promise(resolve => onValue(tournamentsRef, resolve, { onlyOnce: true }))
  ]).then(([eventsSnapshot, tournamentsSnapshot]) => {
    const events = eventsSnapshot.val() || {};
    const tournaments = tournamentsSnapshot.val() || {};

    displayEvents(events);
    displayTournaments(tournaments);
  });
}

function displayEvents(events) {
  const eventRow = document.getElementById('eventRow');
  eventRow.innerHTML = '';
  
  for (const [id, event] of Object.entries(events)) {
    const eventElement = createEventElement(id, event);
    eventRow.appendChild(eventElement);
  }
}

function displayTournaments(tournaments) {
  const tournamentRow = document.getElementById('tournamentRow');
  tournamentRow.innerHTML = '';
  
  for (const [id, tournament] of Object.entries(tournaments)) {
    const tournamentElement = createTournamentElement(id, tournament);
    tournamentRow.appendChild(tournamentElement);
  }
}

function createEventElement(id, event) {
  const div = document.createElement('div');
  div.className = 'event';
  
  const dateHtml = getDateString(event.dateData);

  div.innerHTML = `
    <h3>${event.name}</h3>
    ${dateHtml}
    <p><strong>Location:</strong> ${event.location || 'Not specified'}</p>
    <p><strong>Type:</strong> ${event.type || 'Not specified'}</p>
    <div class="description-container">
      <p class="description"><strong>Description:</strong> ${event.description || 'No description provided'}</p>
      <button class="show-more-btn">Show More</button>
    </div>
  `;

  const descriptionContainer = div.querySelector('.description-container');
  const description = div.querySelector('.description');
  const showMoreBtn = div.querySelector('.show-more-btn');

  showMoreBtn.addEventListener('click', () => {
    if (div.classList.contains('description-expanded')) {
      div.classList.remove('description-expanded');
      description.style.whiteSpace = 'nowrap';
      showMoreBtn.textContent = 'Show More';
    } else {
      div.classList.add('description-expanded');
      description.style.whiteSpace = 'normal';
      showMoreBtn.textContent = 'Show Less';
    }
  });

  return div;
}

function createTournamentElement(id, tournament) {
  const div = document.createElement('div');
  div.className = 'tournament';
  
  const dateHtml = getDateString(tournament.dateData);

  div.innerHTML = `
    <h3>${tournament.name}</h3>
    ${dateHtml}
    <p><strong>Location:</strong> ${tournament.location || 'Not specified'}</p>
    <p><strong>Type:</strong> ${tournament.type || 'Not specified'}</p>
    <div class="description-container">
      <p class="description"><strong>Description:</strong> ${tournament.description || 'No description provided'}</p>
      <button class="show-more-btn">Show More</button>
    </div>
    <div class="interested-students">
      <h4>Interested Students <span class="student-count">(${Object.keys(tournament.interestedStudents || {}).length})</span> <span class="dropdown-arrow">▼</span></h4>
      <ul class="student-list" style="display: none;">
        ${tournament.interestedStudents ? 
          Object.values(tournament.interestedStudents)
            .map(student => `<li>${student.name} (${student.level})</li>`)
            .join('') : 
          '<li>No students interested yet</li>'
        }
      </ul>
    </div>
  `;

  const descriptionContainer = div.querySelector('.description-container');
  const description = div.querySelector('.description');
  const showMoreBtn = div.querySelector('.show-more-btn');
  const dropdownArrow = div.querySelector('.dropdown-arrow');
  const studentList = div.querySelector('.student-list');

  showMoreBtn.addEventListener('click', () => {
    if (div.classList.contains('description-expanded')) {
      div.classList.remove('description-expanded');
      description.style.whiteSpace = 'nowrap';
      showMoreBtn.textContent = 'Show More';
    } else {
      div.classList.add('description-expanded');
      description.style.whiteSpace = 'normal';
      showMoreBtn.textContent = 'Show Less';
    }
  });

  dropdownArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    if (studentList.style.display === 'none') {
      studentList.style.display = 'block';
      dropdownArrow.textContent = '▲';
      div.classList.add('student-list-expanded');
    } else {
      studentList.style.display = 'none';
      dropdownArrow.textContent = '▼';
      div.classList.remove('student-list-expanded');
    }
  });

  return div;
}

function getDateString(dateData) {
  if (dateData && Object.keys(dateData).length > 0) {
    return Object.values(dateData)
      .map(day => `<p>${formatDate(day.date)}</p>`)
      .join('');
  } else {
    return '<p>Date not specified</p>';
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}