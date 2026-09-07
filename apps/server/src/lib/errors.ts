/** 所有业务异常的基类，统一带 HTTP 状态码 */
export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: number;

  constructor(statusCode: number, message: string, code = statusCode) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = '请求参数错误') {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = '资源不存在') {
    super(404, message);
  }
}
