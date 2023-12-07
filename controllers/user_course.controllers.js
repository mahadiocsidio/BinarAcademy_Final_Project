const prisma = require('../libs/prisma')


module.exports ={
    getAllUserCourse: async(req,res,next)=>{
        try {
            let userCourse = await prisma.user_course.findMany({
                select:{
                    user_course_id: true,
                    account_id: true,
                    course_id: true,
                    Course:{
                        select:{
                            title: true,
                            harga: true,
                            Kategori:{
                                select:{
                                    title: true,
                                }
                            }
                        }
                    }
                }
            })
            if(!userCourse) return res.json("User Course isnt registered")

            res.status(200).json({
                success:true,
                data:userCourse
            })
        } catch (error) {
            next(error)
        }
    },
    getUserCoursebyLogin: async(req,res,next)=>{
        try {
            let account  = req.user

            let userCourse = await prisma.user_course.findMany({
                where:{
                    account_id: account.account_id
                },
                select:{
                    user_course_id: true,
                    account_id: true,
                    course_id: true,
                    Course:{
                        select:{
                            title: true,
                            harga: true,
                            Kategori:{
                                select:{
                                    title: true,
                                }
                            },
                            Riwayat_Transaksi:{
                                select:{
                                    status: true,
                                }
                            }
                        }
                    }
                }
            })
            if(!userCourse) return res.json("User Course isnt registered")

            res.status(200).json({
                success:true,
                data:userCourse
            })
        } catch (error) {
            next(error)
        }
    },
    createUserCourse: (req,res,next)=>{},

    getUserCoursebyAccountId: (req,res,next)=>{},
}