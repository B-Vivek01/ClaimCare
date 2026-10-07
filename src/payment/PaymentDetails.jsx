import { useState } from "react";
import { Link } from "react-router-dom";

import {
  usePayment,
} from "./PaymentContext";

function PaymentDetails() {
  const {
    payments,
    updatePaymentStatus,
  } = usePayment();

  const [selectedId, setSelectedId] =
    useState(
      payments[0]?.id || ""
    );

  const payment = payments.find(
    (item) =>
      item.id === (selectedId || payments[0]?.id)
  );

  if (!payment) {
    return (
      <main className="payment-page">
        <div className="payment-container">
          <section className="payment-card">
            <h2>
              No payment available
            </h2>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAY-03 / PAY-05
            </span>

            <h1>
              Payment Details
            </h1>

            <p>
              View transaction and payment
              status information.
            </p>
          </div>

          <Link
            to="/payments"
            className="payment-secondary-button"
          >
            ← Payment Dashboard
          </Link>

        </div>

        <section className="payment-card">

          <div className="payment-detail-selector">

            <label>
              Select Payment

              <select
                value={selectedId}
                onChange={(e) =>
                  setSelectedId(
                    e.target.value
                  )
                }
              >
                {payments.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.id} -{" "}
                      {item.customer}
                    </option>
                  )
                )}
              </select>
            </label>

          </div>

          <div className="payment-detail-grid">

            <Detail
              label="Payment ID"
              value={payment.id}
            />

            <Detail
              label="Customer"
              value={payment.customer}
            />

            <Detail
              label="Policy ID"
              value={payment.policyId}
            />

            <Detail
              label="Invoice ID"
              value={payment.invoiceId}
            />

            <Detail
              label="Transaction ID"
              value={
                payment.transactionId
              }
            />

            <Detail
              label="Payment Method"
              value={payment.method}
            />

            <Detail
              label="Base Amount"
              value={`₹${payment.amount.toLocaleString()}`}
            />

            <Detail
              label="Tax"
              value={`₹${payment.tax.toLocaleString()}`}
            />

            <Detail
              label="Total"
              value={`₹${payment.total.toLocaleString()}`}
            />

            <div className="payment-detail-box">
              <span>Status</span>

              <strong>
                <span
                  className={`payment-status ${
                    payment.status.toLowerCase()
                  }`}
                >
                  {payment.status}
                </span>
              </strong>
            </div>

          </div>

          <div className="payment-detail-actions">

            <button
              className="payment-primary-button"
              onClick={() =>
                updatePaymentStatus(
                  payment.id,
                  "Success"
                )
              }
            >
              Mark Successful
            </button>

            <button
              className="payment-secondary-button"
              onClick={() =>
                updatePaymentStatus(
                  payment.id,
                  "Failed"
                )
              }
            >
              Mark Failed
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div className="payment-detail-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default PaymentDetails;
