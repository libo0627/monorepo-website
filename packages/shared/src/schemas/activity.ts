import { z } from 'zod';

// ──────────────────────────────────────────────
// 土耳其大转盘 — 共享 Schema（前后端唯一事实源）
// ──────────────────────────────────────────────

/** 任务类型枚举 1普通礼物 2幸运礼物 3幸运礼物返还 4游戏投入 5游戏产出 */
export const TASK_TYPES = [1, 2, 3, 4, 5] as const;
export const TASK_TYPE_LABELS: Record<number, string> = {
  1: '普通礼物',
  2: '幸运礼物',
  3: '幸运礼物返还',
  4: '游戏投入',
  5: '游戏产出',
};

/** 任务状态枚举 0进行中 1可领取 2已领取 */
export const TASK_STATUSES = [0, 1, 2] as const;
export const TASK_STATUS_LABELS: Record<number, string> = {
  0: '进行中',
  1: '可领取',
  2: '已领取',
};

/** 抽奖类型枚举 1单抽 2十连 */
export const DRAW_TYPES = [1, 2] as const;

/** 奖品实体 */
export const prizeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, '奖品名称不能为空'),
  image: z.string().min(1, '奖品图片不能为空'),
  rate: z.string().default('99.99%'),
  count: z.number().int().min(0).default(1),
  giftType: z.string().default('gold'),
  giftId: z.number().int().min(0).default(0),
  prob: z.number().int().min(1).default(1),
  sort: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

/** 新建奖品 */
export const createPrizeSchema = prizeSchema.omit({ id: true });

/** 更新奖品 */
export const updatePrizeSchema = createPrizeSchema.partial();

/** 任务实体 */
export const taskSchema = z.object({
  id: z.string().min(1),
  taskType: z.number().int().min(1).max(5),
  taskDesc: z.string().min(1, '任务描述不能为空'),
  taskValue: z.number().int().min(1, '任务目标值必须大于0'),
  currentValue: z.number().int().min(0).default(0),
  status: z.number().int().min(0).max(2).default(0),
  drawReward: z.number().int().min(0).default(1),
  giftBagId: z.number().int().min(0).default(0),
  sort: z.number().int().min(0).default(0),
});

/** 领取任务奖励 */
export const claimTaskSchema = z.object({
  taskType: z.number().int().min(1).max(5),
});

/** 抽奖请求 */
export const drawSchema = z.object({
  type: z.number().int().min(1).max(2), // 1=单抽 2=十连
});

/** 抽奖记录 */
export const drawRecordSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  drawType: z.number().int().min(1).max(2),
  prizes: z.array(
    z.object({
      name: z.string(),
      image: z.string(),
      count: z.number().int().min(0),
      giftType: z.string(),
      giftId: z.number().int().min(0),
    }),
  ),
  createdAt: z.string(),
});

/** 抽奖记录查询参数 */
export const listRecordsQuerySchema = z.object({
  userId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

/** 跑马灯条目 */
export const marqueeSchema = z.object({
  nickname: z.string(),
  avatar: z.string(),
  gold: z.number().int().min(0),
  uid: z.string(),
});

/** 首页信息 */
export const homeInfoSchema = z.object({
  drawCount: z.number().int().min(0),
  prizeList: z.array(prizeSchema),
  taskList: z.array(taskSchema),
  marqueeList: z.array(marqueeSchema),
});

export type Prize = z.infer<typeof prizeSchema>;
export type CreatePrizeInput = z.infer<typeof createPrizeSchema>;
export type UpdatePrizeInput = z.infer<typeof updatePrizeSchema>;
export type Task = z.infer<typeof taskSchema>;
export type DrawType = z.infer<typeof drawSchema>['type'];
export type DrawRecord = z.infer<typeof drawRecordSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsQuerySchema>;
export type Marquee = z.infer<typeof marqueeSchema>;
export type HomeInfo = z.infer<typeof homeInfoSchema>;
