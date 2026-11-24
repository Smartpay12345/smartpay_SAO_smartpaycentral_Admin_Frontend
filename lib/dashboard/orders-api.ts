import { call } from './call'
import type { OrdersOverview, OrdersList, OrderDetail, OrderTab } from './orders-types'

export const ordersApi = {
  overview: () => call<OrdersOverview>('orders-overview', {}),
  list: (p: { tab?: OrderTab; product?: string; station_id?: string; period?: string; search?: string; page?: number; page_size?: number } = {}) =>
    call<OrdersList>('orders-list', {
      ...p,
      tab: p.tab === 'all' ? undefined : p.tab,
      product: p.product === 'all' ? undefined : p.product,
      search: p.search?.trim() || undefined, // an empty search must not be sent
    }),
  detail: (order_id: string) => call<OrderDetail>('order-detail', { order_id }),
}