const Student = require('../models/Student');
const User = require('../models/User');

const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate('user', 'name email role').populate('category', 'name description');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createStudent = async (req, res) => {
    const { name, email, rollNumber, category, contactNumber, parentContact, address } = req.body;
    try {
        const studentExists = await Student.findOne({ rollNumber });
        if (studentExists) {
            return res.status(400).json({ message: 'Student with this roll number already exists' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password: 'password123',
            role: 'student'
        });

        const student = await Student.create({
            user: user._id, rollNumber, category, contactNumber, parentContact, address
        });
        const fullStudent = await Student.findById(student._id).populate('user', 'name email').populate('category', 'name');
        res.status(201).json(fullStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStudent = async (req, res) => {
    const { rollNumber, category, contactNumber, parentContact, address } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            student.rollNumber = rollNumber || student.rollNumber;
            student.category = category || student.category;
            student.contactNumber = contactNumber || student.contactNumber;
            student.parentContact = parentContact || student.parentContact;
            student.address = address || student.address;
            
            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            await student.deleteOne();
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
