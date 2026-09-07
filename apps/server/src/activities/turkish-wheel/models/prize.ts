import mongoose from 'mongoose';

/** 奖品配置 — 对应 MongoDB turkish_wheel_prizes 集合 */
const prizeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageKey: { type: String, required: true }, // 前端映射到实际图片资源的 key
    rate: { type: String, default: '99.99%' },
    count: { type: Number, default: 1 },
    giftType: { type: String, default: 'gold' },
    giftId: { type: Number, default: 0 },
    prob: { type: Number, default: 1 }, // 中奖权重
    sort: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

prizeSchema.index({ sort: 1 });

export const Prize = mongoose.model('Prize', prizeSchema, 'turkish_wheel_prizes');
