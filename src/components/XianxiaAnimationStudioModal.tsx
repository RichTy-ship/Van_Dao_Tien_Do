import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CharacterCategory,
  CharacterId,
  CultivationStage,
  SkeletonProfileType,
  XianxiaAnimationClip,
} from '../game/xianxia/types';
import {
  CULTIVATION_STAGE_VFX_CONFIG,
  XIANXIA_CHARACTERS,
  createXianxiaRiggedCharacter,
} from '../game/xianxia/xianxiaRigs';
import {
  XIANXIA_ANIMATION_LIBRARY,
  getAvailableClipsForCharacter,
} from '../game/xianxia/xianxiaAnimationClips';
import { XianxiaAnimationController } from '../game/xianxia/animationController';
import { XianxiaVFXManager } from '../game/xianxia/xianxiaVFX';
import { createRealXianxiaModel, XianxiaModelInstance } from '../game/xianxia/xianxiaModelLoader';

interface Props {
  onClose: () => void;
}

const ALL_CHARACTERS = Object.values(XIANXIA_CHARACTERS);
const CULTIVATION_STAGES: CultivationStage[] = [
  'Mortal',
  'Qi Refining',
  'Foundation Establishment',
  'Golden Core',
  'Nascent Soul',
  'Soul Formation',
  'Tribulation',
];

