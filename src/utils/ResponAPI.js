// Kelas pembantu untuk format respons API yang seragam di seluruh aplikasi
class ResponAPI {
  static berhasil(res, data = null, message = 'Berhasil', status = 200) {
    const respons = { success: true, status, message };
    if (data !== null) respons.data = data;
    return res.status(status).json(respons);
  }

  static dibuatBerhasil(res, data, message = 'Data berhasil dibuat') {
    return ResponAPI.berhasil(res, data, message, 201);
  }

  // Respons sukses dengan informasi paginasi
  static berhasilDenganPaginasi(res, { data, total, halaman, totalHalaman, batas }, message = 'Berhasil') {
    return res.status(200).json({
      success: true,
      status: 200,
      message,
      data,
      pagination: { total, halaman, totalHalaman, batas },
    });
  }

  static gagal(res, message = 'Terjadi kesalahan pada server', status = 500, errorMessage = null) {
    const respons = { success: false, status, message };
    if (errorMessage) respons.errorMessage = errorMessage;
    return res.status(status).json(respons);
  }

  static permintaanTidakValid(res, message = 'Permintaan tidak valid', errorMessage = null) {
    return ResponAPI.gagal(res, message, 400, errorMessage);
  }

  static tidakTerotorisasi(res, message = 'Tidak terotorisasi') {
    return ResponAPI.gagal(res, message, 401);
  }

  static aksesditolak(res, message = 'Akses ditolak') {
    return ResponAPI.gagal(res, message, 403);
  }

  static tidakDitemukan(res, message = 'Data tidak ditemukan') {
    return ResponAPI.gagal(res, message, 404);
  }

  static konflik(res, message = 'Data sudah ada') {
    return ResponAPI.gagal(res, message, 409);
  }
}

module.exports = ResponAPI;
