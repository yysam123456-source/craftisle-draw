const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create professional OG image
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#4F46E5'); // Indigo
gradient.addColorStop(1, '#7C3AED'); // Purple
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Add subtle pattern
ctx.globalAlpha = 0.1;
for (let i = 0; i < width; i += 50) {
  for (let j = 0; j < height; j += 50) {
    ctx.beginPath();
    ctx.arc(i, j, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }
}
ctx.globalAlpha = 1.0;

// Whiteboard icon (simplified)
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(80, 150, 300, 330);
ctx.fillStyle = '#4F46E5';
ctx.fillRect(100, 170, 260, 40);
ctx.fillStyle = '#E5E7EB';
ctx.fillRect(100, 220, 260, 20);
ctx.fillRect(100, 250, 200, 20);
ctx.fillRect(100, 280, 240, 20);
ctx.fillRect(100, 310, 180, 20);
ctx.fillRect(100, 340, 220, 20);
ctx.fillRect(100, 370, 160, 20);
ctx.fillRect(100, 400, 240, 20);

// Pencil icon
ctx.fillStyle = '#F59E0B';
ctx.beginPath();
ctx.moveTo(350, 420);
ctx.lineTo(370, 400);
ctx.lineTo(420, 450);
ctx.lineTo(400, 470);
ctx.closePath();
ctx.fill();

// Title
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 72px Inter, sans-serif';
ctx.fillText('Craftisle Draw', 450, 280);

// Subtitle
ctx.fillStyle = '#E0E7FF';
ctx.font = '36px Inter, sans-serif';
ctx.fillText('Free Online Whiteboard', 450, 340);

// Features
ctx.fillStyle = '#C7D2FE';
ctx.font = '28px Inter, sans-serif';
ctx.fillText('✓ Real-time Collaboration', 450, 400);
ctx.fillText('✓ Export to PNG/SVG', 450, 440);
ctx.fillText('✓ No Signup Required', 450, 480);

// Bottom bar
ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
ctx.fillRect(0, 580, width, 50);
ctx.fillStyle = '#FFFFFF';
ctx.font = '24px Inter, sans-serif';
ctx.fillText('draw.craftisle.com', 40, 612);

// Save
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/og-image.png'), buffer);
console.log('✅ Professional OG image created: public/og-image.png');
