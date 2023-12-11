const prisma = require('../libs/prisma');
const { getPagination } = require('../helper/index');
let bcrypt = require('bcrypt');

const getAllAccountProfile = async (req, res, next) => {
  try {
    let { limit = 10, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    let account = await prisma.account.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        account_id: true,
        nama: true,
        email: true,
        is_verified: true,
        role: true,
        created_at: true,
      },
    });
    const { _count } = await prisma.account.aggregate({
      _count: { account_id: true },
    });

    let pagination = getPagination(req, _count.account_id, page, limit);

    res.status(200).json({
      success: true,
      data: { pagination, account },
    });
  } catch (error) {
    next(error);
  }
};

const getAccountbyId = async (req, res, next) => {
  try {
    let { account_id } = req.params;
    //mengubah account_id menjadi tipe number/int
    account_id = Number(account_id);

    let account = await prisma.account.findUnique({
      where: { account_id },
      select: {
        account_id: true,
        nama: true,
        email: true,
        is_verified: true,
        no_telp: true,
        negara: true,
        kota: true,
      },
    });
    //validasi akun te registrasi atau tidak
    if (!account) {
      return res.status(400).json({
        status: false,
        message: 'bad request!',
        err: 'Account isnt registered',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'success!',
      data: account,
    });
  } catch (error) {
    next(error.message);
  }
};

const updateProfilebyId = async (req, res, next) => {
  try {
    let { account_id } = req.params;
    let { nama, no_telp, negara, kota } = req.body;
    account_id = Number(account_id);

    let accountExist = await prisma.account.findUnique({
      where: { account_id },
    });

    //validasi akun te ada atau tidak
    if (!accountExist) {
      return res.status(401).json({
        status: false,
        message: 'bad request!',
        err: 'Account Not Found!',
        data: null,
      });
    }

    let account = await prisma.account.update({
      where: {
        account_id,
      },
      data: {
        nama,
        no_telp,
        negara,
        kota,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'account success updated!',
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

const changePasswordbyLogin = async (req, res, next) => {
  try {
    let { account_id } = req.user;
    let { password_lama, password_baru, Confirmationpassword_baru } = req.body;

    //mencari account di database
    let isExist = await prisma.account.findUnique({
      where: {
        account_id,
      },
    });
    //validasi akun
    if (!isExist) {
      return res.status(400).json({
        status: false,
        message: 'bad request',
        error: 'account not found',
        data: null,
      });
    }
    //cek apakah password_lama sesuai dengan password dengan password di database
    let isPasswordCorrect = await bcrypt.compare(
      password_lama,
      isExist.password
    );

    //cek validasi password baru
    if (password_baru != Confirmationpassword_baru) {
      return res.status(400).json({
        status: false,
        message: 'bad request',
        error: 'New Password & Confirmation Password must be same!',
        data: null,
      });
    }

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: 'bad request',
        error: "Password isn't match",
        data: null,
      });
    }

    let hashedPassword = await bcrypt.hash(password_baru, 10);

    let updatedAccount = await prisma.account.update({
      where: {
        account_id: account_id,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({
      success: true,
      message: `Successfully changed your password`,
      data: {
        user: {
          name: updatedAccount.nama,
          email: updatedAccount.email,
          role: updatedAccount.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatPembayaran = async (req, res, next) => {
  try {
    let { limit = 10, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    let { account_id } = req.user;

    let riwayat = await prisma.riwayat_Transaksi.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        account_id,
      },
      select: {
        status: true,
        Course: {
          select: {
            title: true,
            harga: true,
            level: true,
            Kategori: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    const { _count } = await prisma.riwayat_Transaksi.aggregate({
      where: { account_id },
      _count: { account_id: true },
    });

    let pagination = getPagination(req, _count.account_id, page, limit);

    return res.status(200).json({
      status: true,
      message: 'success!',
      err: null,
      data: { pagination, riwayat },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({ 
      status: true,
      message: 'Logout successful',
      err:null,
      data:null 
    });
  } catch (error) {
    next(error);
  }
};

const getAccountbyLogin = async (req, res, next) => {
  try {
    let { account_id } = req.user;

    //mencari account di database
    let isExist = await prisma.account.findUnique({
      where: {
        account_id,
      },
    });
    // err pencarian account di handle oleh restrict

    return res.status(200).json({
      status: true,
      message: 'success!',
      err: null,
      data: { user: isExist },
    });
  } catch (err) {
    next(err.message);
  }
};

const updateProfilebyLogin = async (req, res, next) => {
  try {
    let { account_id } = req.user;
    let { nama, no_telp, negara, kota } = req.body;

    // err pencarian account di handle oleh restrict

    let accountUpdated = await prisma.account.update({
      where: {
        account_id,
      },
      data: {
        nama,
        no_telp,
        negara,
        kota,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'account success updated!',
      data: { user: accountUpdated },
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllAccountProfile,
  getAccountbyId,
  updateProfilebyId,
  logout,
  getRiwayatPembayaran,
  changePasswordbyLogin,
  getAccountbyLogin,
  updateProfilebyLogin,
};
