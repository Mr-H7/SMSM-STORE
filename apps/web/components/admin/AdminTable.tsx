export function AdminTable({
  headers,
  rows
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-[#343434] bg-[#1a1a1a]">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[#343434] bg-[#1d1d1d] text-[#d8d8d8]">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="smsm-heading whitespace-nowrap px-4 py-4 text-start text-[11px] font-semibold tracking-[0.14em]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[#2b2b2b] transition hover:bg-[#202020]">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-4 align-middle text-[#e1ded8]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
