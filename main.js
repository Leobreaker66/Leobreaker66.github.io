window.onbeforeunload = saveData
window.onload = loadStuff
var userData = ['1','2']
loadData()
function loadStuff(){
    dataList=[]
    for (let i = 0; i< dataList.length && i < userData.length; i++){
            dataList[i].value = userData[i]
    }
}

function saveData() {
	for (let i =0; i < userData.length && i < dataList.length; i++){
		localStorage.setItem(i,dataList[i].value)
	}
}

function loadData() {
	for (let i = 0; i <userData.length; i++){
		v = localStorage.getItem(i)
		if (v){
			userData[i] = v
		}
	}
}

function switchTheme() {
    currentTheme = document.documentElement.dataset.theme
    if (currentTheme=="light") {
        document.documentElement.dataset.theme = "dark"
    }
    else {
        document.documentElement.dataset.theme = "light"
    }
}



var gameLoopId = setInterval(gameLoop,10)
var saveLoopId = setInterval(saveLoop, 10000)

var canvas = document.getElementById("RPGCanvas")
canvas.addEventListener("mousedown", mouseDown)
canvas.addEventListener("mousemove", mouseMoved)
canvas.addEventListener("mouseup", mouseUp)
canvas.addEventListener("contextmenu", function (e){
    e.preventDefault()
}, false)
var context = canvas.getContext("2d")
var displayWidth
var displayHeight
resizeCanvas()
var bgImage = new Image(3200,2400)
bgImage.src="bgImage.png"


var Player = {
    posX: 1540,
    posY: 1245,
    destX: 1540,
    destY: 1245,
    speed: 3
}

var Mouse = {
    X: 0,
    Y: 0,
    m1down: false,

}

function distance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

function rect(x,y,width,height,color){
    context.beginPath()
    context.fillStyle = color
    context.fillRect(x,y,width,height)
}

function rectOutline(x,y,width,height,color,thickness){
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = thickness
    context.strokeRect(x-thickness/2,y-thickness/2,width+thickness,height+thickness)
}

function circle(x,y,radius,color){
    context.beginPath()
    context.fillStyle = color
    context.arc(x,y,radius,0,2*Math.PI)
    context.fill()
}

function drawBackground(bg){
    context.drawImage(bg,displayWidth/2 - Player.posX,displayHeight/2 -Player.posY,bg.width,bg.height)
}

function drawCastBar(text,value){
    const bWidth = 300
    const bHeight = 50
    value = Math.min(1,Math.max(0,value))
    rectOutline(displayWidth/2 - bWidth/2, displayHeight - 30 - bHeight,bWidth,bHeight,"#FFFFFF",2)
    rect(displayWidth/2-bWidth/2,displayHeight-30-bHeight,value*bWidth,bHeight,"#00FF00")
    context.fillStyle = "#FFFFFF"
    context.font = "40px serif"
    const measure = context.measureText(text)
    const tWidth = measure.width
    const tHeight = measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent
    context.fillText(text,displayWidth/2 - Math.min(bWidth,tWidth)/2, displayHeight - 30 - (bHeight-tHeight)/2 - measure.actualBoundingBoxDescent,bWidth)
}



var mouseHeldId;

function mouseDown(eventData) {
    if (eventData.button == 0){
        var clickX = eventData.clientX
        var clickY = eventData.clientY
        Mouse.X = clickX
        Mouse.Y = clickY
        Player.destX = Player.posX + clickX - displayWidth/2
        Player.destY = Player.posY + clickY - displayHeight/2
        stopMoving()
        Mouse.m1down = Date.now()
        mouseHeldId = setInterval(updateDestination,10)
    }
    else if(eventData.button == 2){
        Player.destX = Player.posX
        Player.destY = Player.posY
        stopMoving()
    }
}

function updateDestination() {
    var clickX = Mouse.X
    var clickY = Mouse.Y
    Player.destX = Player.posX + clickX - displayWidth/2
    Player.destY = Player.posY + clickY - displayHeight/2
}

function stopMoving() {
    clearInterval(mouseHeldId)
    if(Mouse.m1down && Date.now() - Mouse.m1down > 500){
        Player.destX = Player.posX
        Player.destY = Player.posY
    }
}

function mouseMoved(eventData) {
    Mouse.X = eventData.clientX
    Mouse.Y = eventData.clientY
}

function mouseUp(eventData){
    if(eventData.button == 0){
        stopMoving()
        Mouse.m1down = false
    }
}

var startTime = Date.now()
function gameLoop() {
    rect(0,0,displayWidth,displayHeight,"#000000")
    drawBackground(bgImage)
    drawCastBar("Gathering Herbs",(Date.now()-startTime)/5000)
    circle(displayWidth/2,displayHeight/2,15,"#FFFFFF")
    if (distance(Player.posX,Player.posY,Player.destX,Player.destY)<=Player.speed){
        Player.posX = Player.destX
        Player.posY = Player.destY

    }
    else{
        var direction = Math.atan((Player.destY-Player.posY)/(Player.destX-Player.posX))
        var distX = Math.cos(direction) * Player.speed
        var distY = Math.sin(direction) * Player.speed
        if (Player.destX < Player.posX){
            distX *=-1
            distY *=-1
        }
        Player.posX += distX
        Player.posY += distY
    }
}

function saveLoop() {

}


window.addEventListener("resize",resizeCanvas);

function resizeCanvas(){
    displayWidth = window.innerWidth
    displayHeight = window.innerHeight
    canvas.width = displayWidth
    canvas.height = displayHeight
}


/*
//The following code spawns a 'p' element at clickX, clickY 
        const para = document.createElement("p");
        const node = document.createTextNode("Text here!")
        para.appendChild(node)
        para.style.position = "fixed"
        para.style.top = clickY + "px"
        para.style.left = clickX + "px"
        document.body.appendChild(para)
 */