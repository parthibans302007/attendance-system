import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockStudents, mockSubjects } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Attendance = () => {
  const [selectedSubject, setSelectedSubject] = useState(mockSubjects[0].id);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(mockStudents.filter((s) => s.department === "Computer Science").map((s) => [s.id, true]))
  );

  const csStudents = mockStudents.filter((s) => s.department === "Computer Science");
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const subject = mockSubjects.find((s) => s.id === selectedSubject);

  const toggle = (id: string) => setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  const selectAll = () => setAttendance(Object.fromEntries(csStudents.map((s) => [s.id, true])));
  const deselectAll = () => setAttendance(Object.fromEntries(csStudents.map((s) => [s.id, false])));

  const presentCount = Object.values(attendance).filter(Boolean).length;

  const handleSave = () => {
    toast.success(`Attendance saved for ${subject?.name}`, {
      description: `${presentCount}/${csStudents.length} students marked present`,
    });
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
      </div>

      <div className="bg-card rounded-lg border p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Subject</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-card"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {mockSubjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>Deselect All</Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <span className="text-sm font-medium">{subject?.name} — {subject?.code}</span>
          <span className="text-sm text-muted-foreground">{presentCount}/{csStudents.length} present</span>
        </div>
        <div className="divide-y">
          {csStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => toggle(student.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors",
                attendance[student.id] ? "bg-success/5" : "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                attendance[student.id] ? "bg-success border-success" : "border-muted-foreground/30"
              )}>
                {attendance[student.id] && <Check className="w-4 h-4 text-success-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.rollNo}</p>
              </div>
              <span className={cn("text-xs font-medium", student.overallAttendance >= 75 ? "text-success" : "text-destructive")}>
                {student.overallAttendance}%
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" /> Save Attendance
        </Button>
      </div>
    </AppLayout>
  );
};

export default Attendance;
