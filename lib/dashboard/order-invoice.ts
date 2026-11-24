// lib/dashboard/order-invoice.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatAmountPlain, formatLagosDate, formatLagosDateTime, formatNumber } from './format'
import { formatExpected, formatOrderId } from './format'
import type { OrderDetail } from './orders-types'

const BRAND: [number, number, number] = [185, 28, 28] // same red as the export PDF

// jsPDF's built-in font has no ₦ glyph
const ngn = (n: number) => `NGN ${formatAmountPlain(n)}`

export function downloadOrderInvoice({ order, personnel, logistics }: OrderDetail) {
  const doc = new jsPDF()
  const { destination, origin } = logistics

  // header
  doc.setFontSize(18)
  doc.setTextColor(...BRAND)
  doc.text('Invoice', 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(60)
  doc.text(formatOrderId(order.order_code), 196, 14, { align: 'right' })
  doc.text(`Status: ${order.status_label}`, 196, 20, { align: 'right' })
  doc.text(`Date requested: ${formatLagosDate(order.date)}`, 196, 26, { align: 'right' })
  doc.text(`Last updated: ${formatLagosDateTime(order.last_updated)}`, 196, 32, { align: 'right' })

  // deliver to (left) and origin (right)
  const deliverTo = [
    destination.name,
    `${destination.station_code} · ${destination.state_label}${destination.city ? ` · ${destination.city}` : ''}`,
    destination.address,
    personnel && `Station manager: ${personnel.full_name}${personnel.phone ? ` (${personnel.phone})` : ''}`,
  ].filter(Boolean) as string[]

  const from = [
    origin ? origin.depot : 'Origin not set yet',
    origin?.terminal,
    `Expected delivery: ${formatExpected(order.expected_delivery)}`,
  ].filter(Boolean) as string[]

  doc.setFont('helvetica', 'bold')
  doc.text('Deliver to', 14, 44)
  doc.text('Origin', 110, 44)
  doc.setFont('helvetica', 'normal')
  deliverTo.forEach((line, i) => doc.text(line, 14, 50 + i * 5))
  from.forEach((line, i) => doc.text(line, 110, 50 + i * 5))

  // items
  autoTable(doc, {
    startY: 50 + Math.max(deliverTo.length, from.length) * 5 + 8,
    head: [['Product', 'Quantity', 'Unit price', 'Total']],
    body: [[
      order.product_full_name,
      `${formatNumber(order.quantity)} ${order.unit}`,
      `${ngn(order.unit_price)} / ${order.unit}`,
      ngn(order.total_value),
    ]],
    foot: [['', '', 'Total', ngn(order.total_value)]],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: BRAND },
    footStyles: { fillColor: [250, 250, 250], textColor: 20, fontStyle: 'bold' },
  })

  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text('Powered by smartpay', 105, 287, { align: 'center' })

  doc.save(`invoice-${order.order_code}.pdf`)
}