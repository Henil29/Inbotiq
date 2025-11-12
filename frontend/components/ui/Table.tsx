"use client";
type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
};

export default function Table<T extends { _id?: string }>({ columns, data, emptyText = "No data" }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full">
        <thead className="bg-white/5 text-left text-sm text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-2 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-sm">
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-gray-400" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={(row as any)._id ?? idx} className="hover:bg-white/5">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-2">
                    {col.render ? col.render(row) : String((row as any)[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
