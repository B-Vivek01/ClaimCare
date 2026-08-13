import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FAQ() {

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Claims",
      question: "What is ClaimCare?",
      answer:
        "ClaimCare is a cloud-based insurance claims assistance platform that provides guidance, documentation support, coordination, communication and claim-progress visibility."
    },
    {
      id: 2,
      category: "Claims",
      question: "Can I create a claim through ClaimCare?",
      answer:
        "Yes. Eligible customers can use the claim creation workflow to provide claim and incident information, save drafts, review the information and submit the claim."
    },
    {
      id: 3,
      category: "Claims",
      question: "Can I track my claim?",
      answer:
        "The customer portal provides claim status, progress, activities, milestones, tasks and expected next steps where the information is available."
    },
    {
      id: 4,
      category: "Documents",
      question: "Can I upload claim documents?",
      answer:
        "Yes. ClaimCare provides document upload capabilities including multiple-file upload, file validation, upload progress and document organization."
    },
    {
      id: 5,
      category: "Documents",
      question: "Can I view my uploaded documents?",
      answer:
        "Permitted documents can be accessed through the document library. Supported documents may also be previewed, downloaded and managed according to the available permissions."
    },
    {
      id: 6,
      category: "Documents",
      question: "Can I replace a document?",
      answer:
        "Where supported, a document can be replaced with a new version while retaining the document version history."
    },
    {
      id: 7,
      category: "Account",
      question: "How do I create a ClaimCare account?",
      answer:
        "You can start from the registration page, provide the required information, complete the applicable verification steps and continue to the welcome journey."
    },
    {
      id: 8,
      category: "Account",
      question: "Can I change my profile information?",
      answer:
        "Customers can view and update permitted personal and contact information from their profile."
    },
    {
      id: 9,
      category: "Account",
      question: "What happens if I forget my password?",
      answer:
        "You can use the password recovery flow to provide your recovery identifier, verify the required OTP and create a new password."
    },
    {
      id: 10,
      category: "Platform",
      question: "Will I receive claim notifications?",
      answer:
        "ClaimCare can provide supported notifications for claim updates, document requests and other relevant events based on the configured notification channels and preferences."
    },
    {
      id: 11,
      category: "Platform",
      question: "Can I communicate about my claim?",
      answer:
        "Claim-related communication can be accessed through the communication capabilities available to the customer."
    },
    {
      id: 12,
      category: "Platform",
      question: "Does ClaimCare make insurance claim decisions?",
      answer:
        "No. ClaimCare provides claim assistance, guidance, documentation, coordination, communication and progress visibility. It does not make legally binding claim decisions."
    }
  ];

  const categories = [
    "All",
    "Claims",
    "Documents",
    "Account",
    "Platform"
  ];

  const filteredFAQs = useMemo(() => {

    return faqs.filter((faq) => {

      const matchesCategory =
        activeCategory === "All" ||
        faq.category === activeCategory;

      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === "" ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

  }, [searchTerm, activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setOpenFAQ(null);
  };

  const handleFAQToggle = (id) => {
    setOpenFAQ((current) =>
      current === id ? null : id
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setOpenFAQ(null);
  };

  return (
    <>
      <Navbar />

      <main className="faq-page">

        {/* HERO */}

        <section className="faq-hero">

          <div className="faq-hero-content">

            <span className="faq-badge">
              HELP & FAQ
            </span>

            <h1>
              Frequently asked questions
            </h1>

            <p>
              Find answers about ClaimCare, claims,
              documents, accounts and the platform.
            </p>

            {/* SEARCH */}

            <div className="faq-search">

              <span className="faq-search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                aria-label="Search frequently asked questions"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="faq-clear-button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

          </div>

        </section>


        {/* FAQ CONTENT */}

        <section className="faq-content">

          {/* CATEGORY FILTER */}

          <div className="faq-categories">

            {categories.map((category) => (

              <button
                type="button"
                key={category}
                className={
                  activeCategory === category
                    ? "faq-category active"
                    : "faq-category"
                }
                onClick={() =>
                  handleCategoryChange(category)
                }
              >
                {category}
              </button>

            ))}

          </div>


          {/* RESULT COUNT */}

          <div className="faq-result-info">

            <span>
              {filteredFAQs.length}{" "}
              {filteredFAQs.length === 1
                ? "question"
                : "questions"}
            </span>

            {searchTerm && (
              <span>
                matching "{searchTerm}"
              </span>
            )}

          </div>


          {/* FAQ LIST */}

          {filteredFAQs.length > 0 ? (

            <div className="faq-list">

              {filteredFAQs.map((faq) => {

                const isOpen =
                  openFAQ === faq.id;

                return (
                  <div
                    className={
                      isOpen
                        ? "faq-item open"
                        : "faq-item"
                    }
                    key={faq.id}
                  >

                    <button
                      type="button"
                      className="faq-question"
                      onClick={() =>
                        handleFAQToggle(faq.id)
                      }
                      aria-expanded={isOpen}
                    >

                      <div className="faq-question-content">

                        <span className="faq-category-label">
                          {faq.category}
                        </span>

                        <span className="faq-question-text">
                          {faq.question}
                        </span>

                      </div>

                      <span className="faq-toggle">
                        {isOpen ? "−" : "+"}
                      </span>

                    </button>


                    {isOpen && (
                      <div className="faq-answer">

                        <p>
                          {faq.answer}
                        </p>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          ) : (

            /* EMPTY STATE */

            <div className="faq-empty">

              <div className="faq-empty-icon">
                ?
              </div>

              <h3>
                No questions found
              </h3>

              <p>
                We couldn't find an FAQ matching
                your search or selected category.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={clearSearch}
              >
                View All Questions
              </button>

            </div>

          )}

        </section>


        {/* CTA */}

        <section className="faq-cta">

          <div className="faq-cta-content">

            <h2>
              Still have questions?
            </h2>

            <p>
              If you couldn't find the information you need,
              contact the ClaimCare team.
            </p>

            <div className="faq-cta-actions">

              <Link
                to="/contact"
                className="primary-btn"
              >
                Contact Us
              </Link>

              <Link
                to="/register"
                className="secondary-btn"
              >
                Create Account
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default FAQ;