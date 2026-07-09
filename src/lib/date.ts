import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(value: string): string {
  return format(parseISO(value), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDateTime(value: string): string {
  return format(parseISO(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}
