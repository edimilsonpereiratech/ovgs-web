'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// swagger-ui-react touches `window`/`document` at import time, so it can
// only run on the client — ssr must stay disabled here.
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI url="/openapi.yaml" />
    </div>
  )
}
