import {
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roles = [
  "System Administrator",
  "Operations Manager",
  "Claim Specialist",
  "Document Reviewer",
];

const permissionGroups = [
  {
    name: "Claims",
    permissions: [
      "View Claims",
      "Create Claim",
      "Edit Claim",
      "Assign Claim",
      "Escalate Claim",
    ],
  },
  {
    name: "Documents",
    permissions: [
      "View Documents",
      "Upload Documents",
      "Review Documents",
      "Validate Documents",
    ],
  },
  {
    name: "Operations",
    permissions: [
      "View Queue",
      "Assign Work",
      "Manage Tasks",
      "View SLA",
    ],
  },
  {
    name: "Administration",
    permissions: [
      "Manage Users",
      "Manage Roles",
      "Manage Permissions",
      "View Audit",
    ],
  },
];

function AdminPermissions() {
  const [
    selectedRole,
    setSelectedRole,
  ] = useState(
    roles[0]
  );

  const [
    permissions,
    setPermissions,
  ] = useState({
    "View Claims": true,
    "Create Claim": true,
    "Edit Claim": true,
    "Assign Claim": true,
    "Escalate Claim": true,
    "View Documents": true,
    "Upload Documents": true,
    "Review Documents": true,
    "Validate Documents": true,
    "View Queue": true,
    "Assign Work": true,
    "Manage Tasks": true,
    "View SLA": true,
    "Manage Users": true,
    "Manage Roles": true,
    "Manage Permissions": true,
    "View Audit": true,
  });

  const togglePermission = (
    permission
  ) => {
    setPermissions(
      (previous) => ({
        ...previous,
        [permission]:
          !previous[permission],
      })
    );
  };

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-08"
            title="Permission Matrix"
            description="Manage role-to-permission mappings for authorized administrators."
          />


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  ROLE ACCESS
                </span>

                <h2>
                  Permission Matrix
                </h2>
              </div>

              <button className="admin-primary-button">
                Save Changes
              </button>

            </div>


            <div className="admin-permission-role">

              <label>
                Select Role
              </label>

              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(
                    event.target.value
                  )
                }
              >

                {roles.map(
                  (role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="admin-permission-groups">

              {permissionGroups.map(
                (group) => (

                  <div
                    key={group.name}
                    className="admin-permission-group"
                  >

                    <div className="admin-permission-group-header">

                      <h3>
                        {group.name}
                      </h3>

                      <span>
                        {group.permissions.length} permissions
                      </span>

                    </div>


                    {group.permissions.map(
                      (permission) => (

                        <label
                          key={
                            permission
                          }
                          className="admin-permission-row"
                        >

                          <span>
                            {permission}
                          </span>

                          <input
                            type="checkbox"
                            checked={
                              permissions[
                                permission
                              ]
                            }
                            onChange={() =>
                              togglePermission(
                                permission
                              )
                            }
                          />

                        </label>

                      )
                    )}

                  </div>

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

export default AdminPermissions;