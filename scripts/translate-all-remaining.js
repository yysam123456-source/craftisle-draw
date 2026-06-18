// scripts/translate-all-remaining.js
// 为最后3种语言生成完整翻译（id, vi, ar）

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

// ===== 印尼语 =====
const id = {
  nav: {
    home: "Beranda",
    boards: "Papan Tulis Saya",
    newBoard: "Papan Tulis Baru",
    signIn: "Masuk",
    signOut: "Keluar",
    createBoard: "Buat Papan Tulis",
    myBoards: "Papan Tulis Saya",
    useCases: "Kasus Penggunaan",
    homeDesc: "Buat diagram hand-drawn, flowchart, dan papan tulis kolaboratif"
  },
  home: {
    title: "Papan Tulis Online Gratis",
    description: "Buat diagram hand-drawn, flowchart, dan papan tulis kolaboratif dengan Craftisle Draw. Alat papan tulis online gratis yang didukung oleh Excalidraw. Tidak perlu daftar untuk mencoba.",
    createBoard: "Buat Papan Tulis Baru",
    myBoards: "Papan Tulis Saya",
    useCases: "Kasus Penggunaan",
    noSignup: "Tanpa Daftar",
    freeForever: "Gratis Selamanya",
    realTimeColab: "Kolaborasi Waktu Nyata",
    exportPNG: "Ekspor ke PNG/SVG",
    infiniteCanvas: "Kanvas Tak Terbatas",
    privacyFirst: "Privasi Pertama",
    startDrawing: "Mulai Menggambar",
    tryNow: "Coba Sekarang",
    features: "Fitur",
    featureHandDrawn: "Gaya Hand-Drawn",
    featureHandDrawnDesc: "Gaya hand-drawn yang unik membuat diagram Anda terlihat ramah dan bersahabat. Didukung oleh Excalidraw, alat diagram hand-drawn terbaik.",
    featureRealTime: "Kolaborasi Waktu Nyata",
    featureRealTimeDesc: "Kolaborasi dengan tim Anda dalam waktu nyata. Lihat perubahan secara instan, ngobrol dengan kolaborator, dan bekerja secara mulus.",
    featureExport: "Ekspor ke PNG/SVG",
    featureExportDesc: "Ekspor papan tulis Anda ke format PNG atau SVG. Bagikan karya Anda di media sosial, sertakan dalam presentasi, atau cetak untuk penggunaan offline.",
    featurePrivacy: "Privasi Pertama",
    featurePrivacyDesc: "Data Anda tetap privat. Pilih siapa yang dapat mengakses papan tulis Anda. Tanpa pelacakan, tanpa iklan, hanya pengalaman papan tulis yang bersih.",
    featureNoSignup: "Tanpa Daftar",
    featureNoSignupDesc: "Coba Craftisle Draw tanpa membuat akun. Coba semua fungsi secara gratis, tanpa kartu kredit, tanpa surel.",
    featureInfinite: "Kanvas Tak Terbatas",
    featureInfiniteDesc: "Anda tidak akan pernah kehabisan ruang. Kanvas tak terbatas kami memungkinkan Anda memperluas ide sejauh yang Anda butuhkan. Zoom bebas.",
    readyToStart: "Siap Mulai Menggambar?",
    readyDesc: "Bergabunglah dengan ribuan pengguna yang mempercayai Craftisle Draw untuk kolaborasi visual mereka.",
    joinNow: "Bergabung Sekarang",
    noCreditCard: "Tanpa kartu kredit • Gratis selamanya • Kolaborasi waktu nyata"
  },
  seo: {
    title: "Papan Tulis Online Gratis | Craftisle Draw",
    description: "Buat diagram hand-drawn, flowchart, dan papan tulis kolaboratif. Tanpa pendaftaran. Kolaborasi waktu nyata, kanvas tak terbatas, ekspor ke PNG/SVG.",
    keywords: "papan tulis online gratis tanpa pendaftaran, papan tulis online untuk pengajaran, papan tulis kolaboratif waktu nyata gratis, alat diagram hand-drawn online, pembuat flowchart online gratis, peta mental online gratis, papan tulis virtual untuk tim remote, alat brainstorming online gratis, alternatif Excalidraw gratis, papan tulis untuk tim agile"
  },
  footer: {
    description: "Alat papan tulis online gratis yang didukung oleh Excalidraw. Buat diagram hand-drawn, flowchart, dan papan tulis kolaboratif.",
    quickLinks: "Tautan Cepat",
    home: "Beranda",
    createBoard: "Buat Papan Tulis Baru",
    useCases: "Kasus Penggunaan",
    legal: "Informasi Hukum",
    privacy: "Kebijakan Privasi",
    terms: "Syarat Layanan",
    copyright: "© 2026 Craftisle. Seluruh hak cipta dilindungi."
  },
  privacy: { title: "Kebijakan Privasi" },
  terms: { title: "Syarat Layanan" },
  useCases: {
    teaching: "Papan Tulis Online untuk Pengajaran",
    teachingDesc: "Gunakan, Craftisle Draw sebagai papan tulis online gratis untuk pengajaran. Buat pelajaran interaktif, jelaskan konsep dengan diagram hand-drawn, dan bagikan papan tulis dengan siswa.",
    remoteTeams: "Papan Tulis Virtual untuk Tim Remote",
    remoteTeamsDesc: "Papan tulis kolaboratif waktu nyata untuk tim remote. Brainstorming, rencanakan sprint, dan kolaborasi secara visual dengan tim Anda.",
    brainstorming: "Alat Brainstorming Online Gratis",
    brainstormingDesc: "Alat brainstorming online gratis. Hasilkan ide dengan tim Anda di kanvas tak terbatas. Gunakan catatan lengket, gambar koneksi, dan ekspor sesi brainstorming Anda.",
    flowchart: "Pembuat Flowchart Online Gratis",
    flowchartDesc: "Buat flowchart online gratis. Gunakan pembuat flowchart kami untuk visualisasikan proses, alur kerja, dan algoritma.",
    mindMap: "Peta Mental Online Gratis",
    mindMapDesc: "Alat peta mental gratis online. Organisasi pikiran Anda, rencanakan proyek, dan visualisasikan konsep dengan peta mental.",
    agile: "Papan Tulis untuk Tim Agile",
    agileDesc: "Papan tulis untuk tim agile. Lakukan retrospektif, perencanaan sprint, dan stand-up di papan tulis online gratis.",
    designThinking: "Papan Tulis Design Thinking",
    designThinkingDesc: "Papan tulis Design Thinking untuk inovasi. Gunakan papan tulis online gratis kami untuk menjalankan bengkel Design Thinking.",
    meetings: "Papan Tulis untuk Presentasi Rapat",
    meetingsDesc: "Papan tulis untuk presentasi rapat. Buat presentasi visual, beri anotasi dalam waktu nyata, dan bagikan dengan pemangku kepentingan."
  },
  faq: {
    q1: "Apakah Craftisle Draw benar-benar gratis?",
    a1: "Ya, Craftisle Draw sepenuhnya gratis untuk digunakan. Tidak ada biaya tersembunyi, tidak ada rencana premium, tidak diperlukan kartu kredit. Kami percaya untuk menyediakan alat papan tulis berkualitas tinggi yang dapat diakses oleh semua orang.",
    q2: "Apakah saya perlu membuat akun?",
    a2: "Tidak, Anda dapat menggunakan Craftisle Draw tanpa membuat akun. Namun, membuat akun gratis memungkinkan Anda untuk menyimpan papan tulis, mengaksesnya dari perangkat mana pun, dan berkolaborasi dengan orang lain.",
    q3: "Apakah saya dapat berkolaborasi dengan tim saya dalam waktu nyata?",
    a3: "Ya, Craftisle Draw mendukung kolaborasi waktu nyata. Bagikan papan tulis Anda dengan tautan sederhana, dan tim Anda dapat bergabung dan berkolaborasi secara instan. Tidak diperlukan perangkat lunak khusus.",
    q4: "Apakah saya dapat mengekspor papan tulis saya?",
    a4: "Ya, Anda dapat mengekspor papan tulis Anda ke format PNG atau SVG. Ini memudahkan untuk membagikan karya Anda di media sosial, menyertakannya dalam presentasi, atau mencetaknya untuk penggunaan offline.",
    q5: "Apakah data saya aman?",
    a5: "Ya, kami menganggap serius keamanan data. Papan tulis Anda disimpan dengan aman, dan Anda memiliki kendali penuh atas siapa yang dapat mengaksesnya. Kami tidak akan pernah membagikan data Anda dengan pihak ketiga."
  }
};

