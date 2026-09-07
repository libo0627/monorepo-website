import { z } from 'zod';

/** 统一的响应信封，前后端共用 */
export const okSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    code: z.literal(0),
    message: z.literal('ok'),
    data,
  });

export const errSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.null(),
});

export const pagedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  });

export type Ok<T> = { code: 0; message: 'ok'; data: T };
export type Err = z.infer<typeof errSchema>;
export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };
