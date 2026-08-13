import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const PaymentContext = createContext();

const initialPayments = [
  {
    id: "PAY-1001",
    customer: "Rahul Kumar",
    policyId: "POL-2001",
    invoiceId: "INV-1001",
    amount: 12500,
    tax: 2250,
    total: 14750,
    method: "UPI",
    status: "Success",
    date: "2026-08-10T10:30:00",
    transactionId: "TXN-778821",
  },
  {
    id: "PAY-1002",
    customer: "Priya Sharma",
    policyId: "POL-2002",
    invoiceId: "INV-1002",
    amount: 8500,
    tax: 1530,
    total: 10030,
    method: "Credit Card",
    status: "Pending",
    date: "2026-08-12T14:20:00",
    transactionId: "TXN-778822",
  },
  {
    id: "PAY-1003",
    customer: "Anil Kumar",
    policyId: "POL-2003",
    invoiceId: "INV-1003",
    amount: 18000,
    tax: 3240,
    total: 21240,
    method: "Net Banking",
    status: "Refunded",
    date: "2026-08-05T09:15:00",
    transactionId: "TXN-778823",
  },
];

const initialRefunds = [
  {
    id: "REF-001",
    paymentId: "PAY-1003",
    customer: "Anil Kumar",
    amount: 21240,
    reason: "Duplicate payment",
    status: "Approved",
    requestedAt: "2026-08-06",
  },
];

const initialInvoices = [
  {
    id: "INV-1001",
    customer: "Rahul Kumar",
    policyId: "POL-2001",
    amount: 12500,
    tax: 2250,
    total: 14750,
    status: "Paid",
    dueDate: "2026-08-15",
    createdAt: "2026-08-10",
  },
  {
    id: "INV-1002",
    customer: "Priya Sharma",
    policyId: "POL-2002",
    amount: 8500,
    tax: 1530,
    total: 10030,
    status: "Pending",
    dueDate: "2026-08-20",
    createdAt: "2026-08-12",
  },
];

function PaymentProvider({ children }) {
  const [payments, setPayments] = useState(() => {
    const stored = localStorage.getItem(
      "claimcare_payments"
    );

    return stored
      ? JSON.parse(stored)
      : initialPayments;
  });

  const [refunds, setRefunds] = useState(() => {
    const stored = localStorage.getItem(
      "claimcare_refunds"
    );

    return stored
      ? JSON.parse(stored)
      : initialRefunds;
  });

  const [invoices, setInvoices] = useState(() => {
    const stored = localStorage.getItem(
      "claimcare_invoices"
    );

    return stored
      ? JSON.parse(stored)
      : initialInvoices;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_payments",
      JSON.stringify(payments)
    );
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_refunds",
      JSON.stringify(refunds)
    );
  }, [refunds]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_invoices",
      JSON.stringify(invoices)
    );
  }, [invoices]);

  const processPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: `PAY-${Date.now()}`,
      invoiceId: `INV-${Date.now()}`,
      transactionId: `TXN-${Date.now()}`,
      status: "Success",
      date: new Date().toISOString(),
    };

    setPayments((previous) => [
      newPayment,
      ...previous,
    ]);

    return newPayment;
  };

  const updatePaymentStatus = (
    paymentId,
    status
  ) => {
    setPayments((previous) =>
      previous.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status,
            }
          : payment
      )
    );
  };

  const addRefundRequest = (refundData) => {
    const newRefund = {
      ...refundData,
      id: `REF-${Date.now()}`,
      status: "Pending",
      requestedAt:
        new Date().toISOString(),
    };

    setRefunds((previous) => [
      newRefund,
      ...previous,
    ]);
  };

  const updateRefundStatus = (
    refundId,
    status
  ) => {
    setRefunds((previous) =>
      previous.map((refund) =>
        refund.id === refundId
          ? {
              ...refund,
              status,
            }
          : refund
      )
    );
  };

  const addInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `INV-${Date.now()}`,
      status: "Pending",
      createdAt:
        new Date().toISOString(),
    };

    setInvoices((previous) => [
      newInvoice,
      ...previous,
    ]);
  };

  const updateInvoiceStatus = (
    invoiceId,
    status
  ) => {
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              status,
            }
          : invoice
      )
    );
  };

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status === "Success"
    );

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status === "Pending"
    );

  const totalRevenue =
    successfulPayments.reduce(
      (total, payment) =>
        total + payment.total,
      0
    );

  return (
    <PaymentContext.Provider
      value={{
        payments,
        refunds,
        invoices,
        successfulPayments,
        pendingPayments,
        totalRevenue,
        processPayment,
        updatePaymentStatus,
        addRefundRequest,
        updateRefundStatus,
        addInvoice,
        updateInvoiceStatus,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}

export default PaymentProvider;