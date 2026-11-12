"use client";

interface MoneyItem {
  label: string;
  amount: string;
  due: string | null;
  source_quote: string;
}

interface Props {
  items: MoneyItem[];
  groundingWarnings?: string[];
}

export default function MoneyTable({ items, groundingWarnings = [] }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-neutral-900">
            <th className="text-left p-3 text-sm font-semibold text-gray-800 dark:text-gray-200 rounded-tl-lg">What</th>
            <th className="text-right p-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Amount</th>
            <th className="text-right p-3 text-sm font-semibold text-gray-800 dark:text-gray-200 rounded-tr-lg">Due</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const isUngrounded = groundingWarnings.includes(`money[${i}].source_quote`);
            return (
              <tr key={i} className="border-b border-gray-100 dark:border-neutral-800">
                <td className="p-3 text-base text-gray-900 dark:text-gray-100 font-medium">
                  {item.label}
                  {isUngrounded && (
                    <span className="ml-1 text-amber-500" title="Check the original document">⚠️</span>
                  )}
                </td>
                <td className="p-3 text-base text-gray-950 dark:text-white font-bold text-right">{item.amount}</td>
                <td className="p-3 text-base text-gray-700 dark:text-gray-300 text-right font-medium">{item.due || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

