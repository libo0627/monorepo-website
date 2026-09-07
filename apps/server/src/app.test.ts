import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { CreateUserInput, Err, Ok, Paged, User } from '@mono/shared';
import { createApp } from './app';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp().listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

async function request<T>(path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, init);
  const body = (await res.json()) as T;
  return { status: res.status, body };
}

const jsonInit = (payload: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

describe('health', () => {
  it('返回 ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const body = (await res.json()) as { status: string };
    expect(res.status).toBe(200);
    expect(body.status).toBe('ok');
  });
});

describe('GET /api/users', () => {
  it('返回分页数据', async () => {
    const { status, body } = await request<Ok<Paged<User>>>('/api/users?page=1&pageSize=2');
    expect(status).toBe(200);
    expect(body.data.pageSize).toBe(2);
    expect(body.data.items).toHaveLength(2);
    expect(body.data.total).toBeGreaterThanOrEqual(3);
  });

  it('支持 keyword 过滤', async () => {
    const { body } = await request<Ok<Paged<User>>>(
      '/api/users?keyword=' + encodeURIComponent('张三'),
    );
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0]?.name).toBe('张三');
  });
});

describe('POST /api/users', () => {
  it('拒绝非法邮箱', async () => {
    const { status, body } = await request<Err>(
      '/api/users',
      jsonInit({ name: '赵六', email: 'not-an-email', role: 'member' } satisfies CreateUserInput),
    );
    expect(status).toBe(400);
    expect(body.code).toBe(400);
  });

  it('创建成功返回 201', async () => {
    const { status, body } = await request<Ok<User>>(
      '/api/users',
      jsonInit({
        name: '赵六',
        email: 'zhaoliu@example.com',
        role: 'member',
      } satisfies CreateUserInput),
    );
    expect(status).toBe(201);
    expect(body.data.id).toBeTruthy();
    expect(body.data.role).toBe('member');
  });
});

describe('错误处理', () => {
  it('不存在的用户返回 404', async () => {
    const { status, body } = await request<Err>('/api/users/u_not_exist');
    expect(status).toBe(404);
    expect(body.data).toBeNull();
  });

  it('未匹配的路由返回统一的 404 信封', async () => {
    const { status, body } = await request<Err>('/api/unknown');
    expect(status).toBe(404);
    expect(body.message).toBe('接口不存在');
  });
});
