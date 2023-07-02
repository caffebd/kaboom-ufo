import kaboom from "kaboom";

kaboom({
  width: 800,
  height: 600,
});

setBackground(50, 50, 50);

loadSprite("ship", "assets/ship.png");
loadSprite("missile", "assets/missile.png");
loadSprite("enemy", "assets/enemy.png");

loadSprite("enemyMissile", "assets/ufoMissile.png");

loadSound("laser", "assets/audio/laser.wav");
loadSound("explode", "assets/audio/explode.wav");

scene("game", () => {
  let playerSpeed = 400;

  let score = 0;

  let lives = 3;

  const livesLabel = add([text(`Lives = ${lives}`), pos(24, 24)]);

  const scoreLabel = add([text(`Score = ${score}`), pos(width() - 250, 24)]);

  //`Score = ${score}`
  let player = add([pos(120, 480), sprite("ship"), area(), "player"]);

  loop(4, () => {
    let yPos = rand(50, 400);
    let speed = rand(50, 500);
    add([
      sprite("enemy"),
      pos(-50, yPos),
      area(),
      "enemy",
      move(RIGHT, speed),
      offscreen({ destroy: true }),
    ]);
  });

  loop(4, () => {
    let yPos = rand(50, 400);
    let speed = rand(50, 500);
    add([
      sprite("enemy"),
      pos(width(), yPos),
      area(),
      "enemy",
      move(LEFT, speed),
      offscreen({ destroy: true }),
    ]);
  });

  loop(4, () => {
    let yPos = rand(50, 400);
    let speed = rand(50, 300);
    add([
      sprite("enemy"),
      pos(width(), yPos),
      area(),
      "enemy",
      move(LEFT, speed),
      offscreen({ destroy: true }),
    ]);
  });

  function enemyFire() {
    return {
      add() {
        wait(10, () => {
          loop(randi(10, 20), () => {
            if (this != null) {
              add([
                sprite("enemyMissile"),
                pos(this.pos.x, this.pos.y),
                move(DOWN, 200),
              ]);
            }
          });
        });
      },
    };
  }

  onKeyDown("right", () => {
    player.move(playerSpeed, 0);
  });

  onKeyDown("left", () => {
    player.move(-playerSpeed, 0);
  });

  onKeyDown("up", () => {
    player.move(0, -playerSpeed);
  });

  onKeyDown("down", () => {
    player.move(0, playerSpeed);
  });

  onKeyPress("space", () => {
    missile(player.pos.add(100, -40));
    play("laser");
  });

  function missile(position) {
    add([
      sprite("missile"),
      pos(position.sub(50, 0)),
      move(UP, 400),
      area(),
      "missile",
      offscreen({ destroy: true }),
    ]);
    add([
      sprite("missile"),
      pos(position.add(50, 0)),
      move(UP, 400),
      area(),
      "missile",
      offscreen({ destroy: true }),
    ]);
  }

  //comment
  //this is the code for the enemy missile

  function enemyMissile(enemy) {
    add([
      sprite("enemyMissile"),
      pos(enemy.pos),
      move(DOWN, rand(300, 700)),
      area(),
      "enemyMissile",
      offscreen({ destroy: true }),
    ]);
  }

  function startEnemyFire() {
    let enemies = get("enemy");
    enemies.forEach((enemy) => {
      let fire = rand(0, 10);
      if (fire > 5) {
        enemyMissile(enemy);
      }
    });
  }

  loop(3, () => {
    startEnemyFire();
  });

  //enemyMissile()

  //player = 1

  //enemies = 20

  //array list

  function enemyMissile() {
    add([
      sprite("enemyMissile"),
      pos(320, 100),
      move(DOWN, 200),
      //area(),
      offscreen({ destroy: true }),
      "enemyMissile",
    ]);
  }

  function beginEnemyFire() {
    enemies.forEach((e) => {
      if (randi(0, 10) > 0) {
        enemyMissile(e);
      }
    });
  }

  //let enemies = get("enemy");
  // loop(3, () => {
  //   console.log("enemy");
  //   enemies = get("enemy");
  //   beginEnemyFire();
  // });

  onCollide("enemy", "missile", (enemy, missile) => {
    destroy(enemy);
    destroy(missile);
    score++;
    scoreLabel.text = `Score = ${score}`;
  });

  // play("explode");

  // console.log(rand(0, 10));
  // console.log(randi(0, 10));

  onCollide("enemyMissile", "player", (enemyMissile, player) => {
    destroy(enemyMissile);
    lives--;
    livesLabel.text = `Lives = ${lives}`;
    if (lives == 0) {
      go("gameOver", score);
    }
  });
  //play("explode");
  //  if (lives == 0) {
  //    go("lose", score);
  //  }

  onCollide("enemyMissile", "missile", (enemyMissile, missile) => {
    destroy(enemyMissile);
    destroy(missile);
  });
});

scene("gameOver", (score) => {
  add([
    text("GAME OVER"),
    pos(width() / 2, height() / 2),
    scale(2),
    anchor("center"),
  ]);

  add([
    text(`Score = ${score}`),
    pos(width() / 2, height() / 2 + 100),
    scale(2),
    anchor("center"),
  ]);

  // go back to game with space is pressed

  onKeyPress("space", () => go("game"));

  onClick(() => go("game"));
});

//add([sprite("ship"), pos(width() / 2, height() / 2 - 64), anchor("center")]);

// display score

go("game");
