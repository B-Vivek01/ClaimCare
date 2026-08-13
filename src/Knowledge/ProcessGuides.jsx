import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const guides = [
  {
    id: "GUIDE-001",
    title: "Claim Submission Process",
    steps: 6,
    category: "Claims",
  },
  {
    id: "GUIDE-002",
    title: "Document Review Process",
    steps: 5,
    category: "Documents",
  },
  {
    id: "GUIDE-003",
    title: "Claim Escalation Process",
    steps: 4,
    category: "Operations",
  },
  {
    id: "GUIDE-004",
    title: "Claim Closure Process",
    steps: 5,
    category: "Claims",
  },
];

function ProcessGuides() {
  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-04"
            title="Process Guides"
            description="Browse claim-process guidance and operational procedures."
          />

          <section className="knowledge-card">

            <div className="process-guide-list">

              {guides.map((guide) => (
                <article
                  key={guide.id}
                  className="process-guide"
                >

                  <div className="process-guide-number">
                    📖
                  </div>

                  <div className="process-guide-content">

                    <span>
                      {guide.id}
                    </span>

                    <h3>
                      {guide.title}
                    </h3>

                    <p>
                      Category: {guide.category}
                    </p>

                    <small>
                      {guide.steps} process steps
                    </small>

                  </div>

                  <button>
                    Open Guide
                  </button>

                </article>
              ))}

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

export default ProcessGuides;