import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const content = [
  {
    type: "Article",
    title: "How to Submit a Claim",
    category: "Claims",
    description:
      "Learn the steps required to create and submit a claim.",
  },
  {
    type: "FAQ",
    title: "How can I track my claim?",
    category: "Claims",
    description:
      "Learn how to view claim status and progress.",
  },
  {
    type: "Tutorial",
    title: "Uploading Supporting Documents",
    category: "Documents",
    description:
      "Step-by-step document upload guidance.",
  },
  {
    type: "Process Guide",
    title: "Claim Closure Process",
    category: "Claims",
    description:
      "Understand the claim closure workflow.",
  },
];

function KnowledgeSearch() {
  const [query, setQuery] = useState("");

  const results =
    query.trim() === ""
      ? []
      : content.filter((item) =>
          `${item.title} ${item.category} ${item.description}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-05"
            title="Knowledge Search"
            description="Search knowledge content and open matching results."
          />

          <section className="knowledge-card">

            <div className="knowledge-large-search">
              🔎

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search articles, FAQs, tutorials..."
              />

            </div>


            {query.trim() !== "" && (
              <div className="knowledge-search-results">

                <div className="knowledge-result-count">
                  {results.length} result(s) found
                </div>

                {results.map((item) => (
                  <article
                    key={item.title}
                    className="knowledge-search-result"
                  >

                    <span>
                      {item.type}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                    <small>
                      Category: {item.category}
                    </small>

                    <button>
                      Open
                    </button>

                  </article>
                ))}

                {results.length === 0 && (
                  <div className="knowledge-empty">
                    <strong>
                      No results found
                    </strong>

                    <p>
                      Try a different search term.
                    </p>
                  </div>
                )}

              </div>
            )}

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

export default KnowledgeSearch;