import { all } from 'redux-saga/effects'
import { notificationsSaga } from '@store/sagas/notifications.saga'
import { ordersSaga } from '@store/sagas/orders.saga'

export function* rootSaga() {
  yield all([notificationsSaga(), ordersSaga()])
}
