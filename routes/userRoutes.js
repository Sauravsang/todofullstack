import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  authToken,
  requestPasswordResetController,
  verifyResetTokenController,
  resetPasswordController,
} from "../controllers/userController.js";

const router = express.Router();

// Endpoint to get all USERS

router.post("/register", registerController); // Register a user

router.post("/login", loginController); // Login a user

router.get("/logout", logoutController); // Log out a user

router.get("/token-verify", authToken); // Verify a user token

router.post("/forgot-password", requestPasswordResetController); // forgot password

router.get("/reset-password/:token", verifyResetTokenController); // reset link verification

router.post("/reset-password", resetPasswordController);  // reset password save

export default router;
