class Riddle{
    constructor(makeRiddleButtonBackground){
        this.makeRiddleButtonBackground = makeRiddleButtonBackround
        this.riddleDiv = selectAll('#riddle div')
        this.itemSize = 200
        this.riddleButtons = []
        this.itemGap = (width - this.riddleDiv.length * this.itemSize) / (this.riddleDiv.length +1)
        this.Ypos = 80
        this.secondsLeft = 180
        this.timer = setInterval(()=>this.countdown(), 1000)
        this.order =  ['white', 'black','blue', 'green', 'white', 'blue', 'green', 'red']
        this.currentColor = 0
        this.makeRiddleButton()
        
    }
    checkRiddle(riddleButton){
        if(riddleButton.col == this.order[this.currentColor]){
            this.currentColor ++
            riddleButton.showCorrect()
        }else{
            this.currentColor = 0
            for(const rb of this.riddleButtons){
                rb.showError()
            }
        }
        if(this.currentColor == this.order.length){
            select('#helpText').html('')
            select('#result').html('Tillykke')
            clearInterval(this.timer)
            shiftPage(5)
        }

    }
    makeRiddleButton(){
        let startX = this.itemGap
        for(const div of this.riddleDiv){
            let bg = null
            if(this.makeRiddleButtonBackground)
                bg = div.attribute('data-bg')
            
            this.riddleButtons.push(new RiddleButton(this, div.attribute('data-color'), startX, this.Ypos, bg))
            startX += this.itemSize + this.itemGap

        }
    }
    countdown(){
        this.secondsLeft--
        select('#time').html(this.secondsLeft)
        if(this.secondsLeft == 150){
            select('#hint').html('Prøv at klikke på knapperne')
        }
        if(this.secondsLeft == 60){
            select('#hint').html('Du skal bruge knappernes farve OG bagrundsfarven')
        }
        if(this.secondsLeft == 0){
        select('#helpText').html('')
        select('#result').html('Du har tabt')
        clearInterval(this.timer)
        shiftPage(5)
        }
     }
}
class RiddleButton{
    constructor(riddle, col, x, y, background){
        this.background = background
        this.button = createButton(col)
        this.col = col
        this.riddle = riddle
        this.button.position(x,y)
        this.button.style('zindex', '5')

        if(this.background){
        this.button.style('background', this.background)
        }
        this.button.addClass('riddleButton')
        this.Button.mousePressed( ()=> this.riddle.checkRiddle(this))
    }
    showCorrect(){
        this.button.addClass('correct')
        setTimeout( ()=>this.button.removeClass('correct'), 500)

    }
    showError(){
        this.button.addClass('error')
        setTimeout( ()=>this.buttin.removeClass('error'), 500)
    }
}
class MenuMaker{
    constructor(){
        this.menuItems = selectAll ('#menu div')
        this.itemSize = 100
        this.itemGap = (width-600)/4
        this.menuBalls = []
        this.makeMenu()
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