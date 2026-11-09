import * as THREE from 'three';
import {
  HUMANOID_BASE_PROFILE,
  QUADRUPED_BASE_PROFILE,
  TREE_CREATURE_BASE_PROFILE,
  SERPENT_BASE_PROFILE,
  BIRD_BASE_PROFILE,
  GOLEM_BASE_PROFILE,
  MOUNT_BASE_PROFILE,
  buildNineTailedFoxProfile,
  buildThreeSkeletonForProfile,
  SKELETON_PROFILES,
} from '../src/game/xianxia/skeletonProfiles';
import {
  XIANXIA_CHARACTERS,
  createXianxiaRiggedCharacter,
  CULTIVATION_STAGE_VFX_CONFIG,
} from '../src/game/xianxia/xianxiaRigs';
import {
  XIANXIA_ANIMATION_LIBRARY,
  getAvailableClipsForCharacter,
} from '../src/game/xianxia/xianxiaAnimationClips';
import { XianxiaAnimationController } from '../src/game/xianxia/animationController';
import { CharacterId, CultivationStage } from '../src/game/xianxia/types';

console.log('================================================================');
console.log('🧪 VERIFYING VẠN ĐẠO TIÊN ĐỒ XIANXIA ANIMATION SYSTEM');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${msg}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: SKELETON ARCHITECTURE PROFILES
// -----------------------------------------------------------------------------
console.log('--- TEST 1: SKELETON ARCHITECTURE & THREE.JS BONE HIERARCHIES ---');
const profiles = [
  { name: 'HUMANOID_BASE', def: HUMANOID_BASE_PROFILE, minBones: 25 },
  { name: 'QUADRUPED_BASE', def: QUADRUPED_BASE_PROFILE, minBones: 25 },
  { name: 'NINE_TAILED_FOX', def: buildNineTailedFoxProfile(), minBones: 60 },
  { name: 'TREE_CREATURE_BASE', def: TREE_CREATURE_BASE_PROFILE, minBones: 18 },
  { name: 'SERPENT_BASE', def: SERPENT_BASE_PROFILE, minBones: 20 },
  { name: 'BIRD_BASE', def: BIRD_BASE_PROFILE, minBones: 22 },
  { name: 'GOLEM_BASE', def: GOLEM_BASE_PROFILE, minBones: 16 },
  { name: 'MOUNT_BASE', def: MOUNT_BASE_PROFILE, minBones: 6 },
];

for (const p of profiles) {
  const { rootBone, skeleton, boneMap } = buildThreeSkeletonForProfile(p.def);
  assert(
    skeleton.bones.length >= p.minBones,
    `Profile ${p.name} constructed with ${skeleton.bones.length} bones (Expected >= ${p.minBones})`
  );
  assert(rootBone.name === p.def.rootBoneName, `Profile ${p.name} root bone is '${rootBone.name}'`);
  assert(boneMap.size === skeleton.bones.length, `Profile ${p.name} boneMap indexed all bones`);
}

// -----------------------------------------------------------------------------
// TEST 2: ALL CHARACTER RIGS & 7 CULTIVATION REALMS
// -----------------------------------------------------------------------------
console.log('\n--- TEST 2: ALL CHARACTER MODELS & 7 CULTIVATION REALMS ---');
const characterIds = Object.keys(XIANXIA_CHARACTERS) as CharacterId[];
const stages: CultivationStage[] = [
  'Mortal',
  'Qi Refining',
  'Foundation Establishment',
  'Golden Core',
  'Nascent Soul',
  'Soul Formation',
  'Tribulation',
];

// Test all 7 stages on player
for (const stage of stages) {
  const { group, skeleton, skinnedMesh, socketAnchors } = createXianxiaRiggedCharacter('player_male', stage);
  assert(skinnedMesh instanceof THREE.SkinnedMesh, `Player Male at ${stage} creates valid SkinnedMesh`);
  assert(skinnedMesh.skeleton === skeleton, `Player Male at ${stage} is bound to its skeleton`);
  assert(socketAnchors.has('RightHandSocket'), `Player Male has RightHandSocket for flying sword`);
  assert(socketAnchors.has('DanTianSocket'), `Player Male has DanTianSocket for golden core`);
}

// Test all character definitions
for (const charId of characterIds) {
  const { group, skeleton, skinnedMesh } = createXianxiaRiggedCharacter(charId);
  const vCount = skinnedMesh.geometry.attributes.position.count;
  assert(
    vCount > 0,
    `Character [${charId}] built successfully with ${skeleton.bones.length} bones & ${vCount} skinned vertices`
  );
}

