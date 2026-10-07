import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Footer from "../components/Footer";

import { useDocuments } from "./DocumentContext";

function DocumentDashboard() {
  const navigate = useNavigate();

  const {
    documents,
  } = useDocuments();

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [sort, setSort] =
    useState("newest");

  const [folder, setFolder] =
    useState("All");

  const filteredDocuments =
    useMemo(() => {
      const result =
        documents.filter(
          (document) => {
            const searchable =
              `${document.name}
              ${document.category}
              ${document.folder}
              ${document.tags.join(" ")}`
                .toLowerCase();

            const matchesSearch =
              searchable.includes(
                search.toLowerCase()
              );

            const matchesCategory =
              category === "All" ||
              document.category ===
                category;

            const matchesStatus =
              status === "All" ||
              document.reviewStatus ===
                status;

            const matchesFolder =
              folder === "All" ||
              document.folder ===
                folder;

            return (
              matchesSearch &&
              matchesCategory &&
              matchesStatus &&
              matchesFolder
            );
          }
        );

      result.sort((a, b) => {
        if (sort === "name") {
          return a.name.localeCompare(
            b.name
          );
        }

        if (sort === "oldest") {
          return (
            new Date(a.uploadedDate) -
            new Date(b.uploadedDate)
          );
        }

        return (
          new Date(b.uploadedDate) -
          new Date(a.uploadedDate)
        );
      });

      return result;
    }, [
      documents,
      search,
      category,
      status,
      folder,
      sort,
    ]);

  return (
    <>

      <main className="document-page">

        <div className="document-container">

          <div className="document-header">

            <div>
              <span className="document-badge">
                DOCUMENT MANAGEMENT
              </span>

              <h1>
                Documents
              </h1>

              <p>
                Upload, organize, review and
                manage your documents.
              </p>
            </div>

            <button
              className="document-primary-button"
              onClick={() =>
                navigate(
                  "/documents/upload"
                )
              }
            >
              + Upload Documents
            </button>

          </div>


          <div className="document-stat-grid">

            <Stat
              label="Total Documents"
              value={
                documents.length
              }
            />

            <Stat
              label="Pending Review"
              value={
                documents.filter(
                  (item) =>
                    item.reviewStatus ===
                    "Pending"
                ).length
              }
            />

            <Stat
              label="Accepted"
              value={
                documents.filter(
                  (item) =>
                    item.reviewStatus ===
                    "Accepted"
                ).length
              }
            />

            <Stat
              label="Folders"
              value={
                new Set(
                  documents.map(
                    (item) =>
                      item.folder
                  )
                ).size
              }
            />

          </div>


          <section className="document-folder-card">

            <div className="document-card-title">

              <div>
                <span>
                  DOC-07
                </span>

                <h2>
                  Folders
                </h2>
              </div>

            </div>

            <div className="document-folder-grid">

              <button
                className={
                  folder === "All"
                    ? "document-folder selected"
                    : "document-folder"
                }
                onClick={() =>
                  setFolder("All")
                }
              >
                📁 All Documents
              </button>

              <button
                className={
                  folder === "Claims"
                    ? "document-folder selected"
                    : "document-folder"
                }
                onClick={() =>
                  setFolder("Claims")
                }
              >
                📁 Claims
              </button>

              <button
                className={
                  folder === "Policies"
                    ? "document-folder selected"
                    : "document-folder"
                }
                onClick={() =>
                  setFolder("Policies")
                }
              >
                📁 Policies
              </button>

              <button
                className={
                  folder === "General"
                    ? "document-folder selected"
                    : "document-folder"
                }
                onClick={() =>
                  setFolder("General")
                }
              >
                📁 General
              </button>

            </div>

          </section>


          <section className="document-list-card">

            <div className="document-toolbar">

              <div className="document-search">

                🔍

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search documents..."
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

                <option value="Medical">
                  Medical
                </option>

                <option value="Policy">
                  Policy
                </option>

                <option value="Identity">
                  Identity
                </option>

                <option value="Financial">
                  Financial
                </option>

                <option value="Other">
                  Other
                </option>
              </select>


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

                <option value="Pending">
                  Pending
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>


              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="name">
                  Name
                </option>
              </select>

            </div>


            {filteredDocuments.length ===
            0 ? (

              <div className="document-empty">

                <h3>
                  No documents found
                </h3>

                <p>
                  Upload a document or change
                  your search/filter.
                </p>

                <button
                  className="document-primary-button"
                  onClick={() =>
                    navigate(
                      "/documents/upload"
                    )
                  }
                >
                  Upload Document
                </button>

              </div>

            ) : (

              <div className="document-table-wrapper">

                <table className="document-table">

                  <thead>
                    <tr>
                      <th>
                        Document
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Folder
                      </th>

                      <th>
                        Version
                      </th>

                      <th>
                        Review
                      </th>

                      <th>
                        Scan
                      </th>

                      <th>
                        Uploaded
                      </th>

                      <th>
                        Action
                      </th>
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

                            <Link
                              to={`/documents/${document.id}`}
                              className="document-name"
                            >
                              📄{" "}
                              {
                                document.name
                              }
                            </Link>

                            <small>
                              {
                                document.sizeLabel
                              }
                            </small>

                          </td>

                          <td>
                            <span className="document-category">
                              {
                                document.category
                              }
                            </span>
                          </td>

                          <td>
                            {
                              document.folder
                            }
                          </td>

                          <td>
                            v
                            {
                              document.version
                            }
                          </td>

                          <td>
                            <Status
                              value={
                                document.reviewStatus
                              }
                            />
                          </td>

                          <td>
                            <Status
                              value={
                                document.scanStatus
                              }
                            />
                          </td>

                          <td>
                            {
                              document.uploadedDate
                            }
                          </td>

                          <td>

                            <Link
                              to={`/documents/${document.id}`}
                              className="document-view-link"
                            >
                              View
                            </Link>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          <section className="document-future-card">

            <div>

              <strong>
                Future Document Intelligence
              </strong>

              <p>
                OCR, duplicate detection,
                missing-document suggestions,
                classification and confidence
                scoring will be enabled in a
                future release.
              </p>

            </div>

            <div>
              <span>
                DOC-19
              </span>

              <span>
                DOC-20
              </span>

              <span>
                DOC-21
              </span>

              <span>
                DOC-22
              </span>

              <span>
                DOC-23
              </span>
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
    <div className="document-stat-card">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function Status({
  value,
}) {
  return (
    <span
      className={`document-status ${value
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      {value}
    </span>
  );
}

export default DocumentDashboard;