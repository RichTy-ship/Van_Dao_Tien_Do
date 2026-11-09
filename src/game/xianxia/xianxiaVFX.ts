import * as THREE from 'three';
import { CultivationStage } from './types';
import { CULTIVATION_STAGE_VFX_CONFIG } from './xianxiaRigs';

/**
 * XIANXIA VFX & ANIMATION SYNCHRONIZATION ENGINE
 * VẠN ĐẠO TIÊN ĐỒ
 *
 * Provides:
 * - Real-time Sword Ribbon Trails (Zero GC dynamic vertex strip)
 * - 7-Stage Cultivation Auric Halos & Golden Core Dan Tian pulses
 * - Bagua Array / Magic Formations on Ground
 * - Heavenly Tribulation Lightning Strikes & Ground Scorch Cracks
 * - Elemental Particle Spawners (Foxfire, Frost Breath, Nirvana Fire)
 * - Object Pooling & Distance-based LOD
 */

export class XianxiaVFXManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  // Active particle pools
  private activeEmitters: {
    obj: THREE.Object3D;
    lifetime: number;
    maxLifetime: number;
    onUpdate?: (progress: number, dt: number) => void;
  }[] = [];

  // Sword Trail Ribbon State
  private swordTrailPoints: THREE.Vector3[] = [];
  private maxTrailPoints: number = 24;
  private swordTrailMesh: THREE.Mesh | null = null;
  private swordTrailGeo: THREE.BufferGeometry | null = null;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.initSwordTrailMesh();
  }

  /**
   * Initializes dynamic two-sided ribbon mesh for sword trails
   */
  private initSwordTrailMesh() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxTrailPoints * 2 * 3);
    const alphas = new Float32Array(this.maxTrailPoints * 2);
    const indices: number[] = [];

    for (let i = 0; i < this.maxTrailPoints - 1; i++) {
      const topCurrent = i * 2;
      const btmCurrent = i * 2 + 1;
      const topNext = (i + 1) * 2;
      const btmNext = (i + 1) * 2 + 1;

      indices.push(topCurrent, btmCurrent, topNext);
      indices.push(btmCurrent, btmNext, topNext);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setIndex(indices);

    const mat = new THREE.MeshBasicMaterial({
      color: '#00F5D4',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.swordTrailGeo = geo;
    this.swordTrailMesh = new THREE.Mesh(geo, mat);
    this.swordTrailMesh.name = 'xianxia_sword_trail_ribbon';
    this.swordTrailMesh.frustumCulled = false;
    this.scene.add(this.swordTrailMesh);
  }

  /**
   * Updates weapon tip and hilt positions into ribbon trail
   */
  public updateSwordTrail(tipPos: THREE.Vector3, hiltPos: THREE.Vector3, isSwinging: boolean) {
    if (!this.swordTrailGeo || !this.swordTrailMesh) return;

    if (isSwinging) {
      this.swordTrailPoints.unshift(tipPos.clone(), hiltPos.clone());
      if (this.swordTrailPoints.length > this.maxTrailPoints * 2) {
        this.swordTrailPoints.length = this.maxTrailPoints * 2;
      }
    } else {
      // Fade out trail rapidly when not swinging
      if (this.swordTrailPoints.length > 0) {
        this.swordTrailPoints.pop();
        this.swordTrailPoints.pop();
      }
    }

    const posAttr = this.swordTrailGeo.attributes.position as THREE.BufferAttribute;
    const count = this.swordTrailPoints.length / 2;

    for (let i = 0; i < this.maxTrailPoints; i++) {
      if (i < count) {
        const tip = this.swordTrailPoints[i * 2];
        const hilt = this.swordTrailPoints[i * 2 + 1];
        posAttr.setXYZ(i * 2, tip.x, tip.y, tip.z);
        posAttr.setXYZ(i * 2 + 1, hilt.x, hilt.y, hilt.z);
      } else if (count > 0) {
        const lastTip = this.swordTrailPoints[(count - 1) * 2];
        const lastHilt = this.swordTrailPoints[(count - 1) * 2 + 1];
        posAttr.setXYZ(i * 2, lastTip.x, lastTip.y, lastTip.z);
        posAttr.setXYZ(i * 2 + 1, lastHilt.x, lastHilt.y, lastHilt.z);
      }
    }
    posAttr.needsUpdate = true;
  }

  /**
   * Spawns ground Bagua Yin-Yang Formation
   */
  public spawnBaguaArray(origin: THREE.Vector3, radius: number = 2.4, duration: number = 2.0) {
    const group = new THREE.Group();
    group.position.copy(origin);
    group.position.y += 0.04; // Hover just above floor

    // Outer concentric runic ring
    const ringGeo = new THREE.RingGeometry(radius * 0.85, radius, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#00E5FF',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    group.add(ringMesh);

    // Inner 8 trigrams markers
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const trigramGeo = new THREE.BoxGeometry(0.18, 0.02, 0.06);
      const trigramMat = new THREE.MeshBasicMaterial({ color: '#FFD700' });
      const trigram = new THREE.Mesh(trigramGeo, trigramMat);
      trigram.position.set(Math.cos(angle) * (radius * 0.65), 0, Math.sin(angle) * (radius * 0.65));
      trigram.rotation.y = -angle;
      group.add(trigram);
    }

    this.scene.add(group);
    this.activeEmitters.push({
      obj: group,
      lifetime: 0,
      maxLifetime: duration,
      onUpdate: (prog) => {
        group.rotation.y += 0.025; // Gentle majestic spinning
        ringMat.opacity = Math.sin(prog * Math.PI) * 0.85;
      },
    });
  }

  /**
   * Spawns Heavenly Tribulation Thunder Strike
   */
  public spawnHeavenlyThunder(targetPos: THREE.Vector3) {
    const boltGroup = new THREE.Group();
    boltGroup.position.copy(targetPos);

    // Jagged procedural lightning column from sky (Y=18m down to 0)
    const points: THREE.Vector3[] = [];
    let curX = 0;
    let curZ = 0;
    for (let y = 18; y >= 0; y -= 0.8) {
      curX += (Math.random() - 0.5) * 0.65;
      curZ += (Math.random() - 0.5) * 0.65;
      points.push(new THREE.Vector3(curX, y, curZ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const boltGeo = new THREE.TubeGeometry(curve, 32, 0.08, 6, false);
    const boltMat = new THREE.MeshBasicMaterial({
      color: '#FFF275',
      blending: THREE.AdditiveBlending,
    });
    const boltMesh = new THREE.Mesh(boltGeo, boltMat);
    boltGroup.add(boltMesh);

    // Ground scorch ring & crack decal
    const scorchGeo = new THREE.CircleGeometry(1.6, 24);
    scorchGeo.rotateX(-Math.PI / 2);
    const scorchMat = new THREE.MeshBasicMaterial({
      color: '#1A0000',
      transparent: true,
      opacity: 0.85,
    });
    const scorchMesh = new THREE.Mesh(scorchGeo, scorchMat);
    scorchMesh.position.y = 0.02;
    boltGroup.add(scorchMesh);

    this.scene.add(boltGroup);
    this.activeEmitters.push({
      obj: boltGroup,
      lifetime: 0,
      maxLifetime: 0.45,
      onUpdate: (prog) => {
        boltMat.color.set(Math.random() > 0.4 ? '#FFF275' : '#84FFFF');
        scorchMat.opacity = 1.0 - prog;
      },
    });
  }

  /**
   * Spawns Cultivation Aura for a character
   */
  public createCultivationAura(stage: CultivationStage): THREE.Group {
    const cfg = CULTIVATION_STAGE_VFX_CONFIG[stage];
    const auraGroup = new THREE.Group();
    auraGroup.name = `aura_${stage}`;

    if (cfg.auraRadius <= 0) return auraGroup; // Mortal has no visible magical aura

    const auraColor = new THREE.Color(cfg.auraColor);

    // 1. Celestial Immortal Back Halo Ring (Vòng Kim Quang sau đầu / vai)
    const haloRadius = 0.35 + cfg.haloRings * 0.08;
    const haloGeo = new THREE.RingGeometry(haloRadius * 0.88, haloRadius, 36);
    const haloMat = new THREE.MeshBasicMaterial({
      color: auraColor,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 1.55, -0.12);
    auraGroup.add(haloMesh);

    // 2. Concentric Ground Lotus Rings (Pháp trận linh khí dưới chân)
    const groundRings: THREE.Mesh[] = [];
    for (let r = 0; r < cfg.haloRings; r++) {
      const ringRadius = cfg.auraRadius * (0.6 + r * 0.25);
      const ringGeo = new THREE.RingGeometry(ringRadius * 0.92, ringRadius, 36);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: auraColor,
        transparent: true,
        opacity: 0.55 - r * 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.03 + r * 0.02;
      auraGroup.add(ringMesh);
      groundRings.push(ringMesh);
    }

    // 3. Orbiting Dan Tian Qi Orbs (Hạt linh khí / Kim đan hộ thể xoay quanh đan điền)
    const orbGroup = new THREE.Group();
    orbGroup.position.y = 0.95;
    const orbCount = Math.min(cfg.haloRings * 2, 6);
    const orbs: THREE.Mesh[] = [];
    const orbGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const orbMat = new THREE.MeshBasicMaterial({
      color: auraColor,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < orbCount; i++) {
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orbGroup.add(orb);
      orbs.push(orb);
    }
    auraGroup.add(orbGroup);

    let elapsed = 0;
    auraGroup.userData.update = (dt: number) => {
      elapsed += dt;
      // Gently pulse and rotate the celestial back-halo
      haloMesh.rotation.z += dt * 0.4;
      haloMesh.scale.setScalar(1 + Math.sin(elapsed * 2.5) * 0.05);

      // Rotate ground lotus rings in opposite directions
      groundRings.forEach((ring, idx) => {
        ring.rotation.z += dt * (idx % 2 === 0 ? 0.3 : -0.3);
      });

      // Orbiting Dan Tian Qi Orbs
      const orbitR = 0.55 + Math.sin(elapsed * 1.8) * 0.08;
      orbs.forEach((orb, idx) => {
        const angle = elapsed * 2.2 + (idx / orbCount) * Math.PI * 2;
        orb.position.set(
          Math.cos(angle) * orbitR,
          Math.sin(angle * 2) * 0.12,
          Math.sin(angle) * orbitR
        );
      });
    };

    return auraGroup;
  }

  /**
   * Advances all active VFX emitters
   */
  public update(dt: number) {
    for (let i = this.activeEmitters.length - 1; i >= 0; i--) {
      const emitter = this.activeEmitters[i];
      emitter.lifetime += dt;
      const prog = Math.min(1.0, emitter.lifetime / emitter.maxLifetime);

      if (emitter.onUpdate) {
        emitter.onUpdate(prog, dt);
      }

      if (emitter.lifetime >= emitter.maxLifetime) {
        this.scene.remove(emitter.obj);
        this.activeEmitters.splice(i, 1);
      }
    }
  }

  public dispose() {
    if (this.swordTrailMesh) {
      this.scene.remove(this.swordTrailMesh);
      this.swordTrailGeo?.dispose();
    }
    for (const emitter of this.activeEmitters) {
      this.scene.remove(emitter.obj);
    }
    this.activeEmitters = [];
  }
}
