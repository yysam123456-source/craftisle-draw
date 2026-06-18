// scripts/translate-final-locales.js
// 为最后7种语言生成完整翻译（ko, it, tr, ro, id, vi, ar）

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

// ===== 韩语 =====
const ko = {
  nav: {
    home: "홈",
    boards: "내 화이트보드",
    newBoard: "새 화이트보드",
    signIn: "로그인",
    signOut: "로그아웃",
    createBoard: "화이트보드 만들기",
    myBoards: "내 화이트보드",
    useCases: "사용 사례",
    homeDesc: "손으로 그린 다이어그램, 순서도, 협업 화이트보드 만들기"
  },
  home: {
    title: "무료 온라인 화이트보드",
    description: "Craftisle Draw로 손으로 그린 다이어그램, 순서도, 협업 화이트보드를 만드세요. Excalidraw 지원 무료 온라인 화이트보드 도구. 테스트하려면 등록 필요 없음.",
    createBoard: "새 화이트보드 만들기",
    myBoards: "내 화이트보드",
    useCases: "사용 사례",
    noSignup: "등록 불필요",
    freeForever: "영구 무료",
    realTimeColab: "실시간 협업",
    exportPNG: "PNG/SVG로 내보내기",
    infiniteCanvas: "무한 캔버스",
    privacyFirst: "개인정보 보호 우선",
    startDrawing: "그리기 시작",
    tryNow: "지금 시도",
    features: "기능",
    featureHandDrawn: "손으로 그린 스타일",
    featureHandDrawnDesc: "독특한 손으로 그린 스타일이 다이어그램을 친근하고 친절하게 만듭니다. Excalidraw 지원, 최고의 손으로 그린 다이어그램 도구.",
    featureRealTime: "실시간 협업",
    featureRealTimeDesc: "팀과 실시간으로 협업하세요. 변경 사항을 즉시 보고, 협업자와 채팅하고, 원활하게 작업하세요.",
    featureExport: "PNG/SVG로 내보내기",
    featureExportDesc: "화이트보드를 PNG 또는 SVG 형식으로 내보내기. 소셜 미디어에서 작업 공유, 프레젠테이션에 포함 또는 오프라인 사용을 위해 인쇄.",
    featurePrivacy: "개인정보 보호 우선",
    featurePrivacyDesc: "데이터는 비공개로 유지. 화이트보드에 액세스할 수 있는 사람 선택. 추적 없음, 광고 없음, 순수한 화이트보드 경험.",
    featureNoSignup: "등록 불필요",
    featureNoSignupDesc: "계정 생성 없이 Craftisle Draw 시도. 모든 기능 무료 테스트, 신용카드 불필요, 이메일 불필요.",
    featureInfinite: "무한 캔버스",
    featureInfiniteDesc: "공간 부족 문제 없음. 무한 캔버스로 필요한 만큼 아이디어 확장 가능. 자유롭게 줌.",
    readyToStart: "그리기 시작할 준비되셨나요?",
    readyDesc: "Craftisle Draw를 신뢰하여 시각적 협업을 수행하는 수천 명의 사용자에 참여하세요.",
    joinNow: "지금 참여",
    noCreditCard: "신용카드 불필요 • 영구 무료 • 실시간 협업"
  },
  seo: {
    title: "무료 온라인 화이트보드 | Craftisle Draw",
    description: "손으로 그린 다이어그램, 순서도, 협업 화이트보드 만들기. 등록 불필요. 실시간 협업, 무한 캔버스, PNG/SVG로 내보내기.",
    keywords: "무료 온라인 화이트보드 등록 불필요, 교육용 온라인 화이트보드, 실시간 협업 화이트보드 무료, 온라인 손으로 그린 다이어그램 도구, 온라인 순서도 제작기 무료, 온라인 마인드 맵 무료, 원격 팀용 가상 화이트보드, 온라인 브레인스토밍 도구 무료, Excalidraw 대안 무료, 애자일 팀용 화이트보드"
  },
  footer: {
    description: "Excalidraw 지원 무료 온라인 화이트보드 도구. 손으로 그린 다이어그램, 순서도, 협업 화이트보드 만들기.",
    quickLinks: "빠른 링크",
    home: "홈",
    createBoard: "새 화이트보드 만들기",
    useCases: "사용 사례",
    legal: "법적 정보",
    privacy: "개인정보 보호정책",
    terms: "서비스 약관",
    copyright: "© 2026 Craftisle. 모든 권리 보유."
  },
  privacy: { title: "개인정보 보호정책" },
  terms: { title: "서비스 약관" },
  useCases: {
    teaching: "교육용 온라인 화이트보드",
    teachingDesc: "Craftisle Draw를 교육용 무료 온라인 화이트보드로 사용하세요. 대화형 수업 만들기, 손으로 그린 다이어그램으로 개념 설명, 학생과 화이트보드 공유.",
    remoteTeams: "원격 팀용 가상 화이트보드",
    remoteTeamsDesc: "원격 팀을 위한 실시간 협업 화이트보드. 브레인스토밍, 스프린트 계획, 팀과 시각적으로 협업.",
    brainstorming: "온라인 브레인스토밍 도구 무료",
    brainstormingDesc: "무료 온라인 브레인스토밍 도구. 무한 캔버스에서 팀과 함께 아이디어 생성. 포스트잇 사용, 연결 그리기, 브레인스토밍 세션 내보내기.",
    flowchart: "온라인 순서도 제작기 무료",
    flowchartDesc: "온라인에서 무료로 순서도 만들기. 순서도 제작기를 사용하여 프로세스, 워크플로, 알고리즘 시각화.",
    mindMap: "온라인 마인드 맵 무료",
    mindMapDesc: "무료 온라인 마인드 맵 도구. 아이디어 정리, 프로젝트 계획, 마인드 맵으로 개념 시각화.",
    agile: "애자일 팀용 화이트보드",
    agileDesc: "애자일 팀용 화이트보드. 무료 온라인 화이트보드에서 회고, 스프린트 계획, 데일리 스탠드업 수행.",
    designThinking: "디자인 씽킹 화이트보드",
    designThinkingDesc: "혁신을 위한 디자인 씽킹 화이트보드. 무료 온라인 화이트보드를 사용하여 디자인 씽킹 워크숍 수행.",
    meetings: "회의 프레젠테이션 화이트보드",
    meetingsDesc: "회의 프레젠테이션 화이트보드. 시각적 프레젠테이션 만들기, 실시간 주석 달기, 이해관계자와 공유."
  },
  faq: {
    q1: "Craftisle Draw는 정말 무료인가요?",
    a1: "네, Craftisle Draw는 완전 무료로 사용 가능합니다. 숨겨진 요금 없음, 프리미엄 플랜 없음, 신용카드 필요 없음. 우리는 모든 사람이 액세스할 수 있는 고품질 화이트보드 도구를 제공한다고 믿습니다.",
    q2: "계정을 만들어야 하나요?",
    a2: "아니요, 계정을 만들지 않고도 Craftisle Draw를 사용할 수 있습니다. 하지만 무료 계정을 만들면 화이트보드를 저장하고, 모든 기기에서 액세스하고, 다른 사람과 협업할 수 있습니다.",
    q3: "실시간으로 팀과 협업할 수 있나요?",
    a3: "네, Craftisle Draw는 실시간 협업을 지원합니다. 간단한 링크로 화이트보드 공유, 팀은 즉시 참여하여 협업 가능. 특별한 소프트웨어 필요 없음.",
    q4: "화이트보드를 내보낼 수 있나요?",
    a4: "네, 화이트보드를 PNG 또는 SVG 형식으로 내보낼 수 있습니다. 이렇게 하면 소셜 미디어에서 작업을 쉽게 공유하고, 프레젠테이션에 포함하거나 오프라인 사용을 위해 인쇄할 수 있습니다.",
    q5: "내 데이터는 안전한가요?",
    a5: "네, 우리는 데이터 보안을 진지하게 받아들입니다. 화이트보드는 안전하게 저장되며, 누가 액세스할 수 있는지에 대한 전체 제어권이 있습니다. 우리는 결코 제3자와 데이터를 공유하지 않습니다."
  }
};

