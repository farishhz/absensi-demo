'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Users,
  FileText,
  Download,
  RefreshCw,
  LogOut,
  Loader2,
  Search,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TUDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUser();
    fetchStudents();
    fetchAttendance();

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

  const fetchStudents = async () => {
    try {
      // Mock data - in production, this should come from API
      const mockStudents = [
        { nis: '12345', nama: 'Ahmad Rizky', kelas: 'XII RPL 1' },
        { nis: '12346', nama: 'Budi Santoso', kelas: 'XII RPL 1' },
        { nis: '12347', nama: 'Citra Dewi', kelas: 'XII RPL 2' },
        { nis: '12348', nama: 'Dian Pratama', kelas: 'XI TKJ 1' },
        { nis: '12349', nama: 'Eka Saputra', kelas: 'XI TKJ 1' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Fetch students error:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance/history?limit=50');
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.data);
      }
    } catch (error) {
      console.error('Fetch attendance error:', error);
    }
  };

  const handleResetPassword = async (nis: string) => {
    setIsLoading(true);
    try {
      // Mock API call - implement actual reset password endpoint
      toast.success(`Password siswa ${nis} berhasil di-reset ke default`);
      setIsLoading(false);
    } catch (error) {
      toast.error('Gagal reset password');
      setIsLoading(false);
    }
  };

  const handleExportReport = (type: 'excel' | 'pdf') => {
    // Mock export - implement actual export functionality
    toast.success(`Laporan di-export ke format ${type.toUpperCase()}`);
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
  const filteredStudents = students.filter((s) =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.includes(searchTerm) ||
    s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-lg font-bold">Halo, {user?.nama || 'TU'}</h1>
                <p className="text-blue-200 text-sm">Tata Usaha - SMKN 8 Jakarta</p>
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
                  <p className="text-sm text-gray-600">Total Siswa</p>
                  <p className="text-3xl font-bold text-blue-700">{students.length}</p>
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
                <Calendar className="w-8 h-8 text-green-500" />
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
                <TrendingUp className="w-8 h-8 text-yellow-500" />
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
                <RefreshCw className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Management & Export */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                Manajemen Siswa
              </CardTitle>
              <CardDescription>Kelola data siswa dan reset password</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari siswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.nis}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{student.nama}</p>
                        <p className="text-sm text-gray-600">
                          NIS: {student.nis} - {student.kelas}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetPassword(student.nis)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-700" />
                Export Laporan
              </CardTitle>
              <CardDescription>Download laporan kehadiran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2">Laporan Harian</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Rekap kehadiran siswa per hari
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-900 hover:bg-blue-800"
                      onClick={() => handleExportReport('excel')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleExportReport('pdf')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-2">Laporan Bulanan</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Rekap kehadiran siswa per bulan
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-green-700 hover:bg-green-800"
                      onClick={() => handleExportReport('excel')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleExportReport('pdf')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
