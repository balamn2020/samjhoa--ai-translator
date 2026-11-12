"use client";

import type { Explanation, SupportedLanguage } from "@/lib/schemas";
import type { GroundingWarning } from "@/lib/grounding";
import { countdown } from "@/lib/dates";
import MoneyTable from "./MoneyTable";
import RedFlags from "./RedFlags";
import ListenButton from "./ListenButton";
import Disclaimer from "./Disclaimer";

interface Props {
  explanation: Explanation;
  language: SupportedLanguage;
  today: string;
  groundingWarnings?: GroundingWarning[];
  onBack: () => void;
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xs border border-gray-100 dark:border-neutral-800 p-5 transition-colors">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ResultView({
  explanation,
  language,
  today,
  groundingWarnings = [],
  onBack,
}: Props) {
  const warningPaths = groundingWarnings.map((w) => w.path);

  // Compute countdown
  const deadlineCountdown = countdown(explanation.deadline.date_iso, today);

  // Build read-aloud text
  const listenText = [
    explanation.one_line_summary,
    ...explanation.what_they_want.map((w) => w.action),
    explanation.deadline.description,
    ...explanation.if_you_ignore,
    ...explanation.money.map((m) => `${m.label}: ${m.amount}`),
    ...explanation.red_flags.map((f) => f.flag + ". " + f.why),
  ].join(". ");

  const urgencyColors = {
    overdue: "bg-red-50 dark:bg-neutral-900 text-red-800 dark:text-red-300 border-red-300 dark:border-red-900/60",
    urgent: "bg-orange-50 dark:bg-neutral-900 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-900/60",
    soon: "bg-yellow-50 dark:bg-neutral-900 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-900/60",
    normal: "bg-green-50 dark:bg-neutral-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-900/60",
    unknown: "bg-gray-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-neutral-800",
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-blue-600 dark:text-blue-400 text-base font-semibold hover:underline inline-flex items-center gap-1.5 transition-colors"
      >
        ← New document
      </button>

      {/* One-line summary */}
      <div className="bg-blue-50 dark:bg-neutral-950 border border-blue-200 dark:border-neutral-800 rounded-2xl p-5 transition-colors">
        <p className="text-xl font-bold text-blue-950 dark:text-blue-100">{explanation.one_line_summary}</p>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 capitalize font-medium">{explanation.doc_type.replace(/_/g, " ")}</p>
      </div>

      {/* Listen */}
      <div className="flex items-center gap-3">
        <ListenButton text={listenText} language={language} />
      </div>

      {/* What they want */}
      {explanation.what_they_want.length > 0 && (
        <Section title="What they want from you" icon="📋">
          <ul className="space-y-3">
            {explanation.what_they_want.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-neutral-850 text-blue-800 dark:text-blue-200 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{item.action}</p>
                  {item.confidence === "low" && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠️ check the original</span>
                  )}
                  {item.source_quote && (
                    <p className="text-xs text-gray-500 dark:text-gray-300 italic mt-1 font-mono">&quot;{item.source_quote}&quot;</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Deadline */}
      <Section title="By when" icon="📅">
        <div className={`inline-block px-4 py-2 rounded-xl border-2 font-bold text-base ${urgencyColors[deadlineCountdown.urgency]}`}>
          {deadlineCountdown.label}
        </div>
        <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-2 leading-relaxed">{explanation.deadline.description}</p>
        {explanation.deadline.source_quote && (
          <p className="text-xs text-gray-500 dark:text-gray-300 italic mt-1 font-mono">&quot;{explanation.deadline.source_quote}&quot;</p>
        )}
      </Section>

      {/* If you ignore */}
      {explanation.if_you_ignore.length > 0 && (
        <Section title="If you ignore this" icon="⏰">
          <ul className="space-y-2">
            {explanation.if_you_ignore.map((item, i) => (
              <li key={i} className="text-base font-medium text-gray-900 dark:text-gray-100 flex items-start gap-2 leading-relaxed">
                <span className="text-red-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Money */}
      {explanation.money.length > 0 && (
        <Section title="Money" icon="💰">
          <MoneyTable items={explanation.money} groundingWarnings={warningPaths} />
        </Section>
      )}

      {/* Red flags */}
      {explanation.red_flags.length > 0 && (
        <Section title="Watch out" icon="🔍">
          <RedFlags flags={explanation.red_flags} groundingWarnings={warningPaths} />
        </Section>
      )}

      {/* Who to contact */}
      {explanation.who_to_contact.length > 0 && (
        <Section title="Who to contact" icon="📞">
          <ul className="space-y-3">
            {explanation.who_to_contact.map((contact, i) => (
              <li key={i} className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl p-3.5 transition-colors">
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{contact.name}</p>
                <p className="text-base text-gray-700 dark:text-gray-200 mt-0.5">{contact.detail}</p>
                {warningPaths.includes(`who_to_contact[${i}].source_quote`) && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠️ check the original</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Not stated */}
      {explanation.not_stated.length > 0 && (
        <Section title="Not stated in this document" icon="❓">
          <ul className="space-y-1.5">
            {explanation.not_stated.map((item, i) => (
              <li key={i} className="text-base text-gray-600 dark:text-gray-300 italic">
                — {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Persistent disclaimer */}
      <Disclaimer />
    </div>
  );
}

