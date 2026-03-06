import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Student, Grade } from "@/types";

interface TranscriptGeneratorProps {
  student: Student;
  grades: Grade[];
  className?: string;
}

export function TranscriptGenerator({ student, grades, className }: TranscriptGeneratorProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("REPUBLIQUE DE MADAGASCAR", pageWidth / 2, 15, { align: "center" });
    doc.text("Universite de Madagascar", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("RELEVE DE NOTES OFFICIEL", pageWidth / 2, 32, { align: "center" });

    doc.setDrawColor(0, 100, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 36, pageWidth - 20, 36);

    // Student info
    doc.setFontSize(10);
    doc.setTextColor(0);
    const infoY = 44;
    doc.text(`Nom et Prenoms: ${student.lastName} ${student.firstName}`, 20, infoY);
    doc.text(`Matricule: ${student.matricule}`, 20, infoY + 6);
    doc.text(`Departement: ${student.departement}`, 20, infoY + 12);
    doc.text(`Niveau: ${student.level}`, 120, infoY);
    doc.text(`Statut: ${student.status}`, 120, infoY + 6);
    doc.text(`Date d'inscription: ${new Date(student.enrollmentDate).toLocaleDateString("fr-FR")}`, 120, infoY + 12);

    // Group grades by session
    const normalGrades = grades.filter((g) => g.session === "Normale");
    const rattrapageGrades = grades.filter((g) => g.session === "Rattrapage");

    // Build table data - use rattrapage grade if available, otherwise normal
    const gradeMap = new Map<string, Grade>();
    for (const g of normalGrades) {
      gradeMap.set(`${g.subjectId}-${g.semester}`, g);
    }
    for (const g of rattrapageGrades) {
      const key = `${g.subjectId}-${g.semester}`;
      const existing = gradeMap.get(key);
      if (!existing || g.note > existing.note) {
        gradeMap.set(key, g);
      }
    }

    const finalGrades = Array.from(gradeMap.values());
    const tableData = finalGrades.map((g) => [
      g.subjectCode,
      g.subjectName,
      g.coefficient.toString(),
      `${g.note}/20`,
      (g.note * g.coefficient).toFixed(1),
      g.semester,
      g.note >= 10 ? "Valide" : "Non valide",
    ]);

    // Calculate averages
    const totalCoeff = finalGrades.reduce((s, g) => s + g.coefficient, 0);
    const weightedSum = finalGrades.reduce((s, g) => s + g.note * g.coefficient, 0);
    const average = totalCoeff > 0 ? (weightedSum / totalCoeff).toFixed(2) : "N/A";
    const validatedCredits = finalGrades.filter((g) => g.note >= 10).reduce((s, g) => s + g.coefficient * 2, 0);
    const totalCredits = totalCoeff * 2;

    // Grades table
    autoTable(doc, {
      startY: infoY + 20,
      head: [["Code", "Matiere", "Coeff.", "Note", "Points", "Sem.", "Statut"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [0, 100, 200], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
      },
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Moyenne Generale: ${average}/20`, 20, finalY);
    doc.text(`Credits ECTS valides: ${validatedCredits}/${totalCredits}`, 20, finalY + 7);
    doc.text(`Matieres validees: ${finalGrades.filter((g) => g.note >= 10).length}/${finalGrades.length}`, 20, finalY + 14);

    // Footer
    const stampY = finalY + 28;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Document genere le ${new Date().toLocaleDateString("fr-FR")}`, 20, stampY);
    doc.text("Le Directeur des Etudes", pageWidth - 20, stampY, { align: "right" });

    // Stamp circle
    doc.setDrawColor(0, 100, 200);
    doc.setLineWidth(0.3);
    doc.circle(pageWidth - 45, stampY + 15, 12);
    doc.setFontSize(7);
    doc.setTextColor(0, 100, 200);
    doc.text("UNIVERSITE", pageWidth - 45, stampY + 13, { align: "center" });
    doc.text("DE MADAGASCAR", pageWidth - 45, stampY + 17, { align: "center" });

    doc.save(`releve_notes_${student.matricule}.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="outline" className={className}>
      <FileDown className="h-4 w-4 mr-2" />
      Telecharger releve
    </Button>
  );
}
