// coachevents.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
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
      let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);
      //if user is member, captain, or president
      if (accessLevel == "Member" || accessLevel == "Captain" || accessLevel == "President") {
        document.getElementById("coachesView").style.display = "none"
        fetchEventsAndTournaments("Student")
      }
      //if user is coach
      if (accessLevel == "coaches") {
        document.getElementById("studentsView").style.display = "none"
        fetchEventsAndTournaments("Coach");
        //add protocol if coach logs in
      }

    } else {
      console.log("User not logged in");
    }
  });

  // Add event listeners for create buttons
  document.getElementById('createEventBtn').addEventListener('click', () => {
    window.location.href = 'html/eventcreation.html';
  });

  document.getElementById('createTournamentBtn').addEventListener('click', () => {
    window.location.href = 'html/tournamentcreation.html';
  });
});

function fetchEventsAndTournaments(access) {
  const eventsRef = ref(db, 'events');
  const tournamentsRef = ref(db, 'tournaments');

  Promise.all([
    new Promise(resolve => onValue(eventsRef, resolve, { onlyOnce: true })),
    new Promise(resolve => onValue(tournamentsRef, resolve, { onlyOnce: true }))
  ]).then(([eventsSnapshot, tournamentsSnapshot]) => {
    const events = eventsSnapshot.val() || {};
    const tournaments = tournamentsSnapshot.val() || {};

    displayEvents(events, access);
    displayTournaments(tournaments, access);
  });
}

function displayEvents(events, access) {
  const eventRow = document.getElementById(`eventRow${access}`);
  eventRow.innerHTML = '';

  for (const [id, event] of Object.entries(events)) {
    const eventElement = createEventElement(id, event);
    eventRow.appendChild(eventElement);
  }
}

function parseDate(dateStr) {
  if (dateStr == "TBD") {
    return Infinity;
  }

  // console.log("current date str: ", dateStr);
  try {
    const [monthDay, range] = dateStr.split('/');
  } catch {
    return Infinity;
  }
  const [monthDay, range] = dateStr.split('/');
  const [startDay] = range.split('-');

  const month = parseInt(monthDay, 10);
  const day = parseInt(startDay, 10);
  const year = new Date().getFullYear();

  const startDate = new Date(year, month - 1, day);
  return startDate;
}

function displayTournaments(tournaments, access) {
  const tournamentRow = document.getElementById(`tournamentRow${access}`);
  tournamentRow.innerHTML = '';

  const sortedTournaments = Object.entries(tournaments)
    .sort(([, a], [, b]) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;
    });

  const sortedTournamentsObject = Object.fromEntries(sortedTournaments);

  console.log(sortedTournamentsObject);
  console.log(tournaments);

  // for (const [id, tournament] of Object.entries(sortedTournamentsObject)) {
  for (const [id, tournament] of Object.entries(tournaments)) {
    console.log(tournament.date);
    // console.log(id);
    // console.log(tournament);
    if (access == "Student") {
      const tournamentElement = createTournamentElementStudent(id, tournament);
      tournamentRow.appendChild(tournamentElement);
    }
    if (access == "Coach") {
      const tournamentElement = createTournamentElement(id, tournament);
      tournamentRow.appendChild(tournamentElement);
    }

  }
}

function createEventElement(id, event) {
  const div = document.createElement('div');
  div.className = 'event';

  // const dateHtml = getDateString(event.dateData);
  const dateHtml = "<p><strong>Date: </strong>" + event.date + "</p>";
  // const dateHtml = event.date;

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

  const descriptionContainer = div.querySelector(`.description-container`);
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

function createTournamentElementStudent(id, tournament) {
  const div = document.createElement('div');
  div.className = 'tournament';
  // console.log(tournament.Name)
  // const dateHtml = getDateString(tournament.dateData);
  const dateHtml = "<p><strong>Date: </strong>" + tournament.date + "</p>";

  let interested = false;
  if (tournament.interestedStudents) {
    if (tournament.interestedStudents.hasOwnProperty(localStorage.getItem("uid"))) {
      interested = true;
    }
  }

  let button_string = '';
  if (interested) {
    button_string = `<button class="uninterest-button" onclick="unindicateInterest('${tournament.name}')">Unindicate Interest</button>`
  } else {
    button_string = `
    <form id="event-checkbox-form">
      <label>
        <input type="checkbox" name="topics" value="Policy"> Policy
      </label><br>
      <label>
        <input type="checkbox" name="topics" value="Extemp"> Extemp
      </label><br>
      <label>
        <input type="checkbox" name="topics" value="Impromptu"> Impromptu
      </label><br>
      <label>
        <input type="checkbox" name="topics" value="Duo"> Duo
      </label><br>
      <label>
        <input type="text" name="partners" placeholder="Partners">
      <label></label>
    </form>
    <button class="interest-button" onclick="indicateInterest('${tournament.name}')">Indicate Interest</button>
    `;
  }

  div.innerHTML = `
    <h3>${tournament.name}</h3>
    ${dateHtml}
    <p><strong>Location:</strong> ${tournament.location || 'Not specified'}</p>
    <p><strong>Cost:</strong> ${tournament.cost || 'Free'}</p>
    <p><strong>Type:</strong> ${tournament.type || 'Not specified'}</p>
    <p><strong>Judges Needed:</strong> ${tournament.tournamentJudging || 'Not specified'}</p>
    <div class="description-container">
      <p class="description"><strong>Description:</strong> ${tournament.description || 'No description provided'}</p>
      <button class="show-more-btn">Show More</button>
    </div>
    ${button_string}
  `;

  const descriptionContainer = div.querySelector('.description-container');
  const description = div.querySelector('.description');
  const showMoreBtn = div.querySelector('.show-more-btn');
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



  return div;
}

window.indicateInterest = function (tournamentName) {
  const selectedInfo = submitEventPartnerSelection();
  let partners = ["n/a"];
  if (selectedInfo.partners.length != 0) {
    partners = selectedInfo.partners;
  }

  let user = localStorage.getItem("userName")
  let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);

  const interestRef = ref(db, `tournaments/${tournamentName}/interestedStudents/${localStorage.getItem("uid")}`);
  set(interestRef, { name: user, level: accessLevel, events: selectedInfo.topics, partners: partners })
    .then(() => alert('Interest indicated successfully!'))
    .catch((error) => console.error('Error indicating interest:', error));
  
  location.reload();
}

window.unindicateInterest = function (tournamentName) {
  const uid = localStorage.getItem("uid");

  const interestRef = ref(db, `tournaments/${tournamentName}/interestedStudents/${uid}`);

  remove(interestRef)
    .then(() => alert('Interest removed successfully!'))
    .catch((error) => console.error('Error removing interest:', error));
  

  location.reload();
}

function createTournamentElement(id, tournament) {
  const div = document.createElement('div');
  div.className = 'tournament';

  // const dateHtml = getDateString(tournament.dateData);
  const dateHtml = "<p><strong>Date: </strong>" + tournament.date + "</p>";

  div.innerHTML = `
    <h3>${tournament.name}</h3>
    ${dateHtml}
    <p><strong>Location:</strong> ${tournament.location || 'Not specified'}</p>
    <p><strong>Cost:</strong> ${tournament.cost || 'Free'}</p>
    <p><strong>Type:</strong> ${tournament.type || 'Not specified'}</p>
    <p><strong>Judges Needed:</strong> ${tournament.tournamentJudging || 'Not specified'}</p>
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
  // console.log("date data: ", dateData);
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

function submitEventPartnerSelection() {
  const form = document.getElementById('event-checkbox-form');
  const checkboxes = form.querySelectorAll('input[name="topics"]');
  const partner = form.querySelector('input[name="partners"]');
  const checkedTopics = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedTopics.push(checkbox.value);
    }
  });
  let partners = [];
  if (partner.value != "") {
    partners = partner.value.split(',').map(item => item.trim());
  }
  return {
    topics: checkedTopics,
    partners: partners,
  };
}
