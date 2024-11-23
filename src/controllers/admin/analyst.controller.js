const AdminService = require("../../services/admin/analyst.services")
const catchError = require("../../middlewares/catchError.middleware")
const { Response } = require("../../utils/response")

const getTotalDashBoard = catchError(async(req,res) => {
    const data = await AdminService.getTotalDashBoard();
    return Response(res,'Get total dashboard successful',data,200);
})

const getTypeTransactionAnalyst = catchError(async(req,res) => {
    const data = await AdminService.getTypeTransactionAnalyst();
    return Response(res,'Get type transaction analyst successful',data,200)
})

const getStatusTransactionAnalyst = catchError(async(req,res) => {
    const data = await AdminService.getStatusTransactionAnalyst();
    return Response(res,'Get status transaction analyst successful',data,200)
})

const getThisWeek = catchError(async(req,res) => {
    const data = await AdminService.getThisWeek();
    return Response(res,'Get this week successful',data,200)
})

const getThisMonth = catchError(async(req,res) => {
    const data = await AdminService.getThisMonth();
    return Response(res,'Get this month successful',data,200)
})

const getCustomerAnalyst = catchError(async (req,res) => {
    const data = await AdminService.getCustomerAnalyst();
    return Response(res,'Get customer analyst',data,200)
})

const getPartnerAnalyst = catchError(async (req,res) => {
    const data = await AdminService.getPartnerAnalyst();
    return Response(res,'Get partner analyst',data,200)
})

const getTransactionAnalyst = catchError(async (req,res) => {
    const data = await AdminService.getTransactionAnalyst();
    return Response(res,'Get transaction analyst',data,200)
})

const getTotalMoneyType = catchError(async (req,res) => {   
    const data = await AdminService.getTotalMoneyType();
    return Response(res,'Get total money type',data,200)
})

const getTransaction1D = catchError(async (req,res) => {
    const {date} = req.query;
    const data = await AdminService.getTransaction1D(date);
    return Response(res,'Get transaction 1 day successful',data,200)
})

const getTransaction1W = catchError(async (req,res) => {
    const {start,end} = req.query;
    const data = await AdminService.getTransaction1W(start,end);
    return Response(res,'Get transaction 1 week successful',data,200)   
})

const getTransaction1M = catchError(async(req,res) => {
    const {start,end} = req.query
    const data = await AdminService.getTransaction1M(start,end);
    return Response(res,'Get transaction 1 month successful',data,200) 
})

module.exports = {
    getTotalDashBoard,
    getTypeTransactionAnalyst,
    getStatusTransactionAnalyst,
    getThisWeek,
    getThisMonth,
    getCustomerAnalyst,
    getPartnerAnalyst,
    getTransactionAnalyst,
    getTotalMoneyType,
    getTransaction1D,
    getTransaction1W,
    getTransaction1M
}