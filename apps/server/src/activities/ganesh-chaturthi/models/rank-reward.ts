import mongoose from 'mongoose';

/** 奖励物料项（榜单奖励里的单个奖品） */
const rewardItemSchema = new mongoose.Schema(
  {
    id: { type: Number, default: 0 },
    name: { type: String, default: '' },
    nameI18n: { type: mongoose.Schema.Types.Mixed, default: {} },
    image: { type: String, default: '' },
    imageI18n: { type: mongoose.Schema.Types.Mixed, default: {} },
    type: { type: String, default: 'gift' },
    /** 数量，type 为 gold/gift 时前端展示金币图标 + 数量 */
    quantity: { type: Number, default: 0 },
    /** 天数，非金币类奖励展示「N 天」 */
    days: { type: Number, default: 0 },
    /** 物料属性 1时效性 2数量 3都支持 */
    prop: { type: Number, default: 1 },
    animationUrl: { type: String, default: '' },
    animationType: { type: String, default: '' },
    backgroundUrl: { type: String, default: '' },
  },
  { _id: false },
);

/**
 * 榜单奖励（挑战榜）—— ganesh_rank_rewards
 * 一条记录 = 一个排名区间 + 该区间的奖励列表
 */
const rankRewardSchema = new mongoose.Schema(
  {
    actKey: { type: String, required: true, index: true },
    /** charm / wealth */
    rankType: { type: String, required: true },
    /** 排名区间，如 [1] 或 [2, 3] */
    rank: { type: [Number], default: [] },
    sort: { type: Number, default: 0 },
    rewards: { type: [rewardItemSchema], default: [] },
  },
  { timestamps: true },
);

rankRewardSchema.index({ actKey: 1, rankType: 1, sort: 1 });

export const RankReward = mongoose.model(
  'GaneshRankReward',
  rankRewardSchema,
  'ganesh_rank_rewards',
);
