import { deflateSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';

// Synthetic striped PNG fixture. Contains no personal data or real claim evidence.
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}
function chunk(type, bytes) {
  const label = Buffer.from(type);
  const size = Buffer.alloc(4); size.writeUInt32BE(bytes.length);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([label, bytes])));
  return Buffer.concat([size, label, bytes, checksum]);
}
const width = 320, height = 180;
const header = Buffer.alloc(13);
header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
const pixels = Buffer.alloc((width * 3 + 1) * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const offset = y * (width * 3 + 1) + 1 + x * 3;
    const light = Math.floor(x / 40) % 2 === 0;
    pixels[offset] = light ? 240 : 30;
    pixels[offset + 1] = light ? 180 : 80;
    pixels[offset + 2] = light ? 40 : 130;
  }
}
await writeFile(new URL('../tests/fixtures/qa-synthetic-image.png', import.meta.url), Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header),
  chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0)),
]));
