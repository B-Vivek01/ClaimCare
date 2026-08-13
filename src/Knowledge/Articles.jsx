import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const articles = [
  {
    id: "ART-001",
    title: "How to Submit a Claim",
    category: "Claims",
    tags: ["claim", "submission"],
    updated: "13 Aug 2026",
  },
  {
    id: "ART-002",
    title: "Required Documents for Medical Claims",
    category: "Documents",
    tags: ["medical", "documents"],
    updated: "12 Aug 2026",
  },
  {
    id: "ART-003",
    title: "Understanding Claim Status",
    category: "Claims",
    tags: ["status", "tracking"],
    updated: "10 Aug 2026",
  },
  {
    id: "ART-004",
    title: "How to Update Your Profile",
    category: "Account",
    tags: ["profile", "account"],
    updated: "08 Aug 2026",
  },
];

function Articles() {
  const [search, setSearch] = useState("");

  const filtered = articles.filter((article) =>
    `${article.title} ${article.category} ${article.tags.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-01"
            title="Articles"
            description="Browse and open guidance articles."
          />

          <section className="knowledge-card">

            <div className="knowledge-toolbar">

              <div className="knowledge-search">
                🔎

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search articles..."
                />
              </div>

            </div>


            <div className="knowledge-list">

              {filtered.map((article) => (
                <article
                  key={article.id}
                  className="knowledge-list-item"
                >
                  <div>
                    <span>
                      {article.id}
                    </span>

                    <h3>
                      {article.title}
                    </h3>

                    <p>
                      Category: {article.category}
                    </p>

                    <div className="knowledge-tags">
                      {article.tags.map((tag) => (
                        <span key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="knowledge-list-action">
                    <small>
                      Updated {article.updated}
                    </small>

                    <button>
                      Open Article
                    </button>
                  </div>
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

export default Articles;