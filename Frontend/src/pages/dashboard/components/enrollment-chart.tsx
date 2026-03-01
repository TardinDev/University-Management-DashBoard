import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AnimatedCard } from "@/components/ui/animated-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
  count: {
    label: "Inscriptions",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  data: { month: string; count: number }[];
};

export function EnrollmentChart({ data }: Props) {
  return (
    <AnimatedCard>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Tendance des Inscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              fill="url(#fillCount)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </AnimatedCard>
  );
}
