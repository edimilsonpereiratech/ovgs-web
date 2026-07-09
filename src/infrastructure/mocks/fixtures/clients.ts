import type { Client } from '@domain/entities/client'
import { transportTypes } from '@infrastructure/mocks/fixtures/transport-types'

function authorizedIds(...names: string[]): string[] {
  return transportTypes.filter((type) => names.includes(type.name)).map((type) => type.id)
}

const COMPANIES: Array<Pick<Client, 'name' | 'document'> & { transportNames: string[] }> = [
  {
    name: 'Acme Indústria Ltda.',
    document: '12.345.678/0001-90',
    transportNames: ['Caminhão', 'Carreta'],
  },
  {
    name: 'Comercial São Bento S.A.',
    document: '23.456.789/0001-01',
    transportNames: ['Caminhão'],
  },
  {
    name: 'Transportes União Ltda.',
    document: '34.567.890/0001-12',
    transportNames: ['Bi-truck', 'Carreta'],
  },
  {
    name: 'Construtora Horizonte Ltda.',
    document: '45.678.901/0001-23',
    transportNames: ['Caminhão', 'Van'],
  },
  {
    name: 'Distribuidora Nova Era Ltda.',
    document: '56.789.012/0001-34',
    transportNames: ['Van', 'Utilitário'],
  },
  {
    name: 'Alpha Materiais de Construção',
    document: '67.890.123/0001-45',
    transportNames: ['Caminhão', 'Bi-truck'],
  },
  {
    name: 'Beta Logística e Cargas',
    document: '78.901.234/0001-56',
    transportNames: ['Carreta', 'Bi-truck'],
  },
  {
    name: 'Comercial Campinas Ltda.',
    document: '89.012.345/0001-67',
    transportNames: ['Utilitário'],
  },
]

export const clients: Client[] = COMPANIES.map((company, index) => ({
  id: crypto.randomUUID(),
  name: company.name,
  document: company.document,
  authorizedTransportTypeIds: authorizedIds(...company.transportNames),
  createdAt: new Date(2024, 0, index + 1).toISOString(),
}))
