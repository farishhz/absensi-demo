import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { formatDate } from '@/lib/date';

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

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tanggal, jenis, alasan, bukti } = body;

    if (!tanggal || !jenis || !alasan) {
      return NextResponse.json(
        { success: false, message: 'Tanggal, jenis, dan alasan wajib diisi' },
        { status: 400 }
      );
    }

    if (!['SAKIT', 'IZIN'].includes(jenis)) {
      return NextResponse.json(
        { success: false, message: 'Jenis izin tidak valid' },
        { status: 400 }
      );
    }

    let permission;

    if (decoded.role === 'SISWA') {
      permission = await db.izin.create({
        data: {
          nis: decoded.userId,
          tanggal: new Date(tanggal).toISOString().split('T')[0],
          jenis,
          alasan,
          bukti,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pengajuan izin berhasil',
      data: permission,
    });
  } catch (error) {
    console.error('Permission request error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
