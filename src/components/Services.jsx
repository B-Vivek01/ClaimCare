function Services() {

  const services = [
    {
      title: "Claim Guidance",
      description:
        "Get guidance and visibility throughout your claim journey."
    },
    {
      title: "Document Support",
      description:
        "Upload, organize, review and manage documents related to your claim."
    },
    {
      title: "Claim Progress",
      description:
        "Track important claim milestones, activities and next steps."
    },
    {
      title: "Communication",
      description:
        "Stay connected through claim-related messages and notifications."
    }
  ];

  return (
    <section className="services">

      <div className="section-header">
        <span>What We Provide</span>

        <h2>
          Everything you need to manage your claim journey
        </h2>

        <p>
          ClaimCare brings claim assistance, documentation,
          communication and progress tracking into one place.
        </p>
      </div>

      <div className="services-grid">

        {services.map((service, index) => (
          <div className="service-card" key={index}>

            <div className="service-icon">
              {index + 1}
            </div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Services;