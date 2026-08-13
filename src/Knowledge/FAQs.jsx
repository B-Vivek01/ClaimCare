import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqData = [
  {
    question: "How do I create a claim?",
    answer:
      "Open the Claims section and select Start New Claim. Complete the guided steps and submit the claim after reviewing the information.",
  },
  {
    question: "How can I upload documents?",
    answer:
      "Open the document section of the relevant claim and upload the required files using the upload control.",
  },
  {
    question: "How can I track my claim?",
    answer:
      "Open your Claims dashboard and select the claim to view its current status, progress and timeline.",
  },
  {
    question: "What happens after submitting a claim?",
    answer:
      "The claim enters the operational workflow where authorized users review, assign and process the case.",
  },
];

function FAQs() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);

  const filtered = faqData.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-02"
            title="Frequently Asked Questions"
            description="Search frequently asked questions and expand answers."
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
                  placeholder="Search FAQs..."
                />
              </div>

            </div>


            <div className="faq-list">

              {filtered.map((faq, index) => (
                <div
                  key={faq.question}
                  className="faq-item"
                >

                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpen(
                        open === index
                          ? null
                          : index
                      )
                    }
                  >
                    <span>
                      {faq.question}
                    </span>

                    <strong>
                      {open === index
                        ? "−"
                        : "+"}
                    </strong>
                  </button>


                  {open === index && (
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  )}

                </div>
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

export default FAQs;