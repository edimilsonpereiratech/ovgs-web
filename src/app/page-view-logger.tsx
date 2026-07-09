'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { logger } from '@lib/logger'

export function PageViewLogger() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.toString()
    logger.info('Tela visualizada', { path: query ? `${pathname}?${query}` : pathname })
  }, [pathname, searchParams])

  return null
}
