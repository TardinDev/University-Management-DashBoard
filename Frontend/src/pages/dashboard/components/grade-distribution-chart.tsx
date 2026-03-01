import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AnimatedCard } from "@/components/ui/animated-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
  count: {
    label: "Étudiants",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  data: { range: string; count: number }[];
};

export function GradeDistributionChart({ data }: Props) {
  return (
    <AnimatedCard>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Distribution des Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </AnimatedCard>
  );
}
