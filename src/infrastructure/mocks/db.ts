import type { AuditLog } from '@domain/entities/audit-log'
import type { Client } from '@domain/entities/client'
import type { Item } from '@domain/entities/item'
import type { Order } from '@domain/entities/order'
import type { TransportType } from '@domain/entities/transport-type'
import { clients } from '@infrastructure/mocks/fixtures/clients'
import { items } from '@infrastructure/mocks/fixtures/items'
import { auditLogs, orders } from '@infrastructure/mocks/fixtures/order-seed'
import { transportTypes } from '@infrastructure/mocks/fixtures/transport-types'

interface Database {
  clients: Client[]
  transportTypes: TransportType[]
  items: Item[]
  orders: Order[]
  auditLogs: AuditLog[]
}

export const db: Database = {
  clients: [...clients],
  transportTypes: [...transportTypes],
  items: [...items],
  orders: [...orders],
  auditLogs: [...auditLogs],
}
