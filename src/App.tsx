import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  CULTIVATION_REALMS,
  COMBAT_SKILLS,
  DESTINY_EVENTS,
  DestinyEventOutcome,
  HiddenCharacterData,
  generateHiddenCharacter,
  getProgressiveDiscovery,
  evaluateDestinyEncounter,
  resolveBreakthrough,
  worldToIso,
  isoToWorld,
  calculateSkillDamage,
} from './game/rules';
import { soundEngine } from './game/audio';
import { GddCodexModal } from './components/GddCodexModal';
import { XianxiaAnimationStudioModal } from './components/XianxiaAnimationStudioModal';
import { XianxiaWorld3D } from './components/XianxiaWorld3D';
import {
  CultivationPanelModal,
  PlayerInventoryState,
} from './components/CultivationPanelModal';

type GameShellState = 'title' | 'playing' | 'paused' | 'gameover';

interface PooledParticle {
  active: boolean;
  wx: number;
  wy: number;
  wz: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface FloatingCombatText {
  active: boolean;
  wx: number;
  wy: number;
  wz: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

interface EnemyActor {
  id: number;
  archetype: 'charger' | 'kiter' | 'shielded' | 'boss';
  name: string;
  wx: number;
  wy: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  radius: number;
  color: string;
  aiState: 'patrol' | 'chase' | 'windup' | 'attack' | 'recover' | 'ko';
  stateTimer: number;
  windupDuration: number;
  targetWx: number;
  targetWy: number;
  hitFlash: number;
  koTimer: number;
  facing: number;
}

interface TribulationStrike {
  active: boolean;
  wx: number;
  wy: number;
  timer: number;
  maxTimer: number;
  radius: number;
  struck: boolean;
}

interface WorldLandmark {
  id: string;
  type: 'vein' | 'cave' | 'stele' | 'npc';
  name: string;
  subtitle: string;
  wx: number;
  wy: number;
  radius: number;
  color: string;
  cooldown: number;
}

interface PickupNode {
  id: number;
  active: boolean;
  type: 'qi_crystal' | 'herb' | 'core';
  wx: number;
  wy: number;
  bobPhase: number;
}

const MAX_PARTICLES = 220;
const MAX_FLOATING_TEXTS = 30;
const MAX_TRIBULATION_STRIKES = 12;

export default function App() {
  // Check ?autostart=1
  const initialAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [shellState, setShellState] = useState<GameShellState>(
    initialAutoStart ? 'playing' : 'title'
  );
  const [fateSeed, setFateSeed] = useState<string>('VAN-DAO-777');
  const [charData, setCharData] = useState<HiddenCharacterData>(() =>
    generateHiddenCharacter('VAN-DAO-777')
  );

  // Cultivation & HUD state (throttled integer updates from simulation)
  const [realmIndex, setRealmIndex] = useState<number>(0);
  const [subLevel, setSubLevel] = useState<number>(1);
  const [bonusClues, setBonusClues] = useState<number>(0);
  const [hudHp, setHudHp] = useState<number>(220);
  const [hudMaxHp, setHudMaxHp] = useState<number>(220);
  const [hudQi, setHudQi] = useState<number>(35);
  const [hudReqQi, setHudReqQi] = useState<number>(100);
  const [hudKills, setHudKills] = useState<number>(0);
  const [hudMuted, setHudMuted] = useState<boolean>(false);
  const [chronicleBanner, setChronicleBanner] = useState<string>(
    'Phàm nhân sơ nhập tiên đồ — Hãy di chuyển [WASD], chém kiếm [J/Chuột] hoặc đến gần Linh Mạch / Cổ Bi!'
  );
  const [nearbyLandmark, setNearbyLandmark] = useState<WorldLandmark | null>(null);
  const [tribulationActive, setTribulationActive] = useState<boolean>(false);
  const [tribulationWavesLeft, setTribulationWavesLeft] = useState<number>(0);

  // Modals
  const [isGddOpen, setIsGddOpen] = useState<boolean>(false);
  const [isCultivationOpen, setIsCultivationOpen] = useState<boolean>(false);
  const [isXianxiaStudioOpen, setIsXianxiaStudioOpen] = useState<boolean>(false);
  const [render3D, setRender3D] = useState<boolean>(true);
  const [activeDestinyEvent, setActiveDestinyEvent] =
    useState<DestinyEventOutcome | null>(null);
  const [endRunSnapshot, setEndRunSnapshot] = useState<{
    victory: boolean;
    realmReached: string;
    kills: number;
    rootRevealed: string;
    summary: string;
  } | null>(null);

  const [inventory, setInventory] = useState<PlayerInventoryState>({
    spiritStones: 45,
    spiritHerbs: 3,
    beastCores: 1,
    breakthroughPills: 1,
    healingPills: 2,
    artifactTier: 1,
    artifactName: 'Thanh Trúc Phong Vân Kiếm',
    sectName: 'Tán Tu Liên Minh',
    mutationBuff: null,
  });

  // Cooldown readouts (throttled to 0.1s)
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({
    sword_combo: 0,
    fire_lotus: 0,
    frost_array: 0,
    thunder_nine: 0,
    myriad_swords_ult: 0,
  });

  // Sync document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = shellState;
  }, [shellState]);

  const discovery = getProgressiveDiscovery(
    charData,
    realmIndex,
    subLevel,
    bonusClues
  );

