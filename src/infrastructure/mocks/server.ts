import { setupServer } from 'msw/node'
import { handlers } from '@infrastructure/mocks/handlers'

export const server = setupServer(...handlers)
