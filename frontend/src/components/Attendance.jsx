import React, { useState } from "react";
import {
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";

function Attendance() {

  const [searchTerm, setSearchTerm] = useState("");

  // Dummy attendance data
  const attendanceData = [
    { date: "2026-05-01", subject: "JavaScript", status: "Present" },
    { date: "2026-05-02", subject: "React JS", status: "Absent" },
    { date: "2026-05-03", subject: "Node JS", status: "Present" },
    { date: "2026-05-04", subject: "MongoDB", status: "Present" },
    { date: "2026-05-05", subject: "Express JS", status: "Absent" },
    { date: "2026-05-06", subject: "Tailwind CSS", status: "Present" },
    { date: "2026-05-07", subject: "DSA", status: "Present" },
    { date: "2026-05-08", subject: "Python", status: "Absent" },
    { date: "2026-05-09", subject: "DBMS", status: "Present" },
    { date: "2026-05-10", subject: "Operating System", status: "Present" },
    { date: "2026-05-11", subject: "Computer Network", status: "Absent" },
    { date: "2026-05-12", subject: "Machine Learning", status: "Present" },
    { date: "2026-05-13", subject: "AI", status: "Present" },
    { date: "2026-05-14", subject: "Java", status: "Present" },
    { date: "2026-05-15", subject: "C++", status: "Absent" },
    { date: "2026-05-16", subject: "HTML", status: "Present" },
    { date: "2026-05-17", subject: "CSS", status: "Present" },
    { date: "2026-05-18", subject: "Bootstrap", status: "Present" },
    { date: "2026-05-19", subject: "Redux", status: "Absent" },
  ];

  // Filtered Data
  const filteredData = attendanceData.filter((item) =>
    item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Attendance Calculation
  const totalLectures = attendanceData.length;

  const presentLectures = attendanceData.filter(
    (item) => item.status === "Present"
  ).length;

  const absentLectures = attendanceData.filter(
    (item) => item.status === "Absent"
  ).length;

  const percentage = (
    (presentLectures / totalLectures) *
    100
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 dark:text-white p-4 sm:p-6 lg:p-10">

      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-white mb-10">

        <div className="flex items-center gap-4">

          <FaClipboardCheck className="text-5xl sm:text-6xl" />

          <div>

            <h1 className="text-3xl sm:text-5xl font-bold">
              Student Attendance
            </h1>

            <p className="mt-2 text-sm sm:text-lg text-green-100">
              Monthly Attendance Report
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg text-gray-500 dark:text-gray-400">
            Total Lectures
          </h2>

          <p className="text-4xl font-bold mt-3">
            {totalLectures}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg text-gray-500 dark:text-gray-400">
            Present
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {presentLectures}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg text-gray-500 dark:text-gray-400">
            Absent
          </h2>

          <p className="text-4xl font-bold text-red-600 mt-3">
            {absentLectures}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg text-gray-500 dark:text-gray-400">
            Attendance %
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-3">
            {percentage}%
          </p>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">

        {/* TOP BAR */}

        <div className="p-6 border-b dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">

          <h2 className="text-2xl sm:text-3xl font-bold">
            Attendance Record
          </h2>

          {/* SEARCH BOX */}

          <div className="relative w-full sm:w-96">

            <FaSearch className="absolute top-3 right-7 text-gray-400" />

            <input
              type="text"
              placeholder="Search by date, subject or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left">

            <thead className="bg-gray-200 dark:bg-slate-800">

              <tr>

                <th className="py-4 px-6 text-lg font-semibold">
                  #
                </th>

                <th className="px-6 text-lg font-semibold">
                  Date
                </th>

                <th className="px-6 text-lg font-semibold">
                  Subject
                </th>

                <th className="px-6 text-lg font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >

                    <td className="py-5 px-6 font-semibold">
                      {index + 1}
                    </td>

                    <td className="px-6">
                      {item.date}
                    </td>

                    <td className="px-6">
                      {item.subject}
                    </td>

                    <td className="px-6">

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                        ${
                          item.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >

                        {item.status === "Present" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaTimesCircle />
                        )}

                        {item.status}
                      </div>
                    </td>
                  </tr>
                ))

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-10 text-xl text-gray-500"
                  >
                    No attendance record found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;