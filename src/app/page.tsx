'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, GraduationCap, User, Shield, BookOpen, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

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
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 pt-8 pb-10">
            <div className="text-center">
              {/* Logo */}
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <img
                  src="/smkn8-logo.png"
                  alt="SMKN 8 Jakarta"
                  className="h-16 w-auto bg-white rounded-lg p-1"
                />
              </div>
              
              {/* Branding */}
              <h1 className="text-3xl font-bold text-white mb-1">
                SiHebat8
              </h1>
              <p className="text-blue-100 text-sm">
                Sistem Absensi Digital SMKN 8 Jakarta
              </p>
            </div>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-slate-700">
                  NIS / NIP / Username
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Masukkan NIS, NIP, atau Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang Login...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500 font-medium">
                  Login sebagai
                </span>
              </div>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <p className="font-semibold text-blue-900 text-sm">Siswa</p>
                <p className="text-blue-600 text-xs mt-0.5">Gunakan NIS</p>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-slate-300 transition-all hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">Guru / TU</p>
                <p className="text-slate-600 text-xs mt-0.5">Gunakan NIP</p>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform mx-auto">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="font-semibold text-indigo-900 text-sm">Admin</p>
                <p className="text-indigo-600 text-xs mt-0.5">Gunakan Username</p>
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/developer')}
                className="text-slate-600 hover:text-blue-600 h-8 px-3 transition-colors"
              >
                <GraduationCap className="w-4 h-4 mr-1.5" />
                <span className="text-sm">Developer</span>
              </Button>
              
              <p className="text-slate-500 text-xs">
                SMKN 8 Jakarta © 2025
              </p>
            </div>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
