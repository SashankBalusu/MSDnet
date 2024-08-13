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
    let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);
    console.log(accessLevel)
    if (accessLevel == "coaches"){
        let a = document.createElement("a")
        a.href = "roster.html"
        a.textContent = "Rosters"
        document.getElementById("mainnav").appendChild(a)
        


    }
    else {
      const sidebar = document.getElementById('qrCode');
      sidebar.classList.add("sidebar_small")
      let shown = false
      let qrCode = new QRCode("QRContent", {
        text: user["uid"],
        width: 256,
        height: 256,
        colorDark : "#2a2b2e",
        colorLight : "#f5bc51",
        correctLevel : QRCode.CorrectLevel.H
      });      
      sidebar.style.display = "block"
      document.getElementById('showQR').onclick = function () {
        if (shown == false) {
          sidebar.classList.remove("sidebar_small")
          document.getElementById("QRContent").style.display = "block"
          
        }
        else {
          sidebar.classList.add("sidebar_small")
          document.getElementById("QRContent").style.display = "none"

          
        }
        shown = !shown

      }
    }

    
    
  });
}