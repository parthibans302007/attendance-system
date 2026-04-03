export type Role = "admin" | "faculty" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  year: number;
  email: string;
  phone: string;
  photo: string;
  overallAttendance: number;
  rank: number;
  totalStudents: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  faculty: string;
  totalClasses: number;
  attended: number;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "holiday";
  subject?: string;
}

export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  subject: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export const mockUsers: User[] = [
  { id: "1", email: "admin@college.edu", name: "Dr. Rajesh Kumar", role: "admin", department: "Administration" },
  { id: "2", email: "faculty@college.edu", name: "Prof. Anita Sharma", role: "faculty", department: "Computer Science" },
  { id: "3", email: "student@college.edu", name: "Arjun Patel", role: "student", department: "Computer Science" },
];

export const mockStudents: Student[] = [
  { id: "s1", name: "Arjun Patel", rollNo: "CS2024001", department: "Computer Science", year: 2, email: "arjun@college.edu", phone: "+91 98765 43210", photo: "", overallAttendance: 87, rank: 3, totalStudents: 60 },
  { id: "s2", name: "Priya Singh", rollNo: "CS2024002", department: "Computer Science", year: 2, email: "priya@college.edu", phone: "+91 98765 43211", photo: "", overallAttendance: 92, rank: 1, totalStudents: 60 },
  { id: "s3", name: "Rahul Verma", rollNo: "CS2024003", department: "Computer Science", year: 2, email: "rahul@college.edu", phone: "+91 98765 43212", photo: "", overallAttendance: 71, rank: 15, totalStudents: 60 },
  { id: "s4", name: "Sneha Gupta", rollNo: "CS2024004", department: "Computer Science", year: 2, email: "sneha@college.edu", phone: "+91 98765 43213", photo: "", overallAttendance: 89, rank: 2, totalStudents: 60 },
  { id: "s5", name: "Vikram Joshi", rollNo: "CS2024005", department: "Computer Science", year: 2, email: "vikram@college.edu", phone: "+91 98765 43214", photo: "", overallAttendance: 65, rank: 30, totalStudents: 60 },
  { id: "s6", name: "Kavya Nair", rollNo: "CS2024006", department: "Computer Science", year: 2, email: "kavya@college.edu", phone: "+91 98765 43215", photo: "", overallAttendance: 78, rank: 10, totalStudents: 60 },
  { id: "s7", name: "Aditya Reddy", rollNo: "EC2024001", department: "Electronics", year: 2, email: "aditya@college.edu", phone: "+91 98765 43216", photo: "", overallAttendance: 83, rank: 5, totalStudents: 45 },
  { id: "s8", name: "Meera Iyer", rollNo: "EC2024002", department: "Electronics", year: 2, email: "meera@college.edu", phone: "+91 98765 43217", photo: "", overallAttendance: 95, rank: 1, totalStudents: 45 },
];

export const mockSubjects: Subject[] = [
  { id: "sub1", name: "Data Structures", code: "CS201", faculty: "Prof. Anita Sharma", totalClasses: 45, attended: 39 },
  { id: "sub2", name: "Database Systems", code: "CS202", faculty: "Prof. Ravi Menon", totalClasses: 40, attended: 35 },
  { id: "sub3", name: "Operating Systems", code: "CS203", faculty: "Dr. Suresh Babu", totalClasses: 38, attended: 30 },
  { id: "sub4", name: "Computer Networks", code: "CS204", faculty: "Prof. Kavitha Das", totalClasses: 42, attended: 38 },
  { id: "sub5", name: "Software Engineering", code: "CS205", faculty: "Dr. Amit Jain", totalClasses: 35, attended: 33 },
];

export const generateAttendanceCalendar = (month: number, year: number): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const holidays = [15, 26]; // sample holidays

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) continue; // Sunday off

    const dateStr = date.toISOString().split("T")[0];
    if (holidays.includes(day)) {
      records.push({ date: dateStr, status: "holiday" });
    } else {
      records.push({ date: dateStr, status: Math.random() > 0.15 ? "present" : "absent" });
    }
  }
  return records;
};

export const mockCorrectionRequests: CorrectionRequest[] = [
  { id: "cr1", studentId: "s1", studentName: "Arjun Patel", date: "2024-03-15", subject: "Data Structures", reason: "Was present but marked absent by mistake", status: "pending", createdAt: "2024-03-16" },
  { id: "cr2", studentId: "s3", studentName: "Rahul Verma", date: "2024-03-10", subject: "Database Systems", reason: "Medical emergency, have doctor's note", status: "approved", createdAt: "2024-03-11" },
  { id: "cr3", studentId: "s5", studentName: "Vikram Joshi", date: "2024-03-12", subject: "Operating Systems", reason: "Was late by 5 minutes", status: "denied", createdAt: "2024-03-13" },
];

export const weeklyTrend = [
  { week: "Week 1", attendance: 88 },
  { week: "Week 2", attendance: 85 },
  { week: "Week 3", attendance: 82 },
  { week: "Week 4", attendance: 86 },
  { week: "Week 5", attendance: 84 },
  { week: "Week 6", attendance: 80 },
];

export const departmentStats = [
  { department: "Computer Science", attendance: 82, students: 60 },
  { department: "Electronics", attendance: 85, students: 45 },
  { department: "Mechanical", attendance: 78, students: 55 },
  { department: "Civil", attendance: 80, students: 40 },
];
