import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Basketball } from "./basketball";

export class Hoop {
  private scene: THREE.Scene;
  private world: CANNON.World;
  private scored = false;
  private scoreZone: { center: CANNON.Vec3; radius: number; height: number } | null = null;

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.createHoop();
  }

  private createHoop() {
    const backboardGeometry = new THREE.PlaneGeometry(1.8, 1.2);
    const backboardMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
    backboard.position.set(0, 3.5, 4.5);
    backboard.receiveShadow = true;
    this.scene.add(backboard);

    const backboardShape = new CANNON.Plane();
    const backboardBody = new CANNON.Body({ mass: 0 });
    backboardBody.addShape(backboardShape);
    backboardBody.position.set(0, 3.5, 4.5);
    backboardBody.material = new CANNON.Material({ friction: 0.1, restitution: 0.8 });
    this.world.addBody(backboardBody);

    const rimGeometry = new THREE.TorusGeometry(0.23, 0.02, 8, 24);
    const rimMaterial = new THREE.MeshLambertMaterial({ color: 0xff4400 });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.set(0, 3.05, 4.2);
    rim.rotation.x = Math.PI / 2;
    rim.castShadow = true;
    this.scene.add(rim);

    const rimShape = new CANNON.Cylinder(0.23, 0.23, 0.05, 8);
    const rimBody = new CANNON.Body({ mass: 0 });
    rimBody.addShape(rimShape);
    rimBody.position.set(0, 3.05, 4.2);
    rimBody.material = new CANNON.Material({ friction: 0.3, restitution: 0.6 });
    this.world.addBody(rimBody);

    this.createNet();
    this.createScoreZone();

    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3.5);
    const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, 1.75, 4.8);
    pole.castShadow = true;
    this.scene.add(pole);
  }

  private createNet() {
    const netMaterial = new THREE.LineBasicMaterial({ color: 0xeeeeee });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x = Math.cos(angle) * 0.23;
      const z = Math.sin(angle) * 0.23;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 8; j++) {
        const y = -j * 0.08;
        const offset = j * 0.02;
        points.push(new THREE.Vector3(x + offset * Math.cos(angle), y, z + offset * Math.sin(angle)));
      }
      const netGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const netLine = new THREE.Line(netGeometry, netMaterial);
      netLine.position.set(0, 3.05, 4.2);
      this.scene.add(netLine);
    }
  }

  private createScoreZone() {
    this.scoreZone = { center: new CANNON.Vec3(0, 2.8, 4.2), radius: 0.25, height: 0.5 };
  }

  checkBasketballScore(basketball: Basketball) {
    if (!basketball || this.scored || !this.scoreZone) return false;
    const ballPos = basketball.getPosition();
    const zoneCenter = this.scoreZone.center;
    const dx = ballPos.x - zoneCenter.x;
    const dz = ballPos.z - zoneCenter.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const inRadius = distance < this.scoreZone.radius;
    const inHeight = ballPos.y < zoneCenter.y + this.scoreZone.height / 2 && ballPos.y > zoneCenter.y - this.scoreZone.height / 2;
    const movingDown = basketball.body && (basketball.body.velocity.y as number) < -2;
    if (inRadius && inHeight && movingDown && !this.scored) {
      this.scored = true;
      setTimeout(() => (this.scored = false), 2000);
      return true;
    }
    return false;
  }
}


