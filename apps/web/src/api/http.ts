/**
 * 统一请求封装（基于 fetch，无第三方依赖）。
 *
 * 约定：
 * - baseURL 默认 '/api'，Vite dev 会代理到后端；生产环境用 VITE_API_BASE 覆盖
 * - 后端统一信封：{ code: 0, message: 'ok', data }，code !== 0 视为业务失败
 * - 失败时 reject 一个带 msg / code 的 Error，供 utils.to 消费
 */

const BASE_URL = import.meta.env.VITE_API_BASE || '/api';

export interface ApiError extends Error {
  code?: number;
  msg?: string;
  response?: unknown;
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = (await res.json().catch(() => null)) as {
    code?: number;
    message?: string;
    data?: unknown;
  } | null;

  if (!res.ok || (payload && payload.code !== 0)) {
    const message = payload?.message || `请求失败(${res.status})`;
    const err = new Error(message) as ApiError;
    err.code = payload?.code ?? res.status;
    err.msg = message;
    err.response = payload;
    throw err;
  }

  return payload as T;
}

const http = {
  get: <T = unknown>(url: string) => request<T>('GET', url),

  post: <T = unknown>(url: string, body?: unknown) => request<T>('POST', url, body),

  put: <T = unknown>(url: string, body?: unknown) => request<T>('PUT', url, body),

  del: <T = unknown>(url: string) => request<T>('DELETE', url),
};

export default http;
