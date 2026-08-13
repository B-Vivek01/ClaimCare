import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const auditRecords = [
  {
    id: "AUD-1001",
    actor: "Admin User",
    action: "Role Updated",
    target: "ROLE-002",
    category: "Role",
    result: "Success",
    time: "13 Aug 2026, 09:30",
  },
  {
    id: "AUD-1002",
    actor: "Admin User",
    action: "User Disabled",
    target: "USR-1004",
    category: "User",
    result: "Success",
    time: "13 Aug 2026, 09:05",
  },
  {
    id: "AUD-1003",
    actor: "System Admin",
    action: "Permission Updated",
    target: "ROLE-003",
    category: "Permission",
    result: "Success",
    time: "12 Aug 2026, 17:20",
  },
  {
    id: "AUD-1004",
    actor: "Operations Admin",
    action: "Workflow Setting Changed",
    target: "WF-SETTING",
    category: "Configuration",
    result: "Success",
    time: "12 Aug 2026, 14:10",
  },
];

function AdminAudit() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const filteredRecords =
    useMemo(() => {
      return auditRecords.filter(
        (record) => {
          const text =
            `${record.id}
            ${record.actor}
            ${record.action}
            ${record.target}`
              .toLowerCase();

          return (
            text.includes(
              search.toLowerCase()
            ) &&
            (
              category === "All" ||
              record.category ===
                category
            )
          );
        }
      );
    }, [
      search,
      category,
    ]);

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-09 / ADM-15"
            title="Audit Access"
            description="Search, filter and review administrative activity and permission changes."
          />


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  AUDIT LOG
                </span>

                <h2>
                  Administrative Events
                </h2>
              </div>

              <strong>
                {filteredRecords.length} records
              </strong>

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
                  placeholder="Search audit records..."
                />

              </div>


              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Categories
                </option>

                <option value="User">
                  User
                </option>

                <option value="Role">
                  Role
                </option>

                <option value="Permission">
                  Permission
                </option>

                <option value="Configuration">
                  Configuration
                </option>

              </select>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Category</th>
                    <th>Result</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRecords.map(
                    (record) => (

                      <tr
                        key={
                          record.id
                        }
                      >

                        <td>
                          <strong>
                            {record.id}
                          </strong>
                        </td>

                        <td>
                          {record.actor}
                        </td>

                        <td>
                          {record.action}
                        </td>

                        <td>
                          {record.target}
                        </td>

                        <td>
                          <span className="admin-role-badge">
                            {record.category}
                          </span>
                        </td>

                        <td>
                          <span className="admin-status active">
                            {record.result}
                          </span>
                        </td>

                        <td>
                          {record.time}
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

export default AdminAudit;