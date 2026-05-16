'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/lib/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = isLogin 
        ? await login(formData)
        : await signup(formData);

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col md:flex-row items-center justify-center p-6 text-on-surface relative w-full">
      
      {/* Back to Home Link */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors z-20 font-medium text-sm group">
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back to Home
      </Link>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card bg-surface-container-lowest p-10 rounded-[48px] max-w-md w-full relative z-10 shadow-2xl border border-outline-variant/10"
      >
        <div className="relative z-10 text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-16 h-16 rounded-3xl bg-secondary-container flex items-center justify-center mx-auto shadow-xl shadow-secondary/10"
            >
               <span className="material-symbols-outlined text-white text-3xl">ink_pen</span>
            </motion.div>
          </Link>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-text' : 'signup-text'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              <h2 className="font-display-lg text-headline-md md:text-display-lg-mobile text-primary tracking-tighter leading-none mb-4">
                {isLogin ? 'Welcome Back' : 'Join NotesSpace'}
              </h2>
              <p className="text-on-surface-variant font-body-md opacity-60">
                {isLogin ? 'Enter your details to access your workspace.' : 'Create an account to start your journey.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleAuth} className="relative z-10 space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-medium text-center overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-label-caps font-label-caps tracking-[0.2em] text-on-surface-variant/50 mb-2 text-[10px]">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-body-md"
                placeholder="you@example.com"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-label-caps font-label-caps tracking-[0.2em] text-on-surface-variant/50 mb-2 text-[10px]">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-body-md"
                placeholder="••••••••"
              />
            </motion.div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-5 rounded-full font-body-lg font-bold shadow-xl shadow-primary/10 hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                PROCESSING...
              </span>
            ) : isLogin ? 'SIGN IN TO WORKSPACE' : 'CREATE YOUR SANCTUARY'}
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 mt-10 text-center border-t border-outline-variant/5 pt-8"
        >
          <p className="text-on-surface-variant/60 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-secondary font-bold hover:underline transition-all"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
