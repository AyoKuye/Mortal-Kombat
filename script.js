// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
      x60 y135
 *    HSB, background, color, colorMode, createCanvas, collideRectCircle, ellipse, fill, height, keyCode, random, rect, loadImage, frogImage, clear, ENTER
 *    strokeWeight, text, textSize, width, collideCircleCircle, scale,translate, textFont, createButton, collideRectRect
 *    UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, image, keyDown, frameRate, frameCount, keyIsDown, keyPressed, loadSound
 */

let backgroundColor,
  stage,
  fight,
  music,
  button,
  mode,
  gameIsOver,
  punchSound,
  kickSound,
  uppercutSound,
  subzeroWins,
  round1,
  scorpionWins;
let scorpionIdle = [],
  scorpionWalk = [],
  scorpionWalkBack = [],
  scorpionJump = [],
  scorpionDuck = [],
  scorpionBlock = [],
  scorpionHit,
  scorpionPunch,
  scorpionUC,
  scorpionLP,
  scorpionW,
  scorpionL = [],
  scorpionJK,
  scorpionLK;
let subzeroIdle = [],
  subzeroWalk = [],
  subzeroWalkBack = [],
  subzeroJump = [],
  subzeroDuck = [],
  subzeroBlock = [],
  subzeroHit,
  subzeroPunch,
  subzeroUC,
  subzeroLP,
  subzeroW,
  subzeroL = [],
  subzeroJK,
  subzeroLK;
let fr = 10;
let player1, player2;
let timer = 90;

//gravity
let jump = false; // are we jumping?
let direction = 1; // the force of gravity in y direction
let velocity = 2; //speed of player
let jumpPower = 10;
let fallingSpeed = 2;
let walkSpeed = 15;
let minHeight = 320;

function setup() {
  mode = 0;
  button = createButton("Pause Music");
  music.play();
  button.position(29, 540);
  button.mousePressed(Music);
  createCanvas(800, 500);
  backgroundColor = 95;
  frameRate(fr);
  player1 = new Scorpion();
  player2 = new SubZero();
  gameIsOver = false;
}

function draw() {
  clear();
  if (mode == 0) {
    background(stage);
    fill("white");
    textFont("Impact");
    textSize(70);
    text("Welcome to Mortal Kombat", 7, 60);
    textSize(30);
    fill("red");
    text("Press Enter to Start the Game", 200, 100);
    fill("white");
    text("Scorpion Controls:", 10, 175);
    textSize(20);
    text("Movement: W/A/S/D", 10, 200);
    text("Jab: F", 10, 220);
    text("Block: G", 10, 240);
    text("Uppercut: R", 10, 260);
    text("Low Punch: V (Only Works while down)", 10, 280);
    text("Jump Kick: T (Only Works in the Air)", 10, 300);
    text("Low Kick: B (Only Works while down)", 10, 320);

    text(7);
    text("Pause the Music ! ↓", 10, 480);

    textSize(30);
    text("Sub-Zero Controls", 490, 175);
    textSize(20);
    text("Movement: ← ↑ ↓ →", 490, 200);
    text("Jab: '", 490, 220);
    text("Block:   ;", 490, 240);
    text("Uppercut:   ]", 490, 260);
    text("Low Punch:  /  (Only works while down)", 490, 280);
    text("Jump Kick:  [  (Only Works in the Air)", 490, 300);
    text("Low Kick:  .  (Only works while down)", 490, 320);
  }
  if (mode == 1) {
    background(stage);
    Fight();
    //    Timer()
    player1.show();
    player1.update();
    player1.healthBar();
    translate(width, 0);
    scale(-1, 1);
    player2.show();
    player2.update();
    player2.healthBar();
    gameOver();
  }
}

function loaded() {}
function gameOver() {
  if (player1.health <= 0 || player2.health <= 0) {
    gameIsOver = true;
  }
}

function Wins() {
  if (player1.health <= 0 || player2.health <= 0) {
    scorpionWins.play();
    gameIsOver = true;
  }
}

// function Timer(){
//   fill('red')
//   textSize(45);
//   text(timer, 370, 40)
//   if (frameCount % 20 == 0 && timer > 0) {
//     timer --
//   }
//   if (timer ==0) {
//   }
//   if(timer == 0) {
//     text("Wins", 120, 150);
//   }

// }

function keyPressed() {
  if (keyCode === ENTER) {
    mode = 1;
  }
}

