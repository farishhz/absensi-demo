import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { formatDate } from '@/lib/date';

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

    if (!decoded || decoded.role !== 'SISWA') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak' },
        { status: 403 }
      );
    }

    const today = formatDate();
    const attendance = await db.absensi.findFirst({
      where: {
        nis: decoded.userId,
        tanggal: today,
      },
    });

    return NextResponse.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Today attendance error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
