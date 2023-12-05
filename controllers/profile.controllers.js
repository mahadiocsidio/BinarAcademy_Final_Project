const prisma = require('../libs/prisma')

const getAllAccountProfile = async(req,res,next)=>{
    try {
        let account = await prisma.account.findMany({
            select:{
                account_id: true,
                nama: true,
                email: true,
                role: true,
                created_at:true
            }
        })
        res.status(200).json({
            success:true,
            data:account
        })
    } catch (error) {
        next(error)
    }

}

const getAccountbyId = async(req,res,next)=>{
    try {
        let account = req.user
        let getAccount = await prisma.account.findUnique({ 
            where: {
                account_id:account.account_id
            },
            select:{
                account_id: true,
                nama: true,
                email: true,
                no_telp: true,
                negara: true,
                kota: true,
                url_image:true
            }
        })
        if(!account) return res.json("Account isnt registered")

        res.status(200).json({
        success:true,
        data:getAccount
        })
    } catch (error) {
        next(error)
    }
}

const updateProfile = async(req,res)=>{
    try {
        let account= req.user
        let {name,email,no_telp,negara,kota } = req.body
        let updateAccount = await prisma.account.update({
            where:{
                account_id: account.account_id
            },
            data:{
                name,
                email,
                no_telp,
                negara,
                kota
            }
        })
        res.status(200).json({
            success:true,
            data:updateAccount
        })
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req,res,next)=>{
    try {
        let account = req.user
        let {password_lama,password_baru,ulangi_password} = req.body
        //mencari account di database
        let isExist = await prisma.account.findUnique({
            where:{
                account_id: account.account_id
            }
        })

        if(!isExist) return res.status(404).json("Account isnt registered")
        //cek apakah password baru dan ulangi password sinkron
        if(password_baru!= ulangi_password) return res.status(400).json("New Password and Confirm Password didnt match")

        //cek apakah password_lama sesuai dengan password dengan password di database
        let isPasswordCorrect = await bcrypt.compare(password_lama, isExist.password);

        if(!isPasswordCorrect) return res.json("Password isn't match")


        let hashedPassword = await bcrypt.hash(password_baru, 10)

        let updatedAccount = await prisma.account.update({
            where:{
                account_id: account.account_id
            },
            data:{
                password: hashedPassword
            }
        })
        res.status(200).json({
            success:true,
            message:`Successfully changed your password`,
        })
    } catch (error) {
        next(error)
    }
}

const getRiwayatPembayaran = async (req,res,next)=>{
    try {
        let account = req.user
        let riwayat = await prisma.riwayat_transaksi.findMany({
            where:{
                account_id: account.account_id
            },include:{
                course:true
            }
        })
        res.status(200).json({
            success:true,
            data:riwayat
        })
    } catch (error) {
        next(error)
    }
}

const logout = async(req,res,next)=>{
    try {
        res.json({ message: 'Logout successful' });
    } catch (error) {
        next(error)
    }
}

module.exports = {getAllAccountProfile,getAccountbyId,updateProfile,changePassword,getRiwayatPembayaran,logout}