"use client";

import Phaser from "phaser";
import { useEffect, useRef } from "react";

interface UIRefs {
  scoreEl: HTMLSpanElement;
  timerEl: HTMLSpanElement;
  finalScoreEl: HTMLSpanElement;
  gameOverEl: HTMLDivElement;
  restartBtn: HTMLButtonElement;
}

class GameScene extends Phaser.Scene {
  private uiRefs: UIRefs;
  private score = 0;
  private timeLeft = 120;
  private gameActive = true;
  private ball!: Phaser.Physics.Arcade.Image;
  private hoop!: Phaser.Physics.Arcade.Image;
  private netZone!: Phaser.GameObjects.Zone;
  private streak = 0;
  private dragStart: { x: number; y: number } | null = null;
  private swishSound!: Phaser.Sound.BaseSound;
  private bounceSound!: Phaser.Sound.BaseSound;
  private rimZone!: Phaser.GameObjects.Zone;

  constructor(uiRefs: UIRefs) {
    super("GameScene");
    this.uiRefs = uiRefs;
  }

  preload() {
    this.load.image("court", "/assets/basketball-court.png");
    this.load.image("ball", "/assets/basketball.png");
    this.load.audio("swish", "/assets/swish.wav");
    this.load.audio("bounce", "/assets/bounce.mp3");
  }

  create() {
    const { width, height } = this.scale;
    const court = this.add.image(0, 0, "court").setOrigin(0, 0);
    court.setDisplaySize(width, height);

    // Invisible rim zone for bounce collision (positioned where rim would be in image)
    this.rimZone = this.add.zone(width / 2 - 25, height * 0.3, 50, 10); // Adjust coords based on image
    this.physics.add.existing(this.rimZone);
    (this.rimZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.rimZone.body.setImmovable(true);

    // Invisible net zone for scoring (below rim)
    this.netZone = this.add.zone(width / 2 - 25, height * 0.3 + 20, 50, 30);
    this.physics.add.existing(this.netZone);
    (this.netZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.createBall();

    this.physics.add.collider(this.ball, this.rimZone, this.handleRimCollision, undefined, this);
    this.physics.add.overlap(this.ball, this.netZone, this.handleScore, undefined, this);

    this.swishSound = this.sound.add("swish");
    this.bounceSound = this.sound.add("bounce");

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      loop: true,
    });

    this.uiRefs.restartBtn.addEventListener("click", () => this.restartGame());

    this.updateUI();
  }

  createBall() {
    const { width, height } = this.scale;
    const x = Phaser.Math.Between(width * 0.2, width * 0.8);
    this.ball = this.physics.add.image(x, height - 100, "ball").setScale(0.2).setBounce(0.8).setCollideWorldBounds(true);
    this.ball.setInteractive();
    this.input.on("pointerdown", this.handlePointerDown, this);
    this.input.on("pointermove", this.handlePointerMove, this);
    this.input.on("pointerup", this.handlePointerUp, this);
  }

  handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (this.gameActive && this.ball.getBounds().contains(pointer.x, pointer.y)) {
      this.dragStart = { x: pointer.x, y: pointer.y };
    }
  }

  handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (this.dragStart) {
      // Could add aim line here if desired
    }
  }

  handlePointerUp(pointer: Phaser.Input.Pointer) {
    if (this.dragStart && this.gameActive) {
      const dx = this.dragStart.x - pointer.x;
      const dy = this.dragStart.y - pointer.y;
      this.ball.setVelocity(dx * 5, dy * 5);
      this.dragStart = null;
      this.input.off("pointermove", this.handlePointerMove, this);
      this.input.off("pointerup", this.handlePointerUp, this);

      this.time.delayedCall(2000, () => {
        if (this.gameActive && this.ball) {
          this.ball.destroy();
          this.createBall();
        }
      });
    }
  }

  handleRimCollision() {
    this.bounceSound.play();
  }

  handleScore() {
    this.swishSound.play();
    this.score += 1;
    this.streak += 1;
    this.showEmoji();
    this.ball.destroy();
    this.createBall();
    this.updateUI();
  }

  showEmoji() {
    const emojis = ["🏀", "🔥", "💥"];
    const emoji = this.add.text(this.ball.x, this.ball.y, emojis[this.streak % 3], { fontSize: "32px" });
    this.tweens.add({
      targets: emoji,
      y: emoji.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => emoji.destroy(),
    });
  }

  updateTimer() {
    if (this.gameActive) {
      this.timeLeft -= 1;
      this.updateUI();
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }
  }

  endGame() {
    this.gameActive = false;
    this.physics.pause();
    this.uiRefs.gameOverEl.style.display = "flex";
    this.uiRefs.finalScoreEl.textContent = this.score.toString();
  }

  restartGame() {
    this.score = 0;
    this.timeLeft = 120;
    this.streak = 0;
    this.gameActive = true;
    this.uiRefs.gameOverEl.style.display = "none";
    this.physics.resume();
    this.ball.destroy();
    this.createBall();
    this.rimZone.destroy(); // Destroy existing zones
    this.netZone.destroy();
    this.createZones(); // Recreate zones
    this.updateUI();
  }

  createZones() {
    const { width, height } = this.scale;
    this.rimZone = this.add.zone(width / 2 - 25, height * 0.3, 50, 10);
    this.physics.add.existing(this.rimZone);
    (this.rimZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.rimZone.body.setImmovable(true);

    this.netZone = this.add.zone(width / 2 - 25, height * 0.3 + 20, 50, 30);
    this.physics.add.existing(this.netZone);
    (this.netZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  updateUI() {
    this.uiRefs.scoreEl.textContent = this.score.toString();
    this.uiRefs.timerEl.textContent = `${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, "0")}`;
  }

  update() {
    // Additional update logic if needed
  }
}

export function BasketballGame({ uiRefs }: { uiRefs: UIRefs }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: "100%",
      height: "100%",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 500 },
          debug: false,
        },
      },
      scene: new GameScene(uiRefs),
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [uiRefs]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
