import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, DEFAULT_PASSWORD } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Identifier dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Check in Siswa table
    const siswa = await db.siswa.findUnique({
      where: { nis: identifier },
    });

    if (siswa) {
      const isValid = await verifyPassword(password, siswa.password);

      if (isValid) {
        const token = generateToken({
          userId: siswa.nis,
          role: 'SISWA',
          name: siswa.nama,
          kelas: siswa.kelas,
        });

        const response = NextResponse.json({
          success: true,
          message: 'Login berhasil',
          token,
          user: {
            id: siswa.nis,
            role: 'SISWA',
            nama: siswa.nama,
            kelas: siswa.kelas,
            statusReset: siswa.statusReset,
          },
        });

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }
    }

    // Check in Guru table
    const guru = await db.guru.findUnique({
      where: { nip: identifier },
    });

    if (guru) {
      const isValid = await verifyPassword(password, guru.password);

      if (isValid) {
        const token = generateToken({
          userId: guru.nip,
          role: guru.role,
          name: guru.nama,
          mapel: guru.mapel,
        });

        const response = NextResponse.json({
          success: true,
          message: 'Login berhasil',
          token,
          user: {
            id: guru.nip,
            role: guru.role,
            nama: guru.nama,
            mapel: guru.mapel,
          },
        });

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }
    }

    // Check in Admin table
    const admin = await db.admin.findUnique({
      where: { username: identifier },
    });

    if (admin) {
      const isValid = await verifyPassword(password, admin.password);

      if (isValid) {
        const token = generateToken({
          userId: admin.id,
          role: 'ADMIN',
          name: admin.username,
        });

        const response = NextResponse.json({
          success: true,
          message: 'Login berhasil',
          token,
          user: {
            id: admin.id,
            role: 'ADMIN',
            nama: admin.username,
          },
        });

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }
    }

    return NextResponse.json(
      { success: false, message: 'Identifier atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
