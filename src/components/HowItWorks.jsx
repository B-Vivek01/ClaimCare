function HowItWorks() {

  const steps = [
    {
      number: "01",
      title: "Register",
      description:
        "Create your ClaimCare account and complete the initial setup."
    },
    {
      number: "02",
      title: "Create Your Claim",
      description:
        "Provide the required claim and incident information."
    },
    {
      number: "03",
      title: "Upload Documents",
      description:
        "Submit and organize the documents required for your claim."
    },
    {
      number: "04",
      title: "Track Progress",
      description:
        "Follow claim status, activities, requests and next steps."
    }
  ];

  return (
    <section className="how-it-works">

      <div className="section-header">

        <span>How It Works</span>

        <h2>
          A simple claim assistance journey
        </h2>

      </div>

      <div className="steps">

        {steps.map((step) => (
          <div className="step" key={step.number}>

            <div className="step-number">
              {step.number}
            </div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;