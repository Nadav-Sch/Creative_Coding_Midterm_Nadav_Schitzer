// Nadav Schitzer - CC Midterm
// Took me WAY too long
// I hope it frustrates :)

let scene = 0;
let bvbX, bvbY;
let speedX, speedY;
let margin = 10;
let bvbSize = 150;
let bvbBoxColor;
let bvbTextColor;
let cornerHits = -1;
let transitionTime1 = 0;
let transitionTime2 = 0;
let transitionTime3 = 0;
let transitionTime4 = 0;
let transitionDuration = 2000;
let playerX, playerY;
let playerSize = 15;
let playerSpeed = 2;
let goalX, goalY;
let gameCreated = false;
let game2Created = false;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let canvas;
let walls = [];
let movingWalls = [];
let topWalls = [];
let wallSpawn = 0;
let wallSpawnInterval = 750;
let topWallSpawn = 0;
let topWallInterval = 750;
let allowTopWalls = false;
let playerSpeedGrowth = 0.0008;
let playerSpeedGrowth2 = 0.0025;
let immunityX;
let immunityY;
let immunitySize = 60;
let survivalStartTime = 0;
let survivalDuration = 30000;
let immunityBridgeX = 400;
let immunityBridgeY = 460;
let immunityBridgeWidth = 20;
let immunityBridgeHeight = 320;
let confettiPieces = [];
let confettiStartTime = 0;
let lastBurstTime = 0;

function mousePressed() {
    // check if click is inside the restart button on last screen
    let d = dist(mouseX, mouseY, width / 2, 70);
    if (d < 20) { 
      scene = 0;
    }
  }

