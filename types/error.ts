export interface ApiErrorData {
  code?: number
  message: string
  data?: any
}

export interface FetchError {
  statusCode: number
  statusMessage: string
  data: ApiErrorData
}

// 定义哪些状态码需要显示给用户
export const USER_FACING_ERROR_CODES = [
  400, // 参数错误
  401, // 未授权
  403, // 禁止访问
  404, // 未找到
]