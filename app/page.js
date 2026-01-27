import Navbar from '@/components/common/Navbar'
import Hero from '@/components/home/Hero'
import About from '@/components/about/About'
import Skills from '@/components/skills/Skills'
import Service from '@/components/services/Service'
import Projects from '@/components/projects/Proects'
import Certifications from '@/components/certifications/Certifications'
import Contact from '@/components/contact/Contact' // কন্টাক্ট ইম্পোর্ট করো 
import Footer from '@/components/footer/Footer'



// export const metadata = {
//   title: 'Kawsar | Cyber Security Analyst',
//   description: 'Portfolio of MD. KAWSAR HOSSAIN - Penetration Tester',
//   icons: {
//     icon: '/favicon.ico', 
//   },
// }

export default function Home() {
  // প্রতিটি সেকশনের জন্য কমন ডিভাইডার স্টাইল
  const divider = (
    <div className="w-full flex justify-center opacity-40">
      <div className="w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00f6ff]/30 to-transparent"></div>
    </div>
  );

  return (
    <main className="bg-[#0b0f14] min-h-screen relative overflow-x-hidden">
      <Navbar />

      {/* ১. Hero Section */}
      <section id="home">
        <Hero />
      </section>
      {divider}

      {/* ২. About Section */}
      <section id="about" className="relative py-10">
        <About />
      </section>
      {divider}

      {/* ৩. Service Section */}
      <section id="services" className="relative py-10">
        <Service />
      </section>
      {divider}

      {/* ৪. Skills Section */}
      <section id="skills" className="relative py-10">
        <Skills />
      </section>
      {divider}

      {/* ৫. Projects Section */}
      <section id="projects" className="relative py-10">
        <Projects />
      </section>
      {divider}

      {/* ৬. Certifications Section */}
      <section id="certifications" className="relative py-10">
        <Certifications />
      </section>
      {divider}

      {/* ৭. Contact Section - একদম শেষে */}
      <section id="contact" className="relative py-10">
        <Contact />
      </section>
      <section id="footer" className="relative py-10">
        <Footer />
      </section>

      {/* গ্লোবাল ব্যাকগ্রাউন্ড আম্বিয়েন্স */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-[#00f6ff]/[0.02] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] bg-[#00ff88]/[0.02] blur-[120px] rounded-full"></div>
      </div>
    </main>
  )
}