function setup() {
  colorMode(RGB, 255, 255, 255, 100);
  canvas = createCanvas(800, 800);
  centerCanvas();
  resetBVB();
  document.body.style.backgroundColor = "black";
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function keyPressed() {
  if (key === ' ') { // press SPACE to skip scene (would be removed in final cut but is relevant for demonstration purposes)
    scene++;
    if (scene > 6) {
      scene = 0; // restart to first scene after last
    }
    transitionTime1 = millis();
    transitionTime2 = millis();
    transitionTime3 = millis();
    transitionTime4 = millis();
  }
  if (key >= '1' && key <= '8') { // keys 1-8 = screens 0-7 accordingly
    scene = int(key) - 1;
    if (scene === 0) {
      resetBVB();
    }
    transitionTime1 = millis();
    transitionTime2 = millis();
    transitionTime3 = millis();
    transitionTime4 = millis();
  }
// classic WASD controls to control player
  if (key === 'w' || key === 'W') moveUp = true;
  if (key === 's' || key === 'S') moveDown = true;
  if (key === 'a' || key === 'A') moveLeft = true;
  if (key === 'd' || key === 'D') moveRight = true;
}
// when key is released stop player moving
function keyReleased() {
  if (key === 'w' || key === 'W') moveUp = false;
  if (key === 's' || key === 'S') moveDown = false;
  if (key === 'a' || key === 'A') moveLeft = false;
  if (key === 'd' || key === 'D') moveRight = false;
}

function draw() {
  // color of whole background to match color of screen background
  if (scene === 0) {
    document.body.style.backgroundColor = "black";
  } 
  else if (scene === 1) {
    document.body.style.backgroundColor = "rgb(50, 50, 150)";
  }
  else if (scene === 2) {
    document.body.style.backgroundColor = "rgb(180, 20, 20)";
  }
  else if (scene === 3) {
    document.body.style.backgroundColor = "black";
  }
  else if (scene === 4) {
    document.body.style.backgroundColor = "rgb(150, 120, 255)";
  }
  else if (scene === 5) {
    document.body.style.backgroundColor = "rgb(255, 0, 0)";
  }
  else if (scene === 6) {
    document.body.style.backgroundColor = "black";
  }
  else if (scene === 7) {
    document.body.style.backgroundColor = "rgb(150, 120, 255)";
  }
  // bkack bg
  background(0);
  // white border to be able to tell border of games and bvb
  stroke(255)
  strokeWeight(2);
  noFill();
  rect(0, 0, width, height);
  
  // scene changer if statemtn
  if (scene === 0) {
    fill(255);
    stroke(0);
    strokeWeight(3);
    textSize(20);
    textAlign(CENTER, TOP);
    text((cornerHits)+" / 3", width / 2, 20);

    bvbX += speedX;
    bvbY += speedY;
    if (hitCorner(bvbX, bvbY, bvbSize)) {
      resetBVB();
    }
    if (bvbX <= 0 || bvbX + bvbSize >= width) {
      speedX *= -1;
    }
    if (bvbY <= 0 || bvbY + bvbSize >= height) {
      speedY *= -1;
    }
    bvb(bvbX, bvbY);
    
    // BVB screen reset zones outlines (I will make them invisible in end produt)
    // stroke(255, 0, 0);
    // noFill();
    // triangle(0, 0, 15, 0, 0, 15);
    // triangle(width, 0, width - 15, 0, width, 15);
    // triangle(0, height, 0, height - 15, 15, height);
    // triangle(width, height, width, height - 15, width - 15, height);
  } 
 else if (scene === 1) {
    transitionScreen1();
    if (millis() - transitionTime1 > 2000) {
      scene = 2;
      transitionTime2 = millis();
    }
  }
  else if (scene === 2) {
    transitionScreen2();
    if (millis() - transitionTime2 > 1500) {
      scene = 3;
      createGame();
    }
  }
  else if (scene === 3) {
    if (!gameCreated) {
    createGame();
  }
  gameScene();
  }
  else if (scene === 4) {
    transitionScreen3();
    if (millis() - transitionTime3 > 2500) {
      scene = 5;
      gameCreated = false;
      transitionTime4 = millis();
    }
  }
  else if (scene === 5) {
    transitionScreen4();
    if (millis() - transitionTime4 > 1500) {
      scene = 6;
    }
  }
  else if (scene === 6) {
    if (!game2Created) {
    createGame2();
    }
    gameScene2();
  }
  else if (scene === 7) {
    endScreen();
    game2Created = false;
  }
}

// function to draw the BVB logo
function bvb(x, y) {
  push();
  translate(x, y);
  scale(1, 1)
  // base bvb Square
  fill(bvbBoxColor);
  noStroke();
  rect(0, 0, bvbSize, bvbSize, 9);
  // bvb text (not instructional text just symbolizing a DVD copy)
  fill(bvbTextColor); 
  strokeWeight(3);
  stroke(0);
  textSize(bvbSize * 0.45);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("BVB", bvbSize / 2, bvbSize / 2); // text position
  // 2 lines above and under bvb
  noFill();
  stroke(bvbTextColor);
  strokeWeight(8);
  line(3, 30, bvbSize - 3, 15);
  line(3, bvbSize - 15, bvbSize - 3, bvbSize - 30);
  stroke(0);
  strokeWeight(1.2);
  line(0, 26.5, bvbSize, 11.5);
  line(0, 34.5, bvbSize, 19.5);
  line(0, bvbSize - 11.5, bvbSize, bvbSize - 26.5);
  line(0, bvbSize - 19.5, bvbSize, bvbSize - 34.5);
  //square outline fix
  noFill();
  stroke(0);
  strokeWeight(3);
  rect(0, 0, bvbSize, bvbSize, 7);
  pop();
}
// BVB logo resets with random colors and speed
function resetBVB() {
  bvbX = width / 2;
  bvbY = height / 2;
  speedX = random(1, 3) * (random() > 0.5 ? 1 : -1);
  speedY = random(1, 3) * (random() > 0.5 ? 1 : -1);
  bvbBoxColor = color(random(100, 255), random(100, 255), random(100, 255));
  bvbTextColor = color(random(100, 255), random(100, 255), random(100, 255));
// 3 corner hits to go to next stage
  cornerHits++;
  if (cornerHits >= 3) {
    scene = 1;
    transitionTime1 = millis();
  }
}
// corners that reset the bvb right before the hit (not very satisfying)
function hitCorner(x, y, size) {
  return (
    insideTriangle(x, y, 0, 0, 15, 0, 0, 15) ||
    insideTriangle(x + size, y, width, 0, width - 15, 0, width, 15) || 
    insideTriangle(x, y + size, 0, height, 0, height - 15, 15, height) || 
    insideTriangle(x + size, y + size, width, height, width, height - 15, width - 15, height)
  );
}
// function that actually resets the BVB
function insideTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  let area = 0.5 * (-y2 * x3 + y1 * (-x2 + x3) + x1 * (y2 - y3) + x2 * y3);
  let s = (y1 * x3 - x1 * y3 + (y3 - y1) * px + (x1 - x3) * py) / (2 * area);
  let t = (x1 * y2 - y1 * x2 + (y1 - y2) * px + (x2 - x1) * py) / (2 * area);
  return s > 0 && t > 0 && (1 - s - t) > 0;
}

