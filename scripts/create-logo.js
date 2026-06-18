const fs = require('fs');
const zlib = require('zlib');

// 创建简单的 logo 图片 (200x200 PNG)
function createPNG(width, height, drawFunc) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  
  const ihdr = createChunk('IHDR', ihdrData);
  
  const rawData = Buffer.alloc(height * (1 + width * 3));
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 3);
    rawData[rowOffset] = 0;
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      const [r, g, b] = drawFunc(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
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

// 绘制简单的 logo (圆形 + 字母 C)
function drawLogo(x, y, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
  
  const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  
  // 圆形背景
  if (dist <= radius) {
    // 渐变蓝色
    const r = 102;
    const g = 126;
    const b = 234;
    return [r, g, b];
  }
  
  // 白色背景
  return [255, 255, 255];
}

const width = 200;
const height = 200;
const pngBuffer = createPNG(width, height, drawLogo);

fs.writeFileSync('public/logo.png', pngBuffer);
console.log('✅ Created public/logo.png (200x200)');
