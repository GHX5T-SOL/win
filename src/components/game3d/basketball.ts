import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Basketball {
  public mesh: THREE.Mesh | null = null;
  public body: CANNON.Body | null = null;
  private isShot = false;
  private initialPosition: CANNON.Vec3 = new CANNON.Vec3();

  constructor(private scene: THREE.Scene, private world: CANNON.World) {
    this.createBasketball();
  }

  private createBasketball() {
    const geometry = new THREE.SphereGeometry(0.12, 16, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0xff6600 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.addBasketballLines();
    this.mesh.position.set(0, 1.5, -6);
    this.scene.add(this.mesh);

    const shape = new CANNON.Sphere(0.12);
    this.body = new CANNON.Body({ mass: 0.6 });
    this.body.addShape(shape);
    this.body.position.set(0, 1.5, -6);
    this.body.material = new CANNON.Material({ friction: 0.4, restitution: 0.8 });
    this.initialPosition.copy(this.body.position);
    this.world.addBody(this.body);
  }

  private addBasketballLines() {
    if (!this.mesh) return;
    const lineGeometry = new THREE.RingGeometry(0.119, 0.121, 32);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const hLine = new THREE.Mesh(lineGeometry, lineMaterial);
    hLine.rotation.x = Math.PI / 2;
    this.mesh.add(hLine);
    for (let i = 0; i < 4; i++) {
      const vLine = new THREE.Mesh(lineGeometry, lineMaterial);
      vLine.rotation.y = (i * Math.PI) / 2;
      this.mesh.add(vLine);
    }
  }

  shoot(force: THREE.Vector3) {
    if (this.isShot || !this.body) return;
    this.isShot = true;
    this.body.velocity.set(force.x, force.y, force.z);
    this.body.angularVelocity.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  }

  update() {
    if (this.body && this.mesh) {
      this.mesh.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
      this.mesh.quaternion.set(
        this.body.quaternion.x,
        this.body.quaternion.y,
        this.body.quaternion.z,
        this.body.quaternion.w
      );
      if (
        this.body.position.y < -5 ||
        Math.abs(this.body.position.x) > 20 ||
        Math.abs(this.body.position.z) > 20
      ) {
        this.scene.remove(this.mesh);
        this.world.removeBody(this.body);
      }
    }
  }

  getPosition() {
    return this.body ? this.body.position : new CANNON.Vec3(0, 0, 0);
  }

  getInitialPosition() {
    return this.initialPosition;
  }
}


