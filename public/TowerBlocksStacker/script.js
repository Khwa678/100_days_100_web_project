const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreEl = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

const menu = document.getElementById("menu");
const pauseMenu = document.getElementById("pauseMenu");
const gameOverMenu = document.getElementById("gameOverMenu");

let blocks = [];
let currentBlock;
let score = 0;
let gameRunning = false;
let gamePaused = false;
let cameraY = 0;
let speed = 4;

class Block{
    constructor(x,y,width,color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=30;
        this.color=color;
        this.dir=1;
    }

    move(){
        this.x += speed * this.dir;

        if(this.x <= 0 || this.x + this.width >= canvas.width){
            this.dir *= -1;
        }
    }

    draw(){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y-cameraY,this.width,this.height);
    }
}

function randomColor(){
    return `hsl(${score*15},80%,60%)`;
}

function initGame(){

    blocks=[];

    let base = new Block(
        canvas.width/2-100,
        canvas.height-80,
        200,
        "white"
    );

    blocks.push(base);

    currentBlock = new Block(
        0,
        canvas.height-120,
        200,
        randomColor()
    );

    score=0;
    speed=4;
}

function placeBlock(){

    let prev = blocks[blocks.length-1];

    let overlap =
        Math.min(
            currentBlock.x+currentBlock.width,
            prev.x+prev.width
        ) -
        Math.max(currentBlock.x,prev.x);

    if(overlap<=0){
        gameOver();
        return;
    }

    currentBlock.width = overlap;
    currentBlock.x = Math.max(currentBlock.x,prev.x);

    blocks.push(
        new Block(
            currentBlock.x,
            currentBlock.y,
            overlap,
            randomColor()
        )
    );

    score++;
    scoreEl.textContent=score;

    if(score%5===0){
        speed+=0.5;
    }

    currentBlock = new Block(
        0,
        blocks[blocks.length-1].y-40,
        overlap,
        randomColor()
    );

    cameraY =
        Math.max(
            0,
            blocks[0].y -
            blocks[blocks.length-1].y -
            200
        );
}

function gameOver(){
    gameRunning=false;

    finalScore.textContent=
        `Final Score: ${score}`;

    gameOverMenu.classList.add("active");
}

function animate(){

    requestAnimationFrame(animate);

    if(!gameRunning || gamePaused) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    blocks.forEach(block=>block.draw());

    currentBlock.move();
    currentBlock.draw();
}

animate();

document.getElementById("startBtn")
.addEventListener("click",()=>{

    menu.classList.remove("active");
    gameRunning=true;

    initGame();
});

document.addEventListener("keydown",(e)=>{

    if(!gameRunning) return;

    if(e.code==="Space"){
        placeBlock();
    }

    if(e.key==="p"){
        togglePause();
    }
});

document.getElementById("pauseBtn")
.addEventListener("click",togglePause);

document.getElementById("resumeBtn")
.addEventListener("click",togglePause);

function togglePause(){

    gamePaused=!gamePaused;

    pauseMenu.classList.toggle(
        "active",
        gamePaused
    );
}