  // Mutable simulation ref so 60fps loop never recreates canvas on React state changes
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const simRef = useRef<{
    shellState: GameShellState;
    modalOpen: boolean;
    charData: HiddenCharacterData;
    realmIndex: number;
    subLevel: number;
    bonusClues: number;
    artifactTier: number;
    player: {
      wx: number;
      wy: number;
      wz: number;
      vx: number;
      vy: number;
      hp: number;
      maxHp: number;
      qi: number;
      reqQi: number;
      facingAngle: number;
      scaleX: number;
      scaleY: number;
      walkDist: number;
      dashTimer: number;
      dashCooldown: number;
      parryTimer: number;
      meditating: boolean;
      comboStep: number;
      comboResetTimer: number;
      attackAnimTimer: number;
      hitFlash: number;
      invulnTimer: number;
    };
    cooldowns: Record<string, number>;
    kills: number;
    encounterCount: number;
    hitstop: number;
    cameraShake: number;
    camIsoX: number;
    camIsoY: number;
    titleTourAngle: number;
    tribulation: {
      active: boolean;
      wavesTotal: number;
      wavesSpawned: number;
      waveTimer: number;
      hitsTaken: number;
      pillsUsed: number;
      locationBonus: number;
      strikes: TribulationStrike[];
    };
    enemies: EnemyActor[];
    landmarks: WorldLandmark[];
    pickups: PickupNode[];
    particles: PooledParticle[];
    floatingTexts: FloatingCombatText[];
    keysHeld: Set<string>;
    keysJustPressed: Set<string>;
    mouseWorld: { wx: number; wy: number };
    mouseDown: boolean;
  }>({
    shellState: initialAutoStart ? 'playing' : 'title',
    modalOpen: false,
    charData: generateHiddenCharacter('VAN-DAO-777'),
    realmIndex: 0,
    subLevel: 1,
    bonusClues: 0,
    artifactTier: 1,
    player: {
      wx: 0,
      wy: 0,
      wz: 0,
      vx: 0,
      vy: 0,
      hp: 220,
      maxHp: 220,
      qi: 45,
      reqQi: 100,
      facingAngle: 0.78,
      scaleX: 1,
      scaleY: 1,
      walkDist: 0,
      dashTimer: 0,
      dashCooldown: 0,
      parryTimer: 0,
      meditating: false,
      comboStep: 0,
      comboResetTimer: 0,
      attackAnimTimer: 0,
      hitFlash: 0,
      invulnTimer: 0,
    },
    cooldowns: {
      sword_combo: 0,
      fire_lotus: 0,
      frost_array: 0,
      thunder_nine: 0,
      myriad_swords_ult: 0,
    },
    kills: 0,
    encounterCount: 0,
    hitstop: 0,
    cameraShake: 0,
    camIsoX: 0,
    camIsoY: 0,
    titleTourAngle: 0,
    tribulation: {
      active: false,
      wavesTotal: 0,
      wavesSpawned: 0,
      waveTimer: 0,
      hitsTaken: 0,
      pillsUsed: 0,
      locationBonus: 0,
      strikes: Array.from({ length: MAX_TRIBULATION_STRIKES }, () => ({
        active: false,
        wx: 0,
        wy: 0,
        timer: 0,
        maxTimer: 0.75,
        radius: 68,
        struck: false,
      })),
    },
    enemies: [],
    landmarks: [
      {
        id: 'vein_center',
        type: 'vein',
        name: 'Cửu Thiên Linh Mạch Nhãn',
        subtitle: 'Thổ nạp [H] x2 tốc độ · +15% Tỷ lệ Đột Phá',
        wx: -140,
        wy: -110,
        radius: 85,
        color: '#22d3ee',
        cooldown: 0,
      },
      {
        id: 'ancient_stele',
        type: 'stele',
        name: 'Trắc Linh Cổ Bi Thượng Cổ',
        subtitle: 'Nhấn [E] Cảm ứng Linh Căn & Huyết Mạch Ẩn',
        wx: 210,
        wy: -150,
        radius: 75,
        color: '#c89d54',
        cooldown: 0,
      },
      {
        id: 'hidden_cave',
        type: 'cave',
        name: 'Động Phủ Cổ Tán Tu',
        subtitle: 'Nhấn [E] Khám phá Cơ Duyên Bí Ẩn',
        wx: -240,
        wy: 190,
        radius: 80,
        color: '#a855f7',
        cooldown: 0,
      },
      {
        id: 'wandering_immortal',
        type: 'npc',
        name: 'Thanh Hư Đạo Nhân (Cao Nhân Ẩn Thế)',
        subtitle: 'Nhấn [E] Luận Đạo & Thỉnh Giáo Tiên Cơ',
        wx: 160,
        wy: 180,
        radius: 75,
        color: '#34d399',
        cooldown: 0,
      },
    ],
    pickups: Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const dist = 160 + (i % 4) * 115;
      return {
        id: i + 1,
        active: true,
        type: i % 3 === 0 ? 'herb' : 'qi_crystal',
        wx: Math.cos(angle) * dist,
        wy: Math.sin(angle) * dist,
        bobPhase: i * 0.7,
      };
    }),
    particles: Array.from({ length: MAX_PARTICLES }, () => ({
      active: false,
      wx: 0,
      wy: 0,
      wz: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1,
      size: 3,
      color: '#f5c542',
    })),
    floatingTexts: Array.from({ length: MAX_FLOATING_TEXTS }, () => ({
      active: false,
      wx: 0,
      wy: 0,
      wz: 0,
      text: '',
      color: '#ffffff',
      life: 0,
      maxLife: 0.9,
    })),
    keysHeld: new Set<string>(),
    keysJustPressed: new Set<string>(),
    mouseWorld: { wx: 100, wy: 100 },
    mouseDown: false,
  });

  // Sync React state into simRef
  useEffect(() => {
    simRef.current.shellState = shellState;
    simRef.current.modalOpen =
      isGddOpen || isCultivationOpen || activeDestinyEvent !== null;
    simRef.current.charData = charData;
    simRef.current.realmIndex = realmIndex;
    simRef.current.subLevel = subLevel;
    simRef.current.bonusClues = bonusClues;
    simRef.current.artifactTier = inventory.artifactTier;
  }, [
    shellState,
    isGddOpen,
    isCultivationOpen,
    activeDestinyEvent,
    charData,
    realmIndex,
    subLevel,
    bonusClues,
    inventory.artifactTier,
  ]);

  // Helper to spawn pooled particles
  const spawnParticles = useCallback(
    (
      wx: number,
      wy: number,
      wz: number,
      count: number,
      color: string,
      speed: number = 110
    ) => {
      const pool = simRef.current.particles;
      let spawned = 0;
      for (let i = 0; i < pool.length && spawned < count; i++) {
        if (!pool[i].active) {
          const angle = Math.random() * Math.PI * 2;
          const spd = speed * (0.4 + Math.random() * 0.8);
          pool[i].active = true;
          pool[i].wx = wx + (Math.random() - 0.5) * 14;
          pool[i].wy = wy + (Math.random() - 0.5) * 14;
          pool[i].wz = wz + Math.random() * 12;
          pool[i].vx = Math.cos(angle) * spd;
          pool[i].vy = Math.sin(angle) * spd;
          pool[i].vz = 35 + Math.random() * 65;
          pool[i].life = 0;
          pool[i].maxLife = 0.28 + Math.random() * 0.35;
          pool[i].size = 2.5 + Math.random() * 3.5;
          pool[i].color = color;
          spawned++;
        }
      }
    },
    []
  );

  // Helper to spawn pooled floating text
  const spawnFloatingText = useCallback(
    (wx: number, wy: number, wz: number, text: string, color: string) => {
      const pool = simRef.current.floatingTexts;
      for (let i = 0; i < pool.length; i++) {
        if (!pool[i].active) {
          pool[i].active = true;
          pool[i].wx = wx + (Math.random() - 0.5) * 18;
          pool[i].wy = wy + (Math.random() - 0.5) * 18;
          pool[i].wz = wz + 28;
          pool[i].text = text;
          pool[i].color = color;
          pool[i].life = 0;
          pool[i].maxLife = 0.85;
          break;
        }
      }
    },
    []
  );

  // Spawn diverse enemy archetypes on the 2.5D perimeter
  const populateArenaEnemies = useCallback((rIdx: number) => {
    const scale = 1 + rIdx * 0.55;
    const initialEnemies: EnemyActor[] = [
      {
        id: 1,
        archetype: 'charger',
        name: 'Huyết Lang Yêu Thú (Xung Phong)',
        wx: 290,
        wy: 60,
        vx: 0,
        vy: 0,
        hp: Math.round(95 * scale),
        maxHp: Math.round(95 * scale),
        radius: 22,
        color: '#ef4444',
        aiState: 'patrol',
        stateTimer: 0,
        windupDuration: 0.55,
        targetWx: 290,
        targetWy: 60,
        hitFlash: 0,
        koTimer: 0,
        facing: 0,
      },
      {
        id: 2,
        archetype: 'kiter',
        name: 'Huyền Âm Tà Tu (Tầm Xa)',
        wx: -280,
        wy: -40,
        vx: 0,
        vy: 0,
        hp: Math.round(80 * scale),
        maxHp: Math.round(80 * scale),
        radius: 20,
        color: '#a855f7',
        aiState: 'patrol',
        stateTimer: 0,
        windupDuration: 0.65,
        targetWx: -280,
        targetWy: -40,
        hitFlash: 0,
        koTimer: 0,
        facing: 0,
      },
      {
        id: 3,
        archetype: 'shielded',
        name: 'Kim Giáp Khôi Lỗi (Hộ Thuẫn)',
        wx: 60,
        wy: 310,
        vx: 0,
        vy: 0,
        hp: Math.round(145 * scale),
        maxHp: Math.round(145 * scale),
        radius: 26,
        color: '#f59e0b',
        aiState: 'patrol',
        stateTimer: 0,
        windupDuration: 0.75,
        targetWx: 60,
        targetWy: 310,
        hitFlash: 0,
        koTimer: 0,
        facing: 0,
      },
      {
        id: 4,
        archetype: 'charger',
        name: 'Xích Hỏa Yêu Hồ (Đột Kích)',
        wx: -110,
        wy: -310,
        vx: 0,
        vy: 0,
        hp: Math.round(90 * scale),
        maxHp: Math.round(90 * scale),
        radius: 21,
        color: '#f97316',
        aiState: 'patrol',
        stateTimer: 0,
        windupDuration: 0.55,
        targetWx: -110,
        targetWy: -310,
        hitFlash: 0,
        koTimer: 0,
        facing: 0,
      },
      {
        id: 5,
        archetype: 'boss',
        name: 'Cửu U Giao Long Yêu Vương (Thủ Lĩnh)',
        wx: 390,
        wy: 360,
        vx: 0,
        vy: 0,
        hp: Math.round(320 * scale),
        maxHp: Math.round(320 * scale),
        radius: 36,
        color: '#ec4899',
        aiState: 'patrol',
        stateTimer: 0,
        windupDuration: 0.8,
        targetWx: 390,
        targetWy: 360,
        hitFlash: 0,
        koTimer: 0,
        facing: 0,
      },
    ];
    simRef.current.enemies = initialEnemies;
  }, []);

  // Start / Restart game handler
  const startOrResetGame = useCallback(
    (seedOverride?: string) => {
      const activeSeed = seedOverride ?? fateSeed;
      const freshChar = generateHiddenCharacter(activeSeed);
      setCharData(freshChar);
      setRealmIndex(0);
      setSubLevel(1);
      setBonusClues(0);
      setEndRunSnapshot(null);
      setActiveDestinyEvent(null);
      setIsGddOpen(false);
      setIsCultivationOpen(false);
      setTribulationActive(false);

      const sim = simRef.current;
      sim.charData = freshChar;
      sim.realmIndex = 0;
      sim.subLevel = 1;
      sim.bonusClues = 0;
      sim.kills = 0;
      sim.player.wx = 0;
      sim.player.wy = 0;
      sim.player.wz = 0;
      sim.player.vx = 0;
      sim.player.vy = 0;
      sim.player.hp = 220;
      sim.player.maxHp = 220;
      sim.player.qi = 45;
      sim.player.reqQi = CULTIVATION_REALMS[0].baseQiRequired;
      sim.player.invulnTimer = 1.0;
      sim.keysHeld.clear();
      sim.keysJustPressed.clear();
      sim.mouseDown = false;
      sim.tribulation.active = false;

      populateArenaEnemies(0);

      setHudHp(220);
      setHudMaxHp(220);
      setHudQi(45);
      setHudReqQi(CULTIVATION_REALMS[0].baseQiRequired);
      setHudKills(0);
      setChronicleBanner(
        `Khởi đầu Tiên Đồ (Seed: ${freshChar.fateSeed}) — Tư chất Linh Căn hiện đang ẩn giấu. Hãy tu luyện và khám phá!`
      );

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.dataset.state = 'playing';
      setShellState('playing');
      soundEngine.playDestinyChime();
    },
    [fateSeed, populateArenaEnemies]
  );

  // Initialize enemies on mount
  useEffect(() => {
    populateArenaEnemies(0);
  }, [populateArenaEnemies]);

  // Trigger Destiny Encounter at nearby landmark or via [E]
  const triggerDestinyInteraction = useCallback(() => {
    const sim = simRef.current;
    sim.encounterCount += 1;
    const ev = evaluateDestinyEncounter(sim.charData, sim.encounterCount);
    soundEngine.playDestinyChime();
    setActiveDestinyEvent(ev);
  }, []);

  // Resolve player choice in a Destiny Encounter
  const handleChooseDestinyOption = (choiceIdx: number) => {
    if (!activeDestinyEvent) return;
    const choice = activeDestinyEvent.choices[choiceIdx];
    if (!choice) return;

    const sim = simRef.current;
    sim.player.qi = Math.min(
      sim.player.reqQi * 1.5,
      Math.max(0, sim.player.qi + choice.qiDelta)
    );
    const updatedChar: HiddenCharacterData = {
      ...charData,
      foundationStability: Math.min(
        100,
        Math.max(20, charData.foundationStability + choice.foundationDelta)
      ),
      mentalState: Math.min(
        100,
        Math.max(20, charData.mentalState + choice.mentalDelta)
      ),
      karma: charData.karma + choice.karmaDelta,
      pityCounter: Math.max(0, charData.pityCounter - 1),
    };

    const nextClues = bonusClues + choice.clueBonus;
    setCharData(updatedChar);
    setBonusClues(nextClues);
    setHudQi(Math.round(sim.player.qi));
    setInventory((prev) => ({
      ...prev,
      breakthroughPills: prev.breakthroughPills + choice.pillReward,
      spiritStones: prev.spiritStones + 20,
    }));

    setChronicleBanner(`Cơ Duyên: ${choice.outcomeText}`);
    spawnParticles(sim.player.wx, sim.player.wy, 10, 28, '#f5c542', 140);
    spawnFloatingText(
      sim.player.wx,
      sim.player.wy,
      20,
      `+${choice.qiDelta} Linh Lực · Cơ Duyên!`,
      '#f2d08b'
    );
    soundEngine.playDestinyChime();
    setActiveDestinyEvent(null);
  };

  // Start Breakthrough / Heavenly Tribulation
  const handleStartBreakthrough = useCallback(
    (pillsToConsume: number = 0) => {
      const sim = simRef.current;
      if (sim.player.qi < sim.player.reqQi) {
        setChronicleBanner(
          `Chưa đủ Linh Lực Đan Điền (${Math.round(sim.player.qi)}/${sim.player.reqQi})! Hãy nhấn [H] Thổ Nạp hoặc tiêu diệt Yêu Thú.`
        );
        return;
      }

      const currentRealm =
        CULTIVATION_REALMS[sim.realmIndex] || CULTIVATION_REALMS[0];
      const isMajor = sim.subLevel >= currentRealm.subLevels;

      // Check if standing near Spiritual Vein for location bonus
      const veinDist = Math.hypot(sim.player.wx - -140, sim.player.wy - -110);
      const locBonus = veinDist < 130 ? 0.15 : 0.02;

      if (!isMajor || currentRealm.tribulationLightningWaves <= 1) {
        // Immediate breakthrough for Phàm Nhân -> Luyện Khí or minor sub-levels
        const res = resolveBreakthrough({
          realmIndex: sim.realmIndex,
          subLevel: sim.subLevel,
          currentQi: sim.player.qi,
          requiredQi: sim.player.reqQi,
          foundationStability: sim.charData.foundationStability,
          mentalState: sim.charData.mentalState,
          pillsUsed: pillsToConsume,
          locationBonus: locBonus,
          tribulationSurvivalRatio: 1.0,
          spiritualRoot: sim.charData.spiritualRoot,
          fateSeed: sim.charData.fateSeed,
        });

        sim.realmIndex = res.newRealmIndex;
        sim.subLevel = res.newSubLevel;
        const nextRealmSpec =
          CULTIVATION_REALMS[res.newRealmIndex] || CULTIVATION_REALMS[0];
        sim.player.reqQi = Math.round(
          nextRealmSpec.baseQiRequired * (1 + (res.newSubLevel - 1) * 0.22)
        );
        sim.player.qi = Math.round(sim.player.reqQi * res.qiRetainedRatio);
        sim.player.maxHp = Math.round(220 + res.newRealmIndex * 140 + res.newSubLevel * 18);
        sim.player.hp = sim.player.maxHp;

        setRealmIndex(res.newRealmIndex);
        setSubLevel(res.newSubLevel);
        setHudMaxHp(sim.player.maxHp);
        setHudHp(sim.player.hp);
        setHudQi(sim.player.qi);
        setHudReqQi(sim.player.reqQi);
        setChronicleBanner(res.narrativeSummary);
        spawnParticles(
          sim.player.wx,
          sim.player.wy,
          10,
          36,
          sim.charData.spiritualRoot.auraColor,
          170
        );
        spawnFloatingText(
          sim.player.wx,
          sim.player.wy,
          30,
          `ĐỘT PHÁ: ${nextRealmSpec.name} Tầng ${res.newSubLevel}!`,
          '#22d3ee'
        );
        soundEngine.playDestinyChime();
        return;
      }

      // Major Realm Breakthrough with Active Heavenly Tribulation Lightning on the 2.5D Field!
      const actualPills = Math.min(pillsToConsume, inventory.breakthroughPills);
      if (actualPills > 0) {
        setInventory((prev) => ({
          ...prev,
          breakthroughPills: Math.max(0, prev.breakthroughPills - actualPills),
        }));
      }

      const waves = Math.min(6, currentRealm.tribulationLightningWaves + 2);
      sim.tribulation.active = true;
      sim.tribulation.wavesTotal = waves;
      sim.tribulation.wavesSpawned = 0;
      sim.tribulation.waveTimer = 0.2;
      sim.tribulation.hitsTaken = 0;
      sim.tribulation.pillsUsed = actualPills;
      sim.tribulation.locationBonus = locBonus;
      setTribulationActive(true);
      setTribulationWavesLeft(waves);
      setChronicleBanner(
        `THIÊN KIẾP GIÁNG LÂM (${waves} Đạo Kiếp Lôi)! Hãy di chuyển hoặc nhấn [Space] Thân Pháp né tránh vòng sét đỏ!`
      );
      soundEngine.playTribulationThunder();
    },
    [inventory.breakthroughPills, spawnFloatingText, spawnParticles]
  );

  // Execute active combat skill
  const executeCombatSkill = useCallback(
    (skillId: string) => {
      const sim = simRef.current;
      if (sim.shellState !== 'playing' || sim.modalOpen) return;

      const skill = COMBAT_SKILLS.find((s) => s.id === skillId);
      if (!skill) return;

      if ((sim.cooldowns[skill.id] || 0) > 0) return;
      if (sim.player.qi < skill.qiCost) {
        spawnFloatingText(
          sim.player.wx,
          sim.player.wy,
          24,
          'Không đủ Linh Lực!',
          '#f87171'
        );
        return;
      }

      sim.player.qi = Math.max(0, sim.player.qi - skill.qiCost);
      sim.cooldowns[skill.id] = skill.cooldown;
      sim.player.meditating = false;
      sim.player.attackAnimTimer = 0.22;

      if (skill.id === 'sword_combo') {
        sim.player.comboStep = (sim.player.comboStep % 3) + 1;
        sim.player.comboResetTimer = 1.1;
        soundEngine.playSwordSlash(sim.player.comboStep);
      } else {
        soundEngine.playSkillCast(skill.school);
      }

      // Compute target strike point
      const reach = skill.id === 'sword_combo' ? 55 : 95;
      const strikeWx =
        sim.player.wx + Math.cos(sim.player.facingAngle) * reach;
      const strikeWy =
        sim.player.wy + Math.sin(sim.player.facingAngle) * reach;

      spawnParticles(
        strikeWx,
        strikeWy,
        14,
        skill.id === 'myriad_swords_ult' ? 45 : 16,
        skill.color,
        skill.id === 'myriad_swords_ult' ? 220 : 135
      );

      const rawDamage =
        calculateSkillDamage(
          skill,
          sim.charData,
          sim.realmIndex,
          sim.subLevel
        ) *
        (1 + sim.artifactTier * 0.18) *
        (skill.id === 'sword_combo' && sim.player.comboStep === 3 ? 1.45 : 1.0);

      let hitCount = 0;
      for (const enemy of sim.enemies) {
        if (enemy.aiState === 'ko') continue;
        const dist = Math.hypot(enemy.wx - strikeWx, enemy.wy - strikeWy);
        if (dist <= skill.aoeRadius + enemy.radius) {
          hitCount++;
          const finalDmg = Math.round(
            rawDamage *
              (enemy.archetype === 'shielded' && skill.id === 'sword_combo'
                ? 0.65
                : 1.0)
          );
          enemy.hp -= finalDmg;
          enemy.hitFlash = 0.08;

          // Knockback impulse
          const pushAngle = Math.atan2(
            enemy.wy - sim.player.wy,
            enemy.wx - sim.player.wx
          );
          enemy.vx += Math.cos(pushAngle) * 160;
          enemy.vy += Math.sin(pushAngle) * 160;

          spawnFloatingText(
            enemy.wx,
            enemy.wy,
            24,
            `-${finalDmg}`,
            skill.color
          );
          spawnParticles(enemy.wx, enemy.wy, 14, 10, skill.color, 120);

          if (enemy.hp <= 0) {
            enemy.hp = 0;
            enemy.aiState = 'ko';
            enemy.koTimer = 0.42;
            sim.kills += 1;
            sim.player.qi = Math.min(
              sim.player.reqQi * 1.4,
              sim.player.qi + (enemy.archetype === 'boss' ? 85 : 28)
            );
            sim.charData.foundationStability = Math.min(
              100,
              sim.charData.foundationStability + 2.5
            );
            setHudKills(sim.kills);
            setInventory((prev) => ({
              ...prev,
              spiritStones: prev.spiritStones + (enemy.archetype === 'boss' ? 40 : 8),
              beastCores:
                prev.beastCores + (enemy.archetype === 'boss' || Math.random() < 0.35 ? 1 : 0),
            }));
            spawnFloatingText(
              enemy.wx,
              enemy.wy,
              36,
              enemy.archetype === 'boss'
                ? 'TRẢM YÊU VƯƠNG! +85 Linh Lực'
                : '+28 Linh Lực · +8 Linh Thạch',
              '#34d399'
            );
            soundEngine.playHeavyImpact();
          }
        }
      }

      if (hitCount > 0) {
        if (skill.id === 'sword_combo') {
          sim.player.qi = Math.min(
            sim.player.reqQi * 1.4,
            sim.player.qi + 7 * hitCount
          );
        }
        sim.hitstop = skill.id === 'myriad_swords_ult' ? 0.065 : 0.035;
        sim.cameraShake = Math.min(
          1.0,
          sim.cameraShake + (skill.id === 'myriad_swords_ult' ? 0.55 : 0.22)
        );
      }
      setHudQi(Math.round(sim.player.qi));
    },
    [spawnFloatingText, spawnParticles]
  );

  // Isolated 60fps Canvas & Input Loop (`useEffect(..., [])`)
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'block w-full h-full cursor-crosshair';
    canvas.setAttribute('data-testid', 'xianxia-isometric-canvas');
    mount.innerHTML = '';
    mount.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    updateCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(mount);

    const screenToWorld = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left - rect.width * 0.5 + simRef.current.camIsoX;
      const sy = clientY - rect.top - rect.height * 0.5 + simRef.current.camIsoY;
      return isoToWorld(sx, sy);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if typing in an input inside a modal
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const code = e.code;
      const sim = simRef.current;

      // Title screen Enter/Space start handshake
      if (sim.shellState === 'title' && !sim.modalOpen) {
        if (code === 'Enter' || code === 'Space') {
          e.preventDefault();
          startOrResetGame();
          return;
        }
      }

      // Global GDD Codex shortcut [G]
      if (code === 'KeyG') {
        e.preventDefault();
        setIsGddOpen((prev) => !prev);
        return;
      }

      // Mute toggle [M]
      if (code === 'KeyM') {
        e.preventDefault();
        soundEngine.muted = !soundEngine.muted;
        setHudMuted(soundEngine.muted);
        return;
      }

      // Escape or P pause/close modal handling
      if (code === 'Escape' || code === 'KeyP') {
        e.preventDefault();
        if (sim.modalOpen) {
          setIsGddOpen(false);
          setIsCultivationOpen(false);
          setActiveDestinyEvent(null);
          return;
        }
        if (sim.shellState === 'playing') {
          document.body.dataset.state = 'paused';
          setShellState('paused');
          sim.keysHeld.clear();
          return;
        } else if (sim.shellState === 'paused') {
          document.body.dataset.state = 'playing';
          setShellState('playing');
          return;
        }
      }

      if (code === 'KeyC' && sim.shellState === 'playing') {
        e.preventDefault();
        setIsCultivationOpen((prev) => !prev);
        return;
      }

      if (code === 'KeyR' && sim.shellState === 'playing' && !sim.modalOpen) {
        e.preventDefault();
        startOrResetGame();
        return;
      }

      if (!sim.keysHeld.has(code)) {
        sim.keysJustPressed.add(code);
      }
      sim.keysHeld.add(code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      simRef.current.keysHeld.delete(e.code);
    };

    const clearInputsOnBlur = () => {
      simRef.current.keysHeld.clear();
      simRef.current.keysJustPressed.clear();
      simRef.current.mouseDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const w = screenToWorld(e.clientX, e.clientY);
      simRef.current.mouseWorld = w;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const sim = simRef.current;
      if (sim.shellState !== 'playing' || sim.modalOpen) return;
      sim.mouseDown = true;
      const w = screenToWorld(e.clientX, e.clientY);
      sim.mouseWorld = w;
      sim.player.facingAngle = Math.atan2(
        w.wy - sim.player.wy,
        w.wx - sim.player.wx
      );
      executeCombatSkill('sword_combo');
    };

    const onMouseUp = () => {
      simRef.current.mouseDown = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearInputsOnBlur);
    document.addEventListener('visibilitychange', clearInputsOnBlur);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let lastTime = performance.now();
    let hudSyncAccum = 0;
    let lastSyncHp = -1;
    let lastSyncQi = -1;
    let lastCdSig = '';
    let lastLandmarkId = '';
    let animFrameId = 0;

    // Pre-computed decorative bamboo/rock props in 2.5D world coordinates
    const bambooProps = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      const r = 340 + (i % 3) * 95;
      return {
        wx: Math.cos(a) * r,
        wy: Math.sin(a) * r,
        height: 45 + (i % 4) * 14,
      };
    });

    const tick = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

      const sim = simRef.current;

      // Update camera shake & hitstop in real dt
      if (sim.hitstop > 0) {
        sim.hitstop = Math.max(0, sim.hitstop - dt);
      }
      if (sim.cameraShake > 0) {
        sim.cameraShake = Math.max(0, sim.cameraShake - dt * 2.4);
      }

      const simDt =
        sim.shellState === 'playing' && !sim.modalOpen
          ? sim.hitstop > 0
            ? dt * 0.08
            : dt
          : 0;

      // Title screen camera pan
      if (sim.shellState === 'title') {
        sim.titleTourAngle += dt * 0.25;
        const panWx = Math.cos(sim.titleTourAngle) * 110;
        const panWy = Math.sin(sim.titleTourAngle) * 110;
        const isoCam = worldToIso(panWx, panWy, 0);
        sim.camIsoX = isoCam.isoX;
        sim.camIsoY = isoCam.isoY;
      }

      // Active Gameplay Simulation Step
      if (simDt > 0) {
        const p = sim.player;

        // Tick skill cooldowns
        for (const k of Object.keys(sim.cooldowns)) {
          if (sim.cooldowns[k] > 0) {
            sim.cooldowns[k] = Math.max(0, sim.cooldowns[k] - simDt);
          }
        }
        if (p.dashCooldown > 0) p.dashCooldown = Math.max(0, p.dashCooldown - simDt);
        if (p.dashTimer > 0) p.dashTimer = Math.max(0, p.dashTimer - simDt);
        if (p.parryTimer > 0) p.parryTimer = Math.max(0, p.parryTimer - simDt);
        if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - simDt);
        if (p.attackAnimTimer > 0)
          p.attackAnimTimer = Math.max(0, p.attackAnimTimer - simDt);
        if (p.hitFlash > 0) p.hitFlash = Math.max(0, p.hitFlash - simDt);
        if (p.comboResetTimer > 0) {
          p.comboResetTimer = Math.max(0, p.comboResetTimer - simDt);
          if (p.comboResetTimer === 0) p.comboResetTimer = 0;
        }

        // Consume edge-triggered justPressed actions
        if (sim.keysJustPressed.has('Space') && p.dashCooldown <= 0) {
          p.dashTimer = 0.18;
          p.dashCooldown = 0.9;
          p.invulnTimer = 0.22;
          p.meditating = false;
          p.scaleX = 1.25;
          p.scaleY = 0.78;
          soundEngine.playDash();
          spawnParticles(
            p.wx,
            p.wy,
            8,
            12,
            sim.charData.spiritualRoot.auraColor,
            150
          );
        }

        if (sim.keysJustPressed.has('ShiftLeft') || sim.keysJustPressed.has('ShiftRight')) {
          p.parryTimer = 0.35;
          p.meditating = false;
          spawnFloatingText(p.wx, p.wy, 26, 'Hộ Thể Kiếm Thuẫn!', '#f5c542');
        }

        if (sim.keysJustPressed.has('KeyH')) {
          p.meditating = !p.meditating;
          spawnFloatingText(
            p.wx,
            p.wy,
            26,
            p.meditating ? 'Bắt đầu Thổ Nạp Linh Khí...' : 'Thu công!',
            '#22d3ee'
          );
        }

        if (sim.keysJustPressed.has('KeyJ')) executeCombatSkill('sword_combo');
        if (sim.keysJustPressed.has('KeyK')) executeCombatSkill('fire_lotus');
        if (sim.keysJustPressed.has('KeyL')) executeCombatSkill('frost_array');
        if (sim.keysJustPressed.has('KeyU')) executeCombatSkill('thunder_nine');
        if (sim.keysJustPressed.has('KeyI')) executeCombatSkill('myriad_swords_ult');
        if (sim.keysJustPressed.has('KeyB')) handleStartBreakthrough(1);
        if (sim.keysJustPressed.has('KeyE')) triggerDestinyInteraction();

        sim.keysJustPressed.clear();

        // Movement input in screen space mapped to isometric world
        let moveScreenX = 0;
        let moveScreenY = 0;
        if (sim.keysHeld.has('KeyW') || sim.keysHeld.has('ArrowUp')) moveScreenY -= 1;
        if (sim.keysHeld.has('KeyS') || sim.keysHeld.has('ArrowDown')) moveScreenY += 1;
        if (sim.keysHeld.has('KeyA') || sim.keysHeld.has('ArrowLeft')) moveScreenX -= 1;
        if (sim.keysHeld.has('KeyD') || sim.keysHeld.has('ArrowRight')) moveScreenX += 1;

        if (moveScreenX !== 0 || moveScreenY !== 0) {
          p.meditating = false;
          const worldDir = isoToWorld(moveScreenX, moveScreenY * 0.5);
          const len = Math.hypot(worldDir.wx, worldDir.wy) || 1;
          const nx = worldDir.wx / len;
          const ny = worldDir.wy / len;
          const baseSpeed =
            (195 + sim.realmIndex * 22) * (p.dashTimer > 0 ? 2.6 : 1.0);
          p.vx = nx * baseSpeed;
          p.vy = ny * baseSpeed;
          p.facingAngle = Math.atan2(ny, nx);
          p.walkDist += baseSpeed * simDt;
        } else {
          p.vx *= Math.pow(0.001, simDt);
          p.vy *= Math.pow(0.001, simDt);
        }

        p.wx = Math.max(-520, Math.min(520, p.wx + p.vx * simDt));
        p.wy = Math.max(-520, Math.min(520, p.wy + p.vy * simDt));

        // Exponentially damp squash-and-stretch back to 1
        p.scaleX += (1 - p.scaleX) * Math.min(1, simDt * 12);
        p.scaleY += (1 - p.scaleY) * Math.min(1, simDt * 12);

        // Passive & Meditation Qi absorption
        const nearVein =
          Math.hypot(p.wx - -140, p.wy - -110) <= 115 ? 2.2 : 1.0;
        const qiRate =
          (p.meditating ? 18 : 3.2) *
          sim.charData.spiritualRoot.qiAbsorptionRate *
          nearVein;
        p.qi = Math.min(p.reqQi * 1.5, p.qi + qiRate * simDt);

        if (p.meditating) {
          p.hp = Math.min(p.maxHp, p.hp + 12 * simDt);
          if (Math.random() < 0.25) {
            spawnParticles(
              p.wx,
              p.wy,
              6,
              1,
              sim.charData.spiritualRoot.auraColor,
              45
            );
          }
        }

        // Check pickups (Qi Crystals & Spirit Herbs)
        for (const node of sim.pickups) {
          node.bobPhase += simDt * 3;
          if (!node.active) continue;
          const d = Math.hypot(p.wx - node.wx, p.wy - node.wy);
          if (d < 36) {
            node.active = false;
            if (node.type === 'qi_crystal') {
              p.qi = Math.min(p.reqQi * 1.5, p.qi + 24);
              spawnFloatingText(node.wx, node.wy, 20, '+24 Linh Lực', '#22d3ee');
              spawnParticles(node.wx, node.wy, 10, 10, '#22d3ee', 90);
            } else {
              setInventory((prev) => ({
                ...prev,
                spiritHerbs: prev.spiritHerbs + 1,
              }));
              spawnFloatingText(node.wx, node.wy, 20, '+1 Linh Thảo', '#34d399');
              spawnParticles(node.wx, node.wy, 10, 10, '#34d399', 90);
            }
            soundEngine.playDash();
            setTimeout(() => {
              const ang = Math.random() * Math.PI * 2;
              const rad = 140 + Math.random() * 320;
              node.wx = Math.cos(ang) * rad;
              node.wy = Math.sin(ang) * rad;
              node.active = true;
            }, 6000);
          }
        }

        // Update Heavenly Tribulation Lightning if active
        if (sim.tribulation.active) {
          sim.tribulation.waveTimer -= simDt;
          if (
            sim.tribulation.waveTimer <= 0 &&
            sim.tribulation.wavesSpawned < sim.tribulation.wavesTotal
          ) {
            const strikeSlot = sim.tribulation.strikes.find((s) => !s.active);
            if (strikeSlot) {
              strikeSlot.active = true;
              strikeSlot.wx = p.wx + (Math.random() - 0.5) * 70;
              strikeSlot.wy = p.wy + (Math.random() - 0.5) * 70;
              strikeSlot.timer = 0;
              strikeSlot.maxTimer = 0.78;
              strikeSlot.radius = 66;
              strikeSlot.struck = false;
            }
            sim.tribulation.wavesSpawned += 1;
            sim.tribulation.waveTimer = 1.05;
            setTribulationWavesLeft(
              Math.max(0, sim.tribulation.wavesTotal - sim.tribulation.wavesSpawned + 1)
            );
          }

          let activeStrikesCount = 0;
          for (const st of sim.tribulation.strikes) {
            if (!st.active) continue;
            activeStrikesCount++;
            st.timer += simDt;
            if (!st.struck && st.timer >= st.maxTimer) {
              st.struck = true;
              soundEngine.playTribulationThunder();
              sim.cameraShake = Math.min(1, sim.cameraShake + 0.45);
              spawnParticles(st.wx, st.wy, 15, 26, '#a855f7', 190);

              const distToStrike = Math.hypot(p.wx - st.wx, p.wy - st.wy);
              if (distToStrike <= st.radius) {
                if (p.invulnTimer > 0 || p.parryTimer > 0) {
                  spawnFloatingText(
                    p.wx,
                    p.wy,
                    32,
                    'HÓA GIẢI KIẾP LÔI!',
                    '#22d3ee'
                  );
                } else {
                  sim.tribulation.hitsTaken += 1;
                  const thunderDmg = Math.round(p.maxHp * 0.16);
                  p.hp = Math.max(1, p.hp - thunderDmg);
                  p.hitFlash = 0.12;
                  spawnFloatingText(
                    p.wx,
                    p.wy,
                    32,
                    `-${thunderDmg} Thiên Kiếp Lôi!`,
                    '#c084fc'
                  );
                }
              } else {
                spawnFloatingText(p.wx, p.wy, 32, 'Né Kiếp Lôi!', '#4ade80');
              }
            }
            if (st.timer >= st.maxTimer + 0.35) {
              st.active = false;
            }
          }

          if (
            sim.tribulation.wavesSpawned >= sim.tribulation.wavesTotal &&
            activeStrikesCount === 0
          ) {
            sim.tribulation.active = false;
            setTribulationActive(false);

            const survivalRatio = Math.max(
              0,
              1 - sim.tribulation.hitsTaken / Math.max(1, sim.tribulation.wavesTotal)
            );
            const res = resolveBreakthrough({
              realmIndex: sim.realmIndex,
              subLevel: sim.subLevel,
              currentQi: p.qi,
              requiredQi: p.reqQi,
              foundationStability: sim.charData.foundationStability,
              mentalState: sim.charData.mentalState,
              pillsUsed: sim.tribulation.pillsUsed,
              locationBonus: sim.tribulation.locationBonus,
              tribulationSurvivalRatio: survivalRatio,
              spiritualRoot: sim.charData.spiritualRoot,
              fateSeed: sim.charData.fateSeed,
            });

            sim.realmIndex = res.newRealmIndex;
            sim.subLevel = res.newSubLevel;
            const nextRealmSpec =
              CULTIVATION_REALMS[res.newRealmIndex] || CULTIVATION_REALMS[0];
            p.reqQi = Math.round(
              nextRealmSpec.baseQiRequired * (1 + (res.newSubLevel - 1) * 0.22)
            );
            p.qi = Math.round(p.reqQi * res.qiRetainedRatio);
            p.maxHp = Math.round(
              220 + res.newRealmIndex * 150 + res.newSubLevel * 20
            );
            p.hp =
              res.outcome === 'FAILURE_QI_DEVIATION'
                ? Math.max(25, Math.round(p.maxHp * (1 - res.hpPenaltyRatio)))
                : p.maxHp;

            if (res.mutationBuffName) {
              setInventory((prev) => ({
                ...prev,
                mutationBuff: res.mutationBuffName || null,
              }));
            }

            setRealmIndex(res.newRealmIndex);
            setSubLevel(res.newSubLevel);
            setHudMaxHp(p.maxHp);
            setHudHp(p.hp);
            setHudQi(p.qi);
            setHudReqQi(p.reqQi);
            setChronicleBanner(res.narrativeSummary);
            spawnParticles(p.wx, p.wy, 16, 48, '#f5c542', 210);
            soundEngine.playDestinyChime();
          }
        }

        // Update Enemy AI
        let concurrentAttackers = 0;
        for (const e of sim.enemies) {
          if (e.aiState === 'windup' || e.aiState === 'attack') {
            concurrentAttackers++;
          }
        }

        for (const e of sim.enemies) {
          if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - simDt);

          if (e.aiState === 'ko') {
            e.koTimer -= simDt;
            e.wx += e.vx * simDt;
            e.wy += e.vy * simDt;
            e.vx *= 0.9;
            e.vy *= 0.9;
            if (e.koTimer <= 0) {
              const ang = Math.random() * Math.PI * 2;
              const dist = 340 + Math.random() * 140;
              e.wx = Math.cos(ang) * dist;
              e.wy = Math.sin(ang) * dist;
              e.maxHp = Math.round(
                (e.archetype === 'boss' ? 340 : 100) * (1 + sim.realmIndex * 0.55)
              );
              e.hp = e.maxHp;
              e.aiState = 'patrol';
              e.stateTimer = 1.0;
            }
            continue;
          }

          const distToPlayer = Math.hypot(p.wx - e.wx, p.wy - e.wy);
          const angleToPlayer = Math.atan2(p.wy - e.wy, p.wx - e.wx);
          e.facing = angleToPlayer;

          const playerInSanctuary =
            Math.hypot(p.wx, p.wy) < 110 && p.attackAnimTimer <= 0 && sim.kills === 0;

          if (e.aiState === 'patrol' || e.aiState === 'chase') {
            if (distToPlayer < 310 && !playerInSanctuary) {
              e.aiState = 'chase';
              if (e.archetype === 'charger') {
                if (distToPlayer > 105) {
                  e.vx = Math.cos(angleToPlayer) * 105;
                  e.vy = Math.sin(angleToPlayer) * 105;
                } else if (concurrentAttackers < 3) {
                  e.aiState = 'windup';
                  e.stateTimer = e.windupDuration;
                  e.targetWx = p.wx + Math.cos(angleToPlayer) * 55;
                  e.targetWy = p.wy + Math.sin(angleToPlayer) * 55;
                  e.vx = 0;
                  e.vy = 0;
                  concurrentAttackers++;
                }
              } else if (e.archetype === 'kiter') {
                if (distToPlayer < 130) {
                  e.vx = -Math.cos(angleToPlayer) * 95;
                  e.vy = -Math.sin(angleToPlayer) * 95;
                } else if (distToPlayer > 220) {
                  e.vx = Math.cos(angleToPlayer) * 90;
                  e.vy = Math.sin(angleToPlayer) * 90;
                } else {
                  e.vx = -Math.sin(angleToPlayer) * 75;
                  e.vy = Math.cos(angleToPlayer) * 75;
                  if (concurrentAttackers < 3 && Math.random() < simDt * 1.4) {
                    e.aiState = 'windup';
                    e.stateTimer = e.windupDuration;
                    e.targetWx = p.wx;
                    e.targetWy = p.wy;
                    concurrentAttackers++;
                  }
                }
              } else {
                const spd = e.archetype === 'boss' ? 78 : 65;
                if (distToPlayer > 95) {
                  e.vx = Math.cos(angleToPlayer) * spd;
                  e.vy = Math.sin(angleToPlayer) * spd;
                } else if (concurrentAttackers < 3) {
                  e.aiState = 'windup';
                  e.stateTimer = e.windupDuration;
                  e.targetWx = e.wx;
                  e.targetWy = e.wy;
                  e.vx = 0;
                  e.vy = 0;
                  concurrentAttackers++;
                }
              }
            } else {
              e.stateTimer -= simDt;
              if (e.stateTimer <= 0) {
                const randA = Math.random() * Math.PI * 2;
                e.vx = Math.cos(randA) * 35;
                e.vy = Math.sin(randA) * 35;
                e.stateTimer = 2.0 + Math.random() * 2.0;
              }
            }
          } else if (e.aiState === 'windup') {
            e.vx *= 0.85;
            e.vy *= 0.85;
            e.stateTimer -= simDt;
            if (e.stateTimer <= 0) {
              e.aiState = 'attack';
              e.stateTimer = 0.22;

              if (e.archetype === 'charger') {
                const dashA = Math.atan2(e.targetWy - e.wy, e.targetWx - e.wx);
                e.vx = Math.cos(dashA) * 340;
                e.vy = Math.sin(dashA) * 340;
              }

              const hitCenterWx =
                e.archetype === 'kiter' ? e.targetWx : e.wx;
              const hitCenterWy =
                e.archetype === 'kiter' ? e.targetWy : e.wy;
              const hitRad =
                e.archetype === 'boss'
                  ? 92
                  : e.archetype === 'shielded'
                  ? 76
                  : 58;

              spawnParticles(hitCenterWx, hitCenterWy, 10, 14, e.color, 130);

              const pDist = Math.hypot(p.wx - hitCenterWx, p.wy - hitCenterWy);
              if (pDist <= hitRad) {
                if (p.parryTimer > 0) {
                  e.hp -= 45;
                  e.hitFlash = 0.12;
                  sim.hitstop = 0.05;
                  spawnFloatingText(
                    p.wx,
                    p.wy,
                    30,
                    'PHẢN CHẤN PARRY! -45',
                    '#f5c542'
                  );
                  soundEngine.playHeavyImpact();
                } else if (p.invulnTimer <= 0) {
                  const incomingDmg =
                    e.archetype === 'boss'
                      ? 28
                      : e.archetype === 'shielded'
                      ? 20
                      : 15;
                  p.hp = Math.max(0, p.hp - incomingDmg);
                  p.hitFlash = 0.12;
                  p.invulnTimer = 0.45;
                  sim.cameraShake = Math.min(1, sim.cameraShake + 0.3);
                  spawnFloatingText(
                    p.wx,
                    p.wy,
                    28,
                    `-${incomingDmg} HP`,
                    '#ef4444'
                  );
                  soundEngine.playHeavyImpact();

                  if (p.hp <= 0) {
                    const realmName =
                      CULTIVATION_REALMS[sim.realmIndex]?.name || 'Phàm Nhân';
                    const disc = getProgressiveDiscovery(
                      sim.charData,
                      sim.realmIndex,
                      sim.subLevel,
                      sim.bonusClues
                    );
                    setEndRunSnapshot({
                      victory: false,
                      realmReached: `${realmName} (Tầng ${sim.subLevel})`,
                      kills: sim.kills,
                      rootRevealed: disc.visibleRootName,
                      summary:
                        'Trọng thương trên đường tu tiên! Hãy điều tức đan điền và tái chiến.',
                    });
                    document.body.dataset.state = 'gameover';
                    setShellState('gameover');
                  }
                }
              }
            }
          } else if (e.aiState === 'attack') {
            e.stateTimer -= simDt;
            if (e.stateTimer <= 0) {
              e.aiState = 'recover';
              e.stateTimer = 0.65;
              e.vx = 0;
              e.vy = 0;
            }
          } else if (e.aiState === 'recover') {
            e.stateTimer -= simDt;
            if (e.stateTimer <= 0) {
              e.aiState = 'chase';
            }
          }

          e.wx = Math.max(-540, Math.min(540, e.wx + e.vx * simDt));
          e.wy = Math.max(-540, Math.min(540, e.wy + e.vy * simDt));
        }

        // Smooth camera follow in playing mode
        const targetIso = worldToIso(p.wx, p.wy, 0);
        sim.camIsoX += (targetIso.isoX - sim.camIsoX) * Math.min(1, simDt * 8);
        sim.camIsoY += (targetIso.isoY - sim.camIsoY) * Math.min(1, simDt * 8);

        // Update pooled particles
        for (const pt of sim.particles) {
          if (!pt.active) continue;
          pt.life += dt;
          if (pt.life >= pt.maxLife) {
            pt.active = false;
            continue;
          }
          pt.wx += pt.vx * dt;
          pt.wy += pt.vy * dt;
          pt.wz = Math.max(0, pt.wz + pt.vz * dt);
          pt.vz -= 160 * dt;
        }

        // Update pooled floating combat texts
        for (const ft of sim.floatingTexts) {
          if (!ft.active) continue;
          ft.life += dt;
          if (ft.life >= ft.maxLife) {
            ft.active = false;
            continue;
          }
          ft.wz += 26 * dt;
        }

        // Throttled & deduplicated HUD React sync (only triggers React state update when integer/display values change)
        hudSyncAccum += dt;
        if (hudSyncAccum >= 0.15) {
          hudSyncAccum = 0;
          const rHp = Math.round(p.hp);
          const rQi = Math.round(p.qi);
          if (rHp !== lastSyncHp) {
            lastSyncHp = rHp;
            setHudHp(rHp);
          }
          if (rQi !== lastSyncQi) {
            lastSyncQi = rQi;
            setHudQi(rQi);
          }

          const cdSig = Object.values(sim.cooldowns)
            .map((v) => v.toFixed(1))
            .join('|');
          if (cdSig !== lastCdSig) {
            lastCdSig = cdSig;
            setSkillCooldowns({ ...sim.cooldowns });
          }

          let closestLm: WorldLandmark | null = null;
          for (const lm of sim.landmarks) {
            if (Math.hypot(p.wx - lm.wx, p.wy - lm.wy) <= lm.radius + 35) {
              closestLm = lm;
              break;
            }
          }
          const lmId = closestLm ? closestLm.id : '';
          if (lmId !== lastLandmarkId) {
            lastLandmarkId = lmId;
            setNearbyLandmark(closestLm);
          }
        }
      }

      // ========================================================================
      // 2.5D ISOMETRIC RENDERING PASS
      // ========================================================================
      if (simDt === 0 && sim.shellState !== 'title') {
        timerId = window.setTimeout(() => {
          animFrameId = requestAnimationFrame(tick);
        }, 120);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Xianxia atmospheric sky & mist background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#060a10');
      bgGrad.addColorStop(0.55, '#0c1522');
      bgGrad.addColorStop(1, '#080e17');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Apply decaying trauma camera shake
      const shakeMag = sim.cameraShake * sim.cameraShake * 11;
      const shakeX = (Math.random() - 0.5) * shakeMag;
      const shakeY = (Math.random() - 0.5) * shakeMag;

      // On Title Screen, shift camera center rightwards so the left 42% is calm negative space for the Title Lockup
      const anchorXRatio = sim.shellState === 'title' ? 0.68 : 0.5;
      const centerX = width * anchorXRatio - sim.camIsoX + shakeX;
      const centerY = height * 0.52 - sim.camIsoY + shakeY;

      // Draw 2.5D Isometric Stone & Jade Tile Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
      ctx.lineWidth = 1;
      const gridStep = 80;
      for (let gx = -560; gx <= 560; gx += gridStep) {
        const p1 = worldToIso(gx, -560, 0);
        const p2 = worldToIso(gx, 560, 0);
        ctx.beginPath();
        ctx.moveTo(centerX + p1.isoX, centerY + p1.isoY);
        ctx.lineTo(centerX + p2.isoX, centerY + p2.isoY);
        ctx.stroke();
      }
      for (let gy = -560; gy <= 560; gy += gridStep) {
        const p1 = worldToIso(-560, gy, 0);
        const p2 = worldToIso(560, gy, 0);
        ctx.beginPath();
        ctx.moveTo(centerX + p1.isoX, centerY + p1.isoY);
        ctx.lineTo(centerX + p2.isoX, centerY + p2.isoY);
        ctx.stroke();
      }

      // Draw Central Bagua Cultivation Plaza
      const originIso = worldToIso(0, 0, 0);
      ctx.save();
      ctx.translate(centerX + originIso.isoX, centerY + originIso.isoY);
      ctx.scale(1, 0.5);
      ctx.strokeStyle = 'rgba(200, 157, 84, 0.28)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 135, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 95, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw World Landmarks (Spiritual Vein, Ancient Stele, Cave Abode, Immortal NPC)
      for (const lm of sim.landmarks) {
        const lIso = worldToIso(lm.wx, lm.wy, 0);
        const lx = centerX + lIso.isoX;
        const ly = centerY + lIso.isoY;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.scale(1, 0.5);
        ctx.fillStyle = `${lm.color}1c`;
        ctx.strokeStyle = `${lm.color}99`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, lm.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Ornate Jade/Stone Monument Pillar
        ctx.fillStyle = '#16202e';
        ctx.strokeStyle = lm.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, ly - 58);
        ctx.lineTo(lx + 18, ly - 14);
        ctx.lineTo(lx, ly + 2);
        ctx.lineTo(lx - 18, ly - 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (sim.shellState !== 'title') {
          ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(lm.name, lx, ly - 68);
          ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = lm.color;
          ctx.fillText(lm.subtitle, lx, ly - 54);
        }
      }

      // Draw Collectible Pickups (Qi Crystals & Spirit Herbs)
      for (const node of sim.pickups) {
        if (!node.active) continue;
        const bobZ = Math.sin(node.bobPhase) * 6 + 8;
        const nIso = worldToIso(node.wx, node.wy, bobZ);
        const nx = centerX + nIso.isoX;
        const ny = centerY + nIso.isoY;

        ctx.fillStyle = node.type === 'qi_crystal' ? '#22d3ee' : '#34d399';
        ctx.beginPath();
        ctx.moveTo(nx, ny - 11);
        ctx.lineTo(nx + 8, ny);
        ctx.lineTo(nx, ny + 11);
        ctx.lineTo(nx - 8, ny);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Heavenly Tribulation Lightning Telegraphs
      for (const st of sim.tribulation.strikes) {
        if (!st.active) continue;
        const sIso = worldToIso(st.wx, st.wy, 0);
        const sx = centerX + sIso.isoX;
        const sy = centerY + sIso.isoY;
        const progress = Math.min(1, st.timer / st.maxTimer);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(1, 0.5);
        ctx.strokeStyle = st.struck ? '#e879f9' : '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, st.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = st.struck
          ? 'rgba(216, 180, 254, 0.55)'
          : 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath();
        ctx.arc(0, 0, st.radius * progress, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (st.struck) {
          ctx.strokeStyle = '#f5d0fe';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(sx - 12, sy - 260);
          ctx.lineTo(sx + 10, sy - 160);
          ctx.lineTo(sx - 8, sy - 80);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }

      // Draw Enemy Windup Telegraphs & Distinct Enemy Archetypes
      for (const e of sim.enemies) {
        const eIso = worldToIso(e.wx, e.wy, 0);
        const ex = centerX + eIso.isoX;
        const ey = centerY + eIso.isoY;

        if (e.aiState === 'windup') {
          const tIso = worldToIso(e.targetWx, e.targetWy, 0);
          const tx = centerX + tIso.isoX;
          const ty = centerY + tIso.isoY;
          const rad =
            e.archetype === 'boss'
              ? 92
              : e.archetype === 'shielded'
              ? 76
              : 58;

          ctx.save();
          ctx.translate(tx, ty);
          ctx.scale(1, 0.5);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.24)';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, rad, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Shadow
        ctx.save();
        ctx.translate(ex, ey);
        ctx.scale(1, 0.5);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(0, 0, e.radius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Distinct 2.5D Silhouette per Enemy Archetype
        const bodyH = e.archetype === 'boss' ? 48 : 32;
        ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : '#131c29';
        ctx.strokeStyle = e.hitFlash > 0 ? '#ffffff' : e.color;
        ctx.lineWidth = 2.2;

        ctx.beginPath();
        if (e.archetype === 'charger') {
          // Demon Wolf / Beast silhouette with pointed ears
          ctx.moveTo(ex - 14, ey - 8);
          ctx.lineTo(ex - 10, ey - 32);
          ctx.lineTo(ex - 3, ey - 24);
          ctx.lineTo(ex + 3, ey - 24);
          ctx.lineTo(ex + 10, ey - 32);
          ctx.lineTo(ex + 14, ey - 8);
          ctx.closePath();
        } else if (e.archetype === 'shielded') {
          // Hexagonal Golden Armor Guardian
          ctx.moveTo(ex, ey - 38);
          ctx.lineTo(ex + 18, ey - 26);
          ctx.lineTo(ex + 16, ey - 6);
          ctx.lineTo(ex - 16, ey - 6);
          ctx.lineTo(ex - 18, ey - 26);
          ctx.closePath();
        } else if (e.archetype === 'boss') {
          // Horned Dragon Sovereign
          ctx.moveTo(ex, ey - 54);
          ctx.lineTo(ex + 24, ey - 36);
          ctx.lineTo(ex + 18, ey - 6);
          ctx.lineTo(ex - 18, ey - 6);
          ctx.lineTo(ex - 24, ey - 36);
          ctx.closePath();
        } else {
          // Ranged Dark Cultivator
          ctx.moveTo(ex, ey - 36);
          ctx.lineTo(ex + 13, ey - 8);
          ctx.lineTo(ex - 13, ey - 8);
          ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();

        // Health bar above enemy
        if (e.aiState !== 'ko' && sim.shellState !== 'title') {
          const bw = e.archetype === 'boss' ? 78 : 50;
          const hpRatio = Math.max(0, e.hp / e.maxHp);
          ctx.fillStyle = '#090d14';
          ctx.fillRect(ex - bw / 2, ey - bodyH - 16, bw, 5);
          ctx.fillStyle = e.color;
          ctx.fillRect(ex - bw / 2, ey - bodyH - 16, bw * hpRatio, 5);

          ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#e2e8f0';
          ctx.textAlign = 'center';
          ctx.fillText(e.name, ex, ey - bodyH - 21);
        }
      }

      // Draw Player Cultivator in 2.5D Isometric
      const p = sim.player;
      const walkBob = Math.abs(Math.sin(p.walkDist * 0.04)) * 4;
      const pIso = worldToIso(p.wx, p.wy, p.wz + walkBob);
      const px = centerX + pIso.isoX;
      const py = centerY + pIso.isoY;

      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, 0.5);
      ctx.strokeStyle = sim.charData.spiritualRoot.auraColor;
      ctx.lineWidth = 2.5 + sim.realmIndex * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, 30 + sim.realmIndex * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(px, py);
      ctx.scale(p.scaleX, p.scaleY);

      ctx.fillStyle = p.hitFlash > 0 ? '#ffffff' : '#1e293b';
      ctx.strokeStyle = '#c89d54';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(15, -6);
      ctx.lineTo(-15, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, -46, 8, 0, Math.PI * 2);
      ctx.fill();

      // Floating Natal Spirit Sword beside cultivator
      const swordAngle = now * 0.004;
      const sxOff = Math.cos(swordAngle) * 26;
      const syOff = -28 + Math.sin(swordAngle * 2) * 5;
      ctx.strokeStyle = sim.charData.spiritualRoot.auraColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sxOff - 11, syOff - 9);
      ctx.lineTo(sxOff + 13, syOff + 9);
      ctx.stroke();

      if (p.attackAnimTimer > 0) {
        ctx.strokeStyle = '#f5c542';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -22, 50, p.facingAngle - 0.9, p.facingAngle + 0.9);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Bamboo & Mountain Pillars along perimeter
      for (const b of bambooProps) {
        const bIso = worldToIso(b.wx, b.wy, 0);
        const bx = centerX + bIso.isoX;
        const by = centerY + bIso.isoY;
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.32)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx, by - b.height);
        ctx.stroke();
      }

      // Draw Pooled Particles
      for (const pt of sim.particles) {
        if (!pt.active) continue;
        const ptIso = worldToIso(pt.wx, pt.wy, pt.wz);
        const alpha = 1 - pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(
          centerX + ptIso.isoX,
          centerY + ptIso.isoY,
          pt.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw Pooled Floating Combat Texts
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      for (const ft of sim.floatingTexts) {
        if (!ft.active) continue;
        const ftIso = worldToIso(ft.wx, ft.wy, ft.wz);
        const alpha = 1 - ft.life / ft.maxLife;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, centerX + ftIso.isoX, centerY + ftIso.isoY);
      }
      ctx.globalAlpha = 1;

      ctx.restore();
      timerId = window.setTimeout(() => {
        animFrameId = requestAnimationFrame(tick);
      }, 16);
    };

    let timerId = 0;
    animFrameId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearInputsOnBlur);
      document.removeEventListener('visibilitychange', clearInputsOnBlur);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [
    executeCombatSkill,
    handleStartBreakthrough,
    spawnFloatingText,
    spawnParticles,
    startOrResetGame,
    triggerDestinyInteraction,
  ]);

  const currentRealm = CULTIVATION_REALMS[realmIndex] || CULTIVATION_REALMS[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#080b10] select-none">
      {/* Isolated 60FPS 2.5D Isometric World Canvas - ALWAYS MOUNTED so simulation loop runs */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* 3D WebGL Xianxia World Layer - sits on top when 3D mode is active */}
      {render3D && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
          <XianxiaWorld3D
            simRef={simRef}
            charData={charData}
            realmIndex={realmIndex}
            onOpenXianxiaStudio={() => setIsXianxiaStudioOpen(true)}
            onOpenGddCodex={() => setIsGddOpen(true)}
            onTriggerDestiny={triggerDestinyInteraction}
            onToggleRenderMode={() => setRender3D((prev) => !prev)}
          />
        </div>
      )}

      {/* ====================================================================
          STATE 1: TITLE SCREEN OVERLAY (30-40% Calm Negative Space + Bespoke SVG Lockup)
          ==================================================================== */}
      {shellState === 'title' && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between p-6 md:p-12 bg-gradient-to-r from-[#05070b]/92 via-[#05070b]/75 to-transparent pointer-events-auto">
          {/* Top-right quick access to 25-Chapter GDD */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#c89d54] tracking-wider">
              2.5D ISOMETRIC XIANXIA ACTION MMORPG · PERSISTENT DESTINY ENGINE
            </span>
            <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsXianxiaStudioOpen(true)}
              className="px-4 py-2 text-xs font-bold bg-[#14233c] hover:bg-[#1e3458] text-[#38bdf8] border border-[#38bdf8]/60 rounded shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>🏮</span> Xưởng Hoạt Ảnh 3D Tiên Hiệp (23 Nhân Vật)
            </button>
            <button
              type="button"
              onClick={() => setIsGddOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-[#101824] hover:bg-[#172334] text-[#f2d08b] border border-[#c89d54]/50 rounded transition-colors whitespace-nowrap shrink-0"
            >
              Mở Toàn Thư Thiết Kế 25 Hệ Thống (GDD) [G]
            </button>
          </div>
          </div>

          {/* Focal Left/Center Title Lockup & Hidden Spiritual Root Mortal Creation */}
          <div className="max-w-xl space-y-6 my-auto">
            {/* Bespoke Inline SVG Title Emblem Lockup */}
            <svg
              viewBox="0 0 620 130"
              className="w-full max-w-[540px] h-auto overflow-visible"
              aria-label="Vạn Đạo Tiên Đồ"
            >
              <defs>
                <linearGradient id="jadeGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9e2af" />
                  <stop offset="50%" stopColor="#c89d54" />
                  <stop offset="100%" stopColor="#8c6224" />
                </linearGradient>
              </defs>
              {/* Sword & Seal Crest Background */}
              <path
                d="M12 65 L95 65 M525 65 L608 65"
                stroke="#c89d54"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <polygon
                points="310,6 324,20 310,34 296,20"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
              />
              <text
                x="12"
                y="78"
                fill="url(#jadeGold)"
                fontFamily="Cinzel, serif"
                fontWeight="800"
                fontSize="52"
                letterSpacing="4"
              >
                VẠN ĐẠO TIÊN ĐỒ
              </text>
              <text
                x="14"
                y="110"
                fill="#94a3b8"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
                fontSize="14"
                letterSpacing="3"
              >
                MYRIAD DAO IMMORTAL PATH · VẬN MỆNH ẨN GIẤU
              </text>
            </svg>

            {/* Hidden Spiritual Root Character Creation Box (Section 3.1) */}
            <div className="p-5 rounded-lg bg-[#0b1018]/95 border border-[#c89d54]/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#f2d08b]">
                  KHỞI TẠO NHÂN VẬT PHÀM NHÂN (SERVER FATE SEED)
                </span>
                <span className="font-mono text-[#38bdf8]">Cảnh giới: Phàm Nhân</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={fateSeed}
                  onChange={(e) => setFateSeed(e.target.value)}
                  aria-label="Hạt Giống Mệnh Cách (Fate Seed)"
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[#06090e] border border-[#263346] rounded text-[#f8fafc]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFateSeed(`TIEN-DO-${Math.floor(1000 + Math.random() * 9000)}`)
                  }
                  className="px-3 py-2 text-xs font-semibold bg-[#16202e] hover:bg-[#1e293b] text-[#cbd5e1] rounded border border-[#2c3a4f] whitespace-nowrap shrink-0"
                >
                  Gieo Mệnh Ngẫu Nhiên
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#94a3b8] pt-1">
                <div>Linh Căn: <span className="text-[#f8fafc]">[ẨN — CHƯA BIẾT]</span></div>
                <div>Tư Chất: <span className="text-[#f8fafc]">[ẨN — CHƯA BIẾT]</span></div>
                <div>Thể Chất: <span className="text-[#f8fafc]">[ẨN — MỞ Ở TRÚC CƠ]</span></div>
                <div>Huyết Mạch: <span className="text-[#f8fafc]">[ẨN — MỞ Ở TRÚC CƠ]</span></div>
              </div>
            </div>

            {/* Primary Start CTA + GDD Button (<= 3 actions total) */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-start="true"
                onClick={() => startOrResetGame(fateSeed)}
                className="px-7 py-3.5 text-sm font-bold bg-[#c89d54] hover:bg-[#d9b168] text-[#080b10] rounded transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Bước Vào Tiên Đồ (Bắt Đầu Tu Luyện)
              </button>

              <button
                type="button"
                onClick={() => setIsXianxiaStudioOpen(true)}
                className="px-5 py-3.5 text-sm font-semibold bg-[#14233c] hover:bg-[#1e3458] text-[#38bdf8] border border-[#38bdf8]/60 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
              >
                <span>🏮</span> Thử Nghiệm Hoạt Ảnh 3D (23 Nhân Vật)
              </button>

              <button
                type="button"
                onClick={() => setIsGddOpen(true)}
                className="px-5 py-3.5 text-sm font-semibold bg-[#101824] hover:bg-[#172334] text-[#e8e2d5] border border-[#334155] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Xem Toàn Thư GDD 25 Chương
              </button>
            </div>
          </div>

          {/* Single Flat Control-Hint Line in Bottom Safe Margin */}
          <div className="text-xs font-mono text-[#94a3b8]">
            WASD Di Chuyển · Chuột Trái/J Kiếm Kích · K/L/U/I Thần Thông · Space Thân Pháp · H Thổ Nạp · E Cơ Duyên · B Đột Phá · G Toàn Thư GDD · Esc Tạm Dừng
          </div>
        </div>
      )}

      {/* ====================================================================
          STATE 2: PLAYING HUD (>= 85% Unobstructed Playfield, pointer-events: none wrapper)
          ==================================================================== */}
      {shellState === 'playing' && (
        <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-4">
          {/* Top Row: Left Cultivator Status Cluster + Right Compact Utility Controls */}
          <div className="flex items-start justify-between gap-4">
            {/* Top-Left World-Matched Jade/Bronze Status Cluster */}
            <div className="pointer-events-auto w-[330px] p-3.5 rounded-lg bg-[#090d14]/92 border border-[#c89d54]/45 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#c89d54]">
                    CẢNH GIỚI TU VI
                  </div>
                  <div className="text-base font-bold text-[#f8fafc] font-display">
                    {currentRealm.name} · Tầng {subLevel}/{currentRealm.subLevels}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCultivationOpen(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#16202e] hover:bg-[#1e293b] text-[#f2d08b] border border-[#c89d54]/40 rounded"
                >
                  Nội Thị [C]
                </button>
              </div>

              {/* Vitality (HP) & Spiritual Qi Bars with 2.5:1 Tabular Numerals */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#94a3b8]">
                      KHÍ HUYẾT (HP)
                    </span>
                    <span className="text-sm font-bold font-mono text-[#f87171] tabular-nums hud-stroke">
                      {hudHp} / {hudMaxHp}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#05070b] rounded overflow-hidden border border-[#1e293b]">
                    <div
                      className="h-full bg-[#ef4444] transition-all duration-100"
                      style={{
                        width: `${Math.min(100, Math.round((hudHp / Math.max(1, hudMaxHp)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#94a3b8]">
                      LINH LỰC ĐAN ĐIỀN (QI)
                    </span>
                    <span className="text-sm font-bold font-mono text-[#38bdf8] tabular-nums hud-stroke">
                      {hudQi} / {hudReqQi}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#05070b] rounded overflow-hidden border border-[#1e293b]">
                    <div
                      className="h-full bg-[#22d3ee] transition-all duration-100"
                      style={{
                        width: `${Math.min(100, Math.round((hudQi / Math.max(1, hudReqQi)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Progressive Spiritual Root Self-Discovery Readout */}
              <div className="pt-1.5 border-t border-[#1e293b] flex items-center justify-between text-xs">
                <span className="text-[#94a3b8]">Linh Căn:</span>
                <span
                  className="font-semibold truncate max-w-[195px]"
                  style={{ color: discovery.stage >= 2 ? charData.spiritualRoot.auraColor : '#cbd5e1' }}
                >
                  {discovery.visibleRootName}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] tabular-nums">
                <span>Linh Thạch: {inventory.spiritStones}</span>
                <span>Linh Thảo: {inventory.spiritHerbs}</span>
                <span>Trảm Yêu: {hudKills}</span>
              </div>
            </div>

            {/* Center-Top Chronicle & Contextual Interaction Banner */}
            <div className="hidden lg:flex flex-col items-center max-w-xl text-center space-y-1.5">
              <div className="px-4 py-1.5 rounded bg-[#090d14]/90 border border-[#263346] text-xs text-[#e2e8f0]">
                {chronicleBanner}
              </div>
              {tribulationActive && (
                <div className="px-4 py-1 rounded bg-[#3b0764]/95 border border-[#c084fc] text-xs font-bold text-[#f5d0fe] font-mono tabular-nums">
                  ĐANG ĐỘ THIÊN KIẾP — CÒN {tribulationWavesLeft} ĐẠO KIẾP LÔI! HÃY NÉ TRÁNH!
                </div>
              )}
              {nearbyLandmark && (
                <button
                  type="button"
                  onClick={triggerDestinyInteraction}
                  className="pointer-events-auto px-4 py-1.5 rounded bg-[#c89d54] text-[#080b10] text-xs font-bold shadow cursor-pointer"
                >
                  [E] Tương tác: {nearbyLandmark.name}
                </button>
              )}
            </div>

            {/* Top-Right Compact Utility Controls */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setIsXianxiaStudioOpen(true);
                }}
                aria-label="Mở Xưởng Hoạt Ảnh 3D Tiên Hiệp"
                className="px-3 py-2 rounded bg-[#090d14]/92 hover:bg-[#16202e] text-[#38bdf8] border border-[#38bdf8]/50 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>🏮</span> Hoạt Ảnh 3D
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setRender3D((prev) => !prev);
                }}
                aria-label="Chuyển đổi đồ họa 3D / 2D"
                className="px-3 py-2 rounded bg-[#090d14]/92 hover:bg-[#16202e] text-[#a7f3d0] border border-[#10b981]/50 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>🎥</span> {render3D ? 'Đồ Họa 3D' : '2D Cổ Điển'}
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setIsGddOpen(true);
                }}
                aria-label="Mở Toàn Thư Thiết Kế 25 Hệ Thống (GDD)"
                className="px-3 py-2 rounded bg-[#090d14]/92 hover:bg-[#16202e] text-[#f2d08b] border border-[#c89d54]/50 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                GDD 25 Chương [G]
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  triggerDestinyInteraction();
                }}
                aria-label="Kích hoạt Kỳ Ngộ Cơ Duyên"
                className="px-3 py-2 rounded bg-[#090d14]/92 hover:bg-[#16202e] text-[#38bdf8] border border-[#38bdf8]/40 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Kỳ Ngộ [E]
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  soundEngine.muted = !soundEngine.muted;
                  setHudMuted(soundEngine.muted);
                }}
                aria-label={hudMuted ? 'Bật âm thanh [M]' : 'Tắt âm thanh [M]'}
                className="w-9 h-9 flex items-center justify-center rounded bg-[#090d14]/92 hover:bg-[#16202e] text-[#cbd5e1] border border-[#263346] text-xs font-mono"
              >
                {hudMuted ? '🔇' : '🔊'}
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  document.body.dataset.state = 'paused';
                  setShellState('paused');
                }}
                aria-label="Tạm dừng [P]"
                className="w-9 h-9 flex items-center justify-center rounded bg-[#090d14]/92 hover:bg-[#16202e] text-[#cbd5e1] border border-[#263346] text-xs font-mono"
              >
                II
              </button>
            </div>
          </div>

          {/* Bottom Row: Compact Action & Cultivation Skill Bar */}
          <div className="flex items-end justify-center">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-[#090d14]/92 border border-[#c89d54]/40 shadow-xl">
              {COMBAT_SKILLS.map((sk) => {
                const cd = skillCooldowns[sk.id] || 0;
                return (
                  <button
                    key={sk.id}
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      executeCombatSkill(sk.id);
                    }}
                    className="relative px-3 py-2 rounded bg-[#101824] hover:bg-[#172334] border border-[#263346] text-left min-w-[110px] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#f2d08b]">[{sk.key}]</span>
                      <span className="text-[#38bdf8] tabular-nums">
                        {cd > 0 ? `${cd.toFixed(1)}s` : `${sk.qiCost} Qi`}
                      </span>
                    </div>
                    <div
                      className="text-xs font-bold mt-0.5 truncate"
                      style={{ color: sk.color }}
                    >
                      {sk.name}
                    </div>
                  </button>
                );
              })}

              {/* Meditate [H] */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  simRef.current.player.meditating = !simRef.current.player.meditating;
                }}
                className="px-3 py-2 rounded bg-[#101824] hover:bg-[#172334] border border-[#22d3ee]/40 text-left cursor-pointer"
              >
                <div className="text-[10px] font-mono text-[#22d3ee]">[H] Đả Tọa</div>
                <div className="text-xs font-bold text-[#e2e8f0] mt-0.5">
                  Thổ Nạp Khí
                </div>
              </button>

              {/* Breakthrough / Tribulation Trigger [B] */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleStartBreakthrough(1);
                }}
                className={`px-4 py-2 rounded font-bold text-xs border transition-colors cursor-pointer ${
                  hudQi >= hudReqQi
                    ? 'bg-[#c89d54] text-[#080b10] border-[#f2d08b]'
                    : 'bg-[#101824] text-[#94a3b8] border-[#263346]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase">
                  [B] {hudQi >= hudReqQi ? 'VIÊN MÃN!' : 'CHƯA ĐỦ KHÍ'}
                </div>
                <div className="mt-0.5">Đột Phá / Độ Kiếp</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DESTINY ENCOUNTER MODAL (Server Destiny & Fortune Engine Event)
          ==================================================================== */}
      {activeDestinyEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kỳ Ngộ Tiên Duyên"
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#040609]/88 p-4 pointer-events-auto"
        >
          <div className="w-full max-w-xl p-6 rounded-lg bg-[#0b1017] border border-[#c89d54] shadow-2xl space-y-4 text-[#e8e2d5]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#c89d54] uppercase">
                DESTINY & FORTUNE ENGINE · {activeDestinyEvent.rarity}
              </span>
              <span className="text-[#94a3b8]">Seed: {charData.fateSeed}</span>
            </div>

            <h3 className="text-xl font-bold text-[#f2d08b] font-display">
              {activeDestinyEvent.title}
            </h3>

            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              {activeDestinyEvent.description}
            </p>

            <div className="space-y-2.5 pt-2">
              {activeDestinyEvent.choices.map((ch, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChooseDestinyOption(idx)}
                  className="w-full text-left p-3.5 rounded bg-[#101824] hover:bg-[#172334] border border-[#263346] hover:border-[#c89d54] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#f8fafc]">{ch.label}</span>
                    <span className="font-mono text-[#38bdf8] whitespace-nowrap ml-2">
                      {ch.alignment}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#94a3b8] mt-1">
                    Linh lực {ch.qiDelta >= 0 ? `+${ch.qiDelta}` : ch.qiDelta} · Manh mối Linh Căn +{ch.clueBonus} · Đan dược +{ch.pillReward}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          STATE 3: PAUSED MODAL
          ==================================================================== */}
      {shellState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tạm Dừng Tu Luyện"
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#040609]/88 p-4 pointer-events-auto"
        >
          <div className="w-full max-w-md p-6 rounded-lg bg-[#0b1017] border border-[#c89d54]/50 shadow-2xl space-y-5 text-center">
            <h2 className="text-2xl font-bold text-[#f2d08b] font-display">
              NHẬP ĐỊNH TẠM DỪNG
            </h2>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums">
              <div className="p-2.5 rounded bg-[#101824] border border-[#1e293b]">
                <div className="text-[#94a3b8]">CẢNH GIỚI</div>
                <div className="text-sm font-bold text-[#f8fafc] mt-1">
                  {currentRealm.name} {subLevel}
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#101824] border border-[#1e293b]">
                <div className="text-[#94a3b8]">TRẢM YÊU</div>
                <div className="text-sm font-bold text-[#34d399] mt-1">{hudKills}</div>
              </div>
              <div className="p-2.5 rounded bg-[#101824] border border-[#1e293b]">
                <div className="text-[#94a3b8]">LINH THẠCH</div>
                <div className="text-sm font-bold text-[#38bdf8] mt-1">
                  {inventory.spiritStones}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  document.body.dataset.state = 'playing';
                  setShellState('playing');
                }}
                className="w-full py-2.5 text-xs font-bold bg-[#c89d54] hover:bg-[#d9b168] text-[#080b10] rounded"
              >
                Tiếp Tục Tu Luyện [Esc / P]
              </button>
              <button
                type="button"
                onClick={() => setIsGddOpen(true)}
                className="w-full py-2.5 text-xs font-semibold bg-[#101824] hover:bg-[#172334] text-[#f2d08b] border border-[#c89d54]/40 rounded"
              >
                Mở Toàn Thư Thiết Kế 25 Chương GDD [G]
              </button>
              <button
                type="button"
                onClick={() => startOrResetGame()}
                className="w-full py-2.5 text-xs font-semibold bg-[#16202e] hover:bg-[#1e293b] text-[#e2e8f0] rounded"
              >
                Khởi Đầu Lại Hành Trình [R]
              </button>
              <button
                type="button"
                onClick={() => {
                  document.body.dataset.state = 'title';
                  setShellState('title');
                }}
                className="w-full py-2.5 text-xs font-semibold bg-[#090d14] hover:bg-[#16202e] text-[#94a3b8] rounded"
              >
                Về Màn Hình Chính
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          STATE 4: GAME OVER / VICTORY MODAL
          ==================================================================== */}
      {shellState === 'gameover' && endRunSnapshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tổng Kết Hành Trình Tu Tiên"
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#040609]/90 p-4 pointer-events-auto"
        >
          <div className="w-full max-w-md p-6 rounded-lg bg-[#0b1017] border border-[#c89d54] shadow-2xl space-y-5 text-center">
            <h2 className="text-2xl font-bold text-[#f2d08b] font-display">
              {endRunSnapshot.victory ? 'ĐẠO CƠ VIÊN MÃN' : 'ĐẠO LỘ GẬP GHỀNH'}
            </h2>
            <p className="text-xs text-[#cbd5e1]">{endRunSnapshot.summary}</p>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums">
              <div className="p-2.5 rounded bg-[#101824] border border-[#1e293b]">
                <div className="text-[#94a3b8]">CẢNH GIỚI ĐẠT</div>
                <div className="text-xs font-bold text-[#f8fafc] mt-1">
                  {endRunSnapshot.realmReached}
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#101824] border border-[#1e293b]">
                <div className="text-[#94a3b8]">YÊU THÚ ĐÃ TRẢM</div>
                <div className="text-sm font-bold text-[#34d399] mt-1">
                  {endRunSnapshot.kills}
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#101824] border border-[#1e293b]">
                <div className="text-[#94a3b8]">LINH CĂN HÉ LỘ</div>
                <div className="text-xs font-bold text-[#38bdf8] mt-1 truncate">
                  {endRunSnapshot.rootRevealed}
                </div>
              </div>
            </div>

            <button
              type="button"
              data-start="true"
              onClick={() => startOrResetGame()}
              className="w-full py-3 text-sm font-bold bg-[#c89d54] hover:bg-[#d9b168] text-[#080b10] rounded"
            >
              Luân Hồi Chuyển Thế (Chơi Lại)
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          CULTIVATION & SPIRITUAL ROOT SELF-DISCOVERY MODAL
          ==================================================================== */}
      <CultivationPanelModal
        isOpen={isCultivationOpen}
        onClose={() => setIsCultivationOpen(false)}
        charData={charData}
        discovery={discovery}
        realmIndex={realmIndex}
        subLevel={subLevel}
        currentQi={hudQi}
        requiredQi={hudReqQi}
        inventory={inventory}
        onCraftBreakthroughPill={() => {
          if (inventory.spiritHerbs < 2 || inventory.spiritStones < 15) return;
          setInventory((prev) => ({
            ...prev,
            spiritHerbs: prev.spiritHerbs - 2,
            spiritStones: prev.spiritStones - 15,
            breakthroughPills: prev.breakthroughPills + 1,
          }));
          soundEngine.playDestinyChime();
          setChronicleBanner(
            'Luyện đan thành công! Nhận được 1 viên Trúc Cơ Hộ Mạch Đan (+11% tỷ lệ phá cảnh).'
          );
        }}
        onUpgradeArtifact={() => {
          if (inventory.beastCores < 1 || inventory.spiritStones < 25) return;
          setInventory((prev) => ({
            ...prev,
            beastCores: prev.beastCores - 1,
            spiritStones: prev.spiritStones - 25,
            artifactTier: prev.artifactTier + 1,
          }));
          soundEngine.playDestinyChime();
          setChronicleBanner(
            'Ôn dưỡng Bản Mệnh Pháp Bảo thành công! Tăng +18% sát thương toàn bộ kiếm quyết và pháp thuật.'
          );
        }}
        onJoinSect={(newSect) => {
          setInventory((prev) => ({ ...prev, sectName: newSect }));
          soundEngine.playDestinyChime();
          setChronicleBanner(`Đã chính thức bái nhập ${newSect}!`);
        }}
        onPerformAppraisalRitual={() => {
          if (inventory.spiritStones < 30) return;
          setInventory((prev) => ({
            ...prev,
            spiritStones: prev.spiritStones - 30,
          }));
          setBonusClues((prev) => prev + 3);
          soundEngine.playDestinyChime();
          setChronicleBanner(
            'Nghi thức Trắc Linh hoàn tất! Bạn đã thấu suốt thêm một tầng bí mật về Linh Căn của bản thân!'
          );
        }}
        onStartBreakthrough={handleStartBreakthrough}
      />

      {/* ====================================================================
          25-CHAPTER COMPLETE GDD CODEX & SERVER SIMULATOR MODAL
          ==================================================================== */}
      <GddCodexModal
        isOpen={isGddOpen}
        onClose={() => setIsGddOpen(false)}
        currentFateSeed={fateSeed}
        onApplyFateSeed={(newSeed) => {
          setFateSeed(newSeed);
          startOrResetGame(newSeed);
        }}
      />
          {/* ====================================================================
          VẠN ĐẠO TIÊN ĐỒ 3D CHARACTER ANIMATION STUDIO MODAL (23 CHARACTERS)
          ==================================================================== */}
      {isXianxiaStudioOpen && (
        <XianxiaAnimationStudioModal onClose={() => setIsXianxiaStudioOpen(false)} />
      )}
    </main>
  );
}
