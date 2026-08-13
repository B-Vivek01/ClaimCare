import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const capabilities = [
    {
      number: "01",
      title: "Claim Guidance",
      description:
        "ClaimCare helps users navigate their claim journey and understand the information and actions associated with their claim."
    },
    {
      number: "02",
      title: "Documentation",
      description:
        "Users can upload, organize and manage documents associated with their claims."
    },
    {
      number: "03",
      title: "Coordination",
      description:
        "ClaimCare provides a central place for claim-related activities and coordination."
    },
    {
      number: "04",
      title: "Communication",
      description:
        "Claim-related communication and notifications help users stay informed."
    },
    {
      number: "05",
      title: "Progress Visibility",
      description:
        "Users can view claim status, milestones, activities and expected next steps."
    }
  ];

  const journey = [
    {
      number: "01",
      title: "Registration",
      description:
        "Create your ClaimCare account and complete the initial setup."
    },
    {
      number: "02",
      title: "Claim Creation",
      description:
        "Provide the information required to begin your claim journey."
    },
    {
      number: "03",
      title: "Document Submission",
      description:
        "Upload and manage the documents associated with your claim."
    },
    {
      number: "04",
      title: "Progress Tracking",
      description:
        "Follow claim progress, activities, requests and next steps."
    },
    {
      number: "05",
      title: "Outcome & Feedback",
      description:
        "Review the claim outcome and provide feedback when requested."
    }
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* HERO */}
        <section className="about-hero">

          <div className="about-hero-content">

            <span className="about-badge">
              ABOUT CLAIMCARE
            </span>

            <h1>
              Helping users navigate
              their claim journey.
            </h1>

            <p>
              ClaimCare is a cloud-based insurance claims
              assistance platform designed to provide guidance,
              documentation support, coordination, communication
              and claim-progress visibility.
            </p>

          </div>

        </section>

        {/* WHAT IS CLAIMCARE */}
        <section className="about-introduction">

          <div className="about-intro-grid">

            <div className="about-section-label">
              <span>What is ClaimCare?</span>
            </div>

            <div className="about-intro-content">

              <h2>
                A centralized platform for the claim journey.
              </h2>

              <p>
                ClaimCare brings important claim-related
                activities into one platform so users can
                manage information, documents, communication
                and progress in a more organized way.
              </p>

              <p>
                The platform provides visibility into claim
                status, activities, milestones, outstanding
                actions and expected next steps where available.
              </p>

            </div>

          </div>

        </section>

        {/* CAPABILITIES */}
        <section className="about-capabilities">

          <div className="about-section-header">

            <span>What ClaimCare Helps With</span>

            <h2>
              Support across the claim journey
            </h2>

            <p>
              ClaimCare brings together the key capabilities
              needed to help users manage their claim-related
              activities.
            </p>

          </div>

          <div className="capabilities-grid">

            {capabilities.map((item) => (
              <div
                className="capability-card"
                key={item.number}
              >

                <div className="capability-number">
                  {item.number}
                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* POSITIONING */}
        <section className="about-positioning">

          <div className="positioning-content">

            <div>
              <span>Our Positioning</span>

              <h2>
                Claim assistance and visibility,
                not insurer decision-making.
              </h2>
            </div>

            <div className="positioning-text">

              <p>
                ClaimCare is designed to support users
                throughout the claims process through
                guidance, documentation, coordination,
                communication and progress visibility.
              </p>

              <div className="positioning-notice">

                <strong>
                  Important
                </strong>

                <p>
                  ClaimCare does not issue insurance policies
                  and does not make legally binding claim
                  decisions.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* JOURNEY */}
        <section className="about-journey">

          <div className="about-section-header">

            <span>The ClaimCare Journey</span>

            <h2>
              From registration to claim outcome
            </h2>

          </div>

          <div className="journey-list">

            {journey.map((item) => (
              <div
                className="journey-item"
                key={item.number}
              >

                <div className="journey-number">
                  {item.number}
                </div>

                <div className="journey-content">

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* CTA */}
        <section className="about-cta">

          <div>

            <h2>
              Ready to get started?
            </h2>

            <p>
              Create your ClaimCare account or contact us
              to learn more.
            </p>

            <div className="about-cta-actions">

              <Link
                to="/register"
                className="primary-btn"
              >
                Create Account
              </Link>

              <Link
                to="/contact"
                className="secondary-btn"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default About;