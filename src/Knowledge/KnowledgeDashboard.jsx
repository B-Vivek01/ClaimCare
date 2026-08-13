import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function KnowledgeDashboard() {
  const modules = [
    {
      code: "KB-01",
      icon: "📚",
      title: "Articles",
      description: "Browse and open guidance articles.",
      path: "/knowledge/articles",
    },
    {
      code: "KB-02",
      icon: "❓",
      title: "FAQs",
      description: "Search FAQs and expand answers.",
      path: "/knowledge/faqs",
    },
    {
      code: "KB-03",
      icon: "🎓",
      title: "Tutorials",
      description: "Browse step-by-step tutorial content.",
      path: "/knowledge/tutorials",
    },
    {
      code: "KB-04",
      icon: "📖",
      title: "Process Guides",
      description: "Browse claim-process guidance.",
      path: "/knowledge/process-guides",
    },
    {
      code: "KB-05",
      icon: "🔎",
      title: "Search",
      description: "Search knowledge content.",
      path: "/knowledge/search",
    },
    {
      code: "KB-06",
      icon: "🗂️",
      title: "Categories",
      description: "Browse content by category.",
      path: "/knowledge/categories",
    },
    {
      code: "KB-07",
      icon: "🏷️",
      title: "Tags",
      description: "Filter content using tags.",
      path: "/knowledge/tags",
    },
    {
      code: "KB-08",
      icon: "🕘",
      title: "Versioning",
      description: "Manage content versions.",
      path: "/knowledge/versioning",
    },
    {
      code: "KB-09",
      icon: "🚀",
      title: "Publishing Workflow",
      description: "Draft, review, approve and publish content.",
      path: "/knowledge/publishing",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <div className="knowledge-header">
            <div>
              <span className="knowledge-badge">
                KNOWLEDGE BASE
              </span>

              <h1>
                Knowledge Center
              </h1>

              <p>
                Browse guidance, FAQs, tutorials and
                process documentation.
              </p>
            </div>
          </div>


          <div className="knowledge-summary">

            <div className="knowledge-summary-card">
              <span>ARTICLES</span>
              <strong>84</strong>
              <small>Published articles</small>
            </div>

            <div className="knowledge-summary-card">
              <span>FAQs</span>
              <strong>46</strong>
              <small>Frequently asked questions</small>
            </div>

            <div className="knowledge-summary-card">
              <span>TUTORIALS</span>
              <strong>21</strong>
              <small>Available tutorials</small>
            </div>

            <div className="knowledge-summary-card">
              <span>DRAFTS</span>
              <strong>7</strong>
              <small>Awaiting workflow action</small>
            </div>

          </div>


          <section className="knowledge-section">

            <div className="knowledge-section-header">
              <div>
                <span>KNOWLEDGE MODULES</span>

                <h2>
                  Explore Knowledge Center
                </h2>
              </div>
            </div>


            <div className="knowledge-module-grid">

              {modules.map((module) => (
                <Link
                  key={module.code}
                  to={module.path}
                  className="knowledge-module-card"
                >
                  <div className="knowledge-module-icon">
                    {module.icon}
                  </div>

                  <div className="knowledge-module-content">
                    <span>{module.code}</span>

                    <h3>
                      {module.title}
                    </h3>

                    <p>
                      {module.description}
                    </p>
                  </div>

                  <strong>
                    →
                  </strong>
                </Link>
              ))}

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default KnowledgeDashboard;