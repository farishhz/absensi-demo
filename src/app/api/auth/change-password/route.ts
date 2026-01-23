import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, validatePassword } from '@/lib/auth';
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

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Password saat ini dan password baru wajib diisi' },
        { status: 400 }
      );
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }

    // Update based on role
    if (decoded.role === 'SISWA') {
      const siswa = await db.siswa.findUnique({
        where: { nis: decoded.userId },
      });

      if (!siswa) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 404 }
        );
      }

      const isValid = await verifyPassword(currentPassword, siswa.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Password saat ini salah' },
          { status: 401 }
        );
      }

      const hashedPassword = await hashPassword(newPassword);
      await db.siswa.update({
        where: { nis: decoded.userId },
        data: {
          password: hashedPassword,
          statusReset: true, // Set status to active after password change
        },
      });
    } else if (decoded.role === 'GURU' || decoded.role === 'TU') {
      const guru = await db.guru.findUnique({
        where: { nip: decoded.userId },
      });

      if (!guru) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 404 }
        );
      }

      const isValid = await verifyPassword(currentPassword, guru.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Password saat ini salah' },
          { status: 401 }
        );
      }

      const hashedPassword = await hashPassword(newPassword);
      await db.guru.update({
        where: { nip: decoded.userId },
        data: {
          password: hashedPassword,
        },
      });
    } else if (decoded.role === 'ADMIN') {
      const admin = await db.admin.findUnique({
        where: { id: decoded.userId },
      });

      if (!admin) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 404 }
        );
      }

      const isValid = await verifyPassword(currentPassword, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Password saat ini salah' },
          { status: 401 }
        );
      }

      const hashedPassword = await hashPassword(newPassword);
      await db.admin.update({
        where: { id: decoded.userId },
        data: {
          password: hashedPassword,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
