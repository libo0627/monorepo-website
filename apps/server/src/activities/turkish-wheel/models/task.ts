import mongoose from 'mongoose';

/** 任务配置 — 对应 MongoDB turkish_wheel_tasks 集合 */
const taskSchema = new mongoose.Schema(
  {
    taskType: { type: Number, required: true, min: 1, max: 5 }, // 1普通礼物 2幸运礼物 3返还 4游戏投入 5游戏产出
    taskDesc: { type: String, required: true },
    taskValue: { type: Number, required: true, min: 1 }, // 目标值
    currentValue: { type: Number, default: 0 }, // 当前进度
    status: { type: Number, default: 0, min: 0, max: 2 }, // 0进行中 1可领取 2已领取
    drawReward: { type: Number, default: 1 }, // 完成奖励的抽奖次数
    giftBagId: { type: Number, default: 0 },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);

taskSchema.index({ taskType: 1 });

export const Task = mongoose.model('Task', taskSchema, 'turkish_wheel_tasks');
