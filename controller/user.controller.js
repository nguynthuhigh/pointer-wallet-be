const {User} = require('../models/user.model')

module.exports = {
    getUsers:(req,res)=>{
        User.find() 
        .then(data => {
            res.status(200).json(data); 
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
    },
    banUser:(req,res)=>{
        User.findByIdAndUpdate(req.body._id,{inactive:true}).then(data => {
            res.status(200).json({message:"Success",data}); 
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
    },
    unbanUser:(req,res)=>{
        User.findByIdAndUpdate(req.body._id,{inactive:false}).then(data => {
            res.status(200).json({message:"Success",data}); 
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
    },
    //user
    updateProfile: async(req,res)=>{
        try {
            const id = req.user
            await User.findByIdAndUpdate(id,req.body,{new:true}).then(result =>{
                res.status(200).json({message:"Cập nhật thông tin thành công",data:result})
            })
        } catch (error) {
            res.status(400).json({error:error,message:"Cập nhật thông tin thất bại"})
        }
    },
    Profile: async (req,res)=>{
        const id = req.user
        const userFind = await User.findById(id)
        res.status(200).json(userFind)
    }
}