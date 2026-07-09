import type { Item } from '@domain/entities/item'

const CATALOG = [
  'Cimento CP-II 50kg',
  'Bloco de concreto estrutural',
  'Vergalhão de aço 10mm',
  'Chapa de compensado 18mm',
  'Tijolo cerâmico 6 furos',
  'Argamassa AC-III 20kg',
  'Telha metálica ondulada',
  'Cabo elétrico 2.5mm 100m',
  'Tubo PVC esgoto 100mm',
  'Tinta acrílica 18L',
  'Piso porcelanato 60x60',
  'Perfil de aço galvanizado',
  'Areia média ensacada',
  'Brita 1 ensacada',
  'Manta asfáltica',
  'Porta de madeira maciça',
  'Janela de alumínio 120x100',
  'Kit de fixação para drywall',
]

export const items: Item[] = CATALOG.map((name, index) => ({
  id: crypto.randomUUID(),
  sku: `SKU-${String(1000 + index)}`,
  name,
  createdAt: new Date(2024, 0, index + 1).toISOString(),
}))
