import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { db } from '@/lib/db';

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

    let user;

    if (decoded.role === 'SISWA') {
      user = await db.siswa.findUnique({
        where: { nis: decoded.userId },
        select: {
          nis: true,
          nama: true,
          kelas: true,
          statusReset: true,
        },
      });
    } else if (decoded.role === 'GURU' || decoded.role === 'TU') {
      user = await db.guru.findUnique({
        where: { nip: decoded.userId },
        select: {
          nip: true,
          nama: true,
          mapel: true,
          role: true,
        },
      });
    } else if (decoded.role === 'ADMIN') {
      user = await db.admin.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
