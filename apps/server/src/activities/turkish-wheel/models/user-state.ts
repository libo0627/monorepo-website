import mongoose from 'mongoose';

/** 用户活动状态 — 对应 MongoDB turkish_wheel_user_states 集合 */
const userStateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    drawCount: { type: Number, default: 0 }, // 剩余抽奖次数
  },
  { timestamps: true },
);

export const UserState = mongoose.model('UserState', userStateSchema, 'turkish_wheel_user_states');
