import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
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

  div.innerHTML = `
    <h2>${tournamentName}</h2>
    <p>Date: ${dateString}</p>
    <p>Location: ${tournament.location || 'Not specified'}</p>
    <p>Type: ${tournament.type || 'Not specified'}</p>
    <button class="interest-button" onclick="indicateInterest('${tournamentName}')">Indicate Interest</button>
  `;

  return div;
}

window.indicateInterest = function(tournamentName) {
  const user = auth.currentUser;
  if (user) {
    const whitelistRef = ref(db, 'whitelist');
    onValue(whitelistRef, (snapshot) => {
      const whitelist = snapshot.val();
      let userName = null;
      let userLevel = null;

      for (const level in whitelist) {
        for (const name in whitelist[level]) {
          if (whitelist[level][name] === user.email) {
            userName = name;
            userLevel = level;
            break;
          }
        }
        if (userName) break;
      }

      if (userName) {
        const interestRef = ref(db, `tournaments/${tournamentName}/interestedStudents/${user.uid}`);
        set(interestRef, { name: userName, level: userLevel })
          .then(() => alert('Interest indicated successfully!'))
          .catch((error) => console.error('Error indicating interest:', error));
      } else {
        alert("You are not authorized to indicate interest. Please contact an administrator.");
      }
    }, { onlyOnce: true });
  } else {
    alert('Please sign in to indicate interest.');
  }
}