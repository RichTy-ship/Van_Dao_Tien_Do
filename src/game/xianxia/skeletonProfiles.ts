import * as THREE from 'three';
import { SkeletonProfileDef, SkeletonProfileType, SocketDef } from './types';

/**
 * SKELETON PROFILES FOR VẠN ĐẠO TIÊN ĐỒ
 * Handcrafted, anatomically validated bone hierarchies with IK poles,
 * secondary dynamics anchors and weapon/VFX sockets.
 */

// Helper to construct a bone node
function bn(
  name: string,
  index: number,
  parentName: string | null,
  rx: number, ry: number, rz: number,
  limits?: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number }
) {
  return {
    name,
    index,
    parentName,
    restPosition: [rx, ry, rz] as [number, number, number],
    restRotation: [0, 0, 0, 1] as [number, number, number, number],
    restScale: [1, 1, 1] as [number, number, number],
    limits,
  };
}

export const HUMANOID_BASE_PROFILE: SkeletonProfileDef = {
  type: 'HUMANOID_BASE',
  rootBoneName: 'bone_hips',
  bones: [
    bn('bone_hips', 0, null, 0, 0.95, 0),
    bn('bone_spine', 1, 'bone_hips', 0, 0.15, 0),
    bn('bone_spine1', 2, 'bone_spine', 0, 0.15, 0),
    bn('bone_chest', 3, 'bone_spine1', 0, 0.15, 0),
    bn('bone_neck', 4, 'bone_chest', 0, 0.12, 0),
    bn('bone_head', 5, 'bone_neck', 0, 0.15, 0),
    // Left Arm
    bn('bone_clavicle_l', 6, 'bone_chest', 0.08, 0.10, 0),
    bn('bone_shoulder_l', 7, 'bone_clavicle_l', 0.18, 0, 0),
    bn('bone_elbow_l', 8, 'bone_shoulder_l', 0.28, 0, 0),
    bn('bone_wrist_l', 9, 'bone_elbow_l', 0.26, 0, 0),
    bn('bone_hand_l', 10, 'bone_wrist_l', 0.10, 0, 0),
    // Right Arm
    bn('bone_clavicle_r', 11, 'bone_chest', -0.08, 0.10, 0),
    bn('bone_shoulder_r', 12, 'bone_clavicle_r', -0.18, 0, 0),
    bn('bone_elbow_r', 13, 'bone_shoulder_r', -0.28, 0, 0),
    bn('bone_wrist_r', 14, 'bone_elbow_r', -0.26, 0, 0),
    bn('bone_hand_r', 15, 'bone_wrist_r', -0.10, 0, 0),
    // Left Leg
    bn('bone_thigh_l', 16, 'bone_hips', 0.12, -0.05, 0),
    bn('bone_knee_l', 17, 'bone_thigh_l', 0, -0.42, 0),
    bn('bone_ankle_l', 18, 'bone_knee_l', 0, -0.40, 0),
    bn('bone_toe_l', 19, 'bone_ankle_l', 0, -0.08, 0.14),
    // Right Leg
    bn('bone_thigh_r', 20, 'bone_hips', -0.12, -0.05, 0),
    bn('bone_knee_r', 21, 'bone_thigh_r', 0, -0.42, 0),
    bn('bone_ankle_r', 22, 'bone_knee_r', 0, -0.40, 0),
    bn('bone_toe_r', 23, 'bone_ankle_r', 0, -0.08, 0.14),
    // Xianxia Robe / Cape Dynamics Chain (Independent from legs to prevent tearing)
    bn('bone_robe_root', 24, 'bone_chest', 0, -0.05, -0.12),
    bn('bone_robe_mid', 25, 'bone_robe_root', 0, -0.38, -0.02),
    bn('bone_robe_lower', 26, 'bone_robe_mid', 0, -0.45, -0.02),
    // Left Ribbon / Sleeve Dynamics
    bn('bone_sleeve_l_root', 27, 'bone_elbow_l', 0.05, -0.05, 0),
    bn('bone_sleeve_l_tip', 28, 'bone_sleeve_l_root', 0.15, -0.20, -0.05),
    // Right Ribbon / Sleeve Dynamics
    bn('bone_sleeve_r_root', 29, 'bone_elbow_r', -0.05, -0.05, 0),
    bn('bone_sleeve_r_tip', 30, 'bone_sleeve_r_root', -0.15, -0.20, -0.05),
  ],
  ikChains: [
    {
      name: 'FootIK_L',
      targetBoneName: 'bone_toe_l',
      effectorBoneName: 'bone_ankle_l',
      chainLength: 2,
      poleBoneName: 'bone_knee_l',
    },
    {
      name: 'FootIK_R',
      targetBoneName: 'bone_toe_r',
      effectorBoneName: 'bone_ankle_r',
      chainLength: 2,
      poleBoneName: 'bone_knee_r',
    },
    {
      name: 'HandIK_L',
      targetBoneName: 'bone_hand_l',
      effectorBoneName: 'bone_wrist_l',
      chainLength: 2,
      poleBoneName: 'bone_elbow_l',
    },
    {
      name: 'HandIK_R',
      targetBoneName: 'bone_hand_r',
      effectorBoneName: 'bone_wrist_r',
      chainLength: 2,
      poleBoneName: 'bone_elbow_r',
    },
  ],
  sockets: {
    RightHandSocket: {
      name: 'RightHandSocket',
      boneName: 'bone_hand_r',
      offsetPos: [0, -0.02, 0.04],
      offsetRot: [1.22, 0, 0.52], // Perfect Xianxia sword grip angle (forward-up angled blade)
    },
    LeftHandSocket: {
      name: 'LeftHandSocket',
      boneName: 'bone_hand_l',
      offsetPos: [0, -0.02, 0.04],
      offsetRot: [1.22, 0, -0.52],
    },
    SheathBackSocket: {
      name: 'SheathBackSocket',
      boneName: 'bone_chest',
      offsetPos: [0.08, 0.05, -0.16],
      offsetRot: [0, 0, 0.45], // Diagonal scabbard on upper back
    },
    DanTianSocket: {
      name: 'DanTianSocket',
      boneName: 'bone_hips',
      offsetPos: [0, 0.05, 0.08],
      offsetRot: [0, 0, 0], // Center of Qi cultivation golden core
    },
    CrownAuraSocket: {
      name: 'CrownAuraSocket',
      boneName: 'bone_head',
      offsetPos: [0, 0.22, 0],
      offsetRot: [0, 0, 0], // Celestial halo & spiritual crown
    },
  },
};

