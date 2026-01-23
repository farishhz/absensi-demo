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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let attendance;

    if (decoded.role === 'SISWA') {
      attendance = await db.absensi.findMany({
        where: { nis: decoded.userId },
        orderBy: { tanggal: 'desc' },
        take: limit,
        skip: offset,
      });
    } else if (decoded.role === 'GURU' || decoded.role === 'TU') {
      // Get all students attendance (for teacher/TU)
      attendance = await db.absensi.findMany({
        orderBy: { tanggal: 'desc' },
        take: limit,
        skip: offset,
        include: {
          siswa: true,
        },
      });
    } else if (decoded.role === 'ADMIN') {
      attendance = await db.absensi.findMany({
        orderBy: { tanggal: 'desc' },
        take: limit,
        skip: offset,
        include: {
          siswa: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
