/** 后端接口统一前缀，前端 proxy 与后端路由都引用它，避免两处硬编码不一致 */
export const API_PREFIX = '/api';

export const DEFAULT_PORT = 3001;

/** 角色枚举，供前端下拉框直接使用 */
export const USER_ROLES = ['admin', 'member'] as const;

export const USER_ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  admin: '管理员',
  member: '普通成员',
};
