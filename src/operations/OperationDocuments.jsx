import { useDocuments } from "../document/DocumentContext";
import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OperationsDocuments() {
  const { documents: actualDocuments } = useDocuments();
  const documents = actualDocuments.map(item => ({...item,claim:item.claimId || "Unlinked",customer:item.uploadedBy,status:item.reviewStatus,uploaded:item.uploadedDate}));
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const filteredDocuments =
    useMemo(() => {
      return documents.filter(
        (document) => {
          const text =
            `${document.id}
            ${document.name}
            ${document.claim}
            ${document.customer}
            ${document.type}`
              .toLowerCase();

          return (
            text.includes(
              search.toLowerCase()
            ) &&
            (
              status === "All" ||
              document.status ===
                status
            )
          );
        }
      );
    }, [
      documents,
      search,
      status,
    ]);

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-05 · DOCUMENTS
              </span>

              <h1>
                Operations Documents
              </h1>

              <p>
                Review and validate documents
                associated with operational work.
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
              label="Documents"
              value={
                documents.length
              }
            />

            <Stat
              label="Under Review"
              value={
                documents.filter(
                  (document) =>
                    document.status ===
                    "Under Review"
                ).length
              }
            />

            <Stat
              label="Pending Review"
              value={
                documents.filter(
                  (document) =>
                    document.status ===
                    "Pending Review"
                ).length
              }
            />

            <Stat
              label="Validated"
              value={
                documents.filter(
                  (document) =>
                    document.status ===
                    "Validated"
                ).length
              }
            />

            <Stat
              label="Claims"
              value={
                new Set(
                  documents.map(
                    (document) =>
                      document.claim
                  )
                ).size
              }
            />

          </div>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  DOCUMENT REVIEW
                </span>

                <h2>
                  Operational Documents
                </h2>
              </div>

              <strong>
                {filteredDocuments.length} documents
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
                  placeholder="Search document, claim, customer..."
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

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Pending Review">
                  Pending Review
                </option>

                <option value="Validated">
                  Validated
                </option>

              </select>

            </div>


            <div className="workqueue-table-wrapper">

              <table className="workqueue-table">

                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Claim</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Uploaded</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredDocuments.map(
                    (document) => (
                      <tr
                        key={
                          document.id
                        }
                      >

                        <td>
                          <strong>
                            {document.name}
                          </strong>

                          <small>
                            {document.id}
                          </small>
                        </td>

                        <td>
                          {document.claim}
                        </td>

                        <td>
                          {document.customer}
                        </td>

                        <td>
                          {document.type}
                        </td>

                        <td>
                          <span className="workqueue-status">
                            {document.status}
                          </span>
                        </td>

                        <td>
                          {document.uploaded}
                        </td>

                        <td>
                          <button className="workqueue-open-button">
                            Review
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

export default OperationsDocuments;