export const QUADRUPED_BASE_PROFILE: SkeletonProfileDef = {
  type: 'QUADRUPED_BASE',
  rootBoneName: 'bone_quad_pelvis',
  bones: [
    bn('bone_quad_pelvis', 0, null, 0, 0.70, -0.35),
    bn('bone_quad_spine_rear', 1, 'bone_quad_pelvis', 0, 0.05, 0.22),
    bn('bone_quad_spine_mid', 2, 'bone_quad_spine_rear', 0, 0.04, 0.25),
    bn('bone_quad_chest', 3, 'bone_quad_spine_mid', 0, 0.05, 0.28),
    bn('bone_quad_neck', 4, 'bone_quad_chest', 0, 0.18, 0.24),
    bn('bone_quad_head', 5, 'bone_quad_neck', 0, 0.12, 0.18),
    bn('bone_quad_jaw', 6, 'bone_quad_head', 0, -0.08, 0.12),
    bn('bone_quad_ear_l', 7, 'bone_quad_head', 0.10, 0.14, -0.05),
    bn('bone_quad_ear_r', 8, 'bone_quad_head', -0.10, 0.14, -0.05),
    // Foreleg L
    bn('bone_quad_shoulder_l', 9, 'bone_quad_chest', 0.18, -0.10, 0.08),
    bn('bone_quad_foreleg_l', 10, 'bone_quad_shoulder_l', 0, -0.30, -0.04),
    bn('bone_quad_wrist_l', 11, 'bone_quad_foreleg_l', 0, -0.28, 0.02),
    bn('bone_quad_paw_fl', 12, 'bone_quad_wrist_l', 0, -0.08, 0.08),
    // Foreleg R
    bn('bone_quad_shoulder_r', 13, 'bone_quad_chest', -0.18, -0.10, 0.08),
    bn('bone_quad_foreleg_r', 14, 'bone_quad_shoulder_r', 0, -0.30, -0.04),
    bn('bone_quad_wrist_r', 15, 'bone_quad_foreleg_r', 0, -0.28, 0.02),
    bn('bone_quad_paw_fr', 16, 'bone_quad_wrist_r', 0, -0.08, 0.08),
    // Hindleg L
    bn('bone_quad_thigh_l', 17, 'bone_quad_pelvis', 0.16, -0.08, -0.05),
    bn('bone_quad_knee_l', 18, 'bone_quad_thigh_l', 0, -0.32, -0.10),
    bn('bone_quad_hock_l', 19, 'bone_quad_knee_l', 0, -0.26, 0.08),
    bn('bone_quad_paw_hl', 20, 'bone_quad_hock_l', 0, -0.10, 0.06),
    // Hindleg R
    bn('bone_quad_thigh_r', 21, 'bone_quad_pelvis', -0.16, -0.08, -0.05),
    bn('bone_quad_knee_r', 22, 'bone_quad_thigh_r', 0, -0.32, -0.10),
    bn('bone_quad_hock_r', 23, 'bone_quad_knee_r', 0, -0.26, 0.08),
    bn('bone_quad_paw_hr', 24, 'bone_quad_hock_r', 0, -0.10, 0.06),
    // Tail chain (Base quadruped tail)
    bn('bone_quad_tail_1', 25, 'bone_quad_pelvis', 0, 0.02, -0.15),
    bn('bone_quad_tail_2', 26, 'bone_quad_tail_1', 0, -0.04, -0.22),
    bn('bone_quad_tail_3', 27, 'bone_quad_tail_2', 0, -0.02, -0.22),
    bn('bone_quad_tail_4', 28, 'bone_quad_tail_3', 0, 0.02, -0.20),
  ],
  sockets: {
    SaddleSocket: {
      name: 'SaddleSocket',
      boneName: 'bone_quad_spine_mid',
      offsetPos: [0, 0.22, 0],
      offsetRot: [0, 0, 0],
    },
    MawSocket: {
      name: 'MawSocket',
      boneName: 'bone_quad_head',
      offsetPos: [0, -0.04, 0.24],
      offsetRot: [0, 0, 0],
    },
  },
};

