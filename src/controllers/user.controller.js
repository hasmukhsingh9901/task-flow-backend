import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../config/env.js";
import UserLog from "../models/userLog.model.js";

const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        
        if (role === 'admin') {
            const adminExists = await User.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(403).json({ message: 'An admin already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user' 
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        const refreshToken = jwt.sign(
            { id: user._id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // Hash refresh token before storing
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        await user.save();
        const userLog = new UserLog({
            userId: user._id,
            loginTime: new Date(),
            tokenName: 'accessToken',
            username: user.username,
            role: user.role,
            ipAddress: req.ip
        });
        await userLog.save();

        res.status(200).json({
            accessToken,
            refreshToken,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token required' });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        const newRefreshToken = jwt.sign(
            { id: user._id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        // Rotate refresh token
        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        user.refreshToken = hashedNewRefreshToken;
        await user.save();

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

const logoutUser = async (req, res, next) => {
try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = null;
      await user.save();

      // Update user log with logout time
      const userLog = await UserLog.findOne({ userId: user._id, logoutTime: null });
      if (userLog) {
        userLog.logoutTime = new Date();
        await userLog.save();
      }
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// New endpoint for admin to toggle user role
const toggleUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent changing the only admin to user
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(403).json({ message: 'Cannot demote the only admin' });
            }
        }

        // Toggle role
        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        res.status(200).json({ message: `User role updated to ${user.role}`, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { registerUser, loginUser, refreshToken, logoutUser, toggleUserRole };