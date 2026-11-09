/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { CharacterId, CultivationStage } from './types';
import {
  CULTIVATION_STAGE_VFX_CONFIG,
  createXianxiaRiggedCharacter,
  attachDefaultSocketItems,
} from './xianxiaRigs';
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
  // Players - Asian Xianxia Cultivator Base Model
  player_male: '/models/base.glb',
  player_female: '/models/base.glb',
  base: '/models/base.glb',

  // NPCs
  npc_sect_elder: '/models/npc_elder.glb',
  npc_hidden_immortal: '/models/base.glb',
  npc_master: '/models/base.glb',
  npc_healer: '/models/base.glb',
  npc_alchemist: '/models/npc_mage.glb',
  npc_qi_cultivator: '/models/base.glb',
  npc_root_inspector: '/models/npc_elder.glb',

  // Monsters & Bosses
  mon_wood_spirit: '/models/mon_wood_spirit.glb',
  mon_white_tiger: '/models/mon_beast.glb',
  mon_demon_boar: '/models/mon_beast.glb',
  mon_nine_tailed_fox: '/models/mon_beast.glb',
  boss_demon_lord: '/models/boss_demon_lord.glb',
  boss_stone_guardian: '/models/mon_wood_spirit.glb',
  boss_celestial_immortal: '/models/base.glb',
  boss_ice_dragon: '/models/boss_demon_lord.glb',

  // Mounts & Misc
  mount_spirit_deer: '/models/mon_beast.glb',
  mount_immortal_crane: '/models/player_female.glb',
  mount_void_whale: '/models/boss_demon_lord.glb',
  mount_flying_sword: '/models/base.glb',

  // Props
  landmark_tower: '/models/landmark_tower.glb',
  landmark_tree: '/models/landmark_tree.glb',
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
 * Loads shared humanoid animation clips from library assets
 */
async function loadHumanoidSharedClips(): Promise<THREE.AnimationClip[]> {
  const clips: THREE.AnimationClip[] = [];
  try {
    const maleGltf = await loadGltfAsset('/models/player_male.glb');
    if (maleGltf && maleGltf.animations) {
      clips.push(...maleGltf.animations);
    }
  } catch (e) {
    console.warn('Could not load male animation clips:', e);
  }

  try {
    const femaleGltf = await loadGltfAsset('/models/player_female.glb');
    if (femaleGltf && femaleGltf.animations) {
      for (const anim of femaleGltf.animations) {
        if (!clips.some((c) => c.name === anim.name)) {
          clips.push(anim);
        }
      }
    }
  } catch (e) {
    console.warn('Could not load female animation clips:', e);
  }

  return clips;
}

/**
 * Fallback procedural rigged character if GLB fails to load
 */
