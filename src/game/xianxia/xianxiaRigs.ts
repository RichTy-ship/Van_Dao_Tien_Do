import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  CharacterDef,
  CharacterId,
  CultivationStage,
  SkeletonProfileDef,
  SkeletonProfileType,
  SocketDef,
} from './types';
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
} from './skeletonProfiles';

/**
 * 3D CHARACTER DEFINITIONS & PROCEDURAL RIG GENERATOR
 * VẠN ĐẠO TIÊN ĐỒ (Xianxia MMORPG)
 */

export const XIANXIA_CHARACTERS: Record<CharacterId, CharacterDef> = {
  // PLAYERS
  player_male: {
    id: 'player_male',
    name: 'Male Cultivator',
    vietnameseName: 'Nam Tu Tiên Giả',
    category: 'PLAYER',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Humanoid male sword cultivator seeking the Dao across 7 cultivation realms.',
    defaultCultivationStage: 'Foundation Establishment',
    height: 1.85,
    scale: 1.0,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  player_female: {
    id: 'player_female',
    name: 'Female Cultivator',
    vietnameseName: 'Nữ Tu Tiên Giả',
    category: 'PLAYER',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Graceful female sword & spell cultivator flowing like celestial clouds.',
    defaultCultivationStage: 'Foundation Establishment',
    height: 1.72,
    scale: 0.95,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },

  // NPCS
  npc_sect_elder: {
    id: 'npc_sect_elder',
    name: 'Sect Elder',
    vietnameseName: 'Tông Môn Trưởng Lão',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Venerable elder with flowing white beard, wielding sovereign sect authority.',
    defaultCultivationStage: 'Nascent Soul',
    height: 1.80,
    scale: 1.0,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  npc_hidden_immortal: {
    id: 'npc_hidden_immortal',
    name: 'Hidden Immortal',
    vietnameseName: 'Ẩn Thế Chân Tiên',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Eccentric hermit drinking spiritual tea from a celestial wine gourd.',
    defaultCultivationStage: 'Soul Formation',
    height: 1.75,
    scale: 0.98,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  npc_master: {
    id: 'npc_master',
    name: 'Sword Master',
    vietnameseName: 'Kiếm Đạo Sư Phụ',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Strict martial mentor demonstrating peerless sword forms and Qi flow.',
    defaultCultivationStage: 'Golden Core',
    height: 1.88,
    scale: 1.02,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  npc_healer: {
    id: 'npc_healer',
    name: 'Spiritual Healer',
    vietnameseName: 'Dược Sư Tố Nữ',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Compassionate medical cultivator diagnosing meridian pulses with jade needles.',
    defaultCultivationStage: 'Foundation Establishment',
    height: 1.70,
    scale: 0.94,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  npc_alchemist: {
    id: 'npc_alchemist',
    name: 'Grand Alchemist',
    vietnameseName: 'Luyện Đan Đại Sư',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Master of spirit flame, herbs, and nine-revolution golden pills.',
    defaultCultivationStage: 'Golden Core',
    height: 1.78,
    scale: 1.0,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  npc_qi_cultivator: {
    id: 'npc_qi_cultivator',
    name: 'Qi Cultivator Disciple',
    vietnameseName: 'Luyện Khí Đệ Tử',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Eager novice student reading Daoist scriptures and refining inner Qi.',
    defaultCultivationStage: 'Qi Refining',
    height: 1.74,
    scale: 0.96,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  npc_root_inspector: {
    id: 'npc_root_inspector',
    name: 'Spiritual Root Inspector',
    vietnameseName: 'Linh Căn Trắc Định Giả',
    category: 'NPC',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Testing magistrate assessing Heaven, Earth, and Heavenly Spiritual Roots.',
    defaultCultivationStage: 'Golden Core',
    height: 1.82,
    scale: 1.0,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },

  // MONSTERS
  mon_nine_tailed_fox: {
    id: 'mon_nine_tailed_fox',
    name: 'Nine-tailed Fox',
    vietnameseName: 'Cửu Vĩ Thiên Hồ',
    category: 'MONSTER',
    skeletonProfile: 'QUADRUPED_BASE',
    description: 'Mythical celestial beast with 9 independent mesmerizing tails and foxfire magic.',
    height: 1.40,
    scale: 1.25,
    sockets: Object.values(QUADRUPED_BASE_PROFILE.sockets),
  },
  mon_white_tiger: {
    id: 'mon_white_tiger',
    name: 'White Tiger',
    vietnameseName: 'Bạch Hổ Thần Thú',
    category: 'MONSTER',
    skeletonProfile: 'QUADRUPED_BASE',
    description: 'Ferocious sacred beast of the West with metallic claw attacks and roaring shockwaves.',
    height: 1.55,
    scale: 1.35,
    sockets: Object.values(QUADRUPED_BASE_PROFILE.sockets),
  },
  mon_demon_boar: {
    id: 'mon_demon_boar',
    name: 'Demon Boar',
    vietnameseName: 'Huyết Lực Ma Trư',
    category: 'MONSTER',
    skeletonProfile: 'QUADRUPED_BASE',
    description: 'Armored mountain fiend possessing devastating gore charge and earth stomps.',
    height: 1.60,
    scale: 1.40,
    sockets: Object.values(QUADRUPED_BASE_PROFILE.sockets),
  },
  mon_wood_spirit: {
    id: 'mon_wood_spirit',
    name: 'Wood Spirit',
    vietnameseName: 'Vạn Niên Mộc Tinh',
    category: 'MONSTER',
    skeletonProfile: 'TREE_CREATURE_BASE',
    description: 'Ancient botanical treant controlling subterranean root spears and creeping vines.',
    height: 2.80,
    scale: 1.50,
    sockets: Object.values(TREE_CREATURE_BASE_PROFILE.sockets),
  },
  mon_serpent: {
    id: 'mon_serpent',
    name: 'Venomous Serpent',
    vietnameseName: 'Thôn Thiên Cự Mãng',
    category: 'MONSTER',
    skeletonProfile: 'SERPENT_BASE',
    description: '16-segmented coiled basilisk spitting toxic corrosive spiritual miasma.',
    height: 1.20,
    scale: 1.30,
    sockets: Object.values(SERPENT_BASE_PROFILE.sockets),
  },
  mon_phoenix: {
    id: 'mon_phoenix',
    name: 'Vermilion Phoenix',
    vietnameseName: 'Chu Tước Chu Lôi Phượng',
    category: 'MONSTER',
    skeletonProfile: 'BIRD_BASE',
    description: 'Immortal avian god wrapped in burning Nirvana fire and hurricane gale bursts.',
    height: 2.20,
    scale: 1.45,
    sockets: Object.values(BIRD_BASE_PROFILE.sockets),
  },

  // BOSSES
  boss_demon_lord: {
    id: 'boss_demon_lord',
    name: 'Demon Lord',
    vietnameseName: 'Hắc Ám Ma Tôn',
    category: 'BOSS',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Supreme demonic overlord wielding a abyssal colossus cleaver with 3 phases.',
    defaultCultivationStage: 'Tribulation',
    height: 3.50,
    scale: 2.1,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },
  boss_ice_dragon: {
    id: 'boss_ice_dragon',
    name: 'Frost Dragon Sovereign',
    vietnameseName: 'Băng Sương Cự Long Vương',
    category: 'BOSS',
    skeletonProfile: 'SERPENT_BASE',
    description: 'Ancient horned wyrm reigning over glacial blizzards, freezing the heavens.',
    height: 4.20,
    scale: 2.6,
    sockets: Object.values(SERPENT_BASE_PROFILE.sockets),
  },
  boss_stone_guardian: {
    id: 'boss_stone_guardian',
    name: 'Ancient Stone Guardian',
    vietnameseName: 'Thượng Cổ Thạch Khôi Lỗi',
    category: 'BOSS',
    skeletonProfile: 'GOLEM_BASE',
    description: 'Titan construct carved from primordial meteorite with exposed glowing spirit core.',
    height: 4.80,
    scale: 2.4,
    sockets: Object.values(GOLEM_BASE_PROFILE.sockets),
  },
  boss_celestial_immortal: {
    id: 'boss_celestial_immortal',
    name: 'Celestial Immortal',
    vietnameseName: 'Huyền Thiên Chân Tiên Vương',
    category: 'BOSS',
    skeletonProfile: 'HUMANOID_BASE',
    description: 'Supreme ascended sovereign levitating with floating Thousand-Sword array.',
    defaultCultivationStage: 'Tribulation',
    height: 2.40,
    scale: 1.35,
    sockets: Object.values(HUMANOID_BASE_PROFILE.sockets),
  },

  // MOUNTS
  mount_spirit_deer: {
    id: 'mount_spirit_deer',
    name: 'Spiritual Deer',
    vietnameseName: 'Bạch Lộc Linh Thú',
    category: 'MOUNT',
    skeletonProfile: 'QUADRUPED_BASE',
    description: 'Graceful steed with jade-tipped antlers traversing cloud paths effortlessly.',
    height: 1.65,
    scale: 1.1,
    sockets: Object.values(QUADRUPED_BASE_PROFILE.sockets),
  },
  mount_immortal_crane: {
    id: 'mount_immortal_crane',
    name: 'Immortal Crane',
    vietnameseName: 'Tiên Hạc Đằng Vân',
    category: 'MOUNT',
    skeletonProfile: 'BIRD_BASE',
    description: 'Snow-white celestial crane carrying Daoists through misty mountain peaks.',
    height: 1.95,
    scale: 1.25,
    sockets: Object.values(BIRD_BASE_PROFILE.sockets),
  },
  mount_celestial_whale: {
    id: 'mount_celestial_whale',
    name: 'Celestial Cloud Whale',
    vietnameseName: 'Côn Bằng Kình Ngư',
    category: 'MOUNT',
    skeletonProfile: 'MOUNT_BASE',
    description: 'Giant ocean of stars leviathan carrying groups across astral voids.',
    height: 3.20,
    scale: 2.2,
    sockets: Object.values(MOUNT_BASE_PROFILE.sockets),
  },
  mount_flying_sword: {
    id: 'mount_flying_sword',
    name: 'Flying Sword of Nine Heavens',
    vietnameseName: 'Ngự Kiếm Phi Hành',
    category: 'MOUNT',
    skeletonProfile: 'MOUNT_BASE',
    description: 'Refined flying spirit blade allowing supersonic sword flight through the clouds.',
    height: 0.40,
    scale: 1.0,
    sockets: Object.values(MOUNT_BASE_PROFILE.sockets),
  },
};

/**
 * Cultivation stage visual attributes:
 * Color palettes, glow emissions, and particle intensity.
 */
export const CULTIVATION_STAGE_VFX_CONFIG: Record<
  CultivationStage,
  {
    auraColor: string;
    emissiveIntensity: number;
    robeColor: string;
    trimColor: string;
    auraRadius: number;
    haloRings: number;
    particleCount: number;
    trailColor: string;
    lightningColor: string;
  }
> = {
  Mortal: {
    auraColor: '#7A8288',
    emissiveIntensity: 0.05,
    robeColor: '#C4B99F', // Simple hemp / linen
    trimColor: '#5C5446',
    auraRadius: 0.0,
    haloRings: 0,
    particleCount: 0,
    trailColor: '#CCCCCC',
    lightningColor: '#888888',
  },
  'Qi Refining': {
    auraColor: '#6BD4FF', // Pure azure spiritual mist
    emissiveIntensity: 0.25,
    robeColor: '#4A90E2', // Azure disciple silk
    trimColor: '#ECEFF1',
    auraRadius: 0.65,
    haloRings: 1,
    particleCount: 16,
    trailColor: '#70D6FF',
    lightningColor: '#A0E8FF',
  },
  'Foundation Establishment': {
    auraColor: '#00E5FF', // Vibrant cyan Daoist lake
    emissiveIntensity: 0.45,
    robeColor: '#104F55', // Deep cyan jade robe
    trimColor: '#80DEEA',
    auraRadius: 0.95,
    haloRings: 1,
    particleCount: 28,
    trailColor: '#00F5D4',
    lightningColor: '#84FFFF',
  },
  'Golden Core': {
    auraColor: '#FFD700', // Radiant solar gold
    emissiveIntensity: 0.85,
    robeColor: '#D4AF37', // Pure gold brocade
    trimColor: '#FFF8E1',
    auraRadius: 1.35,
    haloRings: 2,
    particleCount: 45,
    trailColor: '#FFE600',
    lightningColor: '#FFF176',
  },
  'Nascent Soul': {
    auraColor: '#9D4EDD', // Royal imperial amethyst / violet Qi
    emissiveIntensity: 1.25,
    robeColor: '#3C096C', // Deep violet astral silk
    trimColor: '#E0AAFF',
    auraRadius: 1.85,
    haloRings: 3,
    particleCount: 65,
    trailColor: '#C77DFF',
    lightningColor: '#E0AAFF',
  },
  'Soul Formation': {
    auraColor: '#FF007F', // Starry lotus crimson & stellar nebula
    emissiveIntensity: 1.65,
    robeColor: '#240046', // Cosmic star-weave silk
    trimColor: '#FF9E00',
    auraRadius: 2.40,
    haloRings: 4,
    particleCount: 90,
    trailColor: '#FF5400',
    lightningColor: '#FF9E00',
  },
  Tribulation: {
    auraColor: '#FF3B30', // Heaven-defying thunder & dragon flame
    emissiveIntensity: 2.20,
    robeColor: '#0F0F1A', // Abyssal night dragon robe
    trimColor: '#FFD700',
    auraRadius: 3.10,
    haloRings: 5,
    particleCount: 140,
    trailColor: '#FF0055',
    lightningColor: '#FFEA00',
  },
};

/**
 * Procedural Mesh & Rig Builder
 * Generates an actual, fully skinned Three.js character model attached to its Skeleton profile.
 */
export function createXianxiaRiggedCharacter(
  characterId: CharacterId,
  cultivationStage: CultivationStage = 'Foundation Establishment'
): {
  group: THREE.Group;
  rootBone: THREE.Bone;
  skeleton: THREE.Skeleton;
  boneMap: Map<string, THREE.Bone>;
  skinnedMesh: THREE.SkinnedMesh;
  socketAnchors: Map<string, THREE.Object3D>;
} {
  const def = XIANXIA_CHARACTERS[characterId] || XIANXIA_CHARACTERS.player_male;
  const stageCfg = CULTIVATION_STAGE_VFX_CONFIG[cultivationStage] || CULTIVATION_STAGE_VFX_CONFIG['Foundation Establishment'];

  // Select profile definition
  let profileDef: SkeletonProfileDef;
  if (characterId === 'mon_nine_tailed_fox') {
    profileDef = buildNineTailedFoxProfile();
  } else {
    profileDef = SKELETON_PROFILES[def.skeletonProfile] || HUMANOID_BASE_PROFILE;
  }

  // 1. Construct Three.js Skeleton
  const { rootBone, skeleton, boneMap } = buildThreeSkeletonForProfile(profileDef);

  // 2. Build character root group
  const group = new THREE.Group();
  group.name = `char_${characterId}`;
  group.scale.setScalar(def.scale);
  group.add(rootBone);

  // 3. Construct Skinned Geometry & Influence Weights
  const { geometry, materials } = buildSkinnedGeometryForCharacter(characterId, stageCfg, boneMap);
  const skinnedMesh = new THREE.SkinnedMesh(geometry, materials);
  skinnedMesh.name = `mesh_${characterId}`;
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;
  skinnedMesh.bind(skeleton);
  group.add(skinnedMesh);

  // 4. Attach Sockets & Accessories
  const socketAnchors = new Map<string, THREE.Object3D>();
  for (const [socketKey, sDef] of Object.entries(profileDef.sockets)) {
    const parentBone = boneMap.get(sDef.boneName);
    if (parentBone) {
      const socketObj = new THREE.Object3D();
      socketObj.name = `socket_${socketKey}`;
      socketObj.position.set(...sDef.offsetPos);
      socketObj.rotation.set(...sDef.offsetRot);
      parentBone.add(socketObj);
      socketAnchors.set(socketKey, socketObj);

      // Attach default weapon or ornament if applicable
      attachDefaultSocketItems(characterId, socketKey, socketObj, stageCfg);
    }
  }

  // Store metadata
  group.userData.characterId = characterId;
  group.userData.cultivationStage = cultivationStage;
  group.userData.skeletonProfile = def.skeletonProfile;
  group.userData.boneMap = boneMap;
  group.userData.skeleton = skeleton;
  group.userData.socketAnchors = socketAnchors;

  return { group, rootBone, skeleton, boneMap, skinnedMesh, socketAnchors };
}

/**
 * Builds geometry and skin weights mapped directly to bone indices.
 */
function buildSkinnedGeometryForCharacter(
  characterId: CharacterId,
  stageCfg: (typeof CULTIVATION_STAGE_VFX_CONFIG)['Foundation Establishment'],
  boneMap: Map<string, THREE.Bone>
): { geometry: THREE.BufferGeometry; materials: THREE.Material[] } {
  const bonesList = Array.from(boneMap.values());
  const boneIndexMap = new Map<string, number>();
  bonesList.forEach((b, idx) => boneIndexMap.set(b.name, idx));

  const isFemale = characterId.includes('female') || characterId === 'npc_healer';
  const isElder = characterId === 'npc_sect_elder' || characterId === 'npc_master';
  const robeColor = isElder ? '#F8FAFC' : isFemale ? '#C084FC' : stageCfg.robeColor || '#0284C7';

  // 1. Robe Material (Authentic Daoist Hanfu Silk)
  const robeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(robeColor),
    roughness: 0.45,
    metalness: 0.12,
    emissive: new THREE.Color(stageCfg.auraColor),
    emissiveIntensity: stageCfg.emissiveIntensity * 0.15,
    side: THREE.DoubleSide,
  });

  // 2. Porcelain Asian Skin Material
  const skinColor = isFemale ? '#FDF2E9' : isElder ? '#FCEBD7' : '#FDE8D4';
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.55,
    metalness: 0.05,
  });

  // 3. Hair Material (Ebony Silk Hair / White Elder Beard)
  const hairColor = isElder ? '#F1F5F9' : '#111827';
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.7,
    metalness: 0.1,
  });

  // 4. Emerald Jade Material (Trâm Cài Tóc & Ngọc Bội Đan Điền)
  const jadeMat = new THREE.MeshStandardMaterial({
    color: '#10B981',
    emissive: '#059669',
    emissiveIntensity: 0.65,
    roughness: 0.15,
    metalness: 0.4,
  });

  // 5. Gold Embroidery Trim (Mép Áo Vạt Chéo & Viền Kim Tuyến)
  const trimMat = new THREE.MeshStandardMaterial({
    color: '#F59E0B',
    roughness: 0.25,
    metalness: 0.85,
    emissive: new THREE.Color(stageCfg.auraColor),
    emissiveIntensity: stageCfg.emissiveIntensity * 0.25,
  });

  // 6. Dan Tian Silk Belt Sash
  const beltColor = isElder ? '#B45309' : isFemale ? '#DB2777' : '#0F766E';
  const beltMat = new THREE.MeshStandardMaterial({
    color: beltColor,
    roughness: 0.5,
    metalness: 0.2,
  });

  // 7. Traditional Daoist Cloth Boots
  const bootsMat = new THREE.MeshStandardMaterial({
    color: '#1E293B',
    roughness: 0.8,
    metalness: 0.1,
  });

  // 8. Flying Sword Steel
  const swordMat = new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.1,
    metalness: 0.95,
    emissive: '#38BDF8',
    emissiveIntensity: 0.6,
  });

  const humanoidMaterials = [robeMat, skinMat, hairMat, jadeMat, trimMat, beltMat, bootsMat, swordMat];

  const beastFurMat = new THREE.MeshStandardMaterial({
    color: characterId === 'mon_white_tiger' ? '#EAEFF2' : characterId === 'mon_nine_tailed_fox' ? '#FFFFFF' : '#4A3B32',
    roughness: 0.8,
    metalness: 0.0,
    emissive: characterId === 'mon_nine_tailed_fox' ? new THREE.Color('#FF8DA1') : new THREE.Color('#000000'),
    emissiveIntensity: 0.2,
  });

  const woodBarkMat = new THREE.MeshStandardMaterial({
    color: '#382A1D',
    roughness: 0.9,
    metalness: 0.05,
  });

  const dragonIceMat = new THREE.MeshStandardMaterial({
    color: '#AEE5FF',
    roughness: 0.15,
    metalness: 0.6,
    emissive: '#4DC8FF',
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.92,
  });

  const stoneGolemMat = new THREE.MeshStandardMaterial({
    color: '#494D53',
    roughness: 0.85,
    metalness: 0.3,
  });

  let geometry: THREE.BufferGeometry;
  let materials: THREE.Material[] = humanoidMaterials;

  if (characterId.startsWith('player') || characterId.startsWith('npc') || characterId === 'boss_demon_lord' || characterId === 'boss_celestial_immortal') {
    geometry = generateHumanoidSkinnedGeometry(characterId, boneIndexMap, bonesList);
    materials = humanoidMaterials;
  } else if (characterId === 'mon_nine_tailed_fox') {
    geometry = generateFoxSkinnedGeometry(boneIndexMap, bonesList);
    materials = [beastFurMat, skinMat, trimMat];
  } else if (characterId === 'mon_white_tiger' || characterId === 'mon_demon_boar' || characterId === 'mount_spirit_deer') {
    geometry = generateQuadrupedSkinnedGeometry(characterId, boneIndexMap, bonesList);
    materials = [beastFurMat, trimMat];
  } else if (characterId === 'mon_wood_spirit') {
    geometry = generateWoodSpiritSkinnedGeometry(boneIndexMap, bonesList);
    materials = [woodBarkMat, trimMat];
  } else if (characterId === 'mon_serpent' || characterId === 'boss_ice_dragon') {
    geometry = generateSerpentSkinnedGeometry(characterId, boneIndexMap, bonesList);
    materials = characterId === 'boss_ice_dragon' ? [dragonIceMat, trimMat] : [beastFurMat, skinMat];
  } else if (characterId === 'mon_phoenix' || characterId === 'mount_immortal_crane') {
    geometry = generateBirdSkinnedGeometry(characterId, boneIndexMap, bonesList);
    materials = [trimMat, skinMat];
  } else if (characterId === 'boss_stone_guardian') {
    geometry = generateGolemSkinnedGeometry(boneIndexMap, bonesList);
    materials = [stoneGolemMat, trimMat];
  } else {
    // Mount Whale / Flying Sword
    geometry = generateMountSkinnedGeometry(characterId, boneIndexMap, bonesList);
    materials = [trimMat, robeMat];
  }

  return { geometry, materials };
}

