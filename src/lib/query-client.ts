import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { logger } from '@lib/logger'

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        logger.error('Falha ao buscar dados', {
          queryKey: query.queryKey,
          error: toErrorMessage(error),
        })
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (!mutation.options.mutationKey) return
        logger.info('Mutação concluída', { mutationKey: mutation.options.mutationKey })
      },
      onError: (error, _variables, _context, mutation) => {
        logger.error('Falha ao executar mutação', {
          mutationKey: mutation.options.mutationKey,
          error: toErrorMessage(error),
        })
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
