import mongoose from 'mongoose';

/**
 * 榜单用户 —— ganesh_rank_users
 * 名次不落库，按 score 倒序实时计算，避免加减分时全表更新。
 */
const rankUserSchema = new mongoose.Schema(
  {
    actKey: { type: String, required: true, index: true },
    /** charm / wealth */
    rankType: { type: String, required: true },
    uid: { type: Number, required: true },
    nickname: { type: String, default: '' },
    /** 头像，为空时前端走占位头像 */
    avatar: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  { timestamps: true },
);

rankUserSchema.index({ actKey: 1, rankType: 1, score: -1 });
rankUserSchema.index({ actKey: 1, rankType: 1, uid: 1 }, { unique: true });

export const RankUser = mongoose.model('GaneshRankUser', rankUserSchema, 'ganesh_rank_users');
