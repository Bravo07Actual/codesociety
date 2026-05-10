import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
dotenv.config();

// test route
router.get("/test", (req, res) => {
  res.send("ok");
});

// Register route
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Basic Validation
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(400)
        .json({ error: "All fields are required", status: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists", status: false });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "user"
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error in login route: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Basic Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required", status: false });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res
        .status(400)
        .json({ error: "User does not exist, please register", status: false });
    }

    const isValidPassword = await bcrypt.compare(password, validUser.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ error: "Invalid email or password", status: false });
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        email: email,
        role: validUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    validUser.password = undefined;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000, // 4 hours
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Logged in successfully!",
      status: true,
      user: validUser,
    });
  } catch (error) {
    console.log("Error in login route: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected Profile Route
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error in profile route: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  try {
    const options = {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.clearCookie("token", options);

    res
      .status(200)
      .json({ message: "User logged out successfully!", status: true });
  } catch (error) {
    console.log("Error in logout route: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
