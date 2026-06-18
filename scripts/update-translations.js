const fs = require('fs');
const path = require('path');

// New keys to add to all translation files
const newKeys = {
  "home": {
    "or": "or",
    "learnMore": "learn more about Craftisle",
    "pleaseSignIn": "Please sign in to view your boards",
    "faqTitle": "Frequently Asked Questions",
    "faq": {
      "free": "Is Craftisle Draw free to use?",
      "freeAnswer": "Yes, Craftisle Draw is completely free to use. No signup required for testing.",
      "collaborate": "Can I collaborate with others in real-time?",
      "collaborateAnswer": "Yes, you can share your board with others and collaborate in real-time.",
      "export": "Can I export my drawings?",
      "exportAnswer": "Yes, you can export your drawings as PNG or SVG files.",
      "account": "Do I need to create an account?",
      "accountAnswer": "No, you can test the tool without creating an account. However, creating an account allows you to save and manage your boards.",
      "secure": "Is my data secure?",
      "secureAnswer": "Yes, your data is stored securely. You can also make your boards private or public."
    }
  },
  "footer": {
    "description": "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.",
    "quickLinks": "Quick Links",
    "legal": "Legal",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "copyright": "© 2026 Craftisle. All rights reserved."
  }
};

// Read English translations as reference
const enPath = path.join(__dirname, '../messages/en.json');
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Merge new keys into English translations
function mergeTranslations(existing, newKeys) {
  const merged = { ...existing };
  
  for (const [key, value] of Object.entries(newKeys)) {
    if (typeof value === 'object' && value !== null) {
      merged[key] = mergeTranslations(merged[key] || {}, value);
    } else {
      merged[key] = value;
    }
  }
  
  return merged;
}

const updatedEn = mergeTranslations(enTranslations, newKeys);
fs.writeFileSync(enPath, JSON.stringify(updatedEn, null, 2), 'utf8');
console.log('✓ Updated en.json');

// For other languages, just add the keys with English values (placeholder)
// In production, these should be translated by a translator
const locales = ["zh", "zh-TW", "es", "ja", "de", "fr", "pt", "ru", "ko", "ar", "it", "tr", "id", "vi", "ro"];

for (const locale of locales) {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${locale}.json not found, skipping`);
    continue;
  }
  
  const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updated = mergeTranslations(translations, newKeys);
  
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`✓ Updated ${locale}.json`);
}

console.log('\n✅ All translation files updated!');
console.log('⚠️  Note: Non-English translations are using English values as placeholders.');
console.log('   Please have these translated by a translator.\n');
