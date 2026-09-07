import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { BadRequestError } from '../lib/errors';

type Source = 'body' | 'query' | 'params';

/**
 * 用 @mono/shared 里的 zod schema 校验请求。
 * 校验通过后把「解析并转换过类型的数据」写回 req，handler 里拿到的就是干净数据。
 */
export function validate(schema: ZodType, source: Source = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const first = result.error.issues[0];
      const detail = first
        ? `${first.path.join('.') || source}: ${first.message}`
        : `${source} 参数校验失败`;
      next(new BadRequestError(detail));
      return;
    }
    // 运行时把校验后的结果写回，替代原始的 query / body
    Object.defineProperty(req, source, { value: result.data, writable: true, configurable: true });
    next();
  };
}
