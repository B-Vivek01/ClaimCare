import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Services() {
  const services = [
    {
      number: "01",
      title: "Claim Guidance",
      description:
        "Get guidance throughout the claim journey and understand the information, activities and next steps associated with your claim.",
      features: [
        "Claim information",
        "Next-step visibility",
        "Claim progress"
      ]
    },
    {
      number: "02",
      title: "Document Support",
      description:
        "Upload, organize and manage documents associated with your claim in one centralized place.",
      features: [
        "Document upload",
        "Document organization",
        "Document status"
      ]
    },
    {
      number: "03",
      title: "Claim Coordination",
      description:
        "Keep claim-related activities and tasks organized so users can follow what needs to happen next.",
      features: [
        "Tasks",
        "Activities",
        "Milestones"
      ]
    },
    {
      number: "04",
      title: "Communication",
      description:
        "Stay connected through claim-related messages and notifications.",
      features: [
        "Claim messages",
        "Notifications",
        "Communication history"
      ]
    },
    {
      number: "05",
      title: "Progress Visibility",
      description:
        "View claim status, timeline, milestones and expected next steps where the information is available.",
      features: [
        "Current status",
        "Activity timeline",
        "Expected next step"
      ]
    }
  ];

  const journeySteps = [
    {
      number: "01",
      title: "Start",
      description:
        "Create your account and begin your ClaimCare journey."
    },
    {
      number: "02",
      title: "Create",
      description:
        "Provide the information required to create your claim."
    },
    {
      number: "03",
      title: "Submit",
      description:
        "Upload and manage the documents associated with the claim."
    },
    {
      number: "04",
      title: "Track",
      description:
        "Follow progress, activities, requests and outstanding actions."
    }
  ];

  return (
    <>
      <Navbar />

      <main className="services-page">

        {/* HERO */}
        <section className="services-hero">

          <div className="services-hero-content">

            <span className="services-badge">
              CLAIMCARE SERVICES
            </span>

            <h1>
              Support throughout
              your claim journey.
            </h1>

            <p>
              ClaimCare brings guidance, documentation,
              coordination, communication and claim-progress
              visibility together in one platform.
            </p>

            <div className="services-hero-actions">

              <Link
                to="/register"
                className="primary-btn"
              >
                Get Started
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

        {/* SERVICES */}
        <section className="services-overview">

          <div className="services-section-header">

            <span>Our Services</span>

            <h2>
              Claim assistance in one place
            </h2>

            <p>
              ClaimCare provides a set of capabilities designed
              to help users manage and follow their claim-related
              activities.
            </p>

          </div>

          <div className="services-list">

            {services.map((service) => (
              <article
                className="service-detail-card"
                key={service.number}
              >

                <div className="service-detail-number">
                  {service.number}
                </div>

                <div className="service-detail-content">

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                  <ul>
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <span>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* SUPPORT MODEL */}
        <section className="support-model">

          <div className="support-model-grid">

            <div className="support-model-heading">

              <span>
                How We Support You
              </span>

              <h2>
                Keep important claim information
                organized and visible.
              </h2>

            </div>

            <div className="support-model-text">

              <p>
                ClaimCare provides a centralized experience
                for claim-related information, documents,
                activities, communication and progress.
              </p>

              <p>
                Depending on the information available,
                users can view the current claim state,
                previous activities, milestones,
                outstanding actions and expected next steps.
              </p>

            </div>

          </div>

        </section>

        {/* JOURNEY */}
        <section className="service-journey">

          <div className="services-section-header">

            <span>
              Claim Journey
            </span>

            <h2>
              From getting started to tracking progress
            </h2>

          </div>

          <div className="service-journey-grid">

            {journeySteps.map((step) => (
              <div
                className="service-journey-card"
                key={step.number}
              >

                <div className="service-journey-number">
                  {step.number}
                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* POSITIONING NOTICE */}
        <section className="services-notice">

          <div className="services-notice-content">

            <h2>
              Claim assistance, not insurer decision-making.
            </h2>

            <p>
              ClaimCare supports users with guidance,
              documentation, coordination, communication
              and progress visibility. It does not issue
              insurance policies or make legally binding
              claim decisions.
            </p>

          </div>

        </section>

        {/* CTA */}
        <section className="services-cta">

          <div className="services-cta-content">

            <h2>
              Need help with your claim journey?
            </h2>

            <p>
              Create a ClaimCare account or contact us
              to learn more about the platform.
            </p>

            <div className="services-cta-actions">

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

export default Services;