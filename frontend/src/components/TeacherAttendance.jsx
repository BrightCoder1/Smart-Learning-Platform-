import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaBookOpen,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

function TeacherAttendance() {

  const navigate = useNavigate();

  // ================= STATES =================

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [submitLoading, setSubmitLoading] =
    useState(false);

  const [lectureName, setLectureName] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [status, setStatus] =
    useState("Present");

  // ================= FETCH STUDENTS =================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      // ================= TOKEN CHECK =================

      if (!jwtToken) {

        toast.error(
          "Please login first"
        );

        navigate("/teacher/login");

        return;
      }

      // ================= API CALL =================

      const response = await axios.get(
        "http://localhost:5000/api/v1/teachers/students/get",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      // ================= SET DATA =================

      setStudents(response.data.students);

      setLoading(false);

    } catch (error) {

      setLoading(false);

      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch students"
      );
    }
  };

  useEffect(() => {

    fetchStudents();

  }, []);

  // ================= SUBMIT ATTENDANCE =================

  const handleSubmitAttendance =
    async (e) => {

      e.preventDefault();

      try {

        // ================= VALIDATION =================

        if (
          !lectureName ||
          !subject ||
          !selectedStudent
        ) {

          return toast.error(
            "Please fill all fields"
          );
        }

        setSubmitLoading(true);

        // ================= TOKEN =================

        const jwtToken = localStorage.getItem(
          "Teacher jwtToken"
        );

        if (!jwtToken) {

          toast.error(
            "Please login first"
          );

          navigate("/teacher/login");

          return;
        }

        // ================= API CALL =================

        const response = await axios.post(
          `http://localhost:5000/api/v1/teachers/students/attendance/${selectedStudent}`,
          {
            lectureName,
            subject,
            status,
            date: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        console.log(response.data);

        // ================= SUCCESS =================

        toast.success(
          "Attendance Submitted Successfully"
        );

        // ================= RESET FORM =================

        setLectureName("");

        setSubject("");

        setSelectedStudent("");

        setStatus("Present");

        setSubmitLoading(false);

      } catch (error) {

        setSubmitLoading(false);

        console.log(error);

        console.log(
          error?.response?.data
        );

        toast.error(
          error?.response?.data?.message ||
            "Attendance Failed"
        );
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Attendance Management
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Submit student attendance
          </p>

        </div>

        <button
          onClick={() =>
            navigate(-1)
          }
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl"
        >

          <FaArrowLeft />

          Back

        </button>

      </div>

      {/* ================= FORM ================= */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8">

        <form
          onSubmit={
            handleSubmitAttendance
          }
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* ================= STUDENT ================= */}

          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Select Student
            </label>

            <select
              value={selectedStudent}
              onChange={(e) =>
                setSelectedStudent(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
            >

              <option value="">
                Select Student
              </option>

              {students.map(
                (student) => (

                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* ================= SUBJECT ================= */}

          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Subject
            </label>

            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-2xl px-4">

              <FaBookOpen className="text-gray-500" />

              <input
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
                className="w-full p-4 bg-transparent outline-none dark:text-white"
              />

            </div>

          </div>

          {/* ================= LECTURE NAME ================= */}

          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Lecture Name
            </label>

            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-2xl px-4">

              <FaBookOpen className="text-gray-500" />

              <input
                type="text"
                placeholder="Lecture Name"
                value={lectureName}
                onChange={(e) =>
                  setLectureName(
                    e.target.value
                  )
                }
                className="w-full p-4 bg-transparent outline-none dark:text-white"
              />

            </div>

          </div>

          {/* ================= STATUS ================= */}

          <div>

            <label className="block mb-2 font-semibold dark:text-white">
              Attendance Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
            >

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

            </select>

          </div>

          {/* ================= BUTTON ================= */}

          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >

              {submitLoading
                ? "Submitting..."
                : "Submit Attendance"}

            </button>

          </div>

        </form>

      </div>

      {/* ================= STUDENT LIST ================= */}

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading ? (

          <div className="col-span-full flex justify-center">

            <h2 className="text-xl font-bold dark:text-white">
              Loading Students...
            </h2>

          </div>

        ) : students.length > 0 ? (

          students.map((student) => (

            <div
              key={student._id}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition-all duration-300"
            >

              {/* ================= PROFILE ================= */}

              <div className="flex items-center gap-4 mb-4">

                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">

                  {student.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    {student.name}
                  </h2>

                  <p className="text-gray-500">
                    {student.email}
                  </p>

                </div>

              </div>

              {/* ================= DETAILS ================= */}

              <div className="space-y-2">

                <p className="text-gray-600 dark:text-gray-300">

                  <span className="font-semibold">
                    Department:
                  </span>{" "}

                  {student.department}

                </p>

                <p className="text-gray-600 dark:text-gray-300">

                  <span className="font-semibold">
                    Age:
                  </span>{" "}

                  {student.age}

                </p>

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() =>
                    navigate(
                      `/teacher/student-attendance/${student._id}`
                    )
                  }
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-semibold"
                >

                  View Attendance

                </button>

              </div>

            </div>
          ))

        ) : (

          <div className="col-span-full flex justify-center">

            <h2 className="text-xl font-bold dark:text-white">
              No Students Found
            </h2>

          </div>

        )}

      </div>

    </div>
  );
}

export default TeacherAttendance;