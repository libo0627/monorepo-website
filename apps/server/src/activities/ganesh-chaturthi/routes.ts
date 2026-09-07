import { Router } from 'express';
import { ok } from '../../lib/response';
import * as service from './service';

/**
 * 榜单活动接口，路径与前端 template-activity/http.ts 一一对应：
 *   GET /activity/:actKey
 *   GET /activity/:actKey/rank/:rankType/rewards
 *   GET /activity/:actKey/rank/:rankType
 */
export const activityRouter = Router();

const VALID_RANK_TYPES = ['charm', 'wealth'];

/** demo 阶段无鉴权，用 header 传用户 id */
function getUid(req: { header: (name: string) => string | undefined }) {
  const raw = Number(req.header('x-user-id'));
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

/** 活动配置（含倒计时、礼物列表） */
activityRouter.get('/:actKey', async (_req, res) => {
  res.json(ok(await service.getConfig()));
});

/** 挑战榜奖励 */
activityRouter.get('/:actKey/rank/:rankType/rewards', async (req, res) => {
  const { rankType } = req.params;
  if (!VALID_RANK_TYPES.includes(rankType)) {
    res
      .status(400)
      .json({ code: 400, message: `rankType 只能是 ${VALID_RANK_TYPES.join(' / ')}`, data: null });
    return;
  }
  res.json(ok(await service.getRankRewards(rankType)));
});

/** 排行榜（含我的排名、参与人数） */
activityRouter.get('/:actKey/rank/:rankType', async (req, res) => {
  const { rankType } = req.params;
  if (!VALID_RANK_TYPES.includes(rankType)) {
    res
      .status(400)
      .json({ code: 400, message: `rankType 只能是 ${VALID_RANK_TYPES.join(' / ')}`, data: null });
    return;
  }
  res.json(ok(await service.getRankInfo(rankType, getUid(req))));
});
