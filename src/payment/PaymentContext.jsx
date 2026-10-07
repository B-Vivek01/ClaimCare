import { createContext, useContext } from 'react';
import { useRecords } from '../data/useRecords';
import { openCheckout } from './checkout';
const PaymentContext = createContext();
export default function PaymentProvider({children}) {
  const [payments] = useRecords('payments');
  const [refunds,setRefunds] = useRecords('refunds');
  const [invoices,setInvoices] = useRecords('invoices');
  const successfulPayments = payments.filter(payment => payment.status === 'Success');
  const pendingPayments = payments.filter(payment => payment.status === 'Pending');
  const totalRevenue = successfulPayments.reduce((total,payment) => total + Number(payment.total || 0),0);
  const processPayment = invoiceId => openCheckout(invoiceId);
  const addRefundRequest = async data => setRefunds(previous => [...previous,{...data,id:`REF-${crypto.randomUUID()}`,status:'Pending',requestedAt:new Date().toISOString()}]);
  const addInvoice = async data => setInvoices(previous => [...previous,{...data,id:`INV-${crypto.randomUUID()}`,status:'Pending',createdAt:new Date().toISOString()}]);
  const unavailable = () => window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{error:'Payment and refund status changes require a verified payment provider response.'}}));
  return <PaymentContext.Provider value={{payments,refunds,invoices,successfulPayments,pendingPayments,totalRevenue,processPayment,addRefundRequest,addInvoice,updatePaymentStatus:unavailable,updateInvoiceStatus:unavailable,updateRefundStatus:unavailable}}>{children}</PaymentContext.Provider>;
}
export function usePayment() { return useContext(PaymentContext); }
