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
    if (!account) return res.json('Account isnt registered');

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

const getAccountbyLogin = async (req, res, next) => {
  try {
    let account = req.user
    let getAccount = await prisma.account.findUnique({ 
        where: {
            account_id: account.account_id
        },
        select:{
            account_id: true,
            nama: true,
            email: true,
            no_telp: true,
            negara: true,
            kota: true,
            url_image:true
        }
    })
    if(!getAccount) return res.json("Account isnt registered")

    res.status(200).json({
    success:true,
    data:getAccount
    })
} catch (error) {
    next(error)
}
};

const updateProfile = async (req, res, next) => {
  try {
    let { account_id } = req.params;

    account_id = Number(account_id);
    let { name, email, no_telp, negara, kota } = req.body;
    let account = await prisma.account.update({
      where: {
        account_id,
      },
      data: {
        no_telp,
        negara,
        kota,
      },
    });
    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilebyLogin = async (req, res, next) => {
  try {
    let account= req.user
    let {name,email,no_telp,negara,kota } = req.body
    let updateAccount = await prisma.account.update({
        where:{
            account_id: account.account_id
        },
        data:{
            name,
            email,
            no_telp,
            negara,
            kota
        }
    })
    res.status(200).json({
        success:true,
        data:updateAccount
    })
} catch (error) {
    next(error)
}
};

const changePasswordbyLogin = async (req, res, next) => {
  try {
    let account = req.user;
    // let { account_id } = req.params;
    let { password_lama, password_baru, Confirmationpassword_baru } = req.body;

    //mencari account di database
    let isExist = await prisma.account.findUnique({
      where: {
        account_id: account.account_id,
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
  //belum testing
  try {
    let account_id = req.user.account_id;
    let riwayat = await prisma.riwayat_transaksi.findMany({
      where: {
        account_id: account_id,
      },
      select:{
        status:true,
        Course:{
            select:{
                title: true,
                harga: true,
                level: true,
                Kategori:{
                    select:{
                        title: true,
                    }
                }
            }
        }
      },
    });
    res.status(200).json({
      success: true,
      data: riwayat,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  //belum testing
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAccountProfile,
  getAccountbyId,
  getAccountbyLogin,
  updateProfile,
  updateProfilebyLogin,
  changePasswordbyLogin,
  getRiwayatPembayaran,
  logout,
};
