import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Basketball } from "./basketball";

export class MovingTarget {
  public mesh: THREE.Mesh;
  private startTime = performance.now();
  private radius = 0.2;

  constructor(private scene: THREE.Scene) {
    const geo = new THREE.TorusGeometry(this.radius, 0.02, 8, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0x33ff66 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0.8, 3.0, 4.15);
    this.mesh.rotation.x = Math.PI / 2;
    this.scene.add(this.mesh);
  }

  update() {
    const t = (performance.now() - this.startTime) / 1000;
    // Oscillate left-right around hoop
    this.mesh.position.x = Math.sin(t * 0.8) * 1.0;
    // Gentle up-down
    this.mesh.position.y = 2.9 + Math.sin(t * 1.2) * 0.15;
  }

  checkHit(ball: Basketball) {
    if (!ball.body) return false;
    const dx = ball.body.position.x - this.mesh.position.x;
    const dy = ball.body.position.y - this.mesh.position.y;
    const dz = ball.body.position.z - this.mesh.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return dist < this.radius + 0.14; // ball radius ~0.12
  }
}


