'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ForceChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return { valid: false, message: 'Password minimal 6 karakter' };
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return { valid: false, message: 'Password harus kombinasi huruf dan angka' };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak sama');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Password berhasil diubah! Mengalihkan ke dashboard...');
        setTimeout(() => {
          router.push('/dashboard/siswa');
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img
              src="/smkn8-logo.png"
              alt="SMKN 8 Jakarta"
              className="w-20 h-20 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Wajib Ganti Password</h1>
          <p className="text-blue-200">
            Untuk keamanan akun Anda, silakan ganti password default dengan password baru
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-yellow-200 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Ganti Password</CardTitle>
            <CardDescription className="text-center">
              Password baru harus minimal 6 karakter dengan kombinasi huruf dan angka
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Password Saat Ini
                </Label>
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  Password Baru
                </Label>
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Buat password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Konfirmasi Password Baru
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-500"
                  required
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-blue-700 hover:text-blue-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              </Button>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sedang Mengubah...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Simpan Password Baru
                  </>
                )}
              </Button>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Penting:</strong> Password baru harus:
                  </p>
                </div>
                <ul className="text-sm text-yellow-800 space-y-1 ml-6 list-disc">
                  <li>Minimal 6 karakter</li>
                  <li>Kombinasi huruf dan angka</li>
                  <li>Berbeda dengan password default</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-blue-200 text-sm mt-6">
          SMKN 8 Jakarta © 2025
        </p>
      </div>
    </div>
  );
}
