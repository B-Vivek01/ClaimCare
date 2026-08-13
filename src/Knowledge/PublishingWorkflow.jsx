import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialContent = [
  {
    id: "CNT-001",
    title: "How to Submit a Claim",
    author: "Content Editor",
    status: "Published",
    updated: "13 Aug 2026",
  },
  {
    id: "CNT-002",
    title: "Medical Claim Documents",
    author: "Content Editor",
    status: "Review",
    updated: "12 Aug 2026",
  },
  {
    id: "CNT-003",
    title: "Claim Closure Guide",
    author: "Admin User",
    status: "Draft",
    updated: "11 Aug 2026",
  },
];

const workflow = [
  "Draft",
  "Review",
  "Approved",
  "Published",
];

function PublishingWorkflow() {
  const [content, setContent] =
    useState(initialContent);

  const moveNext = (id) => {
    setContent((previous) =>
      previous.map((item) => {

        if (item.id !== id) {
          return item;
        }

        const currentIndex =
          workflow.indexOf(
            item.status
          );

        if (
          currentIndex === -1 ||
          currentIndex >=
            workflow.length - 1
        ) {
          return item;
        }

        return {
          ...item,
          status:
            workflow[
              currentIndex + 1
            ],
        };
      })
    );
  };

  const unpublish = (id) => {
    setContent((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Draft",
            }
          : item
      )
    );
  };

  return (
    <>
      <Navbar />

      <main className="knowledge-page">
        <div className="knowledge-container">

          <KnowledgeHeader
            code="KB-09"
            title="Publishing Workflow"
            description="Manage content through draft, review, approval and publishing stages."
          />


          <section className="knowledge-workflow-card">

            <div className="knowledge-workflow">

              {workflow.map(
                (step, index) => (
                  <div
                    key={step}
                    className="knowledge-workflow-step"
                  >

                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <strong>
                      {step}
                    </strong>

                    {index <
                      workflow.length -
                        1 && (
                      <b>
                        →
                      </b>
                    )}

                  </div>
                )
              )}

            </div>

          </section>


          <section className="knowledge-card">

            <div className="knowledge-card-header">

              <div>
                <span>
                  CONTENT WORKFLOW
                </span>

                <h2>
                  Publishing Queue
                </h2>
              </div>

            </div>


            <div className="knowledge-publishing-list">

              {content.map((item) => (

                <article
                  key={item.id}
                  className="knowledge-publishing-item"
                >

                  <div>

                    <span>
                      {item.id}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      Author: {item.author}
                    </p>

                    <small>
                      Updated: {item.updated}
                    </small>

                  </div>


                  <span
                    className={`knowledge-workflow-status ${item.status
                      .toLowerCase()
                      .replace(
                        " ",
                        "-"
                      )}`}
                  >
                    {item.status}
                  </span>


                  <div className="knowledge-publishing-actions">

                    {item.status !==
                      "Published" && (
                      <button
                        onClick={() =>
                          moveNext(
                            item.id
                          )
                        }
                      >
                        {item.status ===
                        "Draft"
                          ? "Send for Review"
                          : item.status ===
                            "Review"
                          ? "Approve"
                          : "Publish"}
                      </button>
                    )}


                    {item.status ===
                      "Published" && (
                      <button
                        onClick={() =>
                          unpublish(
                            item.id
                          )
                        }
                      >
                        Unpublish
                      </button>
                    )}

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

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

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

export default PublishingWorkflow;