'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Note {
  title: string;
  content: string;
  updated_at: string;
}

export default function SharedNoteContent({ note }: { note: Note }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-secondary/20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="flex items-center justify-between p-4 px-6 sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center shadow-lg shadow-secondary/10 group-hover:rotate-12 transition-transform">
               <span className="material-symbols-outlined text-white">ink_pen</span>
            </div>
            <h1 className="font-display-lg text-headline-sm text-primary tracking-tight">NotesSpace</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/10">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] text-on-surface-variant font-label-caps tracking-widest">LIVE VIEW</span>
          </div>
          <Link href="/auth" className="px-6 py-2.5 rounded-full font-label-caps text-xs tracking-widest bg-primary text-on-primary hover:bg-black transition-all shadow-lg shadow-primary/10">
            JOIN NOTESSPACE
          </Link>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-16 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />
            <div className="text-on-surface-variant/40 font-label-caps text-[10px] tracking-[0.3em] uppercase">
              LAST RESONANCE: {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />
          </div>

          <h1 className="w-full text-display-lg-mobile md:text-display-lg font-display-lg text-primary bg-transparent border-none outline-none mb-12 leading-tight tracking-tighter text-center">
            {note.title}
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full min-h-[500px] text-body-lg font-body-lg bg-surface-container-lowest/50 backdrop-blur-sm p-8 md:p-12 rounded-[48px] border border-outline-variant/10 shadow-inner leading-relaxed text-on-surface-variant whitespace-pre-wrap selection:bg-secondary/30"
          >
            {note.content || 'This thought is currently empty.'}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="p-16 text-center mt-12 bg-surface-container-lowest/30 backdrop-blur-sm border-t border-outline-variant/5">
        <div className="max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary/30">auto_awesome</span>
          </div>
          <p className="text-on-surface-variant font-body-md mb-8 leading-relaxed">
            NotesSpace is the intelligent sanctuary for your thoughts. 
            Capture, refine, and spark new ideas with the power of AI.
          </p>
          <Link 
            href="/auth" 
            className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all group"
          >
            START YOUR JOURNEY
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
