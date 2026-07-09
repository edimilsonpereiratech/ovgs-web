import { TransportNotAuthorizedError } from '@domain/errors/transport-not-authorized.error'
import type { Client } from '@domain/entities/client'

export function isTransportAuthorized(client: Client, transportTypeId: string): boolean {
  return client.authorizedTransportTypeIds.includes(transportTypeId)
}

export function assertTransportAuthorized(client: Client, transportTypeId: string): void {
  if (!isTransportAuthorized(client, transportTypeId)) {
    throw new TransportNotAuthorizedError(client.id, transportTypeId)
  }
}
