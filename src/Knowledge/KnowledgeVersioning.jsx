import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const versions = [
  {
    id: "VER-001",
    article: "How to Submit a Claim",
    version: "v3.0",
    author: "Admin User",
    status: "Published",
    date: "13 Aug 2026",
  },
  {
    id: "VER-002",
    article: "Required Documents for Medical Claims",
    version: "v2.1",
    author: "Content Editor",
    status: "Published",
    date: "12 Aug 2026",
  },
  {
    id: "VER-003",
    article: "Understanding Claim Status",
    version: "v1.4",
    author: "Content Editor",
    status: "Draft",
    date: "11 Aug 2026",
  },
];

function KnowledgeVersioning() {
  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-08"
            title="Content Versioning"
            description="Display and manage knowledge content versions."
          />

          <section className="knowledge-card">

            <div className="knowledge-card-header">

              <div>
                <span>
                  CONTENT HISTORY
                </span>

                <h2>
                  Version History
                </h2>
              </div>

            </div>


            <div className="knowledge-table-wrapper">

              <table className="knowledge-table">

                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Content</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {versions.map((version) => (
                    <tr key={version.id}>

                      <td>
                        <strong>
                          {version.version}
                        </strong>

                        <small>
                          {version.id}
                        </small>
                      </td>

                      <td>
                        {version.article}
                      </td>

                      <td>
                        {version.author}
                      </td>

                      <td>
                        <span
                          className={
                            version.status === "Published"
                              ? "knowledge-status published"
                              : "knowledge-status draft"
                          }
                        >
                          {version.status}
                        </span>
                      </td>

                      <td>
                        {version.date}
                      </td>

                      <td>
                        <button>
                          View
                        </button>

                        <button>
                          Compare
                        </button>
                      </td>

                    </tr>
                  ))}

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

function KnowledgeHeader({
  code,
  title,
  description,
}) {
  return (
    <div className="knowledge-header">
      <div>
        <span className="knowledge-badge">
          {code}
        </span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      <Link
        to="/knowledge"
        className="knowledge-secondary-button"
      >
        ← Knowledge Center
      </Link>
    </div>
  );
}

export default KnowledgeVersioning;