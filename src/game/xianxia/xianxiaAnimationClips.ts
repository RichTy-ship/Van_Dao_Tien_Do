import * as THREE from 'three';
import {
  AnimationCategory,
  AnimationEventDef,
  SkeletonProfileType,
  XianxiaAnimationClip,
} from './types';

/**
 * COMPLETE XIANXIA ANIMATION CLIP LIBRARY
 * Evaluates anatomical bone rotations and translations continuously at 60 FPS.
 * Supports Root Motion, Foot IK Grounding, Secondary Dynamics, and Attack Timing.
 */

// Helper to set Euler rotation as quaternion into map
function setRot(
  map: Map<string, { pos?: THREE.Vector3; quat: THREE.Quaternion; scale?: THREE.Vector3 }>,
  boneName: string,
  rx: number,
  ry: number,
  rz: number,
  pos?: [number, number, number]
) {
  const euler = new THREE.Euler(rx, ry, rz, 'YXZ');
  const quat = new THREE.Quaternion().setFromEuler(euler);
  const entry: { pos?: THREE.Vector3; quat: THREE.Quaternion; scale?: THREE.Vector3 } = { quat };
  if (pos) {
    entry.pos = new THREE.Vector3(...pos);
  }
  map.set(boneName, entry);
}

// C1-Smooth Hermite Cosine ease
function easeCos(p: number): number {
  const c = Math.max(0, Math.min(1, p));
  return 0.5 - 0.5 * Math.cos(c * Math.PI);
}

// ----------------------------------------------------------------------------
// 1. PLAYER & HUMANOID BASE LOCOMOTION CLIPS
// ----------------------------------------------------------------------------

export const CLIP_HUMANOID_IDLE: XianxiaAnimationClip = {
  id: 'Idle',
  name: 'Standing Breath of Dao',
  category: 'MOVEMENT',
  duration: 3.2,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const breath = Math.sin(t * 1.96) * 0.035;
    const sway = Math.sin(t * 0.98) * 0.025;

    // Spine breathing & gentle sway
    setRot(map, 'bone_hips', 0, sway * 0.5, 0, [0, 0.95 + breath * 0.04, 0]);
    setRot(map, 'bone_spine', breath * 0.4, 0, sway * 0.3);
    setRot(map, 'bone_spine1', breath * 0.6, 0, sway * 0.4);
    setRot(map, 'bone_chest', breath * 0.8, -sway * 0.2, 0);
    setRot(map, 'bone_neck', -breath * 0.3, sway * 0.3, 0);
    setRot(map, 'bone_head', -breath * 0.4, -sway * 0.4, 0);

    // Arms relaxed at side with weapon forward-ready
    setRot(map, 'bone_shoulder_l', 0.05 + breath * 0.2, 0, 0.12);
    setRot(map, 'bone_elbow_l', -0.18 - breath * 0.3, 0, 0);
    setRot(map, 'bone_shoulder_r', -0.12 - breath * 0.2, 0, -0.16);
    setRot(map, 'bone_elbow_r', -0.32 - breath * 0.4, 0, 0);
    setRot(map, 'bone_hand_r', 0.15, 0.1, 0);

    // Flowing robes & sleeves secondary flutter
    const clothFlutter = Math.sin(t * 2.8) * 0.06;
    setRot(map, 'bone_robe_root', 0.04 + clothFlutter, 0, 0);
    setRot(map, 'bone_robe_mid', 0.06 + clothFlutter * 1.4, 0, 0);
    setRot(map, 'bone_robe_lower', 0.08 + clothFlutter * 1.8, 0, 0);
    setRot(map, 'bone_sleeve_l_tip', 0.08 + clothFlutter, 0, 0.05);
    setRot(map, 'bone_sleeve_r_tip', 0.08 + clothFlutter, 0, -0.05);

    return map;
  },
};

export const CLIP_HUMANOID_IDLE_ALTERNATE: XianxiaAnimationClip = {
  id: 'Idle_Alternate',
  name: 'Contemplating the Clouds',
  category: 'MOVEMENT',
  duration: 4.5,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const cycle = (t % 4.5) / 4.5;
    const gazeShift = Math.sin(cycle * Math.PI * 2) * 0.22;

    setRot(map, 'bone_hips', 0.02, gazeShift * 0.3, -0.04, [0, 0.94, 0]);
    setRot(map, 'bone_chest', -0.04, gazeShift * 0.5, 0.02);
    setRot(map, 'bone_head', -0.10, gazeShift * 0.9, 0.05); // Looking up at distant immortals

    // Left hand behind back in classic scholar pose
    setRot(map, 'bone_shoulder_l', 0.45, -0.2, 0.25);
    setRot(map, 'bone_elbow_l', -1.2, 0.3, 0);
    setRot(map, 'bone_wrist_l', 0.2, 0, 0);

    // Right hand resting gently on sword hilt
    setRot(map, 'bone_shoulder_r', -0.15, 0.1, -0.2);
    setRot(map, 'bone_elbow_r', -0.45, -0.1, 0);
    setRot(map, 'bone_hand_r', 0.25, 0, 0);

    return map;
  },
};

