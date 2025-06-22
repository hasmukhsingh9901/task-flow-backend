import mongoose from 'mongoose';

const userLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginTime: { type: Date },
    logoutTime: { type: Date },
    tokenName: { type: String },
    username: { type: String, required: true },
    role: { type: String, required: true },
    ipAddress: { type: String }
});

const UserLog = mongoose.model('UserLog', userLogSchema);

export default UserLog;