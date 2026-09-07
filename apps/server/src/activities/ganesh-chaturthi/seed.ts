import { logger } from '../../lib/logger';
import { ActivityConfig } from './models/activity-config';
import { Gift } from './models/gift';
import { RankReward } from './models/rank-reward';
import { RankUser } from './models/rank-user';
import { ACT_KEY } from './service';

const GIFT = (n: number) => `/activity/ganesh-chaturthi/gifts/gift_${n}.webp`;
const AVATAR = '/activity/ganesh-chaturthi/avatars/default.webp';

/** 活动周期：已开始 1 天，还剩 7 天结束（前端倒计时直接读 endTime） */
const DAY = 24 * 60 * 60 * 1000;

/** 活动礼物（活动页「活动礼物」区块） */
const giftSeed = [
  { giftId: 1001, name: '象神赐福', gold: 1000, type: 'gift', image: GIFT(1), sort: 0 },
  { giftId: 1002, name: '莲花灯', gold: 5000, type: 'gift', image: GIFT(2), sort: 1 },
  { giftId: 1003, name: '神圣花环', gold: 20000, type: 'gift', image: GIFT(3), sort: 2 },
  { giftId: 1004, name: '象神坐骑', gold: 50000, type: 'gift', image: GIFT(4), sort: 3 },
  { giftId: 1005, name: '黄金象神', gold: 100000, type: 'gift', image: GIFT(5), sort: 4 },
  { giftId: 1006, name: '至尊神象', gold: 500000, type: 'gift', image: GIFT(6), sort: 5 },
].map((g) => ({
  ...g,
  actKey: ACT_KEY,
  nameI18n: { en_US: g.name, hi_IN: g.name, zh_CN: g.name },
  active: true,
}));

/** 挑战榜奖励：charm（魅力榜）与 wealth（财富榜）各一份 */
const rankRewardSeed = (rankType: string) =>
  [
    {
      rankType,
      rank: [1],
      sort: 0,
      rewards: [
        {
          id: 2001,
          name: '至尊神象',
          type: 'gift',
          quantity: 1,
          days: 30,
          prop: 3,
          image: GIFT(6),
        },
        {
          id: 2002,
          name: '金币',
          type: 'gold',
          quantity: 500000,
          days: 0,
          prop: 2,
          image: GIFT(5),
        },
        {
          id: 2003,
          name: '象神王冠',
          type: 'gift',
          quantity: 1,
          days: 30,
          prop: 3,
          image: '/activity/ganesh-chaturthi/gifts/crown.webp',
        },
      ],
    },
    {
      rankType,
      rank: [2, 3],
      sort: 1,
      rewards: [
        {
          id: 2011,
          name: '黄金象神',
          type: 'gift',
          quantity: 1,
          days: 15,
          prop: 3,
          image: GIFT(5),
        },
        {
          id: 2012,
          name: '金币',
          type: 'gold',
          quantity: 200000,
          days: 0,
          prop: 2,
          image: GIFT(4),
        },
      ],
    },
    {
      rankType,
      rank: [4, 10],
      sort: 2,
      rewards: [
        { id: 2021, name: '象神坐骑', type: 'gift', quantity: 1, days: 7, prop: 3, image: GIFT(4) },
        { id: 2022, name: '金币', type: 'gold', quantity: 50000, days: 0, prop: 2, image: GIFT(3) },
      ],
    },
  ].map((r) => ({
    ...r,
    actKey: ACT_KEY,
    rewards: r.rewards.map((item) => ({
      ...item,
      nameI18n: { en_US: item.name, hi_IN: item.name, zh_CN: item.name },
    })),
  }));

/** 榜单用户：uid 1 是当前登录用户（demo），刻意放在第 5 名左右 */
const rankUserSeed = (
  rankType: string,
  users: Array<{ uid: number; nickname: string; score: number; avatar?: string }>,
) => users.map((u) => ({ ...u, actKey: ACT_KEY, rankType, avatar: u.avatar ?? '' }));

const charmUsers = rankUserSeed('charm', [
  { uid: 901, nickname: 'Aarav', score: 986000, avatar: AVATAR },
  { uid: 902, nickname: 'Ananya', score: 842000, avatar: AVATAR },
  { uid: 903, nickname: 'Vivaan', score: 731500 },
  { uid: 904, nickname: 'Diya', score: 690200, avatar: AVATAR },
  { uid: 1, nickname: '我 (You)', score: 512800, avatar: AVATAR },
  { uid: 906, nickname: 'Ishaan', score: 488000 },
  { uid: 907, nickname: 'Kavya', score: 402300, avatar: AVATAR },
  { uid: 908, nickname: 'Rohan', score: 355100 },
  { uid: 909, nickname: 'Meera', score: 298700, avatar: AVATAR },
  { uid: 910, nickname: 'Arjun', score: 246000 },
  { uid: 911, nickname: 'Neha', score: 187400, avatar: AVATAR },
  { uid: 912, nickname: 'Aditya', score: 132000 },
]);

const wealthUsers = rankUserSeed('wealth', [
  { uid: 921, nickname: 'Lakshmi', score: 1580000, avatar: AVATAR },
  { uid: 922, nickname: 'Rohan', score: 1324000, avatar: AVATAR },
  { uid: 923, nickname: 'Sanya', score: 1105000 },
  { uid: 924, nickname: 'Kabir', score: 968000, avatar: AVATAR },
  { uid: 1, nickname: '我 (You)', score: 745600, avatar: AVATAR },
  { uid: 926, nickname: 'Tanvi', score: 682000 },
  { uid: 927, nickname: 'Vikram', score: 574300, avatar: AVATAR },
  { uid: 928, nickname: 'Pooja', score: 468900 },
  { uid: 929, nickname: 'Manish', score: 391200, avatar: AVATAR },
  { uid: 930, nickname: 'Riya', score: 305000 },
  { uid: 931, nickname: 'Siddharth', score: 228600, avatar: AVATAR },
  { uid: 932, nickname: 'Nisha', score: 154000 },
]);

export async function seedGaneshChaturthi() {
  const now = Date.now();

  if ((await ActivityConfig.countDocuments({ actKey: ACT_KEY })) === 0) {
    await ActivityConfig.create({
      actKey: ACT_KEY,
      name: '象神节 Ganesh Chaturthi',
      cycle: 'period',
      startTime: new Date(now - DAY),
      endTime: new Date(now + 7 * DAY),
      rankTypes: ['charm', 'wealth'],
      ruleParams: {
        // 前端按 ruleCount(4) 读 规则1标题 / 规则1内容 ... 规则4标题 / 规则4内容
        ruleCount: 4,
      },
      active: true,
    });
    logger.info('seeded ganesh activity config');
  }

  if ((await Gift.countDocuments({ actKey: ACT_KEY })) === 0) {
    await Gift.insertMany(giftSeed);
    logger.info('seeded ganesh gifts');
  }

  if ((await RankReward.countDocuments({ actKey: ACT_KEY })) === 0) {
    await RankReward.insertMany([...rankRewardSeed('charm'), ...rankRewardSeed('wealth')]);
    logger.info('seeded ganesh rank rewards');
  }

  if ((await RankUser.countDocuments({ actKey: ACT_KEY })) === 0) {
    await RankUser.insertMany([...charmUsers, ...wealthUsers]);
    logger.info('seeded ganesh rank users');
  }
}