// -----------------------------------------------------------------------------
// TEST 3: ANIMATION CLIPS EVALUATION & ZERO-NAN CHECK
// -----------------------------------------------------------------------------
console.log('\n--- TEST 3: ANIMATION CLIPS EVALUATION & QUATERNION SANITY ---');
const allClips = Object.values(XIANXIA_ANIMATION_LIBRARY);

for (const clip of allClips) {
  assert(clip.duration > 0, `Clip [${clip.id}] has valid duration: ${clip.duration}s`);

  if (clip.evaluate) {
    const testTimes = [0, clip.duration * 0.25, clip.duration * 0.5, clip.duration * 0.75, clip.duration];
    let nanFound = false;
    let unnormalizedFound = false;

    for (const t of testTimes) {
      const boneMap = clip.evaluate(t);
      for (const [boneName, transform] of boneMap.entries()) {
        const q = transform.quat;
        if (isNaN(q.x) || isNaN(q.y) || isNaN(q.z) || isNaN(q.w)) {
          nanFound = true;
        }
        const len = q.length();
        if (Math.abs(len - 1.0) > 0.05) {
          unnormalizedFound = true;
        }
      }
    }

    assert(!nanFound, `Clip [${clip.id}] evaluated with 0 NaN values across all keyframes`);
    assert(!unnormalizedFound, `Clip [${clip.id}] evaluated with unit-length normalized quaternions`);
  }
}

// -----------------------------------------------------------------------------
// TEST 4: NINE-TAILED FOX 9-TAIL INDEPENDENCE
// -----------------------------------------------------------------------------
console.log('\n--- TEST 4: NINE-TAILED FOX 9 INDEPENDENT TAILS ---');
const foxClip = XIANXIA_ANIMATION_LIBRARY.Fox_Idle;
if (foxClip && foxClip.evaluate) {
  const samplesT0 = foxClip.evaluate(0.0);
  const tail1TipQ = samplesT0.get('bone_fox_tail_1_tip')?.quat;
  const tail5TipQ = samplesT0.get('bone_fox_tail_5_tip')?.quat;
  const tail9TipQ = samplesT0.get('bone_fox_tail_9_tip')?.quat;

  assert(tail1TipQ !== undefined && tail5TipQ !== undefined && tail9TipQ !== undefined, 'All 9 tails evaluated');
  if (tail1TipQ && tail5TipQ && tail9TipQ) {
    const diff15 = tail1TipQ.angleTo(tail5TipQ);
    const diff59 = tail5TipQ.angleTo(tail9TipQ);
    assert(
      diff15 > 0.05 && diff59 > 0.05,
      `Tails possess distinct wave angles (Angle T1-T5: ${diff15.toFixed(3)} rad, T5-T9: ${diff59.toFixed(3)} rad)`
    );
  }
}

// -----------------------------------------------------------------------------
// TEST 5: CONTROLLER COMBO CHAINING & NETWORK SYNCHRONIZATION
// -----------------------------------------------------------------------------
console.log('\n--- TEST 5: ANIMATION CONTROLLER COMBO BUFFER & NETWORK SYNC ---');
const { boneMap } = createXianxiaRiggedCharacter('player_male');
let capturedEvent: string | null = null;

const controller = new XianxiaAnimationController({
  characterId: 'player_male',
  boneMap,
  onEvent: (e) => {
    capturedEvent = e.name;
  },
});

assert(controller.currentClip.id === 'Idle', 'Controller starts in Idle state');

// Test attack input
controller.triggerAttackInput();
assert(controller.currentClip.id === 'Sword_Attack_01', 'Attack input transitions to Sword_Attack_01');

// Advance time into hit window and chain next combo
controller.update(0.36); // Reaches Hit_Window_Open
assert(controller.triggerAttackInput(), 'Combo attack buffered into Sword_Attack_02');
assert(controller.currentClip.id === 'Sword_Attack_02', 'Successfully chained into Sword_Attack_02');

// Test network serialization
const netState = controller.serializeNetworkState();
assert(netState.characterId === 'player_male', 'Network state serialized correct characterId');
assert(netState.currentClipId === 'Sword_Attack_02', 'Network state serialized active clip');
assert(netState.cultivationStage === 'Foundation Establishment', 'Network state serialized cultivation stage');

console.log('\n================================================================');
console.log(`📊 FINAL RESULT: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
