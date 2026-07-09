import { AUDIT_ACTION_LABELS, AuditActionSchema, AuditLogSchema } from '@domain/entities/audit-log'

const VALID_LOG = {
  id: '11111111-1111-4111-8111-111111111111',
  orderId: '22222222-2222-4222-8222-222222222222',
  action: 'STATUS_CHANGED',
  previousState: 'CRIADA',
  newState: 'PLANEJADA',
  occurredAt: '2026-01-01T10:00:00.000Z',
}

describe('AuditActionSchema', () => {
  it('accepts every known audit action', () => {
    for (const action of Object.keys(AUDIT_ACTION_LABELS)) {
      expect(AuditActionSchema.safeParse(action).success).toBe(true)
    }
  })

  it('rejects an action outside the known set', () => {
    expect(AuditActionSchema.safeParse('SOMETHING_ELSE').success).toBe(false)
  })
})

describe('AuditLogSchema', () => {
  it('accepts a log entry with nullable previous/new state', () => {
    expect(
      AuditLogSchema.safeParse({ ...VALID_LOG, previousState: null, newState: null }).success,
    ).toBe(true)
  })

  it('rejects a log entry with a malformed occurredAt timestamp', () => {
    expect(AuditLogSchema.safeParse({ ...VALID_LOG, occurredAt: 'not-a-date' }).success).toBe(false)
  })
})

describe('AUDIT_ACTION_LABELS', () => {
  it('has a human-readable label for every action in the schema', () => {
    for (const action of AuditActionSchema.options) {
      expect(AUDIT_ACTION_LABELS[action]).toBeTruthy()
    }
  })
})