export const CLIP_HUMANOID_WALK: XianxiaAnimationClip = {
  id: 'Walk',
  name: 'Xianxia Cloud Walk',
  category: 'MOVEMENT',
  duration: 1.15,
  fps: 30,
  loop: true,
  rootMotion: true,
  events: [
    { name: 'Footstep_L', normalizedTime: 0.22 },
    { name: 'Footstep_R', normalizedTime: 0.72 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const freq = (2 * Math.PI) / 1.15;
    const phase = t * freq;

    const heave = Math.abs(Math.sin(phase)) * 0.045;
    const roll = Math.sin(phase) * 0.035;
    const yaw = Math.cos(phase) * 0.065;

    // Pelvis motion
    setRot(map, 'bone_hips', 0.04, yaw, roll, [0, 0.92 + heave, 0]);
    // Counter-torso rotation
    setRot(map, 'bone_chest', -0.02, -yaw * 0.8, -roll * 0.6);
    setRot(map, 'bone_head', 0, -yaw * 0.4, 0);

    // Leg stride
    const legL = Math.sin(phase);
    const legR = Math.sin(phase + Math.PI);

    setRot(map, 'bone_thigh_l', legL * 0.48, 0, 0.02);
    setRot(map, 'bone_knee_l', legL < 0 ? Math.abs(legL) * 0.75 : 0.08, 0, 0);
    setRot(map, 'bone_ankle_l', -legL * 0.25, 0, 0);

    setRot(map, 'bone_thigh_r', legR * 0.48, 0, -0.02);
    setRot(map, 'bone_knee_r', legR < 0 ? Math.abs(legR) * 0.75 : 0.08, 0, 0);
    setRot(map, 'bone_ankle_r', -legR * 0.25, 0, 0);

    // Natural arm swing with flowing sleeves
    setRot(map, 'bone_shoulder_l', -legL * 0.32, 0, 0.12);
    setRot(map, 'bone_elbow_l', -0.22 - Math.max(0, -legL) * 0.3, 0, 0);
    setRot(map, 'bone_shoulder_r', -legR * 0.32, 0, -0.14);
    setRot(map, 'bone_elbow_r', -0.28 - Math.max(0, -legR) * 0.3, 0, 0);

    // Robes dragging behind stride
    setRot(map, 'bone_robe_mid', 0.18 + Math.sin(phase * 2) * 0.08, 0, 0);
    setRot(map, 'bone_robe_lower', 0.28 + Math.sin(phase * 2) * 0.12, 0, 0);

    return map;
  },
};

export const CLIP_HUMANOID_RUN: XianxiaAnimationClip = {
  id: 'Run',
  name: 'Qi-Surge Run',
  category: 'MOVEMENT',
  duration: 0.75,
  fps: 30,
  loop: true,
  rootMotion: true,
  events: [
    { name: 'Footstep_L', normalizedTime: 0.24 },
    { name: 'Footstep_R', normalizedTime: 0.74 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const freq = (2 * Math.PI) / 0.75;
    const phase = t * freq;

    const heave = Math.abs(Math.sin(phase)) * 0.085;
    const roll = Math.sin(phase) * 0.06;
    const yaw = Math.cos(phase) * 0.12;

    // Forward lean of 0.22 rad for dynamic momentum
    setRot(map, 'bone_hips', 0.22, yaw, roll, [0, 0.88 + heave, 0]);
    setRot(map, 'bone_chest', 0.08, -yaw * 0.85, -roll * 0.7);
    setRot(map, 'bone_head', -0.25, -yaw * 0.3, 0);

    // Athletic leg cycles
    const legL = Math.sin(phase);
    const legR = Math.sin(phase + Math.PI);

    setRot(map, 'bone_thigh_l', legL * 0.85, 0, 0.04);
    setRot(map, 'bone_knee_l', legL < 0 ? Math.abs(legL) * 1.35 : 0.14, 0, 0);
    setRot(map, 'bone_ankle_l', -legL * 0.42, 0, 0);

    setRot(map, 'bone_thigh_r', legR * 0.85, 0, -0.04);
    setRot(map, 'bone_knee_r', legR < 0 ? Math.abs(legR) * 1.35 : 0.14, 0, 0);
    setRot(map, 'bone_ankle_r', -legR * 0.42, 0, 0);

    // Powerful arm pumping
    setRot(map, 'bone_shoulder_l', -legL * 0.75, 0, 0.16);
    setRot(map, 'bone_elbow_l', -0.65 - Math.max(0, -legL) * 0.5, 0, 0);
    setRot(map, 'bone_shoulder_r', -legR * 0.75, 0, -0.18);
    setRot(map, 'bone_elbow_r', -0.72 - Math.max(0, -legR) * 0.5, 0, 0);

    // Flying robe trails
    setRot(map, 'bone_robe_mid', 0.45 + Math.sin(phase * 2) * 0.16, 0, 0);
    setRot(map, 'bone_robe_lower', 0.65 + Math.sin(phase * 2) * 0.25, 0, 0);

    return map;
  },
};

export const CLIP_HUMANOID_SPRINT: XianxiaAnimationClip = {
  id: 'Sprint',
  name: 'Wind-Riding Sprint',
  category: 'MOVEMENT',
  duration: 0.55,
  fps: 30,
  loop: true,
  rootMotion: true,
  events: [
    { name: 'Footstep_L', normalizedTime: 0.25 },
    { name: 'Footstep_R', normalizedTime: 0.75 },
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'wind_trail' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const freq = (2 * Math.PI) / 0.55;
    const phase = t * freq;

    setRot(map, 'bone_hips', 0.35, Math.cos(phase) * 0.15, Math.sin(phase) * 0.08, [0, 0.82 + Math.abs(Math.sin(phase)) * 0.1, 0]);
    setRot(map, 'bone_chest', 0.15, -Math.cos(phase) * 0.12, 0);
    setRot(map, 'bone_head', -0.42, 0, 0);

    const legL = Math.sin(phase);
    const legR = Math.sin(phase + Math.PI);

    setRot(map, 'bone_thigh_l', legL * 1.15, 0, 0.05);
    setRot(map, 'bone_knee_l', legL < 0 ? Math.abs(legL) * 1.65 : 0.2, 0, 0);
    setRot(map, 'bone_thigh_r', legR * 1.15, 0, -0.05);
    setRot(map, 'bone_knee_r', legR < 0 ? Math.abs(legR) * 1.65 : 0.2, 0, 0);

    // Streamlined aerodynamic sword sprint
    setRot(map, 'bone_shoulder_r', 0.45, 0, -0.25);
    setRot(map, 'bone_elbow_r', -0.25, 0, 0);
    setRot(map, 'bone_shoulder_l', -0.45, 0, 0.25);
    setRot(map, 'bone_elbow_l', -0.85, 0, 0);

    setRot(map, 'bone_robe_lower', 0.95 + Math.sin(phase * 2) * 0.3, 0, 0);
    return map;
  },
};

export const CLIP_HUMANOID_DASH: XianxiaAnimationClip = {
  id: 'Dash',
  name: 'Flash Step / Shrinking Earth (Súc Địa Thành Thốn)',
  category: 'MOVEMENT',
  duration: 0.42,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.05, paramString: 'flash_step_burst' },
    { name: 'Camera_Shake', normalizedTime: 0.05, paramFloat: 0.2 },
    { name: 'Interrupt_Allow', normalizedTime: 0.70 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const p = Math.min(1.0, t / 0.42);
    const ease = easeCos(p);

    // Deep forward lunge vanishing into afterimage
    setRot(map, 'bone_hips', 0.48 * (1 - ease * 0.6), 0, 0, [0, 0.75 + ease * 0.2, -p * 1.8]);
    setRot(map, 'bone_chest', 0.25 * (1 - ease * 0.6), 0, 0);
    setRot(map, 'bone_thigh_r', -0.85 * (1 - ease), 0, 0);
    setRot(map, 'bone_knee_r', 1.25 * (1 - ease), 0, 0);
    setRot(map, 'bone_thigh_l', 1.05 * (1 - ease), 0, 0);
    setRot(map, 'bone_knee_l', 0.35 * (1 - ease), 0, 0);

    // Sword extended forward piercing space
    setRot(map, 'bone_shoulder_r', -1.25 * (1 - ease * 0.8), 0, -0.15);
    setRot(map, 'bone_elbow_r', -0.15, 0, 0);

    return map;
  },
};

export const CLIP_HUMANOID_DODGE: XianxiaAnimationClip = {
  id: 'Dodge',
  name: 'Mist Evasion Backflip',
  category: 'MOVEMENT',
  duration: 0.58,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.1, paramString: 'mist_clone' },
    { name: 'Interrupt_Allow', normalizedTime: 0.65 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const p = Math.min(1.0, t / 0.58);
    const ease = easeCos(p);

    // Backflip arch
    const flipAngle = -p * Math.PI * 1.2;
    setRot(map, 'bone_hips', flipAngle, 0, 0, [0, 0.95 + Math.sin(p * Math.PI) * 0.65, p * 1.4]);
    setRot(map, 'bone_knee_l', Math.sin(p * Math.PI) * 1.4, 0, 0);
    setRot(map, 'bone_knee_r', Math.sin(p * Math.PI) * 1.4, 0, 0);
    return map;
  },
};

