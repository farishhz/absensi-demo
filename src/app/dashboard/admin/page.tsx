'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield,
  Users,
  Settings,
  FileText,
  LogOut,
  Loader2,
  GraduationCap,
  User,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'logs'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    fetchUser();

    // Update time every second
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/smkn8-logo.png"
                alt="SMKN 8 Jakarta"
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-lg font-bold">Halo, {user?.nama || 'Admin'}</h1>
                <p className="text-blue-200 text-sm">Super User - SMKN 8 Jakarta</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-blue-200 text-sm">
                  {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-white hover:bg-blue-800"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-white rounded-lg shadow p-2">
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-blue-900' : 'text-gray-700'}
          >
            <Users className="w-4 h-4 mr-2" />
            Manajemen User
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' ? 'bg-blue-900' : 'text-gray-700'}
          >
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </Button>
          <Button
            variant={activeTab === 'logs' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('logs')}
            className={activeTab === 'logs' ? 'bg-blue-900' : 'text-gray-700'}
          >
            <FileText className="w-4 h-4 mr-2" />
            Log Aktivitas
          </Button>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Add User Cards */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Tambah Siswa</h3>
                    <p className="text-blue-200 text-sm mt-1">Tambah siswa baru</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-blue-900 hover:bg-blue-50"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Tambah Siswa
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Tambah Guru/TU</h3>
                    <p className="text-green-200 text-sm mt-1">Tambah guru atau TU baru</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-green-900 hover:bg-green-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Tambah Guru/TU
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Tambah Admin</h3>
                    <p className="text-purple-200 text-sm mt-1">Tambah admin baru</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-purple-900 hover:bg-purple-50"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Tambah Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-700" />
                  Pengaturan Absensi
                </CardTitle>
                <CardDescription>Atur jam dan toleransi keterlambatan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Jam Masuk</Label>
                  <Input type="time" defaultValue="07:00" />
                </div>
                <div className="space-y-2">
                  <Label>Jam Pulang</Label>
                  <Input type="time" defaultValue="15:00" />
                </div>
                <div className="space-y-2">
                  <Label>Toleransi Keterlambatan (menit)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <Button className="w-full bg-blue-900 hover:bg-blue-800">
                  Simpan Pengaturan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-700" />
                  Pengaturan Geofence
                </CardTitle>
                <CardDescription>Atur lokasi dan radius sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Latitude Sekolah</Label>
                  <Input type="text" defaultValue="-6.2297" />
                </div>
                <div className="space-y-2">
                  <Label>Longitude Sekolah</Label>
                  <Input type="text" defaultValue="106.8345" />
                </div>
                <div className="space-y-2">
                  <Label>Radius (meter)</Label>
                  <Input type="number" defaultValue={500} />
                </div>
                <Button className="w-full bg-blue-900 hover:bg-blue-800">
                  Simpan Pengaturan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                Log Aktivitas Sistem
              </CardTitle>
              <CardDescription>Riwayat aktivitas pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[
                  { action: 'Admin login', user: 'admin', time: 'Hari ini, 07:00', status: 'success' },
                  { action: 'Guru login', user: 'Budi Santoso', time: 'Hari ini, 06:55', status: 'success' },
                  { action: 'Siswa absen masuk', user: 'Ahmad Rizky', time: 'Hari ini, 07:02', status: 'success' },
                  { action: 'Gagal login', user: 'Unknown', time: 'Hari ini, 05:30', status: 'error' },
                  { action: 'Password reset', user: 'TU', time: 'Kemarin, 16:00', status: 'success' },
                ].map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">
                        {log.user} - {log.time}
                      </p>
                    </div>
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
