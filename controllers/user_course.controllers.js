const prisma = require('../libs/prisma')
const { getPagination } = require('../helper/index');


module.exports ={
    getAllUserCourse: async(req,res,next)=>{
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let userCourse = await prisma.user_course.findMany({
                skip: (page - 1) * limit,
                take: limit,
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

            const { _count } = await prisma.user_course.aggregate({
                _count: { account_id: true },
            });
            
            let pagination = getPagination(req, _count.account_id, page, limit);

            if(!userCourse) return res.json("User Course isnt registered")

            res.status(200).json({
                success:true,
                data:{pagination, userCourse}
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
                                where:{
                                    account_id: account.account_id
                                },
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

    createUserCourse: async (req,res,next)=>{
        try {
            let {course_id,account_id} = req.body
            course_id = parseInt(course_id,10)
            let course = await prisma.course.findUnique({where:{course_id}})
            if(!course) return res.status(404).json("Course isnt registered")

            let userCourse = await prisma.user_course.create({
                data:{
                    account_id,
                    course_id,
                }
            })

            res.status(200).json({
                success:true,
                data:userCourse
            })
        } catch (error) {
            next(error)
        }
    },

    getUserCoursebyAccountId: async(req,res,next)=>{
        try {
            let {account_id} = req.params
            account_id = parseInt(account_id,10)
            let userCourse = await prisma.user_course.findMany({
                where:{
                    account_id: account_id
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
}