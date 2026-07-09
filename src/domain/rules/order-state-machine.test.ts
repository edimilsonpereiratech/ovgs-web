import { InvalidTransitionError } from '@domain/errors/invalid-transition.error'
import {
  assertValidTransition,
  canTransition,
  getNextStatus,
  isTerminalStatus,
} from '@domain/rules/order-state-machine'
import { ORDER_STATUS_SEQUENCE } from '@domain/value-objects/order-status'

describe('order-state-machine', () => {
  it('advances through the full sequence in order', () => {
    for (let i = 0; i < ORDER_STATUS_SEQUENCE.length - 1; i++) {
      expect(getNextStatus(ORDER_STATUS_SEQUENCE[i])).toBe(ORDER_STATUS_SEQUENCE[i + 1])
    }
  })

  it('has no next status for the terminal status', () => {
    expect(getNextStatus('ENTREGUE')).toBeNull()
    expect(isTerminalStatus('ENTREGUE')).toBe(true)
  })

  it('only allows sequential transitions, never skipping a step', () => {
    expect(canTransition('CRIADA', 'PLANEJADA')).toBe(true)
    expect(canTransition('CRIADA', 'AGENDADA')).toBe(false)
    expect(canTransition('AGENDADA', 'CRIADA')).toBe(false)
  })

  it('throws InvalidTransitionError for a disallowed transition', () => {
    expect(() => assertValidTransition('CRIADA', 'EM_TRANSPORTE')).toThrow(InvalidTransitionError)
  })

  it('does not throw for a valid transition', () => {
    expect(() => assertValidTransition('PLANEJADA', 'AGENDADA')).not.toThrow()
  })
})