// ===== 意大利语 =====
const it = {
  nav: {
    home: "Home",
    boards: "Miei Lavagne",
    newBoard: "Nuova Lavagna",
    signIn: "Accedi",
    signOut: "Esci",
    createBoard: "Crea Lavagna",
    myBoards: "Miei Lavagne",
    useCases: "Casi d'Uso",
    homeDesc: "Crea diagrammi hand-drawn, diagrammi di flusso e lavagne colaborative"
  },
  home: {
    title: "Lavagna Online Gratuita",
    description: "Crea diagrammi hand-drawn, diagrammi di flusso e lavagne colaborative con Craftisle Draw. Strumento lavagna online gratuita alimentato da Excalidraw. Nessuna registrazione richiesta per testare.",
    createBoard: "Crea Nuova Lavagna",
    myBoards: "Miei Lavagne",
    useCases: "Casi d'Uso",
    noSignup: "Senza Registrazione",
    freeForever: "Gratis per Sempre",
    realTimeColab: "Collaborazione in Tempo Reale",
    exportPNG: "Esporta in PNG/SVG",
    infiniteCanvas: "Tela Infinita",
    privacyFirst: "Privacy Prima di Tutto",
    startDrawing: "Inizia a Disegnare",
    tryNow: "Prova Ora",
    features: "Funzionalità",
    featureHandDrawn: "Stile Hand-Drawn",
    featureHandDrawnDesc: "Lo stile hand-drawn unico rende i tuoi diagrammi accoglienti e amichevoli. Alimentato da Excalidraw, il miglior strumento per diagrammi hand-drawn.",
    featureRealTime: "Collaborazione in Tempo Reale",
    featureRealTimeDesc: "Collabora con il tuo team in tempo reale. Vedi le modifiche instantaneamente, chatta con i collaboratori e lavora in modo fluido.",
    featureExport: "Esporta in PNG/SVG",
    featureExportDesc: "Esporta le tue lavagne in formato PNG o SVG. Condividi il tuo lavoro sui social media, includilo in presentazioni o stampalo per uso offline.",
    featurePrivacy: "Privacy Prima di Tutto",
    featurePrivacyDesc: "I tuoi dati rimangono privati. Scegli chi può accedere alle tue lavagne. Nessun tracciamento, nessuna pubblicità, solo un'esperienza lavagna pulita.",
    featureNoSignup: "Senza Registrazione",
    featureNoSignupDesc: "Prova Craftisle Draw senza creare un account. Prova tutte le funzionalità gratis, senza carta di credito, senza e-mail.",
    featureInfinite: "Tela Infinita",
    featureInfiniteDesc: "Non rimarrai mai senza spazio. La nostra tela infinita ti permite di espandere le tue idee quanto necessario. Zoom libero.",
    readyToStart: "Pronto per Iniziare a Disegnare?",
    readyDesc: "Unisciti a migliaia di utenti che si fidano di Craftisle Draw per la loro collaborazione visiva.",
    joinNow: "Unisciti Ora",
    noCreditCard: "Senza carta di credito • Gratis per sempre • Collaborazione in tempo reale"
  },
  seo: {
    title: "Lavagna Online Gratuita | Craftisle Draw",
    description: "Crea diagrammi hand-drawn, diagrammi di flusso e lavagne colaborative. Senza registrazione. Collaborazione in tempo reale, tela infinita, esporta in PNG/SVG.",
    keywords: "lavagna online gratuita senza registrazione, lavagna online per l'insegnamento, lavagna colaborativa tempo reale gratis, strumento diagrammi hand-drawn online, creatore diagrammi di flusso online gratis, mappa mentale online gratis, lavagna virtuale per team remoti, strumento brainstorming online gratis, alternativa Excalidraw gratis, lavagna per team agili"
  },
  footer: {
    description: "Strumento lavagna online gratuita alimentato da Excalidraw. Crea diagrammi hand-drawn, diagrammi di flusso e lavagne colaborative.",
    quickLinks: "Link Rapidi",
    home: "Home",
    createBoard: "Crea Nuova Lavagna",
    useCases: "Casi d'Uso",
    legal: "Informazioni Legali",
    privacy: "Informativa sulla Privacy",
    terms: "Termini di Servizio",
    copyright: "© 2026 Craftisle. Tutti i diritti riservati."
  },
  privacy: { title: "Informativa sulla Privacy" },
  terms: { title: "Termini di Servizio" },
  useCases: {
    teaching: "Lavagna Online per l'Insegnamento",
    teachingDesc: "Usa Craftisle Draw come lavagna online gratuita per l'insegnamento. Crea lezioni interattive, spiega concetti con diagrammi hand-drawn e condividi lavagne con studenti.",
    remoteTeams: "Lavagna Virtuale per Team Remoti",
    remoteTeamsDesc: "Lavagna colaborativa in tempo reale per team remoti. Brainstorming, pianifica sprint e collabora visualmente con il tuo team.",
    brainstorming: "Strumento di Brainstorming Online Gratis",
    brainstormingDesc: "Strumento brainstorming online gratis. Genera idee con il tuo team su una tela infinita. Usa note adesive, disegna connessioni ed esporta la tua sessione di brainstorming.",
    flowchart: "Creatore di Diagrammi di Flusso Online Gratis",
    flowchartDesc: "Crea diagrammi di flusso online gratis. Usa il nostro creatore di diagrammi di flusso per visualizzare processi, flussi di lavoro e algoritmi.",
    mindMap: "Mappa Mentale Online Gratis",
    mindMapDesc: "Strumento mappa mentale gratis online. Organizza i tuoi pensieri, pianifica progetti e visualizza concetti con mappe mentali.",
    agile: "Lavagna per Team Agili",
    agileDesc: "Lavagna per team agili. Esegui retrospecttive, pianificazione sprint e stand-up su una lavagna online gratuita.",
    designThinking: "Lavagna Design Thinking",
    designThinkingDesc: "Lavagna Design Thinking per l'innovazione. Usa la nostra lavagna online gratuita per condurre workshops di Design Thinking.",
    meetings: "Lavagna per Presentazioni di Riunioni",
    meetingsDesc: "Lavagna per presentazioni di riunioni. Crea presentazioni visive, annota in tempo reale e condividi con le parti interessate."
  },
  faq: {
    q1: "Craftisle Draw è davvero gratis?",
    a1: "Sì, Craftisle Draw è completamente gratis da usare. Nessun costo nascosto, nessun piano premium, nessuna carta di credito richiesta. Crediamo nel fornire uno strumento lavagna di alta qualità che sia accessibile a tutti.",
    q2: "Devo creare un account?",
    a2: "No, puoi usare Craftisle Draw senza creare un account. Tuttavia, creare un account gratis ti permite di salvare le tue lavagne, accedervi da qualsiasi dispositivo e collaborare con altri.",
    q3: "Posso collaborare con il mio team in tempo reale?",
    a3: "Sì, Craftisle Draw supporta la collaborazione in tempo reale. Condividi la tua lavagna con un semplice link, e il tuo team può unirsi e collaborare all'istante. Nessun software speciale richiesto.",
    q4: "Posso esportare la mia lavagna?",
    a4: "Sì, puoi esportare la tua lavagna in formato PNG o SVG. Questo rende facile condividere il tuo lavoro sui social media, includerlo in presentazioni, o stamparlo per uso offline.",
    q5: "I miei dati sono sicuri?",
    a5: "Sì, prendiamo sul serio la sicurezza dei dati. Le tue lavagne sono memorizzate in modo sicuro, e hai il pieno controllo su chi può accedervi. Non condividiamo mai i tuoi dati con terze parti."
  }
};

// 由于篇幅限制，其他语言（tr, ro, id, vi, ar）将在实际使用时补充
// 这里先写入韩语和意大利语

const translations = {
  ko,
  it,
  // tr, ro, id, vi, ar - 将在下一步添加
};

// 写入翻译文件
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

console.log('\n✅ 2 more languages updated!');
console.log('Remaining: tr, ro, id, vi, ar (5 languages)');

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
