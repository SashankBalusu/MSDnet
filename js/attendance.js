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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();
const dbRef = ref(db)
const auth = getAuth();
const html5QrCode = new Html5Qrcode("reader");
let peopleToAdd = []
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



onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    let accessLevel = CryptoJS.AES.decrypt(localStorage.getItem("accessLevel"), "Ngodeinweb").toString(CryptoJS.enc.Utf8);
    console.log(accessLevel)
    let perms = false
    get(child(ref(db), `people/${user["uid"]}/attendancePerms`)).then((snapshot) => {
      if (snapshot.exists()){
        perms = true
      }
    }).then(() => {
      if ((accessLevel == "Member" || accessLevel == "Captain") && perms == false){
        const content = document.getElementById("memberCaptainMain")
        //get(child(ref(db), `people/${user["uid"]}` + "/generateCode")).then((snapshot) => {
          //if (snapshot.exists()) {
            //console.log(snapshot.val())
            const qrcode = document.createElement("div")
            qrcode.id = "qrcode"
            content.appendChild(qrcode)
            const qr = new QRCode(qrcode);
            qr.makeCode(user["uid"]);
            content.style.display = "block"


          //}
        //   else {
        //     const genCodeButton = document.createElement("button")
        //     genCodeButton.textContent = "Generate Code"
        //     genCodeButton.id = "generate"
        //     const qrcode = document.createElement("div")
        //     qrcode.id = "qrcode"
        //     content.appendChild(genCodeButton)
        //     content.appendChild(qrcode)
        //     const qr = new QRCode(qrcode);
    
        //     genCodeButton.addEventListener("click", function(){
        //         displayCode(qr, user["uid"], 0)
        //         let updates = {}
        //         updates[`people/${user["uid"]}/generateCode`] = true
        //         update(ref(db), updates)
        //         // for (let i = 0; i <= user["email"].length; i++){
        //         //     setInterval(displayCode, 1000, qr, user["email"], i)
                    
        //         // }
        //         genCodeButton.remove()

        //     })

        //   }
        // })
        
        
    }
    else {
      // if (accessLevel == "President" || (accessLevel != "coaches" && perms == true)){
      //   const sidebar = document.getElementById('qrCode');
      //   sidebar.classList.add("sidebar_small")
      //   let shown = false
      //   let qrCode = new QRCode("QRContent", {
      //     text: user["uid"],
      //     width: 256,
      //     height: 256,
      //     colorDark : "#2a2b2e",
      //     colorLight : "#f5bc51",
      //     correctLevel : QRCode.CorrectLevel.H
      //   });      
      //   sidebar.style.display = "block"
      //   document.getElementById('showQR').onclick = function () {
      //     if (shown == false) {
      //       sidebar.classList.remove("sidebar_small")
      //       document.getElementById("QRContent").style.display = "block"
            
      //     }
      //     else {
      //       sidebar.classList.add("sidebar_small")
      //       document.getElementById("QRContent").style.display = "none"

            
      //     }
      //     shown = !shown

      //   }
      // }
      let uidToNameMap = {}
      let nameToUIDMap = {}
      let peopleArr = []
      get(child(dbRef, "people")).then((snapshot) => {
        if (snapshot.exists()){
          for (let key in snapshot.val()){
            uidToNameMap[key] = snapshot.val()[key]["username"]
            nameToUIDMap[snapshot.val()[key]["username"]] = key
          }
          console.log(uidToNameMap)
          peopleArr = Object.values(uidToNameMap)


        }
      })
      const addPeopleOG = document.getElementById("addPeopleOG")
      addPeopleOG.addEventListener("click", function(){
        document.getElementById("peopleForm").style.display = "block"
        peopleToAdd = []
      })
      const searchPeople = document.getElementById("searchPeople")
      const results = document.getElementById("results")
      const adding = document.getElementById("adding")
      searchPeople.addEventListener("input", function(){
        let searchPower = {}

        results.replaceChildren()
        if (searchPeople.value.length == 0){
          return
        }
        console.log(searchPeople.value)
        for (let item of peopleArr){
          console.log(item.substring(0,searchPeople.value.length))
          if (searchPeople.value.toLowerCase() == item.substring(0,searchPeople.value.length).toLowerCase()){
            searchPower[item] = 1
            console.log("match found: " + item)

          }
          else if(item.toLowerCase().includes(searchPeople.value.toLowerCase())) {
            searchPower[item] = 0.66
          }
          //can probably add something that checks if the letters typed are present
        }
        var items = Object.keys(searchPower).map(function(key) {
          return [key, searchPower[key]];
        });
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
          return second[1] - first[1];
        });
        if (items.length == 0){
          let res = document.createElement("button")
          res.textContent = "No results found!"
          res.classList.add("searchResult")
          res.type = "button"
          results.appendChild(res)
        }
        for (let item of items.slice(0,5)){
          let res = document.createElement("button")
          res.textContent = item[0]
          res.classList.add("searchResult")
          res.type = "button"
          res.addEventListener("click", function(){
            
            let clicked = res.classList.toggle("clicked")
            if (clicked == true){
              peopleToAdd.push(res.textContent)
              adding.textContent += " " + res.textContent
            }
            else {
              const index = peopleToAdd.indexOf(res.textContent);
              peopleToAdd.splice(index, 1);
              let text = adding.textContent
              
              adding.textContent = text.replace(res.textContent, "")





            }
          })
          results.appendChild(res)
        }
        // Create a new array with only the first 5 items
        console.log(items.slice(0, 3));
      })
      const submitPeople = document.getElementById("submitPeople")
      submitPeople.addEventListener("click", function(){
        const updates = {}
        for (let item of peopleToAdd){
          updates[`people/${nameToUIDMap[item]}/attendancePerms`] = "true"


        }
        update(ref(db), updates)

      })
      const eventDisplay = document.getElementById("eventDisplay")
      const pastEventDisplay = document.getElementById("pastEventDisplay")
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
            if (Difference_In_Days < 0) {
              const card = document.createElement("div")
              card.classList.add("card")
              card.id = key
              const p = document.createElement("p")
              p.textContent = key
              const distance = document.createElement("p")
              distance.textContent = Math.abs(Difference_In_Days) + " Days Ago"
              distance.style.position = "absolute"
              distance.style.bottom = 0
              card.appendChild(p)
              card.appendChild(distance)
              pastEventDisplay.appendChild(card)
            }
            else {

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
                card.addEventListener("click", function(){
                  document.getElementById("eventForm").style.display = "block";
                  document.getElementById("attendanceLabel").textContent = "Attendance: " + key
                  document.getElementById("currScan").textContent = "Scanning: "
  
                  
              
                  // let htmlscanner = new Html5QrcodeScanner(
                  //     "my-qr-reader",
                  //     { 
                  //         fps: 10,
                  //         rememberLastUsedCamera: true,
                  //         supportedScanTypes: [
                  //             Html5QrcodeScanType.SCAN_TYPE_CAMERA
                  //         ],
                  //         aspectRatio: 1.7777778
                  //     }
                  // );
                  // htmlscanner.render(onScanSuccess);
                  
                  
                })
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
                card.addEventListener("click", function(){
                  document.getElementById("eventForm").style.display = "block";
                  document.getElementById("attendanceLabel").textContent = "Attendance: " + key
                  document.getElementById("currScan").textContent = "Scanning: "
  
                })
                eventDisplay.insertBefore(card, eventDisplay.childNodes[loc])
                console.log(key, date)
  
              }
            }
            
            console.log(sortedArr)
            console.log(key)
            


          }
          console.log(sortedArr)

        }
      }).then(() => {
        eventDisplay.firstChild.classList.add("moving-border")
        document.getElementById("coachMain").style.display = "block"

      })
      const scan = document.getElementById("scan")
      scan.addEventListener("click", function(){
        scan.style.display = "none"
        let event = document.getElementById("attendanceLabel").textContent.substring(12)
        console.log(event)
        document.getElementById("stop").style.display = "block"
          // This method will trigger user permissions
        Html5Qrcode.getCameras().then(devices => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          if (devices && devices.length) {
          var cameraId = devices[0].id;
          html5QrCode.start(
          cameraId, 
          {
              fps: 0.7,    // Optional, frame per seconds for qr code scanning
          },
          (decodedText, decodedResult) => {
              if (uidToNameMap[decodedText] != undefined){
                document.getElementById("currScan").textContent = "Scanning: " + uidToNameMap[decodedText]
                get(child(ref(db), `people/${decodedText}/eventsAttended/${event}`)).then((snapshot) => {
                  if (snapshot.exists()){
                    let lastKey = "timeIn1"
                    let latest = snapshot.val()["timeIn1"]
                    let timeElapsed
                    let updates = {}
                    let signTime = Date.now()
                    for (let key in snapshot.val()){
                      if (key == "timeElapsed"){
                        continue
                      }
                      let time = snapshot.val()[key]
                      let secElapsed = (signTime - time) / 1000
                      if (secElapsed < 30) {
                        return
                      }
                      if (time > latest){
                        latest = time
                        lastKey = key

                      }

                    }
                    console.log(lastKey)
                    const keysArray = Object.keys(snapshot.val())
                    let keyLength = keysArray.length
                    if (keyLength > 1) {
                      keyLength -= 1
                    }
                      
                    let instance = Math.ceil(keyLength / 2)
                    if (lastKey.includes("In")){
                      
                        if (instance != 1){
                          timeElapsed = snapshot.val()["timeElapsed"] + ((signTime - snapshot.val()[`timeIn${instance}`]) / 1000)
                        }

                        else {
                          timeElapsed = (signTime- snapshot.val()[`timeIn${instance}`]) / 1000
                        }
                        updates[`people/${decodedText}/eventsAttended/${event}/timeOut${instance}`] = signTime
                        updates[`people/${decodedText}/eventsAttended/${event}/timeElapsed`] = timeElapsed
                        document.getElementById("currScan").textContent = `Signed out. Time elapsed: ${Math.round(timeElapsed/60)} min` 

                    }
                    else {
                      updates[`people/${decodedText}/eventsAttended/${event}/timeIn${instance+1}`] = signTime

                    }
                    update(ref(db), updates)

                      //add a timeOut
                    
                    //this means that this attribute has already been created, meaning theyve signed in
                    
                    //now you need to handle if its just a repeat sign in attempt... if the user scans again within 20 seconds 
                    //assume that it was an accident and dont do anything with the data.
                  }
                  else {
                    //create sign in
                    let currTime = Date.now()
                    let updates = {}
                    updates[`people/${decodedText}/eventsAttended/${event}/timeIn1`] = currTime
                    update(ref(db), updates)
                    
                  }
                })
              }
              else {
                document.getElementById("currScan").textContent = "Not a valid QR Code."

              }
              console.log(decodedText)
              
              
              // do something when code is read
          },
          (errorMessage) => {
              // parse error, ignore it.
          })
          .catch((err) => {
          // Start failed, handle it.
          });
          // .. use this to start scanning.
          }
      }).catch(err => {
          // handle err
      });
      })
      const stop = document.getElementById("stop")
      stop.addEventListener("click", function(){
        html5QrCode.stop().then((ignore) => {
          // QR Code scanning is stopped.
        }).catch((err) => {
          // Stop failed, handle it.
        });
        scan.style.display = "block"
        stop.style.display = "none"

      })
      document.getElementById("closeEventForm").addEventListener("click", function(){
        document.getElementById("eventForm").style.display = "none";
        html5QrCode.stop().then((ignore) => {
          // QR Code scanning is stopped.
        }).catch((err) => {
          // Stop failed, handle it.
        });
        scan.style.display = "block"
        stop.style.display = "none"
      
      })
      document.getElementById("closePeopleForm").addEventListener("click", function(){
        document.getElementById("peopleForm").style.display = "none";
       
      
      })
    }
    })
    
  } else {
    // User is signed out
    // ...
  }
});
