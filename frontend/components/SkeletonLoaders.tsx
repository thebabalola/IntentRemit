"use client";

import { motion } from "framer-motion";

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{
        opacity: [0.3, 0.6, 0.3],
        backgroundColor: ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`rounded-xl ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SkeletonLoader className="w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
              <SkeletonLoader className="w-32 h-4" />
              <SkeletonLoader className="w-24 h-3" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <SkeletonLoader className="w-20 h-5" />
            <SkeletonLoader className="w-16 h-3 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
