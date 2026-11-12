"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  AlertTriangle,
  Receipt,
  Home,
  Shield,
  FileCheck,
  CreditCard,
  Building,
} from "lucide-react";

export interface TiltedTileItem {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  icon?: React.ElementType;
  badge?: string;
  badgeColor?: string;
  color?: string;
  amount?: string;
}

export interface TiltedTilesProps {
  items?: TiltedTileItem[];
  columns?: number;
  tiltAngle?: number;
  skewAngle?: number;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  height?: string | number;
  onTileClick?: (item: TiltedTileItem) => void;
}

const DEFAULT_DOC_TILES: TiltedTileItem[] = [
  {
    id: "bank-emi",
    title: "SBI Home Loan EMI",
    subtitle: "Overdue notice with SARFAESI penal warning",
    category: "Banking",
    icon: Building,
    badge: "Overdue",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    color: "from-blue-500 to-indigo-600",
    amount: "₹18,750",
  },
  {
    id: "scam-alert",
    title: "Lucky Prize Notice ⚠️",
    subtitle: "Fake lottery asking for OTP & ₹4,999 fee",
    category: "Scam Alert",
    icon: AlertTriangle,
    badge: "High Risk",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    color: "from-rose-500 to-red-600",
    amount: "₹25,00,000",
  },
  {
    id: "electricity",
    title: "BESCOM Power Bill",
    subtitle: "October monthly consumption & 2% surcharge",
    category: "Utility",
    icon: Receipt,
    badge: "Due Soon",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    color: "from-amber-500 to-orange-600",
    amount: "₹2,187.60",
  },
  {
    id: "rent-lease",
    title: "Rental Agreement",
    subtitle: "11-month lease terms & 5% annual escalation",
    category: "Legal",
    icon: Home,
    badge: "Agreement",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    color: "from-emerald-500 to-teal-600",
    amount: "₹22,000/mo",
  },
  {
    id: "credit-card",
    title: "Card Statement",
    subtitle: "Minimum due warning with 42% APR clause",
    category: "Credit",
    icon: CreditCard,
    badge: "Finance",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    color: "from-purple-500 to-violet-600",
    amount: "₹4,320",
  },
  {
    id: "insurance",
    title: "Health Policy Renewal",
    subtitle: "Grace period expires in 15 days",
    category: "Insurance",
    icon: Shield,
    badge: "Active",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    color: "from-sky-500 to-blue-600",
    amount: "₹14,999",
  },
  {
    id: "tax-notice",
    title: "ITR Intimation u/s 143",
    subtitle: "Assessment year verification notice",
    category: "Tax",
    icon: FileCheck,
    badge: "Government",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    color: "from-slate-600 to-gray-800",
    amount: "Refund",
  },
  {
    id: "police-notice",
    title: "Traffic E-Challan",
    subtitle: "Virtual court fine with online payment link",
    category: "Challan",
    icon: FileText,
    badge: "Pending",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    color: "from-orange-500 to-red-500",
    amount: "₹1,000",
  },
];

export default function TiltedTiles({
  items = DEFAULT_DOC_TILES,
  columns = 3,
  tiltAngle = -12,
  skewAngle = 4,
  speed = 28,
  pauseOnHover = true,
  className,
  height = 420,
  onTileClick,
}: TiltedTilesProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Distribute items across columns
  const columnItems: TiltedTileItem[][] = Array.from(
    { length: columns },
    () => []
  );

  items.forEach((item, index) => {
    columnItems[index % columns].push(item);
  });

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-slate-900/5 dark:bg-black border border-slate-200/80 dark:border-neutral-800 shadow-inner select-none",
        className
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
      }}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <style>{`
        @keyframes scrollColumnUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollColumnDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .tilted-col-up {
          animation: scrollColumnUp var(--scroll-speed, 28s) linear infinite;
        }
        .tilted-col-down {
          animation: scrollColumnDown var(--scroll-speed, 28s) linear infinite;
        }
        .tilted-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Top and Bottom Fade Gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-50/90 via-blue-50/40 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/95 via-white/50 to-transparent z-10" />

      {/* 3D Tilted Plane */}
      <div
        className="w-[140%] -ml-[20%] h-[150%] -mt-[15%] flex justify-center gap-4 transition-transform duration-700 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(16deg) rotateZ(${tiltAngle}deg) skewX(${skewAngle}deg)`,
        }}
      >
        {columnItems.map((col, colIndex) => {
          const isReverse = colIndex % 2 === 1;
          const doubleCol = [...col, ...col, ...col]; // Duplicated for seamless infinite loop

          return (
            <div
              key={`col-${colIndex}`}
              className="flex-1 flex flex-col gap-3 min-w-[170px] max-w-[220px]"
            >
              <div
                className={cn(
                  "flex flex-col gap-3",
                  isReverse ? "tilted-col-down" : "tilted-col-up",
                  isHovered && "tilted-paused"
                )}
                style={
                  {
                    "--scroll-speed": `${speed + colIndex * 3}s`,
                  } as React.CSSProperties
                }
              >
                {doubleCol.map((tile, tileIdx) => {
                  const Icon = tile.icon || FileText;

                  return (
                    <div
                      key={`tile-${colIndex}-${tileIdx}`}
                      onClick={() => onTileClick?.(tile)}
                      className="group cursor-pointer rounded-2xl bg-white/90 dark:bg-neutral-950 backdrop-blur-md p-3.5 border border-slate-200/90 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 transition-all duration-200"
                    >
                      {/* Tile Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br text-white shadow-sm",
                            tile.color || "from-blue-500 to-indigo-600"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {tile.badge && (
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                              tile.badgeColor || "bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-neutral-800"
                            )}
                          >
                            {tile.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="text-sm font-bold text-slate-900 dark:text-gray-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {tile.title}
                      </h4>
                      {tile.subtitle && (
                        <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 mt-1 leading-snug">
                          {tile.subtitle}
                        </p>
                      )}

                      {/* Footer / Amount */}
                      {tile.amount && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                            {tile.category || "Value"}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-gray-100">
                            {tile.amount}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

