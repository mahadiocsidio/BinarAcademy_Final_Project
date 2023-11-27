const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('../libs/nodemailer');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    createUpdateotp: async (account_id, nama, email, res) => { // Menambahkan respon sebagai argumen
        try {
            //generate otp
            const otpValue = generateNumericOTP(6);
            let existingOTP = null; // Deklarasi existingOTP

            existingOTP = await prisma.otp.findUnique({
                where: {
                    account_id: account_id // Cari entri OTP berdasarkan account_id
                }
            });

            if (existingOTP) {
                // Jika entri OTP sudah ada, lakukan pembaruan
                await prisma.otp.update({
                    where: {
                        account_id: account_id
                    },
                    data: {
                        otp: otpValue // Update nilai OTP yang baru
                    }
                });
            } else {
                // Jika entri OTP belum ada, buat entri baru
                existingOTP = await prisma.otp.create({
                    data: {
                        otp: otpValue,
                        account: {
                            connect: {
                                account_id: account_id // Hubungkan dengan account yang baru saja dibuat
                            }
                        }
                    }
                });
            }

            //menghapus otp setelah 60 detik dan belum diverifikasi
            setTimeout(async () => {
                try {
                    //mencari otp yang sesuai dengan id account dan belum diverifikasi
                    const otpEntry = await prisma.account.findUnique({
                        where: {
                            account_id: account_id,
                            is_verified: false
                        }
                    });

                    if (otpEntry) {
                        //hapus otp jika ditemukan
                        await prisma.otp.update({
                            where: {
                                account_id: otpEntry.account_id
                            },
                            data: {
                                otp: null
                            }
                        });

                        console.log(`OTP entry for account ${account_id} successfully deleted.`);
                    } else {
                        console.log(`No unverified OTP entry found for user ${account_id}.`);
                    }
                } catch (err) {
                    console.error("Error while deleting OTP:", err);
                }
            }, 60000);

              // Kirim OTP ke email pengguna
              const html = `<p>Hi ${nama}, ini adalah OTP Anda: <strong>${otpValue}</strong></p>`;
              await nodemailer.sendEmail(email, 'One-Time Password (OTP)', html);

            // // Mengembalikan existingOTP dalam respons HTTP 200
            // return res.status(200).json({
            //     status: true,
            //     message: 'Proses OTP berhasil',
            //     data: existingOTP
            // });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};

// Memindahkan fungsi generateNumericOTP di luar fungsi createUpdateotp
function generateNumericOTP(length) {
    let otp = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
