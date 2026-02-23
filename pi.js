import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  ChevronRight, 
  Check, 
  Mail, 
  Phone, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Layers, 
  Zap, 
  ShieldCheck,
  Instagram,
  Linkedin,
  Twitter,
  User,
  Star
} from 'lucide-react';

// --- Constants & Styling ---
const ACCENT_COLOR = "#D4A574";
const BG_DARK = "#0A0A0A";
const BG_CARD = "#141414";

// --- Components ---

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width: Math.random() * 300 + 50,
            height: Math.random() * 300 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
    </div>
  );
};

const SectionHeading = ({ subtitle, title }) => (
  <div className="mb-16">
    <motion.span 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-xs uppercase tracking-[0.3em] font-semibold mb-3 block"
      style={{ color: ACCENT_COLOR }}
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
    >
      {title}
    </motion.h2>
  </div>
);

const PackageCard = ({ name, features, tier }) => {
  const isBestValue = tier === 'Gold';
  
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden group ${
        isBestValue ? 'border-[#D4A574] bg-[#1a1a1a]' : 'border-white/10 bg-[#141414]'
      }`}
    >
      {isBestValue && (
        <div 
          className="absolute top-0 right-0 px-4 py-1 text-[10px] uppercase font-bold tracking-widest"
          style={{ backgroundColor: ACCENT_COLOR, color: '#000' }}
        >
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-6 text-white">{name}</h3>
      
      <ul className="space-y-4 mb-10">
        {features.map((feature, idx) => (
          <motion.li 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-start gap-3 text-white/70 text-sm"
          >
            <Check size={18} style={{ color: ACCENT_COLOR }} className="mt-0.5 shrink-0" />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
      
      <button 
        className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn overflow-hidden relative"
        style={{ 
          backgroundColor: isBestValue ? ACCENT_COLOR : 'transparent',
          border: isBestValue ? 'none' : `1px solid ${ACCENT_COLOR}`,
          color: isBestValue ? '#000' : '#FFF'
        }}
      >
        <span className="relative z-10">Choose Plan</span>
        <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
        {!isBestValue && (
          <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        )}
      </button>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  
  // Custom cursor logic
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    setTimeout(() => setLoading(false), 2000);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          className="h-[1px] bg-[#D4A574] mb-4"
        />
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-light tracking-[0.5em] text-white uppercase"
        >
          UpsCall
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-[#D4A574]/30">
      <ParticleBackground />

      {/* Custom Cursor Glow */}
      <motion.div 
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[120px] opacity-20"
        animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
        style={{ backgroundColor: ACCENT_COLOR }}
      />

      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
        style={{ scaleX, backgroundColor: ACCENT_COLOR }}
      />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center transition-all duration-500 backdrop-blur-sm bg-black/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter"
        >
          UPS<span style={{ color: ACCENT_COLOR }}>CALL</span>
        </motion.div>
        
        <nav className="flex gap-10 items-center">
          {['home', 'packages', 'about', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => setCurrentPage(item)}
              className="group relative text-sm uppercase tracking-widest font-semibold overflow-hidden"
            >
              <span className={`block transition-transform duration-500 group-hover:-translate-y-full ${currentPage === item ? 'text-[#D4A574]' : 'text-white/60'}`}>
                {item}
              </span>
              <span className="absolute top-full left-0 block transition-transform duration-500 group-hover:-translate-y-full" style={{ color: ACCENT_COLOR }}>
                {item}
              </span>
              {currentPage === item && (
                <motion.div layoutId="nav-line" className="absolute -bottom-1 left-0 right-0 h-[2px]" style={{ backgroundColor: ACCENT_COLOR }} />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* PAGE 1: HOME */}
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero */}
              <section className="min-h-[70vh] flex flex-col justify-center items-start">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8">
                    ELEVATE YOUR <br />
                    <span className="text-transparent stroke-text" style={{ WebkitTextStroke: `1px ${ACCENT_COLOR}` }}>BRANDING</span>
                  </h1>
                  <p className="text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
                    Premium marketing solutions designed for results. We bridge the gap between creative vision and explosive growth.
                  </p>
                  <div className="flex gap-6">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage('contact')}
                      className="px-8 py-4 rounded-full font-bold flex items-center gap-2"
                      style={{ backgroundColor: ACCENT_COLOR, color: '#000' }}
                    >
                      Get Started <Zap size={18} />
                    </motion.button>
                    <button 
                      onClick={() => setCurrentPage('packages')}
                      className="px-8 py-4 rounded-full font-bold border border-white/20 hover:border-white transition-colors"
                    >
                      View Packages
                    </button>
                  </div>
                </motion.div>
              </section>

              {/* Stats / Numbers */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-12 py-32 border-y border-white/5">
                {[
                  { label: "Client Success", value: "98%" },
                  { label: "Active Brands", value: "150+" },
                  { label: "Ad Revenue", value: "$12M" },
                  { label: "Years Exp", value: "12" },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: ACCENT_COLOR }}>{stat.value}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40">{stat.label}</div>
                  </motion.div>
                ))}
              </section>

              {/* Services Highlight */}
              <section className="py-32">
                <SectionHeading subtitle="What we do" title="Strategic solutions for digital dominance" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: <Target />, title: "Lead Generation", desc: "Targeted campaigns that bring qualified customers to your doorstep." },
                    { icon: <TrendingUp />, title: "Growth Marketing", desc: "Data-driven strategies to scale your revenue exponentially." },
                    { icon: <Layers />, title: "Brand Identity", desc: "Visual storytelling that makes your brand unforgettable." },
                  ].map((service, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      viewport={{ once: true }}
                      className="p-10 bg-[#141414] border border-white/5 rounded-3xl hover:border-[#D4A574]/30 transition-all group"
                    >
                      <div className="mb-6 w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 group-hover:bg-[#D4A574] group-hover:text-black transition-all" style={{ color: ACCENT_COLOR }}>
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* PAGE 2: PACKAGES */}
          {currentPage === 'packages' && (
            <motion.div 
              key="packages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10"
            >
              <SectionHeading subtitle="Our Tiers" title="Choose the engine for your growth" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PackageCard 
                  tier="Silver"
                  name="Silver Starter" 
                  features={[
                    "Foundational Brand Audit",
                    "Social Media Setup",
                    "Monthly Content Calendar",
                    "Basic SEO Optimization",
                    "Email Support"
                  ]}
                />
                <PackageCard 
                  tier="Gold"
                  name="Gold Accelerator" 
                  features={[
                    "Advanced Market Strategy",
                    "Daily Content Management",
                    "PPC Ad Management",
                    "Conversion Rate Opt.",
                    "Priority 24/7 Support",
                    "Monthly Data Insights"
                  ]}
                />
                <PackageCard 
                  tier="Diamond"
                  name="Diamond Elite" 
                  features={[
                    "Full Suite Brand Dominance",
                    "Omnichannel Marketing",
                    "Influencer Partnerships",
                    "Custom Video Production",
                    "Dedicated Account Manager",
                    "Exclusive Industry Events"
                  ]}
                />
              </div>
            </motion.div>
          )}

          {/* PAGE 3: ABOUT */}
          {currentPage === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-10"
            >
              <SectionHeading subtitle="Who we are" title="A collective of creative rebels and data scientists" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-2xl font-light text-white/70 leading-relaxed mb-8">
                    UpsCall was founded on a simple principle: <span style={{ color: ACCENT_COLOR }}>results should be visible.</span> We don't believe in vanity metrics or empty promises. 
                  </p>
                  <p className="text-lg text-white/50 leading-relaxed">
                    Our team brings together a unique blend of high-level creative design and rigorous analytical tracking. We don't just make things look pretty; we build systems that generate revenue.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative aspect-square bg-[#141414] rounded-3xl overflow-hidden group border border-white/10"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A574]/20 to-transparent" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-1/2 h-1/2 border-2 border-[#D4A574]/30 rounded-full animate-ping" />
                     <ShieldCheck size={80} style={{ color: ACCENT_COLOR }} />
                   </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { title: "Transparency", val: "We share every win and every lesson. No hidden data, ever." },
                  { title: "Excellence", val: "Near-enough is never enough. We push for 100% every day." },
                  { title: "Speed", val: "The digital world moves fast. We ensure your brand stays ahead." },
                ].map((val, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-[1px] w-full bg-white/10 mb-6" />
                    <h4 className="text-xl font-bold mb-4" style={{ color: ACCENT_COLOR }}>{val.title}</h4>
                    <p className="text-white/40 leading-relaxed">{val.val}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PAGE 4: CONTACT */}
          {currentPage === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
                <div className="md:col-span-2">
                  <SectionHeading subtitle="Connect" title="Start your journey to the top" />
                  <div className="space-y-8 mt-10">
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[#D4A574] group-hover:text-black transition-all">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/40">Email Us</div>
                        <div className="text-lg font-bold">hello@upscall.agency</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[#D4A574] group-hover:text-black transition-all">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/40">Call Us</div>
                        <div className="text-lg font-bold">+1 (888) UPS-CALL</div>
                      </div>
                    </div>
                    <div className="pt-10 flex gap-4">
                      {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                        <button key={i} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                          <Icon size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div 
                  className="md:col-span-3 p-10 bg-[#141414] rounded-3xl border border-white/5"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Full Name</label>
                        <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[#D4A574] transition-all" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Email Address</label>
                        <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[#D4A574] transition-all" placeholder="john@company.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40">Service Interested In</label>
                      <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[#D4A574] transition-all appearance-none">
                        <option>Silver Package</option>
                        <option>Gold Package</option>
                        <option>Diamond Package</option>
                        <option>Custom Request</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40">Your Message</label>
                      <textarea rows={5} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[#D4A574] transition-all" placeholder="Tell us about your project..." />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 rounded-xl font-bold flex items-center justify-center gap-3 text-black overflow-hidden relative"
                      style={{ backgroundColor: ACCENT_COLOR }}
                    >
                      <span className="z-10">Submit Request</span>
                      <ChevronRight size={18} className="z-10" />
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="pt-20 pb-10 border-t border-white/5 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black tracking-tighter">
            UPS<span style={{ color: ACCENT_COLOR }}>CALL</span>
          </div>
          <div className="text-white/40 text-sm">
            © 2024 UPSCALL AGENCY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-xs uppercase tracking-widest font-bold">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Career</button>
          </div>
        </div>
      </footer>

      {/* Global CSS for Stroke Text Effect */}
      <style>{`
        .stroke-text {
          -webkit-text-fill-color: transparent;
        }
        ::selection {
          background: ${ACCENT_COLOR};
          color: black;
        }
      `}</style>
    </div>
  );
}