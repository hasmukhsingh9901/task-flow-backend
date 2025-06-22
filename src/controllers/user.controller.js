import User from '../models/user.model.js';
import UserLog from '../models/userLog.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/env.js';

const registerUser = async (req, res) => {
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
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
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

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    user.refreshToken = hashedNewRefreshToken;
    await user.save();

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

const logoutUser = async (req, res) => {
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

      const userLog = await UserLog.findOne({ userId: user._id, logoutTime: null });
      if (userLog) {
        userLog.logoutTime = new Date();
        await userLog.save();
      }
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Toggling role for userId:', userId); // Debug log
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current role:', user.role); // Debug log
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      console.log('Admin count:', adminCount); // Debug log
      if (adminCount <= 1) {
        return res.status(403).json({ message: 'Cannot demote the only admin' });
      }
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    console.log('New role:', user.role); // Debug log

    res.status(200).json({ message: `User role updated to ${user.role}`, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Toggle role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserLogs = async (req, res) => {
  try {
    const logs = await UserLog.find().populate('userId', 'username email role');
    res.status(200).json(logs);
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUserLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const log = await UserLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await log.deleteOne();
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Delete user log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('username role _id');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser, refreshToken, logoutUser, toggleUserRole, getUserLogs, deleteUserLog, getUsers };