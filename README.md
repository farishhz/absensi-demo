# SiHebat8 - Sistem Absensi Digital SMKN 8 Jakarta

![SiHebat8](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Framework](https://img.shields.io/badge/Next.js-16.1.1-black)
![Language](https://img.shields.io/badge/TypeScript-5.0-blue)

> **Sistem Absensi Digital Modern untuk SMKN 8 Jakarta**
> 
> Platform absensi online berbasis web modern dengan fitur lengkap seperti geolocation, verifikasi foto selfie, dan multi-role access control.

## 🌟 Fitur Utama

### 🔐 Sistem Keamanan 3 Tahap
- **First Time Login**: Login menggunakan NIS/NIP/Username dengan password default
- **Forced Password Change**: Siswa wajib mengganti password setelah login pertama
- **Dashboard Access**: Akses hanya diizinkan setelah password berhasil diganti

### 👥 Multi-User Login (Satu Halaman)
- **Siswa**: Login menggunakan NIS
- **Guru / TU**: Login menggunakan NIP
- **Admin**: Login menggunakan Username

### 🎓 Role-Based Access Control (RBAC)

#### 👨 SISWA
- ✅ Absen Masuk & Pulang
- ✅ Upload foto selfie
- ✅ Geolocation & radius sekolah (500 meter)
- ✅ Riwayat kehadiran pribadi
- ✅ Jadwal pelajaran hari ini
- ✅ Pengajuan izin/sakit

#### 👨 GURU
- ✅ Rekap kehadiran siswa per kelas
- ✅ Validasi izin/sakit siswa
- ✅ Jurnal mengajar (opsional)

#### 📋 TU (Tata Usaha)
- ✅ Manajemen data siswa
- ✅ Reset password siswa
- ✅ Rekap kehadiran seluruh sekolah
- ✅ Export laporan (PDF / Excel)

#### 👑 ADMIN (SUPER USER)
- ✅ Manajemen user (Siswa, Guru, Admin)
- ✅ Pengaturan jam absensi
- ✅ Pengaturan toleransi keterlambatan
- ✅ Manajemen zona geofence
- ✅ Log aktivitas sistem
- ✅ Broadcast pengumuman

### 📍 Geolocation & Geofence
- 🌍 Deteksi lokasi GPS user
- 🎯 Validasi radius sekolah (500 meter)
- 🚫 Blokir absen di luar radius

### 📊 Statistik & Visualisasi
- 📈 Grafik kehadiran (Hadir, Terlambat, Izin, Alpa)
- 📊 Persentase kehadiran bulanan
- 📉 Rekap data absensi

## 🚀 Teknologi

### Frontend
- **Next.js 16** - React Framework dengan App Router
- **TypeScript 5** - Type Safety
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Modern UI Components
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Database ORM
- **SQLite** - Database

### Security & Auth
- **bcryptjs** - Password Hashing
- **jsonwebtoken** - JWT Authentication
- **HTTP-only Cookies** - Secure Session

### Utilities
- **HTML5 Geolocation API** - Location Detection
- **HTML5 Camera API** - Selfie Verification
- **Haversine Formula** - Distance Calculation

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/farishhz/absensi-demo.git
cd absensi-demo

# Install dependencies
bun install

# Setup database
bun run db:push
bun run db:generate

# Seed initial data
bunx tsx prisma/seed.ts

# Run development server
bun run dev
```

## 🗄️ Database Schema

### Model Database
- `siswa` - Data siswa
- `guru` - Data guru dan TU
- `admin` - Data admin
- `absensi` - Data absensi siswa
- `izin` - Data pengajuan izin/sakit
- `settings` - Pengaturan sistem
- `logs` - Log aktivitas sistem
- `pengumuman` - Data pengumuman

## 👤 Akun Demo

Setelah seeding database, Anda bisa login dengan akun berikut:

### Admin
- **Username**: `admin`
- **Password**: `admin123`

### Guru
- **NIP**: `1980010120121001`
- **Password**: `guru123`

### TU (Tata Usaha)
- **NIP**: `1975010120121002`
- **Password**: `tu123`

### Siswa (Password Default)
- **NIS**: `12345` - `12354`
- **Password**: `Smkn8bisa2025`
- **Catatan**: Siswa wajib mengganti password setelah login pertama

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Login multi-role
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Ganti password
- `GET /api/auth/me` - Get current user info

### Attendance
- `POST /api/attendance/check-in` - Absen masuk
- `POST /api/attendance/check-out` - Absen pulang
- `GET /api/attendance/history` - Riwayat absensi
- `GET /api/attendance/today` - Absensi hari ini

### Permissions
- `POST /api/permission/request` - Pengajuan izin
- `GET /api/permission/list` - List izin
- `POST /api/permission/approve` - Validasi izin

### Statistics
- `GET /api/stats/attendance` - Statistik kehadiran

## 🎨 Desain & UI

### Warna Utama
- **Primary**: Biru Tua Dongker (`#1e3a8a` - `#1e40af`)
- **Secondary**: Putih & Abu-abu
- **Success**: Hijau (`#16a34a`)
- **Warning**: Kuning (`#ca8a04`)
- **Error**: Merah (`#dc2626`)

### Gaya Desain
- ✅ Profesional
- ✅ Bersih
- ✅ Modern
- ✅ Responsif (Mobile & Desktop)

## 📄 Lisensi

MIT License - lihat [LICENSE](LICENSE) untuk detail

## 👨‍💻 Pengembang

- **Tim**: Tim Pengembangan SiHebat8
- **Sekolah**: SMKN 8 Jakarta

---

**© 2025 SMKN 8 Jakarta. All rights reserved.**

Made with ❤️ by SiHebat8 Team
