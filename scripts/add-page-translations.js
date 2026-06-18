const fs = require('fs');
const path = require('path');

// Privacy page translations (English)
const privacyTranslations = {
  "privacy": {
    "title": "Privacy Policy | Craftisle Draw",
    "description": "Privacy Policy for Craftisle Draw - Free Online Whiteboard Tool"
  }
};

// Terms page translations (English)
const termsTranslations = {
  "terms": {
    "title": "Terms of Service | Craftisle Draw",
    "description": "Terms of Service for Craftisle Draw - Free Online Whiteboard Tool"
  }
};

// Use cases page translations (English)
const useCasesTranslations = {
  "useCases": {
    "title": "Use Cases | Craftisle Draw",
    "description": "Discover how to use Craftisle Draw for teaching, remote teams, brainstorming, and more."
  }
};

// Merge function
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

// Update all translation files
const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(messagesDir, file);
  const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add new namespaces
  const updated = mergeTranslations(translations, privacyTranslations);
  const updated2 = mergeTranslations(updated, termsTranslations);
  const updated3 = mergeTranslations(updated2, useCasesTranslations);
  
  fs.writeFileSync(filePath, JSON.stringify(updated3, null, 2), 'utf8');
  console.log(`✓ Updated ${file}`);
}

console.log('\n✅ Added privacy, terms, useCases namespaces to all translation files!');
console.log('⚠️  Note: Non-English files have English values as placeholders.\n');
