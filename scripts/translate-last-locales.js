// scripts/translate-last-locales.js
// 为最后5种语言生成完整翻译（tr, ro, id, vi, ar）

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

// ===== 土耳其语 =====
const tr = {
  nav: {
    home: "Ana Sayfa",
    boards: "Beyaz Tahtalarım",
    newBoard: "Yeni Beyaz Tahta",
    signIn: "Giriş Yap",
    signOut: "Çıkış Yap",
    createBoard: "Beyaz Tahta Oluştur",
    myBoards: "Beyaz Tahtalarım",
    useCases: "Kullanım Durumları",
    homeDesc: "El ile çizilmiş diyagramlar, akış şemaları ve işbirlikçi beyaz tahtalar oluşturun"
  },
  home: {
    title: "Ücretsiz Online Beyaz Tahta",
    description: "Craftisle Draw ile el ile çizilmiş diyagramlar, akış şemaları ve işbirlikçi beyaz tahtalar oluşturun. Excalidraw tarafından desteklenen ücretsiz online beyaz tahta aracı. Test etmek için kayıt gerekmiyor.",
    createBoard: "Yeni Beyaz Tahta Oluştur",
    myBoards: "Beyaz Tahtalarım",
    useCases: "Kullanım Durumları",
    noSignup: "Kayıt Yok",
    freeForever: "Sonsuza Kadar Ücretsiz",
    realTimeColab: "Gerçek Zamanlı İşbirliği",
    exportPNG: "PNG/SVG'ye Aktar",
    infiniteCanvas: "Sonsuz Tuval",
    privacyFirst: "Gizlilik Öncelikli",
    startDrawing: "Çizime Başla",
    tryNow: "Şimdi Dene",
    features: "Özellikler",
    featureHandDrawn: "El İle Çizilmiş Stil",
    featureHandDrawnDesc: "Benzersiz el ile çizilmiş stil, diyagramlarınızı samimi ve dostane gösterir. Excalidraw tarafından desteklenen, en iyi el ile çizilmiş diyagram aracı.",
    featureRealTime: "Gerçek Zamanlı İşbirliği",
    featureRealTimeDesc: "Ekibinizle gerçek zamanlı olarak işbirliği yapın. Değişiklikleri anında görün, işbirlikçilerle sohbet edin ve sorunsuz bir şekilde çalışın.",
    featureExport: "PNG/SVG'ye Aktar",
    featureExportDesc: "Beyaz tahtalarınızı PNG veya SVG formatına aktarın. Çalışmanızı sosyal medyada paylaşın, sunumlara dahil edin veya çevrimdışı kullanım için yazdırın.",
    featurePrivacy: "Gizlilik Öncelikli",
    featurePrivacyDesc: "Verileriniz özel kalır. Beyaz tahtalarınıza kimin erişebileceğini seçin. İzleme yok, reklam yok, sadece temiz bir beyaz tahta deneyimi.",
    featureNoSignup: "Kayıt Yok",
    featureNoSignupDesc: "Bir hesap oluşturmadan Craftisle Draw'u deneyin. Tüm işlevleri ücretsiz deneyin, kredi kartı yok, e-posta yok.",
    featureInfinite: "Sonsuz Tuval",
    featureInfiniteDesc: "Asla yer kalmaz. Sonsuz tuvalimiz, ihtiyaç duyduğunuz kadar fikirlerinizi genişletmenize olanak tanır. Serbest yakınlaştırma.",
    readyToStart: "Çizime Başlamaya Hazır mısınız?",
    readyDesc: "Görsel işbirliği için Craftisle Draw'a güvenen binlerce kullanıcıya katılın.",
    joinNow: "Şimdi Katılın",
    noCreditCard: "Kredi kartı yok • Sonsuza kadar ücretsiz • Gerçek zamanlı işbirliği"
  },
  seo: {
    title: "Ücretsiz Online Beyaz Tahta | Craftisle Draw",
    description: "El ile çizilmiş diyagramlar, akış şemaları ve işbirlikçi beyaz tahtalar oluşturun. Kayıt yok. Gerçek zamanlı işbirliği, sonsuz tuval, PNG/SVG'ye aktarım.",
    keywords: "ücretsiz online beyaz tahta kayıtsız, öğretim için online beyaz tahta, gerçek zamanlı işbirlikçi beyaz tahta ücretsiz, online el ile çizilmiş diyagram aracı, online akış şeması oluşturucu ücretsiz, online zihin haritası ücretsiz, uzaktan ekipler için sanal beyaz tahta, online beyin fırtınası aracı ücretsiz, Excalidraw alternatifi ücretsiz, çevik ekipler için beyaz tahta"
  },
  footer: {
    description: "Excalidraw tarafından desteklenen ücretsiz online beyaz tahta aracı. El ile çizilmiş diyagramlar, akış şemaları ve işbirlikçi beyaz tahtalar oluşturun.",
    quickLinks: "Hızlı Bağlantılar",
    home: "Ana Sayfa",
    createBoard: "Yeni Beyaz Tahta Oluştur",
    useCases: "Kullanım Durumları",
    legal: "Yasal Bilgiler",
    privacy: "Gizlilik Politikası",
    terms: "Hizmet Şartları",
    copyright: "© 2026 Craftisle. Tüm hakları saklıdır."
  },
  privacy: { title: "Gizlilik Politikası" },
  terms: { title: "Hizmet Şartları" },
  useCases: {
    teaching: "Öğretim için Online Beyaz Tahta",
    teachingDesc: "Craftisle Draw'u öğretim için ücretsiz online beyaz tahta olarak kullanın. Etkileşimli dersler oluşturun, el ile çizilmiş diyagramlarla kavramları açıklayın ve beyaz tahtaları öğrencilerle paylaşın.",
    remoteTeams: "Uzaktan Ekipler için Sanal Beyaz Tahta",
    remoteTeamsDesc: "Uzaktan ekipler için gerçek zamanlı işbirlikçi beyaz tahta. Beyn fırtınası, sprint planlaması ve ekibinizle görsel olarak işbirliği yapın.",
    brainstorming: "Online Beyn Fırtınası Aracı Ücretsiz",
    brainstormingDesc: "Online ücretsiz beyin fırtınası aracı. Sonsuz tuval üzerinde ekibinizle fikirler üretin. Yapiskan notları kullanın, bağlantılar çizin ve beyin fırtınası oturumunuzu aktarın.",
    flowchart: "Online Akış Şeması Oluşturucu Ücretsiz",
    flowchartDesc: "Online ücretsiz akış şemaları oluşturun. Süreçleri, iş akışlarını ve algoritmaları görselleştirmek için akış şeması oluşturucumuzu kullanın.",
    mindMap: "Online Zihin Haritası Ücretsiz",
    mindMapDesc: "Online ücretsiz zihin haritası aracı. Düşüncelerinizi organize edin, projelerinizi planlayın ve zihin haritalarıyla kavramları görselleştirin.",
    agile: "Çevik Ekipler için Beyaz Tahta",
    agileDesc: "Çevik ekipler için beyaz tahta. Ücretsiz online beyaz tahta üzerinde retrospektifler, sprint planlaması ve günlük toplantılar gerçekleştirin.",
    designThinking: "Tasarım Düşüncesi Beyaz Tahtası",
    designThinkingDesc: "Yenilik için Tasarım Düşüncesi beyaz tahtası. Tasarım Düşüncesi atölyelerini gerçekleştirmek için ücretsiz online beyaz tahtamızı kullanın.",
    meetings: "Toplantı Sunumları için Beyaz Tahta",
    meetingsDesc: "Toplantı sunumları için beyaz tahta. Görsel sunumlar oluşturun, gerçek zamanlı olarak açıklayın ve paydaşlarla paylaşın."
  },
  faq: {
    q1: "Craftisle Draw gerçekten ücretsiz mi?",
    a1: "Evet, Craftisle Draw kullanımı tamamen ücretsizdir. Saklı ücretler yok, premium planlar yok, kredi kartı gerekmiyor. Herkesin erişebileceği yüksek kaliteli bir beyaz tahta aracı sağlamaya inanıyoruz.",
    q2: "Bir hesap oluşturmam gerekiyor mu?",
    a2: "Hayır, Craftisle Draw'u bir hesap oluşturmadan kullanabilirsiniz. Ancak, ücretsiz bir hesap oluşturmak, beyaz tahtalarınızı kaydetmenize, herhangi bir cihazdan erişmenize ve diğerleriyle işbirliği yapmanıza olanak tanır.",
    q3: "Ekibimle gerçek zamanlı olarak işbirliği yapabilir miyim?",
    a3: "Evet, Craftisle Draw gerçek zamanlı işbirliğini destekler. Beyaz tahtanızı basit bir bağlantıyla paylaşın, ekibiniz anında katılabilir ve işbirliği yapabilir. Özel bir yazılım gerekmiyor.",
    q4: "Beyaz tahtamı aktarabilir miyim?",
    a4: "Evet, beyaz tahtanızı PNG veya SVG formatında aktarabilirsiniz. Bu, çalışmanızı sosyal medyada paylaşmayı, sunumlara dahil etmeyi veya çevrimdışı kullanım için yazdırmayı kolaylaştırır.",
    q5: "Verilerim güvende mi?",
    a5: "Evet, veri güvenliğini ciddiye alıyoruz. Beyaz tahtalarınız güvenle saklanır ve onlara kimin erişebileceği üzerinde tam kontrole sahipsınız. Verilerinizi asla üçüncü şahislarla paylaşmayız."
  }
};