function transitionScreen1() {
  background(50, 50, 150);
  push();
  translate(width/2, height/2 + 10);
  // face
  fill(255);
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, 200, 200);
  // eyes
  stroke(0);
  strokeWeight(5);
  noFill();
  // left
  beginShape();
  vertex(-55, 0);
  quadraticVertex(-40, -5, -25, 0);
  endShape();
  // right
  beginShape();
  vertex(25, 0);
  quadraticVertex(40, -5, 55, 0);
  endShape();
}

function transitionScreen2() {
  background(180, 20, 20);
  push();
  translate(width/2, height/2 + 20);
  // aggressive angry vibration
  let shakeX = random(-3, 3);
  let shakeY = random(-3, 3);
  translate(shakeX, shakeY);
  // face
  fill(0);
  noStroke();
  ellipse(0, 0, 200, 200);
  // eyes
  fill(255, 0, 0);
  noStroke();
  // left
  beginShape();
  vertex(-60, -20);
  vertex(-20, -10);
  bezierVertex(-30, 5, -50, 5, -60, -20);
  endShape(CLOSE);
  // right
  beginShape();
  vertex(20, -10);
  vertex(60, -20);
  bezierVertex(50, 5, 30, 5, 20, -10);
  endShape(CLOSE);
  pop();
}