// NINE-TAILED FOX PROFILE: 9 Independent 4-Segment Tail Chains (36 tail bones total!)
export function buildNineTailedFoxProfile(): SkeletonProfileDef {
  const profile: SkeletonProfileDef = JSON.parse(JSON.stringify(QUADRUPED_BASE_PROFILE));
  // Remove single default tail
  profile.bones = profile.bones.filter((b) => !b.name.startsWith('bone_quad_tail'));

  // Add 9 separate tail chains arrayed radially across the sacrum
  let idx = profile.bones.length;
  const tailAngles = [-0.75, -0.56, -0.38, -0.19, 0.0, 0.19, 0.38, 0.56, 0.75]; // Fan-out yaw angles

  for (let t = 0; t < 9; t++) {
    const yaw = tailAngles[t];
    const pitch = 0.25 + 0.12 * Math.cos(yaw * 2);
    const rad = 0.18;
    const offsetX = Math.sin(yaw) * rad;
    const offsetY = 0.04 + Math.abs(yaw) * 0.06;
    const offsetZ = -0.14 - Math.cos(yaw) * 0.08;

    const baseName = `bone_fox_tail_${t + 1}_base`;
    const midName = `bone_fox_tail_${t + 1}_mid`;
    const subName = `bone_fox_tail_${t + 1}_sub`;
    const tipName = `bone_fox_tail_${t + 1}_tip`;

    profile.bones.push(bn(baseName, idx++, 'bone_quad_pelvis', offsetX, offsetY, offsetZ));
    profile.bones.push(bn(midName, idx++, baseName, Math.sin(yaw) * 0.22, pitch * 0.22, -0.25));
    profile.bones.push(bn(subName, idx++, midName, Math.sin(yaw) * 0.24, pitch * 0.24, -0.28));
    profile.bones.push(bn(tipName, idx++, subName, Math.sin(yaw) * 0.20, pitch * 0.20, -0.25));
  }
  return profile;
}

