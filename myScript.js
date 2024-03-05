const grid = document.querySelector(".grid");
const blockWidth = 100;
const blockHeight = 20;

const userBlockWidth = 80;
const userBlockHeight = 20;

const startPosition = [240,20];
const currentPosition = startPosition;

const ballStart =[230,50];
const ballDiameter = 20;
let currentPositionBall = ballStart;
let ballInterval;
let xDirection=-2;
let yDirection=2;

const screenDimension = {xmin : 0,ymin : 0, xmax :560, ymax:300};
let score = 0;

document.querySelector(".score").innerHTML=score;


//class to create a block
class Block {
  constructor (xAxis, yAxis){
    this.bottomLeft = [xAxis,yAxis];
    this.bottomRight = [xAxis+blockWidth,yAxis]
    this.topLeft = [xAxis, yAxis+blockHeight]
    this.topRight = [xAxis+blockWidth,yAxis+blockHeight]

  }
}
//array with blocks we want to create
const blocks =[
  new Block(10,270),
  new Block(120,270),
  new Block(230,270),
  new Block(340,270),
  new Block(450,270),
  //row 2
  new Block(10,240),
  new Block(120,240),
  new Block(230,240),
  new Block(340,240),
  new Block(450,240),

]

// function for drawing 1 block
function drawBlock(block, blockClass){

  const divBlock = document.createElement("div");
  divBlock.classList.add(blockClass);
  divBlock.style.left = block.bottomLeft[0]+"px";
  divBlock.style.bottom = block.bottomLeft[1]+"px";
  grid.appendChild(divBlock);
  
}

//drawing my blocks using my function

blocks.forEach((block)=>{
    drawBlock(block,"block");
});


//class to create user block
class userBlock {
  constructor (xAxis, yAxis){
    this.bottomLeft = [xAxis,yAxis];
    this.bottomRight = [xAxis+userBlockWidth,yAxis]
    this.topLeft = [xAxis, yAxis+userBlockHeight]
    this.topRight = [xAxis+userBlockWidth,yAxis+userBlockHeight]

  }
}

//make a user block
let user = new userBlock(currentPosition[0],currentPosition[1]);

//draw the user block
drawBlock(user,"userBlock");

//function for the keydown handler

function moveUser(e){
 let userDiv = document.querySelector(".userBlock");

  switch (e.key){
    case "ArrowLeft":
      if(currentPosition[0]==0){
        currentPosition[0]=0;
      } else {
        currentPosition[0]-=20;
        userDiv.style.left=currentPosition[0]+"px";
      }
      
      break;
    case "ArrowRight":
      if (currentPosition[0]==480){
        currentPosition[0]=480;
        
      }else {
        currentPosition[0]+=20;
        userDiv.style.left=currentPosition[0]+"px";
      }

  }

//remove previous drawn block
document.querySelector(".userBlock").remove();  
//make a user block
user = new userBlock(currentPosition[0],currentPosition[1]);

//draw the user block
drawBlock(user,"userBlock");

}

//add the handler to the event keydown
document.addEventListener("keydown",moveUser);


//bal toevoegen
const ball = document.createElement("div");
ball.classList.add("ball");
ball.style.left = currentPositionBall[0]+"px";
ball.style.bottom = currentPositionBall[1]+"px";
grid.appendChild(ball);

//bal laten bewegen

function moveBall(){
  
  currentPositionBall[0]+=xDirection;
  currentPositionBall[1]+=yDirection;
  ball.style.left=currentPositionBall[0]+"px";
  ball.style.bottom=currentPositionBall[1]+"px";
  
  
  ballCollide();
  ballCollideWithBlok();
  ballCollideWithUser();
  
}

ballInterval=setInterval(moveBall,20);

//check for ball collisions

function ballCollide(){
  if (currentPositionBall[0]<=0){
    xDirection=2;
  }

  if(currentPositionBall[1]+ballDiameter>=screenDimension.ymax){
    yDirection=-2;
  }

  if(currentPositionBall[1]<=0){
    yDirection=2;
    clearInterval(ballInterval);
    document.querySelector(".gameOver").classList.remove("hidden");
  }

  if(currentPositionBall[0]+ballDiameter>=screenDimension.xmax){
    xDirection=-2;
  }

}

let blockDivs = document.querySelectorAll(".block");
let blockDivArr = Array.from(blockDivs);

function ballCollideWithBlok(){

  blocks.forEach((block, index)=>{

    if (  (currentPositionBall[0]>block.bottomLeft[0] && currentPositionBall[0]<block.bottomRight[0]) &&
          ((currentPositionBall[1]+ballDiameter)>block.bottomLeft[1] && currentPositionBall[1]<block.topLeft[1])
    ){
        blocks.splice(index,1);
        blockDivArr[index].remove();
        blockDivArr.splice(index,1);
        yDirection=yDirection*(-1);
        score+=1;
        document.querySelector(".score").innerHTML=score;
          if (blockDivArr.length ==0){
            clearInterval(ballInterval);
            document.removeEventListener("keydown",moveUser);
            document.querySelector(".gameOver").innerHTML="You Win!";
            document.querySelector(".gameOver").classList.remove("hidden");

          }

    }
  })
}

//check if ball collides with player
function ballCollideWithUser(){
  if (  (currentPositionBall[0]>user.bottomLeft[0] && currentPositionBall[0]<user.bottomRight[0]) &&
  ((currentPositionBall[1]+ballDiameter)>user.bottomLeft[1] && currentPositionBall[1]<user.topLeft[1])
){
  yDirection=yDirection*(-1);
}
}