function createGame() {
  if (gameCreated) return;
  // player start position
  playerX = 22;
  playerY = 22;
  // goal psition and color
  goalX = 400;
  goalY = 400;
  fill(0, 255, 0);
  // walls (what to avoid)
  walls = [
    { x: 0, y: 0, w: 800, h: 20 },
    { x: 0, y: 0, w: 20, h: 800 },
    { x: 780, y: 0, w: 20, h: 800 },
    { x: 0, y: 780, w: 800, h: 20 },

    { x: 20, y: 40, w: 720, h: 20 },
    { x: 40, y: 80, w: 20, h: 680 },
    { x: 740, y: 40, w: 20, h: 720 },
    { x: 40, y: 740, w: 720, h: 20 },

    { x: 60, y: 80, w: 640, h: 20 },
    { x: 80, y: 120, w: 20, h: 600 },
    { x: 700, y: 80, w: 20, h: 640 },
    { x: 80, y: 700, w: 640, h: 20 },

    { x: 100, y: 120, w: 560, h: 20 },
    { x: 120, y: 160, w: 20, h: 520 },
    { x: 660, y: 120, w: 20, h: 560 },
    { x: 120, y: 660, w: 560, h: 20 },

    { x: 140, y: 160, w: 480, h: 20 },
    { x: 160, y: 200, w: 20, h: 440 },
    { x: 620, y: 160, w: 20, h: 480 },
    { x: 160, y: 620, w: 480, h: 20 },

    { x: 180, y: 200, w: 400, h: 20 },
    { x: 200, y: 240, w: 20, h: 360 },
    { x: 580, y: 200, w: 20, h: 400 },
    { x: 200, y: 580, w: 400, h: 20 },

    { x: 220, y: 240, w: 320, h: 20 },
    { x: 240, y: 280, w: 20, h: 280 },
    { x: 540, y: 240, w: 20, h: 320 },
    { x: 240, y: 540, w: 320, h: 20 },

    { x: 260, y: 280, w: 240, h: 20 },
    { x: 280, y: 320, w: 20, h: 200 },
    { x: 500, y: 280, w: 20, h: 240 },
    { x: 280, y: 500, w: 240, h: 20 },

    { x: 300, y: 320, w: 160, h: 20 },
    { x: 320, y: 360, w: 20, h: 120 },
    { x: 460, y: 320, w: 20, h: 160 },
    { x: 320, y: 460, w: 160, h: 20 },

    { x: 340, y: 360, w: 80, h: 20 },
    { x: 360, y: 400, w: 20, h: 40 },
    { x: 420, y: 360, w: 20, h: 80 },
    { x: 360, y: 420, w: 80, h: 20 },
    
    { x: 380, y: 400, w: 20, h: 20 }
    ];
    // player visible
    fill(255);
    rect(playerX, playerY, playerSize, playerSize);
    gameCreated = true;
  }

function gameScene() {
  background(0);
  // player movement and speed randomized at every frame (aggravating)
  if (moveUp) {
    playerSpeed = random(1, 9);
    playerY -= playerSpeed;
  }
  if (moveDown) {
    playerSpeed = random(1, 9);
    playerY += playerSpeed;
  }
  if (moveLeft) {
    playerSpeed = random(1, 9);
    playerX -= playerSpeed;
  }
  if (moveRight) {
    playerSpeed = random(1, 9);
    playerX += playerSpeed;
  }
  // draw goal (exit point)
  fill(0, 255, 0);
  noStroke();
  rect(goalX, goalY, 20, 20);
  // draw player
  fill(255);
  rect(playerX, playerY, playerSize, playerSize);
  // draw walls
  fill(255, 0, 0);
  for (let wall of walls) {
    rect(wall.x, wall.y, wall.w, wall.h);
  }
  // check for collision with walls
  for (let wall of walls) {
    if (
      playerX < wall.x + wall.w &&
      playerX + playerSize > wall.x &&
      playerY < wall.y + wall.h &&
      playerY + playerSize > wall.y
    ) {
      if (!inImmunityBridge()) {
        resetGameScene();
      }
    }
  }
  // check if player hits the border then reset if they do
  if (
    playerX - playerSize / 2 < 0 || 
    playerX + playerSize / 2 > width || 
    playerY - playerSize / 2 < 0 || 
    playerY + playerSize / 2 > height
  ) {
    resetGameScene();
  }
  // check if player reaches the goal
  if (
  playerX < goalX + 20 &&
  playerX + playerSize > goalX &&
  playerY < goalY + 20 &&
  playerY + playerSize > goalY
) {
    scene = 4;
    transitionTime3 = millis();
  }
   // secret path bridge
   fill(0, 0, 0, 0);
   noStroke();
   rect(immunityBridgeX, immunityBridgeY, immunityBridgeWidth, immunityBridgeHeight);
   // question box (?)
   fill(20, 120, 255);
   stroke(150);
   strokeWeight(0.4);
   textSize(21);
   textAlign(CENTER, CENTER);
   text('?', 410, 770);
}

function inImmunityBridge() {
  return (
    playerX + playerSize > immunityBridgeX &&
    playerX < immunityBridgeX + immunityBridgeWidth &&
    playerY + playerSize > immunityBridgeY &&
    playerY < immunityBridgeY + immunityBridgeHeight
  );
}

