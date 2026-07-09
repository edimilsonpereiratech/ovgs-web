import { auditHandlers } from '@infrastructure/mocks/handlers/audit'
import { clientHandlers } from '@infrastructure/mocks/handlers/clients'
import { itemHandlers } from '@infrastructure/mocks/handlers/items'
import { orderHandlers } from '@infrastructure/mocks/handlers/orders'
import { transportTypeHandlers } from '@infrastructure/mocks/handlers/transport-types'

export const handlers = [
  ...clientHandlers,
  ...transportTypeHandlers,
  ...itemHandlers,
  ...orderHandlers,
  ...auditHandlers,
]
