import imageCompression from 'browser-image-compression';
export async function compressImage(file) {
  const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 800, useWebWorker: true });
  return new File([compressed], file.name, { type: compressed.type });
}
