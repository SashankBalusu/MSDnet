import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  onAuthStateChanged
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
function displayCode(qrObj, item, length){
    setTimeout(function() {
        length++
        qrObj.makeCode(item.substring(0, length));
        if (length < item.length){
            displayCode(qrObj, item, length)
        }

    }, (Math.random() * (20 - 10) + 10))

}
function findLoc(el, arr, st, en) { 
  // if (arr.length == 1){
  //   if (el > arr[0]){
  //     return 0
  //   }
  //   else {
  //     return -1
  //   }
  // }
  st = st || 0; 
  en = en || arr.length; 
  var pivot = parseInt(st + (en - st) / 2, 10); 
  if (arr[pivot == el]){
    return pivot
  }
  else if (en - st <= 1){
    if (arr[pivot] > el){
      return pivot - 1
    }
    else {
      return pivot
    }
  }
  if (arr[pivot] < el) { 
      return findLoc(el, arr, pivot, en); 
  } else { 
      return findLoc(el, arr, st, pivot); 
  } 
}
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();
const dbRef = ref(db)
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);
    console.log(accessLevel)
    if (accessLevel == "Member" || accessLevel == "Captain"){
        const content = document.getElementById("memberCaptainMain")
        get(child(ref(db), `people/${user["uid"]}` + "/generateCode")).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val())
            const qrcode = document.createElement("div")
            qrcode.id = "qrcode"
            content.appendChild(qrcode)
            const qr = new QRCode(qrcode);
            qr.makeCode(user["email"]);

          }
          else {
            const genCodeButton = document.createElement("button")
            genCodeButton.textContent = "Generate Code"
            genCodeButton.id = "generate"
            const qrcode = document.createElement("div")
            qrcode.id = "qrcode"
            content.appendChild(genCodeButton)
            content.appendChild(qrcode)
            const qr = new QRCode(qrcode);
    
            genCodeButton.addEventListener("click", function(){
                displayCode(qr, user["email"], 0)
                let updates = {}
                updates[`people/${user["uid"]}/generateCode`] = true
                update(ref(db), updates)
                // for (let i = 0; i <= user["email"].length; i++){
                //     setInterval(displayCode, 1000, qr, user["email"], i)
                    
                // }
                genCodeButton.remove()

            })

          }
        })
        
        
    }
    else {
      const eventDisplay = document.getElementById("eventDisplay")
      get(child(dbRef, `events`)).then((snapshot) => {
        if (snapshot.exists()){
          let events = snapshot.val()
          let sortedArr = []
          for (let key in events){
            let date = events[key]["date"]
            let dateSplit = date.split("/")
            console.log(parseInt(dateSplit[0]))
            if (parseInt(dateSplit[0]) >= 1 && parseInt(dateSplit[0]) <=6){
              date += "/" + ((new Date().getFullYear()) + 1)
            }
            else {
              date += "/" + new Date().getFullYear()
            }
            let currDay = new Date()
            let eventDate = new Date(date)
            let Difference_In_Time = eventDate - currDay;
            
            let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            if (sortedArr.length == 0){
              sortedArr.push(Difference_In_Days)
              const card = document.createElement("div")
              card.classList.add("card")
              card.id = key
              const p = document.createElement("p")
              p.textContent = key
              const distance = document.createElement("p")
              distance.textContent = Difference_In_Days + " Days"
              distance.style.position = "absolute"
              distance.style.bottom = 0
              card.appendChild(p)
              card.appendChild(distance)
              
              eventDisplay.appendChild(card)
              
            }
            else {
              let loc = findLoc(Difference_In_Days, sortedArr) + 1
              sortedArr.splice(loc, 0, Difference_In_Days); 
              const card = document.createElement("div")
              card.classList.add("card")
              card.id = key
              const p = document.createElement("p")
              p.textContent = key
              const distance = document.createElement("p")
              distance.textContent = Difference_In_Days + " Days"
              distance.style.position = "absolute"
              distance.style.bottom = 0
              card.appendChild(p)
              card.appendChild(distance)

              eventDisplay.insertBefore(card, eventDisplay.childNodes[loc])
              console.log(key, date)

            }
            console.log(sortedArr)
            console.log(key)
            


          }
          console.log(sortedArr)

        }
      }).then(() => {
        eventDisplay.firstChild.classList.add("moving-border")
      })
    }
  } else {
    // User is signed out
    // ...
  }
});
