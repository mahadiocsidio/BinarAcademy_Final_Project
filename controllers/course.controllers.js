const prisma = require('../libs/prisma')
const { getPagination } = require('../helper/index');
const imagekit = require('../libs/imagekit');
const path = require('path');

const getAllCourse = async (req, res, next) => {
    try {
        let { limit = 10, page = 1, search, category_ids, sort, order="asc", level } = req.query;
        limit = Number(limit);
        page = Number(page);
        
        let conditions = {};
        let orderBy = {};
        
        if (search) {
            conditions.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (category_ids) {
            const kategoriIds = Array.isArray(category_ids) ? category_ids.map(id => parseInt(id, 10)) : [parseInt(category_ids, 10)];
            conditions.kategori_id = {
                in: kategoriIds.filter(id => !isNaN(id)), // Filter out NaN values
            };
        }

        if (level) {
            const levelList = Array.isArray(level) ? level : [level];
            conditions.level = {
                in: levelList,
            };
        }

        if (sort && order) {
            //skip langkah jika ingin mengsorting berdasarkan rating
            if (sort && order && sort.toLowerCase() === 'rating') {
                
            }else{
                orderBy = sort && order ? { [sort]: order } : undefined;
            }
        }
        
        const { _count } = await prisma.course.aggregate({
            where:conditions,
            _count: { course_id: true },
        });

        let course = await prisma.course.findMany({
            where: conditions,
            orderBy: orderBy,
            skip: (page - 1) * limit,
            take: limit,
            select: {
                course_id: true,
                title: true,
                kode_kelas: true,
                kategori_id: true,
                premium: true,
                harga: true,
                level: true,
                Kategori: {
                    select: {
                        title: true,
                    },
                },
                Mentor: {
                    select: {
                        name: true,
                    },
                },
                Rating: {
                    select: {
                        skor: true,
                    },
                },
                Chapter: {
                    select: {
                      _count: {
                        select: {
                          Video: true,
                        },
                      },
                    },
                },
            },
        });

        // Menghitung rata-rata skor secara manual
        course.forEach((c) => {
            const totalSkor = c.Rating.reduce((acc, rating) => acc + rating.skor, 0);
            const avgSkor = c.Rating.length > 0 ? totalSkor / c.Rating.length : 0;
            c.avgRating = avgSkor;

            c.module = c.Chapter.reduce(
                (acc, chapter) => acc + chapter._count.Video,
                0
            );
        });

        // Mengurutkan berdasarkan rating jika diperlukan
        if (sort && order && sort.toLowerCase() === 'rating') {
            if (order.toLowerCase() === 'desc') {
                course.sort((a, b) => b.avgRating - a.avgRating);
            } else if (order.toLowerCase() === 'asc') {
                course.sort((a, b) => a.avgRating - b.avgRating);
            }
        }

        let pagination = getPagination(req, _count.course_id, page, limit);

        course.forEach(object=>{
            delete object['Rating']
            delete object['Chapter']
        })

        res.status(200).json({
            success: true,
            data: { pagination, course },
        });
    } catch (error) {
        next(error);
    }
};

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
                deskripsi:true,
                kode_kelas:true,
                url_gc_tele:true,
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
                },
                Chapter:{
                    select:{
                        title:true,
                        Video:true
                    }
                }
            }
        })
        if(!course) return res.json("Course isnt registered")
        // Mengambil informasi rating dari tabel Rating
        let ratings = await prisma.rating.findMany({
            where: {
                course_id,
            },
            select: {
                skor: true,
            },
        });

        // Menghitung rata-rata skor secara manual
        const totalSkor = ratings.reduce((acc, rating) => acc + rating.skor, 0);
        const avgSkor = ratings.length > 0 ? totalSkor / ratings.length : 0;

        // Menambahkan informasi rating ke objek course
        course.avgRating = avgSkor;

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
        let { title, deskripsi, kode_kelas, harga, premium, level, name, kategori_id, category_title, mentor_id } = req.body;
        harga = Number(harga);
        premium = premium === "true";
        kategori_id = Number(kategori_id);
        mentor_id = Number(mentor_id);

        if (req.file) {
            // Jika ada file yang di-upload
            let strFile = req.file.buffer.toString('base64');
            let uploadedFile = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            });
            url = uploadedFile.url; // Ambil URL gambar yang di-upload
        } else  {
            // Jika tidak ada file yang di-upload tetapi ada url_img_preview dalam permintaan
            url = null; 
        }

        let course = await prisma.course.create({
            data: {
                title,
                deskripsi,
                kode_kelas,
                url_image_preview: url, // URL gambar preview jika ada
                harga,
                premium,
                level,
                kategori_id,
                mentor_id
            },
            select: {
                course_id: true,
                title: true,
                harga: true,
                level: true,
                premium: true,
                kode_kelas: true,
                url_image_preview: true,
                Mentor: {
                    select: {
                        name: true 
                    }
                },
                Kategori: {
                    select: {
                        title: true 
                    }
                }
            }
        });

        let mentorCourse = await prisma.mentor_course.create({
            data : {
                mentor_id:1,
                course_id: course.course_id
            }
        })

        res.status(200).json({
            success:true,
            data:{course, mentorCourse}
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
        let account = req.user;
        let { course_id , metode_pembayaran=""} = req.body;

        let course = await prisma.course.findUnique({
            where: {
                course_id,
            },
        });

        if (!course) return res.json('Course is not registered');

        let payment = await prisma.riwayat_Transaksi.create({
            data: {
                account_id: account.account_id,
                course_id,
                tanggal_pembayaran: new Date(Date.now()),
                metode_pembayaran,
                status: 'Menunggu Pembayaran',
            },
        });

        // Menambahkan entri di tabel User_course
        let userCourse = await prisma.user_course.create({
            data: {
                account_id: account.account_id,
                course_id,
            },
        });

        res.status(200).json({
            success: true,
            data: { payment, userCourse },
        });
    } catch (error) {
        next(error);
    }

}

module.exports ={getAllCourse,getCoursebyId,addCourse,deleteCoursebyId,beliCourse}