export interface GddChapterSpec {
  id: number;
  title: string;
  category: 'Cốt Lõi & Vận Mệnh' | 'Tu Luyện & Chiến Đấu' | 'Thế Giới & Cộng Đồng' | 'Kỹ Thuật & Vận Hành';
  summary: string;
  purpose: string;
  gameplayFlow: string[];
  operatingRules: string[];
  inputData: string[];
  outputData: string[];
  edgeCases: string[];
  systemInteractions: string[];
  technicalRisks: string[];
  testingStrategy: string[];
}

export const GDD_CHAPTERS: GddChapterSpec[] = [
  {
    id: 1,
    title: '01. Game Vision & Core Pillars (Tầm Nhìn & Trụ Cột Thiết Kế)',
    category: 'Cốt Lõi & Vận Mệnh',
    summary:
      'Xây dựng thế giới MMORPG 2.5D tu tiên thực thụ lấy cảm hứng từ Phàm Nhân Tu Tiên, nơi mỗi tu sĩ bước đi trên một Đạo Lộ độc bản không ai biết trước vận mệnh.',
    purpose:
      'Định hình kim chỉ nam cho toàn bộ dự án VẠN ĐẠO TIÊN ĐỒ: xóa bỏ lối mòn MMORPG cày cấp đổi tên thành cảnh giới, thay bằng trải nghiệm tự khám phá bản thân, tranh đoạt thiên cơ và chiến đấu hành động thời gian thực.',
    gameplayFlow: [
      'Người chơi khởi đầu là một Phàm Nhân mông muội bước vào thế giới rộng lớn không có bảng chỉ số tư chất lộ thiên.',
      'Thông qua thổ nạp linh khí, giao chiến yêu thú, tầm bảo động phủ và tương tác cao nhân để tự khám phá Linh Căn, Thể Chất và Con Đường Đạo.',
      'Gia nhập hoặc tự lập Tông Môn, tham gia nền kinh tế Luyện Đan - Luyện Khí - Đấu Giá và vượt Cửu Trọng Thiên Kiếp để Phi Thăng Tiên Giới.',
    ],
    operatingRules: [
      'Trụ cột 1 — Vận Mệnh Ẩn (Extreme Destiny Randomness): Không công khai tư chất khi tạo nhân vật; mọi thiên phú được hé lộ tiệm tiến.',
      'Trụ cột 2 — Thế Giới Sống Động (Living Persistent World): NPC có lịch trình, ân oán và tu luyện riêng; thiên địa dị tượng ảnh hưởng toàn vùng.',
      'Trụ cột 3 — Tự Do Đạo Lộ (Classless Cultivation): Không khóa class; Phế Linh Căn vẫn có thể thành Đại Năng nhờ Thể Tu, Đan Đạo, Trận Pháp hoặc Cổ Bảo.',
      'Trụ cột 4 — Hành Động Thực Chiến (Skill-Based 2.5D Action): Thắng bại quyết định bởi kỹ năng né tránh, phá chiêu (Parry), phối hợp ngũ hành và địa hình.',
    ],
    inputData: [
      'Account_ID, Server_Epoch_State, World_Seed, Player_Behavior_Telemetry.',
    ],
    outputData: [
      'Trải nghiệm hành trình tu tiên cá nhân hóa (Unique Dao Chronicle Log) và trạng thái tiến hóa của thế giới (World Era State).',
    ],
    edgeCases: [
      'Người chơi muốn reroll liên tục để tìm Thiên Linh Căn: Hệ thống ẩn hoàn toàn thông tin Linh Căn cho tới Luyện Khí trung/hậu kỳ khiến việc spam tạo lại nhân vật ở phút đầu vô nghĩa.',
      'Người chơi thích độc hành (Solo): Cung cấp đầy đủ con đường Tán Tu, Động Phủ ẩn và cơ duyên cá nhân không ép buộc vào bang hội lớn.',
    ],
    systemInteractions: [
      'Định hướng trực tiếp cho Hidden Spiritual Root System (04), Destiny Engine (05), Cultivation Progression (06) và Non-P2W Economy (15, 23).',
    ],
    technicalRisks: [
      'Độ phức tạp cao khi đồng bộ trạng thái thế giới mở (Persistent World) với hàng nghìn người chơi cùng lúc.',
    ],
    testingStrategy: [
      'Playtest mù (Blind Playtest) với 500 người chơi thử nghiệm trong 14 ngày để đo chỉ số bất ngờ (Discovery Delight Score) và tỷ lệ giữ chân ngày 7/30.',
    ],
  },
  {
    id: 2,
    title: '02. Gameplay Loop (Vòng Lặp Trải Nghiệm Cốt Lõi)',
    category: 'Cốt Lõi & Vận Mệnh',
    summary:
      'Kết hợp nhịp nhàng giữa Vòng lặp Phút (Chiến đấu - Thổ nạp - Tầm bảo), Vòng lặp Ngày (Tu luyện - Luyện Đan - Cơ duyên) và Vòng lặp Đại Cảnh Giới (Chuẩn bị căn cơ - Độ Kiếp - Mở khóa bí mật bản thân).',
    purpose:
      'Đảm bảo người chơi luôn có mục tiêu ngắn hạn kịch tính và mục tiêu dài hạn sâu sắc mà không rơi vào cảm giác làm nhiệm vụ lặp đi lặp lại hay treo máy auto-play.',
    gameplayFlow: [
      'Vòng lặp 30 giây – 5 phút (Micro Loop): Di chuyển 2.5D -> Giao chiến yêu thú/tu sĩ bằng combo kiếm pháp & pháp thuật -> Thu thập linh thảo/nội đan -> Thổ nạp linh khí tại linh mạch.',
      'Vòng lặp 1 – 3 giờ (Meso Loop): Luyện chế đan dược/pháp bảo -> Khám phá bí cảnh/động phủ -> Kích hoạt Cơ Duyên ngẫu nhiên -> Giải mã từng phần Linh Căn ẩn.',
      'Vòng lặp Tuần / Cảnh Giới (Macro Loop): Củng cố Căn Cơ & Tâm Cảnh -> Tìm địa điểm Linh Mạch -> Vượt Thiên Kiếp đột phá đại cảnh giới -> Thức tỉnh Huyết Mạch & tranh đoạt tài nguyên Tông Môn.',
    ],
    operatingRules: [
      'Không có nút Auto-Combat hay Auto-Pathing làm thay toàn bộ hành trình.',
      'Mỗi hành động tu luyện, chiến đấu, hái thuốc đều có xác suất dẫn động Destiny Engine tạo ra biến cố bất ngờ.',
      'Tích lũy Linh Lực chỉ là điều kiện cần; ổn định Căn Cơ và Tâm Cảnh qua trải nghiệm thực tế mới là điều kiện đủ để phá cảnh.',
    ],
    inputData: [
      'Player_Action_Stream (Combat, Gathering, Meditation, Exploration), Current_Qi, Mental_State, Location_Vein_Tier.',
    ],
    outputData: [
      'Qi_Gain, Item_Drops, Root_Discovery_Progress, Destiny_Event_Triggers, Breakthrough_Readiness.',
    ],
    edgeCases: [
      'Người chơi ít thời gian online (Casual): Hệ thống Bế Quan Động Phủ chuyển hóa một phần linh khí tĩnh, nhưng đột phá và cơ duyên bắt buộc phải tự tay trải nghiệm.',
      'Cày cuốc quá mức tại một bãi quái: Linh khí khu vực suy giảm tạm thời (Local Qi Depletion), khuyến khích di chuyển khám phá vùng đất mới.',
    ],
    systemInteractions: [
      'Kết nối chặt chẽ giữa Combat System (08), World Design (11), Economy (15) và Breakthrough System (07).',
    ],
    technicalRisks: [
      'Tần suất gửi gói tin hành động liên tục lên Authoritative Server khi vừa chiến đấu vừa tính toán xác suất cơ duyên.',
    ],
    testingStrategy: [
      'Mô phỏng 10.000 giờ chơi bằng Bot AI đa chiến thuật (Kiếm Tu, Đan Sư, Tán Tu) để kiểm tra không có điểm nghẽn tài nguyên (Resource Bottleneck).',
    ],
  },
  {
    id: 3,
    title: '03. Character Creation (Khởi Tạo Nhân Vật Phàm Nhân)',
    category: 'Cốt Lõi & Vận Mệnh',
    summary:
      'Khởi tạo diện mạo, xuất thân và gieo Hạt Giống Mệnh Cách (Fate Seed) phía Server mà không hiển thị bất kỳ bảng chọn Linh Căn hay điểm tiềm năng nào.',
    purpose:
      'Tạo sự nhập vai tuyệt đối của một phàm nhân bước chân vào con đường tu tiên: không ai được chọn sẵn làm thiên tài, mọi vận mệnh đều ẩn trong sương mù.',
    gameplayFlow: [
      'Người chơi tùy chỉnh ngoại hình 2.5D (Khuôn mặt, Kiểu tóc, Trang phục phàm nhân, Khí chất).',
      'Trả lời 3 câu hỏi Tâm Tính đầu đời (ví dụ: đối diện bất công, thái độ với trường sinh, lựa chọn giữa nghĩa khí và lợi ích).',
      'Server kết hợp câu trả lời với CSPRNG tạo ra `Fate_Seed` độc nhất và bộ thuộc tính ẩn, sau đó đưa nhân vật vào tân thủ thôn tương ứng với xuất thân.',
    ],
    operatingRules: [
      'Tuyệt đối không hiển thị Linh Căn, Ngộ Tính, Khí Vận, Thể Chất hay Huyết Mạch trên màn hình tạo nhân vật.',
      'Ba câu hỏi Tâm Tính chỉ định hướng nhẹ xu hưởng Tâm Cảnh và Nhân Quả ban đầu, không cho phép thao túng trực tiếp ra Thiên Linh Căn.',
      'Dữ liệu ẩn của nhân vật được mã hóa và lưu trữ hoàn toàn trên Database Server; Client chỉ nhận chuỗi mô tả cảm giác mơ hồ theo từng giai đoạn.',
    ],
    inputData: [
      'Appearance_Config, Origin_Region_Choice, 3_Mindset_Answers, Server_CSPRNG_Entropy.',
    ],
    outputData: [
      'Character_UUID, Encrypted_Hidden_Profile (Server-only), Public_Mortal_Profile (Client-visible).',
    ],
    edgeCases: [
      'Người chơi dùng công cụ đọc bộ nhớ (Memory Scanner) hoặc bắt gói tin (Packet Sniffer) lúc vừa tạo nhân vật: Server tuyệt đối không gửi trường `spiritual_root_id` hay `constitution_id` về Client cho tới khi nhân vật đạt điều kiện mở khóa.',
    ],
    systemInteractions: [
      'Cung cấp `Fate_Seed` và hồ sơ gốc cho Hidden Spiritual Root System (04) và Destiny & Fortune Engine (05).',
    ],
    technicalRisks: [
      'Rò rỉ thông tin qua hiệu ứng hình ảnh sớm nếu Client tải trước asset aura của Linh Căn.',
    ],
    testingStrategy: [
      'Kiểm thử bảo mật gói tin mạng (Wireshark/MITM) tại bước tạo nhân vật để xác nhận 0% dữ liệu Linh Căn bị rò rỉ về phía Client.',
    ],
  },
  {
    id: 4,
    title: '04. Hidden Spiritual Root System (Hệ Thống Linh Căn Ẩn & Tự Khám Phá)',
    category: 'Cốt Lõi & Vận Mệnh',
    summary:
      'Hệ thống 16+ loại Linh Căn ẩn hoàn toàn lúc khởi đầu, được người chơi tự khám phá qua 6 giai đoạn tu luyện từ Phàm Nhân đến Trúc Cơ thông qua nhiều con đường khác nhau.',
    purpose:
      'Biến quá trình tìm hiểu bản thân thành một hành trình trinh thám tu tiên hấp dẫn, đồng thời đảm bảo mọi loại Linh Căn (kể cả Vô Linh Căn và Phế Linh Căn) đều có lối đi riêng đầy tự hào.',
    gameplayFlow: [
      'Phàm Nhân: Hoàn toàn không có thông tin tư chất.',
      'Luyện Khí tầng 1–3: Khi ngồi thiền hoặc chiến đấu, xuất hiện dòng cảm nhận cơ thể bất thường (ví dụ: lòng bàn tay nóng rực, hơi thở mang sương giá, hoặc kinh mạch khó tụ khí nhưng gân cốt cực khỏe).',
      'Luyện Khí tầng 4–6: Phát hiện thuộc tính linh khí tương hợp qua hiệu ứng cộng hưởng môi trường.',
      'Luyện Khí tầng 7–9: Tiếp xúc với Trắc Linh Thạch, Cổ Thư hoặc Cao Nhân để biết cấu trúc sơ bộ.',
      'Luyện Khí Đại Viên Mãn (Tầng 10–12): Thực hiện Nghi Thức Trắc Linh Căn hoàn chỉnh, hé lộ tên chân chính và độ thuần khiết.',
      'Trúc Cơ trở lên: Mở khóa toàn bộ bí mật về Thể Chất Đặc Biệt, Huyết Mạch Thượng Cổ và Thiên Phú Ẩn.',
    ],
    operatingRules: [
      'Danh sách Linh Căn: Kim, Mộc, Thủy, Hỏa, Thổ, Phong, Lôi, Băng, Âm, Dương, Dị Linh Căn, Ngũ Hành Linh Căn, Thiên Linh Căn, Hỗn Độn Linh Căn, Vô Linh Căn, Phế Linh Căn.',
      'Quy tắc cân bằng (Section 11): Nhân vật sinh ra với Vô Linh Căn hoặc Phế Linh Căn tự động được Server bù đắp hệ số Ngộ Tính (+60% đến +85%), Sức Chịu Đựng Nhục Thân (+110%) và điểm Khí Vận/Bảo Hiểm Vận Đen cao hơn để tu luyện Thể Tu, Kiếm Võ hoặc Ngoại Vật Đạo.',
      'Đa con đường khám phá: Người chơi không bắt buộc làm chung 1 nhiệm vụ; có thể khám phá qua Tự Tu Luyện, Gặp Cao Nhân, Khám Phá Bí Cảnh, Đọc Cổ Thư, Dùng Pháp Bảo Trắc Linh hoặc Nhận Truyền Thừa.',
    ],
    inputData: [
      'Server_Hidden_Root_Record, Current_Realm, Current_SubLevel, Special_Discovery_Clues_Count, Equipped_Appraisal_Artifact.',
    ],
    outputData: [
      'Masked_Discovery_Payload (Stage 0..5), Unlocked_Elemental_Synergies, Visual_Aura_Shader_Params.',
    ],
    edgeCases: [
      'Người chơi tìm được Pháp Bảo Trắc Linh Căn Cấp Cao ngay ở Luyện Khí tầng 2: Hệ thống cho phép vượt cấp mở khóa sớm thêm 1–2 bậc thông tin nhưng pháp bảo sẽ hao tổn linh tính.',
      'Người chơi muốn tẩy hoặc biến dị Linh Căn: Có thể xảy ra thông qua Thiên Địa Linh Vật cực hiếm hoặc Biến Dị Đạo Cơ khi vượt Thiên Kiếp.',
    ],
    systemInteractions: [
      'Quyết định hệ số hấp thu linh khí trong Cultivation Progression (06), sát thương cộng hưởng trong Combat System (08) và điều kiện học công pháp trong Skill Tree (09).',
    ],
    technicalRisks: [
      'Đồng bộ hóa trạng thái hiển thị aura và hiệu ứng kỹ năng khi người chơi chuyển từ giai đoạn Ẩn sang giai đoạn Đã Khám Phá.',
    ],
    testingStrategy: [
      'Unit test toàn bộ 16 loại Linh Căn qua 6 mốc cảnh giới (`src/game/rules.test.ts`) và kiểm tra cân bằng DPS/Tốc độ phát triển giữa Thiên Linh Căn và Phế Linh Căn.',
    ],
  },
  {
    id: 5,
    title: '05. Destiny & Fortune Engine (Hệ Thống Cơ Duyên & Nhân Quả Động)',
    category: 'Cốt Lõi & Vận Mệnh',
    summary:
      'Bộ máy tính toán Cơ Duyên độc lập phía Server dựa trên 10 biến số động, tạo ra các kỳ ngộ có logic điều kiện kích hoạt, kiểm soát tần suất và cơ chế chống vận đen kéo dài.',
    purpose:
      'Tạo ra những khoảnh khắc kỳ ngộ có một không hai như trong tiểu thuyết tu tiên (rơi xuống vực gặp động phủ cổ, cứu NPC bí ẩn, ngộ đạo dưới mưa giông) mà không dùng xác suất ngẫu nhiên vô hồn.',
    gameplayFlow: [
      'Người chơi thực hiện các hành vi tự nhiên trong thế giới (khám phá vùng sương mù, chiến đấu, thổ nạp, hái thuốc, giúp đỡ NPC, đột phá).',
      'Server Destiny Engine âm thầm đánh giá vector 10 biến số: `Fate_Seed`, `Spiritual_Root`, `Talent_Potential`, `Comprehension`, `Karma`, `Fortune`, `Constitution`, `Mental_State`, `World_Events`, `Player_Choices`.',
      'Khi thỏa mãn ngưỡng điều kiện ẩn, hệ thống khởi tạo một Sự Kiện Cơ Duyên cá nhân hoặc khu vực với nhiều nhánh lựa chọn đạo tâm.',
      'Lựa chọn của người chơi cập nhật lại Nhân Quả (Karma), Tâm Cảnh và trao phần thưởng hoặc thử thách tương ứng.',
    ],
    operatingRules: [
      'Tuyệt đối không công khai tỷ lệ phần trăm xuất hiện của bất kỳ cơ duyên nào trên giao diện.',
      'Cơ duyên có điều kiện ngữ cảnh: ví dụ Lôi Linh Căn đứng trên đỉnh núi lúc trời bão đêm trăng khuyết mới kích hoạt Cổ Lôi Truyền Thừa.',
      'Bảo hiểm vận đen ẩn (Hidden Pity & Fortune Escalation): Người chơi lâu không gặp kỳ ngộ hoặc đột phá thất bại sẽ được tích lũy `Pity_Counter` ẩn làm tăng mạnh xác suất gặp Cao Nhân hoặc Động Phủ ở lần tương tác kế tiếp.',
      'Cơ duyên hiếm không bao giờ là điều kiện bắt buộc duy nhất để lên cảnh giới (người chơi luôn có thể đột phá bằng tích lũy đan dược, linh thạch và kỹ năng).',
    ],
    inputData: [
      'Fate_Seed, Karma_Score, Fortune_Index, Mental_State, World_Weather_Time, Zone_ID, Player_Choice_History, Pity_Counter.',
    ],
    outputData: [
      'Triggered_Destiny_Instance, Narrative_Branches, Karma_Mutation, Unique_Inheritance_Grant, Server_Cooldown_Lock.',
    ],
    edgeCases: [
      'Nhiều người chơi cùng phát hiện một Động Phủ Cổ xuất hiện trên bản đồ mở: Động phủ chuyển thành Bí Cảnh Tranh Đoạt giới hạn số người bước vào, ai giải phá trận pháp hoặc chiến thắng sẽ đoạt truyền thừa chính, những người khác vẫn nhận linh thạch/đan dược phụ.',
    ],
    systemInteractions: [
      'Liên kết trực tiếp với NPC Behavior (12), Quest & Event System (13), Hidden Spiritual Root (04) và Breakthrough System (07).',
    ],
    technicalRisks: [
      'Người chơi dùng bot lặp lại một hành động tại một tọa độ để farm cơ duyên: Giải quyết bằng bộ lọc Entropy Hành Vi (Action Diversity Filter) và khóa cooldown theo vùng/loại sự kiện trên Server.',
    ],
    testingStrategy: [
      'Chạy Monte Carlo Simulation với 100.000 hồ sơ nhân vật để đảm bảo phân phối chuẩn, không có người chơi nào bị "khô hạn cơ duyên" quá 4 giờ chơi thực tế.',
    ],
  },
  {
    id: 6,
    title: '06. Cultivation Progression (Hệ Thống 12 Đại Cảnh Giới & Đa Hướng Tu Luyện)',
    category: 'Tu Luyện & Chiến Đấu',
    summary:
      'Hệ thống 12 Đại Cảnh Giới từ Phàm Nhân đến Tiên Giới cùng 13 nhánh phát triển tự do (Kiếm Tu, Pháp Tu, Thể Tu, Ma Tu, Đan Sư, Trận Sư, Phù Sư, Ngự Thú...).',
    purpose:
      'Mang lại cảm giác thăng tiến thực chất ở mỗi bậc cảnh giới: không chỉ tăng chỉ số mà còn thay đổi phương thức di chuyển (khinh công -> ngự kiếm -> xé không gian), thần thức, tuổi thọ và ngoại hình khí tức.',
    gameplayFlow: [
      'Tu sĩ hấp thu linh khí qua Thổ Nạp, Đan Dược, Linh Thạch và Thực Chiến để làm đầy Đan Điền từng tiểu cảnh giới (ví dụ 12 tầng Luyện Khí).',
      'Song song với tích lũy linh lực, người chơi tu luyện Tâm Pháp (quyết định tốc độ hồi khí và căn cơ), Công Pháp (kỹ năng chủ động), Bí Thuật và Thần Thông.',
      'Lựa chọn kết hợp nghề nghiệp phụ trợ (Luyện Đan, Luyện Khí, Trận Pháp, Phù Lục, Ngự Thú) để tự cung tự cấp hoặc giao thương.',
    ],
    operatingRules: [
      '12 Cảnh giới chuẩn: 1. Phàm Nhân -> 2. Luyện Khí (12 tầng) -> 3. Trúc Cơ -> 4. Kết Đan -> 5. Nguyên Anh -> 6. Hóa Thần -> 7. Luyện Hư -> 8. Hợp Thể -> 9. Đại Thừa -> 10. Độ Kiếp -> 11. Phi Thăng -> 12. Tiên Giới.',
      'Mỗi đại cảnh giới mở khóa cơ chế gameplay mới: Trúc Cơ mở Ngự Kiếm & Thức Tỉnh Thể Chất; Kết Đan mở Bản Mệnh Pháp Bảo; Nguyên Anh mở Nguyên Anh Xuất Khiếu (nhận thêm 1 mạng sinh tồn nếu kịp độn chạy).',
      'Không khóa Class: Một Kiếm Tu hoàn toàn có thể kiêm tu Lôi Pháp và Luyện Đan nếu đủ Ngộ Tính và tài nguyên.',
    ],
    inputData: [
      'Current_Realm, Sub_Level, Cultivated_Manuals, Foundation_Stability, Lifespan_Remaining, Spiritual_Root_Multipliers.',
    ],
    outputData: [
      'Character_Stats_Matrix, Unlocked_Movement_Modes, Max_Spiritual_Sense_Radius, Aura_VFX_Tier.',
    ],
    edgeCases: [
      'Tu sĩ học công pháp xung khắc thuộc tính Linh Căn (ví dụ Thủy Linh Căn cưỡng ép tu luyện Đại Nhật Hỏa Kinh): Vẫn học được nhưng tốc độ chậm hơn 35% và dễ tăng nguy cơ Tâm Ma trừ khi có Đan Dược điều hòa Âm Dương.',
    ],
    systemInteractions: [
      'Làm nền tảng cho Breakthrough System (07), Skill Tree (09), Equipment System (10) và PvE/PvP Scaling (16).',
    ],
    technicalRisks: [
      'Chênh lệch sức mạnh quá lớn (Power Creep) giữa cảnh giới cao và cảnh giới thấp trong thế giới mở.',
    ],
    testingStrategy: [
      'Kiểm thử ma trận tương khắc Ngũ Hành và Trận Pháp hợp kích (cho phép đội hình 5 tu sĩ Trúc Cơ sử dụng Ngũ Hành Đại Trận cầm chân 1 tu sĩ Kết Đan).',
    ],
  },
  {
    id: 7,
    title: '07. Breakthrough & Tribulation System (Hệ Thống Đột Phá & Độ Kiếp Thực Chiến)',
    category: 'Tu Luyện & Chiến Đấu',
    summary:
      'Biến mỗi lần đột phá đại cảnh giới thành một thử thách gameplay thực thụ gồm 6 bước chuẩn bị và màn chiến đấu sinh tồn dưới Thiên Kiếp Lôi.',
    purpose:
      'Xóa bỏ cơ chế "bấm nút trừ tài nguyên nâng cấp", biến thời khắc Đột Phá / Độ Kiếp thành cao trào cảm xúc đáng nhớ nhất của đời tu tiên.',
    gameplayFlow: [
      'Bước 1 — Tích Lũy Viên Mãn & Ổn Định Căn Cơ: Đạt 100% Linh Lực tiểu cảnh giới cuối và nâng Căn Cơ qua chiến đấu/đả tọa.',
      'Bước 2 — Điều Chỉnh Tâm Cảnh & Chuẩn Bị Đan Dược: Giải tỏa tâm ma, chuẩn bị Hộ Mạch Đan, Trúc Cơ Đan hoặc Độ Kiếp Pháp Bảo.',
      'Bước 3 — Chọn Địa Điểm Đột Phá: Tìm Động Phủ yên tĩnh hoặc Linh Mạch cấp cao (hoặc nhờ đồng đạo hộ pháp ngoài trời).',
      'Bước 4 — Dẫn Động Thiên Địa Dị Tượng & Thiên Kiếp: Mây đen kéo đến, sấm sét giáng xuống trên chiến trường 2.5D.',
      'Bước 5 — Thực Chiến Vượt Kiếp: Người chơi phải trực tiếp điều khiển nhân vật né tránh, bật hộ thuẫn, dùng kiếm/pháp bảo đánh tan các đợt Kiếp Lôi và chém Tâm Ma.',
      'Bước 6 — Kết Quả Tam Phân: Thành Công Phá Cảnh, Đạo Cơ Biến Dị (Thưởng đột biến cực hiếm), hoặc Tẩu Hỏa Nhập Ma (Thất bại nhưng tăng kinh nghiệm căn cơ).',
    ],
    operatingRules: [
      'Tỷ lệ thành công cuối cùng là hàm tổng hợp của: Xác suất cơ bản cảnh giới + Độ ổn định Căn Cơ + Tâm Cảnh + Đan Dược + Cấp Linh Mạch + Tỷ lệ sinh tồn thực tế khi né/đỡ Thiên Kiếp.',
      'Đột phá ở vùng hoang dã có thể thu hút yêu thú hoặc tu sĩ khác tới cướp đoạt nếu không bố trí Ẩn Nặc Trận hoặc có đồng môn Hộ Pháp.',
      'Thất bại (Tẩu Hỏa Nhập Ma) không bao giờ xóa nhân vật; nhân vật bị trọng thương tạm thời nhưng nhận được buff "Bách Chiết Bất Khuất" tăng +15% tỷ lệ thành công cho lần kế tiếp.',
    ],
    inputData: [
      'Qi_Full_Flag, Foundation_Score, Mental_State, Consumed_Pills[], Vein_Location_Bonus, RealTime_Tribulation_Performance.',
    ],
    outputData: [
      'Breakthrough_Outcome (SUCCESS | MUTATION_BLESSING | FAILURE_QI_DEVIATION), New_Realm_State, Cinematic_Event_Broadcast.',
    ],
    edgeCases: [
      'Mất kết nối mạng giữa lúc đang Độ Kiếp: Server tự động kích hoạt Hộ Tâm Pháp Bảo chuyển phiên Độ Kiếp sang trạng thái đóng băng an toàn trong 180 giây chờ kết nối lại.',
    ],
    systemInteractions: [
      'Tương tác trực tiếp với Combat System (08), World Design (11 - Thời tiết/Dị tượng), Audio/VFX (20, 21) và Destiny Engine (05).',
    ],
    technicalRisks: [
      'Hiệu ứng Thiên Kiếp quy mô lớn gây tụt FPS nếu nhiều người cùng Độ Kiếp tại một khu vực.',
    ],
    testingStrategy: [
      'Kiểm thử tự động công thức `resolveBreakthrough` và stress-test 20 hiệu ứng Thiên Kiếp đồng thời trên màn hình 2.5D.',
    ],
  },
  {
    id: 8,
    title: '08. Combat System (Hệ Thống Chiến Đấu Hành Động 2.5D Thời Gian Thực)',
    category: 'Tu Luyện & Chiến Đấu',
    summary:
      'Chiến đấu 2.5D Isometric tốc độ cao với Đánh Thường Liên Kích, Kỹ Năng Ngũ Hành, Thân Pháp (Dash/Dodge), Phá Chiêu (Parry/Block), Pháp Bảo và Tuyệt Kỹ Trấn Phái.',
    purpose:
      'Đem lại cảm giác chiến đấu sắc bén, uy lực và đòi hỏi kỹ năng cá nhân, nơi người chơi có Linh Căn thấp hoặc cảnh giới thấp hơn 1 bậc vẫn có thể lật kèo nhờ đọc chiêu và phản kích chuẩn xác.',
    gameplayFlow: [
      'Di chuyển tự do 8 hướng (WASD) kết hợp định hướng chiêu thức theo con trỏ chuột hoặc khóa mục tiêu thông minh (Smart Target Lock).',
      'Chuỗi đánh thường 3 nhịp tích lũy Kiếm Ý / Linh Khí, đan xen các kỹ năng Pháp Thuật diện rộng (AOE), Khống Chế (CC) và Thân Pháp né đòn.',
      'Quan sát vòng cảnh báo đỏ (Windup Telegraph) của Yêu Thú/Boss để thực hiện Parry (Phản chấn làm choáng) hoặc Dash xuyên qua đòn đánh.',
      'Kích hoạt Tuyệt Kỹ (Ultimate Skill: Vạn Kiếm Quy Tông / Cửu Tiêu Thần Lôi) khi hội đủ Linh Lực.',
    ],
    operatingRules: [
      'Mỗi đòn đánh nặng có Hitstop (30–70ms), Hit Flash trắng và rung chấn camera (Trauma Shake) tỷ lệ thuận với uy lực chiêu thức.',
      'Cơ chế Khắc Chế Ngũ Hành & Phá Hộ Thuẫn: Hộ thuẫn của Boss hoặc Tu Sĩ bị phá nhanh gấp đôi khi dùng đúng hệ khắc chế hoặc đòn Parry chuẩn xác.',
      'Không có chỉ số "Né tránh ngẫu nhiên may rủi (RNG Dodge)" gây ức chế; né đòn hoàn toàn dựa vào khung hình bất tử (i-frames) của Thân Pháp và vị trí đứng.',
    ],
    inputData: [
      'Input_Vector (WASD, MouseAim, KeyJustPressed), Character_Combat_Stats, Active_Skill_Cooldowns, Target_Hitboxes.',
    ],
    outputData: [
      'Damage_Events, Crowd_Control_States, Hitstop_Frames, Particle_Burst_Pool_Commands, Sound_Trigger_Events.',
    ],
    edgeCases: [
      'Độ trễ mạng (Ping 100–180ms): Áp dụng Client-side Movement Prediction kết hợp Server Rewind Hit-Detection trong cửa sổ 150ms để cảm giác chém kiếm luôn mượt mà.',
    ],
    systemInteractions: [
      'Kết nối với Skill Tree (09), Equipment & Pháp Bảo (10), PvE Boss / PvP (16) và Multiplayer Networking (17).',
    ],
    technicalRisks: [
      'Rác bộ nhớ (Garbage Collection spikes) khi sinh hàng trăm hạt particle kiếm khí/lôi điện mỗi giây.',
    ],
    testingStrategy: [
      'Sử dụng Ring Buffer cố định cho Particle & Floating Damage Text; kiểm tra tốc độ khung hình ổn định 60 FPS.',
    ],
  },
  {
    id: 9,
    title: '09. Skill Tree & Cultivation Arts (Hệ Thống Công Pháp, Tâm Pháp & Thần Thông)',
    category: 'Tu Luyện & Chiến Đấu',
    summary:
      'Mạng lưới 10 hệ kỹ năng lớn (Kiếm Thuật, Hỏa Pháp, Lôi Pháp, Băng Pháp, Thủy Pháp, Trận Pháp, Thần Thức, Thể Thuật, Ma Thuật, Cấm Thuật) với nhánh nâng cấp Đạo Ngộ.',
    purpose:
      'Cho phép người chơi tự do sáng tạo bộ kỹ năng (Build) độc nhất vô nhị dựa trên những bí tịch họ thu thập được và sự cộng hưởng với Linh Căn của mình.',
    gameplayFlow: [
      'Thu thập Tàn Quyển hoặc Ngọc Giản Công Pháp từ Tông Môn, Động Phủ, Đấu Giá hoặc Kỳ Ngộ.',
      'Lĩnh ngộ Công Pháp thông qua điểm Ngộ Tính và thực chiến để mở khóa các tầng từ Sơ Khuy Môn Kính -> Đăng Đường Nhập Thất -> Xuất Thần Nhập Hóa -> Phản Phác Quy Chân.',
      'Trang bị tối đa 1 Tâm Pháp chủ đạo + 4 Kỹ Năng Chiến Đấu + 1 Thân Pháp + 1 Tuyệt Kỹ Trấn Phái + 2 Bí Thuật Phù Trợ.',
    ],
    operatingRules: [
      'Mỗi kỹ năng đều định nghĩa đầy đủ 10 thuộc tính chuẩn: Gameplay Function, Damage Type, Cooldown, Energy (Qi) Cost, Range, Area of Effect, Animation, VFX, SFX, Upgrade Path.',
      'Nâng cấp kỹ năng không chỉ tăng sát thương mà còn biến đổi cơ chế (ví dụ: Thanh Nguyên Kiếm Quyết tầng Đại Thành phân tách thành 3 luồng kiếm ảnh tự truy kích).',
      'Cấm Thuật (Forbidden Arts) mang lại sức mạnh bùng nổ tức thời nhưng tiêu hao Thọ Nguyên hoặc làm giảm Tâm Cảnh.',
    ],
    inputData: [
      'Unlocked_Manuals[], Comprehension_Points, Spiritual_Root_Affinity, Equipped_Loadout_Slots.',
    ],
    outputData: [
      'Active_Skill_Definitions[], Passive_Stat_Modifiers, Skill_Morph_Flags.',
    ],
    edgeCases: [
      'Người chơi kết hợp Chính Đạo Tâm Pháp với Ma Đạo Cấm Thuật: Hệ thống cho phép thi triển nhưng yêu cầu Tâm Cảnh >= 80 hoặc có Hỗn Độn Linh Căn để không bị xung đột chân nguyên.',
    ],
    systemInteractions: [
      'Tương tác với Hidden Spiritual Root (04), Combat System (08) và Economy (15 - Giao dịch bí tịch).',
    ],
    technicalRisks: [
      'Mất cân bằng khi người chơi tìm ra tổ hợp kỹ năng bất tử (Infinite CC / Infinite Shield).',
    ],
    testingStrategy: [
      'Kiểm thử ma trận phối hợp kỹ năng tự động và giới hạn Diminishing Returns cho các hiệu ứng khống chế liên tiếp.',
    ],
  },
  {
    id: 10,
    title: '10. Equipment & Item System (Hệ Thống Pháp Bảo, Đan Dược, Phù Lục & Trận Kỳ)',
    category: 'Tu Luyện & Chiến Đấu',
    summary:
      'Hệ thống vật phẩm tu tiên chuẩn mực gồm Pháp Khí -> Linh Khí -> Pháp Bảo -> Cổ Bảo -> Thông Thiên Linh Bảo -> Tiên Khí, kết hợp Luyện Đan và Luyện Khí thủ công.',
    purpose:
      'Thay thế hệ thống trang bị rơi ngẫu nhiên nhàm chán bằng các Pháp Bảo có linh tính, có kỹ năng chủ động riêng và có thể nuôi dưỡng (Ôn Dưỡng Bản Mệnh Pháp Bảo) suốt đời.',
    gameplayFlow: [
      'Thu thập khoáng thạch thiên ngoại, yêu đan và linh thảo từ thế giới mở hoặc bí cảnh.',
      'Đưa vào Đan Lò / Khí Đỉnh điều khiển hỏa hầu (nhiệt độ, thời gian, linh lực) để luyện chế Đan Dược hoặc Pháp Bảo.',
      'Tích huyết nhận chủ và ôn dưỡng Bản Mệnh Pháp Bảo trong Đan Điền để pháp bảo tiến hóa cùng cảnh giới của chủ nhân.',
    ],
    operatingRules: [
      'Phẩm cấp vật phẩm: Phàm Phẩm -> Linh Phẩm -> Huyền Phẩm -> Địa Phẩm -> Thiên Phẩm -> Tiên Phẩm.',
      'Đan Dược có Đan Độc tích lũy nếu dùng liên tục trong thời gian ngắn; Đan Dược có Đan Văn (Thượng Phẩm) sẽ giảm 80% đan độc.',
      'Cổ Bảo (Ancient Relics) tìm thấy trong di tích có uy lực cực lớn nhưng không thể sửa chữa thông thường, tạo giá trị chiến lược cao.',
    ],
    inputData: [
      'Raw_Materials[], Alchemist_Fire_Control, Refining_Recipe, Character_Qi_Infusion.',
    ],
    outputData: [
      'Crafted_Item_Instance (with unique Karma history & Spirit Engravings), Toxicity_Accumulation.',
    ],
    edgeCases: [
      'Bản Mệnh Pháp Bảo bị đánh vỡ trong chiến đấu: Chủ nhân bị phản phệ mất 25% khí huyết nhưng Pháp Bảo không biến mất mà lùi về Đan Điền chờ ôn dưỡng phục hồi.',
    ],
    systemInteractions: [
      'Gắn kết trực tiếp với Economy (15), Breakthrough System (07 - dùng đan dược hộ mạch) và Combat System (08).',
    ],
    technicalRisks: [
      'Lưu trữ cơ sở dữ liệu khi mỗi Pháp Bảo có lịch sử chủ nhân và thuộc tính linh tính riêng biệt.',
    ],
    testingStrategy: [
      'Kiểm thử tải Database (JSONB Indexing) với 10 triệu bản ghi vật phẩm độc bản và kiểm tra chống nhân bản vật phẩm (Duplication Exploit).',
    ],
  },
  {
    id: 11,
    title: '11. World Design (Thiết Kế Thế Giới Mở 2.5D & Khí Hậu Thiên Địa)',
    category: 'Thế Giới & Cộng Đồng',
    summary:
      'Thế giới 2.5D Isometric liền mạch gồm Tiên Sơn, Tông Môn, Thành Trì Phàm Trần, Rừng Yêu Thú, Bí Cảnh Cổ, Cấm Địa, Linh Mạch và Thượng Giới.',
    purpose:
      'Tạo dựng không gian tu tiên hùng vĩ có chiều sâu địa lý, nơi mật độ Linh Khí, Thời Tiết và Chu Kỳ Ngày Đêm tác động trực tiếp đến tu luyện, chiến đấu và sự xuất hiện của cơ duyên.',
    gameplayFlow: [
      'Người chơi di chuyển qua các vùng địa lý có nồng độ Linh Khí từ bậc 1 (Phàm Thôn) đến bậc 9 (Thượng Cổ Linh Mạch).',
      'Quan sát sự thay đổi của Thiên Thời (Bình Minh Tử Khí, Trưa Chí Dương, Đêm Nguyệt Hoa, Bão Lôi Điện, Sương Mù Mê Trận) để chọn thời điểm tu luyện hoặc săn yêu thú.',
      'Sử dụng La Bàn Tầm Long để phát hiện khe nứt không gian dẫn vào Bí Cảnh ẩn hoặc Động Phủ vô chủ.',
    ],
    operatingRules: [
      'Phân vùng an toàn và nguy hiểm rõ ràng theo khoảng cách từ Thành Trì/Tông Môn ra tới Cấm Địa Hoang Cổ.',
      'Chu kỳ Ngày/Đêm (2 giờ thực tế = 1 ngày đêm trong game) làm thay đổi tập tính Yêu Thú và loại Linh Thảo nở hoa.',
      'Động Phủ Cá Nhân (Player Cave Abode): Người chơi từ Trúc Cơ có thể khai mở động phủ trên vách núi linh mạch, bố trí Hộ Động Trận Pháp và trồng Dược Viên.',
    ],
    inputData: [
      'World_Clock, Weather_State_Machine, Zone_Qi_Density_Map, Player_Exploration_Fog_Bitmask.',
    ],
    outputData: [
      'Active_Biome_Modifiers, Spawned_Resource_Nodes, Secret_Realm_Portal_Coordinates.',
    ],
    edgeCases: [
      'Hàng trăm người chơi tập trung tại một Linh Mạch nhỏ: Hệ thống phân tách kênh linh mạch thông minh hoặc mở rộng phạm vi cộng hưởng trận pháp.',
    ],
    systemInteractions: [
      'Tương tác với NPC Behavior (12), Destiny Engine (05), Art Bible (20) và Multiplayer Architecture (17).',
    ],
    technicalRisks: [
      'Tải tài nguyên bản đồ (Chunk Streaming) trên thiết bị di động tầm trung.',
    ],
    testingStrategy: [
      'Kiểm thử bộ nhớ (VRAM < 1.2GB trên Mobile, < 2.5GB trên PC) khi di chuyển liên tục qua 5 vùng sinh thái khác nhau.',
    ],
  },
  {
    id: 12,
    title: '12. NPC Behavior & AI Schedule (Hệ Thống NPC Sống Động & Ký Ức Nhân Quả)',
    category: 'Thế Giới & Cộng Đồng',
    summary:
      'NPC không đứng yên một chỗ phát nhiệm vụ mà có lịch trình tu luyện, hái thuốc, giao chiến, đột phá và ghi nhớ ân oán Nhân Quả với từng người chơi.',
    purpose:
      'Làm cho thế giới VẠN ĐẠO TIÊN ĐỒ thực sự "sống": một NPC tán tu bạn từng tặng đan dược lúc Luyện Khí có thể trở thành Trưởng Lão Kết Đan cứu mạng bạn sau này.',
    gameplayFlow: [
      'NPC di chuyển theo lịch trình (Sáng đả tọa hấp thu tử khí, Chiều vào rừng săn yêu thú hoặc mở sạp giao dịch tại phường thị, Đêm về động phủ luyện đan).',
      'Người chơi có thể Giao Hảo, Luận Đạo, Giao Dịch, Bái Sư, Kết Đạo Lữ hoặc Kết Thù với NPC.',
      'Hệ thống Relationship Graph ghi nhận mọi tương tác; NPC có thể chủ động gửi truyền âm phù báo tin Bí Cảnh hoặc tìm đến trả thù nếu bị cướp đoạt.',
    ],
    operatingRules: [
      'Mỗi NPC quan trọng có Bộ Thuộc Tính Tu Luyện riêng (Cảnh giới, Linh căn, Tính cách: Chính trực / Cẩn trọng / Tham lam / Cuồng chiến).',
      'Không có biểu tượng dấu chấm than vàng (!) vô hồn trên đầu mọi NPC; người chơi phải dùng Thần Thức cảm nhận hoặc trò chuyện để phát hiện cơ duyên.',
    ],
    inputData: [
      'NPC_Personality_Profile, World_Time_Slot, Player_NPC_Affinity_Score, Karma_Ledger.',
    ],
    outputData: [
      'NPC_Goal_Action (Patrol | Cultivate | Trade | Assist | Ambush), Dynamic_Dialogue_Context.',
    ],
    edgeCases: [
      'NPC quan trọng bị người chơi hoặc yêu thú đánh trọng thương: NPC sử dụng Huyết Độn Phù thoát thân về tông môn dưỡng thương thay vì chết vĩnh viễn làm gãy chuỗi sự kiện thế giới.',
    ],
    systemInteractions: [
      'Liên kết sâu với Destiny Engine (05), Quest & Event System (13) và Sect System (14).',
    ],
    technicalRisks: [
      'Chi phí CPU phía Server khi chạy cây hành vi (Behavior Tree) cho hàng nghìn NPC.',
    ],
    testingStrategy: [
      'Sử dụng kiến trúc LOD AI (Level-of-Detail AI): NPC ở gần người chơi chạy Behavior Tree chi tiết 10Hz, NPC ở xa mô phỏng bằng toán học xác suất 0.2Hz.',
    ],
  },
  {
    id: 13,
    title: '13. Quest & Event System (Hệ Thống Sự Kiện Động & Thiên Địa Dị Tượng)',
    category: 'Thế Giới & Cộng Đồng',
    summary:
      'Thay thế chuỗi nhiệm vụ chạy vặt tuyến tính bằng Truyền Văn Giang Hồ, Nhiệm Vụ Tông Môn Tự Chọn, Bí Cảnh Xuất Thế và Sự Kiện Thế Giới Đa Giai Đoạn.',
    purpose:
      'Tôn trọng quy tắc thiết kế: "Không biến mọi hoạt động thành nhiệm vụ nhận thưởng" — người chơi hành động vì mục tiêu tu luyện và khám phá thực sự.',
    gameplayFlow: [
      'Người chơi nghe ngóng tin đồn tại Tửu Lầu, Phường Thị hoặc đọc Ngọc Giản Tình Báo thay vì nhận danh sách checklist cứng nhắc.',
      'Khi Thiên Địa Dị Tượng nổ ra (ví dụ: Thú Triều Vạn Yêu Sơn, Cổ Mộ Hóa Thần Xuất Thế), toàn bộ người chơi trong vùng nhận thấy biến đổi bầu trời và linh khí.',
      'Mỗi người chơi đóng góp theo sở trường (Kiếm Tu trảm yêu, Trận Sư gia cố đại trận, Đan Sư tiếp tế linh đan) và nhận Nhân Quả / Chiến Công tương xứng.',
    ],
    operatingRules: [
      'Không có nhiệm vụ bắt buộc phải giết X con quái vô nghĩa mới mở khóa cốt truyện.',
      'Mọi sự kiện lớn đều có ít nhất 2–3 kết cục ảnh hưởng đến bản đồ (ví dụ: bảo vệ thành công Linh Mạch sẽ giúp toàn vùng tăng +20% tốc độ tu luyện trong 48 giờ).',
    ],
    inputData: [
      'Regional_Chaos_Index, Player_Contribution_Type, Active_World_Anomalies.',
    ],
    outputData: [
      'World_State_Mutation, Sect_Merit_Points, Historical_Monument_Record.',
    ],
    edgeCases: [
      'Server ít người chơi online vào khung giờ khuya: Độ máu và quy mô Thú Triều tự động co giãn (Dynamic Scaling) kết hợp Hộ Sơn Thần Thú của Tông Môn hỗ trợ.',
    ],
    systemInteractions: [
      'Tương tác với World Design (11), Sect System (14), PvE/PvP (16) và LiveOps (22).',
    ],
    technicalRisks: [
      'Nghẽn cổ chai mạng (Broadcast Storm) khi 500 người chơi cùng tụ tập tại một tâm chấn Thiên Địa Dị Tượng.',
    ],
    testingStrategy: [
      'Kiểm thử Area-of-Interest (AOI) Dynamic Filtering và phân tầng hiển thị hiệu ứng đồng đội khi mật độ > 100 người/vùng.',
    ],
  },
  {
    id: 14,
    title: '14. Sect & Social System (Hệ Thống Tông Môn, Sư Đồ & Cộng Đồng Tu Chân)',
    category: 'Thế Giới & Cộng Đồng',
    summary:
      'Hệ thống Tông Môn phân cấp (Ngoại Môn -> Nội Môn -> Chân Truyền -> Trưởng Lão -> Chưởng Môn), Truyền Thừa Sư Đồ, Đạo Lữ và Gia Tộc Tu Tiên.',
    purpose:
      'Xây dựng xã hội tu chân có tôn ti, gắn kết chặt chẽ và đầy kịch tính chính trị - quân sự giữa Chính Đạo, Ma Đạo và Liên Minh Tán Tu.',
    gameplayFlow: [
      'Người chơi có thể gia nhập các Đại Tông Môn (Thái Thanh Kiếm Tông, Đan Đỉnh Phái, Cửu U Ma Tông...) hoặc tự khai sáng Tông Môn mới khi đạt Kết Đan/Nguyên Anh.',
      'Thực hiện truyền công Sư Đồ, cùng đồng môn trấn giữ Linh Mạch, mở Tàng Kinh Các và tham gia Đại Hội Luận Kiếm.',
      'Bầu chọn hoặc thách đấu vị trí Chưởng Môn / Trưởng Lão để điều phối tài nguyên và quyết định ngoại giao tông môn.',
    ],
    operatingRules: [
      'Tông Môn sở hữu Lãnh Địa thực trên bản đồ cùng Hộ Sơn Đại Trận cần linh thạch duy trì.',
      'Hệ thống Sư Đồ khuyến khích người chơi cũ dẫn dắt người chơi mới: Sư phụ truyền thụ tâm đắc công pháp (không truyền trực tiếp đồ cuối) sẽ nhận được Đạo Tâm Công Đức.',
    ],
    inputData: [
      'Sect_ID, Member_Rank, Sect_Treasury_Resources, Diplomatic_Stance_Matrix.',
    ],
    outputData: [
      'Sect_Buff_Auras, Territory_Control_Flags, Master_Disciple_Karma_Rewards.',
    ],
    edgeCases: [
      'Chưởng Môn nghỉ chơi dài ngày (Offline > 14 ngày): Hệ thống Thái Thượng Trưởng Lão Hội tự động chuyển giao quyền điều hành cho Trưởng Lão có cống hiến cao nhất.',
    ],
    systemInteractions: [
      'Kết nối chặt chẽ với Economy (15), PvE & PvP Tông Môn Chiến (16) và World Design (11).',
    ],
    technicalRisks: [
      'Một Tông Môn độcba toàn bộ Linh Mạch trên máy chủ (Server Monopoly).',
    ],
    testingStrategy: [
      'Áp dụng cơ chế Chi Phí Duy Trì Lũy Tiến (Exponential Upkeep) khi chiếm giữ quá nhiều Linh Mạch và mở cơ chế Liên Minh Phá Bá Quyền.',
    ],
  },
  {
    id: 15,
    title: '15. Player-Driven Economy (Nền Kinh Tế Tu Chân Do Người Chơi Vận Hành)',
    category: 'Thế Giới & Cộng Đồng',
    summary:
      'Kinh tế tuần hoàn khép kín giữa Khai Thác -> Luyện Đan / Luyện Khí / Chế Phù -> Giao Dịch Phường Thị -> Đấu Giá Hội -> Tiêu Hao Độ Kiếp & Chiến Tranh.',
    purpose:
      'Đảm bảo mọi tài nguyên quý giá đều do người chơi tạo ra và lưu thông, giữ giá trị Linh Thạch ổn định lâu dài và tuyệt đối không Pay-to-Win.',
    gameplayFlow: [
      'Thợ săn yêu thú và người hái thuốc cung cấp nguyên liệu thô cho Đan Sư, Khí Sư, Trận Sư.',
      'Các đại sư sản xuất Đan Dược hộ mạch, Pháp Bảo, Phù Lục rồi bày bán tại Phường Thị hoặc ký gửi tại Vạn Bảo Lâu (Nhà Đấu Giá Liên Vùng).',
      'Tu sĩ mua vật phẩm để chuẩn bị Độ Kiếp, khám phá Bí Cảnh hoặc tham gia Tông Môn Chiến (nơi vật phẩm tiêu hao và luân chuyển).',
    ],
    operatingRules: [
      'Đơn vị tiền tệ chuẩn: Hạ Phẩm / Trung Phẩm / Thượng Phẩm / Cực Phẩm Linh Thạch (tỷ lệ quy đổi 1:100).',
      'Tuyệt đối không bán Linh Căn, Đan Dược tăng tỷ lệ đột phá hay Pháp Bảo mạnh bằng tiền thật trong Cash Shop.',
      'Hệ thống Thuế Phường Thị và Tiêu Hao Tu Sửa Đại Trận đóng vai trò bể hút tiền (Currency Sink) chống lạm phát.',
    ],
    inputData: [
      'Market_Order_Book, Item_Supply_Demand_Index, Auction_Bid_Stream, Currency_Sink_Volume.',
    ],
    outputData: [
      'Cleared_Trade_Transactions, Dynamic_Tax_Rate, Anti_RMT_Audit_Flags.',
    ],
    edgeCases: [
      'Đầu cơ tích trữ thao túng giá Trúc Cơ Đan: Hệ thống Thương Hội NPC định kỳ mở Phiên Đấu Giá Linh Đan điều tiết nguồn cung tối thiểu dựa trên số lượng người chơi chạm bình cảnh.',
    ],
    systemInteractions: [
      'Tương tác với Equipment & Item System (10), Sect System (14) và Monetization (23).',
    ],
    technicalRisks: [
      'Race condition khi hàng trăm người chơi cùng đặt giá giây cuối tại Đấu Giá Hội.',
    ],
    testingStrategy: [
      'Sử dụng giao dịch ACID với Distributed Lock (Redis/PostgreSQL Serializable) và cơ chế gia hạn thêm 15 giây (Soft-Close) khi có lượt trả giá phút chót.',
    ],
  },
  {
    id: 16,
    title: '16. PvE & PvP Content (Bí Cảnh, World Boss, Luận Kiếm & Tranh Đoạt Linh Mạch)',
    category: 'Thế Giới & Cộng Đồng',
    summary:
      'Hệ thống PvE Bí Cảnh biến hóa và PvP có kiểm soát Nhân Quả (Lôi Đài Công Bằng, Tranh Đoạt Bí Cảnh, Tông Môn Đại Chiến).',
    purpose:
      'Tạo sân chơi kịch tính cho cả người thích hợp tác săn Boss lẫn người thích tranh đấu đỉnh cao, đồng thời bảo vệ người chơi mới khỏi nạn đồ sát vô cớ (Ganking).',
    gameplayFlow: [
      'PvE: Tổ đội 1–5 người giải trận pháp Bí Cảnh Cổ, đối đầu World Boss Yêu Vương có cơ chế chuyển pha (Phase Mechanics) theo ngũ hành.',
      'PvP Lôi Đài (Tiên Đạo Luận Kiếm): Đấu 1v1 và 3v3 cân bằng cảnh giới, thuần túy so tài kỹ năng điều khiển và phối hợp công pháp.',
      'PvP Thế Giới & Tông Môn Chiến: Tranh đoạt quyền khai thác Linh Mạch, Mỏ Linh Thạch và Cấm Địa vào các khung giờ chiến dịch.',
    ],
    operatingRules: [
      'Bảo vệ Tân Thủ & Cơ Chế Nghiệt Sát (PK Karma): Tấn công tu sĩ thấp hơn từ 2 đại cảnh giới trở lên ngoài vùng chiến sự sẽ tích lũy Sát Nghiệp cực nặng, bị Thiên Lôi truy kích và hiện vị trí trên Bảng Truy Nã Chính Đạo.',
      'Chiến thuật khắc chế tư chất: Đội hình 3 người có Trận Pháp tương sinh có thể đánh bại kẻ địch có Linh Căn cao hơn nhưng đi lẻ.',
    ],
    inputData: [
      'Party_Composition, Boss_Phase_State, PvP_Zone_Ruleset, Attacker_Defender_Realm_Delta.',
    ],
    outputData: [
      'Loot_Distribution_Table, PvP_Rank_Delta, Sinner_Bounty_Status, Territory_Ownership.',
    ],
    edgeCases: [
      'Kéo đàn áp đảo số lượng (Zerging) trong Tông Môn Chiến: Hộ Sơn Đại Trận và Địa Hình Hẹp chia chiến trường thành các cứ điểm 5v5 / 15v15 liên hoàn.',
    ],
    systemInteractions: [
      'Kết nối với Combat System (08), Sect System (14), Economy (15) và Balancing Principles (11).',
    ],
    technicalRisks: [
      'Đồng bộ vị trí và kỹ năng trong trận Tông Môn Chiến 100v100.',
    ],
    testingStrategy: [
      'Kiểm thử tải máy chủ chiến trường (Battleground Shard) với 200 bot chiến đấu liên tục ở tickrate 20Hz.',
    ],
  },
  {
    id: 17,
    title: '17. Multiplayer Architecture (Kiến Trúc Mạng Đa Người Chơi & Phân Vùng Thế Giới)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Kiến trúc Hybrid World Sharding + Dynamic Area-of-Interest (AOI) Spatial Grid kết hợp Authoritative Server hỗ trợ hàng nghìn người chơi đồng thời.',
    purpose:
      'Đảm bảo thế giới tu tiên luôn đông đúc, liền mạch mà vẫn giữ độ trễ chiến đấu hành động thấp (< 60ms nội vùng) trên cả PC và Mobile.',
    gameplayFlow: [
      'Client kết nối qua Gateway bằng WebSocket / WebTransport (QUIC/UDP cho gói tin di chuyển/chiến đấu và TCP/TLS cho giao dịch/chat).',
      'Bản đồ thế giới được chia thành các Spatial Cells có khả năng tự động co giãn (Dynamic Cell Splitting) khi mật độ người chơi tăng cao.',
      'Khi vào Bí Cảnh, Động Phủ hoặc Lôi Đài, người chơi được chuyển mượt mà (Seamless Handover) sang Instance Worker chuyên biệt.',
    ],
    operatingRules: [
      '100% Authoritative Server: Client chỉ gửi Intent (Input di chuyển, hướng ngắm, mã kỹ năng); Server xác thực vị trí, tầm đánh, cooldown và tính toán sát thương.',
      'Spatial Interest Management: Mỗi Client chỉ nhận gói tin cập nhật của các thực thể nằm trong tầm nhìn + bán kính Thần Thức.',
    ],
    inputData: [
      'Client_Input_Packets (SeqNo, Timestamp, MoveVec, ActionID), Spatial_Grid_Topology.',
    ],
    outputData: [
      'Delta_Compressed_World_Snapshots (20Hz), Reliable_State_Events (Breakthrough, Loot, Chat).',
    ],
    edgeCases: [
      'Chuyển vùng giữa hai Node Server liền kề khi đang bay Ngự Kiếm tốc độ cao: Sử dụng Ghost Entity Border Buffer rộng 30m để bàn giao trạng thái không có màn hình chờ (Zero Loading Screen).',
    ],
    systemInteractions: [
      'Nền tảng vận hành cho Combat System (08), World Design (11) và Technical Architecture (18).',
    ],
    technicalRisks: [
      'Mất gói tin mạng di động 4G/5G gây hiện tượng giật lùi (Rubber-banding).',
    ],
    testingStrategy: [
      'Mô phỏng mạng kém (Packet Loss 5%, Jitter ±40ms) để tinh chỉnh thuật toán Client-side Interpolation & Extrapolation.',
    ],
  },
  {
    id: 18,
    title: '18. Technical Architecture (Kiến Trúc Kỹ Thuật Tổng Thể, Database & Anti-Cheat)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Đề xuất Stack công nghệ thực chiến cho MMORPG 2.5D đa nền tảng PC/Mobile/Web cùng kiến trúc cơ sở dữ liệu phân tán và bảo mật chống gian lận.',
    purpose:
      'Đảm bảo toàn bộ kết quả ngẫu nhiên (Linh Căn, Cơ Duyên, Rơi Đồ, Đột Phá) được bảo mật tuyệt đối trên Server và hệ thống có thể mở rộng ngang (Horizontal Scaling).',
    gameplayFlow: [
      'Client Engine: Custom 2.5D Isometric Renderer (Unity URP 2.5D cho bản cài đặt PC/Mobile & Canvas2D/WebGL tối ưu cho bản Web Vertical Slice).',
      'Backend Services: Cụm Microservices gồm Auth Service, World Simulation Nodes (Go/Rust/Node.js), Destiny & RNG Engine, Economy/Auction Service, Social/Sect Service.',
      'Data Layer: PostgreSQL (lưu dữ liệu bền vững: Nhân vật, Linh Căn ẩn, Vật phẩm, Nhân quả) + Redis Cluster (In-memory state, Cooldown, Leaderboards) + Kafka/NATS (Event Bus).',
    ],
    operatingRules: [
      'Quy tắc Vàng về RNG & Bảo Mật: Tất cả dữ liệu Linh Căn, Thiên Phú, Cơ Duyên, Tỷ Lệ Đột Phá và Rơi Vật Phẩm được xử lý 100% trên Authoritative Server; Client không bao giờ được tự quyết định.',
      'Field-Level Visibility Filtering: API trả dữ liệu nhân vật cho Client tự động lọc bỏ các trường ẩn dựa trên `Discovery_Stage` hiện tại của người chơi.',
      'Anti-Cheat đa lớp: Kiểm tra tốc độ di chuyển (Speedhack Check), kiểm tra Cooldown/Qi phía Server, phát hiện bất thường hành vi Bot và nhật ký kiểm toán giao dịch (Audit Trail).',
    ],
    inputData: [
      'Authenticated_RPC_Requests, Server_Tick_Clock, Database_Transactions.',
    ],
    outputData: [
      'Sanitized_Client_State_Views, Encrypted_WAL_Persistence, AntiCheat_Anomaly_Alerts.',
    ],
    edgeCases: [
      'Sự cố sập 1 Node World Server: Trạng thái nhân vật được snapshot định kỳ mỗi 15 giây vào Redis và ghi tức thời (Write-Through) khi có sự kiện quan trọng (Đột phá, Nhận cơ duyên, Giao dịch), đảm bảo không bao giờ mất cơ duyên vừa nhận.',
    ],
    systemInteractions: [
      'Bao bọc và bảo vệ toàn bộ 24 hệ thống còn lại trong GDD.',
    ],
    technicalRisks: [
      'Độ trễ ghi Database khi hàng chục nghìn người chơi cùng nhận thưởng Sự Kiện Thế Giới một lúc.',
    ],
    testingStrategy: [
      'Sử dụng Write-Behind Queue phân lô (Batched Upserts) kết hợp Idempotency Key và kiểm thử Chaos Engineering (tắt ngẫu nhiên 1 World Node khi đang tải cao).',
    ],
  },
  {
    id: 19,
    title: '19. UI/UX Design (Giao Diện Hòa Nhập Thế Giới & Tối Ưu Tầm Nhìn)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Thiết kế HUD mang chất liệu Ngọc Giản - Đồng Cổ - Thủy Mặc giữ trống >= 85% màn hình chiến đấu, điều hướng ánh mắt thông minh và hỗ trợ hoàn hảo cả PC lẫn Mobile.',
    purpose:
      'Tránh giao diện MMORPG rác mắt đầy chữ và nút bấm che kín màn hình; giúp người chơi đắm chìm vào cảnh sắc tiên giới và đọc tình huống chiến đấu trong tích tắc.',
    gameplayFlow: [
      'Góc trên trái: Cụm Ngọc Bài gọn nhẹ hiển thị Khí Huyết (HP), Linh Lực (Qi), Tâm Cảnh, Cảnh Giới hiện tại và Trạng Thái Linh Căn (ẩn hoặc đã hé lộ).',
      'Cạnh dưới: Thanh Pháp Thuật & Kiếm Quyết với phím tắt rõ ràng, bộ đếm hồi chiêu tabular-nums và nút Đột Phá / Độ Kiếp sáng lên khi Đan Điền viên mãn.',
      'Trung tâm màn hình (35%–65% X/Y): Giữ thông thoáng tuyệt đối cho nhân vật, hiệu ứng kiếm khí và vòng cảnh báo chiêu thức kẻ địch.',
    ],
    operatingRules: [
      'Không sử dụng thông báo chạy ngang màn hình kiểu truyền thống ("Chúc mừng VIP nạp thẻ..."); chỉ hiển thị Dị Tượng Thiên Địa mang tính nhập vai.',
      'Mọi con số chỉ số và thời gian hồi chiêu sử dụng font `tabular-nums` chống nhảy chữ.',
      'Hỗ trợ đầy đủ phím tắt bàn phím/chuột trên PC và cụm Virtual Joystick + Radial Skill Pad nhạy bén trên Mobile.',
    ],
    inputData: [
      'Live_Combat_Telemetry, Discovery_Stage_View, Viewport_Dimensions.',
    ],
    outputData: [
      'Low_Occlusion_HUD_Overlay (>= 85% unobstructed playfield), Contextual_Interaction_Prompts.',
    ],
    edgeCases: [
      'Màn hình điện thoại nhỏ (390x844): Tự động thu gọn bảng Nhật Ký Tu Tiên và chuyển các nút phụ trợ vào khay thu phóng một chạm.',
    ],
    systemInteractions: [
      'Hiển thị dữ liệu từ Hidden Spiritual Root (04), Cultivation (06), Combat (08) và GDD Codex.',
    ],
    technicalRisks: [
      'Render lại (Re-render) giao diện React ở tần số 60Hz làm giật khung hình Canvas.',
    ],
    testingStrategy: [
      'Tách biệt hoàn toàn vòng lặp Canvas 60FPS khỏi React State (chỉ cập nhật HUD React khi có thay đổi số nguyên hoặc chuyển trạng thái).',
    ],
  },
  {
    id: 20,
    title: '20. 2.5D Art Bible (Định Hướng Mỹ Thuật 2.5D Huyền Huyễn Phương Đông)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Phong cách Chinese Xianxia Fantasy bán tả thực cách điệu (Semi-realistic Stylized) góc nhìn Isometric 2.5D với sương mù thể tích, ánh sáng khí quyển và hiệu ứng linh căn đặc trưng.',
    purpose:
      'Tạo nên bản sắc thị giác thoát tục như một bức tranh sơn thủy cổ điển sống động, nơi nhìn vào khí tức và màu sắc kiếm quang là cảm nhận được đạo hạnh của tu sĩ.',
    gameplayFlow: [
      'Môi trường phân lớp chiều sâu (Parallax Depth Layers): Đỉnh núi mây mù phía xa, rừng trúc/thác linh tuyền trung cảnh, và thềm đá cổ tự/trận pháp cận cảnh.',
      'Nhân vật thay đổi khí chất và hiệu ứng ngoại vi theo Cảnh Giới và Linh Căn (ví dụ: Lôi Linh Căn có tia hồ quang tím ẩn hiện; Băng Linh Căn có hoa tuyết lơ lửng).',
      'Kỹ năng Tuyệt Kỹ (Ultimate) làm biến đổi ánh sáng toàn vùng trong 1.5 giây nhưng giữ rõ nét hình khối (Silhouette) của nhân vật và kẻ địch.',
    ],
    operatingRules: [
      'Bảng màu chủ đạo (60-30-10): 60% Huyền Mặc & Lam Khói Sương (#080b10 – #16202e), 30% Đá Cổ, Ngọc Bích & Gỗ Tùng (#243447 – #3b5249), 10% Kim Quang Tiên Khí & Châu Sa (#c89d54, #22d3ee, #ef4444).',
      'Ưu tiên độ rõ ràng trong chiến đấu (Visual Clarity Budget): Hiệu ứng của bản thân hiển thị 100%, hiệu ứng đồng đội tự động giảm độ đục xuống 35% để không che khuất đòn đánh của Boss.',
    ],
    inputData: [
      'Biome_Palette, Time_Of_Day_Lighting, Character_Realm_And_Root, Graphic_Quality_Preset.',
    ],
    outputData: [
      'Isometric_Scene_Composition, Layered_Particle_Shaders, Character_Silhouette_Contrast.',
    ],
    edgeCases: [
      'Thiết bị cấu hình yếu: Tự động gộp các lớp sương mù và giới hạn số lượng hạt particle tối đa mà vẫn giữ nguyên phạm vi hiển thị vòng sát thương.',
    ],
    systemInteractions: [
      'Đồng bộ với Combat System (08), World Design (11) và Breakthrough System (07).',
    ],
    technicalRisks: [
      'Overdraw cao khi nhiều lớp hiệu ứng bán trong suốt (Alpha Blending) chồng lên nhau.',
    ],
    testingStrategy: [
      'Kiểm tra Shader Overdraw Heatmap và giới hạn tối đa 3 lớp Alpha chồng lấp trên mỗi pixel.',
    ],
  },
  {
    id: 21,
    title: '21. Audio Design (Thiết Kế Âm Thanh Nhạc Cụ Dân Tộc & Không Gian Tu Tiên)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Kết hợp nhạc cụ cổ truyền phương Đông (Cổ Cầm, Tiêu, Đàn Tranh, Trống Chiến) với âm thanh tổng hợp linh khí, tiếng kiếm ngân và sấm sét Thiên Kiếp.',
    purpose:
      'Truyền tải cả sự thanh tịnh thoát tục lúc đả tọa lẫn uy áp nghẹt thở khi giao chiến và vượt Thiên Kiếp.',
    gameplayFlow: [
      'Âm nhạc thích ứng (Adaptive Music): Nhạc nền Cổ Cầm tĩnh lặng khi khám phá và thổ nạp -> Chuyển mượt sang tiết tấu Trống & Đàn Tỳ Bà dồn dập khi vào chiến đấu.',
      'Phản hồi âm thanh chiến đấu phân tầng trọng lượng (Light Slash vs Heavy Parry vs Heavenly Thunder).',
      'Tín hiệu âm thanh cảnh báo sớm (Audio Telegraph) trước mỗi đòn sát chiêu của Boss hoặc tia sét Độ Kiếp.',
    ],
    operatingRules: [
      'Mỗi hệ kỹ năng có âm sắc đặc trưng riêng biệt (Kiếm ngân kim loại trong trẻo, Hỏa pháp bùng cháy trầm đục, Lôi pháp đanh gọn xé gió, Băng pháp kết tinh lanh lảnh).',
      'Biến thiên cao độ ngẫu nhiên nhẹ (±8% Pitch Variation) cho các đòn đánh liên tiếp để không gây nhàm tai.',
    ],
    inputData: [
      'Combat_Intensity_Level, Skill_School_Type, Event_Weight, Audio_Mute_State.',
    ],
    outputData: [
      'Spatial_Audio_Mix, Pitch_Varied_SFX_Triggers, Adaptive_BGM_Stem_Weights.',
    ],
    edgeCases: [
      'Nhiều kỹ năng nổ cùng lúc: Bộ giới hạn âm lượng (Dynamic Ducking & Polyphony Limiter) ưu tiên âm thanh cảnh báo nguy hiểm và đòn đánh của chính người chơi.',
    ],
    systemInteractions: [
      'Phối hợp trực tiếp với Combat System (08), Breakthrough System (07) và UI/UX (19).',
    ],
    technicalRisks: [
      'Chính sách chặn Autoplay Audio của trình duyệt và thiết bị di động trước khi có tương tác người dùng.',
    ],
    testingStrategy: [
      'Khởi tạo và đánh thức `AudioContext` ngay tại thao tác nhấn nút Bắt Đầu (`[data-start="true"]`) và kiểm tra nút Tắt Tiếng `[M]`.',
    ],
  },
  {
    id: 22,
    title: '22. LiveOps & World Evolution (Vận Hành Kỷ Nguyên Thiên Địa & Sự Kiện Dài Hạn)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Vận hành máy chủ theo mô hình Kỷ Nguyên Tu Chân (World Epochs) do chính hành động tập thể của người chơi thúc đẩy mở khóa.',
    purpose:
      'Giữ cho máy chủ luôn tươi mới hàng năm trời, đồng thời tạo cơ hội bắt kịp tự nhiên (Catch-up Mechanics) cho người chơi đến sau.',
    gameplayFlow: [
      'Kỷ Nguyên 1 — Linh Khí Khôi Phục: Giới hạn cảnh giới cao nhất ở Kết Đan / Nguyên Anh; khám phá bản đồ Nhân Giới.',
      'Kỷ Nguyên 2 — Cổ Giới Khai Mở: Khi máy chủ có đủ 100 tu sĩ đạt Nguyên Anh cùng hợp lực phá vỡ Phong Ấn Thượng Cổ, nồng độ Linh Khí toàn thế giới tăng +50% (giúp người mới tu luyện nhanh hơn) và mở khóa Hóa Thần – Luyện Hư.',
      'Kỷ Nguyên 3 — Tiên Lộ Tranh Phong: Mở khóa Đại Thừa, Độ Kiếp và cánh cổng Phi Thăng Tiên Giới liên máy chủ.',
    ],
    operatingRules: [
      'Bổ sung Linh Căn Hiếm mới, Thể Chất mới và Bí Cảnh mới theo từng Kỷ Nguyên mà không làm phế nhân vật cũ.',
      'Người chơi gia nhập ở Kỷ Nguyên sau được hưởng buff "Thiên Địa Linh Triều" tăng tốc độ tu luyện ở các cảnh giới đầu để nhanh chóng hòa nhập cùng cộng đồng.',
    ],
    inputData: [
      'Server_Top_Realm_Distribution, Collective_World_Seal_Progress, Season_Calendar.',
    ],
    outputData: [
      'Active_World_Epoch, Global_Qi_Catchup_Multiplier, Newly_Seeded_Secret_Realms.',
    ],
    edgeCases: [
      'Máy chủ có tiến độ chậm hơn dự kiến: Hệ thống Thiên Đạo tự động tăng tần suất xuất hiện Linh Mạch Trào Dâng mỗi cuối tuần để hỗ trợ toàn bộ tu sĩ.',
    ],
    systemInteractions: [
      'Tác động tới Cultivation Progression (06), Destiny Engine (05) và Balancing Principles (11).',
    ],
    technicalRisks: [
      'Cập nhật nội dung LiveOps làm gián đoạn người chơi đang Độ Kiếp.',
    ],
    testingStrategy: [
      'Triển khai Rolling Update không dừng máy chủ (Zero-Downtime Hot Reload) cho dữ liệu bảng sự kiện và cấu hình Cơ Duyên.',
    ],
  },
  {
    id: 23,
    title: '23. Ethical Monetization (Mô Hình Doanh Thu Công Bằng — Tuyệt Đối Không Pay-To-Win)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Doanh thu đến từ Ngoại Trang Cổ Phong, Hiệu Ứng Phi Kiếm/Động Phủ, Tiên Đồ Lệnh (Cosmetic Battle Pass) và Tiện Ích Lưu Trữ — cam kết 0% bán sức mạnh hay cơ duyên.',
    purpose:
      'Bảo vệ sự tôn nghiêm của thế giới tu tiên: thành tựu cảnh giới và cơ duyên nghịch thiên phải đến từ hành trình trải nghiệm, không thể mua bằng tiền mặt.',
    gameplayFlow: [
      'Người chơi miễn phí và người chơi trả phí có cùng xác suất Linh Căn, cùng cơ hội gặp Cơ Duyên và cùng giới hạn sức mạnh chiến đấu.',
      'Cửa hàng Bách Bảo Các chỉ cung cấp: Trang phục tu tiên (Đạo Bào, Kiếm Y), Ngoại hình Phi Kiếm/Thú Cưỡi (không cộng chỉ số chiến đấu), Kiến trúc trang trí Động Phủ và hiệu ứng thời tiết cá nhân.',
    ],
    operatingRules: [
      'Ba điều CẤM tuyệt đối: 1. Không bán Linh Căn tối thượng hay vật phẩm tẩy Linh Căn bằng tiền thật; 2. Không bán Cơ Duyên độc quyền hay bùa tăng tỷ lệ Độ Kiếp bằng tiền thật; 3. Không bán Linh Thạch hay Trang Bị chiến đấu trong Cash Shop.',
      'Mọi ngoại trang đều được thiết kế đúng chuẩn mỹ thuật cổ phong tu tiên (Art Bible 20), không đưa trang phục hiện đại hay hiệu ứng kệch cỡm phá vỡ bối cảnh.',
    ],
    inputData: [
      'Cosmetic_Catalog, Season_Pass_Cosmetic_Milestones, Player_Wardrobe_Unlocks.',
    ],
    outputData: [
      'Visual_Skin_Overrides (Zero Stat Impact), Sustainable_LiveOps_Revenue.',
    ],
    edgeCases: [
      'Ngoại trang kỹ năng làm thay đổi màu sắc chiêu thức gây khó nhìn trong PvP: Cung cấp tùy chọn "Hiển thị hiệu ứng kỹ năng mặc định của đối thủ" trong cài đặt PvP.',
    ],
    systemInteractions: [
      'Tuân thủ nghiêm ngặt Balancing Principles (11), Economy (15) và Art Bible (20).',
    ],
    technicalRisks: [
      'Tăng dung lượng bộ nhớ текстур (Texture Memory) khi có nhiều bộ ngoại trang trong cùng một khung hình.',
    ],
    testingStrategy: [
      'Kiểm toán mã nguồn tự động (CI Assertion): Đảm bảo mọi vật phẩm gắn cờ `is_cash_shop = true` có toàn bộ trường chỉ số chiến đấu và tỷ lệ cơ duyên bằng `0`.',
    ],
  },
  {
    id: 24,
    title: '24. Development Roadmap (Lộ Trình Phát Triển 4 Giai Đoạn)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Lộ trình 24 tháng từ Prototype Cốt Lõi -> Vertical Slice -> Alpha/Beta Thế Giới Mở -> Phát Hành Chính Thức & Mở Rộng Tiên Giới.',
    purpose:
      'Phân bổ nguồn lực kỹ thuật và mỹ thuật khoa học, kiểm chứng sớm các hệ thống rủi ro cao (Hidden Root, Destiny Engine, 2.5D Action Combat) ngay từ giai đoạn đầu.',
    gameplayFlow: [
      'Giai đoạn 1 (Tháng 1–4 — Core Prototype): Hoàn thiện 2.5D Isometric Action Controller, Hidden Spiritual Root Generator, Destiny Engine và vòng lặp Phàm Nhân -> Trúc Cơ.',
      'Giai đoạn 2 (Tháng 5–10 — Vertical Slice): Hoàn thiện 1 vùng bản đồ lớn, 16 loại Linh Căn, hệ thống Đột Phá Độ Kiếp thực chiến, 3 Bí Cảnh và 20+ Kỹ năng Ngũ Hành.',
      'Giai đoạn 3 (Tháng 11–18 — Closed Beta MMORPG): Tích hợp mạng Sharded World Server, Tông Môn Chiến, Kinh Tế Đấu Giá, Luyện Đan/Luyện Khí và mở tới cảnh giới Hóa Thần.',
      'Giai đoạn 4 (Tháng 19–24 — Global Launch & Immortal Realm): Hoàn thiện 12 Đại Cảnh Giới, Phi Thăng Tiên Giới, tối ưu đa nền tảng PC/Mobile và hệ thống Kỷ Nguyên LiveOps.',
    ],
    operatingRules: [
      'Mỗi cột mốc (Milestone) đều phải vượt qua cổng kiểm duyệt Playtest thực tế và kiểm thử tải mạng trước khi mở rộng quy mô sản xuất tài nguyên.',
    ],
    inputData: [
      'Engineering_Velocity, Playtest_Retention_Metrics, Server_Load_Benchmarks.',
    ],
    outputData: [
      'Shippable_Milestone_Builds, Balance_Iteration_Patches.',
    ],
    edgeCases: [
      'Phát sinh độ trễ khi sản xuất lượng lớn nội dung Bí Cảnh thủ công: Kết hợp Procedural Dungeon Layout với các phòng Boss và Kỳ Ngộ thiết kế tay chất lượng cao.',
    ],
    systemInteractions: [
      'Điều phối tiến độ xây dựng từ Hệ thống 01 đến Hệ thống 25.',
    ],
    technicalRisks: [
      'Mở rộng phạm vi tính năng quá sớm (Scope Creep) trước khi hệ thống Chiến đấu và Cơ duyên đạt độ hoàn thiện cao.',
    ],
    testingStrategy: [
      'Áp dụng quy trình kiểm thử tự động CI/CD và đánh giá cổng chất lượng (Quality Gate) mỗi 2 tuần.',
    ],
  },
  {
    id: 25,
    title: '25. MVP Scope & Playable Vertical Slice (Phạm Vi MVP Triển Khai Thực Tế)',
    category: 'Kỹ Thuật & Vận Hành',
    summary:
      'Định nghĩa phạm vi MVP / Vertical Slice có thể chơi và kiểm chứng ngay lập tức: Trải nghiệm Phàm Nhân -> Luyện Khí 12 Tầng -> Trúc Cơ -> Kết Đan trên chiến trường 2.5D.',
    purpose:
      'Cung cấp một bản dựng thực chiến hoàn chỉnh ngay trong ứng dụng này để kiểm chứng trực tiếp cảm giác chiến đấu 2.5D, khám phá Linh Căn ẩn, kích hoạt Cơ Duyên và vượt Thiên Kiếp.',
    gameplayFlow: [
      'Bước vào màn hình Khởi Đầu (Title Screen) với cảnh quan 2.5D sống động, tạo nhân vật với Hạt Giống Mệnh Cách (Fate Seed) khi mọi tư chất còn ẩn giấu.',
      'Điều khiển nhân vật trên bản đồ 2.5D Isometric, chiến đấu với 4 chủng loại Yêu Thú & Tà Tu (có vòng cảnh báo chiêu thức rõ ràng), thu thập Linh Tinh và khám phá Cổ Bi / Động Phủ.',
      'Trải nghiệm hệ thống Tự Khám Phá Linh Căn qua từng tầng Luyện Khí, lựa chọn nhánh hành động khi gặp Kỳ Ngộ và trực tiếp điều khiển nhân vật vượt Thiên Kiếp Lôi để bước vào Trúc Cơ / Kết Đan!',
    ],
    operatingRules: [
      'Bản Vertical Slice tích hợp sẵn cả 2 chế độ: Thực Chiến 2.5D (Playable Game) và Toàn Thư Thiết Kế 25 Hệ Thống + Máy Mô Phỏng Server RNG (Architect Codex).',
      'Mọi công thức tính toán Linh Căn, Cơ Duyên và Đột Phá đều chạy trên bộ quy tắc thật (`src/game/rules.ts`) đã được kiểm chứng bằng Unit Test.',
    ],
    inputData: [
      'RealTime_Player_Inputs, Seeded_Server_Logic, Interactive_GDD_Inspector.',
    ],
    outputData: [
      '60FPS_2.5D_Playable_Experience, Complete_25_System_Engineering_Blueprint.',
    ],
    edgeCases: [
      'Người dùng muốn kiểm tra nhanh các loại Linh Căn khác nhau mà không cần cày lại từ đầu: Trong Toàn Thư GDD tích hợp sẵn "Đài Mô Phỏng Server Fate Seed" cho phép thử nghiệm bất kỳ hạt giống mệnh cách nào tức thì.',
    ],
    systemInteractions: [
      'Tổng hợp tinh hoa của toàn bộ 24 chương thiết kế thành sản phẩm tương tác thực tế.',
    ],
    technicalRisks: [
      'Đảm bảo hiệu năng 60 FPS mượt mà cả trên GPU rời lẫn môi trường trình duyệt phần mềm (Software WebGL/Canvas).',
    ],
    testingStrategy: [
      'Kiểm thử bằng bộ Unit Tests (`node:test`) kết hợp kiểm thử trình duyệt thực tế (`playwright-cli` ở độ phân giải 1440x900).',
    ],
  },
];
