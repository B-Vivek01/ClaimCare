import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialUsers = [
  {
    id: "USR-1001",
    name: "Arjun Sharma",
    email: "arjun@claimcare.com",
    role: "Claim Specialist",
    status: "Active",
    lastLogin: "13 Aug 2026, 09:12",
  },
  {
    id: "USR-1002",
    name: "Meena Rao",
    email: "meena@claimcare.com",
    role: "Document Reviewer",
    status: "Active",
    lastLogin: "13 Aug 2026, 08:45",
  },
  {
    id: "USR-1003",
    name: "Kiran Kumar",
    email: "kiran@claimcare.com",
    role: "Operations Manager",
    status: "Active",
    lastLogin: "12 Aug 2026, 18:20",
  },
  {
    id: "USR-1004",
    name: "Ravi Patel",
    email: "ravi@claimcare.com",
    role: "Customer Support Executive",
    status: "Disabled",
    lastLogin: "08 Aug 2026, 11:30",
  },
];

function AdminUsers() {
  const [users, setUsers] =
    useState(initialUsers);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (user) => {
          const text =
            `${user.id}
            ${user.name}
            ${user.email}
            ${user.role}`
              .toLowerCase();

          return (
            text.includes(
              search.toLowerCase()
            ) &&
            (
              status === "All" ||
              user.status === status
            )
          );
        }
      );
    }, [
      users,
      search,
      status,
    ]);

  const disableUser = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to disable this user?"
      );

    if (!confirmed) {
      return;
    }

    setUsers(
      (previous) =>
        previous.map(
          (user) =>
            user.id === id
              ? {
                  ...user,
                  status:
                    user.status ===
                    "Active"
                      ? "Disabled"
                      : "Active",
                }
              : user
        )
    );
  };

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-01 → ADM-05"
            title="User Management"
            description="Create, edit, disable and manage authorized platform users."
          />


          <div className="admin-summary">

            <Summary
              label="Total Users"
              value={users.length}
            />

            <Summary
              label="Active"
              value={
                users.filter(
                  (user) =>
                    user.status ===
                    "Active"
                ).length
              }
            />

            <Summary
              label="Disabled"
              value={
                users.filter(
                  (user) =>
                    user.status ===
                    "Disabled"
                ).length
              }
            />

            <Summary
              label="Search Results"
              value={
                filteredUsers.length
              }
            />

          </div>


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  USER DIRECTORY
                </span>

                <h2>
                  Platform Users
                </h2>
              </div>

              <button className="admin-primary-button">
                + Create User
              </button>

            </div>


            <div className="admin-toolbar">

              <div className="admin-search">
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
                  placeholder="Search users..."
                />
              </div>


              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Disabled">
                  Disabled
                </option>
              </select>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map(
                    (user) => (

                      <tr
                        key={user.id}
                      >

                        <td>
                          <strong>
                            {user.name}
                          </strong>

                          <small>
                            {user.email}
                          </small>

                          <small>
                            {user.id}
                          </small>
                        </td>

                        <td>
                          <span className="admin-role-badge">
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              user.status ===
                              "Active"
                                ? "admin-status active"
                                : "admin-status disabled"
                            }
                          >
                            {user.status}
                          </span>
                        </td>

                        <td>
                          {user.lastLogin}
                        </td>

                        <td>

                          <div className="admin-table-actions">

                            <button>
                              Edit
                            </button>

                            <button>
                              Reset Password
                            </button>

                            <button
                              onClick={() =>
                                disableUser(
                                  user.id
                                )
                              }
                            >
                              {user.status ===
                              "Active"
                                ? "Disable"
                                : "Enable"}
                            </button>

                          </div>

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

function Summary({
  label,
  value,
}) {
  return (
    <div className="admin-summary-card">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default AdminUsers;