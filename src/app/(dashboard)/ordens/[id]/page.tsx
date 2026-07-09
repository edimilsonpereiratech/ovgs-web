import { OrderDetailPage } from '@presentation/features/orders/containers/order-detail-page'

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetailPage orderId={params.id} />
}
