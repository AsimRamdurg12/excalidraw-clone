import Benefits from "../components/home/Benefits";
import CalltoAction from "../components/home/CalltoAction";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import UseCases from "../components/home/UseCases";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <UseCases />
      <Benefits />
      <CalltoAction />
      <Footer />
    </div>
  );
};

export default Home;
