interface StationRow {
  stationId: string
  location: string
  totalSales: string
  amount: string
  noOfSales: number
  date: string
}

interface StationTransactionTableProps {
  rows: StationRow[]
  onRowClick: (row: StationRow) => void
}

// const exportColumns: ExportColumn<StationRow>[] = [
//   { key: 'stationId', header: 'STATION ID' },
//   { key: 'location', header: 'LOCATION' },
//   { key: 'totalSales', header: 'TOTAL SALES (₦)' },
//   { key: 'amount', header: 'AMOUNT (₦)' },
//   { key: 'noOfSales', header: 'NO. OF SALES' },
//   { key: 'date', header: 'DATE' },
// ]

export function StationTransactionTable({ rows, onRowClick }: StationTransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-400">
            <th className="py-2 font-normal">STATION ID</th>
            <th className="py-2 font-normal">LOCATION</th>
            <th className="py-2 font-normal">TOTAL SALES (₦)</th>
            <th className="py-2 font-normal">AMOUNT (₦)</th>
            <th className="py-2 font-normal">NO. OF SALES</th>
            <th className="py-2 font-normal">DATE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRowClick(r)} className="cursor-pointer border-b transition-colors hover:bg-gray-50">
              <td className="py-3 font-medium">{r.stationId}</td>
              <td className="py-3">{r.location}</td>
              <td className="py-3 text-gray-400">{r.totalSales}</td>
              <td className="py-3 font-medium">{r.amount}</td>
              <td className="py-3">{r.noOfSales}</td>
              <td className="py-3 text-gray-400">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}