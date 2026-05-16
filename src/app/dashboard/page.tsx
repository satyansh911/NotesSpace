'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { getNotes, createNote } from '@/lib/actions/notes';
import { getMe } from '@/lib/actions/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

import { Note } from '@/types';

function DashboardContent() {
  const [allNotes, setAllNotes] = useState<Note[]>([]); 
  const [user, setUser] = useState<{ id: string; email: string; ai_usage_count?: number } | null>(null);

  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();


  const query = searchParams.get('q')?.toLowerCase() || '';
  const selectedTag = searchParams.get('tag');

  useEffect(() => {
    async function loadDashboard() {
      try {
        console.log('Loading dashboard data...');
        const user = await getMe();
        console.log('User fetched:', user);
        if (!user) {
          router.push('/auth');
          return;
        }
        setUser(user);
        const notes = await getNotes();
        console.log('Notes fetched:', notes.length);
        setAllNotes(notes);
      } catch (error) {
        console.error('Dashboard loading error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  const filteredNotes = allNotes.filter(note => {
    const matchesQuery = !query || 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query);
    
    const matchesTag = !selectedTag || 
      (note.tags && note.tags.includes(selectedTag));
      
    return matchesQuery && matchesTag;
  });

  // Calculate top tags
  const allTags = allNotes.flatMap(n => n.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate stats for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dailyCounts = last7Days.map(day => {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return allNotes.filter(note => {
      const created = new Date(note.created_at);
      return created >= day && created < nextDay;
    }).length;
  });

  const maxCount = Math.max(...dailyCounts, 1);
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleCreateNote = async () => {
    const newNote = await createNote();
    router.push(`/notes/${newNote.id}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q) {
      router.push(`/dashboard?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full shadow-lg shadow-secondary/20"
        />
        <span className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant animate-pulse">INITIATING WORKSPACE...</span>
      </motion.div>
    </div>
  );

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12"
    >
      {/* Top Search Bar & User Profile */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16"
      >
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-secondary transition-colors">search</span>
          <input 
            name="q"
            defaultValue={query}
            placeholder="Search your thoughts..." 
            className="w-full bg-surface-container-low border border-outline-variant/10 rounded-full py-4 pl-14 pr-8 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-body-md"
          />
        </form>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-11 h-11 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-on-surface-variant"
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          {user && (
            <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/10 rounded-full px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-sm">person</span>
              </div>
              <span className="text-sm text-on-surface-variant font-medium hidden sm:inline">{user.email?.split('@')[0]}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="mb-16">
        <motion.h2 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4 tracking-tighter"
        >
          {query ? `Results for "${query}"` : selectedTag ? `Notes tagged with #${selectedTag}` : `Welcome back, ${user?.email?.split('@')[0]}.`}
        </motion.h2>
        <motion.p 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl leading-relaxed opacity-70"
        >
          {query 
            ? `Found ${filteredNotes.length} matching notes in your sanctuary.` 
            : selectedTag 
            ? `Exploring ${filteredNotes.length} notes under the "${selectedTag}" tag.`
            : `Your thoughts, curated and calm. You have ${allNotes.length} notes in your collective intelligence.`}
        </motion.p>
      </section>


      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        {/* Recent Notes Section */}
        <div className="md:col-span-8 space-y-10">
          <div className="flex items-end justify-between">
            <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
              {query ? 'Search Results' : selectedTag ? `Tagged: ${selectedTag}` : 'Recent Thoughts'}
            </h3>
            {!query && <button className="text-secondary font-label-caps text-label-caps hover:underline tracking-widest text-[11px]">VIEW ALL</button>}
          </div>
          
          <motion.div 
            layout
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredNotes.slice(0, 6).map((note) => (
                <motion.div
                  layout
                  key={note.id}
                  variants={{
                    initial: { opacity: 0, y: 30, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link href={`/notes/${note.id}`} className="glass-card bg-surface-container-lowest p-8 rounded-[48px] flex flex-col justify-between h-72 hover:shadow-2xl hover:shadow-secondary/10 border border-outline-variant/10 hover:border-secondary/30 transition-all group relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        {note.tags?.[0] ? (
                          <Link 
                            href={`/dashboard?tag=${encodeURIComponent(note.tags[0])}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-secondary/5 text-secondary px-4 py-1 rounded-full font-label-caps text-[10px] tracking-[0.2em] uppercase border border-secondary/10 hover:bg-secondary hover:text-white transition-colors duration-500 relative z-20"
                          >
                            {note.tags[0]}
                          </Link>
                        ) : (
                          <span className="bg-secondary/5 text-secondary px-4 py-1 rounded-full font-label-caps text-[10px] tracking-[0.2em] uppercase border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-colors duration-500">Note</span>
                        )}
                        <span className="material-symbols-outlined text-on-surface-variant/30 text-xl group-hover:text-secondary transition-colors" style={{fontVariationSettings: note.is_public ? "'FILL' 1" : ""}}>{note.is_public ? 'star' : 'push_pin'}</span>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-3 line-clamp-2 leading-snug tracking-tight group-hover:text-secondary transition-colors duration-500">{note.title}</h4>
                      <p className="text-on-surface-variant line-clamp-3 text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">{note.content || 'Start capturing your thoughts...'}</p>
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
                    {/* Subtle Gradient Glow */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredNotes.length === 0 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="col-span-1 sm:col-span-2 p-16 text-center border-2 border-dashed border-outline-variant/20 rounded-[48px] text-on-surface-variant bg-surface-container-low/30 backdrop-blur-sm"
               >
                  <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-4xl opacity-20">search_off</span>
                  </div>
                  <h4 className="font-headline-sm text-primary mb-2">No matching thoughts</h4>
                  <p className="text-sm opacity-60 max-w-xs mx-auto">{query || selectedTag ? 'Try a different search term or check your collection tags.' : 'Your sanctuary is empty. Start your journey by creating a new note.'}</p>
               </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Stats & Quick Actions Section */}
        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:col-span-4 space-y-gutter"
        >
          {/* Activity Stats */}
          <div className="glass-card bg-white p-10 rounded-[48px] shadow-xl shadow-primary/5 border border-outline-variant/5 relative overflow-hidden group">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-8 tracking-tight flex items-center gap-2">
              Activity
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            </h3>
            <div className="space-y-8">
              <div className="flex items-end justify-between h-36 px-2 gap-2">
                {dailyCounts.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((count / maxCount) * 100, 8)}%` }}
                      transition={{ duration: 1.5, delay: 0.3 + (i * 0.1), ease: [0.23, 1, 0.32, 1] }}
                      className={`w-full rounded-2xl transition-all duration-500 relative ${i === 6 ? 'bg-secondary shadow-lg shadow-secondary/20' : 'bg-secondary/10 group-hover/bar:bg-secondary/30'}`}
                      title={`${dayNames[last7Days[i].getDay()]}: ${count} notes`}
                    >
                      {count > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                          {count} {count === 1 ? 'note' : 'notes'}
                        </div>
                      )}
                    </motion.div>
                    <span className={`font-label-caps text-[9px] tracking-widest ${i === 6 ? 'text-secondary font-bold' : 'text-on-surface-variant/40'}`}>
                      {dayNames[last7Days[i].getDay()]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 pt-10 border-t border-outline-variant/10 space-y-5">
              <div className="flex justify-between items-center group/stat hover:translate-x-1 transition-transform">
                <span className="text-on-surface-variant text-sm font-medium">Workspace Volume</span>
                <span className="font-headline-sm text-primary">{allNotes.length}</span>
              </div>
              <div className="flex justify-between items-center group/stat hover:translate-x-1 transition-transform">
                <span className="text-on-surface-variant text-sm font-medium">Public Resonance</span>
                <span className="font-headline-sm text-secondary">{allNotes.filter(n => n.is_public).length}</span>
              </div>
              <div className="flex justify-between items-center group/stat hover:translate-x-1 transition-transform">
                <span className="text-on-surface-variant text-sm font-medium">AI Intelligence Quotient</span>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-secondary">{user?.ai_usage_count || 0}</span>
                  <span className="text-[9px] text-on-surface-variant/40 font-label-caps uppercase">Interactions</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          
          {/* New Note Card */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNote}
            className="w-full bg-primary text-on-primary p-10 rounded-[48px] flex flex-col items-center text-center group cursor-pointer shadow-2xl shadow-primary/20 hover:bg-black transition-all relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all group-hover:rotate-180 duration-500">
              <span className="material-symbols-outlined text-white text-3xl">add</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm mb-3 tracking-tight">Create New Note</h3>
            <p className="text-on-primary/60 text-sm leading-relaxed max-w-[180px]">Capture your fleeting thoughts before they vanish.</p>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
          
          {/* Categories List */}
          <div className="p-10">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-8 tracking-[0.3em] uppercase opacity-40 text-[10px]">Collections</h4>
            <ul className="space-y-6">
              {[
                { name: 'All Reflections', icon: 'folder_open', active: !selectedTag, href: '/dashboard' },
                { name: 'Shared Resonance', icon: 'star', active: false, href: '/dashboard/shared' },
                { name: 'Archived Sanctuary', icon: 'archive', active: false, href: '/dashboard/archive' }
              ].map((item, i) => (
                <Link 
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-4 group cursor-pointer transition-colors ${item.active ? 'text-on-surface' : 'text-on-surface-variant/60 hover:text-on-surface'}`}
                >
                  <motion.div 
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 w-full"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${item.active ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface-variant group-hover:bg-secondary/10 group-hover:text-secondary'}`}>
                      <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    </div>
                    <span className="font-body-md text-sm font-medium tracking-tight">{item.name}</span>
                  </motion.div>
                </Link>
              ))}
            </ul>

            {topTags.length > 0 && (
              <div className="mt-12">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-6 tracking-[0.3em] uppercase opacity-40 text-[10px]">Top Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {topTags.map(([tag, count]) => (
                    <Link 
                      key={tag}
                      href={`/dashboard?tag=${encodeURIComponent(tag)}`}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${selectedTag === tag ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary/10 hover:text-secondary'}`}
                    >
                      #{tag} <span className="opacity-40 ml-1">{count}</span>
                    </Link>
                  ))}
                  {selectedTag && (
                    <Link 
                      href="/dashboard"
                      className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                    >
                      Clear Filter
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          
        </motion.div>
      </div>
    </motion.main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
