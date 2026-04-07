const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rollNumber: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    contactNumber: { type: String },
    parentContact: { type: String },
    address: { type: String },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