/**
 * Generates Skinned Mesh for Humanoid characters (Players, NPCs, Demon Lord, Celestial Immortal)
 */

function createPartGeometry(
  geo: THREE.BufferGeometry,
  b0: number,
  b1: number = b0,
  w0: number = 1.0,
  w1: number = 0.0,
  matIndex: number = 0
): THREE.BufferGeometry {
  const vCount = geo.attributes.position.count;
  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  for (let i = 0; i < vCount; i++) {
    skinIndices[i * 4] = b0;
    skinIndices[i * 4 + 1] = b1;
    skinIndices[i * 4 + 2] = 0;
    skinIndices[i * 4 + 3] = 0;

    skinWeights[i * 4] = w0;
    skinWeights[i * 4 + 1] = w1;
    skinWeights[i * 4 + 2] = 0;
    skinWeights[i * 4 + 3] = 0;
  }

  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));

  geo.clearGroups();
  const count = geo.index ? geo.index.count : vCount;
  geo.addGroup(0, count, matIndex);
  return geo;
}


/**
 * Generates Skinned Mesh for Humanoid characters (Players, NPCs, Demon Lord, Celestial Immortal)
 */
function generateHumanoidSkinnedGeometry(
  charId: CharacterId,
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const isFemale = charId.includes('female') || charId === 'npc_healer';
  const isDemonLord = charId === 'boss_demon_lord';
  const isElder = charId === 'npc_sect_elder';
  const widthScale = isDemonLord ? 1.45 : isFemale ? 0.88 : 1.0;

  const MAT_ROBE = 0;
  const MAT_SKIN = 1;
  const MAT_HAIR = 2;
  const MAT_JADE = 3;
  const MAT_TRIM = 4;
  const MAT_BELT = 5;
  const MAT_BOOTS = 6;
  const MAT_SWORD = 7;

  const headIdx = boneIdx.get('bone_head') ?? 5;
  const neckIdx = boneIdx.get('bone_neck') ?? 4;
  const chestIdx = boneIdx.get('bone_chest') ?? 3;
  const spineIdx = boneIdx.get('bone_spine') ?? 1;
  const hipsIdx = boneIdx.get('bone_hips') ?? 0;
  const shLIdx = boneIdx.get('bone_shoulder_l') ?? 7;
  const elLIdx = boneIdx.get('bone_elbow_l') ?? 8;
  const handLIdx = boneIdx.get('bone_hand_l') ?? 10;
  const shRIdx = boneIdx.get('bone_shoulder_r') ?? 12;
  const elRIdx = boneIdx.get('bone_elbow_r') ?? 13;
  const handRIdx = boneIdx.get('bone_hand_r') ?? 15;
  const thighLIdx = boneIdx.get('bone_thigh_l') ?? 16;
  const kneeLIdx = boneIdx.get('bone_knee_l') ?? 17;
  const ankleLIdx = boneIdx.get('bone_ankle_l') ?? 18;
  const thighRIdx = boneIdx.get('bone_thigh_r') ?? 20;
  const kneeRIdx = boneIdx.get('bone_knee_r') ?? 21;
  const ankleRIdx = boneIdx.get('bone_ankle_r') ?? 22;
  const robeRootIdx = boneIdx.get('bone_robe_root') ?? 24;
  const robeLowerIdx = boneIdx.get('bone_robe_lower') ?? 26;
  const sleeveLIdx = boneIdx.get('bone_sleeve_l_tip') ?? elLIdx;
  const sleeveRIdx = boneIdx.get('bone_sleeve_r_tip') ?? elRIdx;

  const parts: THREE.BufferGeometry[] = [];

  // 1. Head (Asian porcelain skin tone)
  const head = createPartGeometry(new THREE.SphereGeometry(0.125 * widthScale, 14, 10), headIdx, headIdx, 1.0, 0.0, MAT_SKIN);
  head.translate(0, 1.74, 0);
  parts.push(head);

  // 2. Daoist Topknot / Hair Bun (Ebony silk hair)
  const bun = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.075, 0.12, 10), headIdx, headIdx, 1.0, 0.0, MAT_HAIR);
  bun.translate(0, 1.88, -0.02);
  parts.push(bun);

  // 3. Jade Hairpin (Trâm Cài Tóc ngọc bích phát sáng)
  const pin = createPartGeometry(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), headIdx, headIdx, 1.0, 0.0, MAT_JADE);
  pin.rotateZ(Math.PI / 2);
  pin.translate(0, 1.88, -0.02);
  parts.push(pin);

  // Elder Long Daoist Beard (White hair)
  if (isElder) {
    const beard = createPartGeometry(new THREE.ConeGeometry(0.08, 0.40, 8), headIdx, neckIdx, 0.8, 0.2, MAT_HAIR);
    beard.rotateX(Math.PI);
    beard.translate(0, 1.44, 0.10);
    parts.push(beard);
  }

  // Female Twin Flowing Hair Locks & Ribbons
  if (isFemale) {
    const hairL = createPartGeometry(new THREE.CylinderGeometry(0.03, 0.015, 0.55, 6), headIdx, neckIdx, 0.7, 0.3, MAT_HAIR);
    hairL.translate(0.08, 1.38, -0.09);
    parts.push(hairL);

    const hairR = createPartGeometry(new THREE.CylinderGeometry(0.03, 0.015, 0.55, 6), headIdx, neckIdx, 0.7, 0.3, MAT_HAIR);
    hairR.translate(-0.08, 1.38, -0.09);
    parts.push(hairR);

    const ribbonL = createPartGeometry(new THREE.BoxGeometry(0.03, 0.45, 0.01), headIdx, neckIdx, 0.8, 0.2, MAT_BELT);
    ribbonL.rotateZ(0.2);
    ribbonL.translate(0.12, 1.55, -0.08);
    parts.push(ribbonL);

    const ribbonR = createPartGeometry(new THREE.BoxGeometry(0.03, 0.45, 0.01), headIdx, neckIdx, 0.8, 0.2, MAT_BELT);
    ribbonR.rotateZ(-0.2);
    ribbonR.translate(-0.12, 1.55, -0.08);
    parts.push(ribbonR);
  }

  // Demon Lord Curved Obsidian Horns
  if (isDemonLord) {
    const hornL = createPartGeometry(new THREE.ConeGeometry(0.07, 0.48, 8), headIdx, headIdx, 1.0, 0.0, MAT_BOOTS);
    hornL.rotateZ(0.45);
    hornL.rotateX(-0.3);
    hornL.translate(0.15, 1.88, 0.06);
    parts.push(hornL);

    const hornR = createPartGeometry(new THREE.ConeGeometry(0.07, 0.48, 8), headIdx, headIdx, 1.0, 0.0, MAT_BOOTS);
    hornR.rotateZ(-0.45);
    hornR.rotateX(-0.3);
    hornR.translate(-0.15, 1.88, 0.06);
    parts.push(hornR);
  }

  // 4. Neck (Porcelain skin)
  const neck = createPartGeometry(new THREE.CylinderGeometry(0.065, 0.075, 0.12, 10), neckIdx, neckIdx, 1.0, 0.0, MAT_SKIN);
  neck.translate(0, 1.54, 0);
  parts.push(neck);

  // 5. Chest & Hanfu Crossed Lapels (Áo Bào Cổ Chéo Vạt Lụa)
  const chest = createPartGeometry(new THREE.CylinderGeometry(0.20 * widthScale, 0.17 * widthScale, 0.36, 14), chestIdx, spineIdx, 0.7, 0.3, MAT_ROBE);
  chest.translate(0, 1.32, 0);
  parts.push(chest);

  // Crossed Y-collar Golden Lapels (Vạt áo chéo chữ Y viền vàng)
  const lapelL = createPartGeometry(new THREE.BoxGeometry(0.04, 0.28, 0.02), chestIdx, spineIdx, 0.8, 0.2, MAT_TRIM);
  lapelL.rotateZ(-0.4);
  lapelL.translate(0.07 * widthScale, 1.35, 0.18);
  parts.push(lapelL);

  const lapelR = createPartGeometry(new THREE.BoxGeometry(0.04, 0.28, 0.02), chestIdx, spineIdx, 0.8, 0.2, MAT_TRIM);
  lapelR.rotateZ(0.4);
  lapelR.translate(-0.07 * widthScale, 1.35, 0.18);
  parts.push(lapelR);

  // 6. Waist Belt & Dan Tian Core Sash (Thắt lưng đan điền)
  const belt = createPartGeometry(new THREE.CylinderGeometry(0.185 * widthScale, 0.19 * widthScale, 0.14, 14), spineIdx, hipsIdx, 0.6, 0.4, MAT_BELT);
  belt.translate(0, 1.08, 0);
  parts.push(belt);

  // Jade Pendant hanging from sash (Ngọc bội hộ mệnh)
  const pendant = createPartGeometry(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12), hipsIdx, hipsIdx, 1.0, 0.0, MAT_JADE);
  pendant.rotateX(Math.PI / 2);
  pendant.translate(0.09 * widthScale, 0.98, 0.19);
  parts.push(pendant);

  // Silk tassel below jade pendant
  const tassel = createPartGeometry(new THREE.ConeGeometry(0.02, 0.10, 6), hipsIdx, hipsIdx, 1.0, 0.0, MAT_TRIM);
  tassel.translate(0.09 * widthScale, 0.90, 0.19);
  parts.push(tassel);

  // 7. Left Arm (T-Pose along +X axis)
  const shL = createPartGeometry(new THREE.SphereGeometry(0.085 * widthScale, 10, 8), shLIdx, shLIdx, 1.0, 0.0, MAT_ROBE);
  shL.translate(0.26 * widthScale, 1.50, 0);
  parts.push(shL);

  const uArmL = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.075, 0.28, 10), shLIdx, shLIdx, 1.0, 0.0, MAT_ROBE);
  uArmL.rotateZ(-Math.PI / 2);
  uArmL.translate(0.40 * widthScale, 1.50, 0);
  parts.push(uArmL);

  // Billowing Wide Daoist Sleeve Left (Tay Áo Rộng Thụt Thò Đón Gió)
  const fArmL = createPartGeometry(new THREE.CylinderGeometry(0.09, 0.18, 0.28, 10), elLIdx, sleeveLIdx, 0.6, 0.4, MAT_ROBE);
  fArmL.rotateZ(-Math.PI / 2);
  fArmL.translate(0.67 * widthScale, 1.50, 0);
  parts.push(fArmL);

  const cuffL = createPartGeometry(new THREE.TorusGeometry(0.12, 0.015, 6, 12), elLIdx, sleeveLIdx, 0.8, 0.2, MAT_TRIM);
  cuffL.rotateY(Math.PI / 2);
  cuffL.translate(0.80 * widthScale, 1.50, 0);
  parts.push(cuffL);

  const handL = createPartGeometry(new THREE.BoxGeometry(0.09, 0.045, 0.025), handLIdx, handLIdx, 1.0, 0.0, MAT_SKIN);
  handL.translate(0.86 * widthScale, 1.50, 0);
  parts.push(handL);

  // 8. Right Arm (T-Pose along -X axis)
  const shR = createPartGeometry(new THREE.SphereGeometry(0.085 * widthScale, 10, 8), shRIdx, shRIdx, 1.0, 0.0, MAT_ROBE);
  shR.translate(-0.26 * widthScale, 1.50, 0);
  parts.push(shR);

  const uArmR = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.075, 0.28, 10), shRIdx, shRIdx, 1.0, 0.0, MAT_ROBE);
  uArmR.rotateZ(Math.PI / 2);
  uArmR.translate(-0.40 * widthScale, 1.50, 0);
  parts.push(uArmR);

  // Billowing Wide Daoist Sleeve Right
  const fArmR = createPartGeometry(new THREE.CylinderGeometry(0.09, 0.18, 0.28, 10), elRIdx, sleeveRIdx, 0.6, 0.4, MAT_ROBE);
  fArmR.rotateZ(Math.PI / 2);
  fArmR.translate(-0.67 * widthScale, 1.50, 0);
  parts.push(fArmR);

  const cuffR = createPartGeometry(new THREE.TorusGeometry(0.12, 0.015, 6, 12), elRIdx, sleeveRIdx, 0.8, 0.2, MAT_TRIM);
  cuffR.rotateY(Math.PI / 2);
  cuffR.translate(-0.80 * widthScale, 1.50, 0);
  parts.push(cuffR);

  const handR = createPartGeometry(new THREE.BoxGeometry(0.09, 0.045, 0.025), handRIdx, handRIdx, 1.0, 0.0, MAT_SKIN);
  handR.translate(-0.86 * widthScale, 1.50, 0);
  parts.push(handR);

  // 9. Lower Robe Skirt (Vạt Áo Dưới Buông Dài)
  const skirt = createPartGeometry(new THREE.CylinderGeometry(0.19 * widthScale, 0.32 * widthScale, 0.64, 14), hipsIdx, robeRootIdx, 0.7, 0.3, MAT_ROBE);
  skirt.translate(0, 0.72, 0);
  parts.push(skirt);

  const skirtHem = createPartGeometry(new THREE.TorusGeometry(0.31 * widthScale, 0.015, 6, 16), hipsIdx, robeRootIdx, 0.3, 0.7, MAT_TRIM);
  skirtHem.rotateX(Math.PI / 2);
  skirtHem.translate(0, 0.41, 0);
  parts.push(skirtHem);

  // 10. Left Leg (Thigh, Shin, Daoist Boot)
  const thighL = createPartGeometry(new THREE.CylinderGeometry(0.07, 0.06, 0.42, 10), thighLIdx, thighLIdx, 1.0, 0.0, MAT_ROBE);
  thighL.translate(0.12 * widthScale, 0.69, 0);
  parts.push(thighL);

  const shinL = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.05, 0.40, 10), kneeLIdx, kneeLIdx, 1.0, 0.0, MAT_ROBE);
  shinL.translate(0.12 * widthScale, 0.28, 0);
  parts.push(shinL);

  const bootL = createPartGeometry(new THREE.BoxGeometry(0.075, 0.08, 0.18), ankleLIdx, ankleLIdx, 1.0, 0.0, MAT_BOOTS);
  bootL.translate(0.12 * widthScale, 0.04, 0.05);
  parts.push(bootL);

  // 11. Right Leg (Thigh, Shin, Daoist Boot)
  const thighR = createPartGeometry(new THREE.CylinderGeometry(0.07, 0.06, 0.42, 10), thighRIdx, thighRIdx, 1.0, 0.0, MAT_ROBE);
  thighR.translate(-0.12 * widthScale, 0.69, 0);
  parts.push(thighR);

  const shinR = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.05, 0.40, 10), kneeRIdx, kneeRIdx, 1.0, 0.0, MAT_ROBE);
  shinR.translate(-0.12 * widthScale, 0.28, 0);
  parts.push(shinR);

  const bootR = createPartGeometry(new THREE.BoxGeometry(0.075, 0.08, 0.18), ankleRIdx, ankleRIdx, 1.0, 0.0, MAT_BOOTS);
  bootR.translate(-0.12 * widthScale, 0.04, 0.05);
  parts.push(bootR);

  // 12. Flowing Back Robe Cape
  const cape = createPartGeometry(new THREE.BoxGeometry(0.36 * widthScale, 1.0, 0.025), robeRootIdx, robeLowerIdx, 0.5, 0.5, MAT_ROBE);
  cape.translate(0, 0.85, -0.15);
  parts.push(cape);

  const merged = mergeGeometries(parts, true);
  merged.computeVertexNormals();
  return merged;
}

