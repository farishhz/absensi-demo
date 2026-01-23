import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });
  console.log('✅ Admin created:', admin.username);

  // Create Guru
  const guruPassword = await hashPassword('guru123');
  const guru = await prisma.guru.upsert({
    where: { nip: '198001012020121001' },
    update: {},
    create: {
      nip: '198001012020121001',
      nama: 'Budi Santoso',
      password: guruPassword,
      mapel: 'Matematika',
      role: 'GURU',
    },
  });
  console.log('✅ Guru created:', guru.nama);

  // Create TU
  const tuPassword = await hashPassword('tu123');
  const tu = await prisma.guru.upsert({
    where: { nip: '197501012020121002' },
    update: {},
    create: {
      nip: '197501012020121002',
      nama: 'Dewi Sartika',
      password: tuPassword,
      mapel: null,
      role: 'TU',
    },
  });
  console.log('✅ TU created:', tu.nama);

  // Create Siswa
  const siswaPassword = await hashPassword('Smkn8bisa2025');
  const siswaData = [
    { nis: '12345', nama: 'Ahmad Rizky', kelas: 'XII RPL 1' },
    { nis: '12346', nama: 'Budi Santoso', kelas: 'XII RPL 1' },
    { nis: '12347', nama: 'Citra Dewi', kelas: 'XII RPL 2' },
    { nis: '12348', nama: 'Dian Pratama', kelas: 'XI TKJ 1' },
    { nis: '12349', nama: 'Eka Saputra', kelas: 'XI TKJ 1' },
    { nis: '12350', nama: 'Fajar Nugraha', kelas: 'X RPL 1' },
    { nis: '12351', nama: 'Gita Pertiwi', kelas: 'X TKJ 1' },
    { nis: '12352', nama: 'Hendra Wijaya', kelas: 'XII RPL 2' },
    { nis: '12353', nama: 'Indah Larasati', kelas: 'XI RPL 1' },
    { nis: '12354', nama: 'Joko Susilo', kelas: 'X RPL 1' },
  ];

  for (const siswa of siswaData) {
    await prisma.siswa.upsert({
      where: { nis: siswa.nis },
      update: {},
      create: {
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        password: siswaPassword,
        statusReset: false, // Students need to change password on first login
      },
    });
    console.log('✅ Siswa created:', siswa.nama);
  }

  // Create Settings (skip for now - need to fix schema)
  // await prisma.settings.create({ data: { id: crypto.randomUUID(), key: 'jam_masuk', value: '07:00' } });
  console.log('⏭️  Settings skipped (need to fix schema)');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
