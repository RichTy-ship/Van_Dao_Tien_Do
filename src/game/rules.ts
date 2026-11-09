export type SpiritualRootId =
  | 'kim'
  | 'moc'
  | 'thuy'
  | 'hoa'
  | 'tho'
  | 'phong'
  | 'loi'
  | 'bang'
  | 'am'
  | 'duong'
  | 'di_linh_can'
  | 'ngu_hanh'
  | 'thien_linh_can'
  | 'hon_don'
  | 'vo_linh_can'
  | 'phe_linh_can';

export interface SpiritualRootSpec {
  id: SpiritualRootId;
  name: string;
  category: 'Ngũ Hành' | 'Biến Dị' | 'Âm Dương' | 'Thiên Phú' | 'Đặc Thù' | 'Khiếm Khuyết';
  elements: string[];
  qiAbsorptionRate: number;
  combatMultiplier: number;
  bodyTemperingBonus: number;
  comprehensionBonus: number;
  vagueSensation: string; // Luyện Khí 1-3 clue
  elementHint: string; // Luyện Khí 4-6 clue
  partialStructure: string; // Luyện Khí 7-9 clue
  description: string;
  auraColor: string;
  recommendedPath: string;
}

export const SPIRITUAL_ROOTS: Record<SpiritualRootId, SpiritualRootSpec> = {
  kim: {
    id: 'kim',
    name: 'Chân Kim Linh Căn',
    category: 'Ngũ Hành',
    elements: ['Kim'],
    qiAbsorptionRate: 1.25,
    combatMultiplier: 1.35,
    bodyTemperingBonus: 1.2,
    comprehensionBonus: 1.0,
    vagueSensation: 'Đầu ngón tay và kinh mạch thỉnh thoảng nhói lên như có mũi kim sắc bén lướt qua khi hít thở sương sớm.',
    elementHint: 'Linh khí sắc bén thuộc tính Kim tự động hội tụ quanh binh khí sắt thép khi vận khí.',
    partialStructure: 'Đơn thuộc tính Kim — khí mạch sắc lạnh, công phạt cực mạnh.',
    description: 'Linh căn hệ Kim thuần túy, sắc bén vô song, cực kỳ phù hợp với Kiếm Tu và Phá Giáp Thuật.',
    auraColor: '#f5c542',
    recommendedPath: 'Kiếm Tu · Bạch Đế Kim Hoàng Quyết',
  },
  moc: {
    id: 'moc',
    name: 'Thanh Mộc Linh Căn',
    category: 'Ngũ Hành',
    elements: ['Mộc'],
    qiAbsorptionRate: 1.3,
    combatMultiplier: 1.1,
    bodyTemperingBonus: 1.25,
    comprehensionBonus: 1.15,
    vagueSensation: 'Hơi thở mang theo mùi thảo mộc thanh mát, vết thương nhỏ ngoài da tự lành nhanh bất thường.',
    elementHint: 'Linh khí sinh trưởng thuộc tính Mộc cộng hưởng mạnh mẽ khi đứng gần cổ thụ và linh thảo.',
    partialStructure: 'Đơn thuộc tính Mộc — sinh cơ dồi dào, thiên phú Luyện Đan và Độc Thuật.',
    description: 'Chứa đựng sinh mệnh lực dồi dào của tạo hóa, tinh thông Luyện Đan, hồi phục và khống chế.',
    auraColor: '#34d399',
    recommendedPath: 'Đan Tu / Pháp Tu · Thanh Đế Trường Sinh Công',
  },
  thuy: {
    id: 'thuy',
    name: 'Huyền Thủy Linh Căn',
    category: 'Ngũ Hành',
    elements: ['Thủy'],
    qiAbsorptionRate: 1.3,
    combatMultiplier: 1.15,
    bodyTemperingBonus: 1.05,
    comprehensionBonus: 1.2,
    vagueSensation: 'Đan điền mát lạnh như dòng suối ngầm, tâm trí tĩnh lặng ngay cả khi xung quanh hỗn loạn.',
    elementHint: 'Linh khí nhu hòa thuộc tính Thủy lưu chuyển liên miên không dứt trong kinh mạch.',
    partialStructure: 'Đơn thuộc tính Thủy — linh lực绵trường, dung lượng đan điền vượt xa đồng giai.',
    description: 'Linh lực như nước, vừa nhu hòa hộ thể vừa có thể hóa sóng dữ nhấn chìm vạn vật.',
    auraColor: '#38bdf8',
    recommendedPath: 'Pháp Tu / Trận Sư · Quỳ Thủy Chân Kinh',
  },
  hoa: {
    id: 'hoa',
    name: 'Xích Hỏa Linh Căn',
    category: 'Ngũ Hành',
    elements: ['Hỏa'],
    qiAbsorptionRate: 1.3,
    combatMultiplier: 1.4,
    bodyTemperingBonus: 1.1,
    comprehensionBonus: 1.0,
    vagueSensation: 'Lòng bàn tay luôn nóng rực như than hồng, huyết dịch sôi trào mỗi khi giao chiến.',
    elementHint: 'Linh khí bạo liệt thuộc tính Hỏa bùng phát tia lửa nhỏ khi xuất quyền hoặc vung kiếm.',
    partialStructure: 'Đơn thuộc tính Hỏa — bạo phát sát thương diện rộng và khống hỏa luyện đan.',
    description: 'Chân hỏa bất diệt, công kích cuồng bạo và là nền tảng tối thượng của Luyện Đan Sư lẫn Luyện Khí Sư.',
    auraColor: '#f97316',
    recommendedPath: 'Hỏa Pháp / Đan Khí Sư · Phần Thiên Chú',
  },
  tho: {
    id: 'tho',
    name: 'Hậu Thổ Linh Căn',
    category: 'Ngũ Hành',
    elements: ['Thổ'],
    qiAbsorptionRate: 1.2,
    combatMultiplier: 1.15,
    bodyTemperingBonus: 1.45,
    comprehensionBonus: 1.0,
    vagueSensation: 'Đôi chân bám chặt mặt đất trầm ổn như núi đá, khí lực dẻo dai ít khi mỏi mệt.',
    elementHint: 'Địa mạch linh khí thuộc tính Thổ không ngừng thẩm thấu từ lòng đất lên kinh mạch.',
    partialStructure: 'Đơn thuộc tính Thổ — căn cơ vững chắc, phòng ngự và phản chấn vượt trội.',
    description: 'Vững chãi như thái sơn, tỷ lệ tẩu hỏa nhập ma khi đột phá thấp nhất trong ngũ hành.',
    auraColor: '#d97706',
    recommendedPath: 'Thể Tu / Trận Pháp · Bất Động Minh Vương Quyết',
  },
  phong: {
    id: 'phong',
    name: 'Tật Phong Dị Linh Căn',
    category: 'Biến Dị',
    elements: ['Phong'],
    qiAbsorptionRate: 1.45,
    combatMultiplier: 1.35,
    bodyTemperingBonus: 1.1,
    comprehensionBonus: 1.25,
    vagueSensation: 'Thân thể nhẹ bẫng như lá mùa thu, mỗi bước chạy đều có luồng gió xoáy nâng đỡ dưới gót chân.',
    elementHint: 'Dị chủng linh khí hệ Phong sắc bén và linh hoạt nhảy múa quanh đầu ngón tay.',
    partialStructure: 'Biến dị Linh Căn hệ Phong — tốc độ xuất chiêu và thân pháp phi hành cực hạn.',
    description: 'Linh căn biến dị từ Mộc và Kim, tốc độ tu luyện và khả năng truy kích không ai sánh kịp.',
    auraColor: '#2dd4bf',
    recommendedPath: 'Kiếm Tu Tốc Độ · Cửu Tiêu Ngự Phong Quyết',
  },
  loi: {
    id: 'loi',
    name: 'Cửu Tiêu Lôi Linh Căn',
    category: 'Biến Dị',
    elements: ['Lôi'],
    qiAbsorptionRate: 1.55,
    combatMultiplier: 1.6,
    bodyTemperingBonus: 1.35,
    comprehensionBonus: 1.2,
    vagueSensation: 'Tóc mai thỉnh thoảng dựng đứng kèm tiếng nổ lách tách nhỏ như tia điện chạy dọc sống lưng.',
    elementHint: 'Thiên lôi chi khí bá đạo cộng hưởng dữ dội mỗi khi trời chuyển mưa giông.',
    partialStructure: 'Dị Linh Căn hệ Lôi — khắc chế tà ma, uy lực sát phạt đứng đầu chư thiên.',
    description: 'Dị linh căn đại diện cho Thiên Phạt, vừa có sát thương hủy diệt vừa có kháng tính tự nhiên trước Thiên Kiếp.',
    auraColor: '#a855f7',
    recommendedPath: 'Lôi Pháp / Kiếm Lôi · Ngũ Lôi Chính Pháp',
  },
  bang: {
    id: 'bang',
    name: 'Hàn Băng Dị Linh Căn',
    category: 'Biến Dị',
    elements: ['Băng'],
    qiAbsorptionRate: 1.45,
    combatMultiplier: 1.4,
    bodyTemperingBonus: 1.15,
    comprehensionBonus: 1.3,
    vagueSensation: 'Hơi thở phả ra làn sương trắng lạnh lẽo ngay cả giữa trưa nắng gắt, tâm cảnh tĩnh như mặt hồ đóng băng.',
    elementHint: 'Hàn khí kết tinh thành hoa tuyết sáu cánh lơ lửng trên lòng bàn tay khi minh tưởng.',
    partialStructure: 'Dị Linh Căn hệ Băng — đóng băng không gian, miễn nhiễm tâm ma quấy nhiễu.',
    description: 'Biến dị từ Thủy linh căn cực hạn, đóng băng kinh mạch kẻ địch và giữ tâm cảnh tuyệt đối thanh tỉnh.',
    auraColor: '#67e8f9',
    recommendedPath: 'Băng Pháp / Kiếm Ý · Huyền Băng Cực Đạo',
  },
  am: {
    id: 'am',
    name: 'Thái Âm Linh Căn',
    category: 'Âm Dương',
    elements: ['Âm'],
    qiAbsorptionRate: 1.5,
    combatMultiplier: 1.45,
    bodyTemperingBonus: 1.0,
    comprehensionBonus: 1.45,
    vagueSensation: 'Ban đêm tinh thần minh mẫn gấp bội, bóng tối xung quanh như tấm áo choàng quen thuộc.',
    elementHint: 'Nguyệt hoa và u minh chi khí tự động rót vào mi tâm mỗi khi trăng lên.',
    partialStructure: 'Thái Âm Bản Nguyên — thần thức nhạy bén, công kích thẳng vào nguyên thần.',
    description: 'Linh căn hiếm thuộc Thái Âm chi lực, cực mạnh về Thần Thức, Ẩn Sát, Huyễn Thuật và Quỷ Đạo.',
    auraColor: '#818cf8',
    recommendedPath: 'Thần Thức / Ma Tu · Thái Âm Luyện Thần Quyết',
  },
  duong: {
    id: 'duong',
    name: 'Thái Dương Linh Căn',
    category: 'Âm Dương',
    elements: ['Dương'],
    qiAbsorptionRate: 1.5,
    combatMultiplier: 1.5,
    bodyTemperingBonus: 1.4,
    comprehensionBonus: 1.2,
    vagueSensation: 'Khí huyết trong người rực sáng như mặt trời ban trưa, yêu tà âm khí không dám lại gần.',
    elementHint: 'Nhật tinh chi hỏa chí dương chí cương bùng cháy vàng rực quanh đan điền.',
    partialStructure: 'Thái Dương Bản Nguyên — chí dương bất hoại, thiêu rụi mọi âm tà chướng khí.',
    description: 'Thuần dương chi lực từ thái cổ, khắc tinh của Ma Tu và Yêu Thú, khí huyết dồi dào vô tận.',
    auraColor: '#fbbf24',
    recommendedPath: 'Thể Pháp Song Tu · Đại Nhật Lưu Ly Kinh',
  },
  di_linh_can: {
    id: 'di_linh_can',
    name: 'Hư Không Tinh Dị Linh Căn',
    category: 'Biến Dị',
    elements: ['Không Gian', 'Tinh Thần'],
    qiAbsorptionRate: 1.55,
    combatMultiplier: 1.45,
    bodyTemperingBonus: 1.2,
    comprehensionBonus: 1.5,
    vagueSensation: 'Đôi khi cảm nhận được gợn sóng không gian quanh thân và ánh sao đêm phản chiếu trong thức hải.',
    elementHint: 'Tinh thần lực từ bầu trời đêm và khe nứt không gian giao thoa trong kinh mạch.',
    partialStructure: 'Trạch Tinh Dị Linh Căn — thiên phú Trận Pháp, Không Gian Thuật và Tiên Tri Cơ Duyên.',
    description: 'Dị linh căn giao hòa giữa Tinh Không và Hư Vô, cho phép thi triển Na Di và Đại Trận vượt cấp.',
    auraColor: '#c084fc',
    recommendedPath: 'Trận Đạo / Không Gian · Chu Thiên Tinh Đấu Lục',
  },
  ngu_hanh: {
    id: 'ngu_hanh',
    name: 'Ngũ Hành Hỗn Nguyên Linh Căn',
    category: 'Đặc Thù',
    elements: ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'],
    qiAbsorptionRate: 0.85,
    combatMultiplier: 1.35,
    bodyTemperingBonus: 1.3,
    comprehensionBonus: 1.45,
    vagueSensation: 'Năm luồng khí sắc màu khác nhau cùng tồn tại trong đan điền, tốc độ nạp khí chậm nhưng cực kỳ dày đặc.',
    elementHint: 'Kim, Mộc, Thủy, Hỏa, Thổ đồng thời vận chuyển tạo thành vòng tuần hoàn tương sinh.',
    partialStructure: 'Ngũ Hành Tạp Linh Căn (có thể hóa Hỗn Nguyên) — tốn gấp đôi tài nguyên nhưng kiêm tu vạn pháp.',
    description: 'Khởi đầu chậm như tạp linh căn nhưng khi gom đủ Ngũ Hành Tương Sinh sẽ tạo ra Hỗn Nguyên Pháp Lực khắc chế mọi đơn hệ.',
    auraColor: '#10b981',
    recommendedPath: 'Ngũ Hành Kiêm Tu · Đại Ngũ Hành Tuyệt Diệt Thần Quang',
  },
  thien_linh_can: {
    id: 'thien_linh_can',
    name: 'Thiên Linh Căn Thuần Khiết',
    category: 'Thiên Phú',
    elements: ['Thiên Đạo Tinh Thuần'],
    qiAbsorptionRate: 1.85,
    combatMultiplier: 1.45,
    bodyTemperingBonus: 1.15,
    comprehensionBonus: 1.5,
    vagueSensation: 'Chỉ cần tĩnh tâm hít thở, linh khí thiên địa đã tự động ùa vào cơ thể không chút tắc nghẽn.',
    elementHint: 'Linh khí thuần khiết một trăm phần trăm, không hề có tạp chất, bình cảnh Luyện Khí tự tan biến.',
    partialStructure: 'Cực Phẩm Thiên Linh Căn — con cưng của Thiên Đạo, tốc độ tu luyện trước Kết Đan cực nhanh.',
    description: 'Một trong vạn người mới có. Tu luyện như cưỡi gió, không gặp bình cảnh ở Trúc Cơ, nhưng dễ sinh tâm kiêu ngạo khi Độ Kiếp.',
    auraColor: '#22d3ee',
    recommendedPath: 'Chính Đạo Chân Truyền · Thái Thanh Tiên Quyết',
  },
  hon_don: {
    id: 'hon_don',
    name: 'Tiên Thiên Hỗn Độn Linh Căn',
    category: 'Thiên Phú',
    elements: ['Hỗn Độn', 'Vạn Pháp'],
    qiAbsorptionRate: 1.75,
    combatMultiplier: 1.7,
    bodyTemperingBonus: 1.5,
    comprehensionBonus: 1.65,
    vagueSensation: 'Trong đan điền tồn tại một luồng sương mù xám bạc nguyên thủy, có thể thôn phệ mọi loại linh khí.',
    elementHint: 'Bất kể linh khí thuần hay trọc, chính hay ma đều bị luồng khí xám bạc đồng hóa thành bản nguyên.',
    partialStructure: 'Truyền Thuyết Hỗn Độn Linh Căn — dung nạp tiên ma, nhưng thiên kiếp mạnh gấp bội người thường.',
    description: 'Linh căn thần thoại từ thuở khai thiên lập địa. Dung nạp mọi công pháp nhưng mỗi lần đột phá đều bị Thiên Đạo giáng Cửu Cửu Thiên Kiếp.',
    auraColor: '#e879f9',
    recommendedPath: 'Vạn Đạo Quy Nhất · Hỗn Độn Khai Thiên Kinh',
  },
  vo_linh_can: {
    id: 'vo_linh_can',
    name: 'Vô Linh Căn (Phàm Khu Nghịch Thiên)',
    category: 'Khiếm Khuyết',
    elements: ['Khí Huyết', 'Chiến Ý'],
    qiAbsorptionRate: 0.4,
    combatMultiplier: 1.4,
    bodyTemperingBonus: 2.1,
    comprehensionBonus: 1.6,
    vagueSensation: 'Không thể cảm nhận linh khí lơ lửng trong không trung, nhưng cơ bắp, xương cốt và ngũ quan lại nhạy bén gấp đôi người thường.',
    elementHint: 'Kinh mạch khép kín với linh khí ngoại giới, nhưng có thể trực tiếp luyện hóa tinh huyết yêu thú và sát khí chiến trường.',
    partialStructure: 'Vô Linh Căn — không thể đi đường Pháp Tu thông thường, nhưng nhục thân chính là Pháp Bảo mạnh nhất.',
    description: 'Không có linh căn dẫn khí, bị các tông môn thông thường từ chối. Tuy nhiên sở hữu Nhục Thân Không Giới Hạn và Ngộ Tính Võ Đạo cực cao để lấy Võ Nhập Đạo, dùng quyền đấm nát Pháp Bảo!',
    auraColor: '#ef4444',
    recommendedPath: 'Cực Đạo Thể Tu / Kiếm Võ · Bất Diệt Chiến Thần Quyết',
  },
  phe_linh_can: {
    id: 'phe_linh_can',
    name: 'Phế Linh Căn (Tàn Khuyết Đạo Mạch)',
    category: 'Khiếm Khuyết',
    elements: ['Tạp Khí', 'Nhân Quả'],
    qiAbsorptionRate: 0.55,
    combatMultiplier: 1.25,
    bodyTemperingBonus: 1.55,
    comprehensionBonus: 1.85,
    vagueSensation: 'Linh khí đi vào kinh mạch liền tán loạn tám phần, chỉ giữ lại được hai phần vô cùng gian nan.',
    elementHint: 'Linh mạch đứt đoạn bẩm sinh, nhưng mỗi lần kiên trì vận công lại giúp tâm cảnh và thần thức cứng cỏi phi thường.',
    partialStructure: 'Phế Linh Căn — tư chất thấp nhất tu chân giới, nhưng ẩn chứa Đại Nghị Lực và Cơ Duyên Nghịch Thiên.',
    description: 'Tư chất kém cỏi nhất theo chuẩn mực thế gian. Đổi lại, Thiên Đạo bù đắp Ngộ Tính siêu phàm, Kháng Tâm Ma tuyệt đối và dễ dàng tương thích với Cổ Bảo, Trận Pháp, Đan Dược nghịch thiên.',
    auraColor: '#94a3b8',
    recommendedPath: 'Phàm Nhân Nghịch Tiên · Vạn Kiếm Quy Tông & Ngoại Vật Đạo',
  },
};

