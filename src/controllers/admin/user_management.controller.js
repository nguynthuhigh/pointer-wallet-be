const {Response} = require('../../utils/response')
const userServices = require('../../services/user.services')
const userManagementServices = require('../../services/admin/user_management.services')
const catchError = require('../../middlewares/catchError.middleware')
const {unSelectData, cleanData} = require('../../utils')
module.exports = {
    getUsers:catchError(async(req,res)=>{
        const { page = 1, page_limit = 10, active, sort = 'desc', start, end } = req.query;
        const filter = {
            inactive: active === 'true' ? true : false,
            createdAt: !start || !end ? undefined : {$gte: new Date(start), $lt: new Date(end)}
        }
        const data = await userManagementServices.getUsers(
            sort === 'desc' ? -1 : 1,
            page,
            page_limit,
            cleanData(filter),
            unSelectData(['password','security_code'])
        )
        return Response(res,"Success",data,200)
    }),
    banUser: catchError(async(req,res)=>{
        const {id} = req.body
        const data = await userManagementServices.banUser(id)
        if(data.inactive === true){
            return Response(res,"User successfully banned",null,200)
        }else{
            return Response(res,"User successfully unbanned",null,200)
        }
    }),
    getUserDetails: catchError(async(req,res)=>{
        const {id,page = 1,page_limit = 10, sort = 'desc', type, status, start, end} = req.query
        const filter = {
            type,status,
            createdAt: !start || !end ? undefined : {$gte: new Date(start), $lt: new Date(end)}
        }
        const data = await userManagementServices.getUserTransactions(
            id, page, page_limit, cleanData(filter), sort === 'asc' ? 1 : -1,
        )
        const user = await userManagementServices.getUserDetails(id,unSelectData(['password','security_code']))
        return Response(res,"Success",{user:user,transactions:data},200)
    }),
    //user
    getUser: catchError(async (req,res)=>{
        const email = req.query.email
        const data = await userServices.getUserByEmail(email);
        return Response(res,"Success",data,200)
    })
}