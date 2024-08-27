const Admin = require("../models/AdminSchema");
const User = require("../models/usersSchema");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/admins/"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    const currentDateTime = Date().now;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    const uniqueFilename = `${uniqueSuffix}_${currentDateTime}.${extension}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

// Add admin controller
const addAdmin = async (req, res) => {
  try {
    const { password, email, name, mobileno } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).send("Admin already exists");
    }

    if (!password) {
      return res.status(400).send("Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      password: hashedPassword,
      email,
      name,
      mobileno,
      image: req.file.filename, // Save the filename of the uploaded image
    });

    const savedAdmin = await newAdmin.save();

    res.status(201).send(savedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to add admin");
  }
};

const updateAdminProfile = async (req, res) => {
  const { name, email, mobileno } = req.body;
  const adminId = req.params.adminId;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      res.status(500).send({ message: "no admins found" });
    }

    const updatedUser = await Admin.findByIdAndUpdate(
      adminId,
      { name, email, mobileno },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
      q;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateprofilepic = async (req, res) => {
  try {
    const userId = req.params.adminId;
    const image = req.file.filename;

    const admin = await Admin.findById(userId);

    if (!admin) {
      res.status(500).send({ message: "no admins found" });
    }

    const previmage = admin.image;

    const updatedUser = await Admin.findByIdAndUpdate(
      userId,
      { image: image },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId, "userId"); // Assuming you have authentication middleware to set the user ID in req.user
    let user = await User.findById(userId).select("-password");

    if (!user) {
      const admin = await Admin.findById(userId).select("-password");

      if (!admin) {
        return res.status(404).send("User not found");
      }

      return res.status(200).send(admin);
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get user profile");
  }
};

const resetpass = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword, currentpassword } = req.body;
  console.log(req.body, "body");

  try {
    const user = await Admin.findById(id);
    if (!user) {
      return res.status(500).send("Invalid user ID");
    }
    if (password.includes(" ")) {
      return res
        .status(500)
        .json({ message: "Password should not have spaces." });
    }
    if (user.password !== currentpassword) {
      return res.status(500).send("Incorrect current password");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken)
    if (decodedToken.id !== user.id) {
      return res.status(500).send("Invalid token");
    }

    user.password = password;
    await user.save();

    res.send("Password reset successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
module.exports = {
  updateAdminProfile,
  updateprofilepic,
  addAdmin,
  getProfile,
  upload,
  resetpass,
};
