import mongoose from 'mongoose';
import { NotFoundError, BadRequestError } from '../../lib/errors';
import { Prize } from './models/prize';
import { Task } from './models/task';
import { DrawRecord } from './models/draw-record';
import { UserState } from './models/user-state';
import type { CreatePrizeInput, UpdatePrizeInput } from '@mono/shared';

// ──────────────────────────────────────────────
// 用户状态
// ──────────────────────────────────────────────

async function getOrCreateUserState(userId: string) {
  let state = await UserState.findOne({ userId });
  if (!state) {
    state = await UserState.create({ userId, drawCount: 8 });
  }
  return state;
}

// ──────────────────────────────────────────────
// 首页信息
// ──────────────────────────────────────────────

export async function getHome(userId: string) {
  const [state, prizes, tasks, recentRecords] = await Promise.all([
    getOrCreateUserState(userId),
    Prize.find({ active: true }).sort({ sort: 1 }).lean(),
    Task.find().sort({ sort: 1 }).lean(),
    DrawRecord.find({ 'prizes.giftType': 'gold' }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  // 跑马灯：从最近抽中金币的记录生成
  const marqueeList = recentRecords.map((r) => {
    const goldPrize = r.prizes.find((p) => p.giftType === 'gold');
    return {
      nickname: `用户${r.userId.slice(-4)}`,
      avatar: '',
      gold: goldPrize?.count ?? 0,
      uid: r.userId,
    };
  });

  return {
    drawCount: state.drawCount,
    prizeList: prizes.map(formatPrize),
    taskList: tasks.map(formatTask),
    marqueeList,
  };
}

// ──────────────────────────────────────────────
// 抽奖
// ──────────────────────────────────────────────

function weightedRandom(prizes: typeof Prize.prototype) {
  const totalWeight = prizes.reduce((sum: number, p: any) => sum + p.prob, 0);
  let random = Math.random() * totalWeight;
  for (const p of prizes) {
    random -= p.prob;
    if (random < 0) return p;
  }
  return prizes[prizes.length - 1];
}

export async function draw(userId: string, type: number) {
  const drawAmount = type === 2 ? 10 : 1;
  const state = await getOrCreateUserState(userId);

  if (state.drawCount < drawAmount) {
    throw new BadRequestError(`抽奖次数不足，剩余 ${state.drawCount} 次`);
  }

  // 扣减抽奖次数
  state.drawCount -= drawAmount;
  await state.save();

  // 获取奖池
  const prizes = await Prize.find({ active: true }).lean();
  if (prizes.length === 0) {
    throw new BadRequestError('奖池为空，请先配置奖品');
  }

  // 加权随机抽奖
  const drawnPrizes = Array.from({ length: drawAmount }, () => {
    const won = weightedRandom(prizes as any);
    return {
      name: won.name,
      image: won.imageKey,
      count: won.count,
      giftType: won.giftType,
      giftId: won.giftId,
    };
  });

  // 写入抽奖记录
  const record = await DrawRecord.create({
    userId,
    drawType: type,
    prizes: drawnPrizes,
  });

  return {
    id: String(record._id),
    drawType: type,
    prizes: drawnPrizes,
    createdAt: record.createdAt?.toISOString(),
  };
}

// ──────────────────────────────────────────────
// 任务
// ──────────────────────────────────────────────

export async function listTasks() {
  const tasks = await Task.find().sort({ sort: 1 }).lean();
  return tasks.map(formatTask);
}

export async function claimTask(userId: string, taskType: number) {
  const task = await Task.findOne({ taskType });
  if (!task) throw new NotFoundError(`任务类型 ${taskType} 不存在`);
  if (task.status !== 1) throw new BadRequestError('任务当前不可领取');

  // 更新任务状态
  task.status = 2;
  await task.save();

  // 增加抽奖次数
  const state = await getOrCreateUserState(userId);
  state.drawCount += task.drawReward;
  await state.save();

  return { drawReward: task.drawReward, drawCount: state.drawCount };
}

// ──────────────────────────────────────────────
// 抽奖记录
// ──────────────────────────────────────────────

export async function listRecords(query: { userId?: string; page: number; pageSize: number }) {
  const filter: Record<string, unknown> = {};
  if (query.userId) filter.userId = query.userId;

  const [items, total] = await Promise.all([
    DrawRecord.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean(),
    DrawRecord.countDocuments(filter),
  ]);

  return {
    items: items.map((r) => ({
      id: String(r._id),
      userId: r.userId,
      drawType: r.drawType,
      prizes: r.prizes,
      createdAt: r.createdAt?.toISOString(),
    })),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function deleteRecord(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new BadRequestError('无效的记录 ID');
  const result = await DrawRecord.deleteOne({ _id: id });
  if (result.deletedCount === 0) throw new NotFoundError('记录不存在');
  return { id };
}

// ──────────────────────────────────────────────
// 奖品配置 CRUD
// ──────────────────────────────────────────────

export async function listPrizes() {
  const prizes = await Prize.find().sort({ sort: 1 }).lean();
  return prizes.map(formatPrize);
}

export async function createPrize(input: CreatePrizeInput) {
  const prize = await Prize.create(input);
  return formatPrize(prize.toObject());
}

export async function updatePrize(id: string, input: UpdatePrizeInput) {
  if (!mongoose.isValidObjectId(id)) throw new BadRequestError('无效的奖品 ID');
  const prize = await Prize.findByIdAndUpdate(id, input, { new: true }).lean();
  if (!prize) throw new NotFoundError('奖品不存在');
  return formatPrize(prize);
}

export async function deletePrize(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new BadRequestError('无效的奖品 ID');
  const result = await Prize.deleteOne({ _id: id });
  if (result.deletedCount === 0) throw new NotFoundError('奖品不存在');
  return { id };
}

// ──────────────────────────────────────────────
// 格式化（MongoDB 文档 → API 响应）
// ──────────────────────────────────────────────

function formatPrize(p: any) {
  return {
    id: String(p._id),
    name: p.name,
    imageKey: p.imageKey,
    rate: p.rate,
    count: p.count,
    giftType: p.giftType,
    giftId: p.giftId,
    prob: p.prob,
    sort: p.sort,
    active: p.active,
  };
}

function formatTask(t: any) {
  return {
    id: String(t._id),
    taskType: t.taskType,
    taskDesc: t.taskDesc,
    taskValue: t.taskValue,
    currentValue: t.currentValue,
    status: t.status,
    drawReward: t.drawReward,
    giftBagId: t.giftBagId,
    sort: t.sort,
  };
}
