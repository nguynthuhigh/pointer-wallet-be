const {User} = require('../../models/user.model')
const {Response} = require('../../utils/response')
const userServices = require('../../services/user.services')
const {getRedisClient} = require('../../configs/redis/redis')
const cloudinary = require('../../configs/cloudinary/cloudinary')
module.exports = {
    getUsers:(req,res)=>{
        const token = req.query.token
        if(token === process.env.TOKEN_API){
            User.find() 
            .then(data => {
                res.status(200).json(data); 
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })
        }
        else{
            res.status(500).json({ msg:"?" });
        }
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
            cloudinary.uploader.upload(req.file.path,async(result,err)=>{
                if(err){
                  console.log(err)
                  return Response(res,"Cập nhật ảnh thất bại",null,200)
                }
                const data={
                    full_name:req.full_name,
                    avatar:result.url
                }
                console.log(data)
                await User.updateOne({_id:id},data,{new:true})
                Response(res,"Cập nhật thông tin thành công",null,400)
            })
        } catch (error) {
            console.log(error)
            Response(res,"Cập nhật thông tin thất bại vui lòng thử lại",null,500) 
        }
    },
    Profile: async (req,res)=>{
        const redis = getRedisClient();
        try{
            const id = req.user
            const user = req.user_info
            const userKey = `user:${id}`
            const userData = await redis.hgetall(userKey)
            if (Object.keys(userData).length === 0) {
                const wallet = await userServices.getProfile(id)
                const data = {
                    userData: user,
                    walletData:wallet
                }
                await redis.hset(userKey, {
                    userData: JSON.stringify(user),
                    walletData: JSON.stringify(wallet),
                });
                await redis.expire(userKey, 600);
                return Response(res,"Success",data,200)
            } 
            if (userData) {
                const userInfo = JSON.parse(userData.userData)
                const walletInfo = JSON.parse(userData.walletData)
                const data = { userData: userInfo, walletData: walletInfo }
                return Response(res, 'Success', data, 200)
              }
            return Response(res,"Success",userData,200)
        }
        catch (error){
            console.log(error)
            return Response(res,error,'',200)

        }
    },
    // Profile: async (req,res)=>{
    //     try{
    //         const id = req.user
    //         const user = req.user_info
    //         const wallet = await userServices.getProfile(id);
    //         const data = {
    //             userData: user,
    //             walletData:wallet
    //         }
    //         return Response(res,"Success",data,200)
    //     }
    //     catch (error){
    //         console.log(error)
    //         return Response(res,error,'',200)

    //     }
    // },
    getUser: async (req,res)=>{
        try{
            const email = req.query.email
            const data = await userServices.getUserByEmail(email);
            if (!data) {
                return Response(res, "User not found", null, 404);
            }
            return Response(res,"Success",data,200)
        }
        catch (error){
            console.log(error)
            return Response(res,error,'',200)

        }
    }
}