function generateFoxSkinnedGeometry(
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const pelvisIdx = boneIdx.get('bone_quad_pelvis') ?? 0;
  const spineIdx = boneIdx.get('bone_quad_spine_mid') ?? 1;
  const chestIdx = boneIdx.get('bone_quad_chest') ?? 3;
  const headIdx = boneIdx.get('bone_quad_head') ?? 5;
  const legFLIdx = boneIdx.get('bone_quad_knee_fl') ?? 7;
  const legFRIdx = boneIdx.get('bone_quad_knee_fr') ?? 10;
  const legBLIdx = boneIdx.get('bone_quad_knee_bl') ?? 13;
  const legBRIdx = boneIdx.get('bone_quad_knee_br') ?? 16;

  const parts: THREE.BufferGeometry[] = [];

  // 1. Fox Cranium Head
  const head = createPartGeometry(new THREE.SphereGeometry(0.18, 12, 10), headIdx);
  head.translate(0, 0.72, 0.55);
  parts.push(head);

  // Fox Pointed Snout / Muzzle
  const snout = createPartGeometry(new THREE.ConeGeometry(0.10, 0.24, 8), headIdx);
  snout.rotateX(Math.PI / 2);
  snout.translate(0, 0.68, 0.72);
  parts.push(snout);

  // Pointed Ears
  const earL = createPartGeometry(new THREE.ConeGeometry(0.06, 0.20, 6), headIdx);
  earL.rotateZ(0.25);
  earL.translate(0.10, 0.90, 0.50);
  parts.push(earL);

  const earR = createPartGeometry(new THREE.ConeGeometry(0.06, 0.20, 6), headIdx);
  earR.rotateZ(-0.25);
  earR.translate(-0.10, 0.90, 0.50);
  parts.push(earR);

  // 2. Torso (Chest & Pelvis)
  const chest = createPartGeometry(new THREE.CylinderGeometry(0.24, 0.22, 0.45, 12), chestIdx, spineIdx, 0.7, 0.3);
  chest.rotateX(Math.PI / 2);
  chest.translate(0, 0.58, 0.20);
  parts.push(chest);

  const body = createPartGeometry(new THREE.CylinderGeometry(0.22, 0.20, 0.45, 12), spineIdx, pelvisIdx, 0.6, 0.4);
  body.rotateX(Math.PI / 2);
  body.translate(0, 0.55, -0.22);
  parts.push(body);

  // 3. 4 Quadruped Legs & Paws
  const legFL = createPartGeometry(new THREE.CylinderGeometry(0.055, 0.045, 0.50, 8), legFLIdx);
  legFL.translate(0.16, 0.25, 0.26);
  parts.push(legFL);

  const legFR = createPartGeometry(new THREE.CylinderGeometry(0.055, 0.045, 0.50, 8), legFRIdx);
  legFR.translate(-0.16, 0.25, 0.26);
  parts.push(legFR);

  const legBL = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.045, 0.50, 8), legBLIdx);
  legBL.translate(0.16, 0.25, -0.32);
  parts.push(legBL);

  const legBR = createPartGeometry(new THREE.CylinderGeometry(0.06, 0.045, 0.50, 8), legBRIdx);
  legBR.translate(-0.16, 0.25, -0.32);
  parts.push(legBR);

  // 4. 9 INDEPENDENT BUSHY TAILS (Cửu Vĩ Xòe Quạt Lộng Lẫy)
  for (let t = 1; t <= 9; t++) {
    const tailBaseIdx = boneIdx.get(`bone_fox_tail_${t}_base`) ?? pelvisIdx;
    const tailMidIdx = boneIdx.get(`bone_fox_tail_${t}_mid`) ?? tailBaseIdx;

    // Radiating fan angles (-0.8 rad to +0.8 rad)
    const fanAngle = ((t - 5) / 4) * 0.75;
    const tailGeo = createPartGeometry(new THREE.ConeGeometry(0.10, 0.85, 8), tailBaseIdx, tailMidIdx, 0.5, 0.5);
    tailGeo.rotateX(-Math.PI / 3);
    tailGeo.rotateY(fanAngle);
    tailGeo.translate(Math.sin(fanAngle) * 0.15, 0.65, -0.55);
    parts.push(tailGeo);
  }

  const merged = mergeGeometries(parts, false);
  merged.computeVertexNormals();
  return merged;
}


