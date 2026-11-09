import React, { useState, useMemo } from 'react';
import { GDD_CHAPTERS, GddChapterSpec } from '../data/gddChapters';
import {
  SPIRITUAL_ROOTS,
  CULTIVATION_REALMS,
  generateHiddenCharacter,
  getProgressiveDiscovery,
} from '../game/rules';

interface GddCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFateSeed: string;
  onApplyFateSeed: (newSeed: string) => void;
}

const CATEGORIES = [
  'Tất Cả (25)',
  'Cốt Lõi & Vận Mệnh',
  'Tu Luyện & Chiến Đấu',
  'Thế Giới & Cộng Đồng',
  'Kỹ Thuật & Vận Hành',
] as const;

export const GddCodexModal: React.FC<GddCodexModalProps> = ({
  isOpen,
  onClose,
  currentFateSeed,
  onApplyFateSeed,
}) => {
  const [activeTab, setActiveTab] = useState<'gdd' | 'simulator' | 'roots'>('gdd');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả (25)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);

  // Simulator state
  const [simSeed, setSimSeed] = useState<string>(currentFateSeed || 'HAN-LAP-777');
  const [simRealmIdx, setSimRealmIdx] = useState<number>(0);
  const [simSubLevel, setSimSubLevel] = useState<number>(1);
  const [simBonusClues, setSimBonusClues] = useState<number>(0);

  const filteredChapters = useMemo(() => {
    return GDD_CHAPTERS.filter((ch) => {
      const matchCat =
        selectedCategory === 'Tất Cả (25)' || ch.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        ch.title.toLowerCase().includes(q) ||
        ch.summary.toLowerCase().includes(q) ||
        ch.purpose.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const activeChapter: GddChapterSpec = useMemo(() => {
    return (
      GDD_CHAPTERS.find((c) => c.id === selectedChapterId) ||
      filteredChapters[0] ||
      GDD_CHAPTERS[0]
    );
  }, [selectedChapterId, filteredChapters]);

  const simChar = useMemo(() => generateHiddenCharacter(simSeed), [simSeed]);
  const simDiscovery = useMemo(
    () => getProgressiveDiscovery(simChar, simRealmIdx, simSubLevel, simBonusClues),
    [simChar, simRealmIdx, simSubLevel, simBonusClues]
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Toàn Thư Thiết Kế Vạn Đạo Tiên Đồ (25 Chương GDD)"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040609]/92 p-4 md:p-6 pointer-events-auto"
    >
      <div className="w-full max-w-[1320px] h-[88vh] bg-[#0b1017] border border-[#c89d54]/40 rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#e8e2d5]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#101824] border-b border-[#263346]">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-wide text-[#f2d08b] font-display">
              VẠN ĐẠO TIÊN ĐỒ — TOÀN THƯ THIẾT KẾ AAA MMORPG (25 DELIVERABLES)
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Tài liệu Kiến trúc Hệ thống, Quy tắc Vận hành, Dữ liệu Đầu vào/Đầu ra & Đài Mô Phỏng Server Linh Căn Ẩn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#080c12] p-1 rounded border border-[#223042]">
              <button
                type="button"
                onClick={() => setActiveTab('gdd')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'gdd'
                    ? 'bg-[#c89d54] text-[#080b10]'
                    : 'text-[#94a3b8] hover:text-[#e8e2d5]'
                }`}
              >
                25 Chương GDD Chi Tiết
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'simulator'
                    ? 'bg-[#c89d54] text-[#080b10]'
                    : 'text-[#94a3b8] hover:text-[#e8e2d5]'
                }`}
              >
                Mô Phỏng Server Linh Căn & Cơ Duyên
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('roots')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'roots'
                    ? 'bg-[#c89d54] text-[#080b10]'
                    : 'text-[#94a3b8] hover:text-[#e8e2d5]'
                }`}
              >
                Từ Điển 16 Linh Căn & 12 Cảnh Giới
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng Toàn Thư GDD"
              className="px-4 py-1.5 text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] border border-[#475569] rounded transition-colors whitespace-nowrap shrink-0"
            >
              Đóng [Esc / G]
            </button>
          </div>
        </div>

        {/* Tab 1: 25 GDD Deliverables */}
        {activeTab === 'gdd' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Sidebar: 25 Systems Navigation */}
            <div className="w-full md:w-[340px] border-b md:border-b-0 md:border-r border-[#223042] bg-[#090d14] flex flex-col shrink-0">
              <div className="p-3 border-b border-[#1e293b] space-y-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm trong 25 hệ thống..."
                  aria-label="Tìm kiếm trong 25 hệ thống GDD"
                  className="w-full px-3 py-1.5 text-xs bg-[#111926] border border-[#2c3a4f] rounded text-[#e8e2d5] placeholder-[#64748b] focus:outline-none focus:border-[#c89d54]"
                />
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#c89d54]/20 text-[#f2d08b] border border-[#c89d54]/50'
                          : 'bg-[#111926] text-[#94a3b8] hover:text-[#e8e2d5]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[#16202e]">
                {filteredChapters.map((ch) => {
                  const isSelected = ch.id === activeChapter.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChapterId(ch.id)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        isSelected
                          ? 'bg-[#172334] text-[#f2d08b]'
                          : 'hover:bg-[#101824] text-[#cbd5e1]'
                      }`}
                    >
                      <div className="text-xs font-semibold leading-snug">{ch.title}</div>
                      <div className="text-[11px] text-[#64748b] mt-1 line-clamp-1">
                        {ch.category} · 9 mục kỹ thuật
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Content Pane: Full 9-part Engineering Spec */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0b1017]">
              <div className="pb-4 border-b border-[#223042]">
                <div className="text-xs text-[#c89d54] font-medium">
                  Hệ Thống #{activeChapter.id} / 25 · {activeChapter.category}
                </div>
                <h3 className="text-2xl font-bold text-[#f8fafc] mt-1 font-display">
                  {activeChapter.title}
                </h3>
                <p className="text-sm text-[#cbd5e1] mt-2 leading-relaxed">
                  {activeChapter.summary}
                </p>
              </div>

              {/* 1. Purpose */}
              <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                <h4 className="text-xs font-semibold text-[#f2d08b] uppercase tracking-wider">
                  01. Mục Đích Thiết Kế (Purpose)
                </h4>
                <p className="text-sm text-[#e2e8f0] mt-1.5 leading-relaxed">
                  {activeChapter.purpose}
                </p>
              </div>

              {/* 2. Gameplay Flow & 3. Operating Rules */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                  <h4 className="text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">
                    02. Luồng Trải Nghiệm (Gameplay Flow)
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-[#cbd5e1]">
                    {activeChapter.gameplayFlow.map((step, i) => (
                      <li key={i} className="leading-relaxed">
                        <span className="font-mono text-xs text-[#38bdf8] mr-1.5">
                          [{i + 1}]
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                  <h4 className="text-xs font-semibold text-[#34d399] uppercase tracking-wider">
                    03. Quy Tắc Vận Hành (Operating Rules)
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-[#cbd5e1]">
                    {activeChapter.operatingRules.map((rule, i) => (
                      <li key={i} className="leading-relaxed">
                        <span className="font-mono text-xs text-[#34d399] mr-1.5">
                          •
                        </span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Input Data & 5. Output Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#0d141f] border border-[#1e293b]">
                  <h4 className="text-xs font-semibold text-[#a855f7] uppercase tracking-wider">
                    04. Dữ Liệu Đầu Vào (Input Data Schema)
                  </h4>
                  <div className="mt-2 space-y-1.5 font-mono text-xs text-[#cbd5e1]">
                    {activeChapter.inputData.map((inp, i) => (
                      <div key={i} className="p-2 bg-[#080c12] rounded border border-[#1e293b]">
                        {inp}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0d141f] border border-[#1e293b]">
                  <h4 className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider">
                    05. Dữ Liệu Đầu Ra (Output Data & State Mutation)
                  </h4>
                  <div className="mt-2 space-y-1.5 font-mono text-xs text-[#cbd5e1]">
                    {activeChapter.outputData.map((out, i) => (
                      <div key={i} className="p-2 bg-[#080c12] rounded border border-[#1e293b]">
                        {out}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. Edge Cases & 7. System Interactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                  <h4 className="text-xs font-semibold text-[#f97316] uppercase tracking-wider">
                    06. Trường Hợp Ngoại Lệ (Edge Cases & Anti-Abuse)
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-[#cbd5e1]">
                    {activeChapter.edgeCases.map((ec, i) => (
                      <li key={i} className="leading-relaxed">
                        {ec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                  <h4 className="text-xs font-semibold text-[#67e8f9] uppercase tracking-wider">
                    07. Tương Tác Liên Hệ Thống (System Interactions)
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-[#cbd5e1]">
                    {activeChapter.systemInteractions.map((si, i) => (
                      <li key={i} className="leading-relaxed">
                        {si}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 8. Technical Risks & 9. Testing Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                  <h4 className="text-xs font-semibold text-[#f87171] uppercase tracking-wider">
                    08. Rủi Ro Kỹ Thuật (Technical Risks)
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#cbd5e1]">
                    {activeChapter.technicalRisks.map((tr, i) => (
                      <li key={i} className="leading-relaxed">
                        {tr}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#101824] border border-[#223042]">
                  <h4 className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider">
                    09. Phương Pháp Kiểm Thử & QA (Verification Strategy)
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#cbd5e1]">
                    {activeChapter.testingStrategy.map((ts, i) => (
                      <li key={i} className="leading-relaxed">
                        {ts}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Prev/Next Chapter Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#223042]">
                <button
                  type="button"
                  disabled={activeChapter.id <= 1}
                  onClick={() => setSelectedChapterId(Math.max(1, activeChapter.id - 1))}
                  className="px-4 py-2 text-xs font-semibold rounded bg-[#16202e] hover:bg-[#1e293b] disabled:opacity-40 text-[#e8e2d5]"
                >
                  ← Chương Trước
                </button>
                <span className="text-xs font-mono text-[#94a3b8] tabular-nums">
                  Chương {activeChapter.id} / 25
                </span>
                <button
                  type="button"
                  disabled={activeChapter.id >= 25}
                  onClick={() => setSelectedChapterId(Math.min(25, activeChapter.id + 1))}
                  className="px-4 py-2 text-xs font-semibold rounded bg-[#c89d54] hover:bg-[#d9b168] disabled:opacity-40 text-[#080b10]"
                >
                  Chương Tiếp Theo →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Server Destiny & Progressive Discovery Simulator */}
        {activeTab === 'simulator' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0b1017]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls column */}
              <div className="lg:col-span-5 p-5 rounded-lg bg-[#101824] border border-[#223042] space-y-4">
                <h3 className="text-base font-bold text-[#f2d08b] font-display">
                  ĐÀI KIỂM THỬ SERVER-AUTHORITATIVE FATE SEED
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Mô phỏng cách Server khởi tạo dữ liệu ẩn (`Spiritual Root`, `Constitution`, `Bloodline`, `Comprehension`, `Fortune`) và cách Client chỉ nhận được thông tin đã lọc theo tầng cảnh giới (`Progressive Self-Discovery`).
                </p>

                <div>
                  <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                    Nhập hoặc tạo ngẫu nhiên Fate Seed (Hạt Giống Mệnh Cách):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={simSeed}
                      onChange={(e) => setSimSeed(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-[#080c12] border border-[#2c3a4f] rounded text-[#f8fafc]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSimSeed(`TIEN-DO-${Math.floor(1000 + Math.random() * 9000)}`)
                      }
                      className="px-3 py-2 text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f2d08b] rounded border border-[#475569] whitespace-nowrap shrink-0"
                    >
                      Đổi Seed Ngẫu Nhiên
                    </button>
                  </div>
                </div>

                {/* Preset Seeds for quick testing */}
                <div>
                  <span className="block text-xs text-[#94a3b8] mb-1.5">
                    Hoặc chọn nhanh Seed mẫu:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Hàn Lập (Ngũ Hành/Phế)', seed: 'HAN-LAP-PHAM-NHAN' },
                      { label: 'Lôi Linh Căn', seed: 'CUU-TIEU-LOI-DE-99' },
                      { label: 'Kiếm Tâm Kim Căn', seed: 'BACH-DE-KIEM-TON-7' },
                      { label: 'Vô Linh Căn Thể Tu', seed: 'VO-LINH-CAN-BA-THE-4' },
                    ].map((preset) => (
                      <button
                        key={preset.seed}
                        type="button"
                        onClick={() => setSimSeed(preset.seed)}
                        className="px-2.5 py-1 text-[11px] bg-[#080c12] hover:bg-[#172334] text-[#cbd5e1] border border-[#263346] rounded"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Realm Slider for Progressive Self-Discovery */}
                <div className="pt-2 border-t border-[#1e293b] space-y-3">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#cbd5e1]">Cảnh Giới Hiện Tại (Client):</span>
                      <span className="font-mono text-[#f2d08b] tabular-nums">
                        {CULTIVATION_REALMS[simRealmIdx]?.name} (Tầng {simSubLevel})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      value={simRealmIdx}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setSimRealmIdx(idx);
                        setSimSubLevel(1);
                      }}
                      className="w-full mt-1 accent-[#c89d54]"
                    />
                  </div>

                  {simRealmIdx === 1 && (
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#cbd5e1]">Tầng Luyện Khí (1 – 12):</span>
                        <span className="font-mono text-[#38bdf8] tabular-nums">
                          Tầng {simSubLevel} / 12
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={12}
                        value={simSubLevel}
                        onChange={(e) => setSimSubLevel(Number(e.target.value))}
                        className="w-full mt-1 accent-[#38bdf8]"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#cbd5e1]">Manh Mối Kỳ Ngộ Đã Tìm Thấy:</span>
                      <span className="font-mono text-[#34d399] tabular-nums">
                        +{simBonusClues} manh mối
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={simBonusClues}
                      onChange={(e) => setSimBonusClues(Number(e.target.value))}
                      className="w-full mt-1 accent-[#34d399]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => {
                      onApplyFateSeed(simSeed);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 text-xs font-bold bg-[#c89d54] hover:bg-[#d9b168] text-[#080b10] rounded transition-colors"
                  >
                    Áp Dụng Fate Seed Này Vào Nhân Vật Thực Chiến Hiện Tại
                  </button>
                </div>
              </div>

              {/* Comparison: Server Truth vs Client Filtered Discovery */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Server Authoritative Database Record */}
                <div className="p-5 rounded-lg bg-[#0d141f] border border-[#a855f7]/40 space-y-3">
                  <div className="text-xs font-mono text-[#c084fc] uppercase">
                    [1] Dữ Liệu Ẩn Trên Authoritative Server
                  </div>
                  <h4 className="text-lg font-bold text-[#f8fafc] font-display">
                    {simChar.spiritualRoot.name}
                  </h4>
                  <div className="space-y-2 text-xs text-[#cbd5e1]">
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Phân loại:</span>
                      <span className="font-semibold text-[#f2d08b]">
                        {simChar.spiritualRoot.category} ({simChar.spiritualRoot.elements.join(', ')})
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Độ Thuần Khiết:</span>
                      <span className="font-mono tabular-nums">{simChar.rootPurity}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Tốc Độ Hấp Thu Khí:</span>
                      <span className="font-mono tabular-nums">
                        {Math.round(simChar.spiritualRoot.qiAbsorptionRate * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Hệ Số Thể Tu Bù Đắp:</span>
                      <span className="font-mono tabular-nums text-[#34d399]">
                        {Math.round(simChar.spiritualRoot.bodyTemperingBonus * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Ngộ Tính Ẩn (Comprehension):</span>
                      <span className="font-mono tabular-nums">{simChar.comprehension}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Khí Vận Ẩn (Fortune):</span>
                      <span className="font-mono tabular-nums">{simChar.fortune}</span>
                    </div>
                    <div className="py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8] block">Thể Chất Ẩn:</span>
                      <span className="text-[#38bdf8] font-medium">
                        {simChar.hiddenConstitution} — {simChar.constitutionEffect}
                      </span>
                    </div>
                    <div className="py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8] block">Huyết Mạch Ẩn:</span>
                      <span className="text-[#f97316] font-medium">
                        {simChar.hiddenBloodline} — {simChar.bloodlineEffect}
                      </span>
                    </div>
                    <div className="py-1">
                      <span className="text-[#94a3b8] block">Thiên Phú Bẩm Sinh:</span>
                      <span className="text-[#4ade80] font-medium">{simChar.innateTalent}</span>
                    </div>
                  </div>
                </div>

                {/* Client Progressive Self-Discovery View */}
                <div className="p-5 rounded-lg bg-[#101824] border border-[#38bdf8]/40 space-y-3">
                  <div className="text-xs font-mono text-[#38bdf8] uppercase">
                    [2] Góc Nhìn Người Chơi (Stage {simDiscovery.stage}/5)
                  </div>
                  <h4 className="text-lg font-bold text-[#f2d08b] font-display">
                    {simDiscovery.visibleRootName}
                  </h4>
                  <div className="text-xs text-[#94a3b8]">
                    Trạng thái nhận thức: <strong className="text-[#e2e8f0]">{simDiscovery.stageTitle}</strong>
                  </div>

                  <div className="p-3 rounded bg-[#080c12] border border-[#1e293b] text-xs text-[#e2e8f0] leading-relaxed">
                    “{simDiscovery.visibleClue}”
                  </div>

                  <div className="space-y-2 text-xs text-[#cbd5e1]">
                    <div className="flex justify-between py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8]">Độ Thuần Khiết Hiển Thị:</span>
                      <span className="font-mono tabular-nums">{simDiscovery.visiblePurity}</span>
                    </div>
                    <div className="py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8] block">Thể Chất Đặc Biệt:</span>
                      <span className="text-[#cbd5e1]">{simDiscovery.visibleConstitution}</span>
                    </div>
                    <div className="py-1 border-b border-[#1e293b]">
                      <span className="text-[#94a3b8] block">Huyết Mạch:</span>
                      <span className="text-[#cbd5e1]">{simDiscovery.visibleBloodline}</span>
                    </div>
                    <div className="py-1">
                      <span className="text-[#94a3b8] block">Thiên Phú:</span>
                      <span className="text-[#cbd5e1]">{simDiscovery.visibleTalent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: All 16 Spiritual Roots & 12 Cultivation Realms Reference */}
        {activeTab === 'roots' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0b1017]">
            <div>
              <h3 className="text-lg font-bold text-[#f2d08b] font-display mb-3">
                BẢNG PHÂN TÍCH 16 LOẠI LINH CĂN & CƠ CHẾ CÂN BẰNG ĐẠO LỘ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.values(SPIRITUAL_ROOTS).map((root) => (
                  <div
                    key={root.id}
                    className="p-3.5 rounded-lg bg-[#101824] border border-[#223042] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                        <span>{root.category}</span>
                        <span className="font-mono tabular-nums" style={{ color: root.auraColor }}>
                          {root.elements.join(' · ')}
                        </span>
                      </div>
                      <h4
                        className="text-sm font-bold mt-1 font-display"
                        style={{ color: root.auraColor }}
                      >
                        {root.name}
                      </h4>
                      <p className="text-xs text-[#cbd5e1] mt-1.5 leading-relaxed">
                        {root.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#1e293b] text-[11px] font-mono text-[#94a3b8] space-y-0.5 tabular-nums">
                      <div>Nạp Khí: {Math.round(root.qiAbsorptionRate * 100)}% · Chiến Đấu: {Math.round(root.combatMultiplier * 100)}%</div>
                      <div>Thể Tu: {Math.round(root.bodyTemperingBonus * 100)}% · Ngộ Tính: {Math.round(root.comprehensionBonus * 100)}%</div>
                      <div className="text-[#f2d08b] font-sans pt-1">{root.recommendedPath}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#f2d08b] font-display mb-3">
                12 ĐẠI CẢNH GIỚI TU TIÊN (PHÀM NHÂN TU TIÊN CHUẨN MỰC)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CULTIVATION_REALMS.map((realm) => (
                  <div
                    key={realm.index}
                    className="p-4 rounded-lg bg-[#101824] border border-[#223042] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#f8fafc] font-display">
                        {realm.index + 1}. {realm.name}
                      </span>
                      <span className="text-xs font-mono text-[#c89d54] tabular-nums">
                        Thọ nguyên: {realm.lifespanYears} năm
                      </span>
                    </div>
                    <div className="text-xs text-[#94a3b8]">
                      Số tầng: {realm.subLevels} · Kiếp Lôi: {realm.tribulationLightningWaves} đạo · Tỷ lệ gốc: {Math.round(realm.baseSuccessChance * 100)}%
                    </div>
                    <div className="text-xs text-[#38bdf8]">{realm.visualAura}</div>
                    <div className="text-[11px] text-[#cbd5e1] pt-1 border-t border-[#1e293b]">
                      Mở khóa: {realm.unlockedCapabilities.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
