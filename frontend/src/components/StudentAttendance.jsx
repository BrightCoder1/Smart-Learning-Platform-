import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaBookOpen,
} from "react-icons/fa";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

function StudentAttendance() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [student, setStudent] =
    useState(null);

  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // LECTURE STATE

  const [lectureName, setLectureName] =
    useState("");

  const [subject, setSubject] =
    useState("");

  // ================= FETCH STUDENT =================

  const fetchStudent = async () => {

    try {

      setLoading(true);

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      const response = await axios.get(
        `http://localhost:5000/api/v1/teachers/students/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setStudent(response.data.student);

      setAttendance(
        response.data.student.attendance || []
      );

      setLoading(false);

    } catch (error) {

      setLoading(false);

      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // ================= MARK ATTENDANCE =================

  const markAttendance = async (
    status
  ) => {

    try {

      if (!lectureName || !subject) {

        return alert(
          "Please enter lecture name and subject"
        );
      }

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      const response = await axios.post(
        `http://localhost:5000/api/v1/teachers/students/attendance/${id}`,
        {
          status,
          lectureName,
          subject,
          date: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setAttendance(
        response.data.attendance
      );

      // CLEAR INPUTS

      setLectureName("");
      setSubject("");

      alert(
        `Attendance marked ${status}`
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
          "Attendance failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Student Attendance
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Mark and manage lecture attendance
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

      {/* STUDENT CARD */}

      {student && (

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 mb-8">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">

              {student.name
                ?.charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <h2 className="text-2xl font-bold dark:text-white">
                {student.name}
              </h2>

              <p className="text-gray-500">
                {student.email}
              </p>

              <p className="text-gray-500">
                {student.department}
              </p>

            </div>

          </div>

          {/* LECTURE INPUTS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

            {/* LECTURE NAME */}

            <div>

              <label className="block mb-2 font-semibold dark:text-white">
                Lecture Name
              </label>

              <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-2xl px-4">

                <FaBookOpen className="text-gray-500" />

                <input
                  type="text"
                  placeholder="Enter lecture name"
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

            {/* SUBJECT */}

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

          </div>

          {/* ATTENDANCE BUTTONS */}

          <div className="flex gap-5 mt-8">

            <button
              onClick={() =>
                markAttendance(
                  "Present"
                )
              }
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              <FaCheckCircle />
              Present
            </button>

            <button
              onClick={() =>
                markAttendance(
                  "Absent"
                )
              }
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              <FaTimesCircle />
              Absent
            </button>

          </div>

        </div>
      )}

      {/* ATTENDANCE TABLE */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800 text-white">

            <tr>

              <th className="p-4 text-left">
                S.No
              </th>

              <th className="p-4 text-left">
                Lecture
              </th>

              <th className="p-4 text-left">
                Subject
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : attendance.length > 0 ? (

              attendance.map(
                (item, index) => (

                  <tr
                    key={index}
                    className="border-b dark:border-slate-800"
                  >

                    <td className="p-4 dark:text-white">
                      {index + 1}
                    </td>

                    <td className="p-4 dark:text-white">
                      {item.lectureName}
                    </td>

                    <td className="p-4 dark:text-white">
                      {item.subject}
                    </td>

                    <td className="p-4 dark:text-white">

                      {new Date(
                        item.date
                      ).toLocaleDateString()}

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          item.status ===
                          "Present"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>
                )
              )

            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="p-6 text-center dark:text-white"
                >
                  No Attendance Found
                </td>

              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default StudentAttendance;