function resetGameScene() {
  playerX = 22;
  playerY = 22;
  gameCreated = false;
  scene = 0;
  cornerHits = -1;
  resetBVB();
}

function transitionScreen3() {
  background(150, 120, 255);
  // party cone
  push();
  translate(width/2, height);
  fill(255, 200, 0);
  stroke(200, 150, 0);
  strokeWeight(2);
  beginShape();
  vertex(0, 0);
  vertex(-40, -80);
  vertex(40, -80);
  endShape(CLOSE);
  stroke(255, 100, 100);
  strokeWeight(2);
  line(0, 0, -30, -80);
  line(0, 0, -15, -80);
  line(0, 0, 0, -80);
  line(0, 0, 15, -80);
  line(0, 0, 30, -80);
  fill(0, 0, 0, 100);
  noStroke();
  arc(0, -82, 80, 20, 0, PI, OPEN);
  pop();
  // confetti burst
  if (confettiPieces.length === 0) {
    for (let i = 0; i < 300; i++) {
      confettiPieces.push({
        x: width/2,
        y: height - 70,
        angle: random(-PI/4, -3*PI/4),
        speed: random(4, 9),
        size: random(6, 9),
        color: random([
          color(255, 0, 0),
          color(0, 255, 0),
          color(0, 0, 255)
        ])
      });
    }
    confettiStartTime = millis();
  }
  for (let confetti of confettiPieces) {
    confetti.x += cos(confetti.angle) * confetti.speed;
    confetti.y += sin(confetti.angle) * confetti.speed;
    fill(confetti.color);
    noStroke();
    ellipse(confetti.x, confetti.y, confetti.size);
  }
  // reset after 1 second
  if (millis() - confettiStartTime > 4000) {
    confettiPieces = [];
  }
}

function transitionScreen4() {
  background(255, 0, 0);
  push();
translate(width/2, height/2 + 20);

// even more aggressive abd angry vibration
let shakeX = random(-10, 10);
let shakeY = random(-10, 10);
translate(shakeX, shakeY);
// face
fill(0);
noStroke();
ellipse(0, 0, 600, 600);
//eyes
fill(255, 0, 0);
noStroke();
// left
beginShape();
vertex(-180, -70);
vertex(-70, -30);
bezierVertex(-90, 30, -160, 30, -180, -70);
endShape(CLOSE);
// right
beginShape();
vertex(70, -30);
vertex(180, -70);
bezierVertex(160, 30, 90, 30, 70, -30);
endShape(CLOSE);
pop();

}


