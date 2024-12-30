import Link from "next/link";
import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Mint from "./Sections/Mint";
import EcoSystem from "./Sections/EcoSystem";
import RevenueSystem from "./Sections/RevenueSystem";
import TopStakers from "./Sections/TopStakers";
import Community from "./Sections/Community";
import Faqs from "./Sections/Faqs";
import Partners from "./Sections/Partners";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <About />
      <section id="nfts">
        <Mint />
      </section>
      <section id="ecosystem">
        <EcoSystem />
      </section>
      <RevenueSystem />
      <section id="topstakers">
        <TopStakers />
      </section>
      <Community />
      <Faqs />
      <section id="partners">
        <Partners />
      </section>
    </div>
  );
};
export default Home;
