import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { notificationsReducer } from '@store/slices/notifications.slice'
import { ordersReducer } from '@store/slices/orders.slice'
import { uiReducer } from '@store/slices/ui.slice'
import { rootSaga } from '@store/root-saga'

export function createStore() {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: {
      notifications: notificationsReducer,
      orders: ordersReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
  })

  sagaMiddleware.run(rootSaga)

  return store
}

export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
