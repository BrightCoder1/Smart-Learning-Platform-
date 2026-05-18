const { setRole, allow } = require("../controllers/adminController")
const { login, updatePassword, verifyToken } = require("../controllers/authController")
const express = require('express')
const { createAppointment, deleteAppointment, getAllAppointments, getAllStudents, approveAppointment, dissapproveAppointment, getAllPendingStudents } = require("../controllers/teacherController")
const router = express.Router()
const User = require("../models/User")
const Attendance = require("../models/Attendance")

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

router.patch(
    "/students/update/:id",

    verifyToken,

    allow("admin", "teacher"),

    async (req, res) => {

        try {

            const {
                name,
                email,
                department,
                age,
                roles,
                password,
                passwordConfirm,
            } = req.body;

            // ================= FIND STUDENT =================

            const student = await User.findById(
                req.params.id
            );

            if (!student) {

                return res.status(404).json({
                    status: "fail",
                    message: "Student not found",
                });
            }

            // ================= UPDATE NORMAL FIELDS =================

            student.name =
                name || student.name;

            student.email =
                email || student.email;

            student.department =
                department || student.department;

            student.age =
                age || student.age;

            // ================= ONLY ADMIN CAN CHANGE ROLE =================

            if (
                req.user.roles === "admin" &&
                roles
            ) {
                student.roles = roles;
            }

            // ================= PASSWORD UPDATE =================

            if (password) {

                if (
                    password !== passwordConfirm
                ) {

                    return res.status(400).json({
                        status: "fail",
                        message:
                            "Password and Confirm Password do not match",
                    });
                }

                student.password = password;

                student.passwordConfirm =
                    passwordConfirm;
            }

            // ================= SAVE =================

            await student.save();

            res.status(200).json({
                status: "success",
                message:
                    "Student updated successfully",
                student,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                status: "fail",
                message: error.message,
            });
        }
    }
);



router.get(
    "/students/attendance/:studentId",

    verifyToken,

    allow("teacher", "admin"),

    async (req, res) => {

        try {

            const { studentId } = req.params;

            const student = await User.findById(studentId)
                .populate("attendance");

            if (!student) {

                return res.status(404).json({
                    status: "fail",
                    message: "Student not found",
                });
            }

            res.status(200).json({

                status: "success",

                attendance: student.attendance,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                status: "error",

                message: error.message,
            });
        }
    }
);


router.post(
    "/students/attendance/:studentId",

    verifyToken,

    allow("teacher", "admin"),

    async (req, res) => {

        try {

            const { studentId } = req.params;

            const {
                lectureName,
                subject,
                status,
                date,
            } = req.body;

            // ================= VALIDATION =================

            if (
                !lectureName ||
                !subject ||
                !status
            ) {

                return res.status(400).json({
                    status: "fail",
                    message: "Please fill all fields",
                });
            }

            // ================= FIND STUDENT =================

            const student = await User.findById(studentId);

            if (!student) {

                return res.status(404).json({
                    status: "fail",
                    message: "Student not found",
                });
            }

            // ================= CREATE ATTENDANCE =================

            const attendance = await Attendance.create({

                student: studentId,

                lectureName,

                subject,

                status,

                date: date || new Date(),
            });

            // ================= UPDATE USER =================

            await User.findByIdAndUpdate(
                studentId,
                {
                    $push: {
                        attendance: attendance._id,
                    },
                }
            );

            // ================= RESPONSE =================

            res.status(201).json({

                status: "success",

                message:
                    "Attendance submitted successfully",

                attendance,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                status: "error",

                message: error.message,
            });
        }
    }
);


// ================= GET PARTICULAR STUDENT WITH ATTENDANCE =================
// ROUTE:
// GET http://localhost:5000/api/v1/teachers/students/get/:id

router.get(
    "/students/get/:id",

    verifyToken,

    allow("admin", "teacher"),

    async (req, res) => {

        try {

            const student = await User.findById(
                req.params.id
            )

                .populate({
                    path: "attendance",
                    options: {
                        sort: { date: -1 }
                    }
                })

                .select(
                    "-password -passwordConfirm"
                );

            // ================= CHECK STUDENT =================

            if (!student) {

                return res.status(404).json({
                    status: "fail",
                    message: "Student not found",
                });
            }

            // ================= RESPONSE =================

            res.status(200).json({

                status: "success",

                student,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                status: "error",

                message: error.message,
            });
        }
    }
);



module.exports = router