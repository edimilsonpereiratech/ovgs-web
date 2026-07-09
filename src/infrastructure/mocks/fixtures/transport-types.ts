import type { TransportType } from '@domain/entities/transport-type'

const NAMES = ['Caminhão', 'Carreta', 'Bi-truck', 'Van', 'Utilitário']

export const transportTypes: TransportType[] = NAMES.map((name, index) => ({
  id: crypto.randomUUID(),
  name,
  createdAt: new Date(2024, 0, index + 1).toISOString(),
}))
