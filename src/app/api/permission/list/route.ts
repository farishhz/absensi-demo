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

    let permissions;

    if (decoded.role === 'SISWA') {
      permissions = await db.izin.findMany({
        where: { nis: decoded.userId },
        orderBy: { createdAt: 'desc' },
      });
    } else if (decoded.role === 'GURU' || decoded.role === 'TU') {
      permissions = await db.izin.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          siswa: true,
        },
      });
    } else if (decoded.role === 'ADMIN') {
      permissions = await db.izin.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          siswa: true,
          guru: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error('Permission list error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
