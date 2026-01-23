import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { formatDate, formatTime } from '@/lib/date';

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

    // Find today's attendance
    const today = formatDate();
    const attendance = await db.absensi.findFirst({
      where: {
        nis: decoded.userId,
        tanggal: today,
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { success: false, message: 'Anda belum absen masuk hari ini' },
        { status: 400 }
      );
    }

    if (attendance.jamPulang) {
      return NextResponse.json(
        { success: false, message: 'Anda sudah absen pulang hari ini' },
        { status: 400 }
      );
    }

    // Update attendance with check-out time
    const currentTime = new Date();
    const updatedAttendance = await db.absensi.update({
      where: { id: attendance.id },
      data: {
        jamPulang: formatTime(currentTime),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Absen pulang berhasil',
      data: updatedAttendance,
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
