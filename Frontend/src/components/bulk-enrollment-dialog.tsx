import { useState } from "react";
import { useList, useUpdate } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Search, Check } from "lucide-react";
import type { Course } from "@/types";

interface BulkEnrollmentDialogProps {
  course: Course;
  onSuccess?: () => void;
}

type StudentItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
};

export function BulkEnrollmentDialog({ course, onSuccess }: BulkEnrollmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { result } = useList<StudentItem>({
    resource: "students",
    pagination: { pageSize: 100 },
    queryOptions: { enabled: open },
  });

  const { mutate: updateCourse } = useUpdate();

  const allStudents = (result.data || []) as StudentItem[];
  const enrolledIds = new Set((course.enrollments || []).map((e) => e.student.id));

  const availableStudents = allStudents.filter(
    (s) => !enrolledIds.has(String(s.id)) &&
      (search === "" || `${s.firstName} ${s.lastName} ${s.matricule}`.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStudent = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleEnroll = () => {
    const newEnrollments = [
      ...(course.enrollments || []),
      ...Array.from(selected).map((sid) => {
        const student = allStudents.find((s) => String(s.id) === sid)!;
        return {
          id: `e-${Date.now()}-${sid}`,
          student: {
            id: String(student.id),
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            matricule: student.matricule,
          },
        };
      }),
    ];

    updateCourse(
      {
        resource: "courses",
        id: course.id,
        values: {
          enrollments: newEnrollments,
          _count: { ...course._count, enrollments: newEnrollments.length },
        },
      },
      {
        onSuccess: () => {
          setSelected(new Set());
          setOpen(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />Inscription massive
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inscrire des etudiants</DialogTitle>
        </DialogHeader>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un etudiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {selected.size > 0 && (
          <div className="mb-2">
            <Badge>{selected.size} selectionne(s)</Badge>
          </div>
        )}

        <ScrollArea className="h-[300px] border rounded-md">
          <div className="p-2 space-y-1">
            {availableStudents.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">Aucun etudiant disponible</p>
            ) : (
              availableStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleStudent(String(student.id))}
                >
                  <Checkbox checked={selected.has(String(student.id))} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-muted-foreground">{student.matricule}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleEnroll} disabled={selected.size === 0}>
            <Check className="h-4 w-4 mr-2" />Inscrire ({selected.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
