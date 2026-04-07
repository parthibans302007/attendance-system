const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance } = require('../controllers/attendanceController');
const { protect, facultyOrAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAttendance).post(protect, facultyOrAdmin, markAttendance);

module.exports = router;
