const fs = require('fs');
const zlib = require('zlib');

// 创建简单的 icon 图片
function createPNG(width, height, drawFunc) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  
  const ihdr = createChunk('IHDR', ihdrData);
  
  const rawData = Buffer.alloc(height * (1 + width * 4)); // RGBA
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0;
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFunc(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }
  
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// 绘制简单的圆形 icon
function drawIcon(x, y, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
  
  const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  
  if (dist <= radius) {
    return [102, 126, 234, 255]; // 蓝色
  }
  
  return [0, 0, 0, 0]; // 透明
}

// 创建各种尺寸的 icon
const sizes = [32, 192, 512];
sizes.forEach(size => {
  const pngBuffer = createPNG(size, size, drawIcon);
  fs.writeFileSync(`public/icon-${size}x${size}.png`, pngBuffer);
  console.log(`✅ Created public/icon-${size}x${size}.png`);
});

// 创建 favicon.ico (实际上是 PNG，但浏览器也支持)
const favicon = createPNG(32, 32, drawIcon);
fs.writeFileSync('public/favicon.ico', favicon);
console.log('✅ Created public/favicon.ico');

// 创建 apple-touch-icon
const appleIcon = createPNG(180, 180, drawIcon);
fs.writeFileSync('public/apple-touch-icon.png', appleIcon);
console.log('✅ Created public/apple-touch-icon.png');
