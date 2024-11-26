const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin } = require("../../models/admin.model");

const createAdmin = async (req, res) => {
  const { email, password, full_name, role } = req.body;
  const existAdmin = await Admin.findOne({ email });
  if (existAdmin) {
    res.status(400).json({
      message: "Email is exist",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({
    full_name: full_name,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwzw_Ti47ovNmMbRwz3HaY7hDhHFeAmER6kw&s",
    email: email,
    password: hashPassword,
    active: true,
    role: role,
  });
  try {
    await admin.save();
    res.status(201).json({
      message: `Create admin successful`,
      data: admin,
    });
  } catch (error) {
    res.status(401).json({
      message: "Create admin fail",
    });
  }
}

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const customerExist = await Admin.findOne({ email });
  if (!customerExist) {
    return res.status(401).json({ message: "Customer not exist" });
  }
  try {
    const isMatch = await bcrypt.compare(password, customerExist.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }
    const accessToken = jwt.sign(
      { data: customerExist },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    res.cookie('accessToken',accessToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV = 'production',
      maxAge: 1000 * 60 * 60,
      sameSite: 'strict'
    })
    return res.status(201).json({ 
      message: "Login successful", 
      accessToken: accessToken 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error Server", error });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.find().select("-password");
    res.status(201).json({
      message: "Get admin successful",
      admin: admin,
    });
  } catch (error) {
    res.status(401).json({
      message: "Get admin fail",
      error,
    });
  }
};
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      res.status(404).json({
        message: "Admin not found",
      });
    }
    res.status(200).json({
      message: "Delete admin successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error delete admin",
      error: error,
    });
  }
};
module.exports = {
  createAdmin,
  loginAdmin,
  getAdmin,
  deleteAdmin,
};
