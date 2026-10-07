import { useProfiles } from "../backend/useProfiles";
import { updateDoc } from "../backend/profiles";
import { useAuth } from "../auth/AuthContext";
import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminUsers() {
  const { user:actor } = useAuth();
  const [busy,setBusy] = useState(false);
  const [users, setUsers] = useProfiles();

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

  const disableUser = async (id) => {
    if (busy || id===actor?.uid) return;
    const user = users.find(item=>item.id===id);
    if (!user || !window.confirm('Change this account access status?')) return;
    try {
      setBusy(true);
      const status = user.status==='Active'?'Disabled':'Active';
      await updateDoc({id},{status,disabled:status==='Disabled'});
      setUsers(previous=>previous.map(item=>item.id===id?{...item,status}:item));
    } catch (error) { window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{error:error.message}})); }
    finally { setBusy(false); }
  };
  const changeRole = async (id,role) => {
    if(busy || id===actor?.uid || !window.confirm(`Change this account role to ${role}?`)) return;
    setBusy(true);
    try { await updateDoc({id},{role});setUsers(previous=>previous.map(item=>item.id===id?{...item,role}:item)); }
    catch(error) {window.dispatchEvent(new CustomEvent('claimcare:data',{detail:{error:error.message}}));}
    finally {setBusy(false);}
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

              <p>New users register and confirm their email. Administrators assign their roles here.</p>

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
                          <select aria-label={`Role for ${user.email}`} value={user.role} disabled={busy || user.id===actor?.uid} onChange={event=>changeRole(user.id,event.target.value)}>
                            <option value="customer">Customer</option><option value="operations">Operations</option><option value="admin">Administrator</option>
                          </select>
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
                          {user.lastLogin || 'Not tracked'}
                        </td>

                        <td>

                          <div className="admin-table-actions">

                            <button
                              disabled={busy || user.id===actor?.uid}
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
