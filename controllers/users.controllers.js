const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('../libs/nodemailer');
const { createUpdateotp } = require('./otp.controllers');

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  // melakukan register
  register: async (req, res, next) => {
    try {
<<<<<<< HEAD
      let { nama, email, no_telp, password, password_confirmation , role } = req.body;
=======
      let { nama, email, no_telp, password,ConfirmationPassword, role } = req.body;
>>>>>>> db3131785f1cad8a6e9d7fa042de364cda8e79cd
      let userExist = await prisma.account.findUnique({ where: { email } });

      if(password != ConfirmationPassword){
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'Password & Password Confirmation must be same!',
          data:null
        });
      }
      //validasi panjang nama maksimal 50 karakter
      if (nama.length > 50) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'Nama harus memiliki maksimal 50 karakter',
          data:null
        });
      }

      //validasi panjang password minimal 8 karakter dan maksimal 15 karakter
      if (password.length < 8 || password.length > 15) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error:'Password harus memiliki minimal 8 karakter dan maksimal 15 karakter',
          data:null
        });
      }

            // validasi password dan password confirmation
            if (password !== password_confirmation) {
              return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Password dan Password Confirmation harus sama!',
              });
            }

      // Validasi format email menggunakan regular expression
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'Format email tidak valid',
          data:null
        });
      }

      //email sudah pernah digunakan
      if (userExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'email sudah dipakai',
          data: null,
        });
      }
      //set token for otp
      let token = jwt.sign({ email }, JWT_SECRET_KEY);

      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.account.create({
        data: {
          nama,
          email,
          no_telp,
          password: encryptedPassword,
          role: 'user'
        },
      });

      //generate otp
      await createUpdateotp(user.account_id, user.nama, user.email, res);

            // Create and send JWT token
            const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);
            // Set the email in response headers
            res.set('userEmail', user.email);
      res.cookie('userToken', token);
      
      // Mengembalikan respon terlebih dahulu
      res.status(201).json({
        status: true,
        message: 'Registrasi berhasil, silakan cek email untuk OTP.',
<<<<<<< HEAD
        filter: {
          nama,
          email,
          password,
          no_telp,
          role,
          token,
        },
=======
        data: {token,user},
>>>>>>> db3131785f1cad8a6e9d7fa042de364cda8e79cd
      });

      //   res.redirect('/verify-otp'); // Redirect to verify otp page
    } catch (err) {
      next(err);
    }
  },

  // verify otp
  verifyOtp: async (req, res, next) => {
    try {
<<<<<<< HEAD
      let { otp } = req.body;
      let token = req.headers.authorization

      if (!token) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: 'Token is missing',
          data: null,
        });
      }

      let decoded = jwt.verify(token, JWT_SECRET_KEY)

      if (!decoded || !decoded.email) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: 'Invalid token format or missing email',
          data: null,
        })
      }

      let userEmail = decoded.email

      if (userEmail !== decoded.email) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: 'Token email does not match the provided email',
          data: null,
        });
      }

      let account = await prisma.Account.findUnique({ where: { email: userEmail } });
      if (!account) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'User not found',
          data: null,
=======
      const { otp } = req.body;
      let token = req.headers.authorization;

      jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: 'Bad Request',
            err: err.message,
            data: null,
          });
        }
        // if (!email || !otp) {
        if (!otp) {
          return res.status(400).json({
            status: false,
            message: 'Bad Request',
            error: 'OTP are required',
            data: null,
          });
        }
        let activationOtp = await prisma.Otp.findFirst({
          where: {
            otp,
          },
        });
        if (!activationOtp) {
          return res.status(400).json({
            status: false,
            message: 'Bad Request',
            err: 'Invalid Activation Code or Code Expired',
            data: null,
          });
        }
        await prisma.otp.update({
          where: {
            account_id: activationOtp.account_id,
          },
          data: {
            otp: null,
          },
>>>>>>> db3131785f1cad8a6e9d7fa042de364cda8e79cd
        });
        let { is_verified } = await prisma.account.update({
          where: {
            email: decoded.email,
          },
          data: {
            is_verified: true,
          },
        });
        return res.status(200).json({
          status: true,
          message: 'Activation Code verified successfully',
          err: null,
          data: { email:decoded.email, otp, is_verified },
        });

<<<<<<< HEAD
      await prisma.otp.update({
        where: {
          account_id: account.account_id,
        },
        data: {
          otp: null,
        },
      });
      
      let { is_verified } = await prisma.account.update({
        where: {
          email: userEmail,
        },
        data: {
          is_verified: true,
        },
      });      

      return res.status(200).json({
        status: true,
        message: 'Activation Code verified successfully',
        err: null,
        data: { userEmail, otp, is_verified },
      });
