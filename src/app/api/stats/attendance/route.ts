import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM

    let whereClause = {};

    if (decoded.role === 'SISWA') {
      whereClause = { nis: decoded.userId };
    }

    if (month) {
      whereClause = {
        ...whereClause,
        tanggal: {
          startsWith: month,
        },
      };
    }

    const attendance = await db.absensi.findMany({
      where: whereClause,
    });

    // Calculate statistics
    const total = attendance.length;
    const hadir = attendance.filter((a) => a.status === 'HADIR').length;
    const terlambat = attendance.filter((a) => a.status === 'TERLAMBAT').length;
    const izin = attendance.filter((a) => a.status === 'IZIN').length;
    const alpa = attendance.filter((a) => a.status === 'ALPA').length;

    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        total,
        hadir,
        terlambat,
        izin,
        alpa,
        percentage,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
