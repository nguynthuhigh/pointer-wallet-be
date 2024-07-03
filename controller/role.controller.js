const { User } = require('../models/user.model');

const Role = require('../utils/role')

module.exports = {
    putRoleAdmin: async (req, res) => {
        setRole(req, res, Role.ADMIN);
    },
    putRoleMarketing: async (req, res) => {
        setRole(req, res, Role.MARKETING);
    },
    putRoleFinance: async (req, res) => {
        setRole(req, res, Role.FINANCE);
    },
    putRoleSupport: async (req, res) => {
        setRole(req, res, Role.SUPPORT);
    },
    getList: async(req,res)=>{
        res.json("list")
    }
};

const setRole = async(req,res,role)=>{
    try {
        const {_id} = req.body;
        const update = { role: role };
        const result = await User.findByIdAndUpdate({ _id }, update);
        res.status(200).json({ result });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}
