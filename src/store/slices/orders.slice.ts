import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Order } from '@domain/entities/order'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'

export type SchedulingMode = 'confirm' | 'reschedule'

export interface SchedulingRequestPayload {
  order: Order
  input: CreateSchedulingInput
  mode: SchedulingMode
}

interface OrdersState {
  isProcessing: boolean
  conflict: { count: number } | null
  lastUpdatedOrder: Order | null
  lastError: string | null
}

const initialState: OrdersState = {
  isProcessing: false,
  conflict: null,
  lastUpdatedOrder: null,
  lastError: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    schedulingRequested: (state, _action: PayloadAction<SchedulingRequestPayload>) => {
      state.isProcessing = true
      state.conflict = null
      state.lastUpdatedOrder = null
      state.lastError = null
    },
    schedulingConflictDetected: (state, action: PayloadAction<{ count: number }>) => {
      state.conflict = action.payload
    },
    schedulingConflictAcknowledged: (state, _action: PayloadAction<{ proceed: boolean }>) => {
      state.conflict = null
    },
    schedulingSucceeded: (state, action: PayloadAction<Order>) => {
      state.isProcessing = false
      state.lastUpdatedOrder = action.payload
    },
    schedulingFailed: (state, action: PayloadAction<string>) => {
      state.isProcessing = false
      state.lastError = action.payload
    },
  },
})

export const {
  schedulingRequested,
  schedulingConflictDetected,
  schedulingConflictAcknowledged,
  schedulingSucceeded,
  schedulingFailed,
} = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer
