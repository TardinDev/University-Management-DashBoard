import { AnimatedCard } from "@/components/ui/animated-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Calendar, ClipboardList } from "lucide-react";

type Activity = {
  id: number;
  type: string;
  description: string;
  date: string;
  actor: string;
};

const typeConfig: Record<string, { icon: typeof BookOpen; variant: "default" | "secondary" | "outline" }> = {
  inscription: { icon: ClipboardList, variant: "default" },
  note: { icon: BookOpen, variant: "secondary" },
  emploi_du_temps: { icon: Calendar, variant: "outline" },
};

export function RecentActivity({ data }: { data: Activity[] }) {
  return (
    <AnimatedCard>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((activity) => {
            const config = typeConfig[activity.type] || typeConfig.inscription;
            const Icon = config.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={config.variant} className="text-[10px] px-1.5 py-0">
                      {activity.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.actor}</span>
                    <span className="text-xs text-muted-foreground">&middot; {activity.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
