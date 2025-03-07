function whatwgRNG(length = 16) {
  const rnds8 = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(rnds8);
  } else {
    throw new Error('crypto.getRandomValues is not available');
  }
  return rnds8;
}
const byteToHex: string[] = [];
for (let i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substring(1);
}
export default function randomKey(length = 12): string {
  return whatwgRNG(length)
    .reduce((str, n) => str + byteToHex[n], '')
    .slice(0, length);
}