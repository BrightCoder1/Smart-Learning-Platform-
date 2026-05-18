// models/Attendance.js

const mongoose = require("mongoose");

const attendanceSchema =
    new mongoose.Schema(
        {
            student: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,
            },

            lectureName: {
                type: String,

                required: true,
            },

            subject: {
                type: String,

                required: true,
            },

            status: {
                type: String,

                enum: [
                    "Present",
                    "Absent",
                ],

                default: "Present",
            },

            date: {
                type: Date,

                default: Date.now,
            },
        },

        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        "Attendance",
        attendanceSchema
    );