'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { logger } from '@lib/logger'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    logger.info('Web vital reportado', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    })
  })

  return null
}
