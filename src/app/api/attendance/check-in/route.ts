import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { formatDate, formatTime } from '@/lib/date';
import { isWithinRadius, DEFAULT_SCHOOL_LOCATION } from '@/lib/geolocation';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'SISWA') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak' },
        { status: 403 }
      );
    }

    // Check if student is forced to change password
    const siswa = await db.siswa.findUnique({
      where: { nis: decoded.userId },
    });

    if (!siswa) {
      return NextResponse.json(
        { success: false, message: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    if (!siswa.statusReset) {
      return NextResponse.json(
        { success: false, message: 'Wajib ganti password terlebih dahulu' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { latitude, longitude, photo } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { success: false, message: 'Koordinat lokasi wajib diisi' },
        { status: 400 }
      );
    }

    if (!photo) {
      return NextResponse.json(
        { success: false, message: 'Foto selfie wajib diupload' },
        { status: 400 }
      );
    }

    // Check if already checked in today
    const today = formatDate();
    const existingAttendance = await db.absensi.findFirst({
      where: {
        nis: decoded.userId,
        tanggal: today,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { success: false, message: 'Anda sudah absen hari ini' },
        { status: 400 }
      );
    }

    // Check if within geofence radius
    const isWithinSchool = isWithinRadius(
      latitude,
      longitude,
      DEFAULT_SCHOOL_LOCATION.latitude,
      DEFAULT_SCHOOL_LOCATION.longitude,
      DEFAULT_SCHOOL_LOCATION.radius
    );

    if (!isWithinSchool) {
      return NextResponse.json(
        {
          success: false,
          message: 'Anda berada di luar radius sekolah (500 meter)',
        },
        { status: 400 }
      );
    }

    // Determine if late (after 7:00 AM)
    const currentTime = new Date();
    const lateThreshold = new Date();
    lateThreshold.setHours(7, 0, 0, 0);
    const isLate = currentTime > lateThreshold;

    // Create attendance record
    const attendance = await db.absensi.create({
      data: {
        nis: decoded.userId,
        tanggal: today,
        jamMasuk: formatTime(currentTime),
        latitude,
        longitude,
        foto: photo,
        status: isLate ? 'TERLAMBAT' : 'HADIR',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Absen masuk berhasil',
      data: attendance,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