export const TREE_CREATURE_BASE_PROFILE: SkeletonProfileDef = {
  type: 'TREE_CREATURE_BASE',
  rootBoneName: 'bone_tree_root_core',
  bones: [
    bn('bone_tree_root_core', 0, null, 0, 0.60, 0),
    bn('bone_tree_trunk_low', 1, 'bone_tree_root_core', 0, 0.35, 0),
    bn('bone_tree_trunk_mid', 2, 'bone_tree_trunk_low', 0, 0.40, 0),
    bn('bone_tree_crown', 3, 'bone_tree_trunk_mid', 0, 0.45, 0),
    // 4 Ground Root Anchors (Moving leg roots)
    bn('bone_tree_root_fl_1', 4, 'bone_tree_root_core', 0.25, -0.20, 0.25),
    bn('bone_tree_root_fl_2', 5, 'bone_tree_root_fl_1', 0.20, -0.30, 0.20),
    bn('bone_tree_root_fr_1', 6, 'bone_tree_root_core', -0.25, -0.20, 0.25),
    bn('bone_tree_root_fr_2', 7, 'bone_tree_root_fr_1', -0.20, -0.30, 0.20),
    bn('bone_tree_root_bl_1', 8, 'bone_tree_root_core', 0.25, -0.20, -0.25),
    bn('bone_tree_root_bl_2', 9, 'bone_tree_root_bl_1', 0.20, -0.30, -0.20),
    bn('bone_tree_root_br_1', 10, 'bone_tree_root_core', -0.25, -0.20, -0.25),
    bn('bone_tree_root_br_2', 11, 'bone_tree_root_br_1', -0.20, -0.30, -0.20),
    // Branch Arms
    bn('bone_tree_branch_l_1', 12, 'bone_tree_trunk_mid', 0.35, 0.15, 0),
    bn('bone_tree_branch_l_2', 13, 'bone_tree_branch_l_1', 0.40, 0.05, 0.10),
    bn('bone_tree_branch_l_3', 14, 'bone_tree_branch_l_2', 0.35, -0.10, 0.15),
    bn('bone_tree_branch_r_1', 15, 'bone_tree_trunk_mid', -0.35, 0.15, 0),
    bn('bone_tree_branch_r_2', 16, 'bone_tree_branch_r_1', -0.40, 0.05, 0.10),
    bn('bone_tree_branch_r_3', 17, 'bone_tree_branch_r_2', -0.35, -0.10, 0.15),
    // Vine Whips
    bn('bone_tree_vine_1', 18, 'bone_tree_crown', 0.15, 0.20, 0.15),
    bn('bone_tree_vine_2', 19, 'bone_tree_crown', -0.15, 0.20, 0.15),
  ],
  sockets: {
    RootSproutSocket: {
      name: 'RootSproutSocket',
      boneName: 'bone_tree_root_core',
      offsetPos: [0, -0.45, 0],
      offsetRot: [0, 0, 0],
    },
    VineStrikeSocket: {
      name: 'VineStrikeSocket',
      boneName: 'bone_tree_branch_r_3',
      offsetPos: [0, 0, 0.25],
      offsetRot: [0, 0, 0],
    },
  },
};

