import { delay, put, takeEvery } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { dismissNotification, notify, type Notification } from '@store/slices/notifications.slice'

const AUTO_DISMISS_MS = 4000

function* autoDismiss(action: PayloadAction<Notification>) {
  yield delay(AUTO_DISMISS_MS)
  yield put(dismissNotification(action.payload.id))
}

export function* notificationsSaga() {
  yield takeEvery(notify.type, autoDismiss)
}
