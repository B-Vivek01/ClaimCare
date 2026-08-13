import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import WhyClaimCare from "../components/WhyClaimCare";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <WhyClaimCare />
        <CTA />
      </main>

      <Footer />
    </>
  );
}

export default Home;