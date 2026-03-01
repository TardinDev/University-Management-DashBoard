import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
};

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => {
    if (suffix === "%") return `${v.toFixed(1)}${suffix}`;
    if (Number.isInteger(value)) return `${Math.round(v)}`;
    return `${v.toFixed(1)}`;
  });

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

export function KpiCard({ label, value, suffix, icon: Icon, trend, className }: KpiCardProps) {
  return (
    <AnimatedCard hover className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">
              <AnimatedNumber value={value} suffix={suffix} />
              {suffix && !suffix.includes("%") && <span className="text-lg ml-1">{suffix}</span>}
            </p>
            {trend && (
              <p className={cn(
                "text-xs font-medium flex items-center gap-1",
                trend.value > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
