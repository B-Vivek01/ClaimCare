import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, webcrypto } from 'node:crypto';
import { validSignature, invoicePaise } from '../supabase/functions/_shared/payment-security.js';
test('payment signatures reject altered orders, forged values, and malformed hashes', async () => {
  const message = 'order_test|pay_test';
  const signature = createHmac('sha256','test-secret').update(message).digest('hex');
  assert.equal(await validSignature(message,signature,'test-secret',webcrypto),true);
  assert.equal(await validSignature('order_other|pay_test',signature,'test-secret',webcrypto),false);
  assert.equal(await validSignature(message,signature,'wrong-secret',webcrypto),false);
  assert.equal(await validSignature(message,'invalid','test-secret',webcrypto),false);
});
test('checkout amounts are derived from invoices and reject invalid amounts', () => {
  assert.equal(invoicePaise({total:118.25}),11825);
  for (const total of [-1,0,NaN,Infinity,'bad',1000001]) assert.throws(() => invoicePaise({total}));
});
