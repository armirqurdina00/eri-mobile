"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  index = 0,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "green" | "orange" | "red" | "violet";
  index?: number;
}) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      icon: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-100 dark:ring-blue-900/50",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      ring: "ring-emerald-100 dark:ring-emerald-900/50",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      icon: "text-orange-600 dark:text-orange-400",
      ring: "ring-orange-100 dark:ring-orange-900/50",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/30",
      icon: "text-red-600 dark:text-red-400",
      ring: "ring-red-100 dark:ring-red-900/50",
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-950/30",
      icon: "text-violet-600 dark:text-violet-400",
      ring: "ring-violet-100 dark:ring-violet-900/50",
    },
  };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {trend}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} ring-1 ${c.ring}`}>
          <Icon className={`h-6 w-6 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
