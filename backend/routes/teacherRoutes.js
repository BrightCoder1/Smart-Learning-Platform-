const { setRole, allow } = require("../controllers/adminController")
const { login, updatePassword, verifyToken } = require("../controllers/authController")
const express = require('express')
const { createAppointment, deleteAppointment, getAllAppointments, getAllStudents, approveAppointment, dissapproveAppointment, getAllPendingStudents } = require("../controllers/teacherController")
const router = express.Router()
const User = require("../models/User")

router.route('/').get(getAllStudents);
router.post('/login', login)
router.patch('/updatePassword', verifyToken, updatePassword)

router.route('/schedule').get(verifyToken, allow('admin', 'teacher'), getAllAppointments).post(verifyToken, allow('admin', 'teacher'), createAppointment)

router.route('/reschedule/:id').delete(verifyToken, allow('teacher'), deleteAppointment);

router.route('/changeApprovalStatus/:id/:studentId').delete(verifyToken, allow('admin', 'teacher'), dissapproveAppointment).patch(verifyToken, allow('admin', 'teacher'), approveAppointment)

router.route('/getAllPendingStudents').get(verifyToken, allow('teacher'), getAllPendingStudents);

router.get(
    "/students/get",
    verifyToken,
    allow("admin", "teacher"),
    async (req, res) => {
        try {
            const students = await User.find({
                roles: "student",
            })

                .select(
                    "-password -passwordConfirm"
                )
                .populate("appointments")
                .sort({ createdAt: -1 });

            console.log(students);

            res.status(200).json({
                status: "success",
                results: students.length,
                students,
            });
        } catch (error) {
            res.status(500).json({
                status: "fail",
                message: error.message,
            });
        }
    }
);



router.delete(
    "/students/delete/:id",

    verifyToken,

    allow("admin", "teacher"),

    async (req, res) => {
        try {
            await User.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                success: true,
                message:
                    "Student deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);


module.exports = router