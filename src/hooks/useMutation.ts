import {
  QueryKey,
  useMutation as useReactMutation,
  UseMutationResult,
  useQueryClient
} from 'react-query'

interface UseMutationProps<S, T> {
  mutationFn: (service: S) => Promise<T>
  onSuccess: (a: T) => void
  onError: (e: unknown) => void
  invalidateKeysOnSuccess?: QueryKey[]
  useErrorBoundary?: boolean
}

export const useMutation = <S, T>({
  mutationFn,
  onSuccess,
  onError,
  invalidateKeysOnSuccess,
  useErrorBoundary = false
}: UseMutationProps<S, T>): UseMutationResult<T, unknown, S> => {
  const qc = useQueryClient()

  return useReactMutation(mutationFn, {
    onSuccess: async (data) => {
      invalidateKeysOnSuccess &&
        (await Promise.all(
          invalidateKeysOnSuccess.map((key) => qc.invalidateQueries(key))
        ))
      onSuccess(data)
    },
    onError: (e) => onError(e),
    useErrorBoundary
  })
}

export type { UseMutationResult }