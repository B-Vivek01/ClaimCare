import { requireBackend } from '../backend/client';
import { auth } from '../backend/auth';
export const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain'];
export async function fileUrl(storagePath, download = false) {
  const { data, error } = await requireBackend().storage.from('documents').createSignedUrl(storagePath, 300, download ? { download: true } : undefined);
  if (error) throw error;
  return data.signedUrl;
}
export async function storeFile(file) {
  if (!auth.currentUser) throw new Error('Sign in before uploading.');
  if (!allowedFileTypes.includes(file.type)) throw new Error('This file type is not supported.');
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('Files must be between 1 byte and 10 MB.');
  const storagePath = `${auth.currentUser.uid}/${crypto.randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error } = await requireBackend().storage.from('documents').upload(storagePath, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return { storagePath };
}
