import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin } = useDataContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAdmin(password);
    if (!success) {
      setError('Kata sandi salah. Gunakan kata sandi admin: admin123 atau alihsan2025');
    } else {
      setPassword('');
    }
  };

  const handleQuickLogin = () => {
    loginAdmin('admin123');
    setPassword('');
  };

  return (
    <div
      id="admin-login-backdrop"
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setIsLoginModalOpen(false)}
    >
      <div
        id="admin-login-card"
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#d4af37]/35 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white p-6 relative">
          <button
            id="admin-login-close-btn"
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
            PORTAL KHUSUS PENGELOLA
          </span>
          <h3 className="font-heading text-xl font-bold text-[#f3e5ab]">
            Masuk Panel Admin Madrasah
          </h3>
          <p className="text-xs text-white/75 mt-1 leading-relaxed">
            Kelola data profil, verifikasi pendaftar PPDB, publikasi warta berita, dan seluruh konten website MI Ma'arif Al Ihsan Soborejo.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kata Sandi / PIN Admin
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Masukkan kata sandi pengelola"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3c26]"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="admin-submit-login-btn"
              type="submit"
              className="w-full py-2.5 bg-[#0b3c26] hover:bg-[#072217] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk ke Panel Konten</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 mb-3">
              <div className="font-bold flex items-center gap-1 text-amber-800 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Akses Cepat Pengelola:</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Gunakan kata sandi: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#0b3c26]">admin123</code> atau klik tombol masuk langsung di bawah ini.
              </p>
            </div>

            <button
              id="admin-quick-login-btn"
              onClick={handleQuickLogin}
              className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0b3c26]" />
              <span>Masuk Cepat (Akun Demo Pengelola)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
