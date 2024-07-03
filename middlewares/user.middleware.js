const {registerSchema} = require("../validates/user.validate")
exports.validateRegister = async (req, res, next) => {
    try {
        await registerSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};