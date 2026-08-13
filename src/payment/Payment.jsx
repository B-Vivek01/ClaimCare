import { useState } from "react";
import { Link } from "react-router-dom";

import {
  usePayment,
} from "./PaymentContext";

function Payment() {
  const {
    processPayment,
  } = usePayment();

  const [formData, setFormData] =
    useState({
      customer: "",
      policyId: "",
      amount: "",
      method: "UPI",
    });

  const [message, setMessage] =
    useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.customer ||
      !formData.policyId ||
      !formData.amount
    ) {
      setMessage(
        "Please complete all required fields."
      );

      return;
    }

    const amount =
      Number(formData.amount);

    const tax =
      amount * 0.18;

    processPayment({
      customer: formData.customer,
      policyId: formData.policyId,
      amount,
      tax,
      total: amount + tax,
      method: formData.method,
    });

    setMessage(
      "Payment processed successfully."
    );

    setFormData({
      customer: "",
      policyId: "",
      amount: "",
      method: "UPI",
    });
  };

  return (
    <main className="payment-page">
      <div className="payment-container">

        <div className="payment-header">

          <div>
            <span className="payment-badge">
              PAY-01
            </span>

            <h1>
              Make Payment
            </h1>

            <p>
              Submit a payment for a policy
              or service.
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
                PAYMENT FORM
              </span>

              <h2>
                Payment Information
              </h2>
            </div>

          </div>

          {message && (
            <div className="payment-success-message">
              {message}
            </div>
          )}

          <form
            className="payment-form"
            onSubmit={handleSubmit}
          >

            <label>
              Customer Name

              <input
                name="customer"
                value={
                  formData.customer
                }
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </label>

            <label>
              Policy ID

              <input
                name="policyId"
                value={
                  formData.policyId
                }
                onChange={handleChange}
                placeholder="POL-XXXX"
              />
            </label>

            <label>
              Amount

              <input
                type="number"
                name="amount"
                value={
                  formData.amount
                }
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </label>

            <label>
              Payment Method

              <select
                name="method"
                value={
                  formData.method
                }
                onChange={handleChange}
              >
                <option>
                  UPI
                </option>

                <option>
                  Credit Card
                </option>

                <option>
                  Debit Card
                </option>

                <option>
                  Net Banking
                </option>
              </select>
            </label>

            <button
              type="submit"
              className="payment-primary-button"
            >
              Process Payment
            </button>

          </form>

        </section>

      </div>
    </main>
  );
}

export default Payment;