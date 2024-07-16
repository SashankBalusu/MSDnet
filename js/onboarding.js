
localStorage.removeItem("prefferedName")


let currPage = 0
const pages = document.querySelectorAll(".page");
const translateAmount = 100; 
let translate = 0;

function slide(direction){
    if (direction == "prev"){
        currPage -= 1
    }
    else {
        currPage += 1
    }
    handlePage(currPage)

    direction === "next" ? translate -= translateAmount : translate += translateAmount;

    pages.forEach(
    pages => (pages.style.transform = `translateY(${translate}%)`)
    );
}
function handlePage(pageNum) {
    console.log(currPage)
    if (pageNum == 1){
        const nameInput = document.getElementById("nameInput")
        if (localStorage.getItem("prefferedName") != undefined){
            nameInput.value = localStorage.getItem("prefferedName")

        }
        else {
            nameInput.value = localStorage.getItem("userName")

        }
    }
    else if (pageNum == 2){
        const nameInput = document.getElementById("nameInput")
        localStorage.setItem("prefferedName", nameInput.value)
    }
}
