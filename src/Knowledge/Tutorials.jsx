import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tutorials = [
  {
    id: "TUT-001",
    title: "Creating Your First Claim",
    category: "Claims",
    duration: "8 min",
    level: "Beginner",
  },
  {
    id: "TUT-002",
    title: "Uploading Supporting Documents",
    category: "Documents",
    duration: "6 min",
    level: "Beginner",
  },
  {
    id: "TUT-003",
    title: "Tracking Claim Progress",
    category: "Claims",
    duration: "5 min",
    level: "Beginner",
  },
  {
    id: "TUT-004",
    title: "Understanding Operational Status",
    category: "Operations",
    duration: "10 min",
    level: "Intermediate",
  },
];

function Tutorials() {
  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-03"
            title="Tutorials"
            description="Browse step-by-step tutorial content."
          />

          <section className="knowledge-tutorial-grid">

            {tutorials.map((tutorial) => (
              <article
                key={tutorial.id}
                className="tutorial-card"
              >

                <div className="tutorial-icon">
                  🎓
                </div>

                <span>
                  {tutorial.id}
                </span>

                <h3>
                  {tutorial.title}
                </h3>

                <p>
                  Learn how to complete this workflow
                  step by step.
                </p>

                <div className="tutorial-meta">
                  <span>
                    {tutorial.category}
                  </span>

                  <span>
                    {tutorial.duration}
                  </span>

                  <span>
                    {tutorial.level}
                  </span>
                </div>

                <button>
                  Open Tutorial
                </button>

              </article>
            ))}

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

export default Tutorials;