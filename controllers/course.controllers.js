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
        let {title,deskripsi,kode_kelas,kategori_id,harga,premium,mentor_id,level} = req.body
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
        const { title, kategori_id, sort, order } = req.query;

        // Handle multiple kategori_id values
        const kategoriIds = Array.isArray(kategori_id) ? kategori_id.map(id => parseInt(id, 10)) : [parseInt(kategori_id, 10)];

        // Create an object to be used for conditions in the query
        const condition = {};

        // Add conditions for title if it exists in the query parameters
        if (title) {
            condition.title = {
                contains: title,
                mode: 'insensitive', // Case-insensitive search for title
            };
        }

        // Add conditions for kategori_id if it exists in the query parameters
        if (kategoriIds && kategoriIds.length > 0) {
            condition.kategori_id = {
                in: kategoriIds.filter(id => !isNaN(id)), // Filter out NaN values
            };
        }

        const orderBy = sort && order ? { [sort]: order } : undefined;

        // Use Prisma query with conditions
        const courses = await prisma.course.findMany({
            where: condition,
            orderBy: orderBy,
            select: {
                course_id: true,
                title: true,
                kategori_id: true,
                harga: true,
                level: true,
                // If needed, add category information
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

const getCoursebyTitle = async (req,res,next)=>{
    try {
        let { title } = req.query;

        // Make the title case-insensitive by converting it to lowercase
        title = title.toLowerCase();

        let course = await prisma.course.findFirst({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive', // Case-insensitive search
                },
            },
            select: {
                course_id: true,
                title: true,
                kategori_id: true,
                harga: true,
                Kategori: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
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

module.exports ={getAllCourse,getCoursebyId,addCourse,getCoursesByCategory,getCoursebyTitle,deleteCoursebyId}