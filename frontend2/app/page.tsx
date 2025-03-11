import Hero from "./components/sections/Hero";
import VideoSection from "./components/sections/VideoSection";
import Features from "./components/sections/Features";
import Services from "./components/sections/Services";
import Testimonials from "./components/sections/Testimonials";
import Partners from "./components/sections/Partners";
import BlogSection from "./components/sections/BlogSection";
import Contact from "./components/sections/Contact";
import About from "./components/sections/About";

export default function Home() {
  return (
    <>
      <Hero />
      <VideoSection />
      <Features />
      <Services />
      <Testimonials />
      <About />
      <Partners />
      <BlogSection />
      <Contact />
    </>
  );
}
