/** 统一成功响应信封，结构来自 @mono/shared 的 Ok<T> */
export function ok<T>(data: T) {
  return { code: 0, message: 'ok', data } as const;
}
