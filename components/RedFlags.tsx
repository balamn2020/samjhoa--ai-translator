"use client";

interface RedFlag {
  flag: string;
  why: string;
  source_quote: string | null;
  severity: "info" | "caution" | "high";
}

interface Props {
  flags: RedFlag[];
  groundingWarnings?: string[];
}

const severityStyles = {
  info: {
    bg: "bg-blue-50/90 dark:bg-blue-950/60",
    border: "border-blue-200 dark:border-blue-800",
    icon: "ℹ️",
    text: "text-blue-900 dark:text-blue-200",
    desc: "text-blue-800 dark:text-blue-300",
  },
  caution: {
    bg: "bg-amber-50/90 dark:bg-amber-950/60",
    border: "border-amber-200 dark:border-amber-800",
    icon: "⚠️",
    text: "text-amber-900 dark:text-amber-200",
    desc: "text-amber-800 dark:text-amber-300",
  },
  high: {
    bg: "bg-red-50/90 dark:bg-red-950/60",
    border: "border-red-300 dark:border-red-800",
    icon: "🚨",
    text: "text-red-900 dark:text-red-200",
    desc: "text-red-800 dark:text-red-300",
  },
};

export default function RedFlags({ flags, groundingWarnings = [] }: Props) {
  if (flags.length === 0) return null;

  // Sort: high first, then caution, then info
  const sorted = [...flags].sort((a, b) => {
    const order = { high: 0, caution: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-3">
      {sorted.map((flag, i) => {
        const style = severityStyles[flag.severity];
        const isUngrounded = groundingWarnings.includes(`red_flags[${i}].source_quote`);
        return (
          <div
            key={i}
            className={`${style.bg} ${style.border} border rounded-xl p-4 transition-colors`}
          >
            <div className={`font-bold text-base ${style.text} flex items-start gap-2`}>
              <span className="text-xl leading-none">{style.icon}</span>
              <span>{flag.flag}</span>
              {isUngrounded && (
                <span className="text-amber-500 text-sm font-normal" title="Check the original document">⚠️ check original</span>
              )}
            </div>
            <p className={`mt-1.5 text-sm ${style.desc} font-medium leading-relaxed`}>{flag.why}</p>
            {flag.source_quote && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 italic border-t border-gray-200 dark:border-gray-800 pt-2 font-mono">
                &quot;{flag.source_quote}&quot;
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

