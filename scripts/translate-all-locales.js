// scripts/translate-all-locales.js
// 为所有15种语言生成完整翻译（非占位符）

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

// 完整翻译数据（所有15种语言）
const allTranslations = {
  // ===== 中文（简体）=====
  zh: {
    nav: {
      home: "首页",
      boards: "我的白板",
      newBoard: "新建白板",
      signIn: "登录",
      signOut: "退出",
      createBoard: "创建白板",
      myBoards: "我的白板",
      useCases: "使用场景",
      homeDesc: "创建手绘图表、流程图和协作白板"
    },
    home: {
      title: "免费在线白板",
      description: "使用 Craftisle Draw 创建手绘图表、流程图和协作白板。免费在线白板工具，由 Excalidraw 提供支持。无需注册即可测试。",
      createBoard: "创建新白板",
      myBoards: "我的白板",
      useCases: "使用场景",
      noSignup: "无需注册",
      freeForever: "永久免费",
      realTimeColab: "实时协作",
      exportPNG: "导出 PNG/SVG",
      infiniteCanvas: "无限画布",
      privacyFirst: "隐私优先",
      startDrawing: "开始绘图",
      tryNow: "立即试用",
      features: "功能特点",
      featureHandDrawn: "手绘风格",
      featureHandDrawnDesc: "独特的手绘风格让您的图表看起来亲切友好。由 Excalidraw 提供支持，最佳的手绘图表工具。",
      featureRealTime: "实时协作",
      featureRealTimeDesc: "与您的团队实时协作。即时查看更改，与协作者聊天，无缝协作。",
      featureExport: "导出 PNG/SVG",
      featureExportDesc: "将您的白板导出为 PNG 或 SVG 格式。在社交媒体上分享您的作品，包含在演示文稿中，或打印供离线使用。",
      featurePrivacy: "隐私优先",
      featurePrivacyDesc: "您的数据保持私密。选择谁可以访问您的白板。无跟踪，无广告，纯粹的白色板体验。",
      featureNoSignup: "无需注册",
      featureNoSignupDesc: "无需创建帐户即可试用 Craftisle Draw。免费测试所有功能，无需信用卡，无需电子邮件。",
      featureInfinite: "无限画布",
      featureInfiniteDesc: "永远不会有空间不足的问题。我们的无限画布让您可以随心所欲地扩展您的想法。自由缩放。",
      readyToStart: "准备开始绘图？",
      readyDesc: "加入成千上万信任 Craftisle Draw 进行视觉协作的用户。",
      joinNow: "立即加入",
      noCreditCard: "无需信用卡 • 永久免费 • 实时协作"
    },
    seo: {
      title: "免费在线白板 | Craftisle Draw",
      description: "创建手绘图表、流程图和协作白板。无需注册。实时协作，无限画布，导出为 PNG/SVG。",
      keywords: "免费在线白板无需注册, 在线白板教学, 协作白板实时免费, 手绘图表工具在线, 流程图制作器在线免费, 思维导图在线免费, 远程团队虚拟白板, 头脑风暴工具在线免费, Excalidraw 替代品免费, 敏捷团队白板"
    },
    footer: {
      description: "免费在线白板工具，由 Excalidraw 提供支持。创建手绘图表、流程图和协作白板。",
      quickLinks: "快速链接",
      home: "首页",
      createBoard: "创建新白板",
      useCases: "使用场景",
      legal: "法律信息",
      privacy: "隐私政策",
      terms: "服务条款",
      copyright: "© 2026 Craftisle. 保留所有权利。"
    },
    privacy: { title: "隐私政策" },
    terms: { title: "服务条款" },
    useCases: {
      teaching: "在线白板教学",
      teachingDesc: "使用 Craftisle Draw 作为免费在线白板进行教学。创建互动课程，用 hand-drawn 图表解释概念，并与学生分享白板。",
      remoteTeams: "远程团队虚拟白板",
      remoteTeamsDesc: "实时协作白板，适用于远程团队。头脑风暴，规划冲刺，与您的团队进行视觉协作。",
      brainstorming: "头脑风暴工具在线免费",
      brainstormingDesc: "免费在线头脑风暴工具。在无限画布上与您的团队一起产生想法。使用便利贴，绘制连接，并导出您的头脑风暴会议。",
      flowchart: "流程图制作器在线免费",
      flowchartDesc: "在线免费创建流程图。使用我们的流程图制作器可视化流程、工作流和算法。",
      mindMap: "思维导图在线免费",
      mindMapDesc: "免费思维导图工具在线。组织您的想法，规划项目，并使用思维导图可视化概念。",
      agile: "敏捷团队白板",
      agileDesc: "敏捷团队白板。在免费在线白板上进行回顾、冲刺规划和每日站会。",
      designThinking: "设计思维白板",
      designThinkingDesc: "创新设计思维白板。使用我们的免费在线白板进行设计思维工作坊。",
      meetings: "会议演示白板",
      meetingsDesc: "会议演示白板。创建视觉演示，实时注释，并与利益相关者分享。"
    },
    faq: {
      q1: "Craftisle Draw 真的免费吗？",
      a1: "是的，Craftisle Draw 完全免费使用。没有隐藏费用，没有高级计划，不需要信用卡。我们相信提供高质量的白色板工具，让每个人都能使用。",
      q2: "我需要创建帐户吗？",
      a2: "不需要，您可以在不创建帐户的情况下使用 Craftisle Draw。但是，创建免费帐户可以让您保存白板，从任何设备访问它们，并与其他人协作。",
      q3: "我可以实时与我的团队协作用吗？",
      a3: "是的，Craftisle Draw 支持实时协作。通过简单的链接分享您的白板，您的团队可以立即加入并协作。不需要特殊的软件。",
      q4: "我可以导出我的白板吗？",
      a4: "是的，您可以将白板导出为 PNG 或 SVG 格式。这使您可以轻松地在社交媒体上分享您的作品，包含在演示文稿中，或打印供离线使用。",
      q5: "我的数据安全吗？",
      a5: "是的，我们认真对待数据安全。您的白板安全存储，您完全控制谁可以访问它们。我们绝不会与第三方分享您的数据。"
    }
  },

  // ===== 中文（繁体）=====
  "zh-TW": {
    nav: {
      home: "首頁",
      boards: "我的白板",
      newBoard: "新增白板",
      signIn: "登入",
      signOut: "登出",
      createBoard: "建立白板",
      myBoards: "我的白板",
      useCases: "使用場景",
      homeDesc: "建立手繪圖表、流程圖和協作白板"
    },
    home: {
      title: "免費在線白板",
      description: "使用 Craftisle Draw 建立手繪圖表、流程圖和協作白板。免費在線白板工具，由 Excalidraw 提供支持。無需註冊即可測試。",
      createBoard: "建立新白板",
      myBoards: "我的白板",
      useCases: "使用場景",
      noSignup: "無需註冊",
      freeForever: "永久免費",
      realTimeColab: "即時協作",
      exportPNG: "匯出 PNG/SVG",
      infiniteCanvas: "無限畫布",
      privacyFirst: "隱私優先",
      startDrawing: "開始繪圖",
      tryNow: "立即試用",
      features: "功能特點",
      featureHandDrawn: "手繪風格",
      featureHandDrawnDesc: "獨特的手繪風格讓您的圖表看起來親切友好。由 Excalidraw 提供支持，最佳的手繪圖表工具。",
      featureRealTime: "即時協作",
      featureRealTimeDesc: "與您的團隊即時協作。即時查看更改，與協作者聊天，無縫協作。",
      featureExport: "匯出 PNG/SVG",
      featureExportDesc: "將您的白板匯出為 PNG 或 SVG 格式。在社群媒體上分享您的作品，包含在簡報中，或列印供離線使用。",
      featurePrivacy: "隱私優先",
      featurePrivacyDesc: "您的資料保持私密。選擇誰可以存取您的白板。無追蹤，無廣告，純粹的白色板體驗。",
      featureNoSignup: "無需註冊",
      featureNoSignupDesc: "無需建立帳戶即可試用 Craftisle Draw。免費測試所有功能，無需信用卡，無需電子郵件。",
      featureInfinite: "無限畫布",
      featureInfiniteDesc: "永遠不會有空間不足的問題。我們的無限畫布讓您可以隨心所欲地擴展您的想法。自由縮放。",
      readyToStart: "準備開始繪圖？",
      readyDesc: "加入成千上萬信任 Craftisle Draw 進行視覺協作的使用者。",
      joinNow: "立即加入",
      noCreditCard: "無需信用卡 • 永久免費 • 即時協作"
    },
    seo: {
      title: "免費在線白板 | Craftisle Draw",
      description: "建立手繪圖表、流程圖和協作白板。無需註冊。即時協作，無限畫布，匯出為 PNG/SVG。",
      keywords: "免費在線白板無需註冊, 在線白板教學, 協作白板即時免費, 手繪圖表工具在線, 流程圖製作器在線免費, 思維導圖在線免費, 遠端團隊虛擬白板, 腦力激盪工具在線免費, Excalidraw 替代品免費, 敏捷團隊白板"
    },
    footer: {
      description: "免費在線白板工具，由 Excalidraw 提供支持。建立手繪圖表、流程圖和協作白板。",
      quickLinks: "快速連結",
      home: "首頁",
      createBoard: "建立新白板",
      useCases: "使用場景",
      legal: "法律資訊",
      privacy: "隱私政策",
      terms: "服務條款",
      copyright: "© 2026 Craftisle. 保留所有權利。"
    },
    privacy: { title: "隱私政策" },
    terms: { title: "服務條款" },
    useCases: {
      teaching: "在線白板教學",
      teachingDesc: "使用 Craftisle Draw 作為免費在線白板進行教學。建立互動課程，用 hand-drawn 圖表解釋概念，並與學生分享白板。",
      remoteTeams: "遠端團隊虛擬白板",
      remoteTeamsDesc: "即時協作白板，適用於遠端團隊。腦力激盪，規劃衝刺，與您的團隊進行視覺協作。",
      brainstorming: "腦力激盪工具在線免費",
      brainstormingDesc: "免費在線腦力激盪工具。在無限畫布上與您的團隊一起產生想法。使用便利貼，繪製連接，並匯出您的腦力激盪會議。",
      flowchart: "流程圖製作器在線免費",
      flowchartDesc: "在線免費建立流程圖。使用我們的流程圖製作器視覺化流程、工作流和演算法。",
      mindMap: "思維導圖在線免費",
      mindMapDesc: "免費思維導圖工具在線。組織您的想法，規劃專案，並使用思維導圖視覺化概念。",
      agile: "敏捷團隊白板",
      agileDesc: "敏捷團隊白板。在免費在線白板上進行回顧、衝刺規劃和每日站會。",
      designThinking: "設計思維白板",
      designThinkingDesc: "創新設計思維白板。使用我們的免費在線白板進行設計思維工作坊。",
      meetings: "會議簡報白板",
      meetingsDesc: "會議簡報白板。建立視覺簡報，即時註釋，並與利益相關者分享。"
    },
    faq: {
      q1: "Craftisle Draw 真的免費嗎？",
      a1: "是的，Craftisle Draw 完全免費使用。沒有隱藏費用，沒有高級計劃，不需要信用卡。我們相信提供高品質的白色板工具，讓每個人都能使用。",
      q2: "我需要建立帳戶嗎？",
      a2: "不需要，您可以在不建立帳戶的情況下使用 Craftisle Draw。但是，建立免費帳戶可以讓您保存白板，從任何裝置存取它們，並與其他人協作。",
      q3: "我可以即時與我的團隊協作用嗎？",
      a3: "是的，Craftisle Draw 支援即時協作。透過簡單的連結分享您的白板，您的團隊可以立即加入並協作。不需要特殊的軟體。",
      q4: "我可以匯出我的白板嗎？",
      a4: "是的，您可以將白板匯出為 PNG 或 SVG 格式。這使您可以輕鬆地在社群媒體上分享您的作品，包含在簡報中，或列印供離線使用。",
      q5: "我的資料安全嗎？",
      a5: "是的，我們認真對待資料安全。您的白板安全儲存，您完全控制誰可以存取它們。我們絕不會與第三方分享您的資料。"
    }
  },

  // ===== 西班牙语 =====
  es: {
    nav: {
      home: "Inicio",
      boards: "Mis Pizarras",
      newBoard: "Nueva Pizarra",
      signIn: "Iniciar Sesión",
      signOut: "Cerrar Sesión",
      createBoard: "Crear Pizarra",
      myBoards: "Mis Pizarras",
      useCases: "Casos de Uso",
      homeDesc: "Crea diagramas hand-drawn, flujogramas y pizarras colaborativas"
    },
    home: {
      title: "Pizarra Online Gratuita",
      description: "Crea diagramas hand-drawn, flujogramas y pizarras colaborativas con Craftisle Draw. Herramienta de pizarra online gratuita impulsada por Excalidraw. No requiere registro para probar.",
      createBoard: "Crear Nueva Pizarra",
      myBoards: "Mis Pizarras",
      useCases: "Casos de Uso",
      noSignup: "Sin Registro",
      freeForever: "Gratis para Siempre",
      realTimeColab: "Colaboración en Tiempo Real",
      exportPNG: "Exportar a PNG/SVG",
      infiniteCanvas: "Lienzo Infinito",
      privacyFirst: "Privacidad Primero",
      startDrawing: "Empezar a Dibujar",
      tryNow: "Probar Ahora",
      features: "Características",
      featureHandDrawn: "Estilo Hand-Drawn",
      featureHandDrawnDesc: "El estilo hand-drawn único hace que sus diagramas se vean amenos y amigables. Impulsado por Excalidraw, la mejor herramienta de diagramas hand-drawn.",
      featureRealTime: "Colaboración en Tiempo Real",
      featureRealTimeDesc: "Colabora con su equipo en tiempo real. Vea los cambios al instante, chatee con colaboradores y trabaje sin problemas.",
      featureExport: "Exportar a PNG/SVG",
      featureExportDesc: "Exporte sus pizarras a formato PNG o SVG. Comparta su trabajo en redes sociales, incluya en presentaciones o imprima para uso sin conexión.",
      featurePrivacy: "Privacidad Primero",
      featurePrivacyDesc: "Sus datos se mantienen privados. Elija quién puede acceder a sus pizarras. Sin rastreo, sin anuncios, solo una experiencia de pizarra limpia.",
      featureNoSignup: "Sin Registro",
      featureNoSignupDesc: "Pruebe Craftisle Draw sin crear una cuenta. Pruebe todas las funciones gratis, sin tarjeta de crédito, sin correo electrónico.",
      featureInfinite: "Lienzo Infinito",
      featureInfiniteDesc: "Nunca se quede sin espacio. Nuestro lienzo infinito le permite expandir sus ideas tanto como necesite. Haga zoom libremente.",
      readyToStart: "¿Listo para Empezar a Dibujar?",
      readyDesc: "Únase a miles de usuarios que confían en Craftisle Draw para su colaboración visual.",
      joinNow: "Unirse Ahora",
      noCreditCard: "Sin tarjeta de crédito • Gratis para siempre • Colaboración en tiempo real"
    },
    seo: {
      title: "Pizarra Online Gratuita | Craftisle Draw",
      description: "Crea diagramas hand-drawn, flujogramas y pizarras colaborativas. Sin registro. Colaboración en tiempo real, lienzo infinito, exportar a PNG/SVG.",
      keywords: "pizarra online gratuita sin registro, pizarra online para enseñanza, pizarra colaborativa tiempo real gratis, herramienta diagramas hand-drawn online, creador flujogramas online gratis, mapa mental online gratis, pizarra virtual para equipos remotos, herramienta brainstorming online gratis, alternativa Excalidraw gratis, pizarra para equipos ágiles"
    },
    footer: {
      description: "Herramienta de pizarra online gratuita impulsada por Excalidraw. Crea diagramas hand-drawn, flujogramas y pizarras colaborativas.",
      quickLinks: "Enlaces Rápidos",
      home: "Inicio",
      createBoard: "Crear Nueva Pizarra",
      useCases: "Casos de Uso",
      legal: "Información Legal",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      copyright: "© 2026 Craftisle. Todos los derechos reservados."
    },
    privacy: { title: "Política de Privacidad" },
    terms: { title: "Términos de Servicio" },
    useCases: {
      teaching: "Pizarra Online para Enseñanza",
      teachingDesc: "Usa Craftisle Draw como una pizarra online gratuita para enseñanza. Crea lecciones interactivas, explica conceptos con diagramas hand-drawn y comparte pizarras con estudiantes.",
      remoteTeams: "Pizarra Virtual para Equipos Remotos",
      remoteTeamsDesc: "Pizarra colaborativa en tiempo real para equipos remotos. Brainstorming, planifica sprints y colabora visualmente con tu equipo.",
      brainstorming: "Herramienta de Brainstorming Online Gratis",
      brainstormingDesc: "Herramienta de brainstorming online gratis. Genera ideas con tu equipo en un lienzo infinito. Usa notas adhesivas, dibuja conexiones y exporta tu sesión de brainstorming.",
      flowchart: "Creador de Flujogramas Online Gratis",
      flowchartDesc: "Crea flujogramas online gratis. Usa nuestro creador de flujogramas para visualizar procesos, flujos de trabajo y algoritmos.",
      mindMap: "Mapa Mental Online Gratis",
      mindMapDesc: "Herramienta de mapa mental gratis online. Organiza tus pensamientos, planifica proyectos y visualiza conceptos con mapas mentales.",
      agile: "Pizarra para Equipos Ágiles",
      agileDesc: "Pizarra para equipos ágiles. Realiza retrospectivas, planificación de sprints y stand-ups en una pizarra online gratuita.",
      designThinking: "Pizarra de Design Thinking",
      designThinkingDesc: "Pizarra de design thinking para innovación. Usa nuestra pizarra online gratuita para realizar talleres de design thinking.",
      meetings: "Pizarra para Presentaciones de Reuniones",
      meetingsDesc: "Pizarra para presentaciones de reuniones. Crea presentaciones visuales, anota en tiempo real y comparte con partes interesadas."
    },
    faq: {
      q1: "¿Craftisle Draw es realmente gratis?",
      a1: "Sí, Craftisle Draw es completamente gratis para usar. Sin cargos ocultos, sin planes premium, sin tarjeta de crédito requerida. Creemos en proporcionar una herramienta de pizarra de alta calidad que sea accesible para todos.",
      q2: "¿Necesito crear una cuenta?",
      a2: "No, puedes usar Craftisle Draw sin crear una cuenta. Sin embargo, crear una cuenta gratis te permite guardar tus pizarras, accederlas desde cualquier dispositivo y colaborar con otros.",
      q3: "¿Puedo colaborar con mi equipo en tiempo real?",
      a3: "Sí, Craftisle Draw soporta colaboración en tiempo real. Compartte tu pizarra con un enlace simple, y tu equipo puede unirse y colaborar al instante. No se requiere software especial.",
      q4: "¿Puedo exportar mi pizarra?",
      a4: "Sí, puedes exportar tu pizarra a formato PNG o SVG. Esto hace que sea fácil compartir tu trabajo en redes sociales, incluir en presentaciones, o imprimir para uso sin conexión.",
      q5: "¿Mis datos están seguros?",
      a5: "Sí, nos tomamos la seguridad de datos en serio. Tus pizarras se almacenan de forma segura, y tienes control total sobre quién puede accederlas. Nunca compartimos tus datos con terceros."
    }
  },

  // ===== 日语 =====
  ja: {
    nav: {
      home: "ホーム",
      boards: "マイホワイトボード",
      newBoard: "新規ホワイトボード",
      signIn: "ログイン",
      signOut: "ログアウト",
      createBoard: "ホワイトボードを作成",
      myBoards: "マイホワイトボード",
      useCases: "ユースケース",
      homeDesc: "手描き図解、フローチャート、コラボレーションホワイトボードを作成"
    },
    home: {
      title: "無料オンラインホワイトボード",
      description: "Craftisle Drawを使って手描き図解、フローチャート、コラボレーションホワイトボードを作成しましょう。Excalidraw搭載の無料オンラインホワイトボードツール。登録不要でテスト可能。",
      createBoard: "新規ホワイトボードを作成",
      myBoards: "マイホワイトボード",
      useCases: "ユースケース",
      noSignup: "登録不要",
      freeForever: "永久無料",
      realTimeColab: "リアルタイムコラボレーション",
      exportPNG: "PNG/SVGにエクスポート",
      infiniteCanvas: "無限キャンバス",
      privacyFirst: "プライバシー最優先",
      startDrawing: "描き始める",
      tryNow: "今すぐ試す",
      features: "機能特徴",
      featureHandDrawn: "手描きスタイル",
      featureHandDrawnDesc: "独特の手描きスタイルで図解が親しみやすくフレンドリーに。Excalidraw搭載、最高の手描き図解ツール。",
      featureRealTime: "リアルタイムコラボレーション",
      featureRealTimeDesc: "チームとリアルタイムでコラボレーション。変更を即座に確認、コラボレーターとチャット、シームレスに作業。",
      featureExport: "PNG/SVGにエクスポート",
      featureExportDesc: "ホワイトボードをPNGまたはSVG形式でエクスポート。SNSで作品をシェア、プレゼンに含める、オフライン用に印刷。",
      featurePrivacy: "プライバシー最優先",
      featurePrivacyDesc: "データはプライベートを維持。誰がホワイトボードにアクセスできるか選択可能。トラッキングなし、広告なし、純粋なホワイトボード体験。",
      featureNoSignup: "登録不要",
      featureNoSignupDesc: "アカウント作成不要でCraftisle Drawを試用。すべての機能を無料でテスト、クレジットカード不要、メールアドレス不要。",
      featureInfinite: "無限キャンバス",
      featureInfiniteDesc: "スペース不足の心配なし。無限キャンバスでアイデアを自由に拡張。自由自在なズーム。",
      readyToStart: "描き始める準備はできましたか？",
      readyDesc: "Craftisle Drawを使ってビジュアルコラボレーションを信頼する何千人ものユーザーに参加。",
      joinNow: "今すぐ参加",
      noCreditCard: "クレジットカード不要 • 永久無料 • リアルタイムコラボレーション"
    },
    seo: {
      title: "無料オンラインホワイトボード | Craftisle Draw",
      description: "手描き図解、フローチャート、コラボレーションホワイトボードを作成。登録不要。リアルタイムコラボレーション、無限キャンバス、PNG/SVGにエクスポート。",
      keywords: "無料オンラインホワイトボード登録不要, オンラインホワイトボード教育, コラボレーションホワイトボードリアルタイム無料, 手描き図解ツールオンライン, フローチャートメーカーオンライン無料, マインドマップオンライン無料, リモートチーム仮想ホワイトボード, ブレインストーミングツールオンライン無料, Excalidraw代替無料, アジャイルチームホワイトボード"
    },
    footer: {
      description: "Excalidraw搭載の無料オンラインホワイトボードツール。手描き図解、フローチャート、コラボレーションホワイトボードを作成。",
      quickLinks: "クイックリンク",
      home: "ホーム",
      createBoard: "新規ホワイトボードを作成",
      useCases: "ユースケース",
      legal: "法的情報",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      copyright: "© 2026 Craftisle. 無断転載を禁じます。"
    },
    privacy: { title: "プライバシーポリシー" },
    terms: { title: "利用規約" },
    useCases: {
      teaching: "教育用オンラインホワイトボード",
      teachingDesc: "Craftisle Drawを無料オンラインホワイトボードとして教育に使用。インタラクティブなレッスンを作成、手描き図解で概念を説明、学生とホワイトボードをシェア。",
      remoteTeams: "リモートチーム仮想ホワイトボード",
      remoteTeamsDesc: "リモートチーム向けリアルタイムコラボレーションホワイトボード。ブレインストーミング、スプリント計画、チームでビジュアルコラボレーション。",
      brainstorming: "ブレインストーミングツールオンライン無料",
      brainstormingDesc: "無料ブレインストーミングツールオンライン。無限キャンバスでチームとアイデアを生成。付箋を使用、接続を描画、ブレインストーミングセッションをエクスポート。",
      flowchart: "フローチャートメーカーオンライン無料",
      flowchartDesc: "オンラインで無料フローチャートを作成。フローチャートメーカーを使用してプロセス、ワークフロー、アルゴリズムを視覚化。",
      mindMap: "マインドマップオンライン無料",
      mindMapDesc: "無料マインドマップツールオンライン。アイデアを整理、プロジェクトを計画、マインドマップで概念を視覚化。",
      agile: "アジャイルチームホワイトボード",
      agileDesc: "アジャイルチームホワイトボード。無料オンラインホワイトボードで振り返り、スプリント計画、デイリースタンドアップを実施。",
      designThinking: "デザイン思考ホワイトボード",
      designThinkingDesc: "イノベーションデザイン思考ホワイトボード。無料オンラインホワイトボードを使用してデザイン思考ワークショップを実施。",
      meetings: "ミーティングプレゼンホワイトボード",
      meetingsDesc: "ミーティングプレゼンホワイトボード。ビジュアルプレゼンを作成、リアルタイムで注釈、関係者とシェア。"
    },
    faq: {
      q1: "Craftisle Drawは本当に無料ですか？",
      a1: "はい、Craftisle Drawは完全に無料で使用できます。隠れた費用なし、プレミアムプランなし、クレジットカード不要。高品質のホワイトボードツールを誰もがアクセスできるように提供することを信じています。",
      q2: "アカウントを作成する必要がありますか？",
      a2: "いいえ、アカウントを作成せずにCraftisle Drawを使用できます。ただし、無料アカウントを作成すると、ホワイトボードを保存、任意のデバイスからアクセス、他の人とコラボレーションが可能になります。",
      q3: "チームとリアルタイムでコラボレーションできますか？",
      a3: "はい、Craftisle Drawはリアルタイムコラボレーションをサポート。簡単なリンクでホワイトボードをシェア、チームは即座に参加してコラボレーション可能。特別なソフトウェアは不要。",
      q4: "ホワイトボードをエクスポートできますか？",
      a4: "はい、ホワイトボードをPNGまたはSVG形式でエクスポート可能。SNSで作品をシェア、プレゼンに含める、オフライン用に印刷が簡単に。",
      q5: "私のデータは安全ですか？",
      a5: "はい、データセキュリティを真剣に受け止めています。ホワイトボードは安全に保存され、誰がアクセスできるかを完全に制御できます。サードパーティとデータを共有することはありません。"
    }
  },

  // ===== 德语 =====
  de: {
    nav: {
      home: "Startseite",
      boards: "Meine Whiteboards",
      newBoard: "Neues Whiteboard",
      signIn: "Anmelden",
      signOut: "Abmelden",
      createBoard: "Whiteboard erstellen",
      myBoards: "Meine Whiteboards",
      useCases: "Anwendungsfälle",
      homeDesc: "Hand-gezeichnete Diagramme, Flussdiagramme und kollaborative Whiteboards erstellen"
    },
    home: {
      title: "Kostenlose Online-Pinnwand",
      description: "Erstellen Sie hand-gezeichnete Diagramme, Flussdiagramme und kollaborative Whiteboards mit Craftisle Draw. Kostenloses Online-Whiteboard-Tool, unterstützt von Excalidraw. Keine Anmeldung zum Testen erforderlich.",
      createBoard: "Neues Whiteboard erstellen",
      myBoards: "Meine Whiteboards",
      useCases: "Anwendungsfälle",
      noSignup: "Keine Anmeldung",
      freeForever: "Für immer kostenlos",
      realTimeColab: "Echtzeit-Zusammenarbeit",
      exportPNG: "Exportieren als PNG/SVG",
      infiniteCanvas: "Unendlicher Leinwand",
      privacyFirst: "Datenschutz zuerst",
      startDrawing: "Mit Zeichnen beginnen",
      tryNow: "Jetzt ausprobieren",
      features: "Funktionen",
      featureHandDrawn: "Handgezeichneter Stil",
      featureHandDrawnDesc: "Der einzigartige handgezeichnete Stil lässt Ihre Diagramme einladend und freundlich erscheinen. Unterstützt von Excalidraw, dem besten Tool für handgezeichnete Diagramme.",
      featureRealTime: "Echtzeit-Zusammenarbeit",
      featureRealTimeDesc: "Arbeiten Sie in Echtzeit mit Ihrem Team zusammen. Sehen Sie Änderungen sofort, chatten Sie mit Mitarbeitern und arbeiten Sie nahtlos zusammen.",
      featureExport: "Exportieren als PNG/SVG",
      featureExportDesc: "Exportieren Sie Ihre Whiteboards in PNG- oder SVG-Format. Teilen Sie Ihre Arbeit in sozialen Medien, fügen Sie sie in Präsentationen ein oder drucken Sie sie für die Offline-Nutzung.",
      featurePrivacy: "Datenschutz zuerst",
      featurePrivacyDesc: "Ihre Daten bleiben privat. Wählen Sie, wer auf Ihre Whiteboards zugreifen kann. Keine Nachverfolgung, keine Werbung, nur ein reines Whiteboard-Erlebnis.",
      featureNoSignup: "Keine Anmeldung",
      featureNoSignupDesc: "Testen Sie Craftisle Draw ohne Erstellung eines Kontos. Testen Sie alle Funktionen kostenlos, keine Kreditkarte, keine E-Mail erforderlich.",
      featureInfinite: "Unendlicher Leinwand",
      featureInfiniteDesc: "Laufen Sie nie out of space. Unsere unendliche Leinwand lässt Sie Ihre Ideen so weit expandieren, wie Sie benötigen. Freies Zoomen.",
      readyToStart: "Bereit zum Zeichnen zu beginnen?",
      readyDesc: "Schliessen Sie sich Tausenden von Benutzern an, die Craftisle Draw für ihre visuelle Zusammenarbeit vertrauen.",
      joinNow: "Jetzt beitreten",
      noCreditCard: "Keine Kreditkarte • Für immer kostenlos • Echtzeit-Zusammenarbeit"
    },
    seo: {
      title: "Kostenlose Online-Pinnwand | Craftisle Draw",
      description: "Erstellen Sie hand-gezeichnete Diagramme, Flussdiagramme und kollaborative Whiteboards. Keine Anmeldung. Echtzeit-Zusammenarbeit, unendlicher Leinwand, Export als PNG/SVG.",
      keywords: "kostenlose online pinnwand keine anmeldung, online pinnwand für unterricht, kollaborative pinnwand echtzeit kostenlos, hand-gezeichnete diagramme tool online, flussdiagramm ersteller online kostenlos, mindmap online kostenlos, virtuelle pinnwand für remote teams, brainstorming tool online kostenlos, excalidraw alternative kostenlos, pinnwand für agile teams"
    },
    footer: {
      description: "Kostenloses Online-Whiteboard-Tool, unterstützt von Excalidraw. Erstellen Sie hand-gezeichnete Diagramme, Flussdiagramme und kollaborative Whiteboards.",
      quickLinks: "Schnelllinks",
      home: "Startseite",
      createBoard: "Neues Whiteboard erstellen",
      useCases: "Anwendungsfälle",
      legal: "Rechtliche Informationen",
      privacy: "Datenschutzbestimmungen",
      terms: "Nutzungsbedingungen",
      copyright: "© 2026 Craftisle. Alle Rechte vorbehalten."
    },
    privacy: { title: "Datenschutzbestimmungen" },
    terms: { title: "Nutzungsbedingungen" },
    useCases: {
      teaching: "Online-Pinnwand für Unterricht",
      teachingDesc: "Verwenden Sie Craftisle Draw als kostenlose Online-Pinnwand für den Unterricht. Erstellen Sie interaktive Lektionen, erklären Sie Konzepte mit hand-gezeichneten Diagrammen und teilen Sie Whiteboards mit Schülern.",
      remoteTeams: "Virtuelle Pinnwand für Remote-Teams",
      remoteTeamsDesc: "Echtzeit-kollaborative Whiteboard für Remote-Teams. Brainstorming, Sprint-Planung und visuelle Zusammenarbeit mit Ihrem Team.",
      brainstorming: "Brainstorming-Tool online kostenlos",
      brainstormingDesc: "Kostenloses Brainstorming-Tool online. Generieren Sie Ideen mit Ihrem Team auf einer unendlichen Leinwand. Verwenden Sie Post-it-Notizen, zeichnen Sie Verbindungen und exportieren Sie Ihre Brainstorming-Sitzung.",
      flowchart: "Flussdiagramm-Ersteller online kostenlos",
      flowchartDesc: "Erstellen Sie Flussdiagramme online kostenlos. Verwenden Sie unseren Flussdiagramm-Ersteller, um Prozesse, Arbeitsabläufe und Algorithmen zu visualisieren.",
      mindMap: "Mindmap online kostenlos",
      mindMapDesc: "Kostenloses Mindmap-Tool online. Organisieren Sie Ihre Gedanken, planen Sie Projekte und visualisieren Sie Konzepte mit Mindmaps.",
      agile: "Whiteboard für agile Teams",
      agileDesc: "Whiteboard für agile Teams. Führen Sie Retrospektiven, Sprint-Planungen und Stand-ups auf einem kostenlosen Online-Whiteboard durch.",
      designThinking: "Design Thinking Whiteboard",
      designThinkingDesc: "Design Thinking Whiteboard für Innovation. Verwenden Sie unser kostenloses Online-Whiteboard, um Design Thinking Workshops durchzuführen.",
      meetings: "Whiteboard für Besprechungspräsentationen",
      meetingsDesc: "Whiteboard für Besprechungspräsentationen. Erstellen Sie visuelle Präsentationen, kommentieren Sie in Echtzeit und teilen Sie sie mit Stakeholdern."
    },
    faq: {
      q1: "Ist Craftisle Draw wirklich kostenlos?",
      a1: "Ja, Craftisle Draw ist völlig kostenlos nutzbar. Keine versteckten Gebühren, keine Premium-Pläne, keine Kreditkarte erforderlich. Wir glauben daran, ein hochwertiges Whiteboard-Tool bereitzustellen, das für jeden zugänglich ist.",
      q2: "Muss ich ein Konto erstellen?",
      a2: "Nein, Sie können Craftisle Draw nutzen, ohne ein Konto zu erstellen. Wenn Sie jedoch ein kostenloses Konto erstellen, können Sie Ihre Whiteboards speichern, von jedem Gerät aus darauf zugreifen und mit anderen zusammenarbeiten.",
      q3: "Kann ich in Echtzeit mit meinem Team zusammenarbeiten?",
      a3: "Ja, Craftisle Draw unterstützt Echtzeit-Zusammenarbeit. Teilen Sie Ihr Whiteboard mit einem einfachen Link, und Ihr Team kann sofort beitreten und zusammenarbeiten. Keine spezielle Software erforderlich.",
      q4: "Kann ich mein Whiteboard exportieren?",
      a4: "Ja, Sie können Ihr Whiteboard in PNG- oder SVG-Format exportieren. Dies macht es einfach, Ihre Arbeit in sozialen Medien zu teilen, in Präsentationen einzufügen oder für die Offline-Nutzung zu drucken.",
      q5: "Sind meine Daten sicher?",
      a5: "Ja, wir nehmen Datensicherheit ernst. Ihre Whiteboards werden sicher gespeichert, und Sie haben die volle Kontrolle darüber, wer darauf zugreifen kann. Wir teilen Ihre Daten niemals mit Dritten."
    }
  },

  // ===== 法语 =====
  fr: {
    nav: {
      home: "Accueil",
      boards: "Mes Tableaux",
      newBoard: "Nouveau Tableau",
      signIn: "Se Connecter",
      signOut: "Se Déconnecter",
      createBoard: "Créer un Tableau",
      myBoards: "Mes Tableaux",
      useCases: "Cas d'Usage",
      homeDesc: "Créez des diagrammes dessinés à la main, des organigrammes et des tableaux blancs collaboratifs"
    },
    home: {
      title: "Tableau Blanc En Ligne Gratuit",
      description: "Créez des diagrammes dessinés à la main, des organigrammes et des tableaux blancs collaboratifs avec Craftisle Draw. Outil de tableau blanc en ligne gratuit alimenté par Excalidraw. Aucune inscription requise pour tester.",
      createBoard: "Créer un Nouveau Tableau",
      myBoards: "Mes Tableaux",
      useCases: "Cas d'Usage",
      noSignup: "Sans Inscription",
      freeForever: "Gratuit Pour Toujours",
      realTimeColab: "Collaboration en Temps Réel",
      exportPNG: "Exporter en PNG/SVG",
      infiniteCanvas: "Toile Infinie",
      privacyFirst: "Confidentialité d'Abord",
      startDrawing: "Commencer à Dessiner",
      tryNow: "Essayer Maintenant",
      features: "Fonctionnalités",
      featureHandDrawn: "Style Dessiné à la Main",
      featureHandDrawnDesc: "Le style unique dessiné à la main rend vos diagrammes accueillants et amicaux. Alimenté par Excalidraw, le meilleur outil de diagrammes dessinés à la main.",
      featureRealTime: "Collaboration en Temps Réel",
      featureRealTimeDesc: "Collaborez avec votre équipe en temps réel. Voyez les changements instantanément, discutez avec les collaborateurs et travaillez de manière transparente.",
      featureExport: "Exporter en PNG/SVG",
      featureExportDesc: "Exportez vos tableaux blancs en format PNG ou SVG. Partagez votre travail sur les réseaux sociaux, incluez-le dans des présentations ou imprimez-le pour une utilisation hors ligne.",
      featurePrivacy: "Confidentialité d'Abord",
      featurePrivacyDesc: "Vos données restent privées. Choisissez qui peut accéder à vos tableaux blancs. Pas de suivi, pas de publicité, juste une expérience de tableau blanc propre.",
      featureNoSignup: "Sans Inscription",
      featureNoSignupDesc: "Testez Craftisle Draw sans créer de compte. Testez toutes les fonctionnalités gratuitement, sans carte de crédit, sans e-mail.",
      featureInfinite: "Toile Infinie",
      featureInfiniteDesc: "Ne manquez jamais d'espace. Notre toile infinie vous permet d'étendre vos idées autant que nécessaire. Zoom libre.",
      readyToStart: "Prêt à Commencer à Dessiner?",
      readyDesc: "Rejoignez des milliers d'utilisateurs qui font confiance à Craftisle Draw pour leur collaboration visuelle.",
      joinNow: "Rejoindre Maintenant",
      noCreditCard: "Sans carte de crédit • Gratuit pour toujours • Collaboration en temps réel"
    },
    seo: {
      title: "Tableau Blanc En Ligne Gratuit | Craftisle Draw",
      description: "Créez des diagrammes dessinés à la main, des organigrammes et des tableaux blancs collaboratifs. Sans inscription. Collaboration en temps réel, toile infinie, exporter en PNG/SVG.",
      keywords: "tableau blanc en ligne gratuit sans inscription, tableau blanc en ligne pour enseignement, tableau blanc collaboratif temps réel gratuit, outil diagrammes dessinés à la main en ligne, créateur organigramme en ligne gratuit, carte mentale en ligne gratuit, tableau blanc virtuel pour équipes distantes, outil brainstoring en ligne gratuit, alternative Excalidraw gratuit, tableau blanc pour équipes agiles"
    },
    footer: {
      description: "Outil de tableau blanc en ligne gratuit alimenté par Excalidraw. Créez des diagrammes dessinés à la main, des organigrammes et des tableaux blancs collaboratifs.",
      quickLinks: "Liens Rapides",
      home: "Accueil",
      createBoard: "Créer un Nouveau Tableau",
      useCases: "Cas d'Usage",
      legal: "Informations Légales",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      copyright: "© 2026 Craftisle. Tous droits réservés."
    },
    privacy: { title: "Politique de Confidentialité" },
    terms: { title: "Conditions d'Utilisation" },
    useCases: {
      teaching: "Tableau Blanc En Ligne pour l'Enseignement",
      teachingDesc: "Utilisez Craftisle Draw comme un tableau blanc en ligne gratuit pour l'enseignement. Créez des leçons interactives, expliquez des concepts avec des diagrammes dessinés à la main et partagez des tableaux blancs avec des étudiants.",
      remoteTeams: "Tableau Blanc Virtuel pour Équipes Distantes",
      remoteTeamsDesc: "Tableau blanc collaboratif en temps réel pour équipes distantes. Brainstoring, planifiez des sprints et collaborez visuellement avec votre équipe.",
      brainstorming: "Outil de Brainstoring En Ligne Gratuit",
      brainstormingDesc: "Outil de brainstoring en ligne gratuit. Générez des idées avec votre équipe sur une toile infinie. Utilisez des notes adhésives, dessinez des connexions et exportez votre session de brainstoring.",
      flowchart: "Créateur d'Organigramme En Ligne Gratuit",
      flowchartDesc: "Créez des organigrammes en ligne gratuitement. Utilisez notre créateur d'organigramme pour visualiser des processus, des flux de travail et des algorithmes.",
      mindMap: "Carte Mentale En Ligne Gratuite",
      mindMapDesc: "Outil de carte mentale gratuit en ligne. Organisez vos pensées, planifiez des projets et visualisez des concepts avec des cartes mentales.",
      agile: "Tableau Blanc pour Équipes Agiles",
      agileDesc: "Tableau blanc pour équipes agiles. Réalisez des rétrospectives, la planification de sprints et des stand-ups sur un tableau blanc en ligne gratuit.",
      designThinking: "Tableau Blanc Design Thinking",
      designThinkingDesc: "Tableau blanc Design Thinking pour l'innovation. Utilisez notre tableau blanc en ligne gratuit pour réaliser des ateliers Design Thinking.",
      meetings: "Tableau Blanc pour Présentations de Réunions",
      meetingsDesc: "Tableau blanc pour présentations de réunions. Créez des présentations visuelles, annotez en temps réel et partagez avec des parties prenantes."
    },
    faq: {
      q1: "Craftisle Draw est-il vraiment gratuit ?",
      a1: "Oui, Craftisle Draw est complètement gratuit à utiliser. Pas de frais cachés, pas de plans premium, pas de carte de crédit requise. Nous croyons à fournir un outil de tableau blanc de haute qualité qui est accessible à tous.",
      q2: "Dois-je créer un compte ?",
      a2: "Non, vous pouvez utiliser Craftisle Draw sans créer un compte. Cependant, créer un compte gratuit vous permet de sauvegarder vos tableaux blancs, d'y accéder depuis n'importe quel appareil et de collaborer avec d'autres.",
      q3: "Puis-je collaborer avec mon équipe en temps réel ?",
      a3: "Oui, Craftisle Draw supporte la collaboration en temps réel. Partagez votre tableau blanc avec un lien simple, et votre équipe peut rejoindre et collaborer instantanément. Aucun logiciel spécial requis.",
      q4: "Puis-je exporter mon tableau blanc ?",
      a4: "Oui, vous pouvez exporter votre tableau blanc en format PNG ou SVG. Cela rend facile de partager votre travail sur les réseaux sociaux, d'inclure dans des présentations, ou d'imprimer pour une utilisation hors ligne.",
      q5: "Mes données sont-elles sécurisées ?",
      a5: "Oui, nous prenons la sécurité des données au sérieux. Vos tableaux blancs sont stockés en toute sécurité, et vous avez le contrôle total sur qui peut y accéder. Nous ne partageons jamais vos données avec des tiers."
    }
  },
};

// 由于篇幅限制，其他语言（pt, ru, ko, ar, it, tr, id, vi, ro）将在下一个脚本中生成
// 这里先写入已有的6种语言

Object.entries(allTranslations).forEach(([locale, data]) => {
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

console.log('\n✅ 6 languages updated successfully!');
console.log('Next: Generate remaining 9 languages (pt, ru, ko, ar, it, tr, id, vi, ro)');

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
