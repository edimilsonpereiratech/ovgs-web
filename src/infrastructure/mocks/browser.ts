import { setupWorker } from 'msw/browser'
import { handlers } from '@infrastructure/mocks/handlers'

export const worker = setupWorker(...handlers)
