import { DEPARTEMENT_OPTIONS, TEACHER_GRADE_OPTIONS, TEACHER_STATUS_OPTIONS } from "@/components/constants";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@refinedev/react-hook-form";
import { AnimatedPage } from "@/components/ui/animated-page";

const TeachersEdit = () => {
  const {
    refineCore: { onFinish, formLoading, query },
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    refineCoreProps: { resource: "teachers", action: "edit" },
  });

  const record = query?.data?.data;

  return (
    <AnimatedPage>
      <EditView>
        <EditViewHeader title="Modifier l'Enseignant" />
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" {...register("firstName", { required: "Prénom requis" })} />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" {...register("lastName", { required: "Nom requis" })} />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: "Email requis" })} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" {...register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select onValueChange={(v) => setValue("departement", v)} value={record?.departement as string}>
                    <SelectTrigger><SelectValue placeholder="Département" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Spécialisation</Label>
                  <Input id="specialization" {...register("specialization")} />
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select onValueChange={(v) => setValue("grade", v)} value={record?.grade as string}>
                    <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                    <SelectContent>
                      {TEACHER_GRADE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select onValueChange={(v) => setValue("status", v)} value={record?.status as string}>
                    <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                    <SelectContent>
                      {TEACHER_STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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

export default TeachersEdit;
