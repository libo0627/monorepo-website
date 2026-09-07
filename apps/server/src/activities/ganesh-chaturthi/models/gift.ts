import mongoose from 'mongoose';

/** 活动礼物 —— ganesh_activity_gifts（活动页「活动礼物」区块） */
const giftSchema = new mongoose.Schema(
  {
    actKey: { type: String, required: true, index: true },
    /** 业务礼物 id，前端直接当 id 用 */
    giftId: { type: Number, required: true },
    name: { type: String, default: '' },
    nameI18n: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** 预览图，为空时前端走占位头像 */
    image: { type: String, default: '' },
    imageI18n: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** 售卖金币价值 */
    gold: { type: Number, default: 0 },
    /** gift / gold 等，决定前端底部标签是金币还是天数 */
    type: { type: String, default: 'gift' },
    animationUrl: { type: String, default: '' },
    animationType: { type: String, default: '' },
    backgroundUrl: { type: String, default: '' },
    /** 播放次数限制，0 不限制 */
    plays: { type: Number, default: 0 },
    sort: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

giftSchema.index({ actKey: 1, sort: 1 });

export const Gift = mongoose.model('GaneshGift', giftSchema, 'ganesh_activity_gifts');
