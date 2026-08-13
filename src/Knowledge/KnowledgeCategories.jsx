import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  {
    name: "Claims",
    count: 34,
    icon: "📋",
  },
  {
    name: "Documents",
    count: 21,
    icon: "📄",
  },
  {
    name: "Account",
    count: 15,
    icon: "👤",
  },
  {
    name: "Operations",
    count: 18,
    icon: "⚙️",
  },
  {
    name: "Policies",
    count: 12,
    icon: "🛡️",
  },
];

function KnowledgeCategories() {
  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-06"
            title="Knowledge Categories"
            description="Browse and filter knowledge content by category."
          />

          <section className="knowledge-category-grid">

            {categories.map((category) => (
              <article
                key={category.name}
                className="knowledge-category-card"
              >

                <div className="knowledge-category-icon">
                  {category.icon}
                </div>

                <h3>
                  {category.name}
                </h3>

                <strong>
                  {category.count}
                </strong>

                <p>
                  Knowledge items
                </p>

                <button>
                  Browse Category
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

export default KnowledgeCategories;