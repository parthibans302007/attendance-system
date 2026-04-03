import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Users, ClipboardCheck, AlertTriangle, TrendingUp, BookOpen, UserCheck } from "lucide-react";
import { mockStudents, weeklyTrend, departmentStats, mockCorrectionRequests } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(213,56%,24%)", "hsl(199,89%,48%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)"];

const AdminFacultyDashboard = () => {
  const totalStudents = mockStudents.length;
  const avgAttendance = Math.round(mockStudents.reduce((a, s) => a + s.overallAttendance, 0) / totalStudents);
  const atRisk = mockStudents.filter((s) => s.overallAttendance < 75).length;
  const pendingCorrections = mockCorrectionRequests.filter((c) => c.status === "pending").length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={totalStudents} icon={Users} subtitle="Across all departments" />
        <StatCard title="Avg. Attendance" value={`${avgAttendance}%`} icon={ClipboardCheck} trend="down" trendValue="2% from last week" variant="success" />
        <StatCard title="At-Risk Students" value={atRisk} icon={AlertTriangle} subtitle="Below 75% attendance" variant="warning" />
        <StatCard title="Pending Corrections" value={pendingCorrections} icon={UserCheck} subtitle="Awaiting review" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="attendance" fill="hsl(213,56%,24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={departmentStats} cx="50%" cy="50%" outerRadius={90} dataKey="attendance" nameKey="department" label={({ department, attendance }) => `${department}: ${attendance}%`}>
                {departmentStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 glass-card p-6">
        <h3 className="text-sm font-semibold mb-4">At-Risk Students (Below 75%)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Roll No</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Department</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.filter((s) => s.overallAttendance < 75).map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2.5 px-3 font-medium">{s.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{s.rollNo}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{s.department}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-destructive font-semibold">{s.overallAttendance}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const StudentDashboard = () => {
  const student = mockStudents[0];
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Overall Attendance" value={`${student.overallAttendance}%`} icon={ClipboardCheck} variant={student.overallAttendance >= 75 ? "success" : "warning"} />
        <StatCard title="Class Rank" value={`#${student.rank}`} icon={TrendingUp} subtitle={`of ${student.totalStudents} students`} />
        <StatCard title="Subjects" value={5} icon={BookOpen} subtitle="Currently enrolled" />
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-3">AI Insight</h3>
        <div className="bg-accent/10 border border-accent/20 rounded-md p-4 text-sm">
          <p className="font-medium text-accent">📊 Attendance Analysis</p>
          <p className="mt-1 text-muted-foreground">
            Your attendance in <strong>Operating Systems</strong> has dropped by 8% this month. 
            You tend to miss Monday classes more often. Consider setting reminders for early morning sessions.
          </p>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      {user?.role === "student" ? <StudentDashboard /> : <AdminFacultyDashboard />}
    </AppLayout>
  );
};

export default Dashboard;
