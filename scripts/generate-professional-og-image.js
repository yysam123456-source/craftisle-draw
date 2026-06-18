const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建专业的 OG 图片 (1200x630)
const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// 渐变背景
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// 装饰元素 - 半透明矩形
ctx.globalAlpha = 0.1;
ctx.strokeStyle = 'white';
ctx.lineWidth = 3;

// 矩形 1
ctx.strokeRect(100, 50, 300, 200);

// 矩形 2
ctx.strokeRect(800, 400, 250, 180);

// 圆形
ctx.beginPath();
ctx.arc(950, 150, 75, 0, Math.PI * 2);
ctx.stroke();

ctx.globalAlpha = 1.0;

// 主标题
ctx.font = 'bold 72px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Craftisle Draw', width / 2, 250);

// 副标题
ctx.font = '32px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
ctx.fillText('Free Online Whiteboard', width / 2, 320);

// 特性列表
const features = ['Infinite Canvas', 'Real-time Collab', 'Export PNG/SVG'];
ctx.font = '24px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

features.forEach((feature, index) => {
  const x = width / 2 - 300 + index * 200;
  ctx.fillText(`✓ ${feature}`, x + 100, 400);
});

// URL
ctx.font = '28px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
ctx.fillText('draw.craftisle.com', width / 2, 550);

// 保存为 PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/og-image.png', buffer);

console.log('✅ Created professional og-image.png (1200x630)');
