const fs = require('fs');
const path = require('path');

// 创建简单的 OG 图片 (1200x630 PNG)
// 使用最小化 PNG 生成 - 创建一个带有品牌色的简单图片

const width = 1200;
const height = 630;

// 创建 SVG (可以作为 OG 图片的替代方案，但最好还是用 PNG)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="${width}" height="${height}" fill="url(#grad)" />
  
  <!-- 装饰元素 - 白板线条 -->
  <line x1="100" y1="200" x2="500" y2="200" stroke="white" stroke-width="3" opacity="0.3" />
  <line x1="100" y1="250" x2="400" y2="250" stroke="white" stroke-width="3" opacity="0.3" />
  <line x1="100" y1="300" x2="450" y2="300" stroke="white" stroke-width="3" opacity="0.3" />
  
  <!-- 矩形装饰 -->
  <rect x="700" y="150" width="200" height="150" fill="white" opacity="0.1" rx="10" />
  <rect x="750" y="200" width="100" height="100" fill="white" opacity="0.15" rx="8" />
  
  <!-- 主标题 -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">Craftisle Draw</text>
  
  <!-- 副标题 -->
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" opacity="0.9">Free Online Whiteboard</text>
  
  <!-- 特性列表 -->
  <text x="600" y="420" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">Collaborative Drawing • Infinite Canvas • Export PNG/SVG</text>
  
  <!-- URL -->
  <text x="600" y="550" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle" opacity="0.7">draw.craftisle.com</text>
</svg>`;

// 保存 SVG (可以作为临时方案)
fs.writeFileSync(path.join(__dirname, 'og-image.svg'), svg);

console.log('✅ Created og-image.svg');
console.log('📝 Note: For production, convert this SVG to PNG (1200x630)');
console.log('   You can use: https://cloudconvert.com/svg-to-png or any image editor');
