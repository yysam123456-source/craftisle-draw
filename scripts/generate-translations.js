const fs = require('fs');
const path = require('path');

const translations = {
  en: {
    nav: { home: "Home", boards: "My Boards", newBoard: "New Board", signIn: "Sign In", signOut: "Sign Out" },
    home: { title: "Free Online Whiteboard", description: "Create hand-drawn diagrams, flowcharts, and collaborative boards with Craftisle Draw. Free online whiteboard tool powered by Excalidraw." },
    seo: { title: "Free Online Whiteboard | Craftisle Draw", description: "Create hand-drawn diagrams, flowcharts, and collaborative boards. No signup required. Real-time collaboration, infinite canvas, export to PNG/SVG.", keywords: "free online whiteboard no sign up, online whiteboard for teaching, collaborative whiteboard real time free, hand drawn diagram tool online, flowchart maker online free, mind map online free, virtual whiteboard for remote teams, brainstorming tool online free, excalidraw alternative free, whiteboard for agile teams" }
  },
  es: {
    nav: { home: "Inicio", boards: "Mis Pizarras", newBoard: "Nueva Pizarra", signIn: "Iniciar Sesión", signOut: "Cerrar Sesión" },
    home: { title: "Pizarra Online Gratis", description: "Crea diagramas dibujados a mano, diagramas de flujo y pizarras colaborativas con Craftisle Draw. Herramienta de pizarra online gratuita." },
    seo: { title: "Pizarra Online Gratis | Craftisle Draw", description: "Crea diagramas, flujogramas y pizarras colaborativas. Sin registro. Colaboración en tiempo real, lienzo infinito, exportar a PNG/SVG.", keywords: "pizarra online gratis sin registro, pizarra online para enseñanza, pizarra colaborativa tiempo real gratis, herramienta diagramas dibujados mano online, creador flujogramas online gratis, mapa mental online gratis, pizarra virtual para equipos remotos, herramienta lluvia ideas online gratis, alternativa excalidraw gratis, pizarra para equipos agiles" }
  },
  ja: {
    nav: { home: "ホーム", boards: "マイボード", newBoard: "新規ボード", signIn: "サインイン", signOut: "サインアウト" },
    home: { title: "無料オンライン白板", description: "Craftisle Drawで手描き図解、フローチャート、コラボレーティブボードを作成。Excalidraw搭載の無料オンライン白板ツール。" },
    seo: { title: "無料オンライン白板 | Craftisle Draw", description: "手描き図解、フローチャート、コラボレーティブボードを作成。登録不要。リアルタイムコラボレーション、無限キャンバス、PNG/SVGエクスポート。", keywords: "無料オンライン白板 登録不要, オンライン白板 教育, リアルタイムコラボレーティブ白板 無料, 手描き図解ツール オンライン, フローチャート作成 オンライン 無料, マインドマップ オンライン 無料, リモートチーム用仮想白板, ブレインストーミングツール オンライン 無料, excalidraw 代替 無料, アジャイルチーム用白板" }
  },
  de: {
    nav: { home: "Startseite", boards: "Meine Pinnwände", newBoard: "Neue Pinnwand", signIn: "Anmelden", signOut: "Abmelden" },
    home: { title: "Kostenlose Online-Pinnwand", description: "Erstellen Sie handgezeichnete Diagramme, Flussdiagramme und kollaborative Pinnwände mit Craftisle Draw. Kostenloses Online-Pinnwand-Tool." },
    seo: { title: "Kostenlose Online-Pinnwand | Craftisle Draw", description: "Erstellen Sie handgezeichnete Diagramme, Flussdiagramme und kollaborative Pinnwände. Keine Anmeldung erforderlich. Echtzeit-Zusammenarbeit, unendlicher Leinwand, Export zu PNG/SVG.", keywords: "kostenlose online pinnwand ohne anmeldung, online pinnwand für unterricht, kollaborative pinnwand echtzeit kostenlos, handgezeichnete diagramm tool online, flussdiagramm erstellung online kostenlos, mindmap online kostenlos, virtuelle pinnwand für remote teams, brainstorming tool online kostenlos, excalidraw alternative kostenlos, pinnwand für agile teams" }
  },
  fr: {
    nav: { home: "Accueil", boards: "Mes Tableaux", newBoard: "Nouveau Tableau", signIn: "Se Connecter", signOut: "Se Déconnecter" },
    home: { title: "Tableau Blanc En Ligne Gratuit", description: "Créez des diagrammes dessinés à la main, des organigrammes et des tableaux colaboratifs avec Craftisle Draw. Outil de tableau blanc en ligne gratuit." },
    seo: { title: "Tableau Blanc En Ligne Gratuit | Craftisle Draw", description: "Créez des diagrammes, des organigrammes et des tableaux colaboratifs. Sans inscription. Colaboration en temps réel, canevas infini, export vers PNG/SVG.", keywords: "tableau blanc en ligne gratuit sans inscription, tableau blanc en ligne pour enseignement, tableau colaboratif temps réel gratuit, outil diagramme dessiné main en ligne, creador d'organigramme en ligne gratuit, carte mentale en ligne gratuite, tableau blanc virtuel pour équipes distantes, outil de remue-méninges en ligne gratuit, alternative excalidraw gratuite, tableau blanc pour équipes agiles" }
  },
  pt: {
    nav: { home: "Início", boards: "Meus Quadros", newBoard: "Novo Quadro", signIn: "Entrar", signOut: "Sair" },
    home: { title: "Quadro Online Grátis", description: "Crie diagramas desenhados à mão, fluxogramas e quadros colaborativos com o Craftisle Draw. Ferramenta de quadro online grátis." },
    seo: { title: "Quadro Online Grátis | Craftisle Draw", description: "Crie diagramas, fluxogramas e quadros colaborativos. Sem cadastro. Colaboração em tempo real, canvas infinito, exportar para PNG/SVG.", keywords: "quadro online grátis sem cadastro, quadro online para ensino, quadro colaborativo tempo real grátis, ferramenta diagrama desenhado à mão online, creador de fluxograma online grátis, mapa mental online grátis, quadro virtual para equipes remotas, ferramenta brainstorm online grátis, alternativa excalidraw grátis, quadro para equipes ágeis" }
  },
  ru: {
    nav: { home: "Главная", boards: "Мои Доски", newBoard: "Новая Доска", signIn: "Войти", signOut: "Выйти" },
    home: { title: "Бесплатная Онлайн-Доска", description: "Создавайте рисованные от руки диаграммы, блок-схемы и совместные доски с Craftisle Draw. Бесплатный онлайн-инструмент." },
    seo: { title: "Бесплатная Онлайн-Доска | Craftisle Draw", description: "Создавайте рисованные диаграммы, блок-схемы и совместные доски. Без регистрации. Совместная работа в реальном времени, бесконечный холст, экспорт в PNG/SVG.", keywords: "бесплатная онлайн доска без регистрации, онлайн доска для обучения, совместная доска реальное время бесплатно, инструмент рисованные диаграммы онлайн, создание блок схем онлайн бесплатно, карта памяти онлайн бесплатно, виртуальная доска для удаленных команд, инструмент мозговой штурм онлайн бесплатно, excalidraw альтернатива бесплатно, доска для гибких команд" }
  },
  ko: {
    nav: { home: "홈", boards: "내 보드", newBoard: "새 보드", signIn: "로그인", signOut: "로그아웃" },
    home: { title: "무료 온라인 화이트보드", description: "Craftisle Draw로 손으로 그린 다이어그램, 순서도 및 협업 보드를 만드세요. Excalidraw 기반 무료 온라인 화이트보드 도구." },
    seo: { title: "무료 온라인 화이트보드 | Craftisle Draw", description: "손으로 그린 다이어그램, 순서도 및 협업 보드를 만드세요. 회원 가입 불필요. 리얼타임 협업, 무한 캔버스, PNG/SVG 내보내기.", keywords: "무료 온라인 화이트보드 회원가입불필요, 온라인 화이트보드 교육, 리얼타임 협업 화이트보드 무료, 손으로 그린 다이어그램 도구 온라인, 순서도 만들기 온라인 무료, 마인드맵 온라인 무료, 원격 팀용 가상 화이트보드, 브레인스토밍 도구 온라인 무료, excalidraw 대안 무료, 에자일 팀용 화이트보드" }
  },
  ar: {
    nav: { home: "الرئيسية", boards: "لوحاتي", newBoard: "لوحة جديدة", signIn: "تسجيل الدخول", signOut: "تسجيل الخروج" },
    home: { title: "لوحة بيضاء مجانية عبر الإنترنت", description: "أنشئ diagrams مرسومة باليد، ومخططات تدفق، وسبورات تعاونية مع Craftisle Draw. أداة سبورة عبر الإنترنت مجانية." },
    seo: { title: "لوحة بيضاء مجانية عبر الإنترنت | Craftisle Draw", description: "أنشئ diagrams مرسومة باليد، ومخططات تدفق، وسبورات تعاونية. بدون تسجيل. تعاون في الوقت الحقيقي، قماش لانهائي، تصدير إلى PNG/SVG.", keywords: "لوحة بيضاء مجانية عبر الإنترنت بدون تسجيل, لوحة بيضاء عبر الإنترنت للتعليم, لوحة تعاونية في الوقت الحقيقي مجانية, أداة diagrams مرسومة باليد عبر الإنترنت, منشئ مخططات تدفق عبر الإنترنت مجاني, خريطة ذهنية عبر الإنترنت مجانية, لوحة بيضاء افتراضية للفرق البعيدة, أداة العصف الذهني عبر الإنترنت مجانية, بديل excalidraw مجاني, لوحة بيضاء للفرق الرشيقة" }
  },
  it: {
    nav: { home: "Home", boards: "Le Mie Lavagne", newBoard: "Nuova Lavagna", signIn: "Accedi", signOut: "Esci" },
    home: { title: "Lavagna Online Gratuita", description: "Crea diagrammi disegnati a mano, diagrammi di flusso e lavagne colaborative con Craftisle Draw. Strumento lavagna online gratuito." },
    seo: { title: "Lavagna Online Gratuita | Craftisle Draw", description: "Crea diagrammi disegnati a mano, diagrammi di flusso e lavagne colaborative. Senza registrazione. Collaborazione in tempo reale, tela infinita, esporta in PNG/SVG.", keywords: "lavagna online gratuita senza registrazione, lavagna online per l'insegnamento, lavagna colaborativa tempo reale gratuita, strumento diagrammi disegnati a mano online, creadore diagrammi di flusso online gratuito, mappa mentale online gratuita, lavagna virtuale per team remoti, strumento brainstorming online gratuito, alternativa excalidraw gratuita, lavagna per team agili" }
  },
  tr: {
    nav: { home: "Ana Sayfa", boards: "Tahtalarım", newBoard: "Yeni Tahta", signIn: "Giriş Yap", signOut: "Çıkış Yap" },
    home: { title: "Ücretsiz Online Beyaz Tahta", description: "Craftisle Draw ile el ile çizilmiş diyagramlar, akış şemaları ve iş birlikçi tahtalar oluşturun. Excalidraw tabanlı ücretsiz online beyaz tahta aracı." },
    seo: { title: "Ücretsiz Online Beyaz Tahta | Craftisle Draw", description: "El ile çizilmiş diyagramlar, akış şemaları ve iş birlikçi tahtalar oluşturun. Kayit gerekmez. Gerçek zamanlı iş birliği, sonsuz tuval, PNG/SVG'ye dışa aktar.", keywords: "ücretsiz online beyaz tahta kayit gerekmez, online beyaz tahta eğitim için, gerçek zamanlı iş birlikçi tahta ücretsiz, el ile çizilmiş diyagram aracı online, akış şeması oluşturucu online ücretsiz, zihin haritası online ücretsiz, uzaktan takımlar için sanal tahta, beyin fırtınası aracı online ücretsiz, excalidraw alternatifi ücretsiz, çevik takımlar için tahta" }
  },
  id: {
    nav: { home: "Beranda", boards: "Papan Saya", newBoard: "Papan Baru", signIn: "Masuk", signOut: "Keluar" },
    home: { title: "Papan Tulis Online Gratis", description: "Buat diagram tangan, diagram alir, dan papan kolaboratif dengan Craftisle Draw. Alat papan tulis online gratis." },
    seo: { title: "Papan Tulis Online Gratis | Craftisle Draw", description: "Buat diagram tangan, diagram alir, dan papan kolaboratif. Tanpa daftar. Kolaborasi waktu nyata, kanvas tak terbatas, ekspor ke PNG/SVG.", keywords: "papan tulis online gratis tanpa daftar, papan tulis online untuk pengajaran, papan kolaboratif waktu nyata gratis, alat diagram tangan online, pembuat diagram alir online gratis, peta pikiran online gratis, papan virtual untuk tim remote, alat brainstorming online gratis, alternatif excalidraw gratis, papan untuk tim agil" }
  },
  vi: {
    nav: { home: "Trang chủ", boards: "Bảng Của Tôi", newBoard: "Bảng Mới", signIn: "Đăng Nhập", signOut: "Đăng Xuất" },
    home: { title: "Bảng Trắng Online Miễn Phí", description: "Tạo biểu đồ vẽ tay, sơ đồ luồng và bảng cộng tác với Craftisle Draw. Công cụ bảng trắng online miễn phí." },
    seo: { title: "Bảng Trắng Online Miễn Phí | Craftisle Draw", description: "Tạo biểu đồ vẽ tay, sơ đồ luồng và bảng cộng tác. Không cần đăng ký. Cộng tác thời gian thực, canvas vô hạn, xuất sang PNG/SVG.", keywords: "bảng trắng online miễn phí không đăng ký, bảng trắng online cho giảng dạy, bảng cộng tác thời gian thực miễn phí, công cụ biểu đồ vẽ tay online, trình tạo sơ đồ luồng online miễn phí, bản đồ tư duy online miễn phí, bảng ảo cho đội ngũ từ xa, công cụ brainstorm online miễn phí, excalidraw thay thế miễn phí, bảng cho đội ngũ nhanh nhẹn" }
  },
  ro: {
    nav: { home: "Acasă", boards: "Tablele Mele", newBoard: "Tabel Nouă", signIn: "Autentificare", signOut: "Deconectare" },
    home: { title: "Tablă Albă Online Gratuită", description: "Creați diagrame desenate de mână, diagrame de flux și table colaborative cu Craftisle Draw. Instrument de tablă albă online gratuit." },
    seo: { title: "Tablă Albă Online Gratuită | Craftisle Draw", description: "Creați diagrame desenate de mână, diagrame de flux și table colaborative. Fără înregistrare. Colaborare în timp real, canevas infinit, export către PNG/SVG.", keywords: "tabelă albă online gratuită fără înregistrare, tabelă albă online pentru învățământ, tabelă colaborativă timp real gratuită, instrument diagramme desenate de mână online, creador diagrame de flux online gratuit, hartă mentală online gratuită, tabelă virtuală pentru echipe la distanță, instrument brainstorming online gratuit, alternativă excalidraw gratuită, tabelă pentru echipe agile" }
  },
  zh: {
    nav: { home: "首页", boards: "我的白板", newBoard: "新建白板", signIn: "登录", signOut: "退出" },
    home: { title: "免费在线白板", description: "使用 Craftisle Draw 创建手绘图表、流程图和协作白板。由 Excalidraw 提供支持的免费在线白板工具。" },
    seo: { title: "免费在线白板 | Craftisle Draw", description: "创建手绘图表、流程图和协作白板。无需注册。实时协作、无限画布、导出为 PNG/SVG。", keywords: "免费在线白板无需注册, 在线白板教学, 实时协作白板免费, 手绘图表工具在线, 流程图制作在线免费, 思维导图在线免费, 远程团队虚拟白板, 头脑风暴工具在线免费, excalidraw 免费替代, 敏捷团队白板" }
  },
  "zh-Tw": {
    nav: { home: "首頁", boards: "我的白板", newBoard: "新建白板", signIn: "登入", signOut: "登出" },
    home: { title: "免費在線白板", description: "使用 Craftisle Draw 創建手繪圖表、流程圖和協作白板。由 Excalidraw 提供支援的免費在線白板工具。" },
    seo: { title: "免費在線白板 | Craftisle Draw", description: "創建手繪圖表、流程圖和協作白板。無需註冊。實時協作、無限畫布、匯出為 PNG/SVG。", keywords: "免費在線白板無需註冊, 在線白板教學, 實時協作白板免費, 手繪圖表工具在線, 流程圖製作在線免費, 思維導圖在線免費, 遠程團隊虛擬白板, 頭腦風暴工具在線免費, excalidraw 免費替代, 敏捷團隊白板" }
  }
};

const messagesDir = path.join(__dirname, '..', 'messages');

Object.entries(translations).forEach(([locale, data]) => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Created ${locale}.json`);
});

console.log('\n✅ All translation files created successfully!');