export const SERPENT_BASE_PROFILE: SkeletonProfileDef = {
  type: 'SERPENT_BASE',
  rootBoneName: 'bone_serpent_vertebra_01',
  bones: [
    bn('bone_serpent_vertebra_01', 0, null, 0, 0.18, 0),
    bn('bone_serpent_vertebra_02', 1, 'bone_serpent_vertebra_01', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_03', 2, 'bone_serpent_vertebra_02', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_04', 3, 'bone_serpent_vertebra_03', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_05', 4, 'bone_serpent_vertebra_04', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_06', 5, 'bone_serpent_vertebra_05', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_07', 6, 'bone_serpent_vertebra_06', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_08', 7, 'bone_serpent_vertebra_07', 0, 0.02, -0.22),
    bn('bone_serpent_vertebra_09', 8, 'bone_serpent_vertebra_08', 0, 0.02, -0.20),
    bn('bone_serpent_vertebra_10', 9, 'bone_serpent_vertebra_09', 0, 0.02, -0.20),
    bn('bone_serpent_vertebra_11', 10, 'bone_serpent_vertebra_10', 0, 0.02, -0.18),
    bn('bone_serpent_vertebra_12', 11, 'bone_serpent_vertebra_11', 0, 0.02, -0.18),
    bn('bone_serpent_vertebra_13', 12, 'bone_serpent_vertebra_12', 0, 0.02, -0.16),
    bn('bone_serpent_vertebra_14', 13, 'bone_serpent_vertebra_13', 0, 0.02, -0.16),
    bn('bone_serpent_vertebra_15', 14, 'bone_serpent_vertebra_14', 0, 0.02, -0.14),
    bn('bone_serpent_vertebra_16', 15, 'bone_serpent_vertebra_15', 0, 0.02, -0.14),
    // Cobra / Dragon Raised Hood & Head
    bn('bone_serpent_neck', 16, 'bone_serpent_vertebra_01', 0, 0.25, 0.15),
    bn('bone_serpent_head', 17, 'bone_serpent_neck', 0, 0.22, 0.20),
    bn('bone_serpent_jaw', 18, 'bone_serpent_head', 0, -0.06, 0.12),
    bn('bone_serpent_hood_l', 19, 'bone_serpent_neck', 0.22, 0.05, 0),
    bn('bone_serpent_hood_r', 20, 'bone_serpent_neck', -0.22, 0.05, 0),
  ],
  sockets: {
    PoisonBreathSocket: {
      name: 'PoisonBreathSocket',
      boneName: 'bone_serpent_head',
      offsetPos: [0, 0, 0.28],
      offsetRot: [0, 0, 0],
    },
    TailStrikeSocket: {
      name: 'TailStrikeSocket',
      boneName: 'bone_serpent_vertebra_16',
      offsetPos: [0, 0, -0.10],
      offsetRot: [0, 0, 0],
    },
  },
};

