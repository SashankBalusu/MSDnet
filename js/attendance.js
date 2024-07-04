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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);
    console.log(accessLevel)
    if (accessLevel == "Member" || accessLevel == "Captain"){
        const content = document.getElementById("memberCaptainMain")
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
            // for (let i = 0; i <= user["email"].length; i++){
            //     setInterval(displayCode, 1000, qr, user["email"], i)
                
            // }
        })
        
    }
  } else {
    // User is signed out
    // ...
  }
});
