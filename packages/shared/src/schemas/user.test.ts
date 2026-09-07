import { describe, expect, it } from 'vitest';
import { createUserSchema, listUsersQuerySchema, updateUserSchema } from './user';

describe('createUserSchema', () => {
  it('接受合法的创建参数', () => {
    const result = createUserSchema.safeParse({
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'member',
    });
    expect(result.success).toBe(true);
  });

  it('拒绝非法邮箱', () => {
    const result = createUserSchema.safeParse({
      name: '张三',
      email: 'not-an-email',
      role: 'member',
    });
    expect(result.success).toBe(false);
  });

  it('拒绝空姓名', () => {
    const result = createUserSchema.safeParse({ name: '', email: 'a@b.com', role: 'admin' });
    expect(result.success).toBe(false);
  });
});

describe('updateUserSchema', () => {
  it('允许只传部分字段', () => {
    const result = updateUserSchema.safeParse({ name: '李四' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('李四');
  });

  it('拒绝未知角色', () => {
    expect(updateUserSchema.safeParse({ role: 'superuser' }).success).toBe(false);
  });
});

describe('listUsersQuerySchema', () => {
  it('为分页参数补默认值', () => {
    const result = listUsersQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(10);
    }
  });

  it('把字符串分页参数转成数字', () => {
    const result = listUsersQuerySchema.safeParse({ page: '3', pageSize: '20' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.pageSize).toBe(20);
    }
  });
});