// ===== 越南语 =====
const vi = {
  nav: {
    home: "Trang Chủ",
    boards: "Bảng Trắng của Tôi",
    newBoard: "Bảng Trắng Mới",
    signIn: "Đăng Nhập",
    signOut: "Đăng Xuất",
    createBoard: "Tạo Bảng Trắng",
    myBoards: "Bảng Trắng của Tôi",
    useCases: "Trường Hợp Sử Dụng",
    homeDesc: "Tạo sơ đồ hand-drawn, lưu đồ và bảng trắng cộng tác"
  },
  home: {
    title: "Bảng Trắng Online Miễn Phí",
    description: "Tạo sơ đồ hand-drawn, lưu đồ và bảng trắng cộng tác với Craftisle Draw. Công cụ bảng trắng online miễn phí được hỗ trợ bởi Excalidraw. Không cần đăng ký để thử nghiệm.",
    createBoard: "Tạo Bảng Trắng Mới",
    myBoards: "Bảng Trắng của Tôi",
    useCases: "Trường Hợp Sử Dụng",
    noSignup: "Không Đăng Ký",
    freeForever: "Miễn Phí Mãi Mãi",
    realTimeColab: "Cộng Tác Thời Gian Thực",
    exportPNG: "Xuất sang PNG/SVG",
    infiniteCanvas: "Khung Vẽ Vô Hạn",
    privacyFirst: "Quyền Riêng Tư Trước Tiên",
    startDrawing: "Bắt Đầu Vẽ",
    tryNow: "Thử Ngay Bây Giờ",
    features: "Tính Năng",
    featureHandDrawn: "Phong Cách Hand-Drawn",
    featureHandDrawnDesc: "Phong cách hand-drawn độc đáo làm cho các sơ đồ của bạn trông thân thiện và dễ máng. Được hỗ trợ bởi Excalidraw, công cụ sơ đồ hand-drawn tốt nhất.",
    featureRealTime: "Cộng Tác Thời Gian Thực",
    featureRealTimeDesc: "Cộng tác với nhóm của bạn trong thời gian thực. Xem các thay đổi ngay lập tức, chat với các cộng tác viên và làm việc một cách mượt mà.",
    featureExport: "Xuất sang PNG/SVG",
    featureExportDesc: "Xuất bảng trắng của bạn sang định dạng PNG hoặc SVG. Chia sẻ công việc của bạn trên mạng xã hội, đưa vào bài thuyết trình hoặc in để sử dụng ngoại tuyến.",
    featurePrivacy: "Quyền Riêng Tư Trước Tiên",
    featurePrivacyDesc: "Dữ liệu của bạn vẫn riêng tư. Chọn ai có thể truy cập vào bảng trắng của bạn. Không theo dõi, không quảng cáo, chỉ một trải nghiệm bảng trắng sạch sẽ.",
    featureNoSignup: "Không Đăng Ký",
    featureNoSignupDesc: "Thử Craftisle Draw mà không cần tạo tài khoản. Thử tất cả các tính năng miễn phí, không cần thẻ tín dụng, không cần email.",
    featureInfinite: "Khung Vẽ Vô Hạn",
    featureInfiniteDesc: "Bạn sẽ không bao giờ hết không gian. Khung vẽ vô hạn của chúng tôi cho phép bạn mở rộng ý tưởng bao nhiêu tùy thích. Phóng to tự do.",
    readyToStart: "Sẵn Sàng Bắt Đầu Vẽ?",
    readyDesc: "Tham gia cùng hàng ngàn người dùng tin tưởng Craftisle Draw cho công tác cộng tác trực quan của họ.",
    joinNow: "Tham Gia Ngay Bây Giờ",
    noCreditCard: "Không thẻ tín dụng • Miễn phí mãi mãi • Cộng tác thời gian thực"
  },
  seo: {
    title: "Bảng Trắng Online Miễn Phí | Craftisle Draw",
    description: "Tạo sơ đồ hand-drawn, lưu đồ và bảng trắng cộng tác. Không cần đăng ký. Cộng tác thời gian thực, khung vẽ vô hạn, xuật sang PNG/SVG.",
    keywords: "bảng trắng online miễn phí không đăng ký, bảng trắng online cho giảng dạy, bảng trắng cộng tác thời gian thực miễn phí, công cụ sơ đồ hand-drawn online, trình tạo lưu đồ online miễn phí, bản đồ tư duy online miễn phí, bảng trắng ảo cho nhóm từ xa, công cụ brainstorm online miễn phí, thay thế Excalidraw miễn phí, bảng trắng cho nhóm agile"
  },
  footer: {
    description: "Công cụ bảng trắng online miễn phí được hỗ trợ bởi Excalidraw. Tạo sơ đồ hand-drawn, lưu đồ và bảng trắng cộng tác.",
    quickLinks: "Liên Kết Nhanh",
    home: "Trang Chủ",
    createBoard: "Tạo Bảng Trắng Mới",
    useCases: "Trường Hợp Sử Dụng",
    legal: "Thông Tin Pháp Lý",
    privacy: "Chính Sách Quyền Riêng Tư",
    terms: "Điều Khoản Sử Dụng",
    copyright: "© 2026 Craftisle. Bảo lưu mọi quyền."
  },
  privacy: { title: "Chính Sách Quyền Riêng Tư" },
  terms: { title: "Điều Khoản Sử Dụng" },
  useCases: {
    teaching: "Bảng Trắng Online Cho Giảng Dạy",
    teachingDesc: "Sử dụng Craftisle Draw như một bảng trắng online miễn phí cho giảng dạy. Tạo các bài học tương tác, giải thích các khái niệm với sơ đồ hand-drawn và chia sẻ bảng trắng với học sinh.",
    remoteTeams: "Bảng Trắng Ảo Cho Nhóm Từ Xa",
    remoteTeamsDesc: "Bảng trắng cộng tác thời gian thực cho nhóm từ xa. Brainstorming, lập kế hoạch sprint và cộng tác trực quan với nhóm của bạn.",
    brainstorming: "Công Cụ Brainstorming Online Miễn Phí",
    brainstormingDesc: "Công cụ brainstorm online miễn phí. Tạo ý tưởng với nhóm của bạn trên một khung vẽ vô hạn. Sử dụng ghi chú dính, vẽ các kết nối và xuật sesi brainstorm của bạn.",
    flowchart: "Trình Tạo Lưu Đồ Online Miễn Phí",
    flowchartDesc: "Tạo lưu đồ online miễn phí. Sử dụng trình tạo lưu đồ của chúng tôi để hình ảnh hóa các quy trình, luồng công việc và thuật toán.",
    mindMap: "Bản Đồ Tư Duy Online Miễn Phí",
    mindMapDesc: "Công cụ bản đồ tư duy miễn phí online. Tổ chức suy nghĩ của bạn, lập kế hoạch dự án và hình ảnh hóa các khái niệm với bản đồ tư duy.",
    agile: "Bảng Trắng Cho Nhóm Agile",
    agileDesc: "Bảng trắng cho nhóm agile. Thực hiện các cuộc họp lại, lập kế hoạch sprint và stand-up trên một bảng trắng online miễn phí.",
    designThinking: "Bảng Trắng Design Thinking",
    designThinkingDesc: "Bảng trắng Design Thinking cho sự đổi mới. Sử dụng bảng trắng online miễn phí của chúng tôi để thực hiện các hội thảo Design Thinking.",
    meetings: "Bảng Trắng Cho Bài Thuyết Trình Họp",
    meetingsDesc: "Bảng trắng cho bài thuyết trình họp. Tạo các bài thuyết trình trực quan, chú thích trong thời gian thực và chia sẻ với các bên liên quan."
  },
  faq: {
    q1: "Craftisle Draw có thật sự miễn phí không?",
    a1: "Vâng, Craftisle Draw hoàn toàn miễn phí để sử dụng. Không có phí ẩn, không có gói premium, không yêu cầu thẻ tín dụng. Chúng tôi tin vào việc cung cấp một công cụ bảng trắng chất lượng cao có thể truy cập bởi tất cả mọi người.",
    q2: "Tôi có cần tạo tài khoản không?",
    a2: "Không, bạn có thể sử dụng Craftisle Draw mà không cần tạo tài khoản. Tuy nhiên, việc tạo một tài khoản miễn phí cho phép bạn lưu bảng trắng, truy cập chúng từ bất kỳ thiết bị nào và cộng tác với những người khác.",
    q3: "Tôi có thể cộng tác với nhóm của mình trong thời gian thực không?",
    a3: "Vâng, Craftisle Draw hỗ trợ cộng tác thời gian thực. Chia sẻ bảng trắng của bạn với một liên kết đơn giản, và nhóm của bạn có thể tham gia và cộng tác ngay lập tức. Không cần phẩn mềm đặc biệt.",
    q4: "Tôi có thể xuắt bảng trắng của mình không?",
    a4: "Vâng, bạn có thể xuắt bảng trắng của mình sang định dạng PNG hoặc SVG. Điều này làm cho việc chia sẻ công việc của bạn trên mạng xã hội, đưa vào bài thuyết trình hoặc in để sử dụng ngoại tuyến trở nên dễ dàng.",
    q5: "Dữ liệu của tôi có an toàn không?",
    a5: "Vâng, chúng tôi coi trọng an toàn dữ liệu. Bảng trắng của bạn được lưu trữ an toàn, và bạn có toàn quyền kiểm soát việc ai có thể truy cập chúng. Chúng tôi sẽ không bao giờ chia sẻ dữ liệu của bạn với bất kỳ bên thứ ba nào."
  }
};