export const BIRD_BASE_PROFILE: SkeletonProfileDef = {
  type: 'BIRD_BASE',
  rootBoneName: 'bone_bird_pelvis',
  bones: [
    bn('bone_bird_pelvis', 0, null, 0, 0.85, 0),
    bn('bone_bird_chest', 1, 'bone_bird_pelvis', 0, 0.15, 0.20),
    bn('bone_bird_neck_1', 2, 'bone_bird_chest', 0, 0.20, 0.15),
    bn('bone_bird_neck_2', 3, 'bone_bird_neck_1', 0, 0.22, 0.08),
    bn('bone_bird_head', 4, 'bone_bird_neck_2', 0, 0.18, 0.12),
    bn('bone_bird_beak', 5, 'bone_bird_head', 0, -0.04, 0.16),
    // Wings Left
    bn('bone_bird_wing_sh_l', 6, 'bone_bird_chest', 0.20, 0.08, 0.05),
    bn('bone_bird_wing_elbow_l', 7, 'bone_bird_wing_sh_l', 0.45, 0.05, -0.08),
    bn('bone_bird_wing_wrist_l', 8, 'bone_bird_wing_elbow_l', 0.50, -0.05, 0.15),
    bn('bone_bird_wing_tip_l', 9, 'bone_bird_wing_wrist_l', 0.45, -0.10, 0.10),
    // Wings Right
    bn('bone_bird_wing_sh_r', 10, 'bone_bird_chest', -0.20, 0.08, 0.05),
    bn('bone_bird_wing_elbow_r', 11, 'bone_bird_wing_sh_r', -0.45, 0.05, -0.08),
    bn('bone_bird_wing_wrist_r', 12, 'bone_bird_wing_elbow_r', -0.50, -0.05, 0.15),
    bn('bone_bird_wing_tip_r', 13, 'bone_bird_wing_wrist_r', -0.45, -0.10, 0.10),
    // Talons
    bn('bone_bird_thigh_l', 14, 'bone_bird_pelvis', 0.14, -0.12, 0),
    bn('bone_bird_shin_l', 15, 'bone_bird_thigh_l', 0, -0.32, -0.05),
    bn('bone_bird_talon_l', 16, 'bone_bird_shin_l', 0, -0.25, 0.08),
    bn('bone_bird_thigh_r', 17, 'bone_bird_pelvis', -0.14, -0.12, 0),
    bn('bone_bird_shin_r', 18, 'bone_bird_thigh_r', 0, -0.32, -0.05),
    bn('bone_bird_talon_r', 19, 'bone_bird_shin_r', 0, -0.25, 0.08),
    // Tail Plumage Fan
    bn('bone_bird_tail_1', 20, 'bone_bird_pelvis', 0, -0.05, -0.25),
    bn('bone_bird_tail_2', 21, 'bone_bird_tail_1', 0, -0.10, -0.35),
    bn('bone_bird_tail_3', 22, 'bone_bird_tail_2', 0, -0.12, -0.40),
  ],
  sockets: {
    BeakFlamesSocket: {
      name: 'BeakFlamesSocket',
      boneName: 'bone_bird_beak',
      offsetPos: [0, 0, 0.22],
      offsetRot: [0, 0, 0],
    },
    WingL_VfxSocket: {
      name: 'WingL_VfxSocket',
      boneName: 'bone_bird_wing_tip_l',
      offsetPos: [0, 0, 0],
      offsetRot: [0, 0, 0],
    },
    WingR_VfxSocket: {
      name: 'WingR_VfxSocket',
      boneName: 'bone_bird_wing_tip_r',
      offsetPos: [0, 0, 0],
      offsetRot: [0, 0, 0],
    },
  },
};

export const GOLEM_BASE_PROFILE: SkeletonProfileDef = {
  type: 'GOLEM_BASE',
  rootBoneName: 'bone_golem_core_pelvis',
  bones: [
    bn('bone_golem_core_pelvis', 0, null, 0, 1.2, 0),
    bn('bone_golem_torso', 1, 'bone_golem_core_pelvis', 0, 0.55, 0),
    bn('bone_golem_head', 2, 'bone_golem_torso', 0, 0.50, 0.05),
    // Monolithic Massive Arms
    bn('bone_golem_shoulder_l', 3, 'bone_golem_torso', 0.55, 0.25, 0),
    bn('bone_golem_elbow_l', 4, 'bone_golem_shoulder_l', 0.50, -0.40, 0),
    bn('bone_golem_fist_l', 5, 'bone_golem_elbow_l', 0.45, -0.45, 0),
    bn('bone_golem_shoulder_r', 6, 'bone_golem_torso', -0.55, 0.25, 0),
    bn('bone_golem_elbow_r', 7, 'bone_golem_shoulder_r', -0.50, -0.40, 0),
    bn('bone_golem_fist_r', 8, 'bone_golem_elbow_r', -0.45, -0.45, 0),
    // Massive Stone Pillar Legs
    bn('bone_golem_thigh_l', 9, 'bone_golem_core_pelvis', 0.35, -0.15, 0),
    bn('bone_golem_knee_l', 10, 'bone_golem_thigh_l', 0, -0.45, 0),
    bn('bone_golem_foot_l', 11, 'bone_golem_knee_l', 0, -0.50, 0.10),
    bn('bone_golem_thigh_r', 12, 'bone_golem_core_pelvis', -0.35, -0.15, 0),
    bn('bone_golem_knee_r', 13, 'bone_golem_thigh_r', 0, -0.45, 0),
    bn('bone_golem_foot_r', 14, 'bone_golem_knee_r', 0, -0.50, 0.10),
    // Floating Runic Monoliths
    bn('bone_golem_monolith_1', 15, 'bone_golem_torso', 0.40, 0.65, -0.25),
    bn('bone_golem_monolith_2', 16, 'bone_golem_torso', -0.40, 0.65, -0.25),
    bn('bone_golem_heart_crystal', 17, 'bone_golem_torso', 0, 0.10, 0.28),
  ],
  sockets: {
    HeartCoreSocket: {
      name: 'HeartCoreSocket',
      boneName: 'bone_golem_heart_crystal',
      offsetPos: [0, 0, 0],
      offsetRot: [0, 0, 0],
    },
    FistShockwaveSocket: {
      name: 'FistShockwaveSocket',
      boneName: 'bone_golem_fist_r',
      offsetPos: [0, -0.20, 0],
      offsetRot: [0, 0, 0],
    },
  },
};

