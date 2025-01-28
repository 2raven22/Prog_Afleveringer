let currentPage = 2
let pages //array med alle elementer med class = page 
let gravity = 1

class menuMaker{
    constructor(){
        this.menuItems = selectAll ('#menu div')
        this.itemSize = 100
        this.itemGap = (width-400)/5
        this.menuBalls = []
        this.makeMenu()
        this.secondsLeft = 180
        this.timer = setInterval(()=>this.countdown(), 1000)
    }
    countdown(){
        this.secondsLeft--
        select('#time').html(this.secondsLeft)
    }
    makeMenu(){
        let startX = this.itemGap
        for(const menuItem of this.menuItems){
            console.log(menuItem.attribute(`data-page`))
            let b = new Ball(this.itemSize, menuItem.attribute(`data-page`), menuItem.html(), menuItem.attribute(`data-color`), startX)
            startX += this.itemSize + this.itemGap
            this.menuBalls.push(b)
        }
    }
    showMenu(){
        for(const menuBall of this.menuBalls){
            menuBall.show()
            menuBall.move()
            menuBall.collide()
        }
    }
}

class Ball{
    constructor(diameter, BP, BL, BC, BX){
        this.diameter = diameter
        this.BP = BP
        this. BL = BL
        this.BC = BC
        this.BX = BX
        this.gravity = 1
        this.air = .92
        this.velocity = 0
        this.BY = -this.BX
        this.ballButton = createButton(this.BL)
        this.ballButton.size(this.diameter, this.diameter)
        this.ballButton.mousePressed( ()=> shiftPage(this.BP))
    }
    show(){
        noStroke()
        fill(this.BC)
        ellipse(this.BX, this.BY, this.diameter)
    }
    move(){
        this.velocity += this.gravity
        this.velocity *= this.air
        this.BY += this.velocity
        this.ballButton.position(this.BX, this.BY)
    }
    collide(){
        if(this.BY + this.diameter >= height){
            this.BY = height - this.diameter
            this.velocity = -this.velocity
        }
    }
}
let ball
let menu

function setup(){
    console.log('P5.js er loaded')
    pages = selectAll('.page')
    //nu kan man se at pages er blevet til en liste med alle class = page ting
    console.log(pages.length)

    ellipseMode(CORNER)
    createCanvas(windowWidth, windowHeight,)

    menu = new menuMaker()
}

    function draw(){
        clear()
        menu.showMenu()
    }

function shiftPage(num){
    if(num == "ArrowLeft"){
        num = currentPage - 1
    }
    if(num == "ArrowRight"){
        num = currentPage + 1
    }

    if(isNaN(num) || num > pages.length || num == 0){
        return
    }
    select("#page" + currentPage).removeClass('visible')
    currentPage = num
    select("#page" + currentPage).addClass('visible')
}

function keyPressed(){
    console.log(key)
    shiftPage(key)
}

