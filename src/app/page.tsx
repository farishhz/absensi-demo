'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, GraduationCap, User, Shield, BookOpen, Key, Sparkles, School, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        // Check if student needs to change password
        if (data.user.role === 'SISWA' && !data.user.statusReset) {
          router.push('/force-change-password');
        } else {
          // Redirect based on role
          switch (data.user.role) {
            case 'SISWA':
              router.push('/dashboard/siswa');
              break;
            case 'GURU':
              router.push('/dashboard/guru');
              break;
            case 'TU':
              router.push('/dashboard/tu');
              break;
            case 'ADMIN':
              router.push('/dashboard/admin');
              break;
          }
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleClick = (role: string) => {
    switch (role) {
      case 'siswa':
        setIdentifier('12345');
        setPassword('Smkn8bisa2025');
        toast.info('Demo: NIS 12345');
        break;
      case 'guru':
        setIdentifier('198001012020121001');
        setPassword('guru123');
        toast.info('Demo: NIP 198001012020121001');
        break;
      case 'tu':
        setIdentifier('197501012020121002');
        setPassword('tu123');
        toast.info('Demo: NIP 197501012020121002');
        break;
      case 'admin':
        setIdentifier('admin');
        setPassword('admin123');
        toast.info('Demo: Username admin');
        break;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo Section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
              <img
                src="/smkn8-logo.png"
                alt="SMKN 8 Jakarta"
                className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl p-2 shadow-2xl"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            SiHebat8
          </h1>
          <p className="text-blue-200 text-base md:text-lg">
            Sistem Absensi Digital SMKN 8 Jakarta
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden animate-slide-up">
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 md:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <School className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-1">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm md:text-base">
                Silakan login untuk mengakses sistem absensi
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-semibold text-slate-700">
                  <User className="w-4 h-4 inline mr-1" />
                  NIS / NIP / Username
                </Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Masukkan NIS, NIP, atau Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-200 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Key className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-200 text-base"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sedang Login...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Login
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">
                  Pilih Role
                </span>
              </div>
            </div>

            {/* Role Cards - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => handleRoleClick('siswa')}
                className="group text-center p-4 md:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <p className="font-bold text-blue-900 text-sm md:text-base">Siswa</p>
                <p className="text-blue-600 text-xs mt-1 font-medium">Gunakan NIS</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleClick('guru')}
                className="group text-center p-4 md:p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:from-slate-100 hover:to-slate-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto shadow-md">
                  <BookOpen className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-900 text-sm md:text-base">Guru</p>
                <p className="text-slate-600 text-xs mt-1 font-medium">Gunakan NIP</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleClick('tu')}
                className="group text-center p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 hover:from-emerald-100 hover:to-emerald-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <p className="font-bold text-emerald-900 text-sm md:text-base">TU</p>
                <p className="text-emerald-600 text-xs mt-1 font-medium">Gunakan NIP</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleClick('admin')}
                className="group text-center p-4 md:p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:from-indigo-100 hover:to-indigo-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <p className="font-bold text-indigo-900 text-sm md:text-base">Admin</p>
                <p className="text-indigo-600 text-xs mt-1 font-medium">Gunakan Username</p>
              </button>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 px-6 py-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/developer')}
                className="text-slate-600 hover:text-blue-600 h-9 px-4 transition-colors"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Developer</span>
              </Button>

              <p className="text-slate-500 text-xs font-medium text-center md:text-right">
                © 2025 SMKN 8 Jakarta
              </p>
            </div>
          </div>
        </Card>

        {/* Bottom Info */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-blue-200/80 text-sm">
            Klik pada role card untuk menggunakan akun demo
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
