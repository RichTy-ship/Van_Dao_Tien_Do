/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CharacterId,
  CultivationStage,
} from '../game/xianxia/types';
import {
  createXianxiaRiggedCharacter,
} from '../game/xianxia/xianxiaRigs';
import { XianxiaAnimationController } from '../game/xianxia/animationController';
import { XianxiaVFXManager } from '../game/xianxia/xianxiaVFX';
import { HiddenCharacterData } from '../game/rules';

const WORLD_SCALE = 0.055; // Maps ~1200x1200 world coordinates into ~66x66 Three.js units

const CULTIVATION_STAGES: CultivationStage[] = [
  'Mortal',
  'Qi Refining',
  'Foundation Establishment',
  'Golden Core',
  'Nascent Soul',
  'Soul Formation',
  'Tribulation',
];

interface EnemyModelRecord {
  id: number;
  charId: CharacterId;
  group: THREE.Group;
  controller: XianxiaAnimationController;
  skinnedMesh: THREE.SkinnedMesh;
  currentClip: string;
}

interface Props {
  simRef: React.MutableRefObject<any>;
  charData: HiddenCharacterData;
  realmIndex: number;
  onOpenXianxiaStudio: () => void;
  onOpenGddCodex: () => void;
  onTriggerDestiny: () => void;
  onToggleRenderMode: () => void;
}

