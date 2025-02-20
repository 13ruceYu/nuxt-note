import type { FetchError } from '~/types/error'
import { USER_FACING_ERROR_CODES } from '~/types/error'

export function useErrorHandler() {
  const toast = useToast()

  function handleError(error: any) {
    console.error('Error:', error)

    // 处理 Fetch 错误
    if (error?.statusCode) {
      const fetchError = error as FetchError

      // 判断是否需要显示给用户
      if (USER_FACING_ERROR_CODES.includes(fetchError.statusCode)) {
        toast.add({
          title: 'Error',
          description: fetchError.statusMessage || fetchError.data?.message,
          color: 'red',
        })
        return
      }
    }
  }

  return {
    handleError,
  }
}

