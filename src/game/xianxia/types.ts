import * as THREE from 'three';

/**
 * VẠN ĐẠO TIÊN ĐỒ (Immortal Paths of Ten Thousand Daos)
 * 2.5D Xianxia MMORPG Character Animation & Technical Art System
 */

export type SkeletonProfileType =
  | 'HUMANOID_BASE'
  | 'QUADRUPED_BASE'
  | 'TREE_CREATURE_BASE'
  | 'SERPENT_BASE'
  | 'BIRD_BASE'
  | 'GOLEM_BASE'
  | 'MOUNT_BASE';

export type CultivationStage =
  | 'Mortal'
  | 'Qi Refining'
  | 'Foundation Establishment'
  | 'Golden Core'
  | 'Nascent Soul'
  | 'Soul Formation'
  | 'Tribulation';

export type CharacterCategory = 'PLAYER' | 'NPC' | 'MONSTER' | 'BOSS' | 'MOUNT';

export type CharacterId =
  // Players
  | 'player_male'
  | 'player_female'
  // NPCs
  | 'npc_sect_elder'
  | 'npc_hidden_immortal'
  | 'npc_master'
  | 'npc_healer'
  | 'npc_alchemist'
  | 'npc_qi_cultivator'
  | 'npc_root_inspector'
  // Monsters
  | 'mon_nine_tailed_fox'
  | 'mon_white_tiger'
  | 'mon_demon_boar'
  | 'mon_wood_spirit'
  | 'mon_serpent'
  | 'mon_phoenix'
  // Bosses
  | 'boss_demon_lord'
  | 'boss_ice_dragon'
  | 'boss_stone_guardian'
  | 'boss_celestial_immortal'
  // Mounts
  | 'mount_spirit_deer'
  | 'mount_immortal_crane'
  | 'mount_celestial_whale'
  | 'mount_flying_sword';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  vietnameseName: string;
  category: CharacterCategory;
  skeletonProfile: SkeletonProfileType;
  description: string;
  defaultCultivationStage?: CultivationStage;
  height: number;
  scale: number;
  sockets: SocketDef[];
}

export interface SocketDef {
  name: string;
  boneName: string;
  offsetPos: [number, number, number];
  offsetRot: [number, number, number]; // Euler angles in radians
}

export type AnimationCategory =
  | 'MOVEMENT'
  | 'COMBAT'
  | 'CULTIVATION'
  | 'NPC_LIFE'
  | 'MONSTER_ABILITY'
  | 'BOSS_PHASE'
  | 'MOUNT_RIDE';

export type AnimationEventName =
  | 'Footstep_L'
  | 'Footstep_R'
  | 'Hit_Window_Open'
  | 'Hit_Window_Close'
  | 'Impact_Point'
  | 'VFX_Spawn'
  | 'Projectile_Spawn'
  | 'Sound_Trigger'
  | 'Weapon_Trail_Start'
  | 'Weapon_Trail_End'
  | 'Camera_Shake'
  | 'Phase_Change'
  | 'Interrupt_Allow';

export interface AnimationEventDef {
  name: AnimationEventName;
  normalizedTime: number; // 0.0 to 1.0 within clip
  paramString?: string;
  paramFloat?: number;
}

export interface BoneTransformSample {
  boneName: string;
  position?: [number, number, number];
  quaternion: [number, number, number, number];
  scale?: [number, number, number];
}

export interface AnimationKeyframe {
  time: number; // In seconds
  transforms: BoneTransformSample[];
  events?: AnimationEventDef[];
}

export interface XianxiaAnimationClip {
  id: string;
  name: string;
  category: AnimationCategory;
  duration: number; // In seconds
  fps: number;
  loop: boolean;
  rootMotion: boolean;
  keyframes: AnimationKeyframe[];
  events: AnimationEventDef[];
  // Procedural mathematical evaluator callback for exact 60fps sampling with zero stutter
  evaluate?: (t: number, speedMultiplier?: number) => Map<string, { pos?: THREE.Vector3; quat: THREE.Quaternion; scale?: THREE.Vector3 }>;
}

export interface BoneNode {
  name: string;
  index: number;
  parentName: string | null;
  restPosition: [number, number, number];
  restRotation: [number, number, number, number]; // Quaternion x,y,z,w
  restScale: [number, number, number];
  isIKTarget?: boolean;
  isPoleTarget?: boolean;
  limits?: {
    minX: number; maxX: number;
    minY: number; maxY: number;
    minZ: number; maxZ: number;
  };
}

export interface SkeletonProfileDef {
  type: SkeletonProfileType;
  rootBoneName: string;
  bones: BoneNode[];
  ikChains?: {
    name: string;
    targetBoneName: string;
    effectorBoneName: string;
    chainLength: number;
    poleBoneName?: string;
  }[];
  sockets: Record<string, SocketDef>;
}

export interface BlendTree1DNode {
  clipId: string;
  threshold: number;
}

export interface BlendTree2DNode {
  clipId: string;
  position: [number, number]; // e.g. [speed, turnAngle]
}

export interface ComboTransition {
  fromClipId: string;
  toClipId: string;
  windowStartNorm: number; // 0..1
  windowEndNorm: number;   // 0..1
  blendDuration: number;   // in seconds
}

export interface BossAttackTiming {
  clipId: string;
  anticipationDuration: number;
  activeDuration: number;
  impactDuration: number;
  recoveryDuration: number;
  totalDuration: number;
}

export interface NetworkAnimationState {
  characterId: string;
  currentClipId: string;
  normalizedTime: number;
  playbackSpeed: number;
  blendWeight: number;
  targetClipId?: string;
  rootPosition: [number, number, number];
  rootRotationY: number;
  cultivationStage: CultivationStage;
  timestamp: number;
  sequenceId: number;
}
