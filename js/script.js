import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
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
// Menu bar
// document.querySelector('.menu-icon').addEventListener('click', function() {
//     var menuContainer = document.querySelector('.menu-container');
//     menuContainer.classList.toggle('show');
//     var menuIcon = document.querySelector('.menu-icon');
//     menuIcon.classList.toggle('show');
// });

const provider = new GoogleAuthProvider();
const auth = getAuth();
const login = document.getElementById("login")
console.log(login)
login.addEventListener("click", function(){
  signInWithPopup(auth, provider)
  .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      console.log(user)
      let authUser = auth.currentUser;
      const dbRef = ref(getDatabase());

      get(child(dbRef, `whitelist`)).then((snapshot) => {
        if (snapshot.exists()) {
          let result = snapshot.val()
          let validEmail = false
          console.log(result)
          let whitelist = result
          let access = ""
          let currEmail = user["email"]
          console.log(currEmail)
          for (let accessLevel in whitelist){
            for (let name in whitelist[accessLevel]){
              if (whitelist[accessLevel][name] == currEmail){
                console.log("success")
                access = accessLevel
                validEmail = true
                break
              }
            }
          }
          if (validEmail == false){
            //handle false email better in future. Currently deletes from database and alerts on screen
            deleteUser(authUser).then(() => {
            console.log("hey deleted")
            // User deleted.
            })
            alert("your account has not been white listed. Please ask a coach to be added to the internal service.")
          }
          else {
            const db = getDatabase()
            get(child(dbRef, `people/` + user["uid"])).then((snapshot) => {
              if (!(snapshot.exists())) {
                set(ref(db, 'people/' + user["uid"]), {
                  username: user["displayName"],
                  email: user["email"],
                  access: access,
                }).then(() => {
                  localStorage.setItem("accessLevel", CryptoJS.AES.encrypt(access, "Ngodeinweb"))
                  localStorage.setItem("userName", user["displayName"])
                  localStorage.setItem("uid", user["uid"])
  
                  console.log("success!")
                  console.log(access)
                  window.location = 'home.html';
                });
              }
              else {
                localStorage.setItem("accessLevel", CryptoJS.AES.encrypt(access, "Ngodeinweb"))
                localStorage.setItem("userName", user["displayName"])
                localStorage.setItem("uid", user["uid"])
    
                console.log("success!")
                console.log(access)
                window.location = 'home.html';
              }
              
            })
            
            

          }
        } else {
          console.log("No data available");
        }
      })
      
      
  
  
      // IdP data available using getAdditionalUserInfo(result)
      // ...
  }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
  });
})