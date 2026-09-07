import { z } from 'zod';

/**
 * 用户实体。这是「唯一的事实源」：
 * 后端用它做运行时校验，前端用它推导类型、生成表单校验规则。
 */
export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, '姓名不能为空').max(32, '姓名最多 32 个字'),
  email: z
    .string()
    .min(1, '邮箱不能为空')
    .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, '邮箱格式不正确'),
  role: z.enum(['admin', 'member']),
  createdAt: z.string(),
});

/** 新建用户：id 与 createdAt 由服务端生成 */
export const createUserSchema = userSchema.omit({ id: true, createdAt: true });

/** 更新用户：字段全部可选 */
export const updateUserSchema = createUserSchema.partial();

/** 列表查询参数 */
export const listUsersQuerySchema = z.object({
  keyword: z.string().optional(),
  role: z.enum(['admin', 'member']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
