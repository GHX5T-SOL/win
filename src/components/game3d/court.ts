import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Court {
  private scene: THREE.Scene;
  private world: CANNON.World;

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.createCourt();
    this.createEnvironment();
    this.setupLighting();
  }

  private createCourt() {
    const courtGeometry = new THREE.PlaneGeometry(20, 12);
    const courtMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a3f, transparent: true, opacity: 0.9 });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    court.rotation.x = -Math.PI / 2;
    court.receiveShadow = true;
    this.scene.add(court);

    this.addCourtLines();
    this.addThreePointLine();
    this.addCracks();

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
    this.world.addBody(floorBody);
  }

  private addCourtLines() {
    const lineGeometry = new THREE.PlaneGeometry(0.1, 12);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xff4400 });

    [-9, 9].forEach((x) => {
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.01, 0);
      this.scene.add(line);
    });

    const endLineGeometry = new THREE.PlaneGeometry(18, 0.1);
    [-5.5, 5.5].forEach((z) => {
      const line = new THREE.Mesh(endLineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.01, z);
      this.scene.add(line);
    });
  }

  private addCracks() {
    for (let i = 0; i < 8; i++) {
      const crackGeometry = new THREE.PlaneGeometry(0.02, Math.random() * 3 + 1);
      const crackMaterial = new THREE.MeshBasicMaterial({ color: 0x2a2a2a, transparent: true, opacity: 0.6 });
      const crack = new THREE.Mesh(crackGeometry, crackMaterial);
      crack.rotation.x = -Math.PI / 2;
      crack.rotation.z = Math.random() * Math.PI;
      crack.position.set((Math.random() - 0.5) * 16, 0.005, (Math.random() - 0.5) * 10);
      this.scene.add(crack);
    }
  }

  private addThreePointLine() {
    const curve = new THREE.EllipseCurve(0, 4.5, 4.5, 4.5, Math.PI, 2 * Math.PI, false, 0);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff4400 });
    const threePointLine = new THREE.Line(geometry, material);
    threePointLine.rotation.x = -Math.PI / 2;
    threePointLine.position.set(0, 0.01, 0);
    this.scene.add(threePointLine);
  }

  private createEnvironment() {
    this.createWalls();
    this.createChainLinkFence();
    this.createCitySkyline();
    this.createTrashCans();
  }

  private createWalls() {
    const wallHeight = 4;
    const wallGeometry = new THREE.PlaneGeometry(20, wallHeight);
    const backWallMaterial = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const backWall = new THREE.Mesh(wallGeometry, backWallMaterial);
    backWall.position.set(0, wallHeight / 2, 6.5);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    this.addGraffiti(backWall);

    const sideWallGeometry = new THREE.PlaneGeometry(12, wallHeight);
    const sideWallMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 });
    [-10.5, 10.5].forEach((x) => {
      const wall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
      wall.position.set(x, wallHeight / 2, 0);
      wall.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2;
      wall.receiveShadow = true;
      this.scene.add(wall);
    });
  }

  private addGraffiti(_wall: THREE.Mesh) {
    const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff];
    for (let i = 0; i < 6; i++) {
      const graffitiGeometry = new THREE.PlaneGeometry(1 + Math.random(), 0.8 + Math.random());
      const graffitiMaterial = new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random() * colors.length)], transparent: true, opacity: 0.7 });
      const graffiti = new THREE.Mesh(graffitiGeometry, graffitiMaterial);
      graffiti.position.set((Math.random() - 0.5) * 15, 1 + Math.random() * 2, 6.51);
      this.scene.add(graffiti);
    }
  }

  private createChainLinkFence() {
    const fenceGeometry = new THREE.PlaneGeometry(20, 2);
    const fenceMaterial = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true, transparent: true, opacity: 0.5 });
    const fence = new THREE.Mesh(fenceGeometry, fenceMaterial);
    fence.position.set(0, 1, -6.5);
    this.scene.add(fence);
  }

  private createCitySkyline() {
    for (let i = 0; i < 12; i++) {
      const buildingHeight = 2 + Math.random() * 4;
      const buildingGeometry = new THREE.BoxGeometry(0.8 + Math.random(), buildingHeight, 0.5);
      const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set((Math.random() - 0.5) * 30, buildingHeight / 2, -15 - Math.random() * 5);
      this.scene.add(building);
    }
  }

  private createTrashCans() {
    for (let i = 0; i < 3; i++) {
      const canGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8);
      const canMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
      const can = new THREE.Mesh(canGeometry, canMaterial);
      can.position.set((Math.random() - 0.5) * 18, 0.4, (Math.random() - 0.5) * 10);
      can.castShadow = true;
      this.scene.add(can);
    }
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
    this.scene.add(ambientLight);
    this.createStreetlights();
    const mainLight = new THREE.DirectionalLight(0xffa500, 0.8);
    mainLight.position.set(0, 10, -3);
    mainLight.target.position.set(0, 0, 2);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);
    this.scene.add(mainLight.target);
  }

  private createStreetlights() {
    const positions: [number, number, number][] = [
      [-8, 8, -4],
      [8, 8, -4],
      [0, 8, 6],
    ];
    positions.forEach((pos) => {
      const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8);
      const postMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(pos[0], 4, pos[2]);
      post.castShadow = true;
      this.scene.add(post);

      const light = new THREE.SpotLight(0xffa500, 1, 20, Math.PI / 4, 0.5);
      light.position.set(pos[0], pos[1], pos[2]);
      light.target.position.set(pos[0], 0, pos[2] + 5);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      this.scene.add(light);
      this.scene.add(light.target);

      const fixtureGeometry = new THREE.SphereGeometry(0.3);
      const fixtureMaterial = new THREE.MeshBasicMaterial({ color: 0xffff88 });
      const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
      fixture.position.set(pos[0], pos[1], pos[2]);
      this.scene.add(fixture);
    });
  }
}