/**
 * Skinned mesh for Quadruped beasts (White Tiger, Demon Boar, Spirit Deer)
 */
function generateQuadrupedSkinnedGeometry(
  charId: CharacterId,
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const isBoar = charId.includes('boar');
  const isTiger = charId.includes('tiger');
  const scale = isBoar ? 1.2 : 1.0;

  const pelvisIdx = boneIdx.get('bone_quad_pelvis') ?? 0;
  const spineIdx = boneIdx.get('bone_quad_spine_mid') ?? 1;
  const chestIdx = boneIdx.get('bone_quad_chest') ?? 3;
  const headIdx = boneIdx.get('bone_quad_head') ?? 5;
  const legFLIdx = boneIdx.get('bone_quad_knee_fl') ?? 7;
  const legFRIdx = boneIdx.get('bone_quad_knee_fr') ?? 10;
  const legBLIdx = boneIdx.get('bone_quad_knee_bl') ?? 13;
  const legBRIdx = boneIdx.get('bone_quad_knee_br') ?? 16;
  const tailIdx = boneIdx.get('bone_quad_tail_02') ?? pelvisIdx;

  const parts: THREE.BufferGeometry[] = [];

  // 1. Beast Head
  const headGeo = isBoar
    ? new THREE.BoxGeometry(0.36, 0.32, 0.44)
    : new THREE.SphereGeometry(0.24, 12, 10);
  const head = createPartGeometry(headGeo, headIdx);
  head.translate(0, 0.78, 0.65);
  parts.push(head);

  // Tusks for Demon Boar
  if (isBoar) {
    const tuskL = createPartGeometry(new THREE.ConeGeometry(0.045, 0.28, 6), headIdx);
    tuskL.rotateX(-0.4);
    tuskL.rotateZ(0.3);
    tuskL.translate(0.18, 0.78, 0.85);
    parts.push(tuskL);

    const tuskR = createPartGeometry(new THREE.ConeGeometry(0.045, 0.28, 6), headIdx);
    tuskR.rotateX(-0.4);
    tuskR.rotateZ(-0.3);
    tuskR.translate(-0.18, 0.78, 0.85);
    parts.push(tuskR);
  }

  // Feline Ears for Tiger
  if (isTiger) {
    const earL = createPartGeometry(new THREE.ConeGeometry(0.06, 0.14, 6), headIdx);
    earL.translate(0.14, 1.0, 0.60);
    parts.push(earL);

    const earR = createPartGeometry(new THREE.ConeGeometry(0.06, 0.14, 6), headIdx);
    earR.translate(-0.14, 1.0, 0.60);
    parts.push(earR);
  }

  // 2. Muscular Torso & Chest
  const chest = createPartGeometry(new THREE.CylinderGeometry(0.32 * scale, 0.28 * scale, 0.55, 12), chestIdx, spineIdx, 0.7, 0.3);
  chest.rotateX(Math.PI / 2);
  chest.translate(0, 0.65, 0.25);
  parts.push(chest);

  const rear = createPartGeometry(new THREE.CylinderGeometry(0.28 * scale, 0.26 * scale, 0.55, 12), spineIdx, pelvisIdx, 0.6, 0.4);
  rear.rotateX(Math.PI / 2);
  rear.translate(0, 0.62, -0.28);
  parts.push(rear);

  // 3. 4 Sturdy Legs
  const legFL = createPartGeometry(new THREE.CylinderGeometry(0.08, 0.065, 0.55, 8), legFLIdx);
  legFL.translate(0.20, 0.28, 0.30);
  parts.push(legFL);

  const legFR = createPartGeometry(new THREE.CylinderGeometry(0.08, 0.065, 0.55, 8), legFRIdx);
  legFR.translate(-0.20, 0.28, 0.30);
  parts.push(legFR);

  const legBL = createPartGeometry(new THREE.CylinderGeometry(0.09, 0.07, 0.55, 8), legBLIdx);
  legBL.translate(0.20, 0.28, -0.36);
  parts.push(legBL);

  const legBR = createPartGeometry(new THREE.CylinderGeometry(0.09, 0.07, 0.55, 8), legBRIdx);
  legBR.translate(-0.20, 0.28, -0.36);
  parts.push(legBR);

  // 4. Tail
  const tail = createPartGeometry(new THREE.CylinderGeometry(0.05, 0.03, 0.65, 6), tailIdx);
  tail.rotateX(-Math.PI / 3);
  tail.translate(0, 0.50, -0.75);
  parts.push(tail);

  const merged = mergeGeometries(parts, false);
  merged.computeVertexNormals();
  return merged;
}


