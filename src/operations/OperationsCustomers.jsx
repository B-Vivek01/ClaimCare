import { useProfiles } from "../backend/useProfiles";
import { useClaims } from "../claim/ClaimContext";
import { usePolicies } from "../policy/PolicyContext";
import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OperationsCustomers() {
  const [profiles]=useProfiles();
  const {claims}=useClaims();
  const {policies}=usePolicies();
  const customers=profiles.filter(profile=>profile.role==='customer').map(profile=>({...profile,phone:profile.mobile,claims:claims.filter(claim=>claim.ownerId===profile.id).length,policies:policies.filter(policy=>policy.ownerId===profile.id).length}));
  const [search, setSearch] =
    useState("");

  const filteredCustomers =
    useMemo(() => {
      return customers.filter(
        (customer) => {
          const text =
            `${customer.id}
            ${customer.name}
            ${customer.email}
            ${customer.phone}`
              .toLowerCase();

          return text.includes(
            search.toLowerCase()
          );
        }
      );
    }, [customers, search]);

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-04 · CUSTOMERS
              </span>

              <h1>
                Operations Customers
              </h1>

              <p>
                Search customer information
                available to authorized operations users.
              </p>
            </div>

            <Link
              to="/ops"
              className="operations-secondary-button"
            >
              ← Operations Portal
            </Link>

          </div>


          <div className="workqueue-summary">

            <Stat
              label="Customers"
              value={
                customers.length
              }
            />

            <Stat
              label="Active"
              value={
                customers.filter(
                  (customer) =>
                    customer.status ===
                    "Active"
                ).length
              }
            />

            <Stat
              label="Policies"
              value={
                customers.reduce(
                  (sum, customer) =>
                    sum +
                    customer.policies,
                  0
                )
              }
            />

            <Stat
              label="Claims"
              value={
                customers.reduce(
                  (sum, customer) =>
                    sum +
                    customer.claims,
                  0
                )
              }
            />

            <Stat
              label="Search Results"
              value={
                filteredCustomers.length
              }
            />

          </div>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  CUSTOMER LOOKUP
                </span>

                <h2>
                  Customer Directory
                </h2>
              </div>

              <strong>
                {filteredCustomers.length} customers
              </strong>

            </div>


            <div className="workqueue-toolbar">

              <div className="workqueue-search">

                <span>
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search customer..."
                />

              </div>

            </div>


            <div className="workqueue-table-wrapper">

              <table className="workqueue-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Policies</th>
                    <th>Claims</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCustomers.map(
                    (customer) => (
                      <tr
                        key={
                          customer.id
                        }
                      >

                        <td>
                          <strong>
                            {customer.name}
                          </strong>

                          <small>
                            {customer.id}
                          </small>
                        </td>

                        <td>
                          {customer.email}
                        </td>

                        <td>
                          {customer.phone}
                        </td>

                        <td>
                          {customer.policies}
                        </td>

                        <td>
                          {customer.claims}
                        </td>

                        <td>
                          <span className="workqueue-status">
                            {customer.status}
                          </span>
                        </td>

                        <td>
                          <button className="workqueue-open-button">
                            View
                          </button>
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

      <Footer />
    </>
  );
}

function Stat({
  label,
  value,
}) {
  return (
    <div className="workqueue-stat">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

export default OperationsCustomers;
