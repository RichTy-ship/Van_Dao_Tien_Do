/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { CharacterId, CultivationStage } from './types';
import { CULTIVATION_STAGE_VFX_CONFIG, createXianxiaRiggedCharacter } from './xianxiaRigs';
import { XianxiaAnimationController } from './animationController';

export interface XianxiaModelInstance {
  characterId: CharacterId;
  cultivationStage: CultivationStage;
  group: THREE.Group;
  mixer: THREE.AnimationMixer;
  actions: Map<string, THREE.AnimationAction>;
  activeAction: THREE.AnimationAction | null;
  activeClipName: string;
  boneMap: Map<string, THREE.Bone>;
  socketAnchors: Map<string, THREE.Object3D>;
  update: (dt: number) => void;
  playClip: (clipName: string, crossFadeDuration?: number) => void;
  setCultivationStage: (stage: CultivationStage) => void;
}

// Map character IDs to real GLB model assets
const MODEL_ASSET_URLS: Record<string, string> = {
  // Players
  player_male: '/models/player_male.glb',
  player_female: '/models/player_female.glb',

  // NPCs
  npc_sect_elder: '/models/npc_elder.glb',
  npc_hidden_immortal: '/models/npc_elder.glb',
  npc_master: '/models/npc_elder.glb',
  npc_healer: '/models/player_female.glb',
  npc_alchemist: '/models/npc_mage.glb',
  npc_qi_cultivator: '/models/npc_swordsman.glb',
  npc_root_inspector: '/models/npc_elder.glb',

  // Monsters & Bosses
  mon_wood_spirit: '/models/mon_wood_spirit.glb',
  mon_white_tiger: '/models/mon_beast.glb',
  mon_demon_boar: '/models/mon_beast.glb',
  mon_nine_tailed_fox: '/models/mon_beast.glb',
  boss_demon_lord: '/models/boss_demon_lord.glb',
  boss_stone_guardian: '/models/mon_wood_spirit.glb',
  boss_celestial_immortal: '/models/npc_elder.glb',
  boss_ice_dragon: '/models/boss_demon_lord.glb',

  // Mounts & Misc
  mount_spirit_deer: '/models/mon_beast.glb',
  mount_immortal_crane: '/models/player_female.glb',
  mount_void_whale: '/models/boss_demon_lord.glb',
  mount_flying_sword: '/models/player_male.glb',

  // Props
  landmark_tower: '/models/landmark_tower.glb',
  landmark_tree: '/models/landmark_tree.glb',
  flying_sword: '/models/flying_sword.glb',
};

const loader = new GLTFLoader();
const gltfCache = new Map<string, GLTF>();
const loadingPromises = new Map<string, Promise<GLTF>>();

/**
 * Preloads or retrieves a cached GLTF asset
 */
export async function loadGltfAsset(url: string): Promise<GLTF> {
  const cached = gltfCache.get(url);
  if (cached) return cached;

  let promise = loadingPromises.get(url);
  if (!promise) {
    promise = new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          gltfCache.set(url, gltf);
          loadingPromises.delete(url);
          resolve(gltf);
        },
        undefined,
        (err) => {
          loadingPromises.delete(url);
          reject(err);
        }
      );
    });
    loadingPromises.set(url, promise);
  }
  return promise;
}

/**
 * Creates a fully rigged, textured, and animated 3D Xianxia model instance from real GLB assets
 */