export const MOUNT_BASE_PROFILE: SkeletonProfileDef = {
  type: 'MOUNT_BASE',
  rootBoneName: 'bone_mount_root',
  bones: [
    bn('bone_mount_root', 0, null, 0, 0.85, 0),
    bn('bone_mount_saddle', 1, 'bone_mount_root', 0, 0.15, 0),
    bn('bone_mount_front', 2, 'bone_mount_saddle', 0, 0.10, 0.35),
    bn('bone_mount_rear', 3, 'bone_mount_saddle', 0, -0.05, -0.35),
    // Stabilization Wing / Fin / Blade sockets
    bn('bone_mount_fin_l', 4, 'bone_mount_saddle', 0.45, 0.05, 0),
    bn('bone_mount_fin_r', 5, 'bone_mount_saddle', -0.45, 0.05, 0),
    bn('bone_mount_keel', 6, 'bone_mount_root', 0, -0.35, 0),
  ],
  sockets: {
    RiderSocket: {
      name: 'RiderSocket',
      boneName: 'bone_mount_saddle',
      offsetPos: [0, 0.18, 0],
      offsetRot: [0, 0, 0],
    },
    FlightVFXSocket: {
      name: 'FlightVFXSocket',
      boneName: 'bone_mount_rear',
      offsetPos: [0, 0, -0.40],
      offsetRot: [0, 0, 0],
    },
  },
};

/**
 * Registry mapping profile type to its definition.
 */
export const SKELETON_PROFILES: Record<SkeletonProfileType, SkeletonProfileDef> = {
  HUMANOID_BASE: HUMANOID_BASE_PROFILE,
  QUADRUPED_BASE: QUADRUPED_BASE_PROFILE,
  TREE_CREATURE_BASE: TREE_CREATURE_BASE_PROFILE,
  SERPENT_BASE: SERPENT_BASE_PROFILE,
  BIRD_BASE: BIRD_BASE_PROFILE,
  GOLEM_BASE: GOLEM_BASE_PROFILE,
  MOUNT_BASE: MOUNT_BASE_PROFILE,
};

/**
 * Builds actual Three.js THREE.Bone hierarchy and THREE.Skeleton instance for a profile.
 */
export function buildThreeSkeletonForProfile(profileDef: SkeletonProfileDef): {
  rootBone: THREE.Bone;
  skeleton: THREE.Skeleton;
  boneMap: Map<string, THREE.Bone>;
} {
  const boneMap = new Map<string, THREE.Bone>();
  const bonesArray: THREE.Bone[] = [];

  // First create all bone objects
  for (const node of profileDef.bones) {
    const bone = new THREE.Bone();
    bone.name = node.name;
    bone.position.set(...node.restPosition);
    bone.quaternion.set(...node.restRotation);
    bone.scale.set(...node.restScale);
    boneMap.set(node.name, bone);
    bonesArray.push(bone);
  }

  // Next build hierarchy
  let rootBone: THREE.Bone | null = null;
  for (const node of profileDef.bones) {
    const bone = boneMap.get(node.name)!;
    if (node.parentName === null) {
      rootBone = bone;
    } else {
      const parent = boneMap.get(node.parentName);
      if (parent) {
        parent.add(bone);
      }
    }
  }

  if (!rootBone) {
    rootBone = bonesArray[0];
  }

  rootBone.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bonesArray);

  return { rootBone, skeleton, boneMap };
}