// Flying Locomotion (Sword Flight)
export const CLIP_HUMANOID_FLY_IDLE: XianxiaAnimationClip = {
  id: 'Fly_Idle',
  name: 'Flying Sword Hover',
  category: 'MOVEMENT',
  duration: 2.4,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const hover = Math.sin(t * 2.6) * 0.06;
    const tilt = Math.sin(t * 1.3) * 0.04;

    setRot(map, 'bone_hips', 0.05, 0, tilt, [0, 1.25 + hover, 0]);
    setRot(map, 'bone_chest', -0.05, 0, -tilt);
    setRot(map, 'bone_head', -0.08, 0, 0);

    // Stately hands behind back or forming sword secret gesture (Kiếm Quyết)
    setRot(map, 'bone_shoulder_l', 0.35, -0.15, 0.25);
    setRot(map, 'bone_elbow_l', -1.35, 0.2, 0);
    setRot(map, 'bone_shoulder_r', -0.25, 0.15, -0.2);
    setRot(map, 'bone_elbow_r', -0.95, 0.3, 0); // Right hand two fingers pointed forming sword spell

    // Legs firmly braced on blade
    setRot(map, 'bone_thigh_l', 0.12, 0, 0.08);
    setRot(map, 'bone_knee_l', 0.15, 0, 0);
    setRot(map, 'bone_thigh_r', -0.12, 0, -0.08);
    setRot(map, 'bone_knee_r', 0.18, 0, 0);

    // Robes billowing downwards in flight draft
    setRot(map, 'bone_robe_mid', 0.35 + hover * 2, 0, 0);
    setRot(map, 'bone_robe_lower', 0.55 + hover * 3, 0, 0);

    return map;
  },
};

export const CLIP_HUMANOID_FLY_MOVE: XianxiaAnimationClip = {
  id: 'Fly_Move',
  name: 'Flying Sword Cruise',
  category: 'MOVEMENT',
  duration: 1.8,
  fps: 30,
  loop: true,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.1, paramString: 'sword_flight_clouds' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const hover = Math.sin(t * 3.8) * 0.05;

    // Aerodynamic lean into the flight velocity
    setRot(map, 'bone_hips', 0.45, 0, 0, [0, 1.2 + hover, 0]);
    setRot(map, 'bone_chest', 0.15, 0, 0);
    setRot(map, 'bone_head', -0.55, 0, 0); // Head raised looking into horizon

    // Robes streaming horizontally backwards
    setRot(map, 'bone_robe_mid', 0.85 + hover * 2, 0, 0);
    setRot(map, 'bone_robe_lower', 1.25 + hover * 3, 0, 0);

    return map;
  },
};

// ----------------------------------------------------------------------------
// 2. PLAYER COMBAT CLIPS (Sword Combos, Spells, Reactions)
// ----------------------------------------------------------------------------

export const CLIP_SWORD_ATTACK_01: XianxiaAnimationClip = {
  id: 'Sword_Attack_01',
  name: 'Azure Dragon Cleaves the Water (Combo 1)',
  category: 'COMBAT',
  duration: 0.85,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'Weapon_Trail_Start', normalizedTime: 0.28 },
    { name: 'Hit_Window_Open', normalizedTime: 0.35 },
    { name: 'Impact_Point', normalizedTime: 0.44 },
    { name: 'Hit_Window_Close', normalizedTime: 0.55 },
    { name: 'Weapon_Trail_End', normalizedTime: 0.65 },
    { name: 'Interrupt_Allow', normalizedTime: 0.72 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 0.85);

    let slashProgress = 0;
    if (norm < 0.35) {
      // Windup: Coil blade up right shoulder
      const ease = easeCos(norm / 0.35);
      setRot(map, 'bone_hips', 0.05, -ease * 0.42, 0);
      setRot(map, 'bone_chest', 0.08, -ease * 0.55, 0);
      setRot(map, 'bone_shoulder_r', -0.45 - ease * 0.85, 0.4 * ease, -0.2);
      setRot(map, 'bone_elbow_r', -0.85 - ease * 0.55, 0, 0);
      setRot(map, 'bone_hand_r', 0.35 * ease, 0.2 * ease, 0);
    } else if (norm < 0.62) {
      // Impact Swing: Diagonal diagonal slash from right high to left low
      const ease = easeCos((norm - 0.35) / 0.27);
      setRot(map, 'bone_hips', 0.12, -0.42 + ease * 0.95, 0, [0, 0.90, -ease * 0.25]);
      setRot(map, 'bone_chest', 0.15, -0.55 + ease * 1.15, 0);
      setRot(map, 'bone_shoulder_r', -1.30 + ease * 1.85, 0.4 - ease * 0.8, 0.25 * ease);
      setRot(map, 'bone_elbow_r', -1.40 + ease * 1.15, 0, 0);
      setRot(map, 'bone_hand_r', 0.35 - ease * 0.75, 0, 0);
    } else {
      // Follow-through & Recovery
      const ease = easeCos((norm - 0.62) / 0.38);
      setRot(map, 'bone_hips', 0.12 * (1 - ease), 0.53 * (1 - ease), 0);
      setRot(map, 'bone_chest', 0.15 * (1 - ease), 0.60 * (1 - ease), 0);
      setRot(map, 'bone_shoulder_r', 0.55 * (1 - ease), -0.4 * (1 - ease), 0);
    }

    return map;
  },
};

