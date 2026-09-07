import type { CreateUserInput, ListUsersQuery, Paged, UpdateUserInput, User } from '@mono/shared';
import { NotFoundError } from '../lib/errors';

/**
 * 演示用的内存存储。
 * 等要接数据库时，只替换这个文件里的实现即可，路由层不用动。
 */
const store = new Map<string, User>();

function seed() {
  const now = new Date('2026-01-01T00:00:00.000Z').toISOString();
  const initial: User[] = [
    { id: 'u_1', name: '张三', email: 'zhangsan@example.com', role: 'admin', createdAt: now },
    { id: 'u_2', name: '李四', email: 'lisi@example.com', role: 'member', createdAt: now },
    { id: 'u_3', name: '王五', email: 'wangwu@example.com', role: 'member', createdAt: now },
  ];
  for (const user of initial) store.set(user.id, user);
}
seed();

let sequence = store.size;

export function listUsers(query: ListUsersQuery): Paged<User> {
  let items = [...store.values()];

  if (query.keyword) {
    const keyword = query.keyword.toLowerCase();
    items = items.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword),
    );
  }
  if (query.role) {
    items = items.filter((user) => user.role === query.role);
  }

  const total = items.length;
  const start = (query.page - 1) * query.pageSize;
  return {
    items: items.slice(start, start + query.pageSize),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export function getUser(id: string): User {
  const user = store.get(id);
  if (!user) throw new NotFoundError(`用户 ${id} 不存在`);
  return user;
}

export function createUser(input: CreateUserInput): User {
  const id = `u_${++sequence}`;
  const user: User = { id, ...input, createdAt: new Date().toISOString() };
  store.set(id, user);
  return user;
}

export function updateUser(id: string, input: UpdateUserInput): User {
  const existing = getUser(id);
  const updated: User = { ...existing, ...input };
  store.set(id, updated);
  return updated;
}

export function deleteUser(id: string): { id: string } {
  getUser(id);
  store.delete(id);
  return { id };
}