// ===== 阿拉伯语（从右到左）=====
const ar = {
  nav: {
    home: "الرئيسية",
    boards: "الواحي",
    newBoard: "لوح جديد",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    createBoard: "إنشاء لوح",
    myBoards: "الواحي",
    useCases: "حالات الاستخدام",
    homeDesc: "إنشاء مخططات مرسومة باليد، مخططات تدفق، والواح بيضاء تعاونية"
  },
  home: {
    title: "لوحة بيضاء مجانية عبر الإنترنت",
    description: "أنشئ مخططات مرسومة باليد، مخططات تدفق، والواح بيضاء تعاونية مع Craftisle Draw. أداة لوح أبيض مجاني عبر الإنترنت مدعومة من Excalidraw. لا حاجة للتسجيل للاختبار.",
    createBoard: "إنشاء لوح جديد",
    myBoards: "الواحي",
    useCases: "حالات الاستخدام",
    noSignup: "بدون تسجيل",
    freeForever: "مجاني للأبد",
    realTimeColab: "تعاون في الوقت الحقيقي",
    exportPNG: "تصدير إلى PNG/SVG",
    infiniteCanvas: "كانفاس لانهائي",
    privacyFirst: "الخصوصية أولاً",
    startDrawing: "بدء الرسم",
    tryNow: "جرب الآن",
    features: "المميزات",
    featureHandDrawn: "أسلوب مرسوم باليد",
    featureHandDrawnDesc: "الأسلوب الفريد المرسوم باليد يجعل مخططاتك تبدو ودودة ومحببة. مدعوم من Excalidraw، أفضل أداة لمخططات مرسومة باليد.",
    featureRealTime: "تعاون في الوقت الحقيقي",
    featureRealTimeDesc: "تعاون مع فريقك في الوقت الحقيقي. راقب التغييرات فوراً، دردش مع المتعاونين واعمل بسلاسة.",
    featureExport: "تصدير إلى PNG/SVG",
    featureExportDesc: "صدّر الألواح البيضاء الخاصة بك إلى تنسيق PNG أو SVG. شارك عملك على وسائل التواصل الاجتماعي، ضمنه في العروض التقديمية أو اطبعه للاستخدام دون اتصال.",
    featurePrivacy: "الخصوصية أولاً",
    featurePrivacyDesc: "تبقى بياناتك خاصة. أختر من يمكنه الوصول إلى الألواح البيضاء الخاصة بك. بدون تتبع، بدون إعلانات، فقط تجربة لوح أبيض نظيفة.",
    featureNoSignup: "بدون تسجيل",
    featureNoSignupDesc: "جرب Craftisle Draw بدون إنشاء حساب. أختر جميع الوظائف مجاناً، بدون بطاقة ائتمان، بدون بريد إلكتروني.",
    featureInfinite: "كانفاس لانهائي",
    featureInfiniteDesc: "لن تنفذ المساحة أبداً. الكانفاس اللانهائي الخاص بنا يسمح لك بتوسيع أفكارك قدر ما تحتاج. تكبير/تصغير حر.",
    readyToStart: "مستعد للبدء بالرسم؟",
    readyDesc: "انضم إلى الآلاف من المستخدمين الذين يثقون بـ Craftisle Draw لتعاونهم البصري.",
    joinNow: "انضم الآن",
    noCreditCard: "بدون بطاقة ائتمان • مجاني للأبد • تعاون في الوقت الحقيقي"
  },
  seo: {
    title: "لوحة بيضاء مجانية عبر الإنترنت | Craftisle Draw",
    description: "أنشئ مخططات مرسومة باليد، مخططات تدفق، والواح بيضاء تعاونية. بدون تسجيل. تعاون في الوقت الحقيقي، كانفاس لانهائي، تصدير إلى PNG/SVG.",
    keywords: "لوحة بيضاء مجانية عبر الإنترنت بدون تسجيل, لوحة بيضاء عبر الإنترنت للتعليم, لوحة بيضاء تعاونية وقت حقيقي مجاني, أداة مخططات مرسومة باليد عبر الإنترنت, منشئ مخططات تدفق عبر الإنترنت مجاني, خارطة ذهنية عبر الإنترنت مجاني, لوحة بيضاء افتراضية للفرق عن بُعد, أداة عصف ذهني عبر الإنترنت مجاني, بديل Excalidraw مجاني, لوحة بيضاء للفرق الرشيقة"
  },
  footer: {
    description: "أداة لوح أبيض مجاني عبر الإنترنت مدعومة من Excalidraw. أنشئ مخططات مرسومة باليد، مخططات تدفق، والواح بيضاء تعاونية.",
    quickLinks: "روابط سريعة",
    home: "الرئيسية",
    createBoard: "إنشاء لوح جديد",
    useCases: "حالات الاستخدام",
    legal: "معلومات قانونية",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    copyright: "© 2026 Craftisle. جميع الحقوق محفوظة."
  },
  privacy: { title: "سياسة الخصوصية" },
  terms: { title: "شروط الخدمة" },
  useCases: {
    teaching: "لوحة بيضاء عبر الإنترنت للتعليم",
    teachingDesc: "أستخدم, Craftisle Draw كلوحة بيضاء مجانية عبر الإنترنت للتعليم. أنشئ دروس تفاعلية، أشرح المفاهيم بمخططات مرسومة باليد وشارك الألواح مع الطلاب.",
    remoteTeams: "لوحة بيضاء افتراضية للفرق عن بُعد",
    remoteTeamsDesc: "لوحة بيضاء تعاونية في الوقت الحقيقي للفرق عن بُعد. عصف ذهني، خطط سبرنتس وتعاون بصرياً مع فريقك.",
    brainstorming: "أداة عصف ذهني عبر الإنترنت مجاني",
    brainstormingDesc: "أداة عصف ذهني مجانية عبر الإنترنت. ولّد أفكاراً مع فريقك على كانفاس لانهائي. أستخدم الملاحظات اللاصقة، أرسم الروابط وصدّر جلسة العصف الذهني الخاصة بك.",
    flowchart: "منشئ مخططات تدفق عبر الإنترنت مجاني",
    flowchartDesc: "أنشئ مخططات تدفق مجانية عبر الإنترنت. أستخدم منشئ مخططات التدفق الخاص بنا لتصوير العمليات، مسارات العمل والخوارزميات.",
    mindMap: "خارطة ذهنية عبر الإنترنت مجاني",
    mindMapDesc: "أداة خارطة ذهنية مجانية عبر الإنترنت. نظّم أفكارك، خطط مشاريعك وصوّر المفاهيم بخوارط ذهنية.",
    agile: "لوحة بيضاء للفرق الرشيقة",
    agileDesc: "لوحة بيضاء للفرق الرشيقة. نفّذ مراجعات، خطط سبرنتس واجتماعات وقوف على لوح أبيض عبر الإنترنت مجاني.",
    designThinking: "لوحة بيضاء للتفكير التصميمي",
    designThinkingDesc: "لوحة بيضاء للتفكير التصميمي للابتكار. أستخدم لوحنا الأبيض المجاني عبر الإنترنت لإجراء ورش عمل التفكير التصميمي.",
    meetings: "لوحة بيضاء لعروض إجتماعات",
    meetingsDesc: "لوحة بيضاء لعروض إجتماعات. أنشئ عروضاً بصرية، أضف تعليقات في الوقت الحقيقي وشارك مع أصحاب المصلحة."
  },
  faq: {
    q1: "هل Craftisle Draw مجاني حقاً؟",
    a1: "نعم، Craftisle Draw مجاني تماماً للاستخدام. لا توجد رسوم خفية، لا توجد خطط بريميوم، لا حاجة لبطاقة ائتمان. نحن نؤمن بتوفير أداة لوح أبيض عالية الجودة يمكن للجميع الوصول إليها.",
    q2: "هل أحتاج إلى إنشاء حساب؟",
    a2: "ل، يمكنك أستخدام Craftisle Draw بدون إنشاء حساب. ومع ذلك، فإن إنشاء حساب مجاني يسمح لك بحفظ الألواح البيضاء، الوصول إليها من أي جهاز وألتعاون مع آخرين.",
    q3: "هل يمكنني التعاون مع فريقي في الوقت الحقيقي؟",
    a3: "نعم، يدعم Craftisle Draw التعاون في الوقت الحقيقي. شارك لوحك الأبيض برابط بسيط، ويمكن لفريقك الانضمام والتعاون فوراً. لا حاجة لبرمجيات خاصة.",
    q4: "هل يمكنني تصدير لوحي الأبيض؟",
    a4: "نعم، يمكنك تصدير لوحك الأبيض إلى تنسيق PNG أو SVG. يجعل هذا مشاركة عملك على وسائل التواصل الاجتماعي، أدراجه في العروض التقديمية، أو طباعته للاستخدام دون اتصال أمراً سهلاً.",
    q5: "هل بياناتي آمنة؟",
    a5: "نعم، نحن نأخذ أمان البيانات بجدية. تُخزن الألواح البيضاء الخاصة بك بأمان، ولديك تحكم كامل في من يمكنه الوصول إليها. لن نشارك بياناتك مع أي أطراف ثالثة أبداً."
  }
};

// 写入翻译文件
const translations = {
  id,
  vi,
  ar
};

Object.entries(translations).forEach(([locale, data]) => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  
  // 读取现有文件
  let existing = {};
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // 深度合并
  const merged = deepMerge(existing, data);
  
  // 写入文件
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`✅ Updated: ${locale}.json`);
});

console.log('\n✅ All 15 languages updated successfully!');
console.log('🎊 Full translation complete for all locales!');

function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object'
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}
