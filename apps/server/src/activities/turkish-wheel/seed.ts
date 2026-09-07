import { Prize } from './models/prize';
import { Task } from './models/task';
import { UserState } from './models/user-state';
import { logger } from '../../lib/logger';

/** 16 宫格奖品（6 种图片循环使用，权重均等） */
const prizeSeed = [
  {
    name: '1M COINS',
    imageKey: 'reward_1',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 0,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_2',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 1,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_3',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 2,
  },
  {
    name: '1M COINS',
    imageKey: 'reward_4',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 3,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_5',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 4,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_6',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 5,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_1',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 6,
  },
  {
    name: '1M COINS',
    imageKey: 'reward_1',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 7,
  },
  {
    name: '1M COINS',
    imageKey: 'reward_3',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 8,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_4',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 9,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_5',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 10,
  },
  {
    name: '1M COINS',
    imageKey: 'reward_5',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 11,
  },
  {
    name: '1M COINS',
    imageKey: 'reward_6',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 12,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_5',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 13,
  },
  {
    name: '10M COINS',
    imageKey: 'reward_6',
    rate: '99.99%',
    count: 10000000,
    giftType: 'gold',
    giftId: 2,
    prob: 5,
    sort: 14,
  },
  {
    name: '1M COINS',
    imageKey: 'reward_2',
    rate: '99.99%',
    count: 1000000,
    giftType: 'gold',
    giftId: 1,
    prob: 10,
    sort: 15,
  },
];

/** 5 个任务 */
const taskSeed = [
  {
    taskType: 1,
    taskDesc: '送出 100 个普通礼物',
    taskValue: 100,
    currentValue: 9,
    status: 0,
    drawReward: 1,
    giftBagId: 0,
    sort: 0,
  },
  {
    taskType: 2,
    taskDesc: '送出 100 个幸运礼物',
    taskValue: 100,
    currentValue: 100,
    status: 1,
    drawReward: 2,
    giftBagId: 0,
    sort: 1,
  },
  {
    taskType: 3,
    taskDesc: '幸运礼物返还达 100',
    taskValue: 100,
    currentValue: 100,
    status: 2,
    drawReward: 1,
    giftBagId: 0,
    sort: 2,
  },
  {
    taskType: 4,
    taskDesc: '游戏投入达 1000 金币',
    taskValue: 1000,
    currentValue: 9,
    status: 0,
    drawReward: 3,
    giftBagId: 0,
    sort: 3,
  },
  {
    taskType: 5,
    taskDesc: '游戏产出达 1000 金币',
    taskValue: 1000,
    currentValue: 9,
    status: 0,
    drawReward: 3,
    giftBagId: 0,
    sort: 4,
  },
];

export async function seedTurkishWheel() {
  const prizeCount = await Prize.countDocuments();
  if (prizeCount === 0) {
    await Prize.insertMany(prizeSeed);
    logger.info('seeded turkish-wheel prizes');
  }

  const taskCount = await Task.countDocuments();
  if (taskCount === 0) {
    await Task.insertMany(taskSeed);
    logger.info('seeded turkish-wheel tasks');
  }

  const userCount = await UserState.countDocuments({ userId: 'demo-user' });
  if (userCount === 0) {
    await UserState.create({ userId: 'demo-user', drawCount: 8 });
    logger.info('seeded demo-user state');
  }
}