// second game
function createGame2() {
  if (game2Created) return;
  playerX = width / 2 - playerSize / 2;
  playerY = height / 2 - playerSize / 2;
  playerSpeed = 2;
  // safe immunity square position
  immunityX = 0;
  immunityY = height - 60;
  // pace if walls spawn
  wallSpawn = millis();
  wallSpawnInterval = 750;
  // set time needed to win at 0/30 seconds
  survivalStartTime = millis();

  game2Created = true;
}
// second game's scene
function gameScene2() {
  background(0);
  // gradually spawns moving walls from sides of screen
  if (millis() - wallSpawn > wallSpawnInterval) {
    spawnSideWall();
    wallSpawn = millis();
    wallSpawnInterval = max(65, wallSpawnInterval - 30);
  }
  // start spawning top walls after around 20 seconds 
  if (!allowTopWalls && millis() - survivalStartTime >= 20000) {
    allowTopWalls = true;
  }
  // graduall spawns top walls
  if (allowTopWalls && millis() - topWallSpawn > topWallInterval) {
    spawnTopWall();
    topWallSpawn = millis();
    topWallInterval = max(50, topWallInterval - 65);
  }
  // player speed, increases over time
  if (moveUp) playerY -= playerSpeed;
  if (moveDown) playerY += playerSpeed;
  if (moveLeft) playerX -= playerSpeed;
  if (moveRight) playerX += playerSpeed;
  playerSpeed += playerSpeedGrowth2;
  playerSpeed = min(playerSpeed, 4);
  // make the moving walls visible
  fill(255, 0, 0);
  noStroke();
  for (let wall of movingWalls) {
    wall.x += wall.speedX;
    wall.y += wall.speedY;
    rect(wall.x, wall.y, wall.w, wall.h);
    if (
      playerX < wall.x + wall.w &&
      playerX + playerSize > wall.x &&
      playerY < wall.y + wall.h &&
      playerY + playerSize > wall.y
    ) {
      if (!inImmunityZone()) {
        resetGameScene2();
      }
    }
  }
  // reset if player touches screen border
  if (
    playerX < 0 || 
    playerX + playerSize > width ||
    playerY < 0 ||
    playerY + playerSize > height
  ) {
    resetGameScene2();
  }
  // remove walls that left screen alreadh
  movingWalls = movingWalls.filter(wall => wall.x + wall.w > 0 && wall.x < width);
  // tje actual functional safe zone
  fill(0, 0);
  noStroke();
  rect(immunityX, immunityY, immunitySize, immunitySize);
  // survival timer
  let timeLeft = max(0, survivalDuration - (millis() - survivalStartTime));
  fill(0, 255, 0);
  textSize(35);
  textAlign(CENTER, TOP);
  text(nf(floor(timeLeft / 1000), 2), width / 2, 20);
  // go to win screen if game was beat
  if (millis() - survivalStartTime >= survivalDuration) {
    scene = 7;
    resetGameScene2();
  }
  // immunity zone, barely almost not visible, makes red walls that pass through it disappear under it as a subtle hint on how to beat the game
  fill(15, 15, 15, 255);
  noStroke();
  rect(0, height - 50, 50, 50);
  // make player visible
  fill(255);
  rect(playerX, playerY, playerSize, playerSize);

  noFill();
  stroke(255);
  strokeWeight(2);
  rect(0, 0, width, height);
}
// spawn walls from both sides
function spawnSideWall() {
  let side = random(["left", "right"]);
  let wallW = random(25, 35);
  let wallH = random(10, 15);
  let startY = random(0, height);
  let speed = random(3, 4);
  if (side === "left") {
    movingWalls.push({ x: -wallW, y: startY, w: wallW, h: wallH, speedX: speed, speedY: 0 });
  } else {
    movingWalls.push({ x: width, y: startY, w: wallW, h: wallH, speedX: -speed, speedY: 0 });
  }
}
// spawn walls from top
function spawnTopWall() {
  let wallW = random(10, 15);
  let wallH = random(25, 35);
  let startX = random(0, width);
  let speed = random(3, 4);
  movingWalls.push({ x: startX, y: -wallH, w: wallW, h: wallH, speedX: 0, speedY: speed });
}
// if player is in immunity zone theyre immune
function inImmunityZone() {
  return (
    playerX + playerSize > immunityX &&
    playerX < immunityX + immunitySize &&
    playerY + playerSize > immunityY &&
    playerY < immunityY + immunitySize
  );
}
// reset second game when player dies
function resetGameScene2() {
  // reset walls
  movingWalls = [];
  topWalls = [];
  wallSpawn = millis();
  topWallSpawn = millis();
  wallSpawnInterval = 750;
  topWallInterval = 750;
  // reset player
  playerX = width / 2 - playerSize / 2;
  playerY = height / 2 - playerSize / 2;
  playerSpeed = 2;
  // reset immunity corner
  immunityX = 0;
  immunityY = height - 20;
  // reset suvival counter
  survivalStartTime = millis();
  game2Created = false;
  allowTopWalls = false;
  // reset to BVB screen on death
  scene = 0;
  cornerHits = -1;
  resetBVB();
}
// end screen for when game is beat
function endScreen() {
  background(150, 120, 255);
  // little evil faces
  drawEvilFace(150, 200, 60);
  drawEvilFace(350, 150, 50);
  drawEvilFace(600, 500, 70);
  drawEvilFace(270, 660, 50);
  drawEvilFace(700, 300, 55);
  drawEvilFace(120, 500, 60);
  drawEvilFace(400, 350, 150);
  drawEvilFace(690, 680, 50);
  drawEvilFace(560, 65, 60);
  drawEvilFace(140, 10, 45);
  drawEvilFace(70, 690, 40);

  // party cone
  push();
  translate(width/2, height);
  fill(255, 200, 0);
  stroke(200, 150, 0);
  strokeWeight(2);
  beginShape();
  vertex(0, 0);
  vertex(-40, -80);
  vertex(40, -80);
  endShape(CLOSE);
  stroke(255, 100, 100);
  strokeWeight(2);
  line(0, 0, -30, -80);
  line(0, 0, -15, -80);
  line(0, 0, 0, -80);
  line(0, 0, 15, -80);
  line(0, 0, 30, -80);
  fill(0);
  noStroke();
  arc(0, -82, 80, 20, 0, PI, OPEN);
  pop();
  // confetti burst every 1 second
  if (millis() - lastBurstTime > 1000) {
    for (let i = 0; i < 300; i++) { 
      confettiPieces.push({
        x: width/2,
        y: height - 70,
        angle: random(-PI/4, -3*PI/4),
        speed: random(3, 9),
        size: random(6, 9),
        color: random([
          color(255, 0, 0),
          color(0, 255, 0),
          color(0, 0, 255)
        ])
      });
    }
    lastBurstTime = millis();
  }
  // move and draw confetti
  for (let confetti of confettiPieces) {
    confetti.x += cos(confetti.angle) * confetti.speed;
    confetti.y += sin(confetti.angle) * confetti.speed;
    fill(confetti.color);
    noStroke();
    ellipse(confetti.x, confetti.y, confetti.size);
  }
  // confetti limit so it doesnt lag computer after a few seconds
  if (confettiPieces.length > 1000) {
    confettiPieces.splice(0, confettiPieces.length - 1000);
  }

  // restart button to go back to scene 0 (screen 1)
  drawRestartButton();
}

