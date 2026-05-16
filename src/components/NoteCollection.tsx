'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '@/types';
import { restoreNote, permanentlyDeleteNote, toggleFavorite } from '@/lib/actions/notes';
import { useRouter } from 'next/navigation';

interface NoteCollectionProps {
  notes: Note[];
  title: string;
  description: string;
  emptyMessage: string;
}

export default function NoteCollection({ notes, title, description, emptyMessage }: NoteCollectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const handleRestore = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setProcessingId(id);
    try {
      await restoreNote(id);
      router.refresh();
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this note? This cannot be undone.')) return;
    setProcessingId(id);
    try {
      await permanentlyDeleteNote(id);
      router.refresh();
    } finally {
      setProcessingId(null);
    }
  };

  const filteredNotes = searchQuery
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12"
    >
      {/* Search Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16"
      >
        <div className="flex-1 max-w-xl relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-secondary transition-colors">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in this collection..." 
            className="w-full bg-surface-container-low border border-outline-variant/10 rounded-full py-4 pl-14 pr-8 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-body-md"
          />
        </div>
      </motion.div>

      {/* Header Section */}
      <section className="mb-16">
        <motion.h2 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4 tracking-tighter"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl leading-relaxed opacity-70"
        >
          {description}
        </motion.p>
      </section>

      {/* Note Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note) => (
            <motion.div
              layout
              key={note.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link href={`/notes/${note.id}`} className="glass-card bg-surface-container-lowest p-8 rounded-[48px] flex flex-col justify-between h-72 hover:shadow-2xl hover:shadow-secondary/10 border border-outline-variant/10 hover:border-secondary/30 transition-all group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-secondary/5 text-secondary px-4 py-1 rounded-full font-label-caps text-[10px] tracking-[0.2em] uppercase border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
                      {note.tags?.[0] || 'Note'}
                    </span>
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await toggleFavorite(note.id, note.is_favorite);
                        router.refresh();
                      }}
                      className="hover:scale-110 transition-transform focus:outline-none"
                      title={note.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <span className={`material-symbols-outlined text-xl transition-colors ${note.is_favorite ? 'text-amber-400' : 'text-on-surface-variant/30 group-hover:text-secondary'}`} style={{fontVariationSettings: note.is_favorite ? "'FILL' 1" : ""}}>
                        {note.is_archived ? 'archive' : note.is_deleted ? 'delete' : 'star'}
                      </span>
                    </button>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-primary mb-3 line-clamp-2 leading-snug tracking-tight group-hover:text-secondary transition-colors duration-500">{note.title}</h4>
                  <p className="text-on-surface-variant line-clamp-3 text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">{note.content || 'Start capturing your thoughts...'}</p>
                  
                  {title === 'Trash' && (
                    <div className="flex gap-2 mt-4 relative z-20">
                      <button 
                        onClick={(e) => handleRestore(e, note.id)}
                        disabled={processingId === note.id}
                        className="flex-1 bg-secondary/10 hover:bg-secondary hover:text-white text-secondary text-[9px] font-label-caps tracking-widest py-2 rounded-xl transition-all disabled:opacity-50"
                      >
                        {processingId === note.id ? 'RESTORING...' : 'RESTORE'}
                      </button>
                      <button 
                        onClick={(e) => handlePermanentDelete(e, note.id)}
                        disabled={processingId === note.id}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">delete_forever</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative z-10 flex items-center justify-between mt-6 pt-6 border-t border-outline-variant/5">
                  <span className="text-on-surface-variant/40 font-label-caps text-[9px] tracking-widest uppercase">
                    {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <motion.span 
                    whileHover={{ x: 5 }}
                    className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"
                  >
                    arrow_forward
                  </motion.span>
                </div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full p-16 text-center border-2 border-dashed border-outline-variant/20 rounded-[48px] text-on-surface-variant bg-surface-container-low/30 backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="material-symbols-outlined text-4xl opacity-20">inventory_2</span>
            </div>
            <h4 className="font-headline-sm text-primary mb-2">No notes found</h4>
            <p className="text-sm opacity-60 max-w-xs mx-auto">{searchQuery ? 'Try a different search term or check your collection filters.' : emptyMessage}</p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
