const prisma = require('../libs/prisma')

const getUserbyId = async(req,res,next)=>{
    try {
        const {account_id} = req.body
        const account = await prisma.account.findUnique({
            where:{
                account_id
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
        const {id} = req.params
        const {name,email,no_telp,negara,kota } = req.body
        const account = await prisma.account.update({
            where:{
                account_id:Number(id)
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

module.exports = {getUserbyId,updateProfile}