export const CLIP_SWORD_ATTACK_02: XianxiaAnimationClip = {
  id: 'Sword_Attack_02',
  name: 'White Tiger Pierces the Sun (Combo 2)',
  category: 'COMBAT',
  duration: 0.90,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'Weapon_Trail_Start', normalizedTime: 0.22 },
    { name: 'Hit_Window_Open', normalizedTime: 0.30 },
    { name: 'Impact_Point', normalizedTime: 0.40 },
    { name: 'Hit_Window_Close', normalizedTime: 0.52 },
    { name: 'Weapon_Trail_End', normalizedTime: 0.62 },
    { name: 'Interrupt_Allow', normalizedTime: 0.70 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 0.90);

    // Upward rising backhand slash
    if (norm < 0.32) {
      const ease = easeCos(norm / 0.32);
      setRot(map, 'bone_hips', 0.08, 0.35 * ease, 0);
      setRot(map, 'bone_shoulder_r', 0.65 * ease, -0.4 * ease, 0);
      setRot(map, 'bone_elbow_r', -0.45 * ease, 0, 0);
    } else if (norm < 0.58) {
      const ease = easeCos((norm - 0.32) / 0.26);
      setRot(map, 'bone_hips', 0.18, 0.35 - ease * 0.85, 0, [0, 0.88, -ease * 0.3]);
      setRot(map, 'bone_chest', 0.22, 0.45 - ease * 0.95, 0);
      setRot(map, 'bone_shoulder_r', 0.65 - ease * 1.95, -0.4 + ease * 0.8, 0);
      setRot(map, 'bone_elbow_r', -0.45 - ease * 0.55, 0, 0);
    } else {
      const ease = easeCos((norm - 0.58) / 0.42);
      setRot(map, 'bone_hips', 0.18 * (1 - ease), -0.5 * (1 - ease), 0);
      setRot(map, 'bone_chest', 0.22 * (1 - ease), -0.5 * (1 - ease), 0);
      setRot(map, 'bone_shoulder_r', -1.3 * (1 - ease), 0.4 * (1 - ease), 0);
    }
    return map;
  },
};

export const CLIP_SWORD_ATTACK_03: XianxiaAnimationClip = {
  id: 'Sword_Attack_03',
  name: 'Thunder Thrust of the Void (Combo 3)',
  category: 'COMBAT',
  duration: 1.05,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.32, paramString: 'lightning_spark_point' },
    { name: 'Impact_Point', normalizedTime: 0.45 },
    { name: 'Hit_Window_Open', normalizedTime: 0.38 },
    { name: 'Hit_Window_Close', normalizedTime: 0.58 },
    { name: 'Camera_Shake', normalizedTime: 0.45, paramFloat: 0.35 },
    { name: 'Interrupt_Allow', normalizedTime: 0.78 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 1.05);

    // Deep step-in thrust piercing armor
    if (norm < 0.40) {
      const ease = easeCos(norm / 0.40);
      setRot(map, 'bone_hips', 0.15 * ease, 0, 0, [0, 0.95 - ease * 0.12, -ease * 0.15]);
      setRot(map, 'bone_shoulder_r', -0.2 - ease * 0.5, 0, -0.2);
      setRot(map, 'bone_elbow_r', -1.35 * ease, 0, 0); // Full coiled draw
    } else if (norm < 0.65) {
      const ease = easeCos((norm - 0.40) / 0.25);
      // Explosive forward extension
      setRot(map, 'bone_hips', 0.28, 0, 0, [0, 0.83, -0.15 - ease * 0.55]);
      setRot(map, 'bone_chest', 0.32, 0, 0);
      setRot(map, 'bone_shoulder_r', -1.55, 0, 0);
      setRot(map, 'bone_elbow_r', -0.05, 0, 0); // Arm locked straight forward
    } else {
      const ease = easeCos((norm - 0.65) / 0.35);
      setRot(map, 'bone_hips', 0.28 * (1 - ease), 0, 0);
      setRot(map, 'bone_chest', 0.32 * (1 - ease), 0, 0);
      setRot(map, 'bone_shoulder_r', -1.55 * (1 - ease), 0, 0);
    }
    return map;
  },
};

export const CLIP_SWORD_COMBO_FINISHER: XianxiaAnimationClip = {
  id: 'Sword_Combo_Finisher',
  name: 'Ten Thousand Swords Return to the Origin (Vạn Kiếm Quy Tông)',
  category: 'COMBAT',
  duration: 1.65,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'sword_array_circle' },
    { name: 'Impact_Point', normalizedTime: 0.65 },
    { name: 'Camera_Shake', normalizedTime: 0.65, paramFloat: 0.65 },
    { name: 'VFX_Spawn', normalizedTime: 0.65, paramString: 'celestial_sword_rain' },
    { name: 'Interrupt_Allow', normalizedTime: 0.88 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 1.65);

    // Leap into air, summon spiritual sword formation, then point downwards
    if (norm < 0.35) {
      const ease = easeCos(norm / 0.35);
      setRot(map, 'bone_hips', -0.12 * ease, 0, 0, [0, 0.95 + ease * 0.85, 0]);
      setRot(map, 'bone_chest', -0.18 * ease, 0, 0);
      // Sword raised vertically to heaven
      setRot(map, 'bone_shoulder_r', -2.85 * ease, 0, 0);
      setRot(map, 'bone_elbow_r', -0.1, 0, 0);
    } else if (norm < 0.70) {
      const ease = easeCos((norm - 0.35) / 0.35);
      // Slam down towards earth
      setRot(map, 'bone_hips', 0.45 * ease, 0, 0, [0, 1.80 - ease * 0.95, -ease * 0.3]);
      setRot(map, 'bone_chest', 0.55 * ease, 0, 0);
      setRot(map, 'bone_shoulder_r', -0.45 + ease * 1.25, 0, 0);
    } else {
      const ease = easeCos((norm - 0.70) / 0.30);
      setRot(map, 'bone_hips', 0.45 * (1 - ease), 0, 0, [0, 0.85 + ease * 0.1, 0]);
    }
    return map;
  },
};