function drawRestartButton() {
  push();
  translate(width / 2, 70);
  // restart button
  fill(255, 33, 44);
  stroke(255);
  strokeWeight(2);
  ellipse(0, 0, 40, 40);
  // arrow inside restart button
  noFill();
  stroke(255);
  strokeWeight(3);
  let arcRadius = 24;
  let startAngle = radians(45);
  let endAngle = radians(300);
  arc(0, 0, arcRadius, arcRadius, startAngle, endAngle);
  let tipAngle = startAngle;
  let tipX = cos(tipAngle) * arcRadius / 2;
  let tipY = sin(tipAngle) * arcRadius / 2;
  // arrow tip
  push();
  translate(tipX, tipY);
  rotate(radians(-27));
  line(0, 0, -5, -5);
  line(0, 0, -5, 5);
  pop();
  pop();
}
function drawEvilFace(x, y, size) {
  push();
  let shakeX = random(-3, 3);
  let shakeY = random(-3, 3);
  translate(x + shakeX, y + shakeY);
  scale(size / 200);
  // face
  fill(0);
  noStroke();
  ellipse(0, 0, 200, 200);
  // eyes
  fill(255, 0, 0);
  noStroke();
  // left eye
  beginShape();
  vertex(-60, -20);
  vertex(-20, -10);
  bezierVertex(-30, 5, -50, 5, -60, -20);
  endShape(CLOSE);
  // right eye
  beginShape();
  vertex(20, -10);
  vertex(60, -20);
  bezierVertex(50, 5, 30, 5, 20, -10);
  endShape(CLOSE);
  pop();
}