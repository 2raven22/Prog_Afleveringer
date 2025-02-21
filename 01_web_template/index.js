let currentPage = 2
let pages //array med alle elementer med class = page 
let gravity = 1
let ball
let menu
let riddle

function setup(){
    console.log('P5.js er loaded')
    pages = selectAll('.page')
    //nu kan man se at pages er blevet til en liste med alle class = page ting
    console.log(pages.length)

    ellipseMode(CORNER)
    createCanvas(windowWidth, windowHeight,)

    menu = new MenuMaker()
    riddle = new Riddle(true)
}

    function draw(){
        clear()
        menu.showMenu()
    }

function shiftPage(num){
    if(isNaN(num) || num > pages.length || num == 0){
        return
    }
    select("#page" + currentPage).removeClass('visible')
    currentPage = num
    select("#page" + currentPage).addClass('visible')
}

function keyPressed(){
    if(key == "Enter"){
        let fs = fullscreen()
        fullscreen(!fs)
    }
}