export async function createRealXianxiaModel(
  characterId: CharacterId,
  stage: CultivationStage = 'Foundation Establishment'
): Promise<XianxiaModelInstance> {
  const isHumanoid =
    characterId.startsWith('player') ||
    characterId.startsWith('npc') ||
    characterId === 'boss_celestial_immortal';

  if (isHumanoid) {
    // 100% Authentic Asian Xianxia Cultivator Model (Hanfu robes, hair bun, jade hairpin, billowing sleeves)
    const rig = createXianxiaRiggedCharacter(characterId, stage);
    const controller = new XianxiaAnimationController({
      characterId,
      boneMap: rig.boneMap,
    });
    controller.setCultivationStage(stage);

    return {
      characterId,
      cultivationStage: stage,
      group: rig.group,
      mixer: null as any,
      actions: new Map(),
      activeAction: null,
      activeClipName: 'Idle',
      boneMap: rig.boneMap,
      socketAnchors: rig.socketAnchors,
      update: (dt: number) => {
        controller.update(dt);
      },
      playClip: (clipName: string, crossFadeDuration: number = 0.22) => {
        controller.playClip(clipName, crossFadeDuration);
      },
      setCultivationStage: (newStage: CultivationStage) => {
        controller.setCultivationStage(newStage);
      },
    };
  }

  const url = MODEL_ASSET_URLS[characterId] || MODEL_ASSET_URLS.mon_beast;
  const gltf = await loadGltfAsset(url);

  // Clone scene with SkeletonUtils to ensure unique bones & weights
  const clonedScene = SkeletonUtils.clone(gltf.scene) as THREE.Group;
  clonedScene.name = `char_${characterId}`;

  // Normalize scale and grounded pivot
  const bbox = new THREE.Box3().setFromObject(clonedScene);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());

  // Target standard character height ~1.8m
  const isBoss = characterId.startsWith('boss');
  const targetHeight = isBoss ? 2.8 : 1.85;
  if (size.y > 0) {
    const scale = targetHeight / size.y;
    clonedScene.scale.set(scale, scale, scale);
  }

  // Adjust bottom pivot to ground level (y = 0)
  const updatedBbox = new THREE.Box3().setFromObject(clonedScene);
  clonedScene.position.y -= updatedBbox.min.y;

  // Root container group
  const group = new THREE.Group();
  group.name = `container_${characterId}`;
  group.add(clonedScene);

  // Index bones and configure materials
  const boneMap = new Map<string, THREE.Bone>();
  const socketAnchors = new Map<string, THREE.Object3D>();

  clonedScene.traverse((child) => {
    if ((child as THREE.Bone).isBone) {
      boneMap.set(child.name, child as THREE.Bone);
      // Normalized bone lookup
      const lower = child.name.toLowerCase();
      if (!boneMap.has('RightHand') && (lower.includes('righthand') || lower === 'r_hand' || lower === 'hand.r')) {
        boneMap.set('RightHand', child as THREE.Bone);
      }
      if (!boneMap.has('LeftHand') && (lower.includes('lefthand') || lower === 'l_hand' || lower === 'hand.l')) {
        boneMap.set('LeftHand', child as THREE.Bone);
      }
      if (!boneMap.has('Head') && lower.includes('head')) {
        boneMap.set('Head', child as THREE.Bone);
      }
      if (!boneMap.has('Hips') && (lower.includes('hips') || lower.includes('pelvis') || lower === 'root')) {
        boneMap.set('Hips', child as THREE.Bone);
      }
    }

    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.roughness = Math.max(0.2, m.roughness ?? 0.5);
            m.metalness = Math.min(0.9, m.metalness ?? 0.2);
            m.envMapIntensity = 1.2;
          }
        }
      }
    }
  });

  // Setup sockets
  const rightHand = boneMap.get('RightHand');
  if (rightHand) {
    const rSocket = new THREE.Object3D();
    rSocket.name = 'socket_RightHandSocket';
    rightHand.add(rSocket);
    socketAnchors.set('RightHandSocket', rSocket);
  }

  const hips = boneMap.get('Hips') || clonedScene;
  const danTianSocket = new THREE.Object3D();
  danTianSocket.name = 'socket_DanTianSocket';
  danTianSocket.position.set(0, 0.9, 0.1);
  group.add(danTianSocket);
  socketAnchors.set('DanTianSocket', danTianSocket);

  // Setup Three.js AnimationMixer with GLTF clips
  const mixer = new THREE.AnimationMixer(clonedScene);
  const actions = new Map<string, THREE.AnimationAction>();

  for (const clip of gltf.animations) {
    const action = mixer.clipAction(clip);
    actions.set(clip.name, action);

    // Map common Xianxia action aliases
    const name = clip.name;
    if (name.includes('Idle') || name.includes('Standing')) {
      actions.set('Idle', action);
      actions.set('Standing', action);
    }
    if (name.includes('Walk') || name.includes('RelaxedWalk')) {
      actions.set('Walk', action);
    }
    if (name.includes('Sprint') || name.includes('Run')) {
      actions.set('Run', action);
      actions.set('Sprint', action);
    }
    if (name.includes('CounterAttack') || name.includes('Attack')) {
      actions.set('Sword_Attack_01', action);
      actions.set('Attack', action);
    }
    if (name.includes('Finisher')) {
      actions.set('Sword_Combo_Finisher', action);
      actions.set('Sword_Attack_02', action);
      actions.set('Sword_Attack_03', action);
    }
    if (name.includes('Spell') || name.includes('Chant')) {
      actions.set('Cultivation_Idle', action);
      actions.set('Spell_Cast', action);
      actions.set('Meditation', action);
    }
    if (name.includes('Death')) {
      actions.set('Death', action);
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

  // Fallback defaults if specific clips aren't present
  const defaultIdle = actions.get('Idle') || actions.values().next().value;
  let activeAction: THREE.AnimationAction | null = null;
  let activeClipName = 'Idle';

  if (defaultIdle) {
    defaultIdle.play();
    activeAction = defaultIdle;
  }

  // Cross-fade animation player
  const playClip = (clipName: string, crossFadeDuration: number = 0.22) => {
    let targetAction = actions.get(clipName);
    if (!targetAction) {
      if (clipName.startsWith('Sword_Attack')) {
        targetAction = actions.get('Sword_Attack_01') || actions.get('Attack') || actions.get('Sword_Combo_Finisher');
      } else if (clipName === 'Cultivation_Idle' || clipName === 'Spell_Cast') {
        targetAction = actions.get('Cultivation_Idle') || actions.get('Idle');
      } else if (clipName === 'Walk' || clipName === 'Run' || clipName === 'Sprint') {
        targetAction = actions.get('Run') || actions.get('Walk') || actions.get('Idle');
      } else {
        targetAction = actions.get('Idle') || defaultIdle;
      }
    }

    if (!targetAction || targetAction === activeAction) return;

    targetAction.reset();
    targetAction.enabled = true;
    targetAction.setEffectiveTimeScale(1);
    targetAction.setEffectiveWeight(1);

    if (activeAction) {
      targetAction.crossFadeFrom(activeAction, crossFadeDuration, true);
    }
    targetAction.play();
    activeAction = targetAction;
    activeClipName = clipName;
  };

  const setCultivationStage = (newStage: CultivationStage) => {
    const stageVfx = CULTIVATION_STAGE_VFX_CONFIG[newStage];
    if (!stageVfx) return;

    // Subtle cultivation tint on emissive
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.emissive.set(stageVfx.auraColor);
            m.emissiveIntensity = 0.15;
          }
        }
      }
    });
  };

  setCultivationStage(stage);

  const update = (dt: number) => {
    mixer.update(dt);
  };

  return {
    characterId,
    cultivationStage: stage,
    group,
    mixer,
    actions,
    activeAction,
    activeClipName,
    boneMap,
    socketAnchors,
    update,
    playClip,
    setCultivationStage,
  };
}