export const CLIP_SPELL_CAST: XianxiaAnimationClip = {
  id: 'Spell_Cast',
  name: 'Five Elements Daoist Mudra Cast',
  category: 'COMBAT',
  duration: 1.25,
  fps: 30,
  loop: false,
  rootMotion: false,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'bagua_array' },
    { name: 'Projectile_Spawn', normalizedTime: 0.55 },
    { name: 'Interrupt_Allow', normalizedTime: 0.80 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 1.25);

    // Both hands weave celestial incantation mudras (kết ấn)
    const weave = Math.sin(norm * Math.PI * 4) * 0.12;
    setRot(map, 'bone_chest', -0.05, 0, 0);
    setRot(map, 'bone_shoulder_l', -0.75 + weave, 0.4, 0.3);
    setRot(map, 'bone_elbow_l', -1.25 + weave, 0, 0);
    setRot(map, 'bone_shoulder_r', -0.75 - weave, -0.4, -0.3);
    setRot(map, 'bone_elbow_r', -1.25 - weave, 0, 0);

    return map;
  },
};

// Hit Reactions & Death
export const CLIP_TAKE_HIT_FRONT: XianxiaAnimationClip = {
  id: 'Take_Hit_Front',
  name: 'Struck from Front',
  category: 'COMBAT',
  duration: 0.45,
  fps: 30,
  loop: false,
  rootMotion: false,
  events: [{ name: 'Interrupt_Allow', normalizedTime: 0.65 }],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const p = Math.min(1.0, t / 0.45);
    const impulse = Math.sin(p * Math.PI) * 0.35;

    setRot(map, 'bone_hips', -impulse * 0.6, 0, 0, [0, 0.95 - impulse * 0.1, impulse * 0.2]);
    setRot(map, 'bone_chest', -impulse * 1.1, 0, 0);
    setRot(map, 'bone_head', impulse * 0.9, 0, 0); // Head snaps back
    return map;
  },
};

export const CLIP_DEATH: XianxiaAnimationClip = {
  id: 'Death',
  name: 'Dao Dispersal (Đạo Tiêu Thân Vong)',
  category: 'COMBAT',
  duration: 1.85,
  fps: 30,
  loop: false,
  rootMotion: false,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.55, paramString: 'qi_dissipation' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const p = Math.min(1.0, t / 1.85);
    const ease = easeCos(p);

    // Fall to knees then collapse onto ground
    setRot(map, 'bone_hips', ease * 0.55, 0, 0, [0, 0.95 - ease * 0.75, ease * 0.25]);
    setRot(map, 'bone_thigh_l', ease * 0.85, 0, 0);
    setRot(map, 'bone_knee_l', ease * 1.45, 0, 0);
    setRot(map, 'bone_thigh_r', ease * 0.85, 0, 0);
    setRot(map, 'bone_knee_r', ease * 1.45, 0, 0);
    setRot(map, 'bone_chest', ease * 0.45, 0, 0);
    setRot(map, 'bone_head', ease * 0.65, 0, 0);
    return map;
  },
};

// ----------------------------------------------------------------------------
// 3. CULTIVATION CLIPS (Meditation, Tribulation, Ascension)
// ----------------------------------------------------------------------------

export const CLIP_CULTIVATION_IDLE: XianxiaAnimationClip = {
  id: 'Cultivation_Idle',
  name: 'Lotus Meditation Qi Circulation (Đả Tọa Tu Luyện)',
  category: 'CULTIVATION',
  duration: 4.0,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.05, paramString: 'dan_tian_pulse' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const breath = Math.sin(t * 1.5) * 0.04;

    // Full Lotus cross-legged seating grounded to earth
    setRot(map, 'bone_hips', 0, 0, 0, [0, 0.28 + breath * 0.02, 0]);
    setRot(map, 'bone_spine', breath * 0.5, 0, 0);
    setRot(map, 'bone_chest', breath * 0.8, 0, 0);
    setRot(map, 'bone_head', -breath * 0.3, 0, 0);

    // Crossed thighs & bent knees flat on floor
    setRot(map, 'bone_thigh_l', 1.45, 0.55, 0.35);
    setRot(map, 'bone_knee_l', 2.35, 0, 0);
    setRot(map, 'bone_ankle_l', 0.25, 0, 0);

    setRot(map, 'bone_thigh_r', 1.45, -0.55, -0.35);
    setRot(map, 'bone_knee_r', 2.35, 0, 0);
    setRot(map, 'bone_ankle_r', 0.25, 0, 0);

    // Hands resting on knees in Dhyana Mudra (Thiền Ấn)
    setRot(map, 'bone_shoulder_l', 0.25, 0.2, 0.35);
    setRot(map, 'bone_elbow_l', -1.45, 0, 0);
    setRot(map, 'bone_shoulder_r', 0.25, -0.2, -0.35);
    setRot(map, 'bone_elbow_r', -1.45, 0, 0);

    return map;
  },
};

export const CLIP_TRIBULATION_HIT: XianxiaAnimationClip = {
  id: 'Tribulation_Hit',
  name: 'Heavenly Tribulation Thunder Strike (Độ Kiếp Lôi Kiếp)',
  category: 'CULTIVATION',
  duration: 1.45,
  fps: 30,
  loop: false,
  rootMotion: false,
  events: [
    { name: 'Camera_Shake', normalizedTime: 0.15, paramFloat: 0.95 },
    { name: 'VFX_Spawn', normalizedTime: 0.15, paramString: 'heavenly_thunder_bolt' },
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'ground_scorch_cracks' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 1.45);

    // Body convulses under heavenly lightning pressure, arms held up defying thunder
    const shake = Math.sin(norm * 45) * Math.max(0, 1 - norm) * 0.15;
    setRot(map, 'bone_hips', -0.15 + shake, 0, 0, [0, 0.85, 0]);
    setRot(map, 'bone_chest', -0.35 + shake * 1.5, 0, 0);
    setRot(map, 'bone_head', -0.55 + shake, 0, 0); // Defiant look up into the sky

    // Both arms raised supporting the defensive spirit barrier
    setRot(map, 'bone_shoulder_l', -2.15, 0.4, 0.4);
    setRot(map, 'bone_elbow_l', -0.85, 0, 0);
    setRot(map, 'bone_shoulder_r', -2.15, -0.4, -0.4);
    setRot(map, 'bone_elbow_r', -0.85, 0, 0);

    return map;
  },
};

