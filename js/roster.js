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

let authUser = auth.currentUser;

window.onload = function() {

  auth.onAuthStateChanged(function(user) {
    console.log(user);

    const textarea = document.getElementById("rosterInfo")
    const submit = document.getElementById("submit")
    const confirmRoster = document.getElementById("confirmRoster")
    const submitRoster = document.getElementById("submitRoster")
    const submitConfirmRoster = document.getElementById("submitConfirmRoster")
    submitRoster.setAttribute("style", "display: block;")
    confirmRoster.setAttribute("style", "display: none;")

    submit.addEventListener("click", function(){
      submitRoster.setAttribute("style", "display: none;")
      confirmRoster.setAttribute("style", "display: block;")

      // i dont want to learn regex to have multiple delimiters in the split so
      // basically what this does is split it at the /t, join it back together with a 
      // /n in those places and then split at the /n. Essentially, the goal is to 
      // split at both /t and /n and in order to accomplish that we replace the /t
      // with /n and then split at /n
      let textAreaContent = textarea.value.split("\t").join("\n").split("\n")
      console.log(textAreaContent)
      let peopleList = []
      let counter = 1
      for (let i = 0; i < textAreaContent.length;i++){
        let accessLevelReal = ""
        if (textAreaContent[i+3].toLowerCase().includes("chair") || textAreaContent[i+3].toLowerCase().includes("captain") ){
          accessLevelReal = "Captain"
        }
        else if (textAreaContent[i+3].toLowerCase().includes("president")){
          accessLevelReal = "President"
        }
        else {
          accessLevelReal = "Member"
        }
        peopleList.push([
          textAreaContent[i] + " " + textAreaContent[i + 1],
          textAreaContent[i + 2],
          textAreaContent[i + 3],
          accessLevelReal
        ])
        i+=3
      }
      for (let i = 0; i < peopleList.length;i++){
        
        let wrapper = document.createElement("div")
        let name = document.createElement("input")
        name.value = peopleList[i][0]
        let email = document.createElement("input")
        email.value = peopleList[i][1]
        let access = document.createElement("select")
        let captainOption = document.createElement("option")
        captainOption.textContent = "Captain"
        let presidentOption = document.createElement("option")
        presidentOption.textContent = "President"
        let memberOption = document.createElement("option")
        memberOption.textContent = "Member"
        
        access.appendChild(captainOption)
        access.appendChild(presidentOption)
        access.appendChild(memberOption)
        access.valie = peopleList[i][3]
        wrapper.appendChild(name)
        wrapper.appendChild(email)
        wrapper.appendChild(access)
        confirmRoster.appendChild(wrapper)

      //   push(ref(db, 'users/' + userName), {
      //     time: time
      // });
        
        
      }

      submitConfirmRoster.addEventListener("click", function(){
        const updates = {}
        let error = false;
        for (let i = 0; i < peopleList.length; i++){
          
          let name = peopleList[i][0]
          if (name.includes(".")){
            alert("name can not contain a '.' . Please redo. ")
            error = true
            break
          }
          if (name.includes("(")){
            let index = name.indexOf("(")
            let endIndex = name.indexOf(")")
            name = name.slice(0, index) + name.slice(endIndex + 1)
          }
          let email = peopleList[i][1]
          let level = peopleList[i][3]
          updates["/whitelist/" + level + "/" + name] = email
          // set(ref(db, 'whitelist/' + level + "/" + name), {
          //       name: email
          // });
        }
        if (error == false){
          update(ref(db), updates)

        }
      })
      console.log(peopleList)
      
    })

  });
};






//idk wtf this is or why we need a class lemme know if its important
// const Grade = {
//   FRESHMAN: Symbol('Freshman'),
//   SOPHOMORE: Symbol('Sophomore'),
//   JUNIOR: Symbol('Junior'),
//   SENIOR: Symbol('Senior'),
// }

// class TeamMember {
//   name;                   // @type: string
//   grade;                  // @type: Grade
//   eventsAttended = [];    // type: list[Event]

//   constructor(name, grade) {
//     this.name = name;
//     this.grade = grade;
//   }

//   add_event(eventAttended) {
//     this.eventsAttended.push(eventAttended)
//   }
// }

// class TeamRoster {
//   constructor() {
//     // this.class_list
//   }
// }

// class Event {
//   eventType;
//   supposedToAttend;
// }
