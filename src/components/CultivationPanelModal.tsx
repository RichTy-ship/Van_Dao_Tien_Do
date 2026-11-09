import React, { useState } from 'react';
import {
  HiddenCharacterData,
  DiscoveryView,
  CULTIVATION_REALMS,
  COMBAT_SKILLS,
  calculateSkillDamage,
} from '../game/rules';

export interface PlayerInventoryState {
  spiritStones: number;
  spiritHerbs: number;
  beastCores: number;
  breakthroughPills: number;
  healingPills: number;
  artifactTier: number;
  artifactName: string;
  sectName: string;
  mutationBuff: string | null;
}

interface CultivationPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  charData: HiddenCharacterData;
  discovery: DiscoveryView;
  realmIndex: number;
  subLevel: number;
  currentQi: number;
  requiredQi: number;
  inventory: PlayerInventoryState;
  onCraftBreakthroughPill: () => void;
  onUpgradeArtifact: () => void;
  onJoinSect: (sectName: string) => void;
  onPerformAppraisalRitual: () => void;
  onStartBreakthrough: (pillsToUse: number) => void;
}

export const CultivationPanelModal: React.FC<CultivationPanelModalProps> = ({
  isOpen,
  onClose,
  charData,
  discovery,
  realmIndex,
  subLevel,
  currentQi,
  requiredQi,
  inventory,
  onCraftBreakthroughPill,
  onUpgradeArtifact,
  onJoinSect,
  onPerformAppraisalRitual,
  onStartBreakthrough,
}) => {
  const [subTab, setSubTab] = useState<'destiny' | 'breakthrough' | 'alchemy' | 'sect'>('destiny');
  const [selectedPills, setSelectedPills] = useState<number>(
    Math.min(1, inventory.breakthroughPills)
  );

  if (!isOpen) return null;

  const currentRealm = CULTIVATION_REALMS[realmIndex] || CULTIVATION_REALMS[0];
  const isMajorBreakthrough = subLevel >= currentRealm.subLevels;
  const canBreakthroughNow = currentQi >= requiredQi;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nội Thị Đan Điền, Linh Căn & Luyện Đan"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#040609]/90 p-4 pointer-events-auto"
    >
      <div className="w-full max-w-[1040px] max-h-[86vh] bg-[#0b1017] border border-[#c89d54]/45 rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#e8e2d5]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#101824] border-b border-[#263346]">
          <div>
            <h2 className="text-lg font-bold text-[#f2d08b] font-display">
              NỘI THỊ ĐAN ĐIỀN · TỰ KHÁM PHÁ LINH CĂN & ĐẠO LỘ
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Cảnh giới: {currentRealm.name} (Tầng {subLevel}/{currentRealm.subLevels}) · Tông môn: {inventory.sectName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#080c12] p-1 rounded border border-[#223042]">
              {[
                { id: 'destiny', label: 'Linh Căn & Bản Thể' },
                { id: 'breakthrough', label: 'Đột Phá & Độ Kiếp' },
                { id: 'alchemy', label: 'Luyện Đan & Pháp Bảo' },
                { id: 'sect', label: 'Tông Môn & Công Pháp' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSubTab(t.id as typeof subTab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                    subTab === t.id
                      ? 'bg-[#c89d54] text-[#080b10]'
                      : 'text-[#94a3b8] hover:text-[#e8e2d5]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] border border-[#475569] rounded"
            >
              Đóng [C / Esc]
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0b1017]">
          {subTab === 'destiny' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Progressive Self-Discovery Status */}
              <div className="md:col-span-7 p-5 rounded-lg bg-[#101824] border border-[#223042] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase">
                    Tiến Trình Tự Khám Phá (Cấp {discovery.stage} / 5)
                  </span>
                  <span className="text-xs font-mono text-[#c89d54] tabular-nums">
                    Fate Seed: {charData.fateSeed}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#f2d08b] font-display">
                    {discovery.visibleRootName}
                  </h3>
                  <div className="text-xs text-[#94a3b8] mt-0.5">
                    {discovery.stageTitle}
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#080c12] border border-[#1e293b] text-sm text-[#e2e8f0] leading-relaxed">
                  {discovery.visibleClue}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#0d141f] border border-[#1e293b]">
                    <span className="text-[#94a3b8] block">Độ Thuần Khiết Linh Căn:</span>
                    <span className="font-mono text-sm font-semibold text-[#f8fafc] mt-0.5 block tabular-nums">
                      {discovery.visiblePurity}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#0d141f] border border-[#1e293b]">
                    <span className="text-[#94a3b8] block">Thiên Phú Lĩnh Ngộ:</span>
                    <span className="text-sm font-semibold text-[#34d399] mt-0.5 block">
                      {discovery.visibleTalent}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#0d141f] border border-[#1e293b]">
                    <span className="text-[#94a3b8] block">Thể Chất Ẩn (Mở ở Trúc Cơ):</span>
                    <span className="text-sm font-semibold text-[#38bdf8] mt-0.5 block">
                      {discovery.visibleConstitution}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#0d141f] border border-[#1e293b]">
                    <span className="text-[#94a3b8] block">Huyết Mạch Thượng Cổ:</span>
                    <span className="text-sm font-semibold text-[#f97316] mt-0.5 block">
                      {discovery.visibleBloodline}
                    </span>
                  </div>
                </div>

                {discovery.stage < 4 && (
                  <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#1e293b]">
                    <div className="text-xs text-[#94a3b8]">
                      Muốn sớm thấu rõ Linh Căn? Dùng 30 Linh Thạch kích hoạt Cổ Kính Trắc Linh hoặc khám phá Cổ Bi ngoài bản đồ.
                    </div>
                    <button
                      type="button"
                      disabled={inventory.spiritStones < 30}
                      onClick={onPerformAppraisalRitual}
                      className="px-4 py-2 text-xs font-bold bg-[#c89d54] hover:bg-[#d9b168] disabled:opacity-40 text-[#080b10] rounded whitespace-nowrap shrink-0"
                    >
                      Cảm Ứng Trắc Linh (30 Linh Thạch)
                    </button>
                  </div>
                )}
              </div>

              {/* Cultivation Foundation & Mental State */}
              <div className="md:col-span-5 p-5 rounded-lg bg-[#101824] border border-[#223042] space-y-4">
                <h3 className="text-base font-bold text-[#f8fafc] font-display">
                  TRẠNG THÁI ĐẠO CƠ & NHÂN QUẢ
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#cbd5e1]">Độ Ổn Định Căn Cơ (Foundation):</span>
                      <span className="font-mono text-[#34d399] tabular-nums">
                        {Math.round(charData.foundationStability)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#080c12] rounded overflow-hidden">
                      <div
                        className="h-full bg-[#34d399]"
                        style={{ width: `${Math.min(100, charData.foundationStability)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#cbd5e1]">Tâm Cảnh Đạo Tâm (Mental State):</span>
                      <span className="font-mono text-[#38bdf8] tabular-nums">
                        {Math.round(charData.mentalState)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#080c12] rounded overflow-hidden">
                      <div
                        className="h-full bg-[#38bdf8]"
                        style={{ width: `${Math.min(100, charData.mentalState)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1e293b] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Nhân Quả Thiện Ác (Karma):</span>
                      <span className="font-mono text-[#f2d08b] tabular-nums">
                        {charData.karma >= 0 ? `+${charData.karma} (Chính Đạo)` : `${charData.karma} (Nghịch Thiên)`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Thọ Nguyên Cảnh Giới:</span>
                      <span className="font-mono text-[#e2e8f0] tabular-nums">
                        {currentRealm.lifespanYears} năm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Bản Mệnh Pháp Bảo:</span>
                      <span className="font-semibold text-[#38bdf8]">
                        {inventory.artifactName} (+{inventory.artifactTier * 18}% Uy Lực)
                      </span>
                    </div>
                    {inventory.mutationBuff && (
                      <div className="p-2 rounded bg-[#a855f7]/15 border border-[#a855f7]/40 text-[#e9d5ff]">
                        Đạo Cơ Biến Dị: {inventory.mutationBuff}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'breakthrough' && (
            <div className="p-5 rounded-lg bg-[#101824] border border-[#223042] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#f2d08b] font-display">
                    NGHI THỨC ĐỘT PHÁ & VƯỢT THIÊN KIẾP ({currentRealm.name} →{' '}
                    {isMajorBreakthrough
                      ? CULTIVATION_REALMS[Math.min(CULTIVATION_REALMS.length - 1, realmIndex + 1)]?.name
                      : `${currentRealm.name} Tầng ${subLevel + 1}`}
                    )
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    {isMajorBreakthrough
                      ? `Đột phá Đại Cảnh Giới sẽ dẫn động ${currentRealm.tribulationLightningWaves} đạo Thiên Kiếp Lôi giáng xuống chiến trường 2.5D!`
                      : 'Đột phá tiểu cảnh giới cần tích lũy đủ Linh Lực trong Đan Điền.'}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-[#94a3b8]">Linh Lực Đan Điền</div>
                  <div className="text-base font-bold text-[#38bdf8] tabular-nums">
                    {Math.round(currentQi)} / {requiredQi}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded bg-[#080c12] border border-[#1e293b] space-y-1.5">
                  <div className="text-[#94a3b8]">1. Căn Cơ & Tâm Cảnh</div>
                  <div className="text-sm font-bold text-[#34d399] tabular-nums">
                    Căn cơ {Math.round(charData.foundationStability)}% · Tâm cảnh {Math.round(charData.mentalState)}%
                  </div>
                  <p className="text-[#64748b]">
                    Chiến đấu thực tế và ngồi thiền cạnh Linh Mạch giúp củng cố căn cơ, giảm nguy cơ Tẩu Hỏa Nhập Ma.
                  </p>
                </div>

                <div className="p-4 rounded bg-[#080c12] border border-[#1e293b] space-y-2">
                  <div className="text-[#94a3b8]">2. Chuẩn Bị Đan Dược Hộ Mạch</div>
                  <div className="text-sm font-bold text-[#f2d08b] tabular-nums">
                    Hiện có: {inventory.breakthroughPills} viên Hộ Mạch / Trúc Cơ Đan
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span>Số viên sử dụng:</span>
                    {[0, 1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        disabled={n > inventory.breakthroughPills}
                        onClick={() => setSelectedPills(n)}
                        className={`px-2.5 py-1 rounded font-mono ${
                          selectedPills === n
                            ? 'bg-[#c89d54] text-[#080b10] font-bold'
                            : 'bg-[#16202e] text-[#cbd5e1] disabled:opacity-30'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded bg-[#080c12] border border-[#1e293b] space-y-1.5">
                  <div className="text-[#94a3b8]">3. Khảo Nghiệm Thiên Kiếp</div>
                  <div className="text-sm font-bold text-[#a855f7]">
                    {isMajorBreakthrough
                      ? `${currentRealm.tribulationLightningWaves} Đợt Thiên Lôi Thực Chiến`
                      : 'Chu Thiên Vận Chuyển (Không có Lôi Kiếp)'}
                  </div>
                  <p className="text-[#64748b]">
                    Khi bắt đầu Độ Kiếp, hãy di chuyển hoặc dùng Thân Pháp [Space] né tránh các vòng sấm sét đỏ trên mặt đất!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
                <div className="text-xs text-[#cbd5e1]">
                  {canBreakthroughNow
                    ? 'Linh lực đã viên mãn! Bạn có thể bắt đầu xung kích cảnh giới ngay bây giờ.'
                    : `Cần tích lũy thêm ${Math.max(0, requiredQi - Math.round(currentQi))} điểm Linh Lực (Thổ nạp [H], tiêu diệt Yêu Thú hoặc thu thập Linh Tinh).`}
                </div>
                <button
                  type="button"
                  disabled={!canBreakthroughNow}
                  onClick={() => {
                    onStartBreakthrough(Math.min(selectedPills, inventory.breakthroughPills));
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-bold bg-[#c89d54] hover:bg-[#d9b168] disabled:opacity-40 text-[#080b10] rounded transition-colors whitespace-nowrap shrink-0"
                >
                  {isMajorBreakthrough ? 'Dẫn Động Thiên Kiếp Phá Cảnh' : 'Vận Công Đột Phá Tiểu Cảnh Giới'}
                </button>
              </div>
            </div>
          )}

          {subTab === 'alchemy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-lg bg-[#101824] border border-[#223042] space-y-4">
                <h3 className="text-base font-bold text-[#f2d08b] font-display">
                  ĐAN ĐỈNH LÒ — LUYỆN CHẾ LINH ĐAN
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Sử dụng Linh Thảo và Yêu Đan thu thập được từ rừng yêu thú để luyện chế Trúc Cơ Hộ Mạch Đan (+11% tỷ lệ phá cảnh mỗi viên).
                </p>
                <div className="p-3 rounded bg-[#080c12] border border-[#1e293b] text-xs space-y-1 font-mono tabular-nums">
                  <div>Linh Thảo hiện có: {inventory.spiritHerbs}株</div>
                  <div>Yêu Đan hiện có: {inventory.beastCores} viên</div>
                  <div>Linh Thạch hiện có: {inventory.spiritStones} viên</div>
                  <div className="text-[#34d399]">Đan dược Hộ Mạch trong túi: {inventory.breakthroughPills} viên</div>
                </div>
                <button
                  type="button"
                  disabled={inventory.spiritHerbs < 2 || inventory.spiritStones < 15}
                  onClick={onCraftBreakthroughPill}
                  className="w-full py-2.5 px-4 text-xs font-bold bg-[#34d399] hover:bg-[#10b981] disabled:opacity-40 text-[#05080c] rounded transition-colors"
                >
                  Khởi Lò Luyện Hộ Mạch Đan (Tốn 2 Linh Thảo + 15 Linh Thạch)
                </button>
              </div>

              <div className="p-5 rounded-lg bg-[#101824] border border-[#223042] space-y-4">
                <h3 className="text-base font-bold text-[#38bdf8] font-display">
                  ÔN DƯỠNG BẢN MỆNH PHÁP BẢO
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Dung luyện Yêu Đan và Linh Thạch vào Bản Mệnh Phi Kiếm để gia tăng sát thương thực chiến và phạm vi kiếm khí.
                </p>
                <div className="p-3 rounded bg-[#080c12] border border-[#1e293b] text-xs space-y-1">
                  <div className="font-bold text-[#f8fafc]">
                    Pháp Bảo: {inventory.artifactName} (Phẩm cấp +{inventory.artifactTier})
                  </div>
                  <div className="text-[#38bdf8] font-mono tabular-nums">
                    Gia tăng sát thương tất cả kỹ năng: +{inventory.artifactTier * 18}%
                  </div>
                </div>
                <button
                  type="button"
                  disabled={inventory.beastCores < 1 || inventory.spiritStones < 25}
                  onClick={onUpgradeArtifact}
                  className="w-full py-2.5 px-4 text-xs font-bold bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:opacity-40 text-[#05080c] rounded transition-colors"
                >
                  Tôi Luyện Pháp Bảo (Tốn 1 Yêu Đan + 25 Linh Thạch)
                </button>
              </div>
            </div>
          )}

          {subTab === 'sect' && (
            <div className="space-y-6">
              <div className="p-5 rounded-lg bg-[#101824] border border-[#223042]">
                <h3 className="text-base font-bold text-[#f2d08b] font-display mb-3">
                  TÔNG MÔN TU CHÂN GIỚI (CHỌN HƯỚNG ĐẠO LỘ)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Thái Thanh Kiếm Tông',
                      desc: 'Chính đạo đệ nhất kiếm phái, tinh thông Thanh Nguyên Kiếm Quyết & Vạn Kiếm Quy Tông.',
                    },
                    {
                      name: 'Thiên Lôi Các',
                      desc: 'Tu luyện Cửu Tiêu Thần Lôi, sát phạt bá đạo và tôi luyện nhục thân dưới lôi kiếp.',
                    },
                    {
                      name: 'Đan Đỉnh Tiên Các',
                      desc: 'Thánh địa của Đan Sư và Hỏa Pháp, tinh thông Phần Thiên Liên Hỏa & Luyện Đan.',
                    },
                    {
                      name: 'Tán Tu Liên Minh',
                      desc: 'Tự do tự tại, không câu nệ chính tà, tăng khả năng phát hiện Động Phủ Cổ.',
                    },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className={`p-3.5 rounded border flex flex-col justify-between ${
                        inventory.sectName === s.name
                          ? 'bg-[#172334] border-[#c89d54]'
                          : 'bg-[#080c12] border-[#1e293b]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#f8fafc]">{s.name}</div>
                        <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onJoinSect(s.name)}
                        className="mt-3 py-1.5 px-3 text-[11px] font-semibold rounded bg-[#1e293b] hover:bg-[#c89d54] hover:text-[#080b10] text-[#e2e8f0] transition-colors"
                      >
                        {inventory.sectName === s.name ? 'Đang Trực Thuộc' : 'Bái Nhập Tông Môn'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#101824] border border-[#223042]">
                <h3 className="text-base font-bold text-[#38bdf8] font-display mb-3">
                  HỆ THỐNG KỸ NĂNG & THẦN THÔNG CHIẾN ĐẤU HIỆN TẠI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COMBAT_SKILLS.map((sk) => {
                    const dmg = calculateSkillDamage(sk, charData, realmIndex, subLevel);
                    return (
                      <div
                        key={sk.id}
                        className="p-3.5 rounded bg-[#080c12] border border-[#1e293b] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold" style={{ color: sk.color }}>
                            {sk.name}
                          </span>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#16202e] text-[#f2d08b]">
                            Phím [{sk.key}]
                          </span>
                        </div>
                        <div className="text-[11px] text-[#94a3b8]">{sk.damageType}</div>
                        <p className="text-xs text-[#cbd5e1] leading-relaxed">{sk.description}</p>
                        <div className="pt-1 border-t border-[#16202e] text-[11px] font-mono text-[#38bdf8] tabular-nums">
                          Uy lực: {dmg} · Linh lực: {sk.qiCost} · Hồi chiêu: {sk.cooldown}s
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
