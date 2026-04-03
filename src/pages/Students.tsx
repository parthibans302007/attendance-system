import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { mockStudents } from "@/data/mockData";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Students = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const navigate = useNavigate();

  const departments = [...new Set(mockStudents.map((s) => s.department))];
  const filtered = mockStudents.filter(
    (s) =>
      (deptFilter === "all" || s.department === deptFilter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="mb-6 bg-gradient-to-r from-sidebar-accent/10 to-transparent p-6 rounded-2xl border border-border/50">
        <h1 className="text-2xl font-bold tracking-tight">Students Directory</h1>
        <p className="text-sm text-muted-foreground mt-1 text-balance">Manage and view student attendance profiles and overall performance records.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 glass p-2 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
          <Input placeholder="Search by name or roll number..." className="pl-11 bg-transparent border-none shadow-none focus-visible:ring-0 text-foreground" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-px bg-border/50 hidden sm:block mx-1"></div>
        <div className="flex items-center gap-2 px-2">
          <Filter className="w-4 h-4 text-muted-foreground/70" />
          <select
            className="bg-transparent text-sm font-medium focus:outline-none focus:ring-0 text-foreground py-2 cursor-pointer w-full sm:w-auto"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((student) => (
          <button
            key={student.id}
            onClick={() => navigate(`/students/${student.id}`)}
            className="glass-card p-5 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary shadow-inner group-hover:scale-110 transition-transform duration-300">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.rollNo}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{student.department}</span>
              <span className={cn("font-semibold", student.overallAttendance >= 75 ? "text-success" : "text-destructive")}>
                {student.overallAttendance}%
              </span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-1.5">
              <div
                className={cn("h-1.5 rounded-full", student.overallAttendance >= 75 ? "bg-success" : "bg-destructive")}
                style={{ width: `${student.overallAttendance}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </AppLayout>
  );
};

export default Students;
