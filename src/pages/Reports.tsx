import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockStudents, mockSubjects } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-03-31");
  const [deptFilter, setDeptFilter] = useState("all");

  const departments = [...new Set(mockStudents.map((s) => s.department))];
  const filtered = mockStudents.filter((s) => deptFilter === "all" || s.department === deptFilter);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Generate attendance reports with date range filters</p>
      </div>

      <div className="bg-card rounded-lg border p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Start Date</label>
            <input type="date" className="w-full border rounded-md px-3 py-2 text-sm bg-card" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">End Date</label>
            <input type="date" className="w-full border rounded-md px-3 py-2 text-sm bg-card" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Department</label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-card" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> PDF</Button>
            <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" /> Excel</Button>
          </div>
        </div>
      </div>

      {/* Student-wise */}
      <div className="bg-card rounded-lg border shadow-sm mb-6">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold">Student-wise Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Roll No</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Department</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Attended</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">%</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const total = 120;
                const attended = Math.round(total * s.overallAttendance / 100);
                return (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-medium">{s.name}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{s.rollNo}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{s.department}</td>
                    <td className="py-2.5 px-4 text-center">{total}</td>
                    <td className="py-2.5 px-4 text-center">{attended}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={cn("font-semibold", s.overallAttendance >= 75 ? "text-success" : "text-destructive")}>{s.overallAttendance}%</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", s.overallAttendance >= 75 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                        {s.overallAttendance >= 75 ? "Regular" : "At Risk"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject-wise */}
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold">Subject-wise Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Code</th>
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Faculty</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Avg %</th>
              </tr>
            </thead>
            <tbody>
              {mockSubjects.map((sub) => {
                const pct = Math.round((sub.attended / sub.totalClasses) * 100);
                return (
                  <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-medium">{sub.name}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{sub.code}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{sub.faculty}</td>
                    <td className="py-2.5 px-4 text-center">{sub.totalClasses}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={cn("font-semibold", pct >= 75 ? "text-success" : "text-destructive")}>{pct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
