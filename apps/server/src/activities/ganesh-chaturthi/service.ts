import { ActivityConfig } from './models/activity-config';
import { Gift } from './models/gift';
import { RankReward } from './models/rank-reward';
import { RankUser } from './models/rank-user';
import { NotFoundError } from '../../lib/errors';

/** 榜单用户查询结果（lean 之后的形状） */
interface RankUserLean {
  uid: number;
  nickname: string;
  avatar: string;
  score: number;
}

/** 活动 KEY，与前端 config.ts 的 actKey 对应 */
export const ACT_KEY = 'ganesh_chaturthi';

/** 榜单最多返回多少条 */
const RANK_LIMIT = 50;

type Lean<T> = T & { _id?: unknown; __v?: number };

/** 把库里的礼物映射成前端 ActivityGift */
function toGiftDto(g: Lean<Record<string, any>>) {
  return {
    id: g.giftId,
    name: g.name,
    nameI18n: g.nameI18n,
    image: g.image,
    imageI18n: g.imageI18n,
    gold: g.gold,
    type: g.type,
    animationUrl: g.animationUrl,
    animationType: g.animationType,
    backgroundUrl: g.backgroundUrl,
    plays: g.plays,
    useOriginal: false,
  };
}

/** 把库里的奖励物料映射成前端 GiftBagMaterialItem */
function toRewardDto(r: Record<string, any>) {
  return {
    id: r.id,
    name: r.name,
    nameI18n: r.nameI18n,
    image: r.image,
    imageI18n: r.imageI18n,
    type: r.type,
    quantity: r.quantity,
    days: r.days,
    prop: r.prop,
    animationUrl: r.animationUrl,
    animationType: r.animationType,
    backgroundUrl: r.backgroundUrl,
  };
}

/**
 * 活动配置：GET /activity/:actKey
 * countdown 按 endTime 实时算，不落库
 */
export async function getConfig() {
  const cfg = await ActivityConfig.findOne({ actKey: ACT_KEY, active: true }).lean();
  if (!cfg) throw new NotFoundError(`活动 ${ACT_KEY} 未配置`);

  const gifts = await Gift.find({ actKey: ACT_KEY, active: true }).sort({ sort: 1 }).lean();
  const endTime = new Date(cfg.endTime).getTime();
  const countdown = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

  return {
    actKey: cfg.actKey,
    cycle: cfg.cycle,
    startTime: new Date(cfg.startTime).toISOString(),
    endTime: new Date(cfg.endTime).toISOString(),
    countdown,
    rankTypes: cfg.rankTypes,
    ruleParams: cfg.ruleParams,
    gifts: gifts.map(toGiftDto),
  };
}

/**
 * 榜单奖励（挑战榜）：GET /activity/:actKey/rank/:rankType/rewards
 */
export async function getRankRewards(rankType: string) {
  const list = await RankReward.find({ actKey: ACT_KEY, rankType }).sort({ sort: 1 }).lean();
  return list.map((d) => ({
    rank: d.rank || [],
    rewards: (d.rewards || []).map((r) => toRewardDto(r as Record<string, any>)),
  }));
}

/**
 * 榜单排名：GET /activity/:actKey/rank/:rankType
 * 名次按 score 倒序实时计算
 */
export async function getRankInfo(rankType: string, uid: number) {
  const users = (await RankUser.find({ actKey: ACT_KEY, rankType })
    .sort({ score: -1, uid: 1 })
    .lean()) as unknown as RankUserLean[];

  const quantity = users.length;

  const list = users.slice(0, RANK_LIMIT).map((u, i) => ({
    rank: i + 1,
    score: u.score,
    userInfo: { uid: u.uid, nickname: u.nickname, avatar: u.avatar },
  }));

  const mineIndex = users.findIndex((u) => u.uid === uid);
  const mine = users[mineIndex];
  const mineDto =
    mineIndex >= 0 && mine
      ? {
          rank: mineIndex + 1,
          score: mine.score,
          userInfo: { uid: mine.uid, nickname: mine.nickname, avatar: mine.avatar },
        }
      : {};

  return { list, mine: mineDto, quantity };
}