function createProceduralFallback(
  characterId: CharacterId,
  stage: CultivationStage
): XianxiaModelInstance {
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

/**
 * Creates a fully rigged, textured, and animated 3D Xianxia model instance from real GLB assets
 */
export async function createRealXianxiaModel(
  characterId: CharacterId,
  stage: CultivationStage = 'Foundation Establishment'
): Promise<XianxiaModelInstance> {
  const url = MODEL_ASSET_URLS[characterId] || MODEL_ASSET_URLS.player_male || '/models/base.glb';

  try {
    const gltf = await loadGltfAsset(url);
    const stageCfg =
      CULTIVATION_STAGE_VFX_CONFIG[stage] ||
      CULTIVATION_STAGE_VFX_CONFIG['Foundation Establishment'];

    // Clone scene with SkeletonUtils to ensure unique bones & weights
    const clonedScene = SkeletonUtils.clone(gltf.scene) as THREE.Group;
    clonedScene.name = `char_${characterId}`;

    // Normalize scale and grounded pivot
    const bbox = new THREE.Box3().setFromObject(clonedScene);
    const size = bbox.getSize(new THREE.Vector3());

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
    const isBaseModel = url.includes('base.glb');

    // Create high-grade Xianxia PBR material for base model
    const cultivatorMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6, // Soft ivory porcelain silk
      roughness: 0.38,
      metalness: 0.08,
      emissive: new THREE.Color(stageCfg.auraColor),
      emissiveIntensity: 0.16,
      side: THREE.DoubleSide,
    });

    clonedScene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        boneMap.set(child.name, child as THREE.Bone);
        const lower = child.name.toLowerCase();
        if (
          !boneMap.has('RightHand') &&
          (lower.includes('righthand') || lower === 'r_hand' || lower === 'hand.r' || lower === 'bone_hand_r')
        ) {
          boneMap.set('RightHand', child as THREE.Bone);
        }
        if (
          !boneMap.has('LeftHand') &&
          (lower.includes('lefthand') || lower === 'l_hand' || lower === 'hand.l' || lower === 'bone_hand_l')
        ) {
          boneMap.set('LeftHand', child as THREE.Bone);
        }
        if (!boneMap.has('Head') && (lower.includes('head') || lower === 'bone_head')) {
          boneMap.set('Head', child as THREE.Bone);
        }
        if (
          !boneMap.has('Hips') &&
          (lower.includes('hips') || lower.includes('pelvis') || lower === 'root' || lower === 'bone_hips')
        ) {
          boneMap.set('Hips', child as THREE.Bone);
        }
        if (!boneMap.has('Spine') && (lower.includes('spine') || lower === 'bone_spine')) {
          boneMap.set('Spine', child as THREE.Bone);
        }
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (isBaseModel) {
          mesh.material = cultivatorMat;
        } else if (mesh.material) {
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

    // Setup Sockets & Equipment
    const rightHand = boneMap.get('RightHand') || boneMap.get('bone_hand_r');
    if (rightHand) {
      const rSocket = new THREE.Object3D();
      rSocket.name = 'socket_RightHandSocket';
      rSocket.position.set(0.02, 0.04, 0.02);
      rSocket.rotation.set(-Math.PI / 2, 0, 0);
      rightHand.add(rSocket);
      socketAnchors.set('RightHandSocket', rSocket);
      attachDefaultSocketItems(characterId, 'RightHandSocket', rSocket, stageCfg);
    }

    const hips = boneMap.get('Hips') || boneMap.get('Spine') || clonedScene;
    const danTianSocket = new THREE.Object3D();
    danTianSocket.name = 'socket_DanTianSocket';
    danTianSocket.position.set(0, 0.15, 0.14);
    hips.add(danTianSocket);
    socketAnchors.set('DanTianSocket', danTianSocket);
    attachDefaultSocketItems(characterId, 'DanTianSocket', danTianSocket, stageCfg);

    // Setup Three.js AnimationMixer
    const mixer = new THREE.AnimationMixer(clonedScene);
    const actions = new Map<string, THREE.AnimationAction>();

    // Determine available animation clips
    let availableClips: THREE.AnimationClip[] = gltf.animations && gltf.animations.length > 0
      ? [...gltf.animations]
      : [];

    if (availableClips.length === 0 || isBaseModel) {
      const sharedClips = await loadHumanoidSharedClips();
      for (const sc of sharedClips) {
        if (!availableClips.some((c) => c.name === sc.name)) {
          availableClips.push(sc);
        }
      }
    }

    // Register all clips into the mixer
    for (const clip of availableClips) {
      try {
        const action = mixer.clipAction(clip);
        actions.set(clip.name, action);

        // Map standard Xianxia clip aliases
        const name = clip.name;
        if (name.includes('Idle') || name.includes('Standing')) {
          if (!actions.has('Idle')) actions.set('Idle', action);
          if (!actions.has('Idle_Alternate')) actions.set('Idle_Alternate', action);
          if (!actions.has('Standing')) actions.set('Standing', action);
        }
        if (name.includes('Walk') || name.includes('RelaxedWalk')) {
          if (!actions.has('Walk')) actions.set('Walk', action);
        }
        if (name.includes('Sprint') || name.includes('Run')) {
          if (!actions.has('Run')) actions.set('Run', action);
          if (!actions.has('Sprint')) actions.set('Sprint', action);
          if (!actions.has('Fly_Move')) actions.set('Fly_Move', action);
        }
        if (name.includes('CounterAttack') || (name.includes('Attack') && !name.includes('Finisher'))) {
          if (!actions.has('Sword_Attack_01')) actions.set('Sword_Attack_01', action);
          if (!actions.has('Attack')) actions.set('Attack', action);
          if (!actions.has('Take_Hit_Front')) actions.set('Take_Hit_Front', action);
        }
        if (name.includes('Finisher')) {
          if (!actions.has('Sword_Combo_Finisher')) actions.set('Sword_Combo_Finisher', action);
          if (!actions.has('Sword_Attack_02')) actions.set('Sword_Attack_02', action);
          if (!actions.has('Sword_Attack_03')) actions.set('Sword_Attack_03', action);
        }
        if (name.includes('Spell') || name.includes('Chant')) {
          if (!actions.has('Cultivation_Idle')) actions.set('Cultivation_Idle', action);
          if (!actions.has('Meditation')) actions.set('Meditation', action);
          if (!actions.has('Spell_Cast')) actions.set('Spell_Cast', action);
        }
        if (name.includes('Death')) {
          if (!actions.has('Death')) actions.set('Death', action);
          if (!actions.has('Tribulation_Hit')) actions.set('Tribulation_Hit', action);
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;
        }
      } catch (err) {
        console.warn(`Could not bind clip ${clip.name}:`, err);
      }
    }

    // Default action setup
    const defaultIdle = actions.get('Idle') || actions.values().next().value || null;
    let activeAction: THREE.AnimationAction | null = null;
    let activeClipName = 'Idle';

    if (defaultIdle) {
      defaultIdle.play();
      activeAction = defaultIdle;
    }

    // Smooth cross-fade animation transition player
    const playClip = (clipName: string, crossFadeDuration: number = 0.22) => {
      let targetAction = actions.get(clipName);
      if (!targetAction) {
        if (clipName.startsWith('Sword_Attack') || clipName.includes('Attack')) {
          targetAction =
            actions.get('Sword_Attack_01') ||
            actions.get('Attack') ||
            actions.get('Sword_Combo_Finisher');
        } else if (
          clipName === 'Cultivation_Idle' ||
          clipName === 'Spell_Cast' ||
          clipName === 'Meditation'
        ) {
          targetAction =
            actions.get('Cultivation_Idle') ||
            actions.get('Meditation') ||
            actions.get('Idle');
        } else if (
          clipName === 'Walk' ||
          clipName === 'Run' ||
          clipName === 'Sprint' ||
          clipName === 'Fly_Move'
        ) {
          targetAction =
            actions.get(clipName) ||
            actions.get('Run') ||
            actions.get('Walk') ||
            actions.get('Idle');
        } else if (clipName === 'Death' || clipName === 'Tribulation_Hit') {
          targetAction = actions.get('Death') || actions.get('Tribulation_Hit');
        } else {
          targetAction = actions.get('Idle') || defaultIdle;
        }
      }

      if (!targetAction || targetAction === activeAction) return;

      targetAction.reset();
      targetAction.enabled = true;
      targetAction.setEffectiveTimeScale(1);
      targetAction.setEffectiveWeight(1);

      if (clipName.includes('Death') || clipName.includes('Tribulation')) {
        targetAction.clampWhenFinished = true;
        targetAction.loop = THREE.LoopOnce;
      } else if (clipName.includes('Attack')) {
        targetAction.loop = THREE.LoopOnce;
        targetAction.clampWhenFinished = false;
      } else {
        targetAction.loop = THREE.LoopRepeat;
      }

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

      cultivatorMat.emissive.set(stageVfx.auraColor);
      cultivatorMat.emissiveIntensity = 0.16 + stageVfx.emissiveIntensity * 0.1;

      // Update flying sword trim emissive if equipped
      const sword = socketAnchors.get('RightHandSocket')?.getObjectByName('equipped_flying_sword');
      if (sword) {
        sword.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (m && m.emissive) {
              m.emissive.set(stageVfx.auraColor);
            }
          }
        });
      }
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
  } catch (err) {
    console.warn(`Falling back to procedural rig for ${characterId}:`, err);
    return createProceduralFallback(characterId, stage);
  }
}
