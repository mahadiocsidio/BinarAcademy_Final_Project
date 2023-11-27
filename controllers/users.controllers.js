const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { sendEmail, getHtml } = require('../utils/nodemailer');
const otpGenerator = require('otp-generator');

module.exports = {
    register: async (req, res, next) => {
        try {
            let { nama, email, no_telp, password } = req.body;
      
            if (password.length < 8) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Password must be at least 8 characters long!',
                    data: null,
                });
            }
      
            let userExist = await prisma.Account.findUnique({ where: { email } });
            if (userExist) {
              return res.status(400).json({
                status: false,
                message: 'Bad Request',
                err: 'User has already been used!',
                data: null,
              });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            let user = await prisma.Account.create({
                data: {
                    nama,
                    email,
                    no_telp,
                    password: encryptedPassword
                },
            });
      
            // Generate OTP
            let otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

            // Create OTP on database
            let CreateOtp = await prisma.otp.create({
                data: {
                    otp
                }
            })

            // send otp to user email
            let html = await getHtml('otp-email.ejs', {
                otp: otp, 
            });
          
            sendEmail(email, 'OTP Verification', html);
      
            res.status(201).json({
                status: true,
                message: 'Email has been sent',
                err: null,
                data: null,
            });
            
        } catch (err) {
            next(err);
        }
    },
}
