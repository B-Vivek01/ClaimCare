import { Link } from "react-router-dom";

import {
  usePayment,
} from "./PaymentContext";

function PaymentDashboard() {
  const {
    payments,
    invoices,
    refunds,
    totalRevenue,
    pendingPayments,
  } = usePayment();

  const paidInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "Paid"
    ).length;

  const pendingRefunds =
    refunds.filter(
      (refund) =>
        refund.status === "Pending"
    ).length;

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAYMENT & BILLING
            </span>

            <h1>
              Payment & Billing
            </h1>

            <p>
              Manage payments, invoices,
              refunds and billing activity.
            </p>
          </div>

        </div>

        <div className="payment-summary">

          <div className="payment-summary-card">
            <span>
              TOTAL REVENUE
            </span>

            <strong>
              ₹{totalRevenue.toLocaleString()}
            </strong>

            <small>
              Successful payments
            </small>
          </div>

          <div className="payment-summary-card">
            <span>
              PAYMENTS
            </span>

            <strong>
              {payments.length}
            </strong>

            <small>
              Total transactions
            </small>
          </div>

          <div className="payment-summary-card">
            <span>
              PENDING
            </span>

            <strong>
              {pendingPayments.length}
            </strong>

            <small>
              Pending payments
            </small>
          </div>

          <div className="payment-summary-card">
            <span>
              INVOICES
            </span>

            <strong>
              {paidInvoices}
            </strong>

            <small>
              Paid invoices
            </small>
          </div>

        </div>

        <section className="payment-module-grid">

          <Link
            to="/payments/new"
            className="payment-module-card"
          >
            <div className="payment-module-icon">
              💳
            </div>

            <span>PAY-01</span>

            <h3>
              Make Payment
            </h3>

            <p>
              Start a payment and view
              processing status.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/payments/history"
            className="payment-module-card"
          >
            <div className="payment-module-icon">
              🧾
            </div>

            <span>PAY-02</span>

            <h3>
              Payment History
            </h3>

            <p>
              View previous payment
              transactions.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/payments/refunds"
            className="payment-module-card"
          >
            <div className="payment-module-icon">
              ↩️
            </div>

            <span>PAY-04</span>

            <h3>
              Refund Requests
            </h3>

            <p>
              Submit and track eligible
              refund requests.
            </p>

            <strong>
              {pendingRefunds > 0
                ? `${pendingRefunds} pending`
                : "→"}
            </strong>
          </Link>

          <Link
            to="/payments/invoices"
            className="payment-module-card"
          >
            <div className="payment-module-icon">
              📄
            </div>

            <span>PAY-06</span>

            <h3>
              Invoices
            </h3>

            <p>
              View generated invoices
              and their status.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/payments/billing"
            className="payment-module-card"
          >
            <div className="payment-module-icon">
              📊
            </div>

            <span>PAY-08</span>

            <h3>
              Billing History
            </h3>

            <p>
              Review billing transactions
              and totals.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/payments/details"
            className="payment-module-card"
          >
            <div className="payment-module-icon">
              🔎
            </div>

            <span>PAY-03 / PAY-05</span>

            <h3>
              Payment Details
            </h3>

            <p>
              Inspect payment status,
              receipt and transaction data.
            </p>

            <strong>→</strong>
          </Link>

        </section>

        <section className="payment-card">

          <div className="payment-card-header">

            <div>
              <span>
                RECENT ACTIVITY
              </span>

              <h2>
                Recent Payments
              </h2>
            </div>

            <Link
              to="/payments/history"
              className="payment-link-button"
            >
              View All
            </Link>

          </div>

          <div className="payment-mini-list">

            {payments
              .slice(0, 5)
              .map((payment) => (
                <div
                  key={payment.id}
                  className="payment-mini-item"
                >
                  <div>
                    <strong>
                      {payment.customer}
                    </strong>

                    <small>
                      {payment.id} ·{" "}
                      {payment.method}
                    </small>
                  </div>

                  <div>
                    <strong>
                      ₹
                      {payment.total.toLocaleString()}
                    </strong>

                    <span
                      className={`payment-status ${
                        payment.status
                          .toLowerCase()
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default PaymentDashboard;