function Music() {
  if (!music.isPlaying()) {
    music.play();
    music.setVolume(0.1);
    button.html("Play Music");
  } else {
    music.pause();
    button.html("Pause Music");
  }
}

function Fight() {
  fill("red");
  textSize(59);
  textFont("Impact");
  text("Fight", 340, 90);

  fill("white");
  textSize(18);
  text("Scorpion", 20, 18);
  text("Sub-Zero", 700, 18);
}

class Scorpion {
  constructor() {
    this.idleAnim = scorpionIdle;
    this.walkAnim = scorpionWalk;
    this.walbAnim = scorpionWalkBack;
    this.jumpAnim = scorpionJump;
    this.duckAnim = scorpionDuck;
    this.punch = scorpionPunch;
    this.damgAnim = scorpionHit;
    this.blocAnim = scorpionBlock;
    this.upcut = scorpionUC;
    this.lowP = scorpionLP;
    this.jumpK = scorpionJK;
    this.lowK = scorpionLK;
    this.x = 25;
    this.y = 320;
    this.lift = 80;
    this.gravity = 30;
    this.velocity = 0;
    this.grounded = true;
    this.jump = false;
    this.stance = "mid";
    this.health = 100;
    this.hitStun = false;
    this.block = false;
    this.lowAnim = false;
  }

  show() {
    if (!gameIsOver) {
      if (this.y != 320) {
        this.grounded = false;
      } else {
        this.grounded = true;
      }
      if (this.hitStun) {
        this.block = false;
        image(this.damgAnim, this.x, this.y);
        this.stance = "anim";
      } else if (
        keyIsDown(66) &&
        this.grounded &&
        this.stance != "anim" &&
        this.stance == "low"
      ) {
        //rect(this.x,this.y+75,130,70)
        image(this.lowK, this.x, this.y + 70);
        if (
          collideRectRect(
            this.x,
            this.y + 75,
            130,
            70,
            width - player2.x - 60,
            player2.y,
            60,
            135
          )
        ) {
          player2.hit(3, "low");
        }
        this.stance = "anim";
      } else if (keyIsDown(84) && !this.grounded && this.stance != "anim") {
        image(this.jumpK, this.x, this.y);
        if (
          collideRectRect(
            this.x,
            this.y,
            130,
            100,
            width - player2.x - 60,
            player2.y,
            60,
            135
          )
        ) {
          player2.hit(11, "OH");
        }
        this.stance = "anim";
      } else if (keyIsDown(82) && this.grounded && this.stance != "anim") {
        image(this.upcut, this.x, this.y - 30);
        if (
          collideRectRect(
            this.x,
            this.y - 25,
            70,
            135,
            width - player2.x - 60,
            player2.y,
            60,
            135
          )
        ) {
          //player2.flying = true
          player2.hit(14, "high", true);
        }
        this.stance = "anim";
      } else if (
        keyIsDown(86) &&
        this.grounded &&
        this.stance != "anim" &&
        this.stance == "low"
      ) {
        image(this.lowP, this.x, this.y + 50);
        if (
          collideRectRect(
            this.x,
            this.y,
            90,
            135,
            width - player2.x - 60,
            player2.y,
            60,
            135
          )
        ) {
          player2.hit(2, "mid");
          this.lowAnim = true;
        }
        this.stance = "anim";
      } else if (
        keyIsDown(70) &&
        this.grounded &&
        this.stance != "anim" &&
        this.stance == "mid"
      ) {
        image(this.punch, this.x, this.y);
        if (
          collideRectRect(
            this.x,
            this.y,
            90,
            135,
            width - player2.x - 60,
            player2.y,
            60,
            135
          )
        ) {
          player2.hit(2, "high");
        }
        this.stance = "anim";
      } else if (keyIsDown(71) && this.grounded && !keyIsDown(83)) {
        this.block = true;
        image(this.blocAnim[0], this.x, this.y);
      } else if (keyIsDown(71) && this.grounded && keyIsDown(83)) {
        this.block = true;
        image(this.blocAnim[1], this.x, this.y + 50);
      } else if (keyIsDown(65) && this.x > 0) {
        this.x = this.x - walkSpeed;
        if (this.grounded) {
          image(
            this.walbAnim[frameCount % this.walbAnim.length],
            this.x,
            this.y
          );
          this.stance = "mid";
        } else {
          image(
            this.jumpAnim[frameCount % this.jumpAnim.length],
            this.x,
            this.y
          );
        }
      } else if (keyIsDown(68) && this.x < width - player2.x - 125) {
        this.x = this.x + walkSpeed;
        if (this.grounded) {
          image(
            this.walkAnim[frameCount % this.walkAnim.length],
            this.x,
            this.y
          );
          this.stance = "mid";
        } else {
          image(
            this.jumpAnim[frameCount % this.jumpAnim.length],
            this.x,
            this.y
          );
        }
      } else if (keyIsDown(83) && this.grounded) {
        image(
          this.duckAnim[frameCount % this.duckAnim.length],
          this.x,
          this.y + 50
        );
        this.stance = "low";
      } else {
        if (this.grounded) {
          image(
            this.idleAnim[frameCount % this.idleAnim.length],
            this.x,
            this.y
          );
          this.stance = "mid";
        } else {
          image(
            this.jumpAnim[frameCount % this.jumpAnim.length],
            this.x,
            this.y
          );
        }
      }
    } else {
      if (this.health <= 0) {
        image(scorpionL[frameCount % scorpionL.length], this.x, this.y);
      } else {
        image(scorpionW, this.x, this.y);
      }
    }

    this.hitStun = false;
    this.lowAnim = false;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y > 320) {
      this.y = 320;
      this.velocity = 0;
    }
    if (keyIsDown(87)) {
      this.jump = true;
    }
    if (this.jump) {
      if (this.y == 320) {
        this.grounded = false;
        this.velocity -= this.lift;
        this.jump = false;
      }
    }
  }
  healthBar() {
    fill(255, 0, 0);
    rect(20, 20, this.health * 3, 20);
    if (this.health < 0) {
      this.health = 0;
    }
  }
  hit(d, s, uc) {
    if (
      (!this.lowAnim &&
        s == "high" &&
        (this.stance == "mid" || !this.grounded)) ||
      (s == "mid" && this.grounded) ||
      this.stance == "anim" ||
      s == "OH" ||
      (s == "low" && this.grounded)
    ) {
      if (
        (s == "high" && this.block) ||
        (s == "mid" && this.block) ||
        (s == "low" && this.block && this.stance == "low") ||
        (s == "OH" && this.stance == "mid" && this.block)
      ) {
        this.health -= d / 5;
        if (this.x > 0) {
          this.x -= d * 2;
        }
      } else {
        if (!uc) {
          this.health -= d;
          this.hitStun = true;
          if (this.x > 0) {
            this.x -= d * 5;
          }
          if (this.x <= 0) {
            this.x = 0;
            player2.x -= d * 3;
          }
        } else {
          this.y -= this.lift * 1.5;
          this.health -= d;
          this.hitStun = true;
          if (this.x > 0) {
            this.x -= d * 5;
          }
          if (this.x <= 0) {
            this.x = 0;
            player2.x -= d * 3;
          }
        }
      }
    }
  }
}

