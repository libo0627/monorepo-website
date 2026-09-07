import { PRIZE_IMAGE_MAP } from './resources';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/activities/turkish-wheel${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', 'x-user-id': 'demo-user', ...init?.headers },
  });
  const payload = (await res.json()) as { code: number; message: string; data: T };
  if (!res.ok || payload.code !== 0) {
    throw new Error(payload.message);
  }
  return payload.data;
}

// ──────────────────────────────────────────────
// 类型
// ──────────────────────────────────────────────

export interface Prize {
  id: string;
  name: string;
  imageKey: string;
  rate: string;
  count: number;
  giftType: string;
  giftId: number;
  prob: number;
  sort: number;
  active: boolean;
}

export interface Task {
  id: string;
  taskType: number;
  taskDesc: string;
  taskValue: number;
  currentValue: number;
  status: number; // 0进行中 1可领取 2已领取
  drawReward: number;
  giftBagId: number;
  sort: number;
}

export interface Marquee {
  nickname: string;
  avatar: string;
  gold: number;
  uid: string;
}

export interface HomeInfo {
  drawCount: number;
  prizeList: Prize[];
  taskList: Task[];
  marqueeList: Marquee[];
}

export interface DrawResult {
  id: string;
  drawType: number;
  prizes: Array<{ name: string; image: string; count: number; giftType: string; giftId: number }>;
  createdAt: string;
}

export interface DrawRecord {
  id: string;
  userId: string;
  drawType: number;
  prizes: Array<{ name: string; image: string; count: number; giftType: string; giftId: number }>;
  createdAt: string;
}

export interface PagedRecords {
  items: DrawRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// ──────────────────────────────────────────────
// API
// ──────────────────────────────────────────────

export const activityApi = {
  getHome: () => request<HomeInfo>('/home'),

  draw: (type: number) =>
    request<DrawResult>('/draw', { method: 'POST', body: JSON.stringify({ type }) }),

  listTasks: () => request<Task[]>('/tasks'),

  claimTask: (taskType: number) =>
    request<{ drawReward: number; drawCount: number }>(`/tasks/${taskType}/claim`, {
      method: 'PATCH',
    }),

  listRecords: (page = 1, pageSize = 10) =>
    request<PagedRecords>(`/records?page=${page}&pageSize=${pageSize}`),

  deleteRecord: (id: string) => request<{ id: string }>(`/records/${id}`, { method: 'DELETE' }),

  // 奖品配置 CRUD
  listPrizes: () => request<Prize[]>('/prizes'),
  createPrize: (input: Partial<Prize>) =>
    request<Prize>('/prizes', { method: 'POST', body: JSON.stringify(input) }),
  updatePrize: (id: string, input: Partial<Prize>) =>
    request<Prize>(`/prizes/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deletePrize: (id: string) => request<{ id: string }>(`/prizes/${id}`, { method: 'DELETE' }),
};

/** 将后端返回的 imageKey 映射为实际图片 URL */
export function resolvePrizeImage(imageKey: string): string {
  return PRIZE_IMAGE_MAP[imageKey] || PRIZE_IMAGE_MAP['reward_1'] || '';
}
