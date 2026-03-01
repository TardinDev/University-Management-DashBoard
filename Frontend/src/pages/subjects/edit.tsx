import { DEPARTEMENT_OPTIONS } from "@/components/constants";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@refinedev/react-hook-form";
import { AnimatedPage } from "@/components/ui/animated-page";

const SubjectsEdit = () => {
  const {
    refineCore: { onFinish, formLoading, query },
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    refineCoreProps: { resource: "subjects", action: "edit" },
  });

  const record = query?.data?.data;

  return (
    <AnimatedPage>
      <EditView>
        <EditViewHeader title="Modifier la Matière" />
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" {...register("code", { required: "Code requis" })} />
                  {errors.code && <p className="text-sm text-destructive">{errors.code.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la matière</Label>
                  <Input id="name" {...register("name", { required: "Nom requis" })} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Département</Label>
                  <Select onValueChange={(v) => setValue("departement", v)} value={record?.departement as string}>
                    <SelectTrigger><SelectValue placeholder="Département" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} rows={4} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Enregistrement..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </EditView>
    </AnimatedPage>
  );
};

export default SubjectsEdit;
