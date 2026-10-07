export async function validSignature(message, signature, secret, cryptoApi = globalThis.crypto) {
  if (!/^[a-f0-9]{64}$/i.test(signature || '')) return false;
  const bytes = new Uint8Array(signature.match(/.{2}/g).map(part => parseInt(part, 16)));
  const key = await cryptoApi.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  return cryptoApi.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(message));
}
export function invoicePaise(invoice) {
  const amount = Math.round(Number(invoice.total) * 100);
  if (!Number.isSafeInteger(amount) || amount < 100 || amount > 100000000) throw new Error('Invoice amount is invalid.');
  return amount;
}
