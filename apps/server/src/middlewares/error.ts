import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/errors';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, '接口不存在'));
}

/** Express 5 会自动捕获 async handler 里抛出的异常，统一在这里转成 JSON */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : '服务器内部错误';

  if (statusCode >= 500) {
    req.log?.error({ err }, message);
  }

  res.status(statusCode).json({ code: isHttpError ? err.code : 500, message, data: null });
}
