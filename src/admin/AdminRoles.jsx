import {
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialRoles = [
  {
    id: "ROLE-001",
    name: "System Administrator",
    description:
      "Full platform administration.",
    users: 2,
    status: "Active",
  },
  {
    id: "ROLE-002",
    name: "Operations Manager",
    description:
      "Operations queues, assignments and SLA.",
    users: 5,
    status: "Active",
  },
  {
    id: "ROLE-003",
    name: "Claim Specialist",
    description:
      "Assigned claim and task operations.",
    users: 18,
    status: "Active",
  },
  {
    id: "ROLE-004",
    name: "Document Reviewer",
    description:
      "Document review and validation.",
    users: 9,
    status: "Active",
  },
];

function AdminRoles() {
  const [roles] =
    useState(initialRoles);

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-06 → ADM-07"
            title="Role Management"
            description="Create and modify role configurations for authorized platform users."
          />


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  ROLE CONFIGURATION
                </span>

                <h2>
                  Platform Roles
                </h2>
              </div>

              <button className="admin-primary-button">
                + Create Role
              </button>

            </div>


            <div className="admin-role-grid">

              {roles.map(
                (role) => (

                  <article
                    key={role.id}
                    className="admin-role-card"
                  >

                    <div className="admin-role-icon">
                      🛡️
                    </div>

                    <span>
                      {role.id}
                    </span>

                    <h3>
                      {role.name}
                    </h3>

                    <p>
                      {role.description}
                    </p>


                    <div className="admin-role-meta">

                      <div>
                        <small>
                          Users
                        </small>

                        <strong>
                          {role.users}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Status
                        </small>

                        <strong>
                          {role.status}
                        </strong>
                      </div>

                    </div>


                    <div className="admin-role-actions">

                      <button>
                        Edit Role
                      </button>

                      <Link
                        to="/admin/permissions"
                      >
                        Permissions
                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

function AdminHeader({
  code,
  title,
  description,
}) {
  return (
    <div className="admin-header">

      <div>

        <span className="admin-badge">
          {code}
        </span>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

      </div>

      <Link
        to="/admin"
        className="admin-secondary-button"
      >
        ← Admin Dashboard
      </Link>

    </div>
  );
}

export default AdminRoles;