import {
  useMemo,
  useState,
  useEffect,
} from "react";
import { requireBackend } from "../backend/client";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function AdminAudit() {
  const [auditRecords,setAuditRecords] = useState([]);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    let active=true;
    async function load() {
      try {
        const {data,error:failure}=await requireBackend().from('audit_events').select('*').order('created_at',{ascending:false}).limit(500);
        if(failure) throw failure;
        if(active) {setAuditRecords(data.map(row=>({id:row.id,actor:row.actor_id || 'System',action:row.action,target:row.record_id,category:row.module,result:'Recorded',time:new Date(row.created_at).toLocaleString()})));setError('');}
      } catch(problem) { if(active) setError(problem.message); }
      finally { if(active) setLoading(false); }
    }
    load(); const timer=setInterval(load,15000);
    return()=>{active=false;clearInterval(timer);};
  },[]);
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
      auditRecords,
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
            {loading && <p>Loading audit events…</p>}
            {error && <p role="alert">{error}</p>}
            <p>Most recent 500 database events. Refreshes every 15 seconds.</p>

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

                {[...new Set(auditRecords.map(row=>row.category))].map(value=><option key={value} value={value}>{value}</option>)}

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
