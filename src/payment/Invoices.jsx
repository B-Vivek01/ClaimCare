import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import InvoiceCreate from "./InvoiceCreate";

import {
  usePayment,
} from "./PaymentContext";

function Invoices() {
  const { profile } = useAuth();
  const {
    invoices,
  } = usePayment();

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAY-06 / PAY-07
            </span>

            <h1>
              Invoices
            </h1>

            <p>
              View invoice amounts, tax and
              payment status.
            </p>
          </div>

          <Link
            to="/payments"
            className="payment-secondary-button"
          >
            ← Payment Dashboard
          </Link>

        </div>

        {['admin', 'operations'].includes(profile?.role) && <InvoiceCreate />}
        <section className="payment-card">

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Policy</th>
                  <th>Amount</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>

              <tbody>

                {invoices.map(
                  (invoice) => (
                    <tr
                      key={invoice.id}
                    >

                      <td>
                        <strong>
                          {invoice.id}
                        </strong>
                      </td>

                      <td>
                        {invoice.customer}
                      </td>

                      <td>
                        {invoice.policyId}
                      </td>

                      <td>
                        ₹
                        {invoice.amount.toLocaleString()}
                      </td>

                      <td>
                        ₹
                        {invoice.tax.toLocaleString()}
                      </td>

                      <td>
                        ₹
                        {invoice.total.toLocaleString()}
                      </td>

                      <td>

                        <span>{invoice.status}</span>

                      </td>

                      <td>
                        {invoice.dueDate}
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

export default Invoices;

