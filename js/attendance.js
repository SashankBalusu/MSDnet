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
function displayCode(qrObj, item, length){
    setTimeout(function() {
        length++
        qrObj.makeCode(item.substring(0, length));
        if (length < item.length){
            displayCode(qrObj, item, length)
        }

    }, (Math.random() * (100 - 10) + 10))

}
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();

const auth = getAuth();
window.onload = function() {

    auth.onAuthStateChanged(function(user) {
      console.log(user);
      let accessLevel = ""
      get(child(ref(db), "whitelist")).then((snapshot) => {
        if (snapshot.exists()){
            let content = snapshot.val()
            for (let access in content){
                for (let person in content[access]){
                    if (content[access][person] == user["email"]){
                        accessLevel = access
                        break
                    }
                }
            }
        }
      }).then( () => {
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

      })

        
    })
}