class SubZero {
  constructor() {
    this.idleAnim = subzeroIdle;
    this.walkAnim = subzeroWalk;
    this.walbAnim = subzeroWalkBack;
    this.jumpAnim = subzeroJump;
    this.duckAnim = subzeroDuck;
    this.blocAnim = subzeroBlock;
    this.damgAnim = subzeroHit;
    this.punch = subzeroPunch;
    this.upcut = subzeroUC;
    this.lowP = subzeroLP;
    this.jumpK = subzeroJK;
    this.lowK = subzeroLK;
    this.x = 25;
    this.y = 320;
    this.lift = 80;
    this.gravity = 30;
    this.velocity = 0;
    this.grounded = true;
    this.health = 100;
    this.stance = "mid";
    this.block = false;
    this.hitStun = false;
    this.flying = false;
    this.lowAnim = false;
  }

  show() {
    if (!gameIsOver) {
      this.block = false;
      if (this.y == 320) {
        this.grounded = true;
      } else {
        this.grounded = false;
      }
      if (this.hitStun) {
        this.block = false;
        image(this.damgAnim, this.x, this.y);
        this.stance = "anim";
      } else if (
        keyIsDown(190) &&
        this.grounded &&
        this.stance != "anim" &&
        this.stance == "low"
      ) {
        //rect(this.x,this.y+75,130,70)
        image(this.lowK, this.x, this.y + 70);
        if (
          collideRectRect(
            this.x,
            this.y + 75,
            130,
            70,
            width - player1.x - 60,
            player1.y,
            60,
            135
          )
        ) {
          player1.hit(3, "low");
        }
        this.stance = "anim";
      } else if (keyIsDown(219) && !this.grounded && this.stance != "anim") {
        image(this.jumpK, this.x, this.y);
        if (
          collideRectRect(
            this.x,
            this.y,
            130,
            100,
            width - player1.x - 60,
            player1.y,
            60,
            135
          )
        ) {
          player1.hit(11, "OH");
        }
        this.stance = "anim";
      } else if (keyIsDown(221) && this.grounded && this.stance != "anim") {
        image(this.upcut, this.x, this.y - 30);
        if (
          collideRectRect(
            this.x,
            this.y - 25,
            70,
            135,
            width - player1.x - 60,
            player1.y,
            60,
            135
          )
        ) {
          player1.hit(14, "high", true);
        }
        this.stance = "anim";
      } else if (
        keyIsDown(191) &&
        this.grounded &&
        this.stance != "anim" &&
        this.stance == "low"
      ) {
        image(this.lowP, this.x, this.y + 50);
        if (
          collideRectRect(
            this.x,
            this.y,
            90,
            135,
            width - player1.x - 60,
            player1.y,
            60,
            135
          )
        ) {
          player1.hit(2, "mid");
          this.lowAnim = true;
        }
        this.stance = "anim";
      } else if (keyIsDown(222) && this.grounded && this.stance != "anim") {
        image(this.punch, this.x, this.y);
        if (
          collideRectRect(
            this.x,
            this.y,
            90,
            135,
            width - player1.x - 60,
            player1.y,
            60,
            135
          )
        ) {
          player1.hit(2, "high");
        }
        this.stance = "anim";
      } else if (keyIsDown(186) && this.grounded && !keyIsDown(DOWN_ARROW)) {
        this.block = true;
        image(this.blocAnim[1], this.x, this.y);
      } else if (keyIsDown(186) && this.grounded && keyIsDown(DOWN_ARROW)) {
        this.block = true;
        image(this.blocAnim[0], this.x, this.y + 50);
      } else if (keyIsDown(RIGHT_ARROW) && this.x > 0) {
        this.x = this.x - walkSpeed;
        if (this.grounded) {
          image(
            this.walbAnim[frameCount % this.walbAnim.length],
            this.x,
            this.y
          );
          this.stance = "mid";
        } else {
          image(
            this.jumpAnim[frameCount % this.jumpAnim.length],
            this.x,
            this.y
          );
        }
      } else if (keyIsDown(LEFT_ARROW) && this.x < width - player1.x - 125) {
        this.x = this.x + walkSpeed;
        if (this.grounded) {
          image(
            this.walkAnim[frameCount % this.walkAnim.length],
            this.x,
            this.y
          );
          this.stance = "mid";
        } else {
          image(
            this.jumpAnim[frameCount % this.jumpAnim.length],
            this.x,
            this.y
          );
        }
      } else if (keyIsDown(DOWN_ARROW) && this.grounded) {
        image(
          this.duckAnim[frameCount % this.duckAnim.length],
          this.x,
          this.y + 50
        );
        this.stance = "low";
      } else if (this.flying) {
        image(this.damgAnim, this.x, this.y);
      } else {
        if (this.grounded) {
          image(
            this.idleAnim[frameCount % this.idleAnim.length],
            this.x,
            this.y
          );
          this.stance = "mid";
        } else {
          image(
            this.jumpAnim[frameCount % this.jumpAnim.length],
            this.x,
            this.y
          );
        }
      }
    } else {
      if (this.health <= 0) {
        image(subzeroL[frameCount % subzeroL.length], this.x, this.y);
      } else {
        image(subzeroW, this.x, this.y);
      }
    }
    this.hitStun = false;
    this.lowAnim = false;
  }
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y > 320) {
      this.y = 320;
      this.velocity = 0;
    }
    if (keyIsDown(UP_ARROW)) {
      this.jump = true;
    }
    if (this.jump) {
      if (this.y == 320) {
        this.grounded = false;
        this.velocity -= this.lift;
        this.jump = false;
      }
    }
    if (this.flying) {
      this.velocity -= this.lift * 1.5;
      this.flying = false;
    }
  }
  healthBar() {
    fill(255, 0, 0);
    rect(20, 20, this.health * 3, 20);
    if (this.health < 0) {
      this.health = 0;
    }
  }
  hit(d, s, uc) {
    if (
      (!this.lowAnim &&
        s == "high" &&
        (this.stance == "mid" || !this.grounded)) ||
      (s == "mid" && this.grounded) ||
      this.stance == "anim" ||
      s == "OH" ||
      (s == "low" && this.grounded)
    ) {
      if (
        (s == "high" && this.block) ||
        (s == "mid" && this.block) ||
        (s == "low" && this.block && this.stance == "low") ||
        (s == "OH" && this.stance == "mid" && this.block)
      ) {
        this.health -= d / 5;
        if (this.x > 0) {
          this.x -= d * 2;
        }
      } else {
        if (!uc) {
          this.health -= d;
          this.hitStun = true;
          if (this.x > 0) {
            this.x -= d * 5;
          }
          if (this.x <= 0) {
            this.x = 0;
            player1.x -= d * 3;
          }
        } else {
          this.y -= this.lift * 2;
          this.health -= d;
          this.hitStun = true;
          if (this.x > 0) {
            this.x -= d * 5;
          }
          if (this.x <= 0) {
            this.x = 0;
            player1.x -= d * 3;
          }
        }
      }
    }
  }
}
function preload() {
  //scorpion
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fbb9b5aca-10e7-433f-b362-729be4a70949.image.png?v=1595953269242"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7a5b78aa-425a-45b5-a526-dd6ea57154b0.image.png?v=1595953289405"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fe2137f4a-c7e0-4538-8d58-76fe559afa96.image.png?v=1595953297207"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F407a7d2e-3028-4747-84bd-5cee5bd35100.image.png?v=1595953358463"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fcf90b711-cc26-4629-ae5b-aadb6ef1bcf1.image.png?v=1595953368599"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F14ac35eb-9de3-4de7-a1d6-1db0cdffb7a1.image.png?v=1595953385842"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F4a1bc719-d2fd-4336-8533-28b3149dbc0a.image.png?v=1595953392129"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F14ac35eb-9de3-4de7-a1d6-1db0cdffb7a1.image.png?v=1595953385842"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fcf90b711-cc26-4629-ae5b-aadb6ef1bcf1.image.png?v=1595953368599"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F407a7d2e-3028-4747-84bd-5cee5bd35100.image.png?v=1595953358463"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fe2137f4a-c7e0-4538-8d58-76fe559afa96.image.png?v=1595953297207"
    )
  );
  scorpionIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7a5b78aa-425a-45b5-a526-dd6ea57154b0.image.png?v=1595953289405"
    )
  );

  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa02.png?v=1595870496345"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa03.png?v=1595870499234"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa04.png?v=1595870514842"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa05.png?v=1595870518139"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa06.png?v=1595870522284"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa07.png?v=1595870524644"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa08.png?v=1595870527266"
    )
  );
  scorpionWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa09.png?v=1595870530060"
    )
  );

  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa09.png?v=1595870530060"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa08.png?v=1595870527266"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa07.png?v=1595870524644"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa06.png?v=1595870522284"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa05.png?v=1595870518139"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa04.png?v=1595870514842"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa03.png?v=1595870499234"
    )
  );
  scorpionWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa02.png?v=1595870496345"
    )
  );

  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff02.png?v=1595872446160"
    )
  );
  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff03.png?v=1595872451049"
    )
  );
  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff04.png?v=1595872454530"
    )
  );
  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff05.png?v=1595872458682"
    )
  );
  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff06.png?v=1595872464113"
    )
  );
  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff07.png?v=1595872467168"
    )
  );
  scorpionJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff08.png?v=1595872470622"
    )
  );

  scorpionDuck.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fc40a091c-bb3d-419c-b6b6-93703b5db88e.image.png?v=1595953737232"
    )
  );

  scorpionBlock.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F49caae5f-792e-4665-b61a-f33295b080c9.image.png?v=1596044305179"
    )
  );
  scorpionBlock.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F9d633f9b-abc1-4d5a-8539-86b698db606c.image.png?v=1596044309915"
    )
  );

  scorpionHit = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fd5b6cc23-4be0-4dd9-969b-a6ea4da54843.image.png?v=1596044318774"
  );

  scorpionPunch = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F830dcc07-8f29-4719-8669-3807a7e855a7.image.png?v=1595963471252"
  );
  scorpionUC = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Feb3da3b4-707a-42a8-9f49-f6fd643a9a56.image.png?v=1596045361226"
  );
  scorpionLP = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fcc31b973-d4e8-429e-a80f-c4ff6247da2b.image.png?v=1596130933302"
  );
  scorpionJK = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F2c8f7a7a-d403-4f6d-b58a-a760e0c3c234.image.png?v=1596212140987"
  );
  scorpionLK = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F1e3ae3c9-3b02-40aa-9903-3e4f5092c427.image.png?v=1596213827424"
  );

  scorpionW = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F163f6caf-e9c4-45de-8209-acbdc73618d8.image.png?v=1596132374157"
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fd253eb20-47b0-46ba-8564-8cc42ffd26e6.image.png?v=1596132431566"
    )
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F6d522872-f500-46eb-acb9-b11280601bcf.image.png?v=1596132445449"
    )
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F2f8b70e2-24eb-4971-acc6-109299e2da54.image.png?v=1596132454340"
    )
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F52ce45d2-38e4-4b0f-99b3-6e9364ee6509.image.png?v=1596132461633"
    )
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fc75295af-235e-402b-b768-24f5bc2466ac.image.png?v=1596132469124"
    )
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F1924514d-4f3e-45f5-a4a7-2a085d57e30d.image.png?v=1596132475572"
    )
  );
  scorpionL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fdbf0ec52-e444-4012-9209-84f5fa2e4525.image.png?v=1596132481860"
    )
  );

  //subzero
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fb1b307c9-140f-43c9-91fd-0590de77eb1b.image.png?v=1595953998325"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F581a5d62-466a-436a-856a-a456b6789b73.image.png?v=1595954024633"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F53356a57-7f56-4579-a90c-ddde6ff520bb.image.png?v=1595954028244"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fe4fde6be-2cd6-450f-a46d-f1e971373eb5.image.png?v=1595954034735"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fdac7981f-25ca-47ef-a908-1a127f604704.image.png?v=1595954041131"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7c0b7039-51f9-450e-991c-4fa34c0d2993.image.png?v=1595954046708"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F07ec4f3f-9195-4fe1-9a86-eb45af09b093.image.png?v=1595954050260"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7c0b7039-51f9-450e-991c-4fa34c0d2993.image.png?v=1595954046708"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fdac7981f-25ca-47ef-a908-1a127f604704.image.png?v=1595954041131"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fe4fde6be-2cd6-450f-a46d-f1e971373eb5.image.png?v=1595954034735"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F53356a57-7f56-4579-a90c-ddde6ff520bb.image.png?v=1595954028244"
    )
  );
  subzeroIdle.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F581a5d62-466a-436a-856a-a456b6789b73.image.png?v=1595954024633"
    )
  );

  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7f60a3d2-ed74-4835-a9fe-3f239bf1f73c.image.png?v=1595956856945"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff6fb64df-8e59-4a7f-a683-aa73d8436103.image.png?v=1595956861429"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F483d4c3b-da7c-49c4-9f27-d75acb2b9732.image.png?v=1595956866058"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F20fdcd0b-f65e-4b0a-b888-4b45918ed4f2.image.png?v=1595956872754"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fc83fa1c8-fa9f-48d9-8d9f-9d0bf1021f9c.image.png?v=1595956877403"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F5eddbdcb-f7b8-49fc-951c-0c56596a6b14.image.png?v=1595956883415"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa790a3c8-cba9-45c1-8281-8cec1f098e1b.image.png?v=1595956889219"
    )
  );
  subzeroWalk.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fdb24259a-1d42-4159-9708-44d9c46364c9.image.png?v=1595956893390"
    )
  );

  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fdb24259a-1d42-4159-9708-44d9c46364c9.image.png?v=1595956893390"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa790a3c8-cba9-45c1-8281-8cec1f098e1b.image.png?v=1595956889219"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F5eddbdcb-f7b8-49fc-951c-0c56596a6b14.image.png?v=1595956883415"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fc83fa1c8-fa9f-48d9-8d9f-9d0bf1021f9c.image.png?v=1595956877403"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F20fdcd0b-f65e-4b0a-b888-4b45918ed4f2.image.png?v=1595956872754"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F483d4c3b-da7c-49c4-9f27-d75acb2b9732.image.png?v=1595956866058"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff6fb64df-8e59-4a7f-a683-aa73d8436103.image.png?v=1595956861429"
    )
  );
  subzeroWalkBack.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7f60a3d2-ed74-4835-a9fe-3f239bf1f73c.image.png?v=1595956856945"
    )
  );

  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ffc7dbf8e-8a8f-4008-9077-e62e26c53212.image.png?v=1595958871111"
    )
  );
  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fe822d42e-2342-4fee-9130-bf07afd8133f.image.png?v=1595958874915"
    )
  );
  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fafc40c7d-cf2d-4874-8ece-df2d7d0e280c.image.png?v=1595958878995"
    )
  );
  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F257a2a0e-64b9-4159-b274-39b9b5103f56.image.png?v=1595958884928"
    )
  );
  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F3eb6d475-2a65-4563-9750-04b1ce06c9b4.image.png?v=1595958889579"
    )
  );
  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fbc48a942-9238-4862-b7b1-2d0c957c1463.image.png?v=1595958892438"
    )
  );
  subzeroJump.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fd891ba74-c096-4f87-bbd3-3438a14c68a4.image.png?v=1595958895410"
    )
  );

  subzeroDuck.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fb8bccb20-6780-4e5e-9804-0d5643a2123a.image.png?v=1595958956098"
    )
  );

  subzeroBlock.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fd6291e0b-e2c1-4698-83b6-0493d3a1e54a.image.png?v=1596041144975"
    )
  );
  subzeroBlock.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fbc94b181-32b6-4f04-a4ca-c5aac98942ea.image.png?v=1596041138034"
    )
  );

  subzeroHit = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Faedd9383-2a1e-4298-8de8-a86bedd6b46b.image.png?v=1596042784542"
  );

  subzeroPunch = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Ff118bcc8-26c2-4dcc-bfc1-085b6aef082c.image.png?v=1596043648414"
  );
  subzeroUC = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F6674149a-b8d6-491f-9344-e169403d17f6.image.png?v=1596128498566"
  );
  subzeroLP = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F4581f543-c418-4cef-96a9-59030de61178.image.png?v=1596129104080"
  );
  subzeroJK = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F8098a1d6-d3ea-4839-be0c-63e96ab41f73.image.png?v=1596213225969"
  );
  subzeroLK = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F889e55b6-957a-47db-bcde-6fa858df5575.image.png?v=1596214817394"
  );

  subzeroW = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fb676056c-3a44-4f30-945c-529de5256a07.image.png?v=1596133085829"
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F4c29d931-c72a-4b37-b894-eee479a17d72.image.png?v=1596133091164"
    )
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F4c5fcda7-415e-44a4-92a1-fbaf9a30622f.image.png?v=1596133095878"
    )
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F7fec2d75-eda7-4abb-9ea7-bf2d4c39656a.image.png?v=1596133100979"
    )
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2F28987e49-3d7d-4526-b086-946b0688a33b.image.png?v=1596133106934"
    )
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fcf193640-cfa6-4743-ab1f-200fb0155232.image.png?v=1596133113275"
    )
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fefb8a4b2-8251-4549-a7a8-f533edcc1427.image.png?v=1596133118989"
    )
  );
  subzeroL.push(
    loadImage(
      "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa695116e-00a0-42a3-b7b8-ae46f251e17d.image.png?v=1596133123875"
    )
  );

  //other
  stage = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2FKrossroads.png?v=1595870018120"
  );
  punchSound = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2FPunch.mp3?v=1596213261776"
  );
  kickSound = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2FKick.mp3?v=1596213282495"
  );
  uppercutSound = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2FUppercut.mp3?v=1596213255316"
  );
  fight = loadImage(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fa867c0df-44d9-44ae-9099-618fb8c24815.image.png?v=1595961927513"
  );
  scorpionWins = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fscorpion-wins.mp3?v=1596213258946"
  );
  subzeroWins = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2FsubzeroWins.mp3?v=1596213278166"
  );

  music = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2FMortal%20Kombat%20Theme%20Song%20Original.mp3?v=1596044475067"
  );
  
  round1 = loadSound(
    "https://cdn.glitch.com/1e7002f0-8eab-4c8d-a896-9b50c92b6163%2Fmortal-kombat-9-sound-drop-round-1-fight.mp3?v=1596219363316"
  );
}
