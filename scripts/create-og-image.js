const fs = require('fs');
const zlib = require('zlib');

// 创建 PNG 文件
function createPNG(width, height, drawFunc) {
  // PNG 签名
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdr = createChunk('IHDR', ihdrData);
  
  // 图像数据
  const rawData = Buffer.alloc(height * (1 + width * 3)); // filter byte + RGB pixels
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 3);
    rawData[rowOffset] = 0; // filter: none
    
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
  
  // IEND chunk
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

// 绘制渐变背景
function drawGradient(x, y, width, height) {
  const ratioX = x / width;
  const ratioY = y / height;
  
  // 渐变：从 #667eea 到 #764ba2
  const r = Math.round(102 + (118 - 102) * ratioY);
  const g = Math.round(126 + (75 - 126) * ratioY);
  const b = Math.round(234 + (162 - 234) * ratioY);
  
  return [r, g, b];
}

// 创建 OG 图片 (1200x630)
const width = 1200;
const height = 630;
const pngBuffer = createPNG(width, height, drawGradient);

fs.writeFileSync('public/og-image.png', pngBuffer);
console.log('✅ Created public/og-image.png (1200x630)');
