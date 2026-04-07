const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subject: { type: String, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    records: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true }
    }]
}, { timestamps: true });

// Prevent duplicate attendance for the same category, date, and subject
attendanceSchema.index({ date: 1, category: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