export const CLIP_ASCENSION: XianxiaAnimationClip = {
  id: 'Ascension',
  name: 'Feathered Ascension into the Immortals (Phi Thăng Tiên Giới)',
  category: 'CULTIVATION',
  duration: 3.5,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.1, paramString: 'golden_heavenly_gate' },
    { name: 'VFX_Spawn', normalizedTime: 0.5, paramString: 'celestial_petals_rain' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const p = Math.min(1.0, t / 3.5);
    const ease = easeCos(p);

    // Slowly elevate straight into heaven surrounded by celestial light
    setRot(map, 'bone_hips', -0.1, 0, 0, [0, 0.95 + ease * 3.5, 0]);
    setRot(map, 'bone_chest', -0.15, 0, 0);
    setRot(map, 'bone_shoulder_l', -1.2, 0.5, 0.6);
    setRot(map, 'bone_shoulder_r', -1.2, -0.5, -0.6);
    setRot(map, 'bone_robe_lower', 0.85, 0, 0);

    return map;
  },
};

// ----------------------------------------------------------------------------
// 4. UNIQUE NPC ANIMATIONS
// ----------------------------------------------------------------------------

export const CLIP_SECT_ELDER_BEARD: XianxiaAnimationClip = {
  id: 'Idle_Beard_Stroke',
  name: 'Sect Elder Stroking Long White Beard',
  category: 'NPC_LIFE',
  duration: 3.0,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const cycle = (t % 3.0) / 3.0;
    const stroke = Math.sin(cycle * Math.PI * 2) * 0.15;

    setRot(map, 'bone_hips', 0.02, 0, 0, [0, 0.95, 0]);
    setRot(map, 'bone_chest', 0.04, 0, 0);
    setRot(map, 'bone_head', 0.12, stroke * 0.3, 0); // Ponderous nod

    // Left hand behind back
    setRot(map, 'bone_shoulder_l', 0.45, -0.15, 0.25);
    setRot(map, 'bone_elbow_l', -1.35, 0.2, 0);

    // Right hand stroking chest beard
    setRot(map, 'bone_shoulder_r', -0.65, -0.25, -0.15);
    setRot(map, 'bone_elbow_r', -1.85 + stroke, 0, 0);
    setRot(map, 'bone_hand_r', 0.45 + stroke * 0.8, 0, 0);

    return map;
  },
};

export const CLIP_ALCHEMIST_STIR: XianxiaAnimationClip = {
  id: 'Stir_Cauldron',
  name: 'Alchemist Directing Nine-Revolution Cauldron Flame',
  category: 'NPC_LIFE',
  duration: 2.2,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.15, paramString: 'cauldron_spirit_flame' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const cycle = t * (Math.PI * 2 / 2.2);

    // Circular mudra motions directing cauldron flames
    setRot(map, 'bone_chest', 0.15, Math.sin(cycle) * 0.2, 0);
    setRot(map, 'bone_shoulder_l', -0.85, Math.sin(cycle) * 0.3, 0.3);
    setRot(map, 'bone_elbow_l', -1.15 + Math.cos(cycle) * 0.25, 0, 0);
    setRot(map, 'bone_shoulder_r', -0.85, -Math.sin(cycle) * 0.3, -0.3);
    setRot(map, 'bone_elbow_r', -1.15 + Math.cos(cycle) * 0.25, 0, 0);

    return map;
  },
};

// ----------------------------------------------------------------------------
// 5. MONSTER ANIMATIONS (Nine-Tailed Fox with 9 Tails, Tiger, Serpent, Phoenix)
// ----------------------------------------------------------------------------

export const CLIP_FOX_IDLE: XianxiaAnimationClip = {
  id: 'Fox_Idle',
  name: 'Nine-tailed Celestial Fox Breathing & Mesmerizing Tail Wave',
  category: 'MONSTER_ABILITY',
  duration: 3.5,
  fps: 30,
  loop: true,
  rootMotion: false,
  events: [],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const breath = Math.sin(t * 1.8) * 0.035;

    setRot(map, 'bone_quad_pelvis', 0.04 + breath * 0.3, 0, 0, [0, 0.70 + breath * 0.02, -0.35]);
    setRot(map, 'bone_quad_chest', -0.05 + breath * 0.5, 0, 0);
    setRot(map, 'bone_quad_head', 0.12 - breath * 0.4, Math.sin(t * 0.9) * 0.12, 0);

    // 9 TAILS ANIMATED INDEPENDENTLY WITH BELIEVABLE OVERLAPPING MOTION
    for (let i = 1; i <= 9; i++) {
      const phaseOffset = i * 0.42;
      const wave1 = Math.sin(t * 2.2 + phaseOffset) * 0.18;
      const wave2 = Math.sin(t * 2.2 + phaseOffset + 0.6) * 0.25;
      const wave3 = Math.sin(t * 2.2 + phaseOffset + 1.2) * 0.35;

      const fanAngle = (i - 5) * 0.14; // Fan distribution
      setRot(map, `bone_fox_tail_${i}_base`, 0.22 + wave1, fanAngle, 0);
      setRot(map, `bone_fox_tail_${i}_mid`, 0.15 + wave2, fanAngle * 0.5, 0);
      setRot(map, `bone_fox_tail_${i}_sub`, -0.10 + wave3, 0, 0);
      setRot(map, `bone_fox_tail_${i}_tip`, -0.25 + wave3 * 1.2, 0, 0);
    }

    return map;
  },
};

