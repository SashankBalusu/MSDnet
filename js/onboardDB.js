import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
  update
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
// const analytics = getAnalytics(app);
const db = getDatabase();

const auth = getAuth();

const submit = document.getElementById("submit")
submit.addEventListener("click", function(){
    let events = []
    const nameInput = document.getElementById("nameInput")
    const gradeInput = document.getElementById("gradeInput")
    if (gradeInput.value < 9 || gradeInput.value > 12){
        alert("Please enter a grade between 9th and 12th")
        return
    }
    const period = document.getElementById("period")
    const returningCheck = document.getElementById("returningCheck")
    let isReturning = returningCheck.checked
    if (gradeInput.value == 9 && isReturning == true){
        alert("If you're in ninth grade you're probably not a returning member. Correct please!")
        return
    }

    let eventCheck = document.getElementsByClassName("eventCheck")
    for (let i = 0; i < eventCheck.length; i++){
        if (eventCheck[i].checked){
            events.push(eventCheck[i].value)
        }
    }
    console.log(nameInput.value)
    console.log(gradeInput.value)
    console.log(period.value)
    console.log(isReturning)
    console.log(events)
    let updates = {}
    if (nameInput.value && gradeInput.value && events.length != 0){
        let uid = localStorage.getItem("uid")
        updates["people/" + uid + "/preferredName"] = nameInput.value
        updates["people/" + uid + "/grade"] = gradeInput.value
        updates["people/" + uid + "/period"] = period.value
        updates["people/" + uid + "/returning"] = isReturning
        updates["people/" + uid + "/events"] = events
        updates["people/" + uid + "/onboarded"] = true
        update(ref(db), updates).then(() => {
            window.location = "home.html"
        })
    }
    else {
        alert("Fill everything out please, thank you")
    }
})