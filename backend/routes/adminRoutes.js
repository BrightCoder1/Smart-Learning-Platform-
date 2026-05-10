const express=require('express');

const { getAllTeachers, createTeacher, getTeacher, updateTeacher, deleteTeacher, allow, setRole, approveStudent, deleteStudent,getAllStudents } = require('../controllers/adminController');
const { verifyToken } = require('../controllers/authController');
const router = express.Router()


router.route('/').get(verifyToken,getAllTeachers).post(verifyToken,allow('admin'),setRole('teacher'),createTeacher);
router.route('/getstudents').get(getAllStudents);
router.route('/:id').get(getTeacher).patch(updateTeacher).delete(deleteTeacher);
router.route('/rejectStudent/:id').delete(deleteStudent);
router.route('/approvestudent/:id').patch(approveStudent);

module.exports = router
