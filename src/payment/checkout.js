import { requireBackend } from '../backend/client';
let scriptPromise;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => { if (window.Razorpay) resolve(); else { scriptPromise = null; script.remove(); reject(new Error('Checkout did not load.')); } };
    script.onerror = () => { scriptPromise = null; script.remove(); reject(new Error('Cannot load Razorpay. Check your connection.')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}
async function request(body) {
  const {data,error} = await requireBackend().functions.invoke('payments',{body});
  if (error) {
    let message = 'Checkout is unavailable. Check the payment service configuration.';
    try { message = (await error.context.json()).error || message; } catch { /* Network errors have no response body. */ }
    throw new Error(message);
  }
  if (data.error) throw new Error(data.error);
  return data;
}
export async function openCheckout(invoiceId) {
  const order = await request({action:'create',invoiceId});
  await loadCheckout();
  return new Promise((resolve,reject) => {
    const checkout = new window.Razorpay({key:order.key,order_id:order.orderId,amount:order.amount,currency:order.currency,name:'ClaimCare',description:'ClaimCare service invoice — test mode',
      handler: async response => {
        try { resolve(await request({action:'verify',orderId:response.razorpay_order_id,paymentId:response.razorpay_payment_id,signature:response.razorpay_signature})); }
        catch (error) { reject(error); }
      }, modal:{ondismiss:() => reject(new Error('Checkout was cancelled. Your invoice remains unpaid.'))},
    });
    checkout.on('payment.failed', event => reject(new Error(event.error?.description || 'Payment failed. Please retry.')));
    checkout.open();
  });
}
