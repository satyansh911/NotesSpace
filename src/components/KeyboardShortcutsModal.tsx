'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Shortcut {
  keys: string[];
  description: string;
}

const SHORTCUTS: { category: string; items: Shortcut[] }[] = [
  {
    category: 'Editor',
    items: [
      { keys: ['Ctrl', 'S'], description: 'Save note immediately' },
      { keys: ['Ctrl', 'B'], description: 'Bold selected text' },
      { keys: ['Ctrl', 'I'], description: 'Italic selected text' },
      { keys: ['Ctrl', 'K'], description: 'Insert markdown link' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['Ctrl', '/'], description: 'Toggle AI Spark panel' },
      { keys: ['Esc'], description: 'Close panels / dialogs' },
      { keys: ['?'], description: 'Show this shortcut guide' },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 bg-surface-container-low border border-outline-variant/20 rounded-[32px] p-8 max-w-lg w-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">keyboard</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-primary">Keyboard Shortcuts</h2>
                  <p className="text-[11px] text-on-surface-variant/50 font-label-caps tracking-widest mt-0.5">POWER USER GUIDE</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl hover:bg-surface-container-high flex items-center justify-center transition-all text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Shortcut Groups */}
            <div className="space-y-6">
              {SHORTCUTS.map((group) => (
                <div key={group.category}>
                  <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40 uppercase mb-4">
                    {group.category}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((shortcut) => (
                      <div
                        key={shortcut.description}
                        className="flex items-center justify-between py-2.5 px-4 rounded-2xl hover:bg-surface-container-high transition-colors"
                      >
                        <span className="text-sm text-on-surface-variant">{shortcut.description}</span>
                        <div className="flex items-center gap-1.5">
                          {shortcut.keys.map((key, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <kbd className="px-2.5 py-1 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-[11px] font-medium text-primary shadow-sm font-mono">
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className="text-on-surface-variant/30 text-xs">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-on-surface-variant/30 font-label-caps tracking-widest text-center mt-8">
              PRESS ESC OR ? TO CLOSE
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
