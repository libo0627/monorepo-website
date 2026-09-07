import type { CreateUserInput, Err, ListUsersQuery, Ok, Paged, User } from '@mono/shared';
import { API_PREFIX } from '@mono/shared';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });

  const payload = (await res.json()) as Ok<T> | Err;
  if (!res.ok || payload.code !== 0) {
    throw new Error(payload.message);
  }
  return payload.data;
}

function toQuery(params: Partial<ListUsersQuery> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  listUsers(params: Partial<ListUsersQuery> = {}) {
    return request<Paged<User>>(`/users${toQuery(params)}`);
  },

  createUser(input: CreateUserInput) {
    return request<User>('/users', { method: 'POST', body: JSON.stringify(input) });
  },

  deleteUser(id: string) {
    return request<{ id: string }>(`/users/${id}`, { method: 'DELETE' });
  },
};
