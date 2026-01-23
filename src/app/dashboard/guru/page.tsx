'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  Users,
  LogOut,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GuruDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetchUser();
    fetchAttendance();
    fetchPermissions();

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

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance/history?limit=20');
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.data);
      }
    } catch (error) {
      console.error('Fetch attendance error:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch('/api/permission/list');
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.data);
      }
    } catch (error) {
      console.error('Fetch permissions error:', error);
    }
  };

  const handleApprovePermission = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/permission/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchPermissions();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memproses izin');
    } finally {
      setIsLoading(false);
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

  const getStats = () => {
    const total = attendance.length;
    const hadir = attendance.filter((a) => a.status === 'HADIR').length;
    const terlambat = attendance.filter((a) => a.status === 'TERLAMBAT').length;
    const izin = attendance.filter((a) => a.status === 'IZIN').length;
    const alpa = attendance.filter((a) => a.status === 'ALPA').length;

    return { total, hadir, terlambat, izin, alpa };
  };

  const stats = getStats();

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
                <h1 className="text-lg font-bold">Halo, {user?.nama || 'Guru'}</h1>
                <p className="text-blue-200 text-sm">{user?.role} - {user?.mapel || 'SMKN 8 Jakarta'}</p>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="bg-white shadow-lg border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Absensi</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hadir</p>
                  <p className="text-3xl font-bold text-green-700">{stats.hadir}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terlambat</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.terlambat}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Izin</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.izin}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alpa</p>
                  <p className="text-3xl font-bold text-red-700">{stats.alpa}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance List & Permissions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-700" />
                Riwayat Absensi
              </CardTitle>
              <CardDescription>Data kehadiran siswa</CardDescription>
            </CardHeader>
            <CardContent>
              {attendance.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {attendance.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.siswa?.nama}</p>
                        <p className="text-sm text-gray-600">
                          {item.siswa?.kelas} - {item.tanggal}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {item.jamMasuk} - {item.jamPulang || '-'}
                        </p>
                        <Badge
                          className={
                            item.status === 'HADIR'
                              ? 'bg-green-600'
                              : item.status === 'TERLAMBAT'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada data absensi
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                Pengajuan Izin/Sakit
              </CardTitle>
              <CardDescription>Menunggu validasi</CardDescription>
            </CardHeader>
            <CardContent>
              {permissions.filter((p) => p.status === 'PENDING').length > 0 ? (
                <div className="space-y-3">
                  {permissions
                    .filter((p) => p.status === 'PENDING')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">{item.siswa?.nama}</p>
                            <p className="text-sm text-gray-600">
                              {item.siswa?.kelas} - {item.tanggal}
                            </p>
                          </div>
                          <Badge className="bg-yellow-600">{item.jenis}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{item.alasan}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprovePermission(item.id, 'APPROVED')}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Setujui
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleApprovePermission(item.id, 'REJECTED')}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Tolak
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada pengajuan yang menunggu
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
