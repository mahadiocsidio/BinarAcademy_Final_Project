const prisma = require('../libs/prisma')

const getUserbyId = async(req,res,next)=>{
    try {
        const {account_id} = req.account.account_id
        let account = await prisma.account.findUnique({
            where:{
                account_id: account_id
            }
        })
        if(!account) return res.json("Account isnt registered")

        res.status(200).json({
        success:true,
        data:account
        })
    } catch (error) {
        next(error)
    }
}

const updateProfile = async(req,res)=>{
    try {
        let {account_id} = req.body
        let {name,email,no_telp,negara,kota } = req.body
        let account = await prisma.account.update({
            where:{
                account_id: account_id
            },
            data:{
                name,
                email,no_telp,
                negara,
                kota
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

const resetPassword = async (req,res,next)=>{
    try {
        let {account_id, password_lama,password_baru} = req.body
        //mencari account di database
        let isExist = await prisma.account.findUnique({
            where:{
                account_id: account_id
            }
        })
        //cek apakah password_lama sesuai dengan password dengan password di database
        let isPasswordCorrect = await bcrypt.compare(password_lama, isExist.password);

        if(!isPasswordCorrect) return res.json("Password isn't match")

        let hashedPassword = await bcrypt.hash(password_baru, 10)

        let updatedAccount = await prisma.account.update({
            where:{
                account_id: account_id
            },
            data:{
                password: hashedPassword
            }
        })
        res.status(200).json({
        success:true,
        data:updatedAccount
        })
    } catch (error) {
        next(error)
    }

}

const getRiwayatPembayaran = async (req,res,next)=>{
    try {
        let {account_id} = req.body
        let riwayat = await prisma.riwayat_transaksi.findMany({
            where:{
                account_id: account_id
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

module.exports = {getUserbyId,updateProfile,resetPassword,getRiwayatPembayaran,logout}