const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==============================
// REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  try {
    const { name, email, usn, branch, year, password } = req.body;

    // Check required fields
    if (!name || !email || !usn || !branch || !year || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    // Check if USN already exists
    const existingUSN = await User.findOne({
      usn: usn.toUpperCase(),
    });

    if (existingUSN) {
      return res.status(409).json({
        message: "An account with this USN already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      usn: usn.toUpperCase(),
      branch,
      year,
      password: hashedPassword,
    });

    // Send response
    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        branch: user.branch,
        year: user.year,
        role: user.role,
        coinBalance: user.coinBalance,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Server error while creating account",
    });
  }
};

// ==============================
// LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        branch: user.branch,
        year: user.year,
        role: user.role,
        coinBalance: user.coinBalance,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error while logging in",
    });
  }
};

// ==============================
// EXPORT CONTROLLERS
// ==============================
const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    res.status(500).json({
      message: "Server error while getting user",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};