export interface RealmSpec {
  index: number;
  name: string;
  subLevels: number;
  baseQiRequired: number;
  lifespanYears: number;
  tribulationLightningWaves: number;
  baseSuccessChance: number;
  visualAura: string;
  unlockedCapabilities: string[];
}

export const CULTIVATION_REALMS: RealmSpec[] = [
  {
    index: 0,
    name: 'Phàm Nhân',
    subLevels: 1,
    baseQiRequired: 100,
    lifespanYears: 80,
    tribulationLightningWaves: 0,
    baseSuccessChance: 0.95,
    visualAura: 'Hơi thở phàm trần, chưa có hào quang linh lực',
    unlockedCapabilities: ['Cảm Khí Nhập Môn', 'Kiếm Thuật Cơ Bản', 'Thân Pháp Né Tránh'],
  },
  {
    index: 1,
    name: 'Luyện Khí',
    subLevels: 12,
    baseQiRequired: 180,
    lifespanYears: 120,
    tribulationLightningWaves: 1,
    baseSuccessChance: 0.88,
    visualAura: 'Linh quang mờ ảo lưu chuyển quanh bàn tay và mũi kiếm',
    unlockedCapabilities: ['Nội Thị Đan Điền', 'Ngự Vật Sơ Cấp', 'Pháp Thuật Ngũ Hành', 'Nghi Thức Trắc Linh Căn'],
  },
  {
    index: 2,
    name: 'Trúc Cơ',
    subLevels: 3, // Sơ kỳ, Trung kỳ, Hậu kỳ
    baseQiRequired: 650,
    lifespanYears: 250,
    tribulationLightningWaves: 3,
    baseSuccessChance: 0.72,
    visualAura: 'Linh lực hóa dịch, Đạo Đài tỏa sáng dưới chân, Ngự Kiếm Phi Hành',
    unlockedCapabilities: ['Thức Tỉnh Thể Chất & Huyết Mạch', 'Ngự Kiếm Phi Hành', 'Thần Thức Ngoại Phóng', 'Mở Động Phủ Cá Nhân'],
  },
  {
    index: 3,
    name: 'Kết Đan',
    subLevels: 3,
    baseQiRequired: 1600,
    lifespanYears: 500,
    tribulationLightningWaves: 6,
    baseSuccessChance: 0.58,
    visualAura: 'Kim Đan cửu chuyển phát ra vầng sáng rực rỡ sau lưng, uy áp thiên địa',
    unlockedCapabilities: ['Luyện Chế Bản Mệnh Pháp Bảo', 'Đan Hỏa Chân Nguyên', 'Trận Pháp Hộ Sơn'],
  },
  {
    index: 4,
    name: 'Nguyên Anh',
    subLevels: 3,
    baseQiRequired: 3800,
    lifespanYears: 1000,
    tribulationLightningWaves: 9,
    baseSuccessChance: 0.45,
    visualAura: 'Nguyên Anh pháp tướng hiện hình trên đỉnh đầu, sấm chớp và dị tượng vây quanh',
    unlockedCapabilities: ['Nguyên Anh Xuất Khiếu', 'Thuấn Di Không Gian', 'Lĩnh Ngộ Sơ Kỳ Pháp Tắc', 'Khai Tông Lập Phái'],
  },
  {
    index: 5,
    name: 'Hóa Thần',
    subLevels: 3,
    baseQiRequired: 8500,
    lifespanYears: 2000,
    tribulationLightningWaves: 12,
    baseSuccessChance: 0.38,
    visualAura: 'Nguyên Thần hòa hợp Thiên Địa, dẫn động nguyên khí phạm vi trăm dặm',
    unlockedCapabilities: ['Điều Động Thiên Địa Nguyên Khí', 'Thần Thông Pháp Tướng', 'Cảm Ứng Giới Diện'],
  },
  {
    index: 6,
    name: 'Luyện Hư',
    subLevels: 3,
    baseQiRequired: 18000,
    lifespanYears: 4500,
    tribulationLightningWaves: 15,
    baseSuccessChance: 0.32,
    visualAura: 'Hư không vặn vẹo quanh thân, ẩn hiện quy tắc âm dương ngũ hành',
    unlockedCapabilities: ['Xé Rách Không Gian', 'Hư Không Tạo Vật', 'Pháp Tắc Chi Lực'],
  },
  {
    index: 7,
    name: 'Hợp Thể',
    subLevels: 3,
    baseQiRequired: 36000,
    lifespanYears: 9000,
    tribulationLightningWaves: 18,
    baseSuccessChance: 0.28,
    visualAura: 'Pháp thân và Nguyên thần hợp nhất, mỗi cử chỉ đều mang uy năng sơn hà',
    unlockedCapabilities: ['Pháp Thiên Tượng Địa', 'Sáng Tạo Bí Cảnh Nhỏ', 'Huyết Mạch Phản Tổ'],
  },
  {
    index: 8,
    name: 'Đại Thừa',
    subLevels: 3,
    baseQiRequired: 75000,
    lifespanYears: 18000,
    tribulationLightningWaves: 27,
    baseSuccessChance: 0.22,
    visualAura: 'Tiên quang sơ hiện, vạn pháp bất xâm, đứng trên đỉnh phong nhân giới',
    unlockedCapabilities: ['Ngôn Xuất Pháp Tùy', 'Ngưng Tụ Bán Tiên Khí', 'Triệu Hồi Thời Gian Trường Hà'],
  },
  {
    index: 9,
    name: 'Độ Kiếp',
    subLevels: 1,
    baseQiRequired: 150000,
    lifespanYears: 30000,
    tribulationLightningWaves: 36,
    baseSuccessChance: 0.18,
    visualAura: 'Kiếp vân vạn dặm, lôi điện vờn quanh, chuẩn bị vượt Cửu Trọng Thiên Kiếp',
    unlockedCapabilities: ['Đối Kháng Thiên Đạo Quy Tắc', 'Luyện Hóa Kiếp Lôi Thành Tiên Nguyên'],
  },
  {
    index: 10,
    name: 'Phi Thăng',
    subLevels: 1,
    baseQiRequired: 300000,
    lifespanYears: 99999,
    tribulationLightningWaves: 49,
    baseSuccessChance: 0.15,
    visualAura: 'Tiên Môn mở rộng, Kim Quang Tiếp Dẫn chiếu rọi khắp cõi phàm trần',
    unlockedCapabilities: ['Phá Toái Hư Không', 'Chuyển Hóa Tiên Thể Hoàn Toàn'],
  },
  {
    index: 11,
    name: 'Tiên Giới Chân Tiên',
    subLevels: 9,
    baseQiRequired: 999999,
    lifespanYears: 999999,
    tribulationLightningWaves: 81,
    baseSuccessChance: 0.12,
    visualAura: 'Tiên Đạo Pháp Tắc vĩnh hằng, Bất Tử Bất Diệt cùng Nhật Nguyệt',
    unlockedCapabilities: ['Chưởng Khống Tiên Đạo Bản Nguyên', 'Khai Thiên Lập Giới'],
  },
];

