import mongoose from 'mongoose';

/** 抽奖记录 — 对应 MongoDB turkish_wheel_records 集合 */
const drawRecordSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    drawType: { type: Number, required: true, min: 1, max: 2 }, // 1单抽 2十连
    prizes: [
      {
        name: String,
        image: String,
        count: Number,
        giftType: String,
        giftId: Number,
      },
    ],
  },
  { timestamps: true },
);

drawRecordSchema.index({ userId: 1, createdAt: -1 });

export const DrawRecord = mongoose.model('DrawRecord', drawRecordSchema, 'turkish_wheel_records');
