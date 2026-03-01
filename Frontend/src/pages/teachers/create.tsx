import { DEPARTEMENT_OPTIONS, TEACHER_GRADE_OPTIONS } from "@/components/constants";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@refinedev/react-hook-form";
import { AnimatedPage } from "@/components/ui/animated-page";

const TeachersCreate = () => {
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    refineCoreProps: { resource: "teachers", action: "create" },
  });

  return (
    <AnimatedPage>
      <CreateView>
        <CreateViewHeader title="Nouvel Enseignant" />
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" {...register("firstName", { required: "Prénom requis" })} placeholder="Prénom" />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" {...register("lastName", { required: "Nom requis" })} placeholder="Nom" />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: "Email requis" })} placeholder="email@univ.mg" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" {...register("phone")} placeholder="+261 34 00 000 00" />
                </div>
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select onValueChange={(v) => setValue("departement", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Spécialisation</Label>
                  <Input id="specialization" {...register("specialization", { required: "Spécialisation requise" })} placeholder="Ex: Intelligence Artificielle" />
                  {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select onValueChange={(v) => setValue("grade", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {TEACHER_GRADE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Date d'embauche</Label>
                  <Input id="hireDate" type="date" {...register("hireDate", { required: "Date requise" })} />
                  {errors.hireDate && <p className="text-sm text-destructive">{errors.hireDate.message as string}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Enregistrement..." : "Créer l'enseignant"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </CreateView>
    </AnimatedPage>
  );
};

export default TeachersCreate;
