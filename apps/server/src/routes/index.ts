import { Router } from 'express';
import { usersRouter } from './users';
import { turkishWheelRouter } from '../activities/turkish-wheel/routes';
import { activityRouter } from '../activities/ganesh-chaturthi/routes';

export const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/activities/turkish-wheel', turkishWheelRouter);
// 榜单活动模板：/api/activity/:actKey/...
apiRouter.use('/activity', activityRouter);