export const XianxiaWorld3D: React.FC<Props> = ({
  simRef,
  charData,
  realmIndex,
  onOpenXianxiaStudio,
  onOpenGddCodex,
  onToggleRenderMode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1322);
    scene.fog = new THREE.FogExp2(0x0a1322, 0.005);

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 250);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Xianxia Lighting Rig (Vibrant Celestial Palette)
    const ambientLight = new THREE.AmbientLight(0x64748b, 2.2);
    scene.add(ambientLight);

    const celestialSun = new THREE.DirectionalLight(0xfff6e0, 3.5);
    celestialSun.position.set(20, 35, 15);
    celestialSun.castShadow = true;
    celestialSun.shadow.mapSize.width = 2048;
    celestialSun.shadow.mapSize.height = 2048;
    celestialSun.shadow.camera.near = 0.5;
    celestialSun.shadow.camera.far = 120;
    const shadowD = 35;
    celestialSun.shadow.camera.left = -shadowD;
    celestialSun.shadow.camera.right = shadowD;
    celestialSun.shadow.camera.top = shadowD;
    celestialSun.shadow.camera.bottom = -shadowD;
    celestialSun.shadow.bias = -0.0003;
    scene.add(celestialSun);

    // Cyan/Turquoise Daoist rim light
    const rimLight = new THREE.DirectionalLight(0x00f5d4, 2.2);
    rimLight.position.set(-20, 16, -20);
    scene.add(rimLight);

    // Warm golden back fill
    const warmFill = new THREE.DirectionalLight(0xf59e0b, 1.2);
    warmFill.position.set(10, 12, -20);
    scene.add(warmFill);

    // Player point light for Dan Tian aura glow
    const playerAuraLight = new THREE.PointLight(0x38bdf8, 2.8, 16, 1.6);
    playerAuraLight.position.set(0, 2, 0);
    scene.add(playerAuraLight);

    // 3. Environment: Central Bagua Plaza & Bamboo Forest
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Large Mountain Island Ground
    const groundGeo = new THREE.CylinderGeometry(42, 44, 2.5, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141f30,
      roughness: 0.75,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.25;
    ground.receiveShadow = true;
    worldGroup.add(ground);

    // Inner Jade Stone Arena Floor (Circle)
    const arenaGeo = new THREE.CircleGeometry(28, 48);
    arenaGeo.rotateX(-Math.PI / 2);
    const arenaMat = new THREE.MeshStandardMaterial({
      color: 0x18253a,
      roughness: 0.65,
      metalness: 0.28,
    });
    const arena = new THREE.Mesh(arenaGeo, arenaMat);
    arena.position.y = 0.02;
    arena.receiveShadow = true;
    worldGroup.add(arena);

    // Daoist Grid Helper for isometric alignment
    const gridHelper = new THREE.GridHelper(56, 28, 0x00e5ff, 0x1e3a5f);
    gridHelper.position.y = 0.03;
    worldGroup.add(gridHelper);

    // Central Bagua Ring & Yin-Yang Concentric Circles
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc89d54,
      emissive: 0xc89d54,
      emissiveIntensity: 0.65,
      roughness: 0.35,
      metalness: 0.85,
    });
    const outerRingGeo = new THREE.RingGeometry(7.2, 7.6, 48);
    outerRingGeo.rotateX(-Math.PI / 2);
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    outerRing.position.y = 0.05;
    worldGroup.add(outerRing);

    const innerRingGeo = new THREE.RingGeometry(4.6, 4.9, 48);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.position.y = 0.05;
    worldGroup.add(innerRing);

    // 8 Bagua Trigram Pillars around outer perimeter
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 22;
      const pz = Math.sin(angle) * 22;

      const pGeo = new THREE.CylinderGeometry(0.55, 0.7, 5.5, 8);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x22334d,
        roughness: 0.65,
        metalness: 0.35,
      });
      const pillar = new THREE.Mesh(pGeo, pMat);
      pillar.position.set(px, 2.75, pz);
      pillar.castShadow = true;
      pillar.receiveShadow = true;

      const cGeo = new THREE.OctahedronGeometry(0.5, 0);
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 1.2,
      });
      const crystal = new THREE.Mesh(cGeo, cMat);
      crystal.position.y = 3.3;
      pillar.add(crystal);

      worldGroup.add(pillar);
    }

    // Outer Bamboo Grove
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const dist = 29 + (i % 3) * 3;
      const bx = Math.cos(angle) * dist;
      const bz = Math.sin(angle) * dist;
      const h = 8 + (i % 4) * 2.5;

      const bGeo = new THREE.CylinderGeometry(0.2, 0.28, h, 6);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x166534,
        roughness: 0.75,
        metalness: 0.15,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(bx, h * 0.5, bz);
      bMesh.castShadow = true;
      worldGroup.add(bMesh);
    }

    // 4. Player Character Rig & Animation Controller
    const playerCharId: CharacterId =
      (charData.numericSeed ?? 0) % 2 === 0 ? 'player_male' : 'player_female';
    const currentStage = CULTIVATION_STAGES[realmIndex] || 'Mortal';
    const playerRig = createXianxiaRiggedCharacter(playerCharId, currentStage);
    scene.add(playerRig.group);

    const playerController = new XianxiaAnimationController({
      characterId: playerCharId,
      boneMap: playerRig.boneMap,
    });

    const playerVfx = new XianxiaVFXManager(scene, camera);
    const auraGroup = playerVfx.createCultivationAura(currentStage);
    scene.add(auraGroup);

    // Floating Natal Spirit Sword beside cultivator
    const spiritSwordGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.09, 1.5, 0.025);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      metalness: 0.95,
      roughness: 0.1,
    });
    const spiritBlade = new THREE.Mesh(bladeGeo, bladeMat);
    spiritBlade.castShadow = true;
    spiritSwordGroup.add(spiritBlade);
    scene.add(spiritSwordGroup);

    // 5. Enemy 3D Models Map
    const enemyModels = new Map<number, EnemyModelRecord>();

    const getEnemyCharId = (archetype: string): CharacterId => {
      switch (archetype) {
        case 'boss':
          return 'boss_demon_lord';
        case 'charger':
          return 'mon_white_tiger';
        case 'shielded':
          return 'boss_stone_guardian';
        case 'kiter':
          return 'mon_nine_tailed_fox';
        default:
          return 'mon_demon_boar';
      }
    };

    // 6. Landmark 3D NPC / Monuments Map
    const landmarkMeshes = new Map<string, THREE.Group>();
    const landmarks = simRef.current?.landmarks || [];
    for (const lm of landmarks) {
      const lmGroup = new THREE.Group();
      lmGroup.position.set(lm.wx * WORLD_SCALE, 0, lm.wy * WORLD_SCALE);

      if (lm.type === 'npc') {
        const elderRig = createXianxiaRiggedCharacter('npc_sect_elder', 'Soul Formation');
        elderRig.group.scale.set(1.0, 1.0, 1.0);
        const elderCtrl = new XianxiaAnimationController({
          characterId: 'npc_sect_elder',
          boneMap: elderRig.boneMap,
        });
        elderCtrl.playClip('Idle_Beard_Stroke', 0.3);
        lmGroup.add(elderRig.group);
        (lmGroup as any).__controller = elderCtrl;
      } else {
        const sGeo = new THREE.BoxGeometry(1.4, 4.2, 0.5);
        const sMat = new THREE.MeshStandardMaterial({
          color: 0x22334d,
          roughness: 0.65,
          metalness: 0.35,
        });
        const stele = new THREE.Mesh(sGeo, sMat);
        stele.position.y = 2.1;
        stele.castShadow = true;
        lmGroup.add(stele);

        const gGeo = new THREE.OctahedronGeometry(0.45);
        const gMat = new THREE.MeshStandardMaterial({
          color: lm.color || 0xc89d54,
          emissive: lm.color || 0xc89d54,
          emissiveIntensity: 1.1,
        });
        const gem = new THREE.Mesh(gGeo, gMat);
        gem.position.y = 4.6;
        lmGroup.add(gem);
      }
      scene.add(lmGroup);
      landmarkMeshes.set(lm.id, lmGroup);
    }

    // 7. Pickups (Qi Crystals & Herbs) 3D Group
    const pickupMeshes = new Map<number, THREE.Group>();

    // 8. Tribulation Thunder Arcs Group
    const thunderGroup = new THREE.Group();
    scene.add(thunderGroup);

    // 9. Ground Click & Mouse Tracking Plane for Raycasting
    const raycastPlaneGeo = new THREE.PlaneGeometry(300, 300);
    raycastPlaneGeo.rotateX(-Math.PI / 2);
    const raycastPlaneMat = new THREE.MeshBasicMaterial({ visible: false });
    const raycastPlane = new THREE.Mesh(raycastPlaneGeo, raycastPlaneMat);
    scene.add(raycastPlane);

    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();

    const updateMouseWorld = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNdc, camera);
      const intersects = raycaster.intersectObject(raycastPlane);
      if (intersects.length > 0) {
        const hit = intersects[0].point;
        if (simRef.current) {
          simRef.current.mouseWorld = {
            wx: hit.x / WORLD_SCALE,
            wy: hit.z / WORLD_SCALE,
          };
        }
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      updateMouseWorld(e.clientX, e.clientY);
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button === 0) {
        if (simRef.current) simRef.current.mouseDown = true;
        updateMouseWorld(e.clientX, e.clientY);
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      if (e.button === 0) {
        if (simRef.current) simRef.current.mouseDown = false;
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    // 10. Resize Observer
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // 11. Main 60FPS Game Loop
    let lastTime = performance.now();
    let animFrameId = 0;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const sim = simRef.current;
      if (!sim) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      const p = sim.player || {};
      const px = (p.wx ?? 0) * WORLD_SCALE;
      const pz = (p.wy ?? 0) * WORLD_SCALE;
      const py = (p.wz ?? 0) * WORLD_SCALE;

      // Update Player Position and Smooth Facing
      playerRig.group.position.set(px, py, pz);
      auraGroup.position.set(px, py + 1.2, pz);

      const targetRotY = -(p.facingAngle ?? 0) + Math.PI / 2;
      playerRig.group.rotation.y = THREE.MathUtils.lerp(
        playerRig.group.rotation.y,
        targetRotY,
        0.25
      );

      // Determine Locomotion & State
      const speed = Math.hypot(p.vx ?? 0, p.vy ?? 0);
      const isMoving = speed > 10;
      const normSpeed = Math.min(speed / 180, 1.0);

      // Animation State Machine updates
      if ((p.attackAnimTimer ?? 0) > 0) {
        const comboClip =
          p.comboStep === 1
            ? 'Sword_Attack_01'
            : p.comboStep === 2
            ? 'Sword_Attack_02'
            : p.comboStep === 3
            ? 'Sword_Attack_03'
            : 'Sword_Combo_Finisher';
        playerController.locomotionSpeed = 0;
        playerController.playClip(comboClip, 0.1);
      } else if ((p.dashTimer ?? 0) > 0) {
        playerController.playClip('Dash', 0.1);
      } else if (p.meditating) {
        playerController.playClip('Cultivation_Idle', 0.25);
      } else if ((p.hitFlash ?? 0) > 0) {
        playerController.playClip('Take_Hit_Front', 0.1);
      } else {
        playerController.locomotionSpeed = isMoving ? normSpeed : 0;
      }

      playerController.update(dt);
      playerVfx.update(dt);

      // Update floating Natal Spirit Sword
      const swordOrbitAngle = now * 0.0035;
      const swordRadius = 1.4 + Math.sin(now * 0.002) * 0.2;
      spiritSwordGroup.position.set(
        px + Math.cos(swordOrbitAngle) * swordRadius,
        py + 1.2 + Math.sin(swordOrbitAngle * 2) * 0.25,
        pz + Math.sin(swordOrbitAngle) * swordRadius
      );
      spiritSwordGroup.rotation.y = swordOrbitAngle + Math.PI / 2;
      spiritSwordGroup.rotation.z = Math.sin(now * 0.004) * 0.3;

      // Update Player Aura Light color according to Realm / Root
      playerAuraLight.position.set(px, py + 1.5, pz);
      if (sim.charData?.spiritualRoot?.auraColor) {
        playerAuraLight.color.set(sim.charData.spiritualRoot.auraColor);
      }

      // ----------------------------------------------------
      // Update Enemies 3D Skinned Models
      // ----------------------------------------------------
      const activeEnemyIds = new Set<number>();
      for (const e of sim.enemies || []) {
        activeEnemyIds.add(e.id);
        let rec = enemyModels.get(e.id);

        if (!rec) {
          const charId = getEnemyCharId(e.archetype);
          const enemyRig = createXianxiaRiggedCharacter(charId, 'Foundation Establishment');
          const scale = e.archetype === 'boss' ? 1.7 : e.archetype === 'shielded' ? 1.3 : 1.1;
          enemyRig.group.scale.set(scale, scale, scale);
          scene.add(enemyRig.group);

          const ctrl = new XianxiaAnimationController({
            characterId: charId,
            boneMap: enemyRig.boneMap,
          });

          rec = {
            id: e.id,
            charId,
            group: enemyRig.group,
            controller: ctrl,
            skinnedMesh: enemyRig.skinnedMesh,
            currentClip: 'Idle',
          };
          enemyModels.set(e.id, rec);
        }

        const ex = (e.wx ?? 0) * WORLD_SCALE;
        const ez = (e.wy ?? 0) * WORLD_SCALE;
        rec.group.position.set(ex, 0, ez);
        rec.group.rotation.y = -(e.facing ?? 0) + Math.PI / 2;

        let targetClip = 'Idle';
        if (e.aiState === 'ko') {
          targetClip = 'Death';
        } else if (e.aiState === 'windup' || e.aiState === 'attack') {
          if (e.archetype === 'boss') targetClip = 'Ground_Slam';
          else if (e.archetype === 'charger') targetClip = 'Fox_Pounce';
          else if (e.archetype === 'kiter') targetClip = 'Fox_Claw_Attack';
          else targetClip = 'Sword_Attack_01';
        } else if (e.aiState === 'chase' || Math.hypot(e.vx ?? 0, e.vy ?? 0) > 15) {
          targetClip = 'Run';
          rec.controller.locomotionSpeed = 0.8;
        } else {
          rec.controller.locomotionSpeed = 0;
        }

        if (rec.currentClip !== targetClip) {
          rec.currentClip = targetClip;
          rec.controller.playClip(targetClip, 0.2);
        }

        const mat = rec.skinnedMesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          if (e.hitFlash > 0) {
            mat.emissive.set(0xffffff);
            mat.emissiveIntensity = 0.9;
          } else {
            mat.emissive.set(e.color || 0xef4444);
            mat.emissiveIntensity = 0.2;
          }
        }

        rec.controller.update(dt);
      }

      // Cleanup despawned enemies
      for (const [id, rec] of enemyModels.entries()) {
        if (!activeEnemyIds.has(id)) {
          scene.remove(rec.group);
          enemyModels.delete(id);
        }
      }

      // ----------------------------------------------------
      // Update Landmark NPC animations
      // ----------------------------------------------------
      for (const lmGroup of landmarkMeshes.values()) {
        const ctrl = (lmGroup as any).__controller;
        if (ctrl) ctrl.update(dt);
      }

      // ----------------------------------------------------
      // Update Pickups (Qi Crystals & Spirit Herbs)
      // ----------------------------------------------------
      const activePickupIds = new Set<number>();
      for (const node of sim.pickups || []) {
        if (!node.active) continue;
        activePickupIds.add(node.id);

        let pGroup = pickupMeshes.get(node.id);
        if (!pGroup) {
          pGroup = new THREE.Group();
          const pMat = new THREE.MeshStandardMaterial({
            color: node.type === 'qi_crystal' ? 0x22d3ee : 0x34d399,
            emissive: node.type === 'qi_crystal' ? 0x22d3ee : 0x34d399,
            emissiveIntensity: 0.85,
            roughness: 0.2,
            metalness: 0.9,
          });
          const geo =
            node.type === 'qi_crystal'
              ? new THREE.OctahedronGeometry(0.38, 0)
              : new THREE.DodecahedronGeometry(0.35, 0);
          const mesh = new THREE.Mesh(geo, pMat);
          mesh.castShadow = true;
          pGroup.add(mesh);
          scene.add(pGroup);
          pickupMeshes.set(node.id, pGroup);
        }

        const bob = Math.sin(node.bobPhase) * 0.15 + 0.6;
        pGroup.position.set((node.wx ?? 0) * WORLD_SCALE, bob, (node.wy ?? 0) * WORLD_SCALE);
        pGroup.rotation.y += dt * 2.0;
        pGroup.rotation.x = Math.sin(now * 0.003) * 0.2;
      }

      for (const [id, pMesh] of pickupMeshes.entries()) {
        if (!activePickupIds.has(id)) {
          scene.remove(pMesh);
          pickupMeshes.delete(id);
        }
      }

      // ----------------------------------------------------
      // Update Heavenly Tribulation Lightning Strikes
      // ----------------------------------------------------
      thunderGroup.clear();
      for (const st of sim.tribulation?.strikes || []) {
        if (!st.active || !st.struck) continue;
        const tx = (st.wx ?? 0) * WORLD_SCALE;
        const tz = (st.wy ?? 0) * WORLD_SCALE;

        const boltGeo = new THREE.CylinderGeometry(0.15, 0.5, 18, 6);
        const boltMat = new THREE.MeshBasicMaterial({ color: 0xf5d0fe });
        const bolt = new THREE.Mesh(boltGeo, boltMat);
        bolt.position.set(tx, 9, tz);
        thunderGroup.add(bolt);

        const ringGeo = new THREE.RingGeometry(0.5, (st.radius ?? 50) * WORLD_SCALE, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xd946ef,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const shockRing = new THREE.Mesh(ringGeo, ringMat);
        shockRing.position.set(tx, 0.05, tz);
        thunderGroup.add(shockRing);
      }

      // ----------------------------------------------------
      // Smooth Camera Tracking with Isometric Angle & Trauma Shake
      // ----------------------------------------------------
      const shakeMag = (sim.cameraShake ?? 0) * (sim.cameraShake ?? 0) * 0.5;
      const shakeX = (Math.random() - 0.5) * shakeMag;
      const shakeY = (Math.random() - 0.5) * shakeMag;
      const shakeZ = (Math.random() - 0.5) * shakeMag;

      const camDist = 14;
      const camTargetX = px + camDist + shakeX;
      const camTargetY = 14 + shakeY;
      const camTargetZ = pz + camDist + shakeZ;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX, 0.14);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, camTargetY, 0.14);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, camTargetZ, 0.14);
      camera.lookAt(px, 1.2, pz);

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [charData.numericSeed, realmIndex]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Top Floating 3D Control Ribbon */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={onOpenXianxiaStudio}
          className="px-3.5 py-1.5 text-xs font-bold bg-[#0f172a]/90 hover:bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/60 rounded-md shadow-[0_0_15px_rgba(56,189,248,0.35)] backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>🏮</span> Xưởng 3D (23 Nhân Vật)
        </button>

        <button
          type="button"
          onClick={onOpenGddCodex}
          className="px-3 py-1.5 text-xs font-semibold bg-[#0f172a]/90 hover:bg-[#1e293b] text-[#f2d08b] border border-[#c89d54]/50 rounded-md backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>📜</span> GDD [G]
        </button>

        <button
          type="button"
          onClick={onToggleRenderMode}
          className="px-3 py-1.5 text-xs font-semibold bg-[#0f172a]/90 hover:bg-[#1e293b] text-[#a7f3d0] border border-[#10b981]/60 rounded-md backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>🎥</span> Chuyển 2D / 3D
        </button>
      </div>

      {/* Floating 3D Interaction Prompt at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-[#090d14]/85 border border-[#334155]/60 rounded-full text-[11px] font-mono text-[#94a3b8] backdrop-blur-md pointer-events-none flex items-center gap-3">
        <span>🎮 <strong className="text-[#38bdf8]">3D Engine:</strong> Đang hoạt động</span>
        <span>·</span>
        <span>Chuột Trái / J: Kiếm Kích</span>
        <span>·</span>
        <span>Space: Thân Pháp</span>
        <span>·</span>
        <span>K/L/U/I: Pháp Thuật</span>
        <span>·</span>
        <span>H: Thổ Nạp</span>
      </div>
    </div>
  );
};
