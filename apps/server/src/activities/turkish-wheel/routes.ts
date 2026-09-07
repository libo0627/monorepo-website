import { Router } from 'express';
import { drawSchema, claimTaskSchema, listRecordsQuerySchema } from '@mono/shared';
import { ok } from '../../lib/response';
import { validate } from '../../middlewares/validate';
import * as service from './service';

export const turkishWheelRouter = Router();

/** 从请求头获取用户 ID（demo 阶段无鉴权，用 header 传 userId） */
function getUserId(req: { header: (name: string) => string | undefined }) {
  return req.header('x-user-id') || 'demo-user';
}

// 首页信息
turkishWheelRouter.get('/home', async (req, res) => {
  res.json(ok(await service.getHome(getUserId(req))));
});

// 抽奖
turkishWheelRouter.post('/draw', validate(drawSchema), async (req, res) => {
  const { type } = req.body as { type: number };
  res.json(ok(await service.draw(getUserId(req), type)));
});

// 任务列表
turkishWheelRouter.get('/tasks', async (_req, res) => {
  res.json(ok(await service.listTasks()));
});

// 领取任务奖励
turkishWheelRouter.patch('/tasks/:taskType/claim', async (req, res) => {
  const taskType = Number(req.params.taskType);
  const parsed = claimTaskSchema.safeParse({ taskType });
  if (!parsed.success) {
    res.status(400).json({ code: 400, message: 'taskType 参数无效', data: null });
    return;
  }
  res.json(ok(await service.claimTask(getUserId(req), taskType)));
});

// 抽奖记录（分页）
turkishWheelRouter.get('/records', validate(listRecordsQuerySchema, 'query'), async (req, res) => {
  const query = req.query as unknown as { userId?: string; page: number; pageSize: number };
  res.json(ok(await service.listRecords({ ...query, userId: query.userId || getUserId(req) })));
});

// 删除抽奖记录
turkishWheelRouter.delete('/records/:id', async (req, res) => {
  res.json(ok(await service.deleteRecord(req.params.id)));
});

// 奖品配置 CRUD
turkishWheelRouter.get('/prizes', async (_req, res) => {
  res.json(ok(await service.listPrizes()));
});

turkishWheelRouter.post('/prizes', async (req, res) => {
  res.status(201).json(ok(await service.createPrize(req.body)));
});

turkishWheelRouter.patch('/prizes/:id', async (req, res) => {
  res.json(ok(await service.updatePrize(req.params.id, req.body)));
});

turkishWheelRouter.delete('/prizes/:id', async (req, res) => {
  res.json(ok(await service.deletePrize(req.params.id)));
});
