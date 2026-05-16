'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import { updateNote, deleteNote, restoreNote } from '@/lib/actions/notes';
import { processWithAI } from '@/lib/actions/ai';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Note } from '@/types';

export default function NoteEditor({ initialNote }: { initialNote: Note }) {
  const [title, setTitle] = useState(initialNote.title || '');
  const [content, setContent] = useState(initialNote.content || '');
  const [isPublic, setIsPublic] = useState(initialNote.is_public || false);
  const [isFavorite, setIsFavorite] = useState(initialNote.is_favorite || false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [tags, setTags] = useState<string[]>(initialNote.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (id: string, newTitle: string, newContent: string, newIsPublic: boolean, newTags: string[], newIsFavorite: boolean) => {
      setSaveStatus('saving');
      try {
        await updateNote(id, { 
          title: newTitle, 
          content: newContent, 
          is_public: newIsPublic,
          tags: newTags,
          is_favorite: newIsFavorite
        });
        setSaveStatus('saved');
      } catch (error) {
        console.error('Failed to save note:', error);
        setSaveStatus('error');
      }
    }, 1000),
    [updateNote]
  );

  // Trigger save on content or title change
  useEffect(() => {
    if (title !== initialNote.title || content !== initialNote.content || isPublic !== initialNote.is_public || isFavorite !== initialNote.is_favorite || JSON.stringify(tags) !== JSON.stringify(initialNote.tags)) {
      setSaveStatus('saving');
      debouncedSave(initialNote.id, title, content, isPublic, tags, isFavorite);
    }
  }, [title, content, isPublic, tags, isFavorite, initialNote.id, initialNote.title, initialNote.content, initialNote.is_public, initialNote.tags, initialNote.is_favorite, debouncedSave]);

  const handleGenerateAI = async (action: 'summarize' | 'action-items' | 'suggest-title') => {
    setIsGenerating(true);
    setAiOutput('');
    try {
      const result = await processWithAI(action, content);
      setAiOutput(result || '');
      
      // Persist to database if it's summary or action items
      if (action === 'summarize') {
        await updateNote(initialNote.id, { summary: result });
      } else if (action === 'action-items') {
        await updateNote(initialNote.id, { action_items: result });
      } else if (action === 'suggest-title') {
        // We don't auto-update title, user can choose to
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAiOutput(error.message || 'Failed to generate AI response. Please check your API key configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(initialNote.id);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete note:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreNote(initialNote.id);
      router.refresh();
      // We don't necessarily need to redirect, just refresh to update state
    } catch (error) {
      console.error('Failed to restore note:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const insertAtCursor = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const currentContent = content;
      const newContent = currentContent.substring(0, start) + "\n" + text + "\n" + currentContent.substring(end);
      setContent(newContent);
      
      // Set selection after content update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = start + text.length + 2;
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    } else {
      setContent(content + "\n\n" + text);
    }
    setAiOutput('');
    setIsAiPanelOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/shared/${initialNote.share_id}` : '';

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-secondary/20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/[0.03] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Restoration Banner for Deleted Notes */}
      <AnimatePresence>
        {initialNote.is_deleted && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-secondary text-white px-6 py-3 flex items-center justify-between z-50 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">info</span>
              <p className="text-[11px] font-label-caps tracking-widest">THIS THOUGHT IS IN THE TRASH AND WILL NOT BE SYNCED UNTIL RESTORED</p>
            </div>
            <button 
              onClick={handleRestore}
              disabled={isRestoring}
              className="bg-white text-secondary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {isRestoring ? 'RESTORING...' : 'RESTORE NOW'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="flex items-center justify-between p-4 px-6 sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl hover:bg-surface-container-high flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
            <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/40 font-label-caps tracking-[0.3em] hidden md:flex">
            <span>WORKSPACE</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="text-primary/60">NOTE EDITOR</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full border border-outline-variant/10 mr-2">
            <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : saveStatus === 'error' ? 'bg-red-500' : 'bg-emerald-400'}`} />
            <span className="text-[9px] text-on-surface-variant font-label-caps tracking-widest uppercase">
              {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'error' ? 'Sync Failed' : 'Synced'}
            </span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => {
                if (isPublic) {
                  copyToClipboard(shareUrl);
                } else {
                  setIsPublic(true);
                }
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isPublic ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
              title={isPublic ? "Copy Share Link" : "Make Public"}
            >
              <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: isPublic ? "'FILL' 1" : ""}}>{isLinkCopied ? 'check' : 'share'}</span>
            </button>
            <AnimatePresence>
              {isLinkCopied && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-secondary text-white text-[9px] font-label-caps tracking-widest px-3 py-1 rounded-full shadow-lg"
                >
                  LINK COPIED
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isFavorite ? 'bg-amber-100 text-amber-500 shadow-lg shadow-amber-500/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: isFavorite ? "'FILL' 1" : ""}}>star</span>
          </button>

          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 rounded-xl hover:bg-red-500 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-on-surface-variant/40"
            title="Delete Note"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>

          <div className="w-px h-6 bg-outline-variant/20 mx-1" />

          <button 
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-label-caps text-[11px] tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg ${isAiPanelOpen ? 'bg-secondary text-white shadow-secondary/20' : 'bg-primary text-on-primary shadow-primary/20 hover:bg-black'}`}
          >
            <span className="material-symbols-outlined text-sm animate-pulse">auto_awesome</span>
            <span className="hidden sm:inline">SPARK AI</span>
          </button>
        </div>
      </header>

      {/* Editor Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-16 relative flex z-10">
        <motion.div 
          layout
          className={`flex-1 transition-all duration-700 ease-in-out ${isAiPanelOpen ? 'md:pr-12' : ''}`}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={initialNote.is_deleted}
            placeholder="Untitled Note"
            className="w-full text-display-lg-mobile md:text-display-lg font-display-lg text-primary bg-transparent border-none outline-none mb-6 placeholder:text-on-surface-variant/20 leading-tight tracking-tighter disabled:opacity-50"
          />

          {/* Tags Section */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={tag}
                  className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-[10px] font-label-caps tracking-widest flex items-center gap-2 border border-secondary/20 group"
                >
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    disabled={initialNote.is_deleted}
                    className="hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            {!initialNote.is_deleted && (
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="+ Add Tag"
                  className="bg-transparent border-none outline-none text-[10px] font-label-caps tracking-widest text-on-surface-variant/40 focus:text-secondary transition-colors w-24"
                />
              </div>
            )}
          </div>
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={initialNote.is_deleted}
            placeholder="Start your sanctuary of thoughts..."
            className="w-full min-h-[600px] text-body-lg font-body-lg bg-transparent border-none outline-none resize-none placeholder:text-on-surface-variant/30 leading-relaxed text-on-surface-variant/80 selection:bg-secondary/20 disabled:opacity-50"
          />
        </motion.div>
      </main>

      {/* Floating AI Panel */}
      <AnimatePresence>
        {isAiPanelOpen && (
          <motion.aside 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-6 top-24 bottom-6 w-80 md:w-96 glass-card bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 flex flex-col shadow-2xl z-50 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                Spark AI
              </h3>
              <button onClick={() => setIsAiPanelOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Summarize Note', action: 'summarize', icon: 'short_text' },
                { label: 'Extract Action Items', action: 'action-items', icon: 'checklist' },
                { label: 'Suggest Title', action: 'suggest-title', icon: 'title' }
              ].map((item) => (
                <motion.button 
                  key={item.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerateAI(item.action as 'summarize' | 'action-items' | 'suggest-title')}
                  disabled={!content.trim() || isGenerating}
                  className="w-full text-left px-4 py-4 rounded-2xl bg-surface-container hover:bg-secondary/5 border border-outline-variant/10 hover:border-secondary/20 transition-all text-sm font-medium flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary/70 text-lg">{item.icon}</span>
                    {item.label}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </motion.button>
              ))}
            </div>

            <div className="flex-1 bg-surface-container-lowest rounded-[24px] p-5 overflow-y-auto border border-outline-variant/20 shadow-inner relative group">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 space-y-4">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-secondary/10 border-t-secondary rounded-full"
                    />
                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary animate-pulse">auto_awesome</span>
                  </div>
                  <span className="text-xs font-label-caps tracking-[0.2em] text-secondary">IGNITING SPARK...</span>
                </div>
              ) : aiOutput ? (
                <div className="flex flex-col h-full">
                  <div className="prose prose-sm prose-slate max-w-none text-on-surface flex-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {aiOutput}
                    </ReactMarkdown>
                  </div>
                  <div className="flex gap-3 mt-6 pt-6 border-t border-outline-variant/10">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => insertAtCursor(aiOutput)}
                      className="flex-1 bg-secondary text-white py-3 rounded-xl text-[10px] font-label-caps tracking-widest hover:shadow-lg hover:shadow-secondary/20 transition-all"
                    >
                      INSERT AT CURSOR
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => copyToClipboard(aiOutput)}
                      className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl text-[10px] font-label-caps tracking-widest hover:bg-surface-variant transition-all"
                    >
                      COPY
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant/50 space-y-3 p-4">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-3xl opacity-30">temp_preferences_custom</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-60">Select a tool above to analyze your note with NotesSpace AI.</p>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                <span className="material-symbols-outlined text-4xl">delete</span>
              </div>
              <h3 className="font-headline-md text-primary mb-3">Move to Trash?</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">This thought will be moved to your Trash sanctuary. You can restore it later if you change your mind.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-4 rounded-2xl bg-surface-container font-medium hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 rounded-2xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Moving...' : 'Move to Trash'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
