const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { formatTanggalIndonesia, formatWaktu } = require('./bantuanWaktu');

const LABEL_STATUS = { hadir: 'Hadir', izin: 'Izin', sakit: 'Sakit', alpa: 'Alpa' };

// Ekspor data rekap absensi ke format Excel (.xlsx)
async function eksporKeExcel(daftarAbsensi, res, namaFile = 'rekap-absensi') {
  const bukuKerja = new ExcelJS.Workbook();
  const lembar = bukuKerja.addWorksheet('Rekap Absensi');

  lembar.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'ID Pegawai', key: 'idPegawai', width: 15 },
    { header: 'Nama', key: 'nama', width: 25 },
    { header: 'Departemen', key: 'departemen', width: 20 },
    { header: 'Tanggal', key: 'tanggal', width: 15 },
    { header: 'Waktu Masuk', key: 'waktuMasuk', width: 14 },
    { header: 'Waktu Keluar', key: 'waktuKeluar', width: 14 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Keterangan', key: 'catatan', width: 30 },
  ];

  // Styling baris header
  lembar.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  lembar.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };

  daftarAbsensi.forEach((absen, indeks) => {
    lembar.addRow({
      no: indeks + 1,
      idPegawai: absen.pengguna?.idPegawai || '-',
      nama: absen.pengguna?.nama || '-',
      departemen: absen.pengguna?.departemen || '-',
      tanggal: absen.tanggal,
      waktuMasuk: absen.waktuMasuk ? formatWaktu(absen.waktuMasuk) : '-',
      waktuKeluar: absen.waktuKeluar ? formatWaktu(absen.waktuKeluar) : '-',
      status: LABEL_STATUS[absen.status] || absen.status,
      catatan: absen.catatan || '-',
    });
  });

  // Gunakan writeBuffer() bukan write(stream) agar tidak ada konflik double-end
  // dan Postman bisa langsung membaca file binary dengan benar
  const buffer = await bukuKerja.xlsx.writeBuffer();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${namaFile}.xlsx"`);
  res.setHeader('Content-Length', buffer.length);
  return res.end(buffer);
}

// Ekspor data rekap absensi ke format PDF
function eksporKePDF(daftarAbsensi, res, namaFile = 'rekap-absensi', judul = 'Rekap Absensi') {
  const dok = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${namaFile}.pdf"`);
  dok.pipe(res);

  // Judul dan tanggal cetak
  dok.fontSize(16).font('Helvetica-Bold').text(judul, { align: 'center' });
  dok.fontSize(10).font('Helvetica').text(`Dicetak: ${formatTanggalIndonesia(new Date())}`, { align: 'center' });
  dok.moveDown();

  // Header tabel
  const lebarKolom = [30, 70, 150, 100, 70, 70, 70, 60, 100];
  const headerKolom = ['No', 'ID Pegawai', 'Nama', 'Departemen', 'Tanggal', 'Masuk', 'Keluar', 'Status', 'Keterangan'];
  let posX = dok.page.margins.left;
  const posY = dok.y;

  dok.font('Helvetica-Bold').fontSize(9);
  headerKolom.forEach((judul, i) => {
    dok.text(judul, posX, posY, { width: lebarKolom[i], align: 'left' });
    posX += lebarKolom[i];
  });
  dok.moveDown(0.5);
  dok.moveTo(dok.page.margins.left, dok.y).lineTo(dok.page.width - dok.page.margins.right, dok.y).stroke();
  dok.moveDown(0.3);

  // Baris data tabel
  dok.font('Helvetica').fontSize(8);
  daftarAbsensi.forEach((absen, indeks) => {
    posX = dok.page.margins.left;
    const y = dok.y;
    const barisData = [
      String(indeks + 1),
      absen.pengguna?.idPegawai || '-',
      absen.pengguna?.nama || '-',
      absen.pengguna?.departemen || '-',
      absen.tanggal,
      absen.waktuMasuk ? formatWaktu(absen.waktuMasuk) : '-',
      absen.waktuKeluar ? formatWaktu(absen.waktuKeluar) : '-',
      LABEL_STATUS[absen.status] || absen.status,
      absen.catatan || '-',
    ];
    barisData.forEach((sel, i) => {
      dok.text(sel, posX, y, { width: lebarKolom[i], align: 'left' });
      posX += lebarKolom[i];
    });
    dok.moveDown(0.5);
  });

  dok.end();
}

module.exports = { eksporKeExcel, eksporKePDF };
