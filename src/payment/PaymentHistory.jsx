import { Link } from "react-router-dom";

import {
  usePayment,
} from "./PaymentContext";

function PaymentHistory() {
  const {
    payments,
  } = usePayment();

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAY-02
            </span>

            <h1>
              Payment History
            </h1>

            <p>
              View all previous payment
              transactions.
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

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Customer</th>
                  <th>Policy</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {payments.map(
                  (payment) => (
                    <tr
                      key={payment.id}
                    >

                      <td>
                        <strong>
                          {payment.id}
                        </strong>

                        <small>
                          {
                            payment.transactionId
                          }
                        </small>
                      </td>

                      <td>
                        {payment.customer}
                      </td>

                      <td>
                        {payment.policyId}
                      </td>

                      <td>
                        ₹
                        {payment.total.toLocaleString()}
                      </td>

                      <td>
                        {payment.method}
                      </td>

                      <td>
                        <span
                          className={`payment-status ${
                            payment.status
                              .toLowerCase()
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          payment.date
                        ).toLocaleDateString()}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </main>
  );
}

export default PaymentHistory;