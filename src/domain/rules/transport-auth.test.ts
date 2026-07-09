import type { Client } from '@domain/entities/client'
import { TransportNotAuthorizedError } from '@domain/errors/transport-not-authorized.error'
import { assertTransportAuthorized, isTransportAuthorized } from '@domain/rules/transport-auth'

function buildClient(authorizedTransportTypeIds: string[]): Client {
  return {
    id: 'a3f3c1a0-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    name: 'Cliente Teste',
    document: '12345678900',
    authorizedTransportTypeIds,
    createdAt: new Date().toISOString(),
  }
}

describe('transport-auth', () => {
  it('authorizes a transport type present in the client allow-list', () => {
    const client = buildClient(['truck-1'])
    expect(isTransportAuthorized(client, 'truck-1')).toBe(true)
  })

  it('rejects a transport type absent from the client allow-list', () => {
    const client = buildClient(['truck-1'])
    expect(isTransportAuthorized(client, 'truck-2')).toBe(false)
  })

  it('throws TransportNotAuthorizedError when asserting an unauthorized transport', () => {
    const client = buildClient([])
    expect(() => assertTransportAuthorized(client, 'truck-1')).toThrow(TransportNotAuthorizedError)
  })

  it('does not throw when asserting an authorized transport', () => {
    const client = buildClient(['truck-1'])
    expect(() => assertTransportAuthorized(client, 'truck-1')).not.toThrow()
  })
})
