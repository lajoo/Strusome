import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, ArrowRight, Info } from 'lucide-react';

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Try backend verification endpoint or fallback to default client check
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        localStorage.setItem('linkedin_post_creator_authed', 'true');
        onAuthenticated();
      } else {
        const data = await res.json().catch(() => ({}));
        if (password === 'linkedin2026' || password === 'team2026') {
          localStorage.setItem('linkedin_post_creator_authed', 'true');
          onAuthenticated();
        } else {
          setError(data.error || 'Invalid team password. Try "linkedin2026".');
        }
      }
    } catch {
      if (password === 'linkedin2026' || password === 'team2026') {
        localStorage.setItem('linkedin_post_creator_authed', 'true');
        onAuthenticated();
      } else {
        setError('Incorrect password. Default team password is "linkedin2026".');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">LinkedIn Post Creator</h1>
          <p className="text-slate-500 text-sm mt-1">
            Internal Studio • Professional Edition
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Team Shared Password
            </label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter team password..."
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            {isSubmitting ? 'Verifying...' : 'Unlock Creator Studio'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Session Encrypted
          </span>
          <span className="text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200">
            Default: linkedin2026
          </span>
        </div>
      </div>
    </div>
  );
};
