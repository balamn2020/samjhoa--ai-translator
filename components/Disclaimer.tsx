"use client";

export default function Disclaimer() {
  return (
    <div className="w-full bg-amber-50 dark:bg-neutral-950 border border-amber-200 dark:border-neutral-800 rounded-xl p-4 text-center transition-colors">
      <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold">
        ⚠️ This explains your document. It is <strong>not</strong> legal, financial or medical advice.
      </p>
    </div>
  );
}

