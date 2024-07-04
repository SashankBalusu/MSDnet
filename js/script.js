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

      get(child(dbRef, `people`)).then((snapshot) => {
        if (snapshot.exists()) {
          let result = snapshot.val()
          let validEmail = false
          console.log(result)
          let people = result
          let access = ""
          let currEmail = user["email"]
          console.log(currEmail)
          for (let person in people){
              if (people[person]["email"] == currEmail){
                console.log("success")
                access = people[person]["access"]
                validEmail = true
                break
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
            localStorage.setItem("accessLevel", CryptoJS.AES.encrypt(access, "Ngodeinweb"))
              console.log("success!")
              console.log(access)
              window.location = 'home.html';

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

// Random image on homepage
const images = ['/homepageshuffle/image1.jpg',
                'homepageshuffle/image2.webp',
                'homepageshuffle/image3.jpg',
              ];

const randImgInd = Math.floor(Math.random() * images.length);
const randomImage = images[randImgInd];
const imgElement = document.querySelector('.homepage-image img');

imgElement.src = randomImage;

// Random quote on homepage
const quotes = [
  "\"The only way to do great work is to love what you do.\" - Steve Jobs",
  "\"Believe you can and you're halfway there.\" - Theodore Roosevelt",
  "\"Your limitation—it's only your imagination.\" - Someone Imaginative",
  "\"Push yourself, because no one else is going to do it for you.\" - Someone Driven",
  "\"Great things never came from comfort zones.\" - Neil Strauss",
  "\"Moving unintentionally is no different from standing in place.\" - Aneesh Mardikar",
  "\"A pessimist sees difficulty in every opportunity. But an optimist? An optimist sees opportunity in every difficulty.\" \n - Winston Churchill",
];

const randQuoteInd = Math.floor(Math.random() * quotes.length);
const randomQuote = quotes[randQuoteInd];
const quoteElement = document.querySelector('.quote p');

quoteElement.textContent = randomQuote;