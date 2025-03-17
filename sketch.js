let bvbX, bvbY;
let speedX, speedY;
let margin = 10;
let bvbSize = 150;
let bvbBoxColor;
let bvbTextColor;
let cornerHits = -1;
let scene = 0;
let transitionTime1 = 0;
let transitionTime2 = 0;
let transitionTime3 = 0;
let transitionTime4 = 0;
let transitionDuration = 2000;
let playerX, playerY;
let playerSize = 15;
let playerSpeed = 2;
let walls = [];
let goalX, goalY;
let gameCreated = false;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;

function mousePressed() {
  console.log("x: " + mouseX + ", y: " + mouseY);
}

function setup() {
  createCanvas(800, 800);
  colorMode(RGB, 255, 255, 255, 100);
  resetBVB();
}
function keyPressed() {
  if (key === ' ') { // Press L to skip
    scene++; // Move to the next scene
    if (scene > 6) {
      scene = 0; // Restart loop if needed
    }
    transitionTime1 = millis(); // Reset transition timing
    transitionTime2 = millis(); // Reset transition timing 
    transitionTime3 = millis(); // Reset transition timing
    transitionTime4 = millis(); // Reset transition timing

  }
  if (key === 'w' || key === 'W') moveUp = true;
  if (key === 's' || key === 'S') moveDown = true;
  if (key === 'a' || key === 'A') moveLeft = true;
  if (key === 'd' || key === 'D') moveRight = true;
}

function keyReleased() {
  if (key === 'w' || key === 'W') moveUp = false;
  if (key === 's' || key === 'S') moveDown = false;
  if (key === 'a' || key === 'A') moveLeft = false;
  if (key === 'd' || key === 'D') moveRight = false;
}

function draw() {
  background(0);


  if (scene === 0) {
    // corner hit counter (false hope)
    fill(255);
    textSize(20);
    textAlign(CENTER, TOP);
    text("Attempt: " + (cornerHits + 1), width / 2, 20);

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
    
    // reset zones outlines (I will make them invisible in end produt)
    stroke(255, 0, 0);
    noFill();
    triangle(0, 0, 30, 0, 0, 30);
    triangle(width, 0, width - 30, 0, width, 30);
    triangle(0, height, 0, height - 30, 30, height);
    triangle(width, height, width, height - 30, width - 30, height);
  } 
 else if (scene === 1) {
    transitionScreen1();
    if (millis() - transitionTime1 > 3000) {
      scene = 2;
      transitionTime2 = millis();
    }
  }
  else if (scene === 2) {
    transitionScreen2();
    if (millis() - transitionTime2 > 2000) {
      scene = 3;
      createGame(); // renders the game when entering scene 3
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
    if (millis() - transitionTime3 > 2000) {
      scene = 5;
      gameCreated = false;
      transitionTime4 = millis();

    }
  }
  else if (scene === 5) {
    transitionScreen4();
    if (millis() - transitionTime4 > 2000) {
      scene = 6;
    }
  }
}



// Function to draw the BVB logo
function bvb(x, y) {
  push();
  translate(x, y);
  scale(1, 1)
  // Base Square
  fill(bvbBoxColor);
  noStroke();
  rect(0, 0, bvbSize, bvbSize, 9);
  // bvb Text
  fill(bvbTextColor); 
  strokeWeight(3);
  stroke(0);
  textSize(bvbSize * 0.45);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("BVB", bvbSize / 2, bvbSize / 2); // Centered text
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

// Function to reset the DVD position to the middle
function resetBVB() {
  bvbX = width / 2;
  bvbY = height / 2;
  speedX = random(1, 3) * (random() > 0.5 ? 1 : -1);
  speedY = random(1, 3) * (random() > 0.5 ? 1 : -1);
  bvbBoxColor = color(random(255), random(255), random(255));
  bvbTextColor = color(random(255), random(255), random(255));

  cornerHits++;
  if (cornerHits >= 1) {
    scene = 1; // Change to scene 1 (message)
    transitionTime1 = millis();
  }
}

// Function to check if the DVD is about to hit corner barrier
function hitCorner(x, y, size) {
  return (
    insideTriangle(x, y, 0, 0, 30, 0, 0, 30) ||
    insideTriangle(x + size, y, width, 0, width - 30, 0, width, 30) || 
    insideTriangle(x, y + size, 0, height, 0, height - 30, 30, height) || 
    insideTriangle(x + size, y + size, width, height, width, height - 30, width - 30, height)
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
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Now THAT was satisfying, wasn't it?", width / 2, height / 2);
}

function transitionScreen2() {
  background(240, 0, 0);
  fill(0);
  textSize(100);
  textAlign(CENTER, CENTER);
  //let shakeX = sin(frameCount * 0.5) * 5;
  //let shakeY = cos(frameCount * 0.6) * 5;
  let shakeX = random(-3, 3);
  let shakeY = random(-3, 3);

  text("let's play a game.", width / 2 + shakeX, height / 2 + shakeY);
}

function gameScene() {
  background(0);
  // player movement
  if (moveUp) playerY -= playerSpeed;
  if (moveDown) playerY += playerSpeed;
  if (moveLeft) playerX -= playerSpeed;
  if (moveRight) playerX += playerSpeed;
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
      resetGameScene();
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
}

function createGame() {
  if (gameCreated) return;
  // start pos
  playerX = 22;
  playerY = 22;
  goalX = 400;
  goalY = 400;
  
  fill(0, 255, 0);
  
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
  gameCreated = true;
}

function resetGameScene() {
  console.log("womp womp");
  playerX = 30;
  playerY = 30;
  gameCreated = false;
}

function transitionScreen3() {
  background(150, 120, 255);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Wasn't that fun?", width / 2, height / 2);
}

function transitionScreen4() {
  background(255, 0, 0);
  fill(0);
  textSize(100);
  textAlign(CENTER, CENTER);
  let shakeX = random(-4, 4);
  let shakeY = random(-4, 4);
  text("another.", width / 2 + shakeX, height / 2 + shakeY);
}

// function createGame2() {

