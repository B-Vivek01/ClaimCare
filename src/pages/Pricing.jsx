import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Pricing() {

  /*
   * Pricing values are intentionally kept configurable.
   *
   * The ClaimCare frontend specification does not define
   * actual pricing plans or amounts.
   *
   * Replace this data with the approved pricing configuration
   * or backend response when available.
   */

  const pricingPlans = [
    {
      id: "plan-1",
      name: "Service Plan",
      description:
        "Pricing and included services will be displayed based on the configured ClaimCare offering.",
      price: "Contact Us",
      billing: "",
      features: [
        "Claim assistance information",
        "Service details",
        "ClaimCare support information"
      ],
      action: "Contact Us",
      actionRoute: "/contact"
    }
  ];

  return (
    <>
      <Navbar />

      <main className="pricing-page">

        {/* HERO */}

        <section className="pricing-hero">

          <div className="pricing-hero-content">

            <span className="pricing-badge">
              CLAIMCARE PRICING
            </span>

            <h1>
              Understand the service
              before you get started.
            </h1>

            <p>
              Review the available ClaimCare service
              information and understand what is included
              before proceeding.
            </p>

          </div>

        </section>


        {/* PRICING PLANS */}

        <section className="pricing-section">

          <div className="pricing-section-header">

            <span>
              Available Services
            </span>

            <h2>
              ClaimCare service options
            </h2>

            <p>
              Pricing information is presented according
              to the currently configured ClaimCare offering.
            </p>

          </div>


          <div className="pricing-grid">

            {pricingPlans.map((plan) => (

              <div
                className="pricing-card"
                key={plan.id}
              >

                <div className="pricing-card-header">

                  <h3>
                    {plan.name}
                  </h3>

                  <p>
                    {plan.description}
                  </p>

                </div>


                <div className="pricing-amount">

                  <span className="pricing-value">
                    {plan.price}
                  </span>

                  {plan.billing && (
                    <span className="pricing-billing">
                      {plan.billing}
                    </span>
                  )}

                </div>


                <div className="pricing-divider" />


                <div className="pricing-features">

                  <h4>
                    Service Information
                  </h4>

                  <ul>

                    {plan.features.map((feature) => (

                      <li key={feature}>

                        <span className="pricing-check">
                          ✓
                        </span>

                        {feature}

                      </li>

                    ))}

                  </ul>

                </div>


                <Link
                  to={plan.actionRoute}
                  className="pricing-action"
                >
                  {plan.action}
                </Link>

              </div>

            ))}

          </div>

        </section>


        {/* SERVICE COMMITMENT */}

        <section className="pricing-commitment">

          <div className="pricing-commitment-grid">

            <div className="pricing-commitment-heading">

              <span>
                Service Commitment
              </span>

              <h2>
                Know what ClaimCare
                helps you manage.
              </h2>

            </div>


            <div className="pricing-commitment-content">

              <div className="commitment-item">

                <h3>
                  Claim Guidance
                </h3>

                <p>
                  ClaimCare provides guidance and visibility
                  throughout the claim journey.
                </p>

              </div>


              <div className="commitment-item">

                <h3>
                  Document Support
                </h3>

                <p>
                  Claim-related documents can be uploaded,
                  organized and managed through the platform.
                </p>

              </div>


              <div className="commitment-item">

                <h3>
                  Progress Visibility
                </h3>

                <p>
                  Users can follow claim status, activities,
                  milestones and available next steps.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* IMPORTANT INFORMATION */}

        <section className="pricing-information">

          <div className="pricing-information-content">

            <div className="information-icon">
              i
            </div>

            <div>

              <h3>
                Pricing information
              </h3>

              <p>
                Final pricing, service availability and
                applicable billing information should be
                presented according to the configured
                ClaimCare offering.
              </p>

            </div>

          </div>

        </section>


        {/* CTA */}

        <section className="pricing-cta">

          <div className="pricing-cta-content">

            <h2>
              Have questions about our services?
            </h2>

            <p>
              Contact ClaimCare to learn more about the
              available service offering.
            </p>

            <div className="pricing-cta-actions">

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

export default Pricing;