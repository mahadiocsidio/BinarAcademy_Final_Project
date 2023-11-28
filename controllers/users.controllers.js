const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('../libs/nodemailer');
const { createUpdateotp } = require('./otp.controllers');

const { JWT_SECRET_KEY } = process.env;

module.exports = {
    // melakukan register
    register : async (req, res, next) => {
        try {
            let {nama, email, password, password_confirmation, role} = req.body;
            let userExist = await prisma.account.findUnique({where : {email}});

            //validasi panjang nama maksimal 50 karakter
            if (nama.length > 50){
                return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Nama harus memiliki maksimal 50 karakter'
                })
            }

            //validasi panjang password minimal 8 karakter dan maksimal 15 karakter
            if (password.length < 8 || password.length > 15) {
                return res.status(400).json({
                status : false,
                message: 'Bad Request',
                error: 'Password harus memiliki minimal 8 karakter dan maksimal 15 karakter'
                })
            }

            // Validasi format email menggunakan regular expression
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                status : false,
                message: 'Bad Request',
                error: 'Format email tidak valid'
                })
            }
            
            //email sudah pernah digunakan
            if (userExist) {
                return res.status(400).json({
                    status : false,
                    message: 'Bad Request',
                    err: 'email sudah dipakai',
                    data: null
                })
            }

            //memastikan bahwa password dan konfirmasi password yang dimasukkan sama
            if (password != password_confirmation) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Pastikan bahwa kata sandi yang Anda masukkan sama dengan konfirmasi kata sandi!',
                    data: null
                })
            }


            //generate password
            let encryptedPassword = await bcrypt.hash(password, 10);

            let user = await prisma.account.create({
                data: {
                    nama,
                    email,
                    password: encryptedPassword, 
                    role : 'user'
                }
            });

            //generate otp
            createUpdateotp(user.account_id, user.nama, user.email, res);

            
            // Mengembalikan respon terlebih dahulu
            res.status(201).json({
                status: true,
                message: 'Registrasi berhasil, silakan cek email untuk OTP.',
                data: user
            });


        } catch (err) {
            next(err);
        }
    },


    login : async (req, res, next) => {
        try {
            const {email, password, is_verified} = req.body;
            const user = await prisma.account.findUnique({where : {email}});

            if (!user) {
                return res.status(400).json({
                  status: false,
                  message: "Bad Request",
                  error: "Invalid Email or Password",
                });
              }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if (!isPasswordCorrect) {
                return res.status(400).json({
                  status: false,
                  message: "Bad Request",
                  error: "Invalid Email or Password",
                });
              }

            const userVerified = await prisma.account.findUnique({where : {email, is_verified : true}});

            if (!userVerified) {
                console.log('lakukan verifikasi terlebih dahulu');
                //generate otp
                createUpdateotp(user.account_id, user.nama, user.email, res);
            } else {
            
            const token = jwt.sign({id: user.account_id, email : user.email}, JWT_SECRET_KEY);

            res.cookie('token', token,{
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30 * 1000,
            });
            
            // bisa redirect kalau sudah login ke sini 
            //res.redirect(`/home);
              return res.status(200).json({
                status: true,
                message: 'Berhasil login',
                data: user
            });
            }

        }catch(err) {
            next(err)
        }
    }
}