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

const tournamentsRef = ref(db, 'tournaments');
const tournamentList = document.getElementById('tournamentList');

onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchTournaments();
  } else {
    tournamentList.innerHTML = '<p>Please sign in to view tournaments.</p>';
  }
});

function fetchTournaments() {
  onValue(tournamentsRef, (snapshot) => {
    const data = snapshot.val();
    displayTournaments(data);
  }, {
    onlyOnce: true
  });
}

function displayTournaments(tournaments) {
  tournamentList.innerHTML = '';
  for (let tournamentName in tournaments) {
    const tournament = tournaments[tournamentName];
    const tournamentElement = createTournamentElement(tournamentName, tournament);
    tournamentList.appendChild(tournamentElement);
  }
}

function createTournamentElement(tournamentName, tournament) {
  const div = document.createElement('div');
  div.className = 'tournament';
  
  const dateString = tournament.timeData && tournament.timeData.length > 0 
    ? `${tournament.timeData[0].date} ${tournament.timeData[0].timeStart} - ${tournament.timeData[0].timeEnd}`
    : 'Date not specified';

  const interestedStudentsCount = tournament.interestedStudents ? Object.keys(tournament.interestedStudents).length : 0;

  div.innerHTML = `
    <h2>${tournamentName}</h2>
    <p>Date: ${dateString}</p>
    <p>Location: ${tournament.location || 'Not specified'}</p>
    <p>Type: ${tournament.type || 'Not specified'}</p>
    <div class="interested-students">
      <h3>Interested Students <span class="student-count">(${interestedStudentsCount})</span> <span class="dropdown-arrow">▼</span></h3>
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

  const dropdownArrow = div.querySelector('.dropdown-arrow');
  const studentList = div.querySelector('.student-list');
  
  dropdownArrow.addEventListener('click', () => {
    studentList.style.display = studentList.style.display === 'none' ? 'block' : 'none';
    dropdownArrow.textContent = studentList.style.display === 'none' ? '▼' : '▲';
  });

  return div;
}