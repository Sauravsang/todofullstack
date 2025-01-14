import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function registerController(req, res) {
  try {
    // Validate request body
    const { fullName, username, email, password } = req.body;

    // Check if username already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const UpdateUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    await User(UpdateUser).save();

    // Response

    res.status(200).json({
      succes: true,
      message: "User registered successfully",
      UpdateUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `error registering user ${error.message}`,
    });
  }
}

export async function loginController(req, res) {
  try {
    // Validate request body
    const { username, email, password } = req.body;

    // Check if user not exists
    const user = await User.findOne({ email, username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not exists , please check your username && password",
      });
    }

    // Check if password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials!!",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Response

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "user logged in successfully",
        token,
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `this error ${error.message}`,
    });
  }
}

export async function authToken(req, res) {
  const token = req.cookies.token; // Access HttpOnly cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const _id = decoded.userId;

    const userInfo = await User.findOne({ _id });

    return res.status(200).json({ valid: true, userInfo });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function logoutController(req, res) {
  // Delete JWT token from the cookie
  try {
    return res.status(200).cookie("token", "").json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "logout failed",
    });
  }
}

export async function requestPasswordResetController(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found, please register" });
    }
    // Generate a random token
    const resetToken = crypto.randomBytes(30).toString("hex");
    const resetTokenExpiration = Date.now() + 10 * 60 * 1000; // 10 mint for vaild token expiration

    // save the token  and expiration time

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiration;
    await user.save();

    // Send reset token via email (use your email service here)

    const transporter = nodemailer.createTransport({
      service: "gmail", // Your email service provider
      auth: {
        user: process.env.My_Gmail, //  use environment variable for email
        pass: process.env.Gmail_Password, // use environment variable for password
      },
    });

    const resetLink = `${req.headers.origin}/reset-password/${resetToken}`;

    // mail template for user sending reset verfication link
    const mailOptions = {
      from: process.env.GMAIL, // Sender address
      to: email, // Recipient address
      subject: "Reset Your Password - To-Do App",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">To-Do App</h2>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        You recently requested to reset your password for your To-Do App account. Click the button below to reset it. This password reset link is valid for the next <strong>10 minutes</strong>.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="text-decoration: none; padding: 10px 20px; background-color: #007bff; color: white; font-size: 16px; border-radius: 5px;">Reset Password</a>
      </div>
      <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 14px; color: #777; text-align: center;">
        &copy; ${new Date().getFullYear()} To-Do App. All rights reserved.
      </p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error sending password reset email ${error.message}`,
    });
  }
}

export async function verifyResetTokenController(req, res) {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure the token hasn't expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid", // Token is valid for password reset
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { token, password } = req.body;

    console.log("token-> ", token, "newp -> ", password);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure token is valid
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token and expiry
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
