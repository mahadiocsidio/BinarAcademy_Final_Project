const prisma = require('../libs/prisma')
const { getPagination } = require('../helper/index');

const getAllCourse = async(req,res,next)=>{
    try {
        let {search,category_ids, sort, order} = req.query
        let conditions = {}
        let orderBy = {}

        if (search){
            conditions.title ={
                contains: search,
                mode: 'insensitive',
            }
        }
        if (category_ids){
        const kategoriIds = Array.isArray(category_ids) ? category_ids.map(id => parseInt(id, 10)) : [parseInt(category_ids, 10)];
        conditions.kategori_id = {
            in: kategoriIds.filter(id => !isNaN(id)), // Filter out NaN values
        };
        }
        if(sort && order){
            orderBy = sort && order ? { [sort]: order } : undefined;
        }
        console.log("conditions")
        console.log(conditions)

        let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

        let course = await prisma.course.findMany({
            where:conditions,
            orderBy:orderBy,
            skip: (page - 1) * limit,
            take: limit,
            select:{
                course_id: true,
                title: true,
                kode_kelas:true,
                kategori_id: true,
                premium: true,
                harga: true,
                level:true,
                Kategori:{
                    select:{
                        title: true,
                    },
                },
                Mentor:{
                    select:{
                        name:true
                    }
                }
            }
        })

        const { _count } = await prisma.course.aggregate({
            _count: { course_id: true }
        });

        let pagination = getPagination(req, _count.course_id, page, limit);

        res.status(200).json({
            success:true,
            data:{ pagination, course}
        })
    } catch (error) {
        next(error)
    }

}

const getCoursebyId = async(req,res,next)=>{
    try {
        let {course_id} = req.params
        //mengubah course_id menjadi tipe number/int
        course_id = parseInt(course_id,10)
        let course = await prisma.course.findUnique({ 
            where: {
                course_id
            },
            select:{
                course_id: true,
                title: true,
                kode_kelas:true,
                kategori_id: true,
                premium: true,
                harga: true,
                level:true,
                Kategori:{
                    select:{
                        title: true,
                    },
                },
                Mentor:{
                    select:{
                        name:true
                    }
                }
            }
        })
        if(!course) return res.json("Course isnt registered")

        res.status(200).json({
        success:true,
        data:course
        })
    } catch (error) {
        next(error)
    }
}

const addCourse = async(req,res,next)=>{
    try {
        let {title,deskripsi,kode_kelas,kategori_id,harga,premium,mentor_id,level, course_id} = req.body
        let course = await prisma.course.create({
            data:{
                title,
                mentor_id,
                deskripsi,
                kode_kelas,
                kategori_id,
                harga,
                premium,
                level
            },
            select:{
                course_id: true,
                title: true,
                harga: true,
                level:true,
                premium:true,
                kode_kelas:true,
                Kategori:{
                    select:{
                        title: true,
                },
            }
        }})

        let mentorCourse = await prisma.mentor_course.create({
            data : {
                mentor_id,
                course_id: course.course_id
            }
        })

        res.status(200).json({
            success:true,
            data:{course}
            
        })
    } catch (error) {
        next(error)
    }
}

const deleteCoursebyId = async(req,res,next)=>{
    try {
        let {course_id} = req.params
        course_id = parseInt(course_id,10)
        let course = await prisma.course.delete({
            where:{
                course_id: course_id
            }
        })
        res.status(200).json({
            success:true,
            data:course
        })
    } catch (error) {
        next(error)
    }
}

const beliCourse = async(req,res,next)=>{
    try {
        let {course_id} = req.body
        let account = req.user
        course_id = parseInt(course_id,10)
        let course = await prisma.course.findUnique({where:{course_id}})
        if(!course) return res.status(404).json("Course isnt registered")

        let riwayat = await prisma.riwayat_transaksi.create({
            data:{
                account_id: account.account_id,
                course_id,
                status: "Menunggu Pembayaran"
            }
        })

        let userCourse = await prisma.user_course.create({
            data:{
                account_id: account.account_id,
                course_id
            }
        })
        res.status(200).json({
            success:true,
            data:{riwayat,userCourse}
        })
    } catch (error) {
        next(error)
    }

}

module.exports ={getAllCourse,getCoursebyId,addCourse,deleteCoursebyId,beliCourse}