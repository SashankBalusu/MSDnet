// coachevents.js

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
const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)


document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);
    //if user is member, captain, or president
    if (accessLevel == "Member" || accessLevel == "Captain" || accessLevel == "President"){
      document.getElementById("coachesView").style.display = "none"
      fetchEventsAndTournaments("Student")
    }
    //if user is coach
    if (accessLevel == "coaches"){
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
document.getElementById("createAllTournaments").addEventListener("click", function(){
  document.getElementById("tournamentForm").style.display = "block";

})
document.getElementById("closeTournamentForm").addEventListener("click", function(){
  document.getElementById("tournamentForm").style.display = "none";

})
document.getElementById("createAllEvents").addEventListener("click", function(){
  document.getElementById("eventForm").style.display = "block";

})
document.getElementById("closeEventForm").addEventListener("click", function(){
  document.getElementById("eventForm").style.display = "none";

})
document.getElementById("massCreateTournament").addEventListener("click", function(){
  const textarea = document.getElementById("massTournamentArea")
  console.log(textarea.value.split("\n"))
  let step1 = textarea.value.replace(/[.#$]/g, '');
  let textFiltered = step1.split("\n").filter(a => !a.toLowerCase().includes("semester"));
  console.log(textFiltered)
  for (let item of textFiltered){
    let itemSplit = item.split("\t")
    console.log(item.split("\t"))
    if (itemSplit[2] == ""){
      alert("tournament name cant be blank!!")
      return
    }
    if (itemSplit[2].includes("/")){
      itemSplit[2] = itemSplit[2].replaceAll("/", "-")
    }
    set(ref(db, 'tournaments/' + itemSplit[2]), {
            name: itemSplit[2],
            description: itemSplit[3],
            events: itemSplit[4],
            date: itemSplit[0]
      });
    
  }
  document.getElementById("tournamentForm").style.display = "none";
  window.location.reload()
  
})
document.getElementById("massCreateEvent").addEventListener("click", function(){
  const textarea = document.getElementById("massEventArea")
  let step1 = textarea.value.replace(/[.#$]/g, '');
  let textFiltered = step1.split("\n").filter(a => isNumeric(a.slice(0, 1)))
  console.log(textFiltered)
  for (let item of textFiltered){
    //"8/16	Friday	3-4:30	MSD Day Preperation	100s 	no	all"
    let itemSplit = item.split("\t")
    if (itemSplit[3] == "") {
      alert("event name cant be blank!!")
      return
    }
    let times = itemSplit[2].split("-")
    let startTime = times[0]
    if (!startTime.includes(":")){
      startTime+=":00"
    }
    let endTime = times[1]
    if (!endTime.includes(":")){
      endTime+=":00"
    }
    if (itemSplit[3].includes("/")){
      itemSplit[3] = itemSplit[3].replaceAll("/", "-")
    }
    console.log(itemSplit[3])
    console.log(startTime, endTime)
    set(ref(db, 'events/' + itemSplit[3]), {
      name: itemSplit[3],
      date: itemSplit[0],
      dayOfWeek: itemSplit[1],
      location: itemSplit[4],
      food: itemSplit[5],
      coaches: itemSplit[6],
      timeEnd: endTime,
      timeStart: startTime
    });
  }
  document.getElementById("eventForm").style.display = "none";
  window.location.reload()
})
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

function displayTournaments(tournaments, access) {
  const tournamentRow = document.getElementById(`tournamentRow${access}`);
  tournamentRow.innerHTML = '';
  
  for (const [id, tournament] of Object.entries(tournaments)) {
    if (access == "Student"){
      const tournamentElement = createTournamentElementStudent(id, tournament);
      tournamentRow.appendChild(tournamentElement);
    }
    if (access == "Coach"){
      const tournamentElement = createTournamentElement(id, tournament);
      tournamentRow.appendChild(tournamentElement);
    }
    
  }
}

function createEventElement(id, event) {
  const div = document.createElement('div');
  div.className = 'event';
  
  const dateHtml = getDateString(event.dateData);
  let timeForm = event.timeStart + ":" +  event.timeEnd
  div.innerHTML = `
    <h3>${event.name}</h3>
    <p>${event.date}, ${event.dayOfWeek}<p>
    <p><strong>Location:</strong> ${event.location || 'Not specified'}</p>
    <p><strong>Food?</strong> ${event.food || 'Not specified'}</p>
    <div class="description-container">
      <p class="description"><strong>Time:</strong> ${timeForm || 'No description provided'}</p>
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
  console.log(tournament.Name)
  const dateHtml = getDateString(tournament.dateData);

  div.innerHTML = `
    <h3>${tournament.name}</h3>
    <p><strong>Date:</strong> ${tournament.location || 'Not specified'}</p>
    <p><strong>Events:</strong> ${tournament.description || 'Not specified'}</p>

    <div class="description-container">
      <p class="description"><strong>Description:</strong> ${tournament.events || 'No description provided'}</p>
      <button class="show-more-btn">Show More</button>
    </div>
    <button class="interest-button" onclick="indicateInterest('${tournament.name}')">Indicate Interest</button>

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

window.indicateInterest = function(tournamentName) {
  let user = localStorage.getItem("userName")
  let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);

  const interestRef = ref(db, `tournaments/${tournamentName}/interestedStudents/${localStorage.getItem("uid")}`);
    set(interestRef, { name: user, level: accessLevel })
      .then(() => alert('Interest indicated successfully!'))
      .catch((error) => console.error('Error indicating interest:', error));
}

function createTournamentElement(id, tournament) {
  const div = document.createElement('div');
  div.className = 'tournament';
  
  const dateHtml = getDateString(tournament.dateData);

  div.innerHTML = `
  <h3>${tournament.name}</h3>
  <p><strong>Date:</strong> ${tournament.date || 'Not specified'}</p>
  <p><strong>Events:</strong> ${tournament.description || 'Not specified'}</p>

  <div class="description-container">
    <p class="description"><strong>Description:</strong> ${tournament.events || 'No description provided'}</p>
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