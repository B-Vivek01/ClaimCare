import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialTags = [
  {
    name: "claims",
    count: 34,
  },
  {
    name: "documents",
    count: 27,
  },
  {
    name: "submission",
    count: 19,
  },
  {
    name: "tracking",
    count: 16,
  },
  {
    name: "account",
    count: 14,
  },
  {
    name: "operations",
    count: 12,
  },
  {
    name: "profile",
    count: 9,
  },
  {
    name: "closure",
    count: 8,
  },
];

function KnowledgeTags() {
  const [search, setSearch] =
    useState("");

  const filtered = initialTags.filter(
    (tag) =>
      tag.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-07"
            title="Knowledge Tags"
            description="Filter and search knowledge content using tags."
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
                  placeholder="Search tags..."
                />
              </div>

            </div>


            <div className="knowledge-tag-grid">

              {filtered.map((tag) => (
                <button
                  key={tag.name}
                  className="knowledge-tag-card"
                >

                  <span>
                    #{tag.name}
                  </span>

                  <strong>
                    {tag.count}
                  </strong>

                  <small>
                    items
                  </small>

                </button>
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

export default KnowledgeTags;