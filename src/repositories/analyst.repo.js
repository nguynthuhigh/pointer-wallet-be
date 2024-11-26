const { User } = require("../models/user.model");
const { Partner } = require("../models/partner.model");
const { Voucher } = require("../models/voucher.model");
const { Transaction } = require("../models/transaction.model");

async function totalPartner() {
    const data = await Partner.countDocuments();
    return data;
}

async function totalVoucher() {
    const data = await Voucher.countDocuments();
    return data;
}

async function totalTransaction() {
    const data = await Transaction.countDocuments();
    return data;
}

async function totalCustomer() {
    const data = await User.countDocuments();
    return data;
}

async function totalCustomerActive() {
    const data = await User.countDocuments({inactive: false});
    return data;
}

async function totalPartnerActive() {
    const data = await Partner.countDocuments({inactive: false})
    return data;
}

async function totalPartnerInactive() {
    const data = await Partner.countDocuments({inactive: true});
    return data;
}

async function totalCustomerInactive() {
    const data = await User.countDocuments({inactive: true});
    return data;
}


async function transactionCompleted() {
    const data = await Transaction.countDocuments({status: 'completed'});
    return data;
}

async function totalCustomerToday(start,end) {
    const data = await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {$sum: 1}
            }
        },
        {
            $project: {
                _id:0,
                total: "$total"
            }
        }
    ]);
    return data.length > 0 ? data[0].total : 0
}

async function totalPartnerToday(start,end) {
    const data = await Partner.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }
        },
        {
            $group: {
                _id:null,
                total: {$sum:1}
            }
        }
    ])
    return data;
}
async function getTypeAnalyst() {
    const data = await Transaction.aggregate([
        {
            $match: {
                type: {
                    $nin: ['refund','pay-with-card']
                }
            }
        },
        {
            $group: {
                _id: "$type",
                total: {$sum:1}
            }
        },
        {
            $project: {
                name: "$_id",
                value: "$total",
                _id:0
            }
        }
    ])
    return data; 
}

async function getStatusAnalyst() {
    const data = await Transaction.aggregate([
        {
            $match: {
                status: {
                    $nin : ['refunded']
                }
            }
        },
        {
            $group: {
                _id: "$status",
                total: {$sum: 1}
            }
        },
        {
            $project: {
                name: "$_id",
                value: "$total",
                _id:0
            }
        }
    ])
    return data;
}

async function getThisWeek(sevenDay,today) {
    const data = await Transaction.aggregate([
    {
        $match: {
            createdAt: {
                $gte: sevenDay,
                $lte: today
            }
        }
    },
    {
        $group: {
            _id: {
                $dateToString: {
                    format: '%Y-%m-%d',
                    date: "$createdAt"
                }
            },
            transactions: {$sum:1}
        }
    },
    {
        $sort: {
            _id: -1
        }
    },
    {
        $project: {
            date: "$_id",
            transaction: "$transactions",
            _id:0
        }
    }
    ])
    return data;
}

async function getThisMonth(start,end) {
    const data = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {$sum:1}
            }
        },
        {
            $project: {
                _id:0,
                transaction: "$total"
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]);
    return data.length > 0 ? data[0].transaction : 0
}

async function getTransactionToday(start,end) {
    const data = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: "$createdAt"
                    }
                },
                total: {$sum:1}
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                transaction: "$total"
            }
        }
    ])
    return data.length > 0 ? data[0].transaction : 0
}

async function getTotalMoneyType() {
    const data = await Transaction.aggregate([
        {
            $match: {
                type: {
                    $nin : ['refund','pay-with-card']
                }
            }
        },
        {
            $group: {
                _id: "$type",
                total: {$sum: "$amount"}
            }
        },
        {
            $project: {
                _id: 0,
                type: "$_id",
                value: {
                    $toString: {
                        $round: ['$total',0]
                    }
                }
            }
        }
    ])
    return data;
}

async function getTransaction1D(start,end){
    const data = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }
        },
        {
            $addFields: {
                hour: {
                    $hour: {
                        $add: ["$createdAt", 1000 * 60 * 60 * 7]
                    }
                },
            }
        },
        {
            $bucket: {
                groupBy: "$hour",
                boundaries: [0, 3, 6, 9, 12, 15, 18, 21, 24],
                default: 'Other',
                output: {
                    total: {$sum:1}
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: {
                    $switch: {
                        branches: [
                            {case: {$eq: ["$_id",0]},then: '0h-3h'},
                            {case: {$eq: ["$_id",3]},then: '3h-6h'},
                            {case: {$eq: ["$_id",6]},then: '6h-9h'},
                            {case: {$eq: ["$_id",9]},then: '9h-12h'},
                            {case: {$eq: ["$_id",12]},then: '12h-15h'},
                            {case: {$eq: ["$_id",15]},then: '15h-18h'},
                            {case: {$eq: ["$_id",18]},then: '18h-21h'},
                            {case: {$eq: ["$_id",21]},then: '21h-24h'},
                        ],
                    }
                },
                transactions: "$total",
            }
        }
    ])
    return data;
}

async function getTransaction1W(start,end) {
    const data = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                total: {$sum:1}
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                transaction: "$total"
            }
        }
    ])
    return data;
}

async function getTransaction1M(start,end) {
    const data = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                total: {$sum:1}
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                transactions: "$total"
            }
        }
    ]);
    return data;
}


module.exports = {
    totalCustomer,
    totalCustomerToday,
    totalCustomerActive,
    totalCustomerInactive,
    totalPartnerActive,
    totalPartnerInactive,
    totalCustomerInactive,
    totalPartnerToday,
    totalPartner,
    totalVoucher,
    totalTransaction,
    transactionCompleted,
    getTypeAnalyst,
    getStatusAnalyst,
    getThisWeek,
    getThisMonth,
    getTransactionToday,
    getTotalMoneyType,
    getTransaction1D,
    getTransaction1W,
    getTransaction1M
}