export interface HiddenCharacterData {
  fateSeed: string;
  numericSeed: number;
  spiritualRoot: SpiritualRootSpec;
  rootPurity: number; // 40 to 100
  hiddenConstitution: string;
  constitutionEffect: string;
  hiddenBloodline: string;
  bloodlineEffect: string;
  innateTalent: string;
  comprehension: number; // 50 to 200
  fortune: number; // 50 to 200
  karma: number; // -100 to +100
  mentalState: number; // 0 to 100
  foundationStability: number; // 0 to 100
  pityCounter: number; // Server anti-bad-luck tracker
}

export interface DiscoveryView {
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  stageTitle: string;
  visibleRootName: string;
  visibleClue: string;
  visiblePurity: string;
  visibleConstitution: string;
  visibleBloodline: string;
  visibleTalent: string;
  canPerformRitual: boolean;
}

/**
 * Deterministic string-to-32bit hash and Mulberry32 PRNG (Server-Authoritative simulation)
 */
export function hashSeed(seedStr: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONSTITUTIONS = [
  { name: 'Tiên Thiên Đạo Thể', effect: '+35% Tốc độ lĩnh ngộ Công Pháp & +15% Tỷ lệ Đột Phá' },
  { name: 'Hoang Cổ Bá Thể', effect: '+45% Sinh lực tối đa & Phản chấn 20% sát thương cận chiến' },
  { name: 'Kiếm Tâm Thông Minh', effect: '+40% Sát thương Kiếm Thuật & Xuyên giáp hộ thể' },
  { name: 'Lôi Linh Tiên Thể', effect: 'Hấp thụ 35% sát thương Thiên Kiếp Lôi thành Linh Lực' },
  { name: 'Dược Linh Thánh Thể', effect: '+50% Hiệu quả Đan Dược & Miễn nhiễm đan độc' },
  { name: 'Hỗn Độn Ma Khu', effect: 'Chuyển hóa Sát Khí và Tâm Ma thành Bạo Kích (+30%)' },
  { name: 'Bách Chiết Bất Khuất Phàm Khu', effect: 'Mỗi lần Đột Phá thất bại tăng vĩnh viễn 15% Căn Cơ & Ngộ Tính' },
];

const BLOODLINES = [
  { name: 'Nhân Hoàng Cổ Huyết', effect: 'Tăng uy áp chính đạo, giảm 25% nguy cơ Tẩu Hỏa Nhập Ma' },
  { name: 'Thanh Long Di Mạch', effect: 'Hồi phục sinh lực và linh lực liên tục mỗi giây trong chiến đấu' },
  { name: 'Chu Tước Chân Huyết', effect: 'Khi sinh lực xuống dưới 25%, kích hoạt Niết Bàn Hộ Thuẫn' },
  { name: 'Bạch Hổ Sát Phạt Huyết', effect: 'Đòn đánh thứ 3 trong chuỗi liên kích gây sát thương chuẩn' },
  { name: 'Cổ Thần Tinh Huyết', effect: 'Tăng 30% Kháng Thiên Kiếp và sức chịu đựng nhục thân' },
];

const TALENTS = [
  'Thần Thức Nhạy Bén (Phát hiện cơ duyên ẩn trong bán kính rộng)',
  'Đan Đạo Kỳ Tài (Luyện đan không bao giờ nổ lò, dễ ra đan văn)',
  'Trận Đạo Thông Huyền (Bố trận tức thì không cần trận kỳ)',
  'Nghịch Thiên Cải Mệnh (Khi gặp tử kiếp có 35% cơ hội lĩnh ngộ thần thông mới)',
  'Kiếm Đạo Độc Tôn (Mỗi cảnh giới mở khóa thêm 1 luồng Bản Mệnh Kiếm Khí)',
];

/**
 * Generates server-authoritative hidden character destiny from a Fate Seed.
 * Implements Section 3.1 & Section 11 (Balancing Principles: lower roots get higher Comprehension/Fortune compensation).
 */
export function generateHiddenCharacter(fateSeed: string): HiddenCharacterData {
  const cleanSeed = fateSeed.trim() || 'VAN-DAO-TIEN-DO-DEFAULT';
  const numericSeed = hashSeed(cleanSeed);
  const rng = createSeededRng(numericSeed);

  // Weighted table for Spiritual Roots
  const roll = rng();
  let rootId: SpiritualRootId = 'kim';
  if (roll < 0.08) rootId = 'phe_linh_can';
  else if (roll < 0.15) rootId = 'vo_linh_can';
  else if (roll < 0.27) rootId = 'ngu_hanh';
  else if (roll < 0.37) rootId = 'kim';
  else if (roll < 0.47) rootId = 'moc';
  else if (roll < 0.57) rootId = 'thuy';
  else if (roll < 0.67) rootId = 'hoa';
  else if (roll < 0.76) rootId = 'tho';
  else if (roll < 0.82) rootId = 'phong';
  else if (roll < 0.87) rootId = 'bang';
  else if (roll < 0.92) rootId = 'loi';
  else if (roll < 0.95) rootId = 'am';
  else if (roll < 0.97) rootId = 'duong';
  else if (roll < 0.985) rootId = 'di_linh_can';
  else if (roll < 0.995) rootId = 'thien_linh_can';
  else rootId = 'hon_don';

  const spiritualRoot = SPIRITUAL_ROOTS[rootId];
  const rootPurity = Math.round(52 + rng() * 48);

  const constitutionObj = CONSTITUTIONS[Math.floor(rng() * CONSTITUTIONS.length)];
  const bloodlineObj = BLOODLINES[Math.floor(rng() * BLOODLINES.length)];
  const innateTalent = TALENTS[Math.floor(rng() * TALENTS.length)];

  // Section 11 Balancing: If player rolls Phế Linh Căn or Vô Linh Căn, Server Destiny Engine compensates
  // with higher hidden Comprehension, Fortune, and Pity boost so they have a true "Phàm Nhân Tu Tiên" path.
  const isUnderdog = rootId === 'phe_linh_can' || rootId === 'vo_linh_can' || rootId === 'ngu_hanh';
  const baseComp = Math.round(75 + rng() * 65);
  const baseFortune = Math.round(75 + rng() * 65);

  const comprehension = Math.round(baseComp * spiritualRoot.comprehensionBonus + (isUnderdog ? 25 : 0));
  const fortune = baseFortune + (isUnderdog ? 35 : 0);

  return {
    fateSeed: cleanSeed,
    numericSeed,
    spiritualRoot,
    rootPurity,
    hiddenConstitution: constitutionObj.name,
    constitutionEffect: constitutionObj.effect,
    hiddenBloodline: bloodlineObj.name,
    bloodlineEffect: bloodlineObj.effect,
    innateTalent,
    comprehension,
    fortune,
    karma: 0,
    mentalState: 85,
    foundationStability: 80,
    pityCounter: isUnderdog ? 3 : 0,
  };
}

/**
 * Progressive Self-Discovery (Section 3.2):
 * Masks hidden spiritual root & talent data until the player reaches the corresponding cultivation stage
 * or discovers ancient clues/artifacts in the world.
 */
export function getProgressiveDiscovery(
  char: HiddenCharacterData,
  realmIndex: number,
  subLevel: number,
  bonusClues: number = 0
): DiscoveryView {
  // Calculate effective discovery tier (0 to 5)
  let rawStage = 0;
  if (realmIndex === 0) {
    rawStage = 0;
  } else if (realmIndex === 1) {
    if (subLevel <= 3) rawStage = 1;
    else if (subLevel <= 6) rawStage = 2;
    else if (subLevel <= 9) rawStage = 3;
    else rawStage = 4; // Luyện Khí Tầng 10-12 (Đại viên mãn)
  } else {
    rawStage = 5; // Trúc Cơ trở lên
  }

  const effectiveStage = Math.min(5, rawStage + Math.floor(bonusClues / 2)) as 0 | 1 | 2 | 3 | 4 | 5;

  if (effectiveStage === 0) {
    return {
      stage: 0,
      stageTitle: 'Phàm Thai Mông Muội (Chưa Khai Mở)',
      visibleRootName: 'Ẩn Số Thiên Cơ (Chưa Biết)',
      visibleClue: 'Kinh mạch phàm nhân chưa từng dẫn khí. Hãy thổ nạp linh khí hoặc tìm bậc cao nhân/cổ bia để cảm ứng.',
      visiblePurity: '???',
      visibleConstitution: 'Ẩn (Cần đạt Trúc Cơ hoặc Cơ Duyên)',
      visibleBloodline: 'Ẩn (Cần đạt Trúc Cơ hoặc Cơ Duyên)',
      visibleTalent: 'Ẩn (Tự khám phá qua hành trình tu luyện)',
      canPerformRitual: false,
    };
  }

  if (effectiveStage === 1) {
    return {
      stage: 1,
      stageTitle: 'Sơ Cảm Linh Khí (Luyện Khí Sơ Kỳ)',
      visibleRootName: 'Dị Tượng Mơ Hồ',
      visibleClue: char.spiritualRoot.vagueSensation,
      visiblePurity: 'Chưa rõ độ thuần khiết',
      visibleConstitution: 'Ẩn (Mở khóa ở Trúc Cơ)',
      visibleBloodline: 'Ẩn (Mở khóa ở Trúc Cơ)',
      visibleTalent: 'Ẩn',
      canPerformRitual: false,
    };
  }

  if (effectiveStage === 2) {
    return {
      stage: 2,
      stageTitle: 'Tương Hợp Thuộc Tính (Luyện Khí Trung Kỳ)',
      visibleRootName: `Linh Khí Hệ [${char.spiritualRoot.elements.join(' · ')}]`,
      visibleClue: char.spiritualRoot.elementHint,
      visiblePurity: 'Ước tính Sơ bộ',
      visibleConstitution: 'Ẩn (Mở khóa ở Trúc Cơ)',
      visibleBloodline: 'Ẩn (Mở khóa ở Trúc Cơ)',
      visibleTalent: 'Đang dần thức tỉnh...',
      canPerformRitual: false,
    };
  }

  if (effectiveStage === 3) {
    return {
      stage: 3,
      stageTitle: 'Chạm Ngưỡng Trắc Linh (Luyện Khí Hậu Kỳ)',
      visibleRootName: `Nhánh ${char.spiritualRoot.category} (${char.spiritualRoot.elements.join('/')})`,
      visibleClue: char.spiritualRoot.partialStructure,
      visiblePurity: `Khoảng ${Math.floor(char.rootPurity / 10) * 10}%+`,
      visibleConstitution: 'Có dấu hiệu thức tỉnh khi đột phá Trúc Cơ',
      visibleBloodline: 'Huyết mạch đang cộng hưởng nhẹ',
      visibleTalent: char.innateTalent,
      canPerformRitual: true,
    };
  }

  if (effectiveStage === 4) {
    return {
      stage: 4,
      stageTitle: 'Giám Định Linh Căn (Luyện Khí Đại Viên Mãn)',
      visibleRootName: char.spiritualRoot.name,
      visibleClue: char.spiritualRoot.description,
      visiblePurity: `${char.rootPurity}% Thuần Khiết`,
      visibleConstitution: 'Sắp thức tỉnh (Đột phá Trúc Cơ để mở khóa hoàn toàn)',
      visibleBloodline: 'Sắp thức tỉnh (Đột phá Trúc Cơ để mở khóa hoàn toàn)',
      visibleTalent: char.innateTalent,
      canPerformRitual: true,
    };
  }

  return {
    stage: 5,
    stageTitle: 'Đạo Cơ Minh Định (Trúc Cơ Cảnh Trở Lên)',
    visibleRootName: char.spiritualRoot.name,
    visibleClue: `${char.spiritualRoot.description} · Hướng tu luyện tối ưu: ${char.spiritualRoot.recommendedPath}`,
    visiblePurity: `${char.rootPurity}% Thuần Khiết`,
    visibleConstitution: `${char.hiddenConstitution} (${char.constitutionEffect})`,
    visibleBloodline: `${char.hiddenBloodline} (${char.bloodlineEffect})`,
    visibleTalent: char.innateTalent,
    canPerformRitual: true,
  };
}

export interface DestinyEventOutcome {
  id: string;
  title: string;
  rarity: 'Phổ Biến' | 'Kỳ Ngộ' | 'Thiên Địa Dị Tượng' | 'Cơ Duyên Nghịch Thiên';
  description: string;
  choices: {
    label: string;
    alignment: 'Chính Đạo' | 'Thận Trọng' | 'Bá Đạo / Nghịch Thiên';
    qiDelta: number;
    foundationDelta: number;
    mentalDelta: number;
    karmaDelta: number;
    clueBonus: number;
    pillReward: number;
    outcomeText: string;
  }[];
}

export const DESTINY_EVENTS: DestinyEventOutcome[] = [
  {
    id: 'ancient_cave',
    title: 'Phát Hiện Động Phủ Cổ Tán Tu',
    rarity: 'Kỳ Ngộ',
    description:
      'Dưới vách đá sương mù hiện ra một thạch thất phủ đầy rêu xanh có cấm chế tàn khuyết. Bên trong có một bộ hài cốt ngồi xếp bằng cùng một chiếc bình ngọc và tàn quyển Trắc Linh Quyết.',
    choices: [
      {
        label: 'Dập đầu bái lạy tiền bối rồi mới thu nhận di vật',
        alignment: 'Chính Đạo',
        qiDelta: 75,
        foundationDelta: 10,
        mentalDelta: 12,
        karmaDelta: 15,
        clueBonus: 2,
        pillReward: 1,
        outcomeText: 'Tàn hồn tiền bối mỉm cười tán thưởng, truyền lại một tia cảm ngộ Linh Căn và 1 viên Trúc Cơ Linh Đan!',
      },
      {
        label: 'Dùng thần thức dò xét bẫy rập trước khi mở bình ngọc',
        alignment: 'Thận Trọng',
        qiDelta: 55,
        foundationDelta: 15,
        mentalDelta: 8,
        karmaDelta: 5,
        clueBonus: 1,
        pillReward: 1,
        outcomeText: 'Nhờ cẩn trọng như Hàn Lập, bạn hóa giải một luồng độc chướng ẩn trong bình ngọc và thu hoạch trọn vẹn linh đan.',
      },
      {
        label: 'Cưỡng ép phá nát cấm chế, đoạt toàn bộ linh thạch',
        alignment: 'Bá Đạo / Nghịch Thiên',
        qiDelta: 120,
        foundationDelta: -5,
        mentalDelta: -8,
        karmaDelta: -15,
        clueBonus: 1,
        pillReward: 2,
        outcomeText: 'Cấm chế nổ tung làm kinh mạch chấn động nhẹ, nhưng bạn thu được lượng lớn linh lực cùng 2 viên Huyết Linh Đan!',
      },
    ],
  },
  {
    id: 'immortal_guidance',
    title: 'Đại Năng Ẩn Thế Chỉ Điểm',
    rarity: 'Thiên Địa Dị Tượng',
    description:
      'Một lão giả mặc áo vải thô đang câu cá bên suối linh tuyền bỗng ngoảnh lại nhìn bạn, ánh mắt thấu suốt cả kinh mạch và vận mệnh ẩn giấu.',
    choices: [
      {
        label: 'Thành tâm thỉnh giáo con đường tu luyện bản thân',
        alignment: 'Chính Đạo',
        qiDelta: 90,
        foundationDelta: 18,
        mentalDelta: 20,
        karmaDelta: 10,
        clueBonus: 3,
        pillReward: 1,
        outcomeText: 'Lão giả điểm nhẹ một ngón tay vào mi tâm bạn, giúp bạn nhìn rõ bản chất Linh Căn và củng cố Đạo Tâm vững chắc!',
      },
      {
        label: 'Dâng tặng linh thảo vừa thu thập để kết thiện duyên',
        alignment: 'Thận Trọng',
        qiDelta: 70,
        foundationDelta: 12,
        mentalDelta: 15,
        karmaDelta: 20,
        clueBonus: 2,
        pillReward: 2,
        outcomeText: 'Lão giả gật đầu nhận lễ, tặng lại cho bạn hai viên Định Thần Đan giúp chống lại Tâm Ma khi Độ Kiếp.',
      },
    ],
  },
  {
    id: 'bloodline_awakening',
    title: 'Thiên Địa Dị Tượng · Cổ Bi Cộng Hưởng',
    rarity: 'Cơ Duyên Nghịch Thiên',
    description:
      'Trắc Linh Cổ Bi giữa sườn núi bỗng phát ra tiếng ngân vang thời viễn cổ, dẫn động huyết dịch và linh căn sâu thẳm trong cơ thể bạn!',
    choices: [
      {
        label: 'Đặt tay lên Cổ Bi, toàn lực vận chuyển công pháp cộng hưởng',
        alignment: 'Bá Đạo / Nghịch Thiên',
        qiDelta: 140,
        foundationDelta: 20,
        mentalDelta: 15,
        karmaDelta: 10,
        clueBonus: 4,
        pillReward: 2,
        outcomeText: 'Cổ Bi bùng sáng! Toàn bộ bí mật Linh Căn, Thể Chất và Huyết Mạch của bạn được khai mở vượt giai đoạn!',
      },
      {
        label: 'Ngồi thiền cạnh Cổ Bi hấp thu đạo vận tản ra',
        alignment: 'Thận Trọng',
        qiDelta: 95,
        foundationDelta: 22,
        mentalDelta: 18,
        karmaDelta: 8,
        clueBonus: 2,
        pillReward: 1,
        outcomeText: 'Đạo vận ôn nhu thấm vào tứ chi bách hài, căn cơ ổn định tuyệt đối chuẩn bị cho kỳ Độ Kiếp sắp tới.',
      },
    ],
  },
  {
    id: 'mysterious_npc_rescue',
    title: 'Giải Cứu Tu Sĩ Bí Ẩn Đang Trọng Thương',
    rarity: 'Kỳ Ngộ',
    description:
      'Một nữ tu sĩ đeo mặt nạ bạc đang bị huyết độc phản phệ bên gốc cổ tùng, trên người mang theo lệnh bài nội môn của bậc đại tông.',
    choices: [
      {
        label: 'Tiêu hao linh lực và đan dược cứu chữa không màng báo đáp',
        alignment: 'Chính Đạo',
        qiDelta: 60,
        foundationDelta: 15,
        mentalDelta: 22,
        karmaDelta: 30,
        clueBonus: 2,
        pillReward: 2,
        outcomeText: 'Nữ tu sĩ cảm kích trao lại mật tịch truyền thừa cùng hai viên Cửu Chuyển Hộ Mạch Đan trước khi rời đi!',
      },
      {
        label: 'Đứng từ xa bố trận cảnh giới yêu thú giúp cô ấy tự điều tức',
        alignment: 'Thận Trọng',
        qiDelta: 75,
        foundationDelta: 12,
        mentalDelta: 12,
        karmaDelta: 15,
        clueBonus: 1,
        pillReward: 1,
        outcomeText: 'Sau khi ổn định thương thế, cô ấy ném lại cho bạn một cuốn tâm đắc tu luyện và một bình linh đan.',
      },
    ],
  },
];

/**
 * Evaluates which Destiny Encounter triggers based on Server Fate Seed, Fortune, Karma, and Pity Counter.
 */
export function evaluateDestinyEncounter(
  char: HiddenCharacterData,
  encounterCount: number
): DestinyEventOutcome {
  const combinedSeed = hashSeed(`${char.fateSeed}-ENC-${encounterCount}-${char.pityCounter}-${char.karma}`);
  const rng = createSeededRng(combinedSeed);
  const fortuneBonus = (char.fortune - 80) * 0.002 + char.pityCounter * 0.08 + Math.max(0, char.karma) * 0.002;
  const roll = rng() + fortuneBonus;

  if (roll > 0.92) {
    return DESTINY_EVENTS[2]; // Cơ Duyên Nghịch Thiên
  }
  if (roll > 0.65) {
    return DESTINY_EVENTS[1]; // Đại Năng Chỉ Điểm
  }
  if (roll > 0.35) {
    return DESTINY_EVENTS[3]; // Giải Cứu Tu Sĩ Bí Ẩn
  }
  return DESTINY_EVENTS[0]; // Động Phủ Cổ
}

export interface BreakthroughInput {
  realmIndex: number;
  subLevel: number;
  currentQi: number;
  requiredQi: number;
  foundationStability: number; // 0-100
  mentalState: number; // 0-100
  pillsUsed: number; // 0-3
  locationBonus: number; // 0 to 0.20 (Linh Mạch / Động Phủ)
  tribulationSurvivalRatio: number; // 0.0 to 1.0 (from active gameplay dodging/parrying lightning)
  spiritualRoot: SpiritualRootSpec;
  fateSeed: string;
}

export interface BreakthroughResult {
  outcome: 'SUCCESS' | 'MUTATION_BLESSING' | 'FAILURE_QI_DEVIATION';
  finalSuccessProbability: number;
  newRealmIndex: number;
  newSubLevel: number;
  hpPenaltyRatio: number;
  qiRetainedRatio: number;
  mutationBuffName?: string;
  narrativeSummary: string;
}

/**
 * Breakthrough & Tribulation Resolution System (Section 5):
 * Not a simple button press: combines Qi accumulation, foundation stability, mental state,
 * pills prepared, spiritual vein location, and real-time tribulation lightning survival.
 */
export function resolveBreakthrough(input: BreakthroughInput): BreakthroughResult {
  const currentRealm = CULTIVATION_REALMS[input.realmIndex] || CULTIVATION_REALMS[0];
  const isMajorRealmBreakthrough = input.subLevel >= currentRealm.subLevels;

  // Minor sub-level advancement within Luyện Khí / Trúc Cơ / etc.
  if (!isMajorRealmBreakthrough) {
    return {
      outcome: 'SUCCESS',
      finalSuccessProbability: 0.98,
      newRealmIndex: input.realmIndex,
      newSubLevel: input.subLevel + 1,
      hpPenaltyRatio: 0,
      qiRetainedRatio: 0.15,
      narrativeSummary: `Chân nguyên hội tụ viên mãn, đột phá thành công lên ${currentRealm.name} tầng ${input.subLevel + 1}!`,
    };
  }

  // Major Realm Breakthrough calculation
  const baseChance = currentRealm.baseSuccessChance;
  const foundationMod = (input.foundationStability - 60) * 0.0035;
  const mentalMod = (input.mentalState - 60) * 0.0035;
  const pillMod = input.pillsUsed * 0.11;
  const tribulationMod = (input.tribulationSurvivalRatio - 0.5) * 0.35;

  const finalProb = Math.max(
    0.1,
    Math.min(0.98, baseChance + foundationMod + mentalMod + pillMod + input.locationBonus + tribulationMod)
  );

  const rng = createSeededRng(hashSeed(`${input.fateSeed}-BREAK-${input.realmIndex}-${input.subLevel}-${input.pillsUsed}`));
  const roll = rng();

  const nextRealmIdx = Math.min(CULTIVATION_REALMS.length - 1, input.realmIndex + 1);
  const nextRealm = CULTIVATION_REALMS[nextRealmIdx];

  // Check for rare Mutation / Biến Dị Đạo Cơ when surviving tribulation with high mental state
  if (roll <= finalProb && input.tribulationSurvivalRatio >= 0.8 && input.mentalState >= 80 && roll < 0.25) {
    return {
      outcome: 'MUTATION_BLESSING',
      finalSuccessProbability: finalProb,
      newRealmIndex: nextRealmIdx,
      newSubLevel: 1,
      hpPenaltyRatio: 0,
      qiRetainedRatio: 0.35,
      mutationBuffName: 'Lôi Kiếp Đạo Cơ Biến Dị (+25% Toàn Thuộc Tính)',
      narrativeSummary: `Nghịch thiên vượt kiếp! Bạn hấp thu tàn dư Thiên Kiếp Lôi dung nhập vào Đan Điền, tấn thăng ${nextRealm.name} kèm Đạo Cơ Biến Dị!`,
    };
  }

  if (roll <= finalProb) {
    return {
      outcome: 'SUCCESS',
      finalSuccessProbability: finalProb,
      newRealmIndex: nextRealmIdx,
      newSubLevel: 1,
      hpPenaltyRatio: 0,
      qiRetainedRatio: 0.2,
      narrativeSummary: `Vượt qua Thiên Kiếp và Tâm Ma khảo nghiệm, chính thức bước vào cảnh giới ${nextRealm.name}!`,
    };
  }

  // Failure / Tẩu Hỏa Nhập Ma (Qi Deviation) — does not brick the character, increases comprehension/pity!
  return {
    outcome: 'FAILURE_QI_DEVIATION',
    finalSuccessProbability: finalProb,
    newRealmIndex: input.realmIndex,
    newSubLevel: input.subLevel,
    hpPenaltyRatio: 0.35,
    qiRetainedRatio: 0.45,
    narrativeSummary:
      'Đạo tâm dao động trước uy lực Thiên Kiếp khiến linh lực nghịch chuyển (Tẩu Hỏa Nhập Ma nhẹ). Tuy chưa thể phá cảnh nhưng kinh mạch được tôi luyện dẻo dai hơn (+15% Căn Cơ cho lần sau)!',
  };
}

/**
 * 2.5D Isometric Projection Helpers
 */
export function worldToIso(wx: number, wy: number, wz: number = 0): { isoX: number; isoY: number } {
  // Standard 2:1 isometric projection
  const isoX = wx - wy;
  const isoY = (wx + wy) * 0.5 - wz;
  return { isoX, isoY };
}

export function isoToWorld(isoX: number, isoY: number): { wx: number; wy: number } {
  const wx = (isoX + isoY * 2) * 0.5;
  const wy = (isoY * 2 - isoX) * 0.5;
  return { wx, wy };
}

export interface CombatSkillSpec {
  id: string;
  key: string;
  name: string;
  school: 'Kiếm Thuật' | 'Hỏa Pháp' | 'Lôi Pháp' | 'Băng Pháp' | 'Trận Pháp' | 'Thần Thông Cấm Thuật';
  damageType: string;
  cooldown: number;
  qiCost: number;
  range: number;
  aoeRadius: number;
  baseDamage: number;
  color: string;
  description: string;
}

export const COMBAT_SKILLS: CombatSkillSpec[] = [
  {
    id: 'sword_combo',
    key: 'J / Click',
    name: 'Thanh Nguyên Kiếm Quyết',
    school: 'Kiếm Thuật',
    damageType: 'Kiếm Khí Vật Lý & Linh Lực',
    cooldown: 0.28,
    qiCost: 0,
    range: 145,
    aoeRadius: 65,
    baseDamage: 28,
    color: '#f5c542',
    description: 'Tam liên trảm bằng kiếm khí sắc bén, mỗi đòn trúng đích hồi phục 6 điểm Linh Lực.',
  },
  {
    id: 'fire_lotus',
    key: 'K',
    name: 'Phần Thiên Liên Hỏa',
    school: 'Hỏa Pháp',
    damageType: 'Chân Hỏa Diện Rộng (AOE)',
    cooldown: 3.5,
    qiCost: 22,
    range: 220,
    aoeRadius: 120,
    baseDamage: 68,
    color: '#f97316',
    description: 'Phóng thích Hỏa Liên bùng nổ đẩy lùi yêu thú xung quanh và thiêu đốt kinh mạch.',
  },
  {
    id: 'frost_array',
    key: 'L',
    name: 'Huyền Băng Bát Quái Trận',
    school: 'Băng Pháp',
    damageType: 'Hàn Băng Khống Chế & Làm Chậm',
    cooldown: 5.0,
    qiCost: 30,
    range: 240,
    aoeRadius: 150,
    baseDamage: 54,
    color: '#38bdf8',
    description: 'Triệu hồi trận đồ băng giá dưới chân mục tiêu, đóng băng tốc độ di chuyển của kẻ địch.',
  },
  {
    id: 'thunder_nine',
    key: 'U',
    name: 'Cửu Tiêu Thần Lôi Dẫn',
    school: 'Lôi Pháp',
    damageType: 'Thiên Lôi Phá Giáp',
    cooldown: 6.5,
    qiCost: 40,
    range: 280,
    aoeRadius: 135,
    baseDamage: 95,
    color: '#a855f7',
    description: 'Dẫn động sấm sét Cửu Thiên giáng thẳng xuống mục tiêu, gây choáng và phá vỡ hộ thuẫn Boss.',
  },
  {
    id: 'myriad_swords_ult',
    key: 'I',
    name: 'Vạn Kiếm Quy Tông (Tuyệt Kỹ)',
    school: 'Thần Thông Cấm Thuật',
    damageType: 'Tuyệt Kỹ Trấn Phái Toàn Màn Hình',
    cooldown: 12.0,
    qiCost: 65,
    range: 380,
    aoeRadius: 280,
    baseDamage: 185,
    color: '#22d3ee',
    description: 'Triệu hồi hàng chục thanh phi kiếm từ hư không trút xuống như mưa hủy diệt toàn bộ kẻ địch trong tầm mắt.',
  },
];

export function calculateSkillDamage(
  skill: CombatSkillSpec,
  char: HiddenCharacterData,
  realmIndex: number,
  subLevel: number
): number {
  const realmMultiplier = 1 + realmIndex * 0.65 + subLevel * 0.08;
  const rootBonus = char.spiritualRoot.combatMultiplier;
  // Elemental resonance bonus if spiritual root matches skill school
  let synergy = 1.0;
  if (skill.school === 'Kiếm Thuật' && (char.spiritualRoot.id === 'kim' || char.spiritualRoot.id === 'vo_linh_can')) {
    synergy = 1.25;
  } else if (skill.school === 'Hỏa Pháp' && (char.spiritualRoot.id === 'hoa' || char.spiritualRoot.id === 'duong')) {
    synergy = 1.25;
  } else if (skill.school === 'Lôi Pháp' && (char.spiritualRoot.id === 'loi' || char.spiritualRoot.id === 'hon_don')) {
    synergy = 1.3;
  } else if (skill.school === 'Băng Pháp' && (char.spiritualRoot.id === 'bang' || char.spiritualRoot.id === 'thuy')) {
    synergy = 1.25;
  }
  return Math.round(skill.baseDamage * realmMultiplier * rootBonus * synergy);
}
