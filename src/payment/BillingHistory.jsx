import { Link } from "react-router-dom";

import {
  usePayment,
} from "./PaymentContext";

function BillingHistory() {
  const {
    payments,
  } = usePayment();

  const successful =
    payments.filter(
      (payment) =>
        payment.status === "Success"
    );

  const totalBase =
    successful.reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  const totalTax =
    successful.reduce(
      (sum, payment) =>
        sum + payment.tax,
      0
    );

  const total =
    successful.reduce(
      (sum, payment) =>
        sum + payment.total,
      0
    );

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAY-08 / PAY-09
            </span>

            <h1>
              Billing History
            </h1>

            <p>
              Review billing transactions,
              taxes and applicable credits.
            </p>
          </div>

          <Link
            to="/payments"
            className="payment-secondary-button"
          >
            ← Payment Dashboard
          </Link>

        </div>

        <div className="payment-billing-summary">

          <div>
            <span>
              BASE AMOUNT
            </span>

            <strong>
              ₹
              {totalBase.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>
              TAX
            </span>

            <strong>
              ₹
              {totalTax.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>
              TOTAL BILLING
            </span>

            <strong>
              ₹
              {total.toLocaleString()}
            </strong>
          </div>

        </div>

        <section className="payment-card">

          <div className="payment-card-header">

            <div>
              <span>
                TRANSACTION HISTORY
              </span>

              <h2>
                Billing Transactions
              </h2>
            </div>

          </div>

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Customer</th>
                  <th>Base</th>
                  <th>Tax</th>
                  <th>Total</th>
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
                        {payment.transactionId}
                      </td>

                      <td>
                        {payment.customer}
                      </td>

                      <td>
                        ₹
                        {payment.amount.toLocaleString()}
                      </td>

                      <td>
                        ₹
                        {payment.tax.toLocaleString()}
                      </td>

                      <td>
                        ₹
                        {payment.total.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`payment-status ${
                            payment.status.toLowerCase()
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

export default BillingHistory;