import bcrypt from "bcryptjs";
import cloudinary from "../lib/loudinary.js";
import UserModel from "../models/user-model.js";
import { saltAndHashPassword } from "../utils/hash.js";
import ObjectById from "../utils/ObjectById.js";

// ===========================
// SIGNUP
// ===========================
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await saltAndHashPassword(password);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      bio,
    });

    // Password remove
    const { password: _, ...userData } = newUser._doc;

    // Passport login (IMPORTANT)
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        success: true,
        user: ObjectById(userData),
        message: "Account created successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// LOGIN
// ===========================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { password: _, ...userData } = user;

    // Passport login
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        success: true,
        user: ObjectById(userData),
        message: "Login successful",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// LOGOUT
// ===========================
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");

      res.json({
        success: true,
        message: "Logout successful",
      });
    });
  });
};

// ===========================
// CHECK AUTH
// ===========================
export const checkAuth = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  const { password: _, ...userData } = req.user._doc;

  res.json({
    success: true,
    user: ObjectById(userData),
  });
};

// ===========================
// UPDATE PROFILE
// ===========================
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, image, phone, location } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;

    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        folder: "profiles",
      });
      updateData.image = upload.secure_url;
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    })
      .select("-password")
      .lean();

    return res.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
