import { useState } from "react";
import { Link } from "react-router-dom";

import {
  usePayment,
} from "./PaymentContext";

function RefundRequests() {
  const {
    payments,
    refunds,
    addRefundRequest,
    updateRefundStatus,
  } = usePayment();

  const [paymentId, setPaymentId] =
    useState(
      payments[0]?.id || ""
    );

  const [reason, setReason] =
    useState("");

  const submitRefund = (e) => {
    e.preventDefault();

    const payment = payments.find(
      (item) =>
        item.id === paymentId
    );

    if (!payment || !reason.trim()) {
      return;
    }

    addRefundRequest({
      paymentId: payment.id,
      customer: payment.customer,
      amount: payment.total,
      reason,
    });

    setReason("");
  };

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAY-04
            </span>

            <h1>
              Refund Requests
            </h1>

            <p>
              Submit and manage eligible
              refund requests.
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

          <div className="payment-card-header">

            <div>
              <span>
                NEW REQUEST
              </span>

              <h2>
                Request Refund
              </h2>
            </div>

          </div>

          <form
            className="payment-form"
            onSubmit={submitRefund}
          >

            <label>
              Payment

              <select
                value={paymentId}
                onChange={(e) =>
                  setPaymentId(
                    e.target.value
                  )
                }
              >
                {payments.map(
                  (payment) => (
                    <option
                      key={payment.id}
                      value={payment.id}
                    >
                      {payment.id} -{" "}
                      {payment.customer}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Reason

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                placeholder="Enter refund reason"
                rows="4"
              />
            </label>

            <button
              type="submit"
              className="payment-primary-button"
            >
              Submit Refund Request
            </button>

          </form>

        </section>

        <section className="payment-card">

          <div className="payment-card-header">

            <div>
              <span>
                REQUEST HISTORY
              </span>

              <h2>
                Refund Requests
              </h2>
            </div>

          </div>

          <div className="payment-refund-list">

            {refunds.map(
              (refund) => (
                <div
                  key={refund.id}
                  className="payment-refund-item"
                >

                  <div>
                    <strong>
                      {refund.id}
                    </strong>

                    <p>
                      {refund.customer} ·{" "}
                      {refund.paymentId}
                    </p>

                    <small>
                      {refund.reason}
                    </small>
                  </div>

                  <div>
                    <strong>
                      ₹
                      {refund.amount.toLocaleString()}
                    </strong>

                    <span
                      className={`payment-status ${
                        refund.status.toLowerCase()
                      }`}
                    >
                      {refund.status}
                    </span>
                  </div>

                  {refund.status ===
                    "Pending" && (
                    <div className="payment-refund-actions">

                      <button
                        className="payment-primary-button"
                        onClick={() =>
                          updateRefundStatus(
                            refund.id,
                            "Approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="payment-danger-button"
                        onClick={() =>
                          updateRefundStatus(
                            refund.id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                    </div>
                  )}

                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default RefundRequests;