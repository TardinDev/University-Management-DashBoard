import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useShow } from "@refinedev/core";
import type { Subject } from "@/types";
import { AnimatedPage } from "@/components/ui/animated-page";

const SubjectsShow = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const record = query?.data?.data;

  if (!record) return null;

  return (
    <AnimatedPage>
      <ShowView>
        <ShowViewHeader title="Détails de la Matière" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <Badge className="mt-1">{record.code}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-semibold text-lg">{record.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Département</p>
                <Badge variant="secondary" className="mt-1">{record.departement}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p>{record.createdAt}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1 leading-relaxed">{record.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ShowView>
    </AnimatedPage>
  );
};

export default SubjectsShow;
