'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  FileText,
  LogOut,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentLocation } from '@/lib/geolocation';

export default function SiswaDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    // Fetch user data
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
        fetchTodayAttendance();
        fetchHistory();
        fetchStats();
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch('/api/attendance/today');
      if (res.ok) {
        const data = await res.json();
        setTodayAttendance(data.data);
      }
    } catch (error) {
      console.error('Fetch today attendance error:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/attendance/history?limit=5');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Fetch history error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats/attendance');
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation({ lat: loc.latitude, lon: loc.longitude });

      // Open camera for selfie
      setShowCamera(true);
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengambil lokasi');
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/attendance/check-out', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchTodayAttendance();
        fetchHistory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat absen pulang');
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

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSchedule = () => {
    // Mock schedule data - in production, this should come from API
    return [
      { time: '07:00 - 07:30', subject: 'Upacara' },
      { time: '07:30 - 09:00', subject: 'Matematika' },
      { time: '09:00 - 09:30', subject: 'Istirahat' },
      { time: '09:30 - 11:00', subject: 'Bahasa Indonesia' },
      { time: '11:00 - 12:30', subject: 'IPA' },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex flex-col">
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
                <h1 className="text-lg font-bold">Halo, {user?.nama || 'Siswa'}</h1>
                <p className="text-blue-200 text-sm">{user?.kelas || 'Kelas'}</p>
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
        {/* Attendance Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-700" />
                Absensi Hari Ini
              </CardTitle>
              <CardDescription>
                {todayAttendance ? 'Anda sudah absen hari ini' : 'Silakan lakukan absensi'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAttendance ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Absen Masuk</span>
                    </div>
                    <Badge variant="secondary">{todayAttendance.jamMasuk}</Badge>
                  </div>
                  {todayAttendance.jamPulang ? (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium">Absen Pulang</span>
                      </div>
                      <Badge variant="secondary">{todayAttendance.jamPulang}</Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={handleCheckOut}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Absen Pulang'}
                    </Button>
                  )}
                  {location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-slate-50 rounded">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleCheckIn}
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Absen Masuk
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Location & Camera */}
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-700" />
                Status Lokasi
              </CardTitle>
              <CardDescription>
                Pastikan Anda berada dalam radius sekolah (500 meter)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {location ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Lokasi Valid</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Latitude:</span>
                      <span className="font-mono">{location.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longitude:</span>
                      <span className="font-mono">{location.lon.toFixed(6)}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation(null)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Cek Ulang Lokasi
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">
                    Klik tombol Absen Masuk untuk mengambil lokasi
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Schedule & Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-700" />
                Jadwal Hari Ini
              </CardTitle>
              <CardDescription>Senin, 20 Januari 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getSchedule().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <span className="text-sm font-medium text-gray-700">{item.time}</span>
                    <span className="text-sm font-semibold text-blue-700">{item.subject}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                Statistik Kehadiran
              </CardTitle>
              <CardDescription>Persentase kehadiran bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Hadir</span>
                    <Badge className="bg-green-600">{stats.hadir}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Terlambat</span>
                    <Badge className="bg-yellow-600">{stats.terlambat}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Izin</span>
                    <Badge className="bg-blue-600">{stats.izin}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Alpa</span>
                    <Badge className="bg-red-600">{stats.alpa}</Badge>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Persentase Kehadiran</p>
                      <p className="text-3xl font-bold text-blue-700">{stats.percentage}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Memuat statistik...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card className="bg-white shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-700" />
              Riwayat Absensi
            </CardTitle>
            <CardDescription>5 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.status === 'HADIR' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : item.status === 'TERLAMBAT' ? (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{item.tanggal}</p>
                        <p className="text-sm text-gray-600">
                          {item.jamMasuk} - {item.jamPulang || 'Belum'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.status === 'HADIR'
                          ? 'default'
                          : item.status === 'TERLAMBAT'
                          ? 'secondary'
                          : 'destructive'
                      }
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada riwayat absensi
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-blue-900 text-white py-4 border-t border-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-blue-200">
              © 2025 SiHebat8 - SMKN 8 Jakarta
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/developer')}
                className="text-blue-200 hover:text-white hover:bg-blue-800 text-xs"
              >
                <GraduationCap className="w-3 h-3 mr-1" />
                Profil Developer
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