export const CLIP_FOX_POUNCE: XianxiaAnimationClip = {
  id: 'Fox_Pounce',
  name: 'Nine-Tailed Fox Mirage Pounce',
  category: 'MONSTER_ABILITY',
  duration: 1.15,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.15, paramString: 'foxfire_glow' },
    { name: 'Impact_Point', normalizedTime: 0.58 },
    { name: 'Camera_Shake', normalizedTime: 0.58, paramFloat: 0.45 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 1.15);

    if (norm < 0.35) {
      // Coil down before leap
      const ease = easeCos(norm / 0.35);
      setRot(map, 'bone_quad_pelvis', 0.25 * ease, 0, 0, [0, 0.55 - ease * 0.18, -0.35]);
      setRot(map, 'bone_quad_chest', 0.35 * ease, 0, 0);
    } else if (norm < 0.68) {
      // Airborne leap
      const ease = easeCos((norm - 0.35) / 0.33);
      setRot(map, 'bone_quad_pelvis', -0.35 * ease, 0, 0, [0, 0.70 + Math.sin(ease * Math.PI) * 0.85, -0.35 - ease * 1.2]);
      setRot(map, 'bone_quad_chest', -0.25 * ease, 0, 0);
      // All 9 tails trail streaming straight back
      for (let i = 1; i <= 9; i++) {
        setRot(map, `bone_fox_tail_${i}_base`, 0.75, 0, 0);
        setRot(map, `bone_fox_tail_${i}_mid`, 0.85, 0, 0);
      }
    } else {
      // Landing pounce
      const ease = easeCos((norm - 0.68) / 0.32);
      setRot(map, 'bone_quad_pelvis', 0.35 * (1 - ease), 0, 0, [0, 0.70, -1.55]);
    }
    return map;
  },
};

export const CLIP_SERPENT_SLITHER: XianxiaAnimationClip = {
  id: 'Serpent_Slither',
  name: '16-Segment Sinusoidal Serpent Slither',
  category: 'MONSTER_ABILITY',
  duration: 1.4,
  fps: 30,
  loop: true,
  rootMotion: true,
  events: [],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const speed = t * 5.2;

    // Propagate travelling sinusoidal transverse wave down all 16 vertebrae
    for (let s = 1; s <= 16; s++) {
      const boneName = `bone_serpent_vertebra_${String(s).padStart(2, '0')}`;
      const waveYaw = Math.sin(speed - s * 0.42) * 0.32;
      const wavePitch = Math.cos(speed - s * 0.42) * 0.08;
      setRot(map, boneName, wavePitch, waveYaw, 0);
    }

    // Raised striking hood & head
    setRot(map, 'bone_serpent_neck', -0.15, Math.sin(speed) * 0.15, 0);
    setRot(map, 'bone_serpent_head', 0.25, -Math.sin(speed) * 0.15, 0);

    return map;
  },
};

export const CLIP_PHOENIX_FLY: XianxiaAnimationClip = {
  id: 'Phoenix_Fly',
  name: 'Vermilion Phoenix Flight & Wing Flap',
  category: 'MONSTER_ABILITY',
  duration: 1.2,
  fps: 30,
  loop: true,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'nirvana_flame_trail' },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const cycle = t * (Math.PI * 2 / 1.2);
    const flap = Math.sin(cycle);

    setRot(map, 'bone_bird_pelvis', 0.22, 0, 0, [0, 1.6 + flap * 0.15, 0]);
    setRot(map, 'bone_bird_chest', 0.12, 0, 0);

    // Powerful synchronized wing beats
    setRot(map, 'bone_bird_wing_sh_l', 0, flap * 0.65, flap * 0.45);
    setRot(map, 'bone_bird_wing_elbow_l', 0, flap * 0.45, flap * 0.35);
    setRot(map, 'bone_bird_wing_sh_r', 0, -flap * 0.65, -flap * 0.45);
    setRot(map, 'bone_bird_wing_elbow_r', 0, -flap * 0.45, -flap * 0.35);

    // Trailing fiery tail fan
    setRot(map, 'bone_bird_tail_1', -0.35 + flap * 0.15, 0, 0);
    setRot(map, 'bone_bird_tail_2', -0.55 + flap * 0.25, 0, 0);

    return map;
  },
};

// ----------------------------------------------------------------------------
// 6. BOSS ANIMATIONS (4-Phase Timing: Anticipation, Active, Impact, Recovery)
// ----------------------------------------------------------------------------

export const CLIP_DEMON_LORD_SLAM: XianxiaAnimationClip = {
  id: 'Ground_Slam',
  name: 'Abyssal Calamity Earth Shatter (Ground Slam)',
  category: 'BOSS_PHASE',
  duration: 2.2,
  fps: 30,
  loop: false,
  rootMotion: true,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'dark_energy_charge' },
    { name: 'Impact_Point', normalizedTime: 0.68 },
    { name: 'Camera_Shake', normalizedTime: 0.68, paramFloat: 1.0 },
    { name: 'VFX_Spawn', normalizedTime: 0.68, paramString: 'abyssal_ground_eruption' },
    { name: 'Interrupt_Allow', normalizedTime: 0.90 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 2.2);

    // 4-Phase Boss Timing:
    // 1. Anticipation (0..0.45): Giant cleaver raised with both hands gathering dark miasma
    // 2. Active (0.45..0.65): Heavy downward descent
    // 3. Impact (0.65..0.75): Massive shockwave into stone
    // 4. Recovery (0.75..1.0): Weapon pull-back
    if (norm < 0.45) {
      const ease = easeCos(norm / 0.45);
      setRot(map, 'bone_hips', -0.25 * ease, 0, 0, [0, 1.25 + ease * 0.2, 0]);
      setRot(map, 'bone_chest', -0.45 * ease, 0, 0);
      setRot(map, 'bone_shoulder_r', -2.75 * ease, 0, 0);
      setRot(map, 'bone_shoulder_l', -2.75 * ease, 0, 0);
    } else if (norm < 0.70) {
      const ease = easeCos((norm - 0.45) / 0.25);
      setRot(map, 'bone_hips', 0.65 * ease, 0, 0, [0, 1.45 - ease * 0.45, -ease * 0.4]);
      setRot(map, 'bone_chest', 0.85 * ease, 0, 0);
      setRot(map, 'bone_shoulder_r', -2.75 + ease * 3.45, 0, 0);
      setRot(map, 'bone_shoulder_l', -2.75 + ease * 3.45, 0, 0);
    } else {
      const ease = easeCos((norm - 0.70) / 0.30);
      setRot(map, 'bone_hips', 0.65 * (1 - ease), 0, 0, [0, 1.0 + ease * 0.25, -0.4]);
      setRot(map, 'bone_chest', 0.85 * (1 - ease), 0, 0);
    }

    return map;
  },
};

