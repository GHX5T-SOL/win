import * as THREE from "three";
import { StreetBasketballGame } from "./StreetBasketballGame";

export class Controls {
  private isMouseDown = false;
  private isTouchActive = false;
  private startPos = new THREE.Vector2();
  private currentPos = new THREE.Vector2();
  private trajectoryCanvas: HTMLCanvasElement;
  private trajectoryCtx: CanvasRenderingContext2D;

  constructor(private domElement: HTMLElement, private game: StreetBasketballGame, trajectoryCanvas: HTMLCanvasElement) {
    this.trajectoryCanvas = trajectoryCanvas;
    const ctx = this.trajectoryCanvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");
    this.trajectoryCtx = ctx;
    this.setupCanvas();
    this.setupMouseControls();
    this.setupTouchControls();
  }

  private setupCanvas() {
    const resize = () => {
      this.trajectoryCanvas.width = this.domElement.clientWidth;
      this.trajectoryCanvas.height = this.domElement.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
  }

  private setupMouseControls() {
    this.domElement.addEventListener("mousedown", (e) => {
      if (!this.game.gameActive) return;
      this.isMouseDown = true;
      this.startPos.set(e.clientX, e.clientY);
      this.currentPos.set(e.clientX, e.clientY);
    });
    this.domElement.addEventListener("mousemove", (e) => {
      if (!this.isMouseDown || !this.game.gameActive) return;
      this.currentPos.set(e.clientX, e.clientY);
      this.drawTrajectory();
    });
    this.domElement.addEventListener("mouseup", () => {
      if (!this.isMouseDown || !this.game.gameActive) return;
      this.shoot();
      this.isMouseDown = false;
      this.clearTrajectory();
    });
  }

  private setupTouchControls() {
    this.domElement.addEventListener("touchstart", (e) => {
      if (!this.game.gameActive) return;
      const t = e.touches[0];
      this.isTouchActive = true;
      this.startPos.set(t.clientX, t.clientY);
      this.currentPos.set(t.clientX, t.clientY);
    }, { passive: true });
    this.domElement.addEventListener("touchmove", (e) => {
      if (!this.isTouchActive || !this.game.gameActive) return;
      const t = e.touches[0];
      this.currentPos.set(t.clientX, t.clientY);
      this.drawTrajectory();
    }, { passive: true });
    this.domElement.addEventListener("touchend", () => {
      if (!this.isTouchActive || !this.game.gameActive) return;
      this.shoot();
      this.isTouchActive = false;
      this.clearTrajectory();
    });
  }

  private drawTrajectory() {
    this.clearTrajectory();
    const dx = this.currentPos.x - this.startPos.x;
    const dy = this.currentPos.y - this.startPos.y;
    this.trajectoryCtx.strokeStyle = "rgba(255,255,255,0.6)";
    this.trajectoryCtx.lineWidth = 3;
    this.trajectoryCtx.setLineDash([5, 5]);
    this.trajectoryCtx.beginPath();
    this.trajectoryCtx.moveTo(this.startPos.x, this.startPos.y);
    this.trajectoryCtx.lineTo(this.currentPos.x, this.currentPos.y);
    this.trajectoryCtx.stroke();
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1);
    const radius = 20 + power * 15;
    this.trajectoryCtx.fillStyle = `rgba(255, ${255 - power * 200}, 0, 0.7)`;
    this.trajectoryCtx.beginPath();
    this.trajectoryCtx.arc(this.startPos.x, this.startPos.y, radius, 0, Math.PI * 2);
    this.trajectoryCtx.fill();
  }

  private clearTrajectory() {
    this.trajectoryCtx.clearRect(0, 0, this.trajectoryCanvas.width, this.trajectoryCanvas.height);
  }

  private shoot() {
    const dx = this.currentPos.x - this.startPos.x;
    const dy = this.currentPos.y - this.startPos.y;
    const forceMultiplier = 0.02;
    const maxForce = 15;
    let fx = dx * forceMultiplier;
    let fy = -dy * forceMultiplier + 8;
    let fz = 8;
    fx = Math.max(-maxForce, Math.min(maxForce, fx));
    fy = Math.max(3, Math.min(maxForce, fy));
    fz = Math.max(5, Math.min(maxForce, fz));
    this.game.shootBasketball(new THREE.Vector3(fx, fy, fz));
  }
}