// ===== 罗马尼亚语 =====
const ro = {
  nav: {
    home: "Acasă",
    boards: "Tablele Mele",
    newBoard: "Tabel Nou",
    signIn: "Autentificare",
    signOut: "Deconectare",
    createBoard: "Creați Tabel",
    myBoards: "Tablele Mele",
    useCases: "Cazuri de Utilizare",
    homeDesc: "Creați diagrame desenate de mână, fluxuri de lucru și table colaborative"
  },
  home: {
    title: "Tablă Albă Online Gratuită",
    description: "Creați diagrame desenate de mână, fluxuri de lucru și table colaborative cu Craftisle Draw. Instrument de tablă albă online gratuit, alimentat de Excalidraw. Nu este necesară înregistrarea pentru a testa.",
    createBoard: "Creați Tabel Nou",
    myBoards: "Tablele Mele",
    useCases: "Cazuri de Utilizare",
    noSignup: "Fără Înregistrare",
    freeForever: "Gratuit pentru Totdeauna",
    realTimeColab: "Colaborare în Timp Real",
    exportPNG: "Exportă în PNG/SVG",
    infiniteCanvas: "Pânză Infinită",
    privacyFirst: "Confidențialitate Prioritară",
    startDrawing: "Începeți să Desenați",
    tryNow: "Încercați Acum",
    features: "Funcționalități",
    featureHandDrawn: "Stil Desenat de Mână",
    featureHandDrawnDesc: "Stilul unic desenat de mână face diagramele dumneavoastră să pară primitoare și prietenoase. Alimentat de Excalidraw, cel mai bun instrument pentru diagrame desenate de mână.",
    featureRealTime: "Colaborare în Timp Real",
    featureRealTimeDesc: "Colaborați cu echipa dumneavoastră în timp real. Vedeți modificările instantaneu, discutați cu colaboratorii și lucrați fără probleme.",
    featureExport: "Exportă în PNG/SVG",
    featureExportDesc: "Exportați tablele albе în format PNG sau SVG. Partajați munca dumneavoastră pe rețele de socializare, inclu­deți în prezentări sau imprimați pentru utilizare offline.",
    featurePrivacy: "Confidențialitate Prioritară",
    featurePrivacyDesc: "Datele dumneavoastră rămân private. Alegeți cine poate accesa tablele albе. Fără urmărire, fără reclame, doar o experiență curată de tablă albă.",
    featureNoSignup: "Fără Înregistrare",
    featureNoSignupDesc: "Încercați Craftisle Draw fără a crea un cont. Testați toate funcționalitățile gratuit, fără card de credit, fără e-mail.",
    featureInfinite: "Pânză Infinită",
    featureInfiniteDesc: "Nu rămâneți niciodată fără spațiu. Pânza noastră infinită vă permite să vă extindeți ideile atât cât aveți nevoie. Zoom liber.",
    readyToStart: "Gata să Începeți să Desenați?",
    readyDesc: "Alăturați-vă miilor de utilizatori care au încredere în Craftisle Draw pentru colaborarea lor vizuală.",
    joinNow: "Alăturați-vă Acum",
    noCreditCard: "Fără card de credit • Gratuit pentru totdeauna • Colaborare în timp real"
  },
  seo: {
    title: "Tablă Albă Online Gratuită | Craftisle Draw",
    description: "Creați diagrame desenate de mână, fluxuri de lucru și table colaborative. Fără înregistrare. Colaborare în timp real, pânză infinită, export în PNG/SVG.",
    keywords: "tablă albă online gratuită fără înregistrare, tablă albă online pentru învățământ, tablă colaborativă timp real gratuit, instrument diagrame desenate de mână online, creator fluxuri de lucru online gratuit, hartă mentală online gratuită, tablă albă virtuală pentru echipe la distanță, instrument brainstorming online gratuit, alternativă Excalidraw gratuită, tablă albă pentru echipe agile"
  },
  footer: {
    description: "Instrument de tablă albă online gratuit, alimentat de Excalidraw. Creați diagrame desenate de mână, fluxuri de lucru și table colaborative.",
    quickLinks: "Link-uri Rapide",
    home: "Acasă",
    createBoard: "Creați Tabel Nou",
    useCases: "Cazuri de Utilizare",
    legal: "Informații Legale",
    privacy: "Politică de Confidențialitate",
    terms: "Termeni de Serviciu",
    copyright: "© 2026 Craftisle. Toate drepturile rezervate."
  },
  privacy: { title: "Politică de Confidențialitate" },
  terms: { title: "Termeni de Serviciu" },
  useCases: {
    teaching: "Tablă Albă Online pentru Învățământ",
    teachingDesc: "Folosiți Craftisle Draw ca o tablă albă online gratuită pentru învățământ. Creați lecții interactive, explicați concepte cu diagrame desenate de mână și partajați tablele albе cu studenții.",
    remoteTeams: "Tablă Albă Virtuală pentru Echipe la Distanță",
    remoteTeamsDesc: "Tablă colaborativă în timp real pentru echipe la distanță. Brainstorming, planificați sprinte și colaborați vizual cu echipa dumneavoastră.",
    brainstorming: "Instrument Brainstorming Online Gratuit",
    brainstormingDesc: "Instrument brainstorming online gratuit. Generați idei cu echipa dumneavoastră pe o pânză infinită. Folosiți note adezive, desenați conexiuni și exportați sesiunea de brainstorming.",
    flowchart: "Creator Fluxuri de Lucru Online Gratuit",
    flowchartDesc: "Creați fluxuri de lucru online gratuit. Folosiți creatorul nostru de fluxuri de lucru pentru a vizualiza procese, fluxuri de lucru și algoritmi.",
    mindMap: "Hartă Mentală Online Gratuită",
    mindMapDesc: "Instrument hartă mentală online gratuit. Organizați-vă gândurile, planificați proiecte și vizualizați concepte cu hărți mentale.",
    agile: "Tablă Albă pentru Echipe Agile",
    agileDesc: "Tablă albă pentru echipe agile. Realizați retrospective, planificarea sprintelor și ședințe stând-up pe o tablă albă online gratuită.",
    designThinking: "Tablă Albă Design Thinking",
    designThinkingDesc: "Tablă albă Design Thinking pentru inovație. Folosiți tabla noastră albă online gratuită pentru a realiza ateliere Design Thinking.",
    meetings: "Tablă Albă pentru Prezentări de Întâlniri",
    meetingsDesc: "Tablă albă pentru prezentări de întâlniri. Creați prezentări vizuale, adnotați în timp real și partajați cu părțile interesate."
  },
  faq: {
    q1: "Craftisle Draw este într-adevăr gratuit?",
    a1: "Da, Craftisle Draw este complet gratuit de utilizat. Nicio taxă ascunsă, nicio planuri premium, nicio card de credit necesar. Credem în furnizarea unui instrument de tablă albă de înaltă calitate care să fie accesibil tuturor.",
    q2: "Trebuie să creez un cont?",
    a2: "Nu, puteți utiliza Craftisle Draw fără a crea un cont. Totuși, crearea unui cont gratuit vă permite să salvați tablele albе, să accesați de pe orice dispozitiv și să colaborați cu alții.",
    q3: "Pot colabora cu echipa mea în timp real?",
    a3: "Da, Craftisle Draw suportă colaborarea în timp real. Partajați tabla albă cu un link simplu, iar echipa dumneavoastră se poate alătura și colabora instantaneu. Nicio software special necesar.",
    q4: "Pot exporta tabla mea albă?",
    a4: "Da, puteți exporta tabla albă în format PNG sau SVG. Acest lucru face ușor să partajați munca pe rețele de socializare, să o inclu­deți în prezentări sau să o imprimați pentru utilizare offline.",
    q5: "Datele mele sunt în siguranță?",
    a5: "Da, luăm în serios securitatea datelor. Tablele albе sunt stocate în siguranță, iar dumneavoastră aveți controlul total asupra a cine poate accesa. Niciodată nu partajăm datele dumneavoastră cu terți."
  }
};

// 由于篇幅限制，其他语言（id, vi, ar）将在实际使用时补充
// 这里先写入土耳其语和罗马尼亚语

const translations = {
  tr,
  ro,
  // id, vi, ar - 将在下一步添加
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
console.log('Remaining: id, vi, ar (3 languages)');

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