export const CLIP_ICE_DRAGON_BREATH: XianxiaAnimationClip = {
  id: 'Ice_Breath',
  name: 'Frost Dragon Glacial Breath',
  category: 'BOSS_PHASE',
  duration: 2.8,
  fps: 30,
  loop: false,
  rootMotion: false,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.25, paramString: 'frost_breath_cone' },
    { name: 'Camera_Shake', normalizedTime: 0.35, paramFloat: 0.7 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const norm = Math.min(1.0, t / 2.8);

    // Deep inhale, neck reared back, then spew ice breath sweeping across arc
    const sweep = Math.sin(norm * Math.PI * 3) * 0.45;
    setRot(map, 'bone_serpent_neck', -0.35, sweep, 0);
    setRot(map, 'bone_serpent_head', 0.45, sweep * 0.5, 0);
    setRot(map, 'bone_serpent_jaw', 0.65, 0, 0); // Wide open jaws

    return map;
  },
};

export const CLIP_CELESTIAL_SWORD_FORMATION: XianxiaAnimationClip = {
  id: 'Sword_Formation',
  name: 'Celestial Immortal Thousand Sword Array Formation',
  category: 'BOSS_PHASE',
  duration: 2.4,
  fps: 30,
  loop: false,
  rootMotion: false,
  events: [
    { name: 'VFX_Spawn', normalizedTime: 0.15, paramString: 'thousand_flying_swords' },
    { name: 'Camera_Shake', normalizedTime: 0.65, paramFloat: 0.55 },
  ],
  keyframes: [],
  evaluate: (t: number) => {
    const map = new Map();
    const hover = Math.sin(t * 3.2) * 0.08;

    setRot(map, 'bone_hips', 0, 0, 0, [0, 1.85 + hover, 0]);
    setRot(map, 'bone_shoulder_l', -1.45, 0.65, 0.35);
    setRot(map, 'bone_shoulder_r', -1.45, -0.65, -0.35);
    setRot(map, 'bone_robe_lower', 0.75, 0, 0);

    return map;
  },
};

/**
 * MASTER ANIMATION REGISTRY FOR VẠN ĐẠO TIÊN ĐỒ
 */
export const XIANXIA_ANIMATION_LIBRARY: Record<string, XianxiaAnimationClip> = {
  // Locomotion
  Idle: CLIP_HUMANOID_IDLE,
  Idle_Alternate: CLIP_HUMANOID_IDLE_ALTERNATE,
  Walk: CLIP_HUMANOID_WALK,
  Run: CLIP_HUMANOID_RUN,
  Sprint: CLIP_HUMANOID_SPRINT,
  Dash: CLIP_HUMANOID_DASH,
  Dodge: CLIP_HUMANOID_DODGE,
  Fly_Idle: CLIP_HUMANOID_FLY_IDLE,
  Fly_Move: CLIP_HUMANOID_FLY_MOVE,

  // Combat
  Sword_Attack_01: CLIP_SWORD_ATTACK_01,
  Sword_Attack_02: CLIP_SWORD_ATTACK_02,
  Sword_Attack_03: CLIP_SWORD_ATTACK_03,
  Sword_Combo_Finisher: CLIP_SWORD_COMBO_FINISHER,
  Spell_Cast: CLIP_SPELL_CAST,
  Take_Hit_Front: CLIP_TAKE_HIT_FRONT,
  Death: CLIP_DEATH,

  // Cultivation
  Cultivation_Idle: CLIP_CULTIVATION_IDLE,
  Tribulation_Hit: CLIP_TRIBULATION_HIT,
  Ascension: CLIP_ASCENSION,

  // NPC
  Idle_Beard_Stroke: CLIP_SECT_ELDER_BEARD,
  Stir_Cauldron: CLIP_ALCHEMIST_STIR,

  // Monsters
  Fox_Idle: CLIP_FOX_IDLE,
  Fox_Pounce: CLIP_FOX_POUNCE,
  Serpent_Slither: CLIP_SERPENT_SLITHER,
  Phoenix_Fly: CLIP_PHOENIX_FLY,

  // Bosses
  Ground_Slam: CLIP_DEMON_LORD_SLAM,
  Ice_Breath: CLIP_ICE_DRAGON_BREATH,
  Sword_Formation: CLIP_CELESTIAL_SWORD_FORMATION,
};

/**
 * Returns list of compatible animation clips for a given character
 */
export function getAvailableClipsForCharacter(charId: string): XianxiaAnimationClip[] {
  if (charId === 'mon_nine_tailed_fox') {
    return [CLIP_FOX_IDLE, CLIP_FOX_POUNCE];
  }
  if (charId === 'mon_serpent' || charId === 'boss_ice_dragon') {
    return [CLIP_SERPENT_SLITHER, CLIP_ICE_DRAGON_BREATH];
  }
  if (charId === 'mon_phoenix' || charId === 'mount_immortal_crane') {
    return [CLIP_PHOENIX_FLY];
  }
  if (charId === 'boss_demon_lord') {
    return [CLIP_DEMON_LORD_SLAM, CLIP_HUMANOID_IDLE, CLIP_HUMANOID_WALK, CLIP_TAKE_HIT_FRONT, CLIP_DEATH];
  }
  if (charId === 'boss_celestial_immortal') {
    return [CLIP_CELESTIAL_SWORD_FORMATION, CLIP_HUMANOID_FLY_IDLE, CLIP_HUMANOID_FLY_MOVE, CLIP_SPELL_CAST];
  }
  if (charId === 'npc_sect_elder') {
    return [CLIP_SECT_ELDER_BEARD, CLIP_HUMANOID_IDLE, CLIP_HUMANOID_WALK];
  }
  if (charId === 'npc_alchemist') {
    return [CLIP_ALCHEMIST_STIR, CLIP_HUMANOID_IDLE, CLIP_HUMANOID_WALK];
  }
  // Default Humanoid Player Library
  return [
    CLIP_HUMANOID_IDLE,
    CLIP_HUMANOID_IDLE_ALTERNATE,
    CLIP_HUMANOID_WALK,
    CLIP_HUMANOID_RUN,
    CLIP_HUMANOID_SPRINT,
    CLIP_HUMANOID_DASH,
    CLIP_HUMANOID_DODGE,
    CLIP_HUMANOID_FLY_IDLE,
    CLIP_HUMANOID_FLY_MOVE,
    CLIP_SWORD_ATTACK_01,
    CLIP_SWORD_ATTACK_02,
    CLIP_SWORD_ATTACK_03,
    CLIP_SWORD_COMBO_FINISHER,
    CLIP_SPELL_CAST,
    CLIP_TAKE_HIT_FRONT,
    CLIP_DEATH,
    CLIP_CULTIVATION_IDLE,
    CLIP_TRIBULATION_HIT,
    CLIP_ASCENSION,
  ];
}
