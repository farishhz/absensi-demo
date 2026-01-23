import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

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

    if (decoded.role === 'SISWA') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, catatan } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID dan status wajib diisi' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid' },
        { status: 400 }
      );
    }

    // Update permission status
    const permission = await db.izin.update({
      where: { id },
      data: {
        status,
        catatan,
        nip: decoded.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Izin berhasil ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}`,
      data: permission,
    });
  } catch (error) {
    console.error('Permission approve error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
