var PLAY = 1;
var END = 0;
var backGnd, bgImg,bg0Img;
var mario, marioRunning, marioCollided;
var invisibleGround;
var obstacleGroup, brickGroup;
var gameState = 1;
var score = 0;
var brick, gameOver, gameOverImage, restart, restartImage;
var dieSound, checkPointSound, jumpSound;
var highScore = 0;

function preload() {
  bgImg = loadImage("bg1.png");
  bg0Img=loadImage("bg0.png")
  marioRunning = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  marioDie = loadAnimation("collided.png")
  brickImage = loadImage("brick.png");
  obstacle1 = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(500, 400);

  backGnd0 = createSprite(250, 90);
  backGnd0.addImage("background0", bg0Img);
  backGnd = createSprite(250, 295);
  backGnd.addImage("background", bgImg);
  backGnd.scale = 1.1;
  backGnd.x = backGnd.width / 2;

  mario = createSprite(100, 300);
  mario.addAnimation("Running", marioRunning);
  mario.addAnimation("Collided", marioDie);
  mario.scale = 2;

  mario.debug = false;
  mario.setCollider("rectangle", 0, 0, 20, 30);

  invisibleGround = createSprite(250, 355, 400, 20);
  invisibleGround.visible = false;

  obstacleGroup = new Group();
  brickGroup = createGroup();

  gameOver = createSprite(250, 150);
  gameOver.addAnimation("game over", gameOverImage);
  restart = createSprite(250, 200);
  restart.addAnimation("restart", restartImage);
  restart.scale = 0.8;

  localStorage[highScore] = 0;
}

function draw() {
  background(190);
  console.log(localStorage[highScore]);
  if (gameState === 1) {

    gameOver.visible = false;
    restart.visible = false;
    
    backGnd.velocityX = -(6 + score / 10);
    if (backGnd.x < 170) {
      backGnd.x = bgImg.width / 2;
    }

    if (keyDown("space") && mario.y > 250) {
      mario.velocityY = -10;
      jumpSound.play();
    }
    mario.velocityY += 0.8;

    if (mario.isTouching(obstacleGroup)) {
      gameState = END;
      dieSound.play();
    }
    for (i = 0; i < brickGroup.length; i++) {
      if (mario.isTouching(brickGroup.get(i))) {
        score += 1;

        if (localStorage[highScore] < score) {
          localStorage[highScore] = score;
        }
        brickGroup.get(i).destroy();
        if (score > 0 && score % 5 === 0) {
          checkpointSound.play();
        }
      }

    }
    spawnObstacles();
    spawnBrick();
  }
  else if (gameState === 0) {
    
    brickGroup.setVelocityEach(0,0);
    backGnd.velocityX = 0;
    obstacleGroup.setVelocityEach(0, 0);
    mario.changeAnimation("Collided", marioDie);
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  mario.collide(invisibleGround);
  drawSprites();
  textSize(20);
  fill(0);
  text("Score : " + score, 300, 100);
}

function spawnObstacles() {
  if (frameCount % 150 === 0) {
    var obstacle = createSprite(500, 360);
    var rand = Math.round(random(1, 4));
    obstacle.velocityX = -3+score/10;
    obstacle.addAnimation("obstacle", obstacle1)
    obstacleGroup.add(obstacle);
  }
}

function spawnBrick() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(500, 360);
    brick.y = Math.round(random(180, 230));
    brick.addImage(brickImage);
    brick.velocityX = -3;
    brickGroup.add(brick);
  }
}
function reset(){
  gameState=1;
  score=0;
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  mario.changeAnimation("Running",marioRunning);
}