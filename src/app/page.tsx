'use client';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="antialiased overflow-x-hidden min-h-screen flex flex-col bg-background text-on-surface selection:bg-secondary/30">
      {/* Top Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="bg-surface/80 backdrop-blur-xl docked full-width top-0 sticky border-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] z-50"
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">bubble_chart</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">NotesSpace</span>
          </div>
          <Link href="/auth" className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors duration-300 px-6 py-2 rounded-full border border-outline-variant/30 hover:border-secondary">
            Sign In
          </Link>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-margin-mobile pt-24 pb-section-gap max-w-container-max mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-16"
          >
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-8 tracking-tighter leading-none">
              The architecture of <br className="hidden md:block" /> 
              <span className="text-secondary italic">digital silence.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed mb-10">
              Collaborative AI Notes. A sanctuary for intentional living and collective intelligence. Strip away the noise and focus on what matters.
            </p>
            <Link href="/auth" className="inline-block bg-primary text-on-primary px-10 py-5 rounded-full font-label-caps tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/20">
              GET STARTED — IT&apos;S FREE
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative w-full aspect-[4/5] md:aspect-video rounded-[60px] overflow-hidden shadow-2xl group"
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoaYZTsWbDukR_-V2jC0d7u20THjZye-oPloAMfPdBPMWH2szqn45iXSs_WFTpBKFYZDmI3oTCkfEKLB2LEvJIhERkUzvW9IQI5XMiv1KiPmYFR0dXgqIrIR6pGQwN1z8zvUzfMvVK74gGOKHH0eqdAPSSS7eotSLQCptyVLUcmnfNK14AOWofzUKOAV96sCMbQNcYuSDgVlPjakjmbSX7Cct-uRsxNkWyuZmqGIR2pHmOAqMqvTUTQZ9fUjQXOAFLMk-ArB-POZA"
              alt="Minimalist desk setup"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60"></div>
          </motion.div>
        </section>

        {/* Feature Highlights (Animated Bento Grid) */}
        <section className="px-margin-mobile py-section-gap max-w-container-max mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-[40px] p-12 ambient-glow flex flex-col items-start gap-8 border border-on-surface/5 hover:border-secondary/20 transition-colors"
            >
              <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_filter</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-4 text-primary">Quiet Focus</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">A workspace stripped of distractions, where your thoughts take center stage in an environment of absolute digital calm.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-[40px] p-12 ambient-glow flex flex-col items-start gap-8 border border-on-surface/5 hover:border-secondary/20 transition-colors"
            >
              <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-4 text-primary">Ambient Logic</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Our AI doesn&apos;t interrupt; it assists. Intelligence that mirrors your intent, organizing chaos into collective wisdom.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-[40px] p-12 ambient-glow flex flex-col items-start gap-8 border border-on-surface/5 hover:border-secondary/20 transition-colors"
            >
              <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-4 text-primary">Ethical Tech</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Your data is yours alone. We build for humans, prioritizing privacy and the integrity of your personal sanctuary.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Philosophy Quote Section */}
        <section className="px-margin-mobile py-32 bg-surface-container-highest/30 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary rounded-full blur-[120px]"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto relative z-10"
          >
            <span className="font-label-caps text-label-caps text-secondary block mb-12 tracking-[0.3em]">PHILOSOPHY</span>
            <blockquote className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-headline-lg italic text-primary mb-12 leading-tight">
              &quot;Simplicity is the ultimate sophistication.&quot;
            </blockquote>
            <cite className="font-label-caps text-label-caps text-on-surface-variant not-italic opacity-60">— LEONARDO DA VINCI</cite>
          </motion.div>
        </section>

        {/* Call to Action Section */}
        <section className="px-margin-mobile py-section-gap max-w-container-max mx-auto mb-20">
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-[60px] overflow-hidden bg-primary-container p-16 md:p-24 text-white relative flex items-center justify-center group"
          >
            <div className="z-10 text-center relative">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-headline-lg mb-8 tracking-tighter"
              >
                Intentional Living.
              </motion.h2>
              <p className="font-body-md text-body-lg opacity-80 max-w-sm mx-auto mb-10 leading-relaxed">Crafted for those who value the space between the notes as much as the notes themselves.</p>
              <Link href="/auth" className="inline-block bg-white text-primary px-12 py-5 rounded-full font-label-caps tracking-widest hover:bg-secondary hover:text-white transition-colors shadow-xl">
                START WRITING
              </Link>
            </div>
            <div className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60 duration-1000">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkyjZjTSG7QwquYFKpWnCtnK7IrN2ZrlHHh9muaMlVPsVyPtD_k0sbuxxhH4c7dsLYaSC--ku50u2IDN5fequTOTW0q3ojZhjf_1j9TrFr2M2F5XoxPO-WtNU3v-OP9zIJmIFfeiVGZTOEnbzDqq-bnJ0CkKnV68X46X3wUCSbJ8fEhdHd_7HMs6sIrhaHFJ6hLGRIvFn-MPR9B4Ij41Jp8HoixbUlyyx5Hkh0AxbBpeqHYMR77D0LSH-gnASVbWVYIRDqApR3f3Y"
                alt="Abstract texture"
                fill
                className="object-cover grayscale"
              />
            </div>
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
          </motion.div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="bg-surface border-t border-outline-variant/10 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-12 md:space-y-0">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">bubble_chart</span>
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">NotesSpace</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant/60 text-center md:text-left max-w-xs">
              Designed for digital serenity. A sanctuary for your most intentional thoughts.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-10">
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-all" href="#">Philosophy</Link>
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-all" href="#">Terms</Link>
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-all" href="#">Privacy</Link>
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-all" href="#">Twitter</Link>
          </nav>
        </div>
        <div className="mt-20 text-center text-on-surface-variant/30 text-[10px] font-label-caps tracking-[0.2em]">
          © 2026 NOTESSPACE CLOUD. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
