const prisma = require('../libs/prisma')

const getAllCourse = async(req,res,next)=>{
    try {
        let course = await prisma.course.findMany({
            select:{
                course_id: true,
                title: true,
                kategori_id: true,
                harga: true,
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

const getCoursebyId = async(req,res,next)=>{
    try {
        let {course_id} = req.params
        //mengubah course_id menjadi tipe number/int
        course_id = parseInt(course_id,10)
        let course = await prisma.course.findUnique({ where: {course_id},select:{
            course_id: true,
            title: true,
            kategori_id: true,
            harga: true,
            Kategori:{
                select:{
                    title: true,
            },
        }}})
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
        let {title,deskripsi,kategori_id,harga,premium,mentor_id,level} = req.body
        let course = await prisma.course.create({
            data:{
                title,
                mentor_id,
                deskripsi,
                kategori_id,
                harga,
                premium,
                level
            },
            select:{
                course_id: true,
                title: true,
                harga: true,
                Kategori:{
                    select:{
                        title: true,
                },
            }
        }})
        res.status(200).json({
            success:true,
            data:{course}
        })
    } catch (error) {
        next(error)
    }
}

const getCoursesByCategory = async (req, res, next) => {
    try {
        const { kategori_id , sort, order} = req.query;

        // Menangani beberapa nilai kategori_id
        const kategoriIds = Array.isArray(kategori_id) ? kategori_id.map(id => parseInt(id, 10)) : [parseInt(kategori_id, 10)];

        // Membuat objek yang akan digunakan untuk menyusun kondisi dalam query
        const condition = {};

        const orderBy = sort && order ? { [sort]: order } : undefined;

        // Menambahkan kondisi jika ada nilai kategori_id dalam query parameter
        if (kategoriIds && kategoriIds.length > 0) {
            condition.kategori_id = {
                in: kategoriIds,
            };
        }

        // Menggunakan query Prisma dengan kondisi
        const courses = await prisma.course.findMany({
            where: condition,
            orderBy: orderBy,
            select: {
                course_id: true,
                title: true,
                kategori_id: true,
                harga: true,
                level: true,
                // Jika perlu, tambahkan informasi kategori
                Kategori: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

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

module.exports ={getAllCourse,getCoursebyId,addCourse,getCoursesByCategory,deleteCoursebyId}