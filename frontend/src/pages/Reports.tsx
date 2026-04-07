import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import api from "@/lib/api";
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [deptFilter, setDeptFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        api.get("/students"),
        api.get("/attendance")
      ]);
      setStudents(studentsRes.data);
      setAttendances(attendanceRes.data);
    } catch (error) {
      console.error("Failed to fetch reports data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    socket.connect();

    socket.on("attendanceUpdate", () => {
        fetchData();
    });

    return () => {
        socket.off("attendanceUpdate");
        socket.disconnect();
    };
  }, [fetchData]);

  const departments = [...new Set(students.map((s) => s.category?.name).filter(Boolean))];
  const filteredStudents = students.filter((s) => deptFilter === "all" || s.category?.name === deptFilter);

  // Group attendance by subject
  const subjectMap: Record<string, { total: number, present: number, faculty: string }> = {};
  attendances.forEach(a => {
    if (!subjectMap[a.subject]) {
      subjectMap[a.subject] = { total: 0, present: 0, faculty: a.faculty?.name || "N/A" };
    }
    subjectMap[a.subject].total += a.records.length;
    subjectMap[a.subject].present += a.records.filter((r: any) => r.status === "Present").length;
  });

  if (loading) {
     return <AppLayout><div className="flex h-[80vh] items-center justify-center">Loading reports...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Generate attendance reports and analytics</p>
      </div>

      <div className="bg-card rounded-lg border p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
          <div className="w-full sm:w-1/3">
            <label className="text-sm font-medium mb-1.5 block">Category / Department</label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-card h-10" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map((d: any) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-1" /> PDF</Button>
            <Button variant="outline"><FileText className="w-4 h-4 mr-1" /> Excel</Button>
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
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Total Records</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Attended</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">%</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.length === 0 ? (
                 <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No students found</td></tr>
              ) : filteredStudents.map((s) => {
                // aggregate
                let total = 0;
                let attended = 0;
                attendances.forEach(a => {
                   const rec = a.records.find((r: any) => r.student._id === s._id || r.student === s._id);
                   if (rec) {
                      total++;
                      if (rec.status === "Present") attended++;
                   }
                });
                const pct = total === 0 ? 0 : Math.round((attended / total) * 100);

                return (
                  <tr key={s._id} className="hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-medium">{s.user?.name || "Unknown"}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{s.rollNumber}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{s.category?.name || "N/A"}</td>
                    <td className="py-2.5 px-4 text-center">{total}</td>
                    <td className="py-2.5 px-4 text-center">{attended}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={cn("font-semibold", pct >= 75 ? "text-success" : (total > 0 ? "text-destructive" : "text-muted-foreground"))}>{total > 0 ? `${pct}%` : "-"}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", pct >= 75 ? "bg-success/10 text-success" : (total > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"))}>
                        {total === 0 ? "No Data" : (pct >= 75 ? "Regular" : "At Risk")}
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
                <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Faculty</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Total Headcount</th>
                <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Avg %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.keys(subjectMap).length === 0 ? (
                 <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No reports available</td></tr>
              ) : Object.entries(subjectMap).map(([subject, data]) => {
                const pct = data.total === 0 ? 0 : Math.round((data.present / data.total) * 100);
                return (
                  <tr key={subject} className="hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-medium">{subject}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{data.faculty}</td>
                    <td className="py-2.5 px-4 text-center">{data.total}</td>
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
