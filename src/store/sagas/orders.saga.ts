import { call, put, take, takeEvery } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  confirmScheduling,
  rescheduleScheduling,
} from '@application/orders/schedule-order.use-case'
import type { PaginatedResult } from '@application/ports/order.repository'
import type { Order } from '@domain/entities/order'
import { isSchedulingCapacityExceeded } from '@domain/rules/scheduling-capacity'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { notify } from '@store/slices/notifications.slice'
import {
  schedulingConflictAcknowledged,
  schedulingConflictDetected,
  schedulingFailed,
  schedulingRequested,
  schedulingSucceeded,
  type SchedulingRequestPayload,
} from '@store/slices/orders.slice'

function* runSchedulingFlow(action: PayloadAction<SchedulingRequestPayload>) {
  const { order, input, mode } = action.payload

  try {
    const existing: PaginatedResult<Order> = yield call(orderHttpRepository.list, {
      transportTypeId: order.transportTypeId,
      status: 'AGENDADA',
    })

    const sameWindowCount = existing.items.filter(
      (candidate: Order) =>
        candidate.id !== order.id &&
        candidate.scheduling?.deliveryDate === input.deliveryDate &&
        candidate.scheduling?.timeWindow.start === input.timeWindow.start,
    ).length

    if (isSchedulingCapacityExceeded(sameWindowCount)) {
      yield put(schedulingConflictDetected({ count: sameWindowCount }))

      const resolution: PayloadAction<{ proceed: boolean }> = yield take(
        schedulingConflictAcknowledged.type,
      )

      if (!resolution.payload.proceed) {
        yield put(schedulingFailed('Agendamento cancelado pelo usuário'))
        return
      }
    }

    const updated: Order =
      mode === 'confirm'
        ? yield call(confirmScheduling, orderHttpRepository, order, input)
        : yield call(rescheduleScheduling, orderHttpRepository, order, input)

    yield put(schedulingSucceeded(updated))
    yield put(
      notify(
        'success',
        mode === 'confirm' ? 'Entrega agendada com sucesso' : 'Entrega reagendada com sucesso',
      ),
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao processar agendamento'
    yield put(schedulingFailed(message))
    yield put(notify('error', message))
  }
}

export function* ordersSaga() {
  yield takeEvery(schedulingRequested.type, runSchedulingFlow)
}