export const XianxiaAnimationStudioModal: React.FC<Props> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Studio UI State
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>('player_male');
  const [selectedStage, setSelectedStage] = useState<CultivationStage>('Foundation Establishment');
  const [selectedClipId, setSelectedClipId] = useState<string>('Idle');
  const [locomotionSpeed, setLocomotionSpeed] = useState<number>(0.0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [showVfx, setShowVfx] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'ISOMETRIC' | 'ORBIT' | 'CLOSE'>('ISOMETRIC');
  const [categoryFilter, setCategoryFilter] = useState<CharacterCategory | 'ALL'>('ALL');

  // Real-time telemetry
  const [fps, setFps] = useState<number>(60);
  const [activeBonesCount, setActiveBonesCount] = useState<number>(25);
  const [networkPacketJson, setNetworkPacketJson] = useState<string>('');
  const [lastEventName, setLastEventName] = useState<string>('None');

  // Three.js References
  const controllerRef = useRef<XianxiaAnimationController | null>(null);
  const realModelRef = useRef<XianxiaModelInstance | null>(null);
  const charGroupRef = useRef<THREE.Group | null>(null);
  const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
  const vfxManagerRef = useRef<XianxiaVFXManager | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const auraGroupRef = useRef<THREE.Group | null>(null);

  // Filtered character list
  const filteredCharacters = ALL_CHARACTERS.filter(
    (c) => categoryFilter === 'ALL' || c.category === categoryFilter
  );

  const availableClips = getAvailableClipsForCharacter(selectedCharId);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080D1A'); // Deep Xianxia twilight atmosphere
    scene.fog = new THREE.FogExp2('#080D1A', 0.015);

    // Camera setup (Default 2.5D Isometric viewpoint: ~45 deg pitch, 45 deg yaw)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.2, 100);
    camera.position.set(5.5, 4.8, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.95, 0);
    controlsRef.current = controls;

    // Atmospheric Xianxia Lighting
    const ambientLight = new THREE.AmbientLight('#9FB0C7', 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#FFF3D1', 2.4);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -6;
    dirLight.shadow.camera.right = 6;
    dirLight.shadow.camera.top = 6;
    dirLight.shadow.camera.bottom = -6;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight('#00F5D4', 1.2);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    // Decorative Daoist Pavilion Stone Floor with Bagua Yin-Yang inlays
    const floorGeo = new THREE.CylinderGeometry(6.5, 6.5, 0.2, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#151D2A',
      roughness: 0.55,
      metalness: 0.25,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid helper for alignment
    const gridHelper = new THREE.GridHelper(12, 24, '#00E5FF', '#1D2A3D');
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // VFX Manager
    const vfxManager = new XianxiaVFXManager(scene, camera);
    vfxManagerRef.current = vfxManager;

    // FPS loop counter
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();
    let animFrameId: number;

    const animate = (now: number) => {
      animFrameId = requestAnimationFrame(animate);

      const dt = Math.max(0.001, Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;

      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = now;
      }

      controls.update();

      // Update Real 3D Model Instance
      if (realModelRef.current) {
        realModelRef.current.update(dt);
      }

      // Update Character Controller & Bones
      if (controllerRef.current) {
        controllerRef.current.update(dt);
      }

      // Update Cultivation Aura
      if (auraGroupRef.current && auraGroupRef.current.userData.update) {
        auraGroupRef.current.userData.update(dt);
      }

      // Update VFX
      vfxManager.update(dt);

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      vfxManager.dispose();
      renderer.dispose();
    };
  }, []);

  // Re-instantiate Character when selected ID or Cultivation Stage changes
  useEffect(() => {
    if (!mountRef.current || !vfxManagerRef.current) return;
    const scene = vfxManagerRef.current['scene'] as THREE.Scene;
    let cancelled = false;

    // 1. Remove previous character and helpers
    if (charGroupRef.current) {
      scene.remove(charGroupRef.current);
      charGroupRef.current = null;
    }
    if (realModelRef.current) {
      scene.remove(realModelRef.current.group);
      realModelRef.current = null;
    }
    if (skeletonHelperRef.current) {
      scene.remove(skeletonHelperRef.current);
      skeletonHelperRef.current = null;
    }
    if (auraGroupRef.current) {
      scene.remove(auraGroupRef.current);
      auraGroupRef.current = null;
    }

    // 2. Build Procedural Rigged Character immediately as fallback/initial
    const { group, boneMap } = createXianxiaRiggedCharacter(
      selectedCharId,
      selectedStage
    );
    charGroupRef.current = group;
    scene.add(group);

    // 3. Build Skeleton Wireframe Helper
    const skelHelper = new THREE.SkeletonHelper(group);
    skelHelper.visible = showSkeleton;
    skeletonHelperRef.current = skelHelper;
    scene.add(skelHelper);

    // 4. Attach Cultivation Aura VFX
    const auraGroup = vfxManagerRef.current.createCultivationAura(selectedStage);
    auraGroupRef.current = auraGroup;
    group.add(auraGroup);

    // 5. Initialize Controller
    const controller = new XianxiaAnimationController({
      characterId: selectedCharId,
      boneMap,
      onEvent: (evt) => {
        setLastEventName(`${evt.name} (${evt.normalizedTime.toFixed(2)})`);
        if (evt.name === 'VFX_Spawn' && evt.paramString === 'bagua_array') {
          vfxManagerRef.current?.spawnBaguaArray(group.position);
        } else if (evt.name === 'VFX_Spawn' && evt.paramString === 'heavenly_thunder_bolt') {
          vfxManagerRef.current?.spawnHeavenlyThunder(group.position);
        }
      },
    });
    controller.setCultivationStage(selectedStage);
    controller.playbackSpeed = playbackSpeed;
    controller.playClip(selectedClipId, 0.1);
    controllerRef.current = controller;

    setActiveBonesCount(boneMap.size);

    // 6. Asynchronously swap in the REAL 3D GLB Model
    createRealXianxiaModel(selectedCharId, selectedStage)
      .then((instance) => {
        if (cancelled) return;
        // Swap out procedural mesh with real GLB model
        if (charGroupRef.current) {
          scene.remove(charGroupRef.current);
          charGroupRef.current = null;
        }
        realModelRef.current = instance;
        charGroupRef.current = instance.group;
        scene.add(instance.group);

        // Move aura over to real model
        if (auraGroupRef.current) {
          instance.group.add(auraGroupRef.current);
        }

        // Update skeleton helper to real model
        if (skeletonHelperRef.current) {
          scene.remove(skeletonHelperRef.current);
        }
        const realHelper = new THREE.SkeletonHelper(instance.group);
        realHelper.visible = showSkeleton;
        skeletonHelperRef.current = realHelper;
        scene.add(realHelper);

        instance.playClip(selectedClipId, 0.1);
        setActiveBonesCount(instance.boneMap.size || 54);
      })
      .catch((err) => {
        console.warn('Real 3D model load fell back to procedural rig:', err);
      });

    // Telemetry update interval
    const telemetryInterval = setInterval(() => {
      if (controllerRef.current) {
        setNetworkPacketJson(JSON.stringify(controllerRef.current.serializeNetworkState(), null, 2));
      }
    }, 200);

    return () => {
      cancelled = true;
      clearInterval(telemetryInterval);
      if (realModelRef.current) {
        scene.remove(realModelRef.current.group);
        realModelRef.current = null;
      }
    };
  }, [selectedCharId, selectedStage]);

  // Handle Clip Change
  const handleSelectClip = (clipId: string) => {
    setSelectedClipId(clipId);
    if (realModelRef.current) {
      realModelRef.current.playClip(clipId, 0.22);
    }
    if (controllerRef.current) {
      controllerRef.current.playClip(clipId, 0.22);
    }
  };

  // Handle Attack Combo Chain
  const handleAttackCombo = () => {
    if (realModelRef.current) {
      realModelRef.current.playClip('Sword_Attack_01', 0.1);
    }
    if (controllerRef.current) {
      controllerRef.current.triggerAttackInput();
      setSelectedClipId(controllerRef.current.currentClip.id);
    }
  };

  // Handle Locomotion Speed Slider
  const handleSpeedSlider = (val: number) => {
    setLocomotionSpeed(val);
    if (controllerRef.current) {
      controllerRef.current.locomotionSpeed = val;
      setSelectedClipId(controllerRef.current.currentClip.id);
    }
  };

  // Handle Camera Presets
  const handleCameraPreset = (mode: 'ISOMETRIC' | 'ORBIT' | 'CLOSE') => {
    setCameraMode(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (mode === 'ISOMETRIC') {
      camera.position.set(5.5, 4.8, 5.5);
      controls.target.set(0, 0.95, 0);
    } else if (mode === 'CLOSE') {
      camera.position.set(1.4, 1.45, 1.8);
      controls.target.set(0, 1.25, 0);
    } else {
      camera.position.set(0, 2.5, 6.0);
      controls.target.set(0, 0.95, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3">
      <div className="relative w-full max-w-7xl h-[94vh] bg-[#0A0F1D] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* TOP BAR */}
        <div className="h-14 border-b border-cyan-500/20 px-5 flex items-center justify-between bg-[#0E1528]/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏮</span>
            <div>
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
                VẠN ĐẠO TIÊN ĐỒ — Xianxia Character Animation Studio
              </h1>
              <p className="text-xs text-slate-400">
                2.5D Isometric MMORPG Animation Pipeline & Rigging Diagnostic Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-cyan-500/30 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 font-mono font-bold">{fps} FPS</span>
              <span className="text-slate-400">|</span>
              <span className="text-cyan-300 font-mono">{activeBonesCount} Bones</span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-300 font-mono">Event: {lastEventName}</span>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1 text-sm bg-rose-600/30 hover:bg-rose-600 border border-rose-500 text-rose-200 rounded-lg transition"
            >
              Đóng (Close) ✕
            </button>
          </div>
        </div>

        {/* MAIN STUDIO VIEW */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL: Character Selector & Cultivation Realms */}
          <div className="w-80 border-r border-cyan-500/20 bg-[#0B1122]/95 flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1.5 block">
                Phân Loại Nhân Vật (Category)
              </label>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {(['ALL', 'PLAYER', 'NPC', 'MONSTER', 'BOSS', 'MOUNT'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`py-1.5 px-2 rounded font-medium transition ${
                      categoryFilter === cat
                        ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Selector */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1.5 block">
                Chọn Nhân Vật ({filteredCharacters.length})
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredCharacters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCharId(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex flex-col transition ${
                      selectedCharId === c.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-sky-300">{c.vietnameseName}</div>
                    <div className="text-[11px] text-slate-400">{c.name} · {c.skeletonProfile}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cultivation Stages (7 Realms) */}
            <div className="pt-2 border-t border-cyan-500/15">
              <label className="text-xs font-semibold text-amber-300 tracking-wider uppercase mb-1.5 block flex items-center justify-between">
                <span>Cảnh Giới Tu Luyện (7 Realms)</span>
                <span className="text-[10px] text-amber-400/80">Stage VFX</span>
              </label>
              <div className="space-y-1">
                {CULTIVATION_STAGES.map((stg) => {
                  const cfg = CULTIVATION_STAGE_VFX_CONFIG[stg];
                  const isSelected = selectedStage === stg;
                  return (
                    <button
                      key={stg}
                      onClick={() => setSelectedStage(stg)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg border text-xs flex items-center justify-between transition ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cfg.auraColor }}
                        ></span>
                        {stg}
                      </span>
                      {isSelected && <span className="text-[10px] text-amber-300">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Options */}
            <div className="pt-2 border-t border-cyan-500/15 space-y-2 text-xs">
              <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1 block">
                Hiển Thị & Xương (Diagnostic)
              </div>
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Hiển thị Xương (Skeleton)</span>
                <input
                  type="checkbox"
                  checked={showSkeleton}
                  onChange={(e) => {
                    setShowSkeleton(e.target.checked);
                    if (skeletonHelperRef.current) {
                      skeletonHelperRef.current.visible = e.target.checked;
                    }
                  }}
                  className="rounded text-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Khí Quang & Hào Quang (Aura VFX)</span>
                <input
                  type="checkbox"
                  checked={showVfx}
                  onChange={(e) => {
                    setShowVfx(e.target.checked);
                    if (auraGroupRef.current) {
                      auraGroupRef.current.visible = e.target.checked;
                    }
                  }}
                  className="rounded text-cyan-500"
                />
              </label>
            </div>
          </div>

          {/* CENTER PANEL: 3D Canvas */}
          <div className="flex-1 relative bg-black/60">
            <div ref={mountRef} className="w-full h-full" />

            {/* Camera Switcher Overlay */}
            <div className="absolute top-4 left-4 flex gap-1.5 bg-black/60 p-1.5 rounded-xl border border-cyan-500/20 backdrop-blur-sm text-xs">
              <button
                onClick={() => handleCameraPreset('ISOMETRIC')}
                className={`px-3 py-1 rounded-lg transition ${
                  cameraMode === 'ISOMETRIC'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📐 2.5D Isometric (45°)
              </button>
              <button
                onClick={() => handleCameraPreset('ORBIT')}
                className={`px-3 py-1 rounded-lg transition ${
                  cameraMode === 'ORBIT'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌐 Xoay Tự Do (Free Orbit)
              </button>
              <button
                onClick={() => handleCameraPreset('CLOSE')}
                className={`px-3 py-1 rounded-lg transition ${
                  cameraMode === 'CLOSE'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔍 Cận Cảnh (Close-up)
              </button>
            </div>

            {/* Quick Action Overlay (Combo chain button) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#0B1122]/90 border border-cyan-500/30 px-5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md">
              <button
                onClick={handleAttackCombo}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs flex items-center gap-2"
              >
                <span>⚔️</span>
                <span>Chém Combo (Chain Attack)</span>
              </button>

              <button
                onClick={() => handleSelectClip('Tribulation_Hit')}
                className="px-3 py-2 bg-purple-700/50 hover:bg-purple-600 border border-purple-400 text-purple-100 rounded-xl transition text-xs flex items-center gap-1.5"
              >
                <span>⚡</span>
                <span>Độ Kiếp (Tribulation)</span>
              </button>

              <button
                onClick={() => handleSelectClip('Cultivation_Idle')}
                className="px-3 py-2 bg-cyan-700/50 hover:bg-cyan-600 border border-cyan-400 text-cyan-100 rounded-xl transition text-xs flex items-center gap-1.5"
              >
                <span>🧘</span>
                <span>Đả Tọa (Meditation)</span>
              </button>

              <button
                onClick={() => handleSelectClip('Fly_Move')}
                className="px-3 py-2 bg-sky-700/50 hover:bg-sky-600 border border-sky-400 text-sky-100 rounded-xl transition text-xs flex items-center gap-1.5"
              >
                <span>🗡️</span>
                <span>Ngự Kiếm (Fly Sword)</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Animation Clips & Blend Tree Controls */}
          <div className="w-88 border-l border-cyan-500/20 bg-[#0B1122]/95 flex flex-col overflow-y-auto p-4 space-y-4">
            {/* 1D Locomotion Blend Tree */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1.5">
                <span>1D Blend Tree: Tốc Độ (Speed)</span>
                <span className="font-mono text-cyan-300">{(locomotionSpeed * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={locomotionSpeed}
                onChange={(e) => handleSpeedSlider(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Đứng (Idle)</span>
                <span>Đi bộ (Walk)</span>
                <span>Chạy (Run)</span>
                <span>Bứt tốc (Sprint)</span>
              </div>
            </div>

            {/* Animation Clips List */}
            <div className="pt-2 border-t border-cyan-500/15">
              <label className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2 block">
                Thư Viện Động Tác (Clips Library) ({availableClips.length})
              </label>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {availableClips.map((clip) => {
                  const isPlaying = selectedClipId === clip.id;
                  return (
                    <button
                      key={clip.id}
                      onClick={() => handleSelectClip(clip.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                        isPlaying
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sky-200">{clip.id}</div>
                        <div className="text-[10px] text-slate-400">{clip.name}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {clip.duration}s
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playback Speed */}
            <div className="pt-2 border-t border-cyan-500/15">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
                <span>Tốc Độ Phát (Speed Multiplier)</span>
                <span className="font-mono text-cyan-300">{playbackSpeed.toFixed(1)}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs">
                {[0.25, 0.5, 1.0, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      if (controllerRef.current) controllerRef.current.playbackSpeed = spd;
                    }}
                    className={`py-1 rounded font-mono transition ${
                      playbackSpeed === spd
                        ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                        : 'bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplayer Deterministic Network Telemetry */}
            <div className="pt-2 border-t border-cyan-500/15 flex-1 flex flex-col">
              <label className="text-xs font-semibold text-amber-300 tracking-wider uppercase mb-1.5 block">
                Đồng Bộ Đa Người Chơi (Network Sync)
              </label>
              <pre className="flex-1 bg-black/60 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto select-all">
                {networkPacketJson || 'Awaiting packets...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
