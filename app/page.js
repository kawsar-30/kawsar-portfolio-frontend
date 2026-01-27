import Navbar from '@/components/common/Navbar'
import Hero from '@/components/home/Hero'
import About from '@/components/about/About'
import Skills from '@/components/skills/Skills'
import Service from '@/components/services/Service'
import Projects from '@/components/projects/Proects'
import Certifications from '@/components/certifications/Certifications'
import Contact from '@/components/contact/Contact' 
import Footer from '@/components/footer/Footer'





export default function Home() {

  const divider = (
    <div className="w-full flex justify-center opacity-40">
      <div className="w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00f6ff]/30 to-transparent"></div>
    </div>
  );

  return (
    <main className="bg-[#0b0f14] min-h-screen relative overflow-x-hidden">
      <Navbar />

      {/*  Hero Section */}
      <section id="home">
        <Hero />
      </section>
      {divider}

      {/*  About Section */}
      <section id="about" className="relative py-10">
        <About />
      </section>
      {divider}

      {/*  Service Section */}
      <section id="services" className="relative py-10">
        <Service />
      </section>
      {divider}

      {/* Skills Section */}
      <section id="skills" className="relative py-10">
        <Skills />
      </section>
      {divider}

      {/* Projects Section */}
      <section id="projects" className="relative py-10">
        <Projects />
      </section>
      {divider}

      {/*  Certifications Section */}
      <section id="certifications" className="relative py-10">
        <Certifications />
      </section>
      {divider}

      {/* ৭. Contact Section  */}
      <section id="contact" className="relative py-10">
        <Contact />
      </section>
      <section id="footer" className="relative py-10">
        <Footer />
      </section>

      {/*  */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-[#00f6ff]/[0.02] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] bg-[#00ff88]/[0.02] blur-[120px] rounded-full"></div>
      </div>
    </main>
  )
}