=======
      })

      // let account = await prisma.Account.findUnique({ where: { email } });
      // if (!account) {
      //   return res.status(404).json({
      //     status: false,
      //     message: 'Not Found',
      //     err: 'User not found',
      //     data: null,
      //   });
      // }
>>>>>>> db3131785f1cad8a6e9d7fa042de364cda8e79cd

      //   res.redirect('/user/login'); // Redirect to login page
    } catch (err) {
      next(err);
    }
  },

  // resend otp
  resendOtp: async (req, res, next) => {
    try {
      const userEmail = req.headers.authorization;

      if (!userEmail) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'User email not provided in headers',
          data: null,
        });
      }

      const decoded = jwt.verify(userEmail, JWT_SECRET_KEY);

      if (!decoded || !decoded.email) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          err: 'Invalid token format or missing email',
          data: null,
        });
      }

      const decodEmail = decoded.email

      const user = await prisma.account.findUnique({ where: { email: decodEmail } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          err: 'User not found',
          data: null,
        });
      }

      // Mengambil nilai OTP dari database
      const existingOTP = await prisma.otp.findUnique({
        where: { account_id: user.account_id },
      });

      if (!existingOTP) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'OTP not found for the user',
          data: null,
        });
      }

      // Memperbarui nilai OTP dalam model
      const updateOtp = existingOTP.otp;

      // create or update OTP in the Otp table
      await prisma.otp.upsert({
        where: { account_id: user.account_id },
        create: {
          account_id: user.account_id,
          otp: updateOtp,
          created_at: new Date(),
        },
        update: {
          otp: updateOtp,
          created_at: new Date(),
        },
      });

      // send otp
      await createUpdateotp(user.account_id, user.nama, user.email, res);

      return res.status(200).json({
        status: true,
        message: 'OTP resent successfully',
        err: null,
        data: { decodEmail },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password, is_verified } = req.body;
      const user = await prisma.account.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'Invalid Email or Password',
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'Invalid Email or Password',
        });
      }

      const userVerified = await prisma.account.findUnique({
        where: { email, is_verified: true },
      });

      if (!userVerified) {
        // console.log('lakukan verifikasi terlebih dahulu');
        //generate otp
        createUpdateotp(user.account_id, user.nama, user.email, res);
        return res.status(400).json({
          status: false,
          err: 'lakukan verifikasi terlebih dahulu',
          message: 'harap periksa email anda untuk mendapat otp',
          data: { email: user.email, is_verified: user.is_verified },
        });
      } else {
        const token = jwt.sign(
          { id: user.account_id, email: user.email },
          JWT_SECRET_KEY
        );

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30 * 1000,
        });

        // bisa redirect kalau sudah login ke sini
        //res.redirect(`/home);
        return res.status(200).json({
          status: true,
          message: 'Berhasil login',
          data: user,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      let { email } = req.body;
      let emailExist = await prisma.account.findUnique({
        where: { email },
      });
      if (!emailExist) {
        return res.status(400).json({
          status: false,
          message: 'Email Not Found',
          err: 'Enter Regisreted Email!',
          data: null,
        });
      }

      let token = jwt.sign({ email: emailExist.email }, JWT_SECRET_KEY);
      var location = req.headers.origin; //get HOST & PORT

      // let url = `${location}/auth/reset-password?token=${token}`; //send token in link to get user
      let url = `<p>Hi ${email}, ini adalah token Anda: <strong>${token}</strong></p>`; //send token in link to get user
      console.log('url reset pass : ', url);
      // const html = await nodemailer.getHtml('reset-password-valid.ejs', {
      //   email,
      //   url,
      // });

      nodemailer.sendEmail(email, 'Reset Password', url);
      return res.status(200).json({
        status: true,
        message: 'Send',
        err: null,
        data: { email },
      });
    } catch (err) {
      next(err);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      let { password, confirmationPassword } = req.body;
      let token = req.headers.authorization;
      console.log(token);
      if (password != confirmationPassword) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'please ensure that the password and password confirmation match!',
          data: null,
        });
      }

      jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: 'Bad Request',
            err: err.message,
            data: null,
          });
        }
        let encryptedPassword = await bcrypt.hash(password, 10);
        let updated = await prisma.account.update({
          where: { email: decoded.email },
          data: { password: encryptedPassword },
        });

        res.json({
          status: true,
          message: 'success',
          err: null,
          data: updated,
        });
      });
    } catch (err) {
      next(err);
    }
  },
  whoami: (req, res, next) => {
    return res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: { user: req.user },
    });
  },
};
