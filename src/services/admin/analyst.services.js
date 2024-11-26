const AdminRepository = require("../../repositories/analyst.repo")

const getTotalDashBoard = async () => {
    const totalCustomer = await AdminRepository.totalCustomer();
    const totalPartner = await AdminRepository.totalPartner();
    const totalVoucher = await AdminRepository.totalVoucher();
    const totalTransaction = await AdminRepository.totalTransaction();

    return {
        totalCustomer,
        totalPartner,
        totalVoucher,
        totalTransaction
    }
}

const getTypeTransactionAnalyst = async () => {
    const data = await AdminRepository.getTypeAnalyst();
    return data;
}

const getStatusTransactionAnalyst = async () => {
    const data = await AdminRepository.getStatusAnalyst();
    return data; 
}

const getThisWeek = async () => {
    const today = new Date();
    const sevenDay = new Date();
    sevenDay.setDate(today.getDate() - 6);

    const data = await AdminRepository.getThisWeek(sevenDay,today);
    return data; 
}

const getThisMonth = async () => {
    const today = new Date();
    const weeksData = [];

    const startOfCurrentWeek = new Date(today)
    startOfCurrentWeek.setDate(today.getDate() - today.getDay())
    startOfCurrentWeek.setHours(0,0,0,0);

    for (let i = 0; i < 4; i++){
        const startOfWeek = new Date(startOfCurrentWeek)
        startOfWeek.setDate(startOfWeek.getDate() - i * 7);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        const data = await AdminRepository.getThisMonth(startOfWeek,endOfWeek);
        weeksData.push({
            date: `${startOfWeek.toISOString().split("T")[0]} - ${endOfWeek.toISOString().split("T")[0]}`,
            transaction: data
        })
    }
    return weeksData;
}

const getCustomerAnalyst = async () => {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0);
    const end = new Date(today);
    end.setHours(23,59,59,999);

    const totalCustomerToday = await AdminRepository.totalCustomerToday(start,end);
    const totalCustomer = await AdminRepository.totalCustomer();
    const totalCustomerActive = await AdminRepository.totalCustomerActive();
    const totalCustomerInactive = await AdminRepository.totalCustomerInactive();
    
    return {
        totalCustomer,
        totalCustomerToday, 
        totalCustomerActive, 
        totalCustomerInactive
    }
}

const getPartnerAnalyst = async () => {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0);
    const end = new Date(today);
    end.setHours(23,59,59,999);

    const totalPartner = await AdminRepository.totalPartner();
    const totalPartnerToday = await AdminRepository.totalPartnerToday(start,end);
    const totalPartnerActive = await AdminRepository.totalPartnerActive();
    const totalPartnerInactive = await AdminRepository.totalPartnerInactive();

    return {
        totalPartner,
        totalPartnerToday,
        totalPartnerActive,
        totalPartnerInactive,
    }
}

const getTransactionAnalyst = async () => {
    const today  = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0); 
    const end = new Date(today);
    end.setHours(23,59,59,999);

    const totalTransactionToday = await AdminRepository.getTransactionToday(start,end);
    const totalTransaction = await AdminRepository.totalTransaction();
    const transactionCompleted = await AdminRepository.transactionCompleted();
    const transactionRate = Math.round((transactionCompleted * 100) / totalTransaction);

    return {
        totalTransactionToday,
        totalTransaction,
        transactionCompleted,
        transactionRate
    }
}

const getTotalMoneyType = async () => {
    const data = await AdminRepository.getTotalMoneyType();
    return data;
}

const getTransaction1D = async (date) => {
    const today = date ? new Date(date) : new Date();
    const start = new Date(today.setHours(0,0,0,0));
    const end = new Date(today.setHours(23,59,59,999))
    
    const data = await AdminRepository.getTransaction1D(start,end);
    return data;
}

const getTransaction1W = async (start,end) => {
    if (start && end) {
        start = new Date(start);
        end = new Date(end);
        end.setHours(23,59,59,999);
    }
    else {
        const today = new Date();
    
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay())
        start.setHours(0,0,0,0);
    
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23,59,59,999);
    }
    
    const data = await AdminRepository.getTransaction1W(start,end)
    return data;
}

const getTransaction1M = async (start, end) => {
    const localTime = (date) => {
        const timeZone = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - timeZone)
    }

    if (start && end) {
        start = localTime(new Date(start));
        end = localTime(new Date(end));
        end.setHours(23, 59, 59, 999); 
    } 

    else {
        const today = new Date();
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);

        start = localTime(start);
        end = localTime(end);
    }

    const data = await AdminRepository.getTransaction1M(start, end);
    return data;
};

module.exports = {
    getTotalDashBoard,
    getTypeTransactionAnalyst,
    getStatusTransactionAnalyst,
    getTransactionAnalyst,
    getThisWeek,
    getThisMonth,
    getCustomerAnalyst,
    getPartnerAnalyst,
    getTotalMoneyType,
    getTransaction1D,
    getTransaction1W,
    getTransaction1M
}