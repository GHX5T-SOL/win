"use client";

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Court } from "./court";
import { Basketball } from "./basketball";
import { Hoop } from "./hoop";
import { Controls } from "./controls";
import { UI } from "./ui";
import { MovingTarget } from "./movingTarget";

export class StreetBasketballGame {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: CANNON.World;
  private court!: Court;
  private hoop!: Hoop;
  private controls!: Controls;
  private ui!: UI;
  private animationId: number | null = null;
  private resizeHandler: (() => void) | null = null;
  private movingTarget: MovingTarget | null = null;

  public score = 0;
  public timeLeft = 120;
  public gameActive = true;
  public basketball: Basketball | null = null;

  constructor(params: {
    container: HTMLElement;
    uiRefs: {
      scoreEl: HTMLElement;
      timerEl: HTMLElement;
      gameOverEl: HTMLElement;
      finalScoreEl: HTMLElement;
      restartBtn: HTMLButtonElement;
    };
    trajectoryCanvas: HTMLCanvasElement;
  }) {
    this.container = params.container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.world = new CANNON.World();

    // Attach canvas to container
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x0a0a15, 1);
    this.container.appendChild(this.renderer.domElement);

    // Physics
    this.world.gravity.set(0, -25, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

    // Camera
    this.camera.position.set(0, 3, -8);
    this.camera.lookAt(0, 3, 0);

    // Components
    this.court = new Court(this.scene, this.world);
    this.hoop = new Hoop(this.scene, this.world);
    this.controls = new Controls(this.renderer.domElement, this, params.trajectoryCanvas);
    this.ui = new UI(this, params.uiRefs);
    this.movingTarget = new MovingTarget(this.scene);

    // First ball
    this.spawnBasketball();

    // Loop and timer
    this.gameLoop = this.gameLoop.bind(this);
    this.gameLoop();
    this.startTimer();

    // Resize
    this.resizeHandler = () => this.onResize();
    window.addEventListener("resize", this.resizeHandler);
  }

  spawnBasketball() {
    if (this.basketball) {
      this.scene.remove(this.basketball.mesh!);
      this.world.removeBody(this.basketball.body!);
    }
    this.basketball = new Basketball(this.scene, this.world);
  }

  shootBasketball(force: THREE.Vector3) {
    if (!this.gameActive || !this.basketball) return;
    this.basketball.shoot(force);
    setTimeout(() => {
      if (this.gameActive) this.spawnBasketball();
    }, 500);
  }

  private checkScore() {
    if (!this.basketball || !this.gameActive) return;
    if (this.hoop.checkBasketballScore(this.basketball)) {
      const shotPos = this.basketball.getInitialPosition();
      const hoopCenter = new THREE.Vector3(0, 0, 4.5);
      const dist = new THREE.Vector3(shotPos.x, 0, shotPos.z).distanceTo(hoopCenter);
      const points = dist > 4.5 ? 3 : 2;
      this.score += points;
      this.ui.updateScore(this.score);
      // small shake
      this.camera.position.x += (Math.random() - 0.5) * 0.2;
      this.camera.position.y += (Math.random() - 0.5) * 0.2;
      setTimeout(() => {
        this.camera.position.set(0, 3, -8);
        this.camera.lookAt(0, 3, 0);
      }, 100);
    }
  }

  private startTimer() {
    const timer = setInterval(() => {
      if (!this.gameActive) return clearInterval(timer);
      this.timeLeft -= 1;
      this.ui.updateTimer(this.timeLeft);
      if (this.timeLeft <= 0) {
        clearInterval(timer);
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    this.gameActive = false;
    this.ui.showGameOver(this.score);
  }

  restart() {
    this.score = 0;
    this.timeLeft = 120;
    this.gameActive = true;
    this.ui.updateScore(this.score);
    this.ui.updateTimer(this.timeLeft);
    this.ui.hideGameOver();
    this.spawnBasketball();
    this.startTimer();
  }

  private gameLoop() {
    this.animationId = requestAnimationFrame(this.gameLoop);
    if (this.gameActive) {
      this.world.step(1 / 60);
      if (this.basketball) this.basketball.update();
      if (this.movingTarget) this.movingTarget.update();
      this.checkScore();
      if (this.basketball && this.movingTarget && this.movingTarget.checkHit(this.basketball)) {
        this.score += 1; // bonus point
        this.ui.updateScore(this.score);
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  private onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.resizeHandler) window.removeEventListener("resize", this.resizeHandler);
    this.renderer.dispose();
    // Remove canvas from container to free resources
    if (this.renderer.domElement && this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}