function generateWoodSpiritSkinnedGeometry(
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const geo = new THREE.ConeGeometry(0.85, 2.8, 14, 32);
  const posAttr = geo.attributes.position;
  const vCount = posAttr.count;

  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  const rootIdx = boneIdx.get('bone_tree_root_core') ?? 0;
  const trunkMid = boneIdx.get('bone_tree_trunk_mid') ?? 2;
  const crownIdx = boneIdx.get('bone_tree_crown') ?? 3;

  for (let i = 0; i < vCount; i++) {
    const y = posAttr.getY(i) + 1.4;
    let b0 = rootIdx;
    let b1 = trunkMid;
    let w0 = 0.7;
    let w1 = 0.3;

    if (y > 2.0) {
      b0 = crownIdx;
      b1 = trunkMid;
      w0 = 0.85;
      w1 = 0.15;
    } else if (y < 0.6) {
      b0 = rootIdx;
      b1 = boneIdx.get('bone_tree_root_fl_1') ?? rootIdx;
      w0 = 0.6;
      w1 = 0.4;
    }

    const idx = i * 4;
    skinIndices[idx] = b0;
    skinIndices[idx + 1] = b1;
    skinWeights[idx] = w0;
    skinWeights[idx + 1] = w1;
  }

  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Skinned mesh for 16-segmented Serpent and Ice Dragon
 */
function generateSerpentSkinnedGeometry(
  charId: CharacterId,
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const isDragon = charId === 'boss_ice_dragon';
  const radius = isDragon ? 0.48 : 0.22;
  const length = isDragon ? 5.2 : 3.6;
  const geo = new THREE.CylinderGeometry(radius * 0.8, radius, length, 14, 48);
  const posAttr = geo.attributes.position;
  const vCount = posAttr.count;

  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  for (let i = 0; i < vCount; i++) {
    const y = posAttr.getY(i) + length / 2; // 0..length
    const norm = Math.max(0, Math.min(1, y / length));
    const segment = Math.floor(norm * 15) + 1; // 1..16

    const boneName0 = `bone_serpent_vertebra_${String(segment).padStart(2, '0')}`;
    const boneName1 = `bone_serpent_vertebra_${String(Math.min(16, segment + 1)).padStart(2, '0')}`;

    const b0 = boneIdx.get(boneName0) ?? 0;
    const b1 = boneIdx.get(boneName1) ?? b0;

    const frac = (norm * 15) % 1.0;
    const idx = i * 4;
    skinIndices[idx] = b0;
    skinIndices[idx + 1] = b1;
    skinWeights[idx] = 1.0 - frac;
    skinWeights[idx + 1] = frac;
  }

  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Skinned mesh for Phoenix and Immortal Crane
 */
function generateBirdSkinnedGeometry(
  charId: CharacterId,
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const geo = new THREE.ConeGeometry(0.45, 1.8, 14, 24);
  const posAttr = geo.attributes.position;
  const vCount = posAttr.count;

  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  const chestIdx = boneIdx.get('bone_bird_chest') ?? 1;
  const headIdx = boneIdx.get('bone_bird_head') ?? 4;
  const wingL = boneIdx.get('bone_bird_wing_elbow_l') ?? 7;
  const wingR = boneIdx.get('bone_bird_wing_elbow_r') ?? 11;

  for (let i = 0; i < vCount; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);

    let b0 = chestIdx;
    let b1 = x > 0 ? wingL : wingR;
    let w0 = 0.6;
    let w1 = 0.4;

    if (y > 0.6) {
      b0 = headIdx;
      b1 = chestIdx;
      w0 = 0.8;
      w1 = 0.2;
    }

    const idx = i * 4;
    skinIndices[idx] = b0;
    skinIndices[idx + 1] = b1;
    skinWeights[idx] = w0;
    skinWeights[idx + 1] = w1;
  }

  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Skinned mesh for Ancient Stone Guardian (Golem)
 */
function generateGolemSkinnedGeometry(
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(1.6, 2.4, 1.2, 12, 18, 10);
  const posAttr = geo.attributes.position;
  const vCount = posAttr.count;

  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  const torsoIdx = boneIdx.get('bone_golem_torso') ?? 1;
  const headIdx = boneIdx.get('bone_golem_head') ?? 2;
  const armL = boneIdx.get('bone_golem_fist_l') ?? 5;
  const armR = boneIdx.get('bone_golem_fist_r') ?? 8;

  for (let i = 0; i < vCount; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);

    let b0 = torsoIdx;
    let b1 = x > 0 ? armL : armR;
    let w0 = 0.7;
    let w1 = 0.3;

    if (y > 0.8) {
      b0 = headIdx;
      b1 = torsoIdx;
      w0 = 0.85;
      w1 = 0.15;
    }

    const idx = i * 4;
    skinIndices[idx] = b0;
    skinIndices[idx + 1] = b1;
    skinWeights[idx] = w0;
    skinWeights[idx + 1] = w1;
  }

  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Skinned mesh for Mounts (Whale, Flying Sword)
 */
function generateMountSkinnedGeometry(
  charId: CharacterId,
  boneIdx: Map<string, number>,
  bonesList: THREE.Bone[]
): THREE.BufferGeometry {
  const isSword = charId === 'mount_flying_sword';
  let geo: THREE.BufferGeometry;

  if (isSword) {
    // Elegant Xianxia Flying Sword blade
    geo = new THREE.BoxGeometry(0.28, 0.04, 2.4, 4, 2, 24);
  } else {
    // Cloud Whale
    geo = new THREE.CylinderGeometry(0.85, 0.45, 3.8, 16, 24);
    geo.rotateX(Math.PI / 2);
  }

  const posAttr = geo.attributes.position;
  const vCount = posAttr.count;
  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  const rootIdx = boneIdx.get('bone_mount_root') ?? 0;
  const saddleIdx = boneIdx.get('bone_mount_saddle') ?? 1;

  for (let i = 0; i < vCount; i++) {
    const idx = i * 4;
    skinIndices[idx] = saddleIdx;
    skinIndices[idx + 1] = rootIdx;
    skinWeights[idx] = 0.75;
    skinWeights[idx + 1] = 0.25;
  }

  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Attaches weapon models and ornaments into dedicated sockets
 */
function attachDefaultSocketItems(
  charId: CharacterId,
  socketKey: string,
  socketObj: THREE.Object3D,
  stageCfg: (typeof CULTIVATION_STAGE_VFX_CONFIG)['Foundation Establishment']
) {
  if (socketKey === 'RightHandSocket') {
    // Refined Xianxia Flying Sword / Greatsword
    const swordGroup = new THREE.Group();
    swordGroup.name = 'equipped_flying_sword';

    // Blade
    const bladeGeo = new THREE.BoxGeometry(0.06, 0.85, 0.015);
    bladeGeo.translate(0, 0.425, 0);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: '#ECEFF1',
      metalness: 0.95,
      roughness: 0.15,
      emissive: new THREE.Color(stageCfg.auraColor),
      emissiveIntensity: stageCfg.emissiveIntensity * 0.4,
    });
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
    swordGroup.add(bladeMesh);

    // Guard (Crossguard shaped like Daoist Cloud or Dragon)
    const guardGeo = new THREE.BoxGeometry(0.18, 0.03, 0.04);
    const guardMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(stageCfg.trimColor),
      metalness: 0.85,
      roughness: 0.25,
    });
    const guardMesh = new THREE.Mesh(guardGeo, guardMat);
    swordGroup.add(guardMesh);

    // Hilt Grip
    const hiltGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8);
    hiltGeo.translate(0, -0.09, 0);
    const hiltMat = new THREE.MeshStandardMaterial({ color: '#2B2B2B', roughness: 0.8 });
    const hiltMesh = new THREE.Mesh(hiltGeo, hiltMat);
    swordGroup.add(hiltMesh);

    // Pommel Pearl / Spiritual Gem
    const pommelGeo = new THREE.SphereGeometry(0.035, 8, 8);
    pommelGeo.translate(0, -0.19, 0);
    const pommelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(stageCfg.auraColor),
      emissive: new THREE.Color(stageCfg.auraColor),
      emissiveIntensity: 0.8,
    });
    const pommelMesh = new THREE.Mesh(pommelGeo, pommelMat);
    swordGroup.add(pommelMesh);

    socketObj.add(swordGroup);
  } else if (socketKey === 'DanTianSocket') {
    // Internal Golden Core / Spiritual Nucleus glow
    const coreGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(stageCfg.auraColor),
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.name = 'dantian_golden_core';
    socketObj.add(coreMesh);
  } else if (socketKey === 'CrownAuraSocket') {
    // Halo ring for high cultivation realms
    if (stageCfg.haloRings > 0) {
      const ringGeo = new THREE.TorusGeometry(0.24, 0.015, 8, 32);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(stageCfg.auraColor),
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'crown_halo_ring';
      socketObj.add(ringMesh);
    }
  }
}
