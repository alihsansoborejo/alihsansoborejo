import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, ArrowRight, Sparkles, Globe, LogIn } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin, setViewMode } = useDataContext();
  const { signInWithGoogle, user } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await signInWithGoogle();
      loginAdmin('admin123'); // also set view mode and admin flag
      setIsLoginModalOpen(false);
      setViewMode('admin');
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setError('Gagal login dengan Google: ' + (err.message || 'Periksa koneksi internet'));
    } finally {
      setIsGoogleLoading(false);
    }
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

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-white/10 px-2.5 py-0.5 rounded-full inline-block w-fit">
                ONLINE CLOUD DATABASE
              </span>
              <span className="text-xs text-white/80 font-medium mt-0.5">
                Akses Pengelola Dari Komputer Manapun
              </span>
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold text-[#f3e5ab]">
            Masuk Panel Admin Madrasah
          </h3>
          <p className="text-xs text-white/75 mt-1 leading-relaxed">
            Kelola data profil, verifikasi pendaftar PPDB, publikasi warta berita, dan seluruh data yang tersimpan online di Cloud SQL database.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Google Sign In Button */}
          <button
            id="admin-google-login-btn"
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0b3c26] text-gray-800 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mb-4 group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Menghubungkan...' : 'Masuk dengan Akun Google (Cloud Auth)'}</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-2 text-[11px] text-gray-400 uppercase font-semibold">
              atau gunakan kata sandi
            </span>
            <div className="border-t border-gray-200 w-full"></div>
          </div>

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
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-900 mb-2.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-0.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status Online Database:</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Tersambung ke Google Cloud SQL (PostgreSQL). Perubahan tersimpan online dan langsung sinkron ke seluruh pengunjung & komputer lain.
              </p>
            </div>

            <button
              id="admin-quick-login-btn"
              onClick={handleQuickLogin}
              className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0b3c26]" />
              <span>Masuk Cepat (Akses Langsung)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
