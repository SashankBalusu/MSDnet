function showTime(){
    var countDownDate = new Date("Apr 11, 2025 17:00:00").getTime();

// Update the count down every 1 second

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // var h = date.getHours(); // 0 - 23
    // var m = date.getMinutes(); // 0 - 59
    // var s = date.getSeconds(); // 0 - 59
    // var session = "AM";
    
    // if(h == 0){
    //     h = 12;
    // }
    
    // if(h > 12){
    //     h = h - 12;
    //     session = "PM";
    // }
    
    // h = (h < 10) ? "0" + h : h;
    // m = (m < 10) ? "0" + m : m;
    // s = (s < 10) ? "0" + s : s;
    
    //var time = h + ":" + m + ":" + s + " " + session;
    var time = days + "D " + hours + "H " + minutes + "M " + seconds + "S"
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(showTime, 1000);
    
}
function greeting(){
    let greet = document.getElementById("greeting")
    greet.textContent = "Hello, " + localStorage.getItem("userName")
}
showTime();
if (window.location.href.includes("home")){
    greeting()

}
const images = ['/homepageshuffle/1.jpg',
                'homepageshuffle/2.jpg',
                'homepageshuffle/3.jpg',
                'homepageshuffle/4.jpg',
                'homepageshuffle/5.jpg',
                'homepageshuffle/6.jpg',
                'homepageshuffle/7.jpg',
              ];

const randImgInd = Math.floor(Math.random() * images.length);
const randomImage = images[randImgInd];
var htmlElement = document.querySelector("html");
htmlElement.setAttribute("style", `background: url(${randomImage}) no-repeat center center fixed;     background-size: 100vw 